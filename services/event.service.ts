import "server-only";

import { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import type { EventInput, SharedEvent } from "@/lib/event-types";
import { parseEventInput } from "@/lib/event-types";
import type { ApiErrorCode } from "@/lib/relationship-types";
import Event from "@/models/Event";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class EventError extends Error {
  readonly code: ApiErrorCode;
  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function coupleFor(user: CurrentUser) {
  const relationship = await Relationship.findOne({ members: user._id, status: "active" }).select("_id members").lean();
  const partnerId = relationship?.members.find((member) => !member.equals(user._id));
  const partner = partnerId && await User.exists({ _id: partnerId, deletedAt: null, mergedIntoClerkId: null });
  if (!relationship || !partner) throw new EventError("not_connected", "Connect with your partner to use shared events.");
  return relationship._id;
}

function serialize(item: { _id: Types.ObjectId; createdAt: Date } & Record<string, unknown>): SharedEvent {
  const input = parseEventInput(item);
  if (!input) throw new Error("Invalid stored event");
  return { ...input, id: String(item._id), createdAt: item.createdAt.toISOString() };
}

export async function listEvents(user: CurrentUser) {
  const coupleId = await coupleFor(user);
  const items = await Event.find({ coupleId }).sort({ createdAt: 1, _id: 1 }).lean();
  return items.map(serialize);
}

export async function createEvent(user: CurrentUser, input: EventInput) {
  const coupleId = await coupleFor(user);
  const item = await Event.create({ coupleId, ...input });
  return serialize(item.toObject());
}

export async function updateEvent(user: CurrentUser, id: string, input: EventInput) {
  const coupleId = await coupleFor(user);
  if (!Types.ObjectId.isValid(id)) throw new EventError("not_found", "Event not found.");
  const item = await Event.findOneAndUpdate(
    { _id: id, coupleId, tag: input.tag },
    { $set: input },
    { returnDocument: "after", runValidators: true },
  ).lean();
  if (!item) throw new EventError("not_found", "Event not found.");
  return serialize(item);
}

export async function deleteEvent(user: CurrentUser, id: string) {
  const coupleId = await coupleFor(user);
  if (!Types.ObjectId.isValid(id)) throw new EventError("not_found", "Event not found.");
  const result = await Event.deleteOne({ _id: id, coupleId });
  if (!result.deletedCount) throw new EventError("not_found", "Event not found.");
}
