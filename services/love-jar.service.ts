import "server-only";

import { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import type { ApiErrorCode } from "@/lib/relationship-types";
import type { LoveJarNote as LoveJarNoteData } from "@/lib/love-jar-types";
import LoveJarNote from "@/models/LoveJarNote";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class LoveJarError extends Error {
  readonly code: ApiErrorCode;

  constructor(code: ApiErrorCode, message: string) {
    super(message);
    this.code = code;
  }
}

async function coupleFor(user: CurrentUser) {
  const relationship = await Relationship.findOne({
    members: user._id,
    status: "active",
  })
    .select("_id members")
    .lean();
  const partnerId = relationship?.members.find(
    (member) => !member.equals(user._id),
  );
  const partner =
    partnerId &&
    (await User.exists({
      _id: partnerId,
      deletedAt: null,
      mergedIntoClerkId: null,
    }));

  if (!relationship || !partner) {
    throw new LoveJarError(
      "not_connected",
      "Connect with your partner to use the love jar.",
    );
  }
  return { coupleId: relationship._id, partnerId };
}

function serialize(item: {
  _id: Types.ObjectId;
  note: string;
  createdAt: Date;
}): LoveJarNoteData {
  return {
    id: String(item._id),
    note: item.note,
    createdAt: item.createdAt.toISOString(),
  };
}

export async function listLoveJarNotes(user: CurrentUser) {
  const { coupleId, partnerId } = await coupleFor(user);
  const notes = await LoveJarNote.find({ coupleId, authorId: partnerId })
    .select("_id note createdAt")
    .sort({ createdAt: -1, _id: -1 })
    .lean();
  return notes.map(serialize);
}

export async function createLoveJarNote(user: CurrentUser, note: string) {
  const { coupleId } = await coupleFor(user);
  await LoveJarNote.create({
    coupleId,
    authorId: user._id,
    note,
  });
}
