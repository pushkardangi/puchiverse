import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const virtualHugSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
    },
    message: { type: String, default: "" },
    gifFileName: { type: String, required: true, match: /^hug-[0-9]+\.gif$/ },
    status: {
      type: String,
      enum: ["pending", "seen"],
      default: "pending",
      required: true,
    },
    sendSlot: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

virtualHugSchema.index({
  coupleId: 1,
  receiverId: 1,
  status: 1,
  createdAt: 1,
  _id: 1,
});

// Older versions allowed multiple pending hugs, so only new sends occupy a slot.
virtualHugSchema.index(
  { senderId: 1 },
  { unique: true, partialFilterExpression: { status: "pending", sendSlot: true } },
);

export type VirtualHugDocument = InferSchemaType<typeof virtualHugSchema>;

const VirtualHug: Model<VirtualHugDocument> =
  mongoose.models.VirtualHug ||
  mongoose.model<VirtualHugDocument>("VirtualHug", virtualHugSchema);

export default VirtualHug;
