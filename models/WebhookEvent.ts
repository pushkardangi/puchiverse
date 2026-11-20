import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const webhookEventSchema = new mongoose.Schema(
  {
    eventId: { type: String, required: true, unique: true },
    eventType: { type: String, required: true },
    status: { type: String, enum: ["processing", "processed"], required: true },
    processedAt: { type: Date, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

type WebhookEventDocument = InferSchemaType<typeof webhookEventSchema>;

const WebhookEvent: Model<WebhookEventDocument> =
  mongoose.models.WebhookEvent || mongoose.model<WebhookEventDocument>("WebhookEvent", webhookEventSchema);

export default WebhookEvent;
