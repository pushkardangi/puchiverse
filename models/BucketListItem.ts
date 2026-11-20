import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const bucketListItemSchema = new mongoose.Schema(
  {
    coupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, default: "", trim: true, maxlength: 300 },
    isCompleted: { type: Boolean, default: false, required: true },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false },
);

bucketListItemSchema.index({ coupleId: 1, createdAt: -1 });

export type BucketListItemDocument = InferSchemaType<
  typeof bucketListItemSchema
>;
const BucketListItem: Model<BucketListItemDocument> =
  mongoose.models.BucketListItem ||
  mongoose.model<BucketListItemDocument>(
    "BucketListItem",
    bucketListItemSchema,
  );

export default BucketListItem;
