import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    coupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
      index: true,
    },
    tag: {
      type: String,
      enum: ["milestone", "important-date", "schedule"],
      required: true,
    },
    title: { type: String, required: true },
    date: { type: String, required: true },
    description: String,
    category: String,
    image: { type: String, default: null },
    isRecurring: Boolean,
    reminderEnabled: Boolean,
  },
  { timestamps: true, versionKey: false },
);

export type EventDocument = InferSchemaType<typeof eventSchema>;
const Event: Model<EventDocument> =
  mongoose.models.Event || mongoose.model<EventDocument>("Event", eventSchema);
export default Event;
