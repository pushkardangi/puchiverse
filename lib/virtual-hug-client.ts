import type { ApiErrorBody, ApiErrorCode } from "@/lib/relationship-types";
import type { VirtualHug } from "@/lib/virtual-hug-types";

export class VirtualHugRequestError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function call<T>(init?: RequestInit, query = ""): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`/api/virtual-hugs${query}`, { ...init, cache: "no-store" });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError")
      throw error;
    throw new VirtualHugRequestError(
      "server_error",
      "We couldn't reach the server. Please try again.",
    );
  }
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const error =
      body && typeof body === "object" && "error" in body
        ? (body as ApiErrorBody).error
        : null;
    throw new VirtualHugRequestError(
      error?.code ?? "server_error",
      error?.message ?? "Something went wrong. Please try again.",
    );
  }
  return body as T;
}

export const fetchPendingHugs = (signal?: AbortSignal) =>
  call<{ data: VirtualHug[] }>({ signal });
export const fetchHugSelection = () =>
  call<{ data: { gifFileNames: string[]; outgoingPending: boolean } }>(undefined, "?view=selection");
export const sendHug = (gifFileName: string) => call<{ data: VirtualHug }>({
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ gifFileName }),
});
export const acknowledgeHug = (id: string) =>
  call<{ success: true }>({
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
