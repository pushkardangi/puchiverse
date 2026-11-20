import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import {
  acknowledgeHug,
  getHugSelection,
  listPendingHugs,
  sendVirtualHug,
  VirtualHugError,
} from "@/services/virtual-hug.service";

async function handle(request: Request, method: "GET" | "POST" | "PATCH") {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    if (method === "GET") {
      if (new URL(request.url).searchParams.get("view") === "selection") {
        return apiJson({ data: await getHugSelection(current.user) });
      }
      return apiJson({ data: await listPendingHugs(current.user) });
    }

    const body: unknown = await request.json().catch(() => null);
    if (method === "POST") {
      if (!body || typeof body !== "object" || !("gifFileName" in body) ||
          typeof body.gifFileName !== "string") {
        return apiError("invalid_request", "Please select an available hug.");
      }
      return apiJson({ data: await sendVirtualHug(current.user, body.gifFileName) }, 201);
    }
    if (
      !body ||
      typeof body !== "object" ||
      !("id" in body) ||
      typeof body.id !== "string"
    ) {
      return apiError("invalid_request", "Please provide a valid hug ID.");
    }
    await acknowledgeHug(current.user, body.id);
    return apiJson({ success: true });
  } catch (error) {
    if (error instanceof VirtualHugError)
      return apiError(error.code, error.message);
    console.error("Virtual hug request failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");
export const PATCH = (request: Request) => handle(request, "PATCH");
