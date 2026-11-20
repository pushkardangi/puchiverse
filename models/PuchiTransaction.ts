import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const puchiTransactionSchema = new mongoose.Schema(
  {
    coupleId: { type: mongoose.Schema.Types.ObjectId, ref: "Relationship", required: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    idempotencyKey: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

puchiTransactionSchema.index({ coupleId: 1, createdAt: -1, _id: -1 });
puchiTransactionSchema.index(
  { coupleId: 1, senderId: 1, idempotencyKey: 1 },
  { unique: true },
);

export type PuchiTransactionDocument = InferSchemaType<typeof puchiTransactionSchema>;

const PuchiTransaction: Model<PuchiTransactionDocument> =
  mongoose.models.PuchiTransaction ||
  mongoose.model<PuchiTransactionDocument>("PuchiTransaction", puchiTransactionSchema);

export default PuchiTransaction;
