import "server-only";

import type { ApiErrorBody, ApiErrorCode } from "@/lib/relationship-types";

const STATUS: Record<ApiErrorCode, number> = {
  unauthenticated: 401,
  invalid_request: 400,
  invalid_username: 400,
  rate_limited: 429,
  already_connected: 409,
  request_exists: 409,
  incoming_exists: 409,
  unavailable: 404,
  not_found: 404,
  server_error: 500,
};

const NO_STORE = { "Cache-Control": "no-store" };

export function apiJson<T>(body: T, status = 200, headers: Record<string, string> = {}) {
  return Response.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  extra: { requestId?: string; headers?: Record<string, string> } = {},
) {
  const body: ApiErrorBody = { error: { code, message, requestId: extra.requestId } };
  return apiJson(body, STATUS[code], extra.headers);
}
