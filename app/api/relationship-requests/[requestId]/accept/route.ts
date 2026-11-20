import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { checkRateLimit, REQUEST_RATE_LIMIT } from "@/lib/rate-limit";
import { acceptRelationshipRequest } from "@/services/relationship-request.service";
import { RelationshipError } from "@/services/relationship.service";

export async function POST(_request: Request, ctx: { params: Promise<{ requestId: string }> }) {
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

    const { requestId } = await ctx.params;
    return apiJson(await acceptRelationshipRequest(current.user, requestId));
  } catch (error) {
    if (error instanceof RelationshipError) return apiError(error.code, error.message);
    console.error("Accepting relationship request failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
