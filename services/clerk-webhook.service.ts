import "server-only";

import type { UserJSON, WebhookEvent as ClerkWebhookEvent } from "@clerk/nextjs/server";
import type { ClientSession } from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import WebhookEvent from "@/models/WebhookEvent";

type UserEvent = Extract<
  ClerkWebhookEvent,
  { type: "user.created" | "user.updated" | "user.deleted" | "user.merged" }
>;

export function isUserEvent(event: ClerkWebhookEvent): event is UserEvent {
  return event.type === "user.created" || event.type === "user.updated" ||
    event.type === "user.deleted" || event.type === "user.merged";
}

async function syncUser(user: UserJSON, timestamp: number, session: ClientSession) {
  if (!user.id || !Number.isFinite(user.updated_at) || !Number.isFinite(timestamp) ||
      !Array.isArray(user.email_addresses)) {
    throw new Error("Invalid Clerk user payload");
  }
  const primaryEmail = user.email_addresses.find(
    (address) => address.id === user.primary_email_address_id,
  )?.email_address;
  if (user.primary_email_address_id && !primaryEmail) {
    throw new Error("Clerk primary email is missing from user payload");
  }

  await User.updateOne(
    { clerkId: user.id },
    { $setOnInsert: { clerkId: user.id } },
    { upsert: true, session },
  );
  await User.updateOne(
    {
      clerkId: user.id,
      deletedAt: null,
      $or: [
        { clerkUpdatedAt: null },
        { clerkUpdatedAt: { $lt: user.updated_at } },
        {
          clerkUpdatedAt: user.updated_at,
          $or: [{ clerkEventTimestamp: null }, { clerkEventTimestamp: { $lt: timestamp } }],
        },
      ],
    },
    {
      $set: {
        email: primaryEmail?.trim().toLowerCase() ?? null,
        emailAddresses: user.email_addresses.map((address) => address.email_address.trim().toLowerCase()),
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username,
        avatar: user.image_url,
        clerkUpdatedAt: user.updated_at,
        clerkEventTimestamp: timestamp,
      },
    },
    { session, runValidators: true },
  );
}

async function markDeleted(clerkId: string, session: ClientSession, mergedIntoClerkId?: string) {
  if (!clerkId || mergedIntoClerkId === clerkId) {
    throw new Error("Invalid deleted Clerk user ID");
  }
  await User.updateOne(
    { clerkId },
    { $setOnInsert: { clerkId, deletedAt: new Date() } },
    { upsert: true, session },
  );
  if (mergedIntoClerkId) {
    const user = await User.findOne({ clerkId }).session(session);
    if (user?.mergedIntoClerkId && user.mergedIntoClerkId !== mergedIntoClerkId) {
      throw new Error("Conflicting Clerk user merge");
    }
  }
  await User.updateOne(
    { clerkId, deletedAt: null },
    { $currentDate: { deletedAt: true } },
    { session },
  );
  if (mergedIntoClerkId) {
    await User.updateOne({ clerkId }, { $set: { mergedIntoClerkId } }, { session });
  }
}

export async function processClerkWebhook(eventId: string, event: UserEvent): Promise<void> {
  const mongoose = await connectToDatabase();
  await Promise.all([User.init(), WebhookEvent.init()]);
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      await WebhookEvent.create([{ eventId, eventType: event.type, status: "processing" }], { session });

      switch (event.type) {
        case "user.created":
        case "user.updated":
          await syncUser(event.data, event.timestamp, session);
          break;
        case "user.deleted":
          if (!event.data.id) {
            throw new Error("Clerk deletion payload has no user ID");
          }
          await markDeleted(event.data.id, session);
          break;
        case "user.merged":
          if (!event.data.user?.id || !event.data.deleted_user?.id) {
            throw new Error("Clerk merge payload has missing user IDs");
          }
          await syncUser(event.data.user, event.timestamp, session);
          await markDeleted(event.data.deleted_user.id, session, event.data.user.id);
          break;
      }

      await WebhookEvent.updateOne(
        { eventId },
        { $set: { status: "processed", processedAt: new Date() } },
        { session },
      );
    });
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000) {
      const processed = await WebhookEvent.exists({ eventId, status: "processed" });
      if (processed) return;
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
