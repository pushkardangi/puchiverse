import type { ApiErrorBody, ApiErrorCode } from "@/lib/relationship-types";
import type { BucketListInput, BucketListItem } from "@/lib/bucket-list-types";

export class BucketListRequestError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function request<T>(
  method: string,
  body?: object,
  signal?: AbortSignal,
): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/bucket-list", {
      method,
      signal,
      cache: "no-store",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new BucketListRequestError(
      "server_error",
      "We couldn't reach the server. Please try again.",
    );
  }

  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      result && typeof result === "object" && "error" in result
        ? (result as ApiErrorBody).error
        : null;
    throw new BucketListRequestError(
      error?.code ?? "server_error",
      error?.message ?? "Something went wrong. Please try again.",
    );
  }
  return result as T;
}

export const fetchBucketList = (signal?: AbortSignal) =>
  request<{ data: BucketListItem[] }>("GET", undefined, signal);

export const createBucketListItem = (item: BucketListInput) =>
  request<{ data: BucketListItem }>("POST", { item });

export const updateBucketListItem = (id: string, item: BucketListInput) =>
  request<{ data: BucketListItem }>("PUT", { id, item });

export const toggleBucketListItem = (id: string) =>
  request<{ data: BucketListItem }>("PATCH", { id });

export const deleteBucketListItem = (id: string) =>
  request<{ success: true }>("DELETE", { id });
