import "server-only";

import mongoose, { type InferSchemaType, type Model } from "mongoose";

export const RELATIONSHIP_STATUSES = ["pending", "active", "ended", "rejected", "cancelled"] as const;

const coupleProfileFields = {
  nameOne: { type: String, trim: true, maxlength: 40 },
  nameTwo: { type: String, trim: true, maxlength: 40 },
  nicknameOne: { type: String, default: "", trim: true, maxlength: 30 },
  nicknameTwo: { type: String, default: "", trim: true, maxlength: 30 },
  relationshipStartDate: { type: String, default: "" },
  tagline: { type: String, default: "", trim: true, maxlength: 80 },
  activities: { type: [String], default: [] },
  songs: { type: [String], default: [] },
  places: { type: [String], default: [] },
};

// One document tracks a relationship for its whole life: a pending request from
// requestedBy to the other member, then active once accepted, then ended (or rejected/cancelled).
const relationshipSchema = new mongoose.Schema(
  {
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    // Exactly two distinct user ids in canonical (ascending) order, so the same pair always
    // has the same array. The receiver is the member that is not requestedBy.
    members: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
      validate: {
        validator: (members: mongoose.Types.ObjectId[]) =>
          members.length === 2 && String(members[0]) < String(members[1]),
        message: "A relationship needs two distinct members in ascending order",
      },
    },
    status: { type: String, enum: RELATIONSHIP_STATUSES, default: "pending", required: true },
    // When the request was accepted, rejected or cancelled; for an active relationship, when it started.
    respondedAt: { type: Date, default: null },
    endedAt: { type: Date, default: null },
    coupleProfile: coupleProfileFields,
  },
  { timestamps: true, versionKey: false },
);

// At most one pending request per pair of users, in either direction.
relationshipSchema.index(
  { "members.0": 1, "members.1": 1 },
  { unique: true, partialFilterExpression: { status: "pending" } },
);
// A user can be in at most one active relationship, even under concurrent accepts.
relationshipSchema.index({ members: 1 }, { unique: true, partialFilterExpression: { status: "active" } });
relationshipSchema.index({ requestedBy: 1, status: 1, createdAt: -1 });

export type RelationshipDocument = InferSchemaType<typeof relationshipSchema>;

const Relationship: Model<RelationshipDocument> =
  mongoose.models.Relationship || mongoose.model<RelationshipDocument>("Relationship", relationshipSchema);

// A development hot reload can reuse the model compiled before these fields existed.
if (!Relationship.schema.path("coupleProfile.relationshipStartDate")) {
  Relationship.schema.add({ coupleProfile: coupleProfileFields });
}

export default Relationship;
