import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { parseCoupleProfileUpdate } from "@/lib/couple-profile-types";
import { getAuthenticatedUser } from "@/lib/current-user";
import { CoupleProfileNotConnectedError, getCoupleProfile, updateCoupleProfile } from "@/services/couple-profile.service";

async function handle(request?: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    if (!request) return apiJson({ data: await getCoupleProfile(current.user) });
    const body: unknown = await request.json().catch(() => null);
    const update = parseCoupleProfileUpdate(body);
    if (!update) return apiError("invalid_request", "Please provide valid profile details.");
    return apiJson({ data: await updateCoupleProfile(current.user, update) });
  } catch (error) {
    if (error instanceof CoupleProfileNotConnectedError) return apiError("not_connected", error.message);
    console.error("Couple profile request failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}

export const GET = () => handle();
export const PATCH = (request: Request) => handle(request);
