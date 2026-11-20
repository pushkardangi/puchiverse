import type { ApiErrorBody, ApiErrorCode } from "@/lib/relationship-types";
import type { PuchiHistoryPage, PuchiSummary } from "@/lib/puchi-types";

export class PuchiRequestError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new PuchiRequestError("server_error", "We couldn't reach the server. Please try again.");
  }

  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error = body && typeof body === "object" && "error" in body
      ? (body as ApiErrorBody).error
      : null;
    throw new PuchiRequestError(
      error?.code ?? "server_error",
      error?.message ?? "Something went wrong. Please try again.",
    );
  }
  return body as T;
}

export const fetchPuchiSummary = (signal?: AbortSignal) =>
  call<{ success: true; data: PuchiSummary }>("/api/puchis/summary", { signal });

export const sendPuchiRequest = (idempotencyKey: string) =>
  call<{ success: true; data: PuchiSummary }>("/api/puchis", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idempotencyKey }),
  });

export const fetchPuchiHistory = (page: number, limit: number, signal?: AbortSignal) =>
  call<{ success: true; data: PuchiHistoryPage }>(
    `/api/puchis/history?page=${page}&limit=${limit}`,
    { signal },
  );
