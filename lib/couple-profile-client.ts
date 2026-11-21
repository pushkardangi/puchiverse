import { isCoupleProfileData, type CoupleProfileData, type CoupleProfileUpdate } from "@/lib/couple-profile-types";
import type { ApiErrorBody } from "@/lib/relationship-types";

async function request(init?: RequestInit): Promise<CoupleProfileData> {
  let response: Response;
  try {
    response = await fetch("/api/couple-profile", { ...init, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new Error("We couldn't reach the server. Please try again.");
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = body && typeof body === "object" && "error" in body ? (body as ApiErrorBody).error : null;
    throw new Error(error?.message ?? "Something went wrong. Please try again.");
  }
  if (!body || typeof body !== "object" || !("data" in body) || !isCoupleProfileData(body.data))
    throw new Error("Could not read your couple profile. Please try again.");
  return body.data;
}

export const fetchCoupleProfile = (signal?: AbortSignal) => request({ signal });
export const saveCoupleProfile = (update: CoupleProfileUpdate) => request({
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(update),
});
