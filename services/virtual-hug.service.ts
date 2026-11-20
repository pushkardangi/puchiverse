import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import mongoose, { Types } from "mongoose";
import type { CurrentUser } from "@/lib/current-user";
import type { ApiErrorCode } from "@/lib/relationship-types";
import VirtualHug from "@/models/VirtualHug";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class VirtualHugError extends Error {
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
  if (!relationship || !partnerId || !partner) {
    throw new VirtualHugError(
      "not_connected",
      "Connect with your partner to send and receive hugs.",
    );
  }
  return { coupleId: relationship._id, partnerId };
}

async function availableGifs() {
  const entries = await readdir(
    path.join(process.cwd(), "public", "gifs", "hugs"),
    { withFileTypes: true },
  );
  const files = entries
    .filter((entry) => entry.isFile() && /^hug-[0-9]+\.gif$/.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
  if (!files.length) throw new Error("No hug GIFs are available.");
  return files;
}

const pendingMessage = "Your last hug is still waiting for your partner.";

export async function getHugSelection(user: CurrentUser) {
  await coupleFor(user);
  const [gifFileNames, pending] = await Promise.all([
    availableGifs(),
    VirtualHug.exists({ senderId: user._id, status: "pending" }),
  ]);
  return { gifFileNames, outgoingPending: Boolean(pending) };
}

export async function sendVirtualHug(user: CurrentUser, gifFileName: string) {
  const { coupleId, partnerId } = await coupleFor(user);
  const files = await availableGifs();
  if (!files.includes(gifFileName)) {
    throw new VirtualHugError("invalid_request", "Please select an available hug.");
  }
  await VirtualHug.init();
  if (await VirtualHug.exists({ senderId: user._id, status: "pending" })) {
    throw new VirtualHugError("hug_pending", pendingMessage);
  }
  try {
    const hug = await VirtualHug.create({
      senderId: user._id,
      receiverId: partnerId,
      coupleId,
      gifFileName,
      sendSlot: true,
    });
    return { id: String(hug._id), gifFileName: hug.gifFileName };
  } catch (error) {
    if (error instanceof mongoose.mongo.MongoServerError && error.code === 11000 &&
        await VirtualHug.exists({ senderId: user._id, status: "pending" })) {
      throw new VirtualHugError("hug_pending", pendingMessage);
    }
    throw error;
  }
}

export async function listPendingHugs(user: CurrentUser) {
  const { coupleId, partnerId } = await coupleFor(user);
  const hugs = await VirtualHug.find({
    coupleId,
    receiverId: user._id,
    senderId: partnerId,
    status: "pending",
  })
    .select("_id gifFileName")
    .sort({ createdAt: 1, _id: 1 })
    .lean();
  if (!hugs.length) return [];
  const files = new Set(await availableGifs());
  return hugs.map((hug) => {
    if (!files.has(hug.gifFileName))
      throw new Error(`Unavailable hug GIF for hug ${hug._id}`);
    return { id: String(hug._id), gifFileName: hug.gifFileName };
  });
}

export async function acknowledgeHug(user: CurrentUser, id: string) {
  if (!Types.ObjectId.isValid(id)) {
    throw new VirtualHugError(
      "invalid_request",
      "Please provide a valid hug ID.",
    );
  }
  const { coupleId, partnerId } = await coupleFor(user);
  const hug = await VirtualHug.findOneAndUpdate(
    {
      _id: id,
      coupleId,
      senderId: partnerId,
      receiverId: user._id,
      status: "pending",
    },
    { $set: { status: "seen", sendSlot: false } },
  );
  if (!hug)
    throw new VirtualHugError("not_found", "This hug is no longer available.");
}
