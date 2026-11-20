import "server-only";

import { auth } from "@clerk/nextjs/server";
import type { Types } from "mongoose";
import { apiError } from "@/lib/api-response";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export type CurrentUser = { _id: Types.ObjectId; clerkId: string };

type CurrentUserResult = { ok: true; user: CurrentUser } | { ok: false; response: Response };

// Resolves the caller from the Clerk server session only; nothing from the request is trusted.
export async function getAuthenticatedUser(): Promise<CurrentUserResult> {
  const { userId } = await auth();
  const unauthenticated = () => ({
    ok: false as const,
    response: apiError("unauthenticated", "Please sign in to continue."),
  });
  if (!userId) return unauthenticated();

  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId, deletedAt: null, mergedIntoClerkId: null })
    .select("_id clerkId")
    .lean();
  if (!user) return unauthenticated();
  return { ok: true, user: { _id: user._id, clerkId: user.clerkId } };
}
