import { isPreferences, type CoupleProfile, type SharedPreferences } from "@/data/relationshipData";
import { isValidDate } from "@/lib/dates";

export type CoupleProfileData = {
  profile: CoupleProfile;
  preferences: SharedPreferences;
};

export type CoupleProfileUpdate =
  | {
      kind: "profile";
      nameOne: string;
      nameTwo: string;
      nicknameOne: string;
      nicknameTwo: string;
      relationshipStartDate: string;
      tagline: string;
    }
  | {
      kind: "preferences";
      nicknameOne: string;
      nicknameTwo: string;
      tagline: string;
      preferences: SharedPreferences;
    };

export function isCoupleProfileData(value: unknown): value is CoupleProfileData {
  if (!value || typeof value !== "object" || !("profile" in value) || !("preferences" in value)) return false;
  const profile = value.profile;
  if (!profile || typeof profile !== "object") return false;
  const item = profile as Record<string, unknown>;
  const partner = (value: unknown) => {
    if (!value || typeof value !== "object") return false;
    const person = value as Record<string, unknown>;
    return typeof person.name === "string" && typeof person.nickname === "string" &&
      (person.avatar === null || typeof person.avatar === "string");
  };
  return typeof item.id === "string" && partner(item.partnerOne) && partner(item.partnerTwo) &&
    typeof item.relationshipStartDate === "string" &&
    (item.relationshipStartDate === "" || isValidDate(item.relationshipStartDate)) &&
    typeof item.tagline === "string" && isPreferences(value.preferences);
}

function boundedString(value: unknown, limit: number, required = false): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length <= limit && (!required || trimmed.length > 0) ? trimmed : null;
}

function list(value: unknown): string[] | null {
  if (!Array.isArray(value) || value.length > 12) return null;
  const result: string[] = [];
  for (const item of value) {
    const text = boundedString(item, 60, true);
    if (text === null) return null;
    result.push(text);
  }
  return result;
}

export function parseCoupleProfileUpdate(value: unknown): CoupleProfileUpdate | null {
  if (!value || typeof value !== "object") return null;
  const input = value as Record<string, unknown>;
  const nicknameOne = boundedString(input.nicknameOne, 30);
  const nicknameTwo = boundedString(input.nicknameTwo, 30);
  const tagline = boundedString(input.tagline, 80);
  if (nicknameOne === null || nicknameTwo === null || tagline === null) return null;

  if (input.kind === "profile") {
    const nameOne = boundedString(input.nameOne, 40, true);
    const nameTwo = boundedString(input.nameTwo, 40, true);
    const date = input.relationshipStartDate;
    if (nameOne === null || nameTwo === null ||
      typeof date !== "string" || (date !== "" && !isValidDate(date))) return null;
    return { kind: "profile", nameOne, nameTwo, nicknameOne, nicknameTwo, relationshipStartDate: date, tagline };
  }
  if (input.kind === "preferences" && input.preferences && typeof input.preferences === "object") {
    const preferences = input.preferences as Record<string, unknown>;
    const activities = list(preferences.activities);
    const songs = list(preferences.songs);
    const places = list(preferences.places);
    if (!activities || !songs || !places) return null;
    return { kind: "preferences", nicknameOne, nicknameTwo, tagline, preferences: { activities, songs, places } };
  }
  return null;
}
