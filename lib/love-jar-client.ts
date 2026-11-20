import type { ApiErrorBody, ApiErrorCode } from "@/lib/relationship-types";
import type { LoveJarNote } from "@/lib/love-jar-types";

export class LoveJarRequestError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function call<T>(init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch("/api/love-jar", {
      ...init,
      cache: "no-store",
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") throw error;
    throw new LoveJarRequestError(
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
    throw new LoveJarRequestError(
      error?.code ?? "server_error",
      error?.message ?? "Something went wrong. Please try again.",
    );
  }
  return body as T;
}

export const fetchLoveJarNotes = (signal?: AbortSignal) =>
  call<{ data: LoveJarNote[] }>({ signal });

export const addLoveJarNote = (note: string) =>
  call<{ success: true }>({
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ note }),
  });
