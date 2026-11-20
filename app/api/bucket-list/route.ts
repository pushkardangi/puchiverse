import "server-only";

import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { parseBucketListInput } from "@/lib/bucket-list-types";
import {
  BucketListError,
  createBucketListItem,
  deleteBucketListItem,
  listBucketListItems,
  toggleBucketListItem,
  updateBucketListItem,
} from "@/services/bucket-list.service";

async function handle(
  request: Request,
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    if (method === "GET")
      return apiJson({ data: await listBucketListItems(current.user) });

    const body: unknown = await request.json().catch(() => null);
    if (!body || typeof body !== "object")
      return apiError(
        "invalid_request",
        "Please provide a valid bucket list item.",
      );
    const record = body as Record<string, unknown>;

    if (method === "POST") {
      const input = parseBucketListInput(record.item);
      if (!input)
        return apiError(
          "invalid_request",
          "Please provide a valid bucket list item.",
        );
      return apiJson(
        { data: await createBucketListItem(current.user, input) },
        201,
      );
    }

    if (typeof record.id !== "string")
      return apiError(
        "invalid_request",
        "Please provide a bucket list item ID.",
      );

    if (method === "DELETE") {
      await deleteBucketListItem(current.user, record.id);
      return apiJson({ success: true });
    }
    if (method === "PATCH")
      return apiJson({
        data: await toggleBucketListItem(current.user, record.id),
      });

    const input = parseBucketListInput(record.item);
    if (!input)
      return apiError(
        "invalid_request",
        "Please provide a valid bucket list item.",
      );
    return apiJson({
      data: await updateBucketListItem(current.user, record.id, input),
    });
  } catch (error) {
    if (error instanceof BucketListError)
      return apiError(error.code, error.message);
    console.error("Bucket list request failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}

export const GET = (request: Request) => handle(request, "GET");
export const POST = (request: Request) => handle(request, "POST");
export const PUT = (request: Request) => handle(request, "PUT");
export const PATCH = (request: Request) => handle(request, "PATCH");
export const DELETE = (request: Request) => handle(request, "DELETE");
