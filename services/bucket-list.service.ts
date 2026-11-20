import "server-only";

import { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import type { ApiErrorCode } from "@/lib/relationship-types";
import type { BucketListInput, BucketListItem } from "@/lib/bucket-list-types";
import BucketListItemModel from "@/models/BucketListItem";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class BucketListError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function coupleFor(user: CurrentUser) {
  const relationship = await Relationship.findOne({ members: user._id, status: "active" })
    .select("_id members")
    .lean();
  const partnerId = relationship?.members.find((member) => !member.equals(user._id));
  const partner = partnerId &&
    await User.exists({ _id: partnerId, deletedAt: null, mergedIntoClerkId: null });
  if (!relationship || !partner)
    throw new BucketListError("not_connected", "Connect with your partner to use the bucket list.");
  return relationship._id;
}

function serialize(item: {
  _id: Types.ObjectId;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt?: Date | null;
  createdAt?: Date;
}): BucketListItem {
  return {
    id: String(item._id),
    title: item.title,
    description: item.description,
    isCompleted: item.isCompleted,
    completedAt: item.completedAt?.toISOString() ?? null,
    createdAt: item.createdAt?.toISOString() ?? new Date(0).toISOString(),
  };
}

export async function listBucketListItems(user: CurrentUser) {
  const coupleId = await coupleFor(user);
  const items = await BucketListItemModel.find({ coupleId }).sort({ createdAt: -1, _id: -1 }).lean();
  return items.map(serialize);
}

export async function createBucketListItem(user: CurrentUser, input: BucketListInput) {
  const coupleId = await coupleFor(user);
  const item = await BucketListItemModel.create({ coupleId, ...input, isCompleted: false, completedAt: null });
  return serialize(item.toObject());
}

export async function updateBucketListItem(user: CurrentUser, id: string, input: BucketListInput) {
  const coupleId = await coupleFor(user);
  if (!Types.ObjectId.isValid(id)) throw new BucketListError("not_found", "Bucket list item not found.");
  const item = await BucketListItemModel.findOneAndUpdate(
    { _id: id, coupleId },
    { $set: input },
    { returnDocument: "after", runValidators: true },
  ).lean();
  if (!item) throw new BucketListError("not_found", "Bucket list item not found.");
  return serialize(item);
}

export async function toggleBucketListItem(user: CurrentUser, id: string) {
  const coupleId = await coupleFor(user);
  if (!Types.ObjectId.isValid(id)) throw new BucketListError("not_found", "Bucket list item not found.");
  const current = await BucketListItemModel.findOne({ _id: id, coupleId }).lean();
  if (!current) throw new BucketListError("not_found", "Bucket list item not found.");
  const item = await BucketListItemModel.findOneAndUpdate(
    { _id: id, coupleId },
    { $set: { isCompleted: !current.isCompleted, completedAt: current.isCompleted ? null : new Date() } },
    { returnDocument: "after", runValidators: true },
  ).lean();
  if (!item) throw new BucketListError("not_found", "Bucket list item not found.");
  return serialize(item);
}

export async function deleteBucketListItem(user: CurrentUser, id: string) {
  const coupleId = await coupleFor(user);
  if (!Types.ObjectId.isValid(id)) throw new BucketListError("not_found", "Bucket list item not found.");
  const result = await BucketListItemModel.deleteOne({ _id: id, coupleId });
  if (!result.deletedCount) throw new BucketListError("not_found", "Bucket list item not found.");
}
