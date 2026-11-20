import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { PuchiError, createPuchi } from "@/services/puchi.service";

export async function POST(request: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;

    const body: unknown = await request.json().catch(() => null);
    const idempotencyKey =
      body && typeof body === "object" && "idempotencyKey" in body
        ? body.idempotencyKey
        : null;
    if (typeof idempotencyKey !== "string") {
      return apiError("invalid_request", "Please try sending your puchi again.");
    }

    const result = await createPuchi(current.user, idempotencyKey);
    return apiJson({ success: true, data: result.summary }, result.created ? 201 : 200);
  } catch (error) {
    if (error instanceof PuchiError) return apiError(error.code, error.message);
    console.error("Sending puchi failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
