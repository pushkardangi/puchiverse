import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { parseEventInput } from "@/lib/event-types";
import {
  createEvent,
  deleteEvent,
  EventError,
  listEvents,
  updateEvent,
} from "@/services/event.service";

async function handle(
  request: Request,
  method: "GET" | "POST" | "PUT" | "DELETE",
) {
  await connection();
  try {
    const current = await getAuthenticatedUser();

    if (!current.ok) return current.response;
    if (method === "GET")
      return apiJson({ data: await listEvents(current.user) });
    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object")
      return apiError("invalid_request", "Please provide a valid event.");

    const record = body as Record<string, unknown>;
    if (method === "DELETE") {
      if (typeof record.id !== "string")
        return apiError("invalid_request", "Please provide an event ID.");
      await deleteEvent(current.user, record.id);
      return apiJson({ success: true });
    }

    const input = parseEventInput(record.event);
    if (!input)
      return apiError("invalid_request", "Please provide a valid event.");
    if (method === "POST")
      return apiJson({ data: await createEvent(current.user, input) }, 201);
    if (typeof record.id !== "string")
      return apiError("invalid_request", "Please provide an event ID.");

    return apiJson({ data: await updateEvent(current.user, record.id, input) });
  } catch (error) {
    if (error instanceof EventError) return apiError(error.code, error.message);
    console.error("Shared events request failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");
export const PUT = (request: Request) => handle(request, "PUT");
export const DELETE = (request: Request) => handle(request, "DELETE");
