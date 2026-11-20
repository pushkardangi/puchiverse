import "server-only";

import mongoose, { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import { prepareRelationshipDb } from "@/lib/relationship-db";
import Relationship from "@/models/Relationship";
import User from "@/models/User";
import { hasActiveRelationship, memberPair, pendingBetween, RelationshipError } from "@/services/relationship.service";

const isDuplicateKey = (error: unknown) =>
  error instanceof mongoose.mongo.MongoServerError && error.code === 11000;

async function duplicateError(me: Types.ObjectId, other: Types.ObjectId) {
  const pending = await Relationship.findOne(pendingBetween(me, other)).select("requestedBy").lean();
  if (pending && !pending.requestedBy.equals(me)) {
    return new RelationshipError(
      "incoming_exists",
      "This person has already sent you a request.",
      String(pending._id),
    );
  }
  return new RelationshipError("request_exists", "You've already sent a relationship request to this person.");
}

export async function createRelationshipRequest(me: CurrentUser, receiverId: string) {
  await prepareRelationshipDb();

  if (!Types.ObjectId.isValid(receiverId)) {
    throw new RelationshipError("invalid_request", "That request couldn't be sent.");
  }
  const receiver = new Types.ObjectId(receiverId);
  if (receiver.equals(me._id)) {
    throw new RelationshipError("invalid_request", "You can't send a request to yourself.");
  }
  if (await hasActiveRelationship([me._id])) {
    throw new RelationshipError("already_connected", "You're already connected with someone.");
  }

  const target = await User.exists({
    _id: receiver,
    deletedAt: null,
    mergedIntoClerkId: null,
    discoverable: { $ne: false },
  });
  if (!target || (await hasActiveRelationship([receiver]))) {
    throw new RelationshipError("unavailable", "We couldn't send a request to this person.");
  }

  const existing = await Relationship.exists(pendingBetween(me._id, receiver));
  if (existing) throw await duplicateError(me._id, receiver);

  try {
    const request = await Relationship.create({
      requestedBy: me._id,
      members: memberPair(me._id, receiver),
    });
    return { id: String(request._id), status: "pending" as const };
  } catch (error) {
    if (isDuplicateKey(error)) throw await duplicateError(me._id, receiver);
    throw error;
  }
}

async function cancelStale(requestId: Types.ObjectId) {
  await Relationship.updateOne(
    { _id: requestId, status: "pending" },
    { $set: { status: "cancelled", respondedAt: new Date() } },
  );
}

// Only the receiver can accept. Both users are revalidated inside the transaction,
// and the unique active-member index on relationships backstops concurrent accepts.
export async function acceptRelationshipRequest(me: CurrentUser, requestId: string) {
  const db = await prepareRelationshipDb();
  if (!Types.ObjectId.isValid(requestId)) {
    throw new RelationshipError("not_found", "We couldn't find that request.");
  }
  const id = new Types.ObjectId(requestId);
  const session = await db.startSession();

  try {
    await session.withTransaction(async () => {
      const now = new Date();
      const request = await Relationship.findOne({
        _id: id,
        members: me._id,
        requestedBy: { $ne: me._id },
        status: "pending",
      })
        .select("members")
        .session(session)
        .lean();
      if (!request) throw new RelationshipError("not_found", "We couldn't find that request.");

      const activeUsers = await User.countDocuments({
        _id: { $in: request.members },
        deletedAt: null,
        mergedIntoClerkId: null,
      }).session(session);
      if (activeUsers !== 2) {
        throw new RelationshipError("unavailable", "This request is no longer available.");
      }
      if (await hasActiveRelationship(request.members, session)) {
        throw new RelationshipError("already_connected", "This request is no longer available.");
      }

      const accepted = await Relationship.updateOne(
        { _id: id, status: "pending" },
        { $set: { status: "active", respondedAt: now } },
        { session },
      );
      if (accepted.modifiedCount !== 1) throw new RelationshipError("not_found", "We couldn't find that request.");

      await Relationship.updateMany(
        { _id: { $ne: id }, status: "pending", members: { $in: request.members } },
        { $set: { status: "cancelled", respondedAt: now } },
        { session },
      );
    });
    return { status: "accepted" as const };
  } catch (error) {
    if (isDuplicateKey(error)) {
      await cancelStale(id);
      throw new RelationshipError("already_connected", "This request is no longer available.");
    }
    if (error instanceof RelationshipError && (error.code === "unavailable" || error.code === "already_connected")) {
      await cancelStale(id);
    }
    throw error;
  } finally {
    await session.endSession();
  }
}
