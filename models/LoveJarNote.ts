import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const loveJarNoteSchema = new mongoose.Schema(
  {
    coupleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Relationship",
      required: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: { type: String, required: true, trim: true, maxlength: 240 },
  },
  { timestamps: true, versionKey: false },
);

loveJarNoteSchema.index({ coupleId: 1, createdAt: -1, _id: -1 });

export type LoveJarNoteDocument = InferSchemaType<typeof loveJarNoteSchema>;

const LoveJarNote: Model<LoveJarNoteDocument> =
  mongoose.models.LoveJarNote ||
  mongoose.model<LoveJarNoteDocument>("LoveJarNote", loveJarNoteSchema);

export default LoveJarNote;
