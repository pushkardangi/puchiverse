import { connection } from "next/server";
import { apiError, apiJson } from "@/lib/api-response";
import { getAuthenticatedUser } from "@/lib/current-user";
import { parseLoveJarNote } from "@/lib/love-jar-types";
import {
  createLoveJarNote,
  listLoveJarNotes,
  LoveJarError,
} from "@/services/love-jar.service";

export async function GET() {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;
    return apiJson({ data: await listLoveJarNotes(current.user) });
  } catch (error) {
    if (error instanceof LoveJarError) return apiError(error.code, error.message);
    console.error("Loading love jar failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}

export async function POST(request: Request) {
  await connection();
  try {
    const current = await getAuthenticatedUser();
    if (!current.ok) return current.response;

    const body: unknown = await request.json().catch(() => null);
    const note = parseLoveJarNote(body);
    if (!note) {
      return apiError(
        "invalid_request",
        "Write a note of up to 240 characters to add to your jar.",
      );
    }

    await createLoveJarNote(current.user, note);
    return apiJson({ success: true }, 201);
  } catch (error) {
    if (error instanceof LoveJarError) return apiError(error.code, error.message);
    console.error("Adding love jar note failed", error);
    return apiError("server_error", "Something went wrong. Please try again.");
  }
}
