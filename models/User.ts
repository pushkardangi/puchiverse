import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, required: true, unique: true },
    email: { type: String, trim: true, lowercase: true },
    emailAddresses: [{ type: String, trim: true, lowercase: true }],
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    username: { type: String, trim: true, lowercase: true, default: null },
    avatar: { type: String, default: null },
    discoverable: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
    mergedIntoClerkId: { type: String, default: null },
    clerkUpdatedAt: { type: Number, default: null },
    clerkEventTimestamp: { type: Number, default: null },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

export type UserDocument = InferSchemaType<typeof userSchema>;

const User: Model<UserDocument> =
  mongoose.models.User || mongoose.model<UserDocument>("User", userSchema);

export default User;
