import type { RelationshipUser } from "@/lib/relationship-types";

type ProfileSource = {
  firstName?: string | null;
  lastName?: string | null;
  username?: string | null;
  avatar?: string | null;
};

export function displayNameOf(user: ProfileSource): string {
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return name || user.username || "Someone special";
}

export function toRelationshipUser(user: ProfileSource): RelationshipUser {
  return {
    username: user.username ?? "",
    displayName: displayNameOf(user),
    avatar: user.avatar ?? null,
  };
}
