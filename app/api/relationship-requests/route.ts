import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { checkRateLimit, REQUEST_RATE_LIMIT } from "@/lib/rate-limit";
import { createRelationshipRequest } from "@/services/relationship-request.service";
import { RelationshipError } from "@/services/relationship.service";

export async function POST(request: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;

    const limit = checkRateLimit(`request:${current.user._id}`, REQUEST_RATE_LIMIT);
    if (!limit.allowed) {
      return apiError("rate_limited", "Too many requests. Please wait a moment and try again.", {
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      });
    }

    const body: unknown = await request.json().catch(() => null);
    const receiverId = body && typeof body === "object" ? (body as { receiverId?: unknown }).receiverId : null;
    if (typeof receiverId !== "string" || !/^[a-f\d]{24}$/i.test(receiverId)) {
      return apiError("invalid_request", "That request couldn't be sent.");
    }

    return apiJson({ request: await createRelationshipRequest(current.user, receiverId) }, 201);
  } catch (error) {
    if (error instanceof RelationshipError) {
      return apiError(error.code, error.message, { requestId: error.requestId });
    }
    console.error("Relationship request failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
