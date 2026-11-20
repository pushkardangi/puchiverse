import "server-only";

import mongoose, { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import { preparePuchiDb } from "@/lib/puchi-db";
import { displayNameOf } from "@/lib/public-profile";
import type { ApiErrorCode } from "@/lib/relationship-types";
import type { PuchiHistoryPage, PuchiSummary } from "@/lib/puchi-types";
import PuchiTransaction from "@/models/PuchiTransaction";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class PuchiError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

type ActivePuchiContext = {
  coupleId: Types.ObjectId;
  partner: {
    _id: Types.ObjectId;
    firstName?: string | null;
    lastName?: string | null;
    username?: string | null;
    avatar?: string | null;
  };
};

async function activePuchiContext(userId: Types.ObjectId): Promise<ActivePuchiContext> {
  await preparePuchiDb();
  const relationship = await Relationship.findOne({ members: userId, status: "active" })
    .select("_id members")
    .lean();
  const partnerId = relationship?.members.find((member) => !member.equals(userId));
  const partner = partnerId
    ? await User.findOne({
        _id: partnerId,
        deletedAt: null,
        mergedIntoClerkId: null,
      })
        .select("_id firstName lastName username avatar")
        .lean()
    : null;

  if (!relationship || !partner) {
    throw new PuchiError("not_connected", "Connect with your partner to use puchis.");
  }
  return { coupleId: relationship._id, partner };
}

async function summaryFor(coupleId: Types.ObjectId, userId: Types.ObjectId): Promise<PuchiSummary> {
  type AggregateResult = PuchiSummary & { _id: null };
  const [result] = await PuchiTransaction.aggregate<AggregateResult>([
    { $match: { coupleId } },
    {
      $group: {
        _id: null,
        totalPuchis: { $sum: 1 },
        sentByMe: { $sum: { $cond: [{ $eq: ["$senderId", userId] }, 1, 0] } },
        receivedByMe: { $sum: { $cond: [{ $eq: ["$receiverId", userId] }, 1, 0] } },
      },
    },
  ]);
  return result
    ? {
        totalPuchis: result.totalPuchis,
        sentByMe: result.sentByMe,
        receivedByMe: result.receivedByMe,
      }
    : { totalPuchis: 0, sentByMe: 0, receivedByMe: 0 };
}

export async function getPuchiSummary(user: CurrentUser): Promise<PuchiSummary> {
  const context = await activePuchiContext(user._id);
  return summaryFor(context.coupleId, user._id);
}

export async function createPuchi(user: CurrentUser, idempotencyKey: string) {
  const context = await activePuchiContext(user._id);

  if (!/^[A-Za-z0-9._:-]{8,128}$/.test(idempotencyKey)) {
    throw new PuchiError("invalid_request", "Please try sending your puchi again.");
  }

  let created = true;
  try {
    await PuchiTransaction.create({
      coupleId: context.coupleId,
      senderId: user._id,
      receiverId: context.partner._id,
      idempotencyKey,
    });
  } catch (error) {
    if (!(error instanceof mongoose.mongo.MongoServerError) || error.code !== 11000) throw error;
    const existing = await PuchiTransaction.exists({
      coupleId: context.coupleId,
      senderId: user._id,
      idempotencyKey,
    });
    if (!existing) throw error;
    created = false;
  }

  return {
    created,
    summary: await summaryFor(context.coupleId, user._id),
  };
}

export async function getPuchiHistory(
  user: CurrentUser,
  page: number,
  limit: number,
): Promise<PuchiHistoryPage> {
  const context = await activePuchiContext(user._id);
  const total = await PuchiTransaction.countDocuments({ coupleId: context.coupleId });
  const maxPage = Math.max(1, Math.ceil(total / limit));
  const transactions =
    page > maxPage
      ? []
      : await PuchiTransaction.find({ coupleId: context.coupleId })
          .sort({ createdAt: -1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .select("_id senderId createdAt")
          .lean();
  const senders = await User.find({
    _id: { $in: transactions.map((transaction) => transaction.senderId) },
    deletedAt: null,
    mergedIntoClerkId: null,
  })
    .select("_id firstName lastName username avatar")
    .lean();
  const sendersById = new Map(senders.map((sender) => [String(sender._id), sender]));

  return {
    items: transactions.map((transaction) => {
      const senderId = String(transaction.senderId);
      const sender = sendersById.get(senderId);
      return {
        id: String(transaction._id),
        senderName: sender ? displayNameOf(sender) : "Someone special",
        senderAvatar: sender?.avatar ?? null,
        sentByMe: transaction.senderId.equals(user._id),
        createdAt: transaction.createdAt.toISOString(),
      };
    }),
    partnerDisplayName: displayNameOf(context.partner),
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}
