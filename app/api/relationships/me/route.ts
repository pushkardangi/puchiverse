import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { getRelationshipState } from "@/services/relationship.service";

export async function GET() {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    return apiJson(await getRelationshipState(current.user._id));
  } catch {
    console.error("Loading relationship state failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
