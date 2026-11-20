import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { PuchiError, getPuchiHistory } from "@/services/puchi.service";

function parsePageValue(value: string | null, fallback: number, maximum: number) {
  if (value === null) return fallback;
  if (!/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) && parsed <= maximum ? parsed : null;
}

export async function GET(request: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;

    const params = new URL(request.url).searchParams;
    const page = parsePageValue(params.get("page"), 1, 100_000);
    const limit = parsePageValue(params.get("limit"), 20, 50);
    if (page === null || limit === null) {
      return apiError("invalid_request", "Choose a valid history page.");
    }

    return apiJson({
      success: true,
      data: await getPuchiHistory(current.user, page, limit),
    });
  } catch (error) {
    if (error instanceof PuchiError) return apiError(error.code, error.message);
    console.error("Loading puchi history failed");
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
