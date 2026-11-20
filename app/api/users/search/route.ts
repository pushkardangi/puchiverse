import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { checkRateLimit, SEARCH_RATE_LIMIT } from "@/lib/rate-limit";
import { normalizeUsername, USERNAME_HELP } from "@/lib/username";
import { RelationshipError } from "@/services/relationship.service";
import { searchUserByUsername } from "@/services/user.service";

export async function GET(request: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;

    const limit = checkRateLimit(`search:${current.user._id}`, SEARCH_RATE_LIMIT);
    if (!limit.allowed) {
      return apiError("rate_limited", "Too many searches. Please wait a moment and try again.", {
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      });
    }

    const username = normalizeUsername(new URL(request.url).searchParams.get("username"));
    if (!username) return apiError("invalid_username", USERNAME_HELP);

    return apiJson(await searchUserByUsername(current.user, username));
  } catch (error) {
    if (error instanceof RelationshipError) return apiError(error.code, error.message);
    console.error("Username search failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
