import type {
  ApiErrorBody,
  ApiErrorCode,
  RelationshipState,
  UserSearchResponse,
} from "@/lib/relationship-types";

export class ApiRequestError extends Error {
  readonly code: ApiErrorCode;
  readonly requestId?: string;

  constructor(code: ApiErrorCode, message: string, requestId?: string) {
    super(message);
    this.code = code;
    this.requestId = requestId;
  }
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, { ...init, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new ApiRequestError("server_error", "We couldn't reach the server. Please try again.");
  }

  const body = (await response.json().catch(() => null)) as T | ApiErrorBody | null;
  if (!response.ok) {
    const error = body && typeof body === "object" && "error" in body ? body.error : null;
    throw new ApiRequestError(
      error?.code ?? "server_error",
      error?.message ?? "Something went wrong. Please try again.",
      error?.requestId,
    );
  }
  return body as T;
}

export const fetchRelationshipState = (signal?: AbortSignal) =>
  call<RelationshipState>("/api/relationships/me", { signal });

export const searchUsername = (username: string, signal?: AbortSignal) =>
  call<UserSearchResponse>(`/api/users/search?username=${encodeURIComponent(username)}`, { signal });

export const sendRelationshipRequest = (receiverId: string) =>
  call<{ request: { id: string; status: string } }>("/api/relationship-requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ receiverId }),
  });

export const acceptRelationshipRequest = (requestId: string) =>
  call<{ status: "accepted" }>(`/api/relationship-requests/${encodeURIComponent(requestId)}/accept`, {
    method: "POST",
  });
