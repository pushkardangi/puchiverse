import "server-only";

import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export async function requireActiveUser() {
  await connection();
  const { userId } = await auth.protect();
  await connectToDatabase();
  const user = await User.findOne({ clerkId: userId }).select("deletedAt").lean();
  if (user?.deletedAt) {
    notFound();
  }
}
