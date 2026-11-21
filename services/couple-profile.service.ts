import "server-only";

import type { CurrentUser } from "@/lib/current-user";
import type { CoupleProfileData, CoupleProfileUpdate } from "@/lib/couple-profile-types";
import { displayNameOf } from "@/lib/public-profile";
import Relationship from "@/models/Relationship";
import User from "@/models/User";

export class CoupleProfileNotConnectedError extends Error {
  constructor() {
    super("Connect with your partner to use your couple profile.");
  }
}

async function activeRelationship(user: CurrentUser) {
  const relationship = await Relationship.findOne({ members: user._id, status: "active" }).lean();
  if (!relationship || relationship.members.length !== 2) throw new CoupleProfileNotConnectedError();
  const users = await User.find({
    _id: { $in: relationship.members },
    deletedAt: null,
    mergedIntoClerkId: null,
  }).select("_id firstName lastName username avatar").lean();
  const first = users.find((item) => item._id.equals(relationship.members[0]));
  const second = users.find((item) => item._id.equals(relationship.members[1]));
  if (!first || !second) throw new CoupleProfileNotConnectedError();
  return { relationship, first, second };
}

export async function getCoupleProfile(user: CurrentUser): Promise<CoupleProfileData> {
  const { relationship, first, second } = await activeRelationship(user);
  const saved = relationship.coupleProfile;
  return {
    profile: {
      id: String(relationship._id),
      partnerOne: { name: saved?.nameOne || displayNameOf(first), nickname: saved?.nicknameOne ?? "", avatar: first.avatar ?? null },
      partnerTwo: { name: saved?.nameTwo || displayNameOf(second), nickname: saved?.nicknameTwo ?? "", avatar: second.avatar ?? null },
      relationshipStartDate: saved?.relationshipStartDate ?? "",
      tagline: saved?.tagline ?? "",
    },
    preferences: {
      activities: saved?.activities ?? [],
      songs: saved?.songs ?? [],
      places: saved?.places ?? [],
    },
  };
}

export async function updateCoupleProfile(user: CurrentUser, update: CoupleProfileUpdate) {
  const { relationship } = await activeRelationship(user);
  const fields: Record<string, string | string[]> = {
    "coupleProfile.nicknameOne": update.nicknameOne,
    "coupleProfile.nicknameTwo": update.nicknameTwo,
    "coupleProfile.tagline": update.tagline,
  };
  if (update.kind === "profile") {
    fields["coupleProfile.nameOne"] = update.nameOne;
    fields["coupleProfile.nameTwo"] = update.nameTwo;
    fields["coupleProfile.relationshipStartDate"] = update.relationshipStartDate;
  } else {
    fields["coupleProfile.activities"] = update.preferences.activities;
    fields["coupleProfile.songs"] = update.preferences.songs;
    fields["coupleProfile.places"] = update.preferences.places;
  }
  const result = await Relationship.updateOne(
    { _id: relationship._id, members: user._id, status: "active" },
    { $set: fields },
    { runValidators: true, strict: "throw" },
  );
  if (!result.matchedCount) throw new CoupleProfileNotConnectedError();
  return getCoupleProfile(user);
}
