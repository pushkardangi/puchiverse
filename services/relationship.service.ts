import "server-only";

import { Types, type ClientSession } from "mongoose";
import { toRelationshipUser } from "@/lib/public-profile";
import { prepareRelationshipDb } from "@/lib/relationship-db";
import type { ApiErrorCode, PendingRequest, RelationshipState } from "@/lib/relationship-types";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class RelationshipError extends Error {
  readonly code: ApiErrorCode;
  readonly requestId?: string;

  constructor(code: ApiErrorCode, message: string, requestId?: string) {
    super(message);
    this.code = code;
    this.requestId = requestId;
  }
}

// Canonical (ascending) member pair, so a pair of users always maps to the same array.
export function memberPair(a: Types.ObjectId | string, b: Types.ObjectId | string): [Types.ObjectId, Types.ObjectId] {
  const [first, second] = [String(a), String(b)].sort();
  return [new Types.ObjectId(first), new Types.ObjectId(second)];
}

export function pendingBetween(a: Types.ObjectId | string, b: Types.ObjectId | string) {
  const [first, second] = memberPair(a, b);
  return { "members.0": first, "members.1": second, status: "pending" as const };
}

export async function hasActiveRelationship(
  userIds: Array<Types.ObjectId | string>,
  session?: ClientSession,
): Promise<boolean> {
  const active = await Relationship.exists({ members: { $in: userIds }, status: "active" }).session(session ?? null);
  return active !== null;
}

const PENDING_LIMIT = 20;

async function pendingRequests(userId: Types.ObjectId, side: "incoming" | "outgoing"): Promise<PendingRequest[]> {
  const requests = await Relationship.find(
    side === "incoming"
      ? { members: userId, requestedBy: { $ne: userId }, status: "pending" }
      : { requestedBy: userId, status: "pending" },
  )
    .sort({ createdAt: -1 })
    .limit(PENDING_LIMIT)
    .lean();
  const otherOf = (request: (typeof requests)[number]) =>
    request.members.find((member) => !member.equals(userId));
  const others = await User.find({
    _id: { $in: requests.map(otherOf) },
    deletedAt: null,
    mergedIntoClerkId: null,
  })
    .select("firstName lastName username avatar")
    .lean();
  const byId = new Map(others.map((other) => [String(other._id), other]));

  return requests.flatMap((request) => {
    const other = byId.get(String(otherOf(request)));
    if (!other?.username) return [];
    return [{
      id: String(request._id),
      user: toRelationshipUser(other),
      createdAt: request.createdAt.toISOString(),
    }];
  });
}

// Single source of truth for the caller's relationship state and pending requests.
export async function getRelationshipState(userId: Types.ObjectId): Promise<RelationshipState> {
  await prepareRelationshipDb();

  const active = await Relationship.findOne({ members: userId, status: "active" }).lean();
  if (active) {
    const partnerId = active.members.find((member) => !member.equals(userId));
    const partner = partnerId
      ? await User.findById(partnerId).select("firstName lastName username avatar").lean()
      : null;
    return {
      status: "connected",
      partner: toRelationshipUser(partner ?? {}),
      incomingRequests: [],
      outgoingRequests: [],
    };
  }

  const [incomingRequests, outgoingRequests] = await Promise.all([
    pendingRequests(userId, "incoming"),
    pendingRequests(userId, "outgoing"),
  ]);
  return { status: "single", partner: null, incomingRequests, outgoingRequests };
}
