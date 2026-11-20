import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { PuchiError, getPuchiSummary } from "@/services/puchi.service";

export async function GET() {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    return apiJson({ success: true, data: await getPuchiSummary(current.user) });
  } catch (error) {
    if (error instanceof PuchiError) return apiError(error.code, error.message);
    console.error("Loading puchi summary failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
