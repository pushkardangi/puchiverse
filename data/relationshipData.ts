import { isValidDate } from "@/lib/dates";

export const MILESTONE_CATEGORIES = ["Firsts", "Adventures", "Anniversaries", "Celebrations", "Custom"] as const;
export type MilestoneCategory = (typeof MILESTONE_CATEGORIES)[number];

export const DATE_CATEGORIES = ["Anniversary", "Birthday", "Special Occasion", "Custom"] as const;
export type DateCategory = (typeof DATE_CATEGORIES)[number];

export type Partner = {
  name: string;
  avatar: string | null;
  nickname: string;
};

export type CoupleProfile = {
  id: string;
  partnerOne: Partner;
  partnerTwo: Partner;
  relationshipStartDate: string;
  tagline: string;
};

export type Milestone = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: MilestoneCategory;
  image: string | null;
  createdAt: string;
};

export type BucketListItem = {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  completedAt: string | null;
  createdAt: string;
};

export type ImportantDate = {
  id: string;
  title: string;
  date: string;
  isRecurring: boolean;
  reminderEnabled: boolean;
  category: DateCategory;
};

export type SharedPreferences = {
  activities: string[];
  songs: string[];
  places: string[];
};

export type AppSettings = {
  notifications: { dateReminders: boolean; puchis: boolean; memories: boolean };
  privacy: { hidePreviews: boolean; requireUnlock: boolean };
  theme: "ivory";
};

export const US_STORAGE_KEYS = {
  profile: "puchiverse.us.profile.v1",
  milestones: "puchiverse.us.milestones.v1",
  bucketList: "puchiverse.us.bucket-list.v1",
  dates: "puchiverse.us.dates.v1",
  preferences: "puchiverse.us.preferences.v1",
  settings: "puchiverse.us.settings.v1",
} as const;

export const defaultProfile: CoupleProfile = {
  id: "couple_001",
  partnerOne: { name: "Heer", avatar: null, nickname: "Kuchu" },
  partnerTwo: { name: "Ranjha", avatar: null, nickname: "Puchu" },
  relationshipStartDate: "2025-02-14",
  tagline: "Two people, one beautiful story.",
};

export const defaultMilestones: Milestone[] = [
  {
    id: "milestone_001",
    title: "The day we first met",
    description: "An ordinary afternoon that quietly became the beginning of everything.",
    date: "2025-01-18",
    category: "Firsts",
    image: null,
    createdAt: "2025-01-18T12:00:00Z",
  },
  {
    id: "milestone_002",
    title: "Our first conversation",
    description: "We meant to talk for five minutes. It lasted until the sun came up.",
    date: "2025-01-19",
    category: "Firsts",
    image: null,
    createdAt: "2025-01-19T12:00:00Z",
  },
  {
    id: "milestone_003",
    title: "Our first date",
    description: "A day worth remembering. Nervous smiles, shared dessert, and no wish to go home.",
    date: "2025-02-14",
    category: "Firsts",
    image: null,
    createdAt: "2025-02-14T12:00:00Z",
  },
  {
    id: "milestone_004",
    title: "Our first photograph",
    description: "Slightly blurry, completely perfect. Still the one we both keep.",
    date: "2025-03-02",
    category: "Firsts",
    image: null,
    createdAt: "2025-03-02T12:00:00Z",
  },
  {
    id: "milestone_005",
    title: "Our first trip together",
    description: "Two backpacks, no real itinerary, and a new favourite person beside me.",
    date: "2025-11-02",
    category: "Adventures",
    image: "https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=1000&q=85",
    createdAt: "2025-11-04T09:00:00Z",
  },
  {
    id: "milestone_006",
    title: "One year of us",
    description: "A small anniversary dinner and a long look back at everything we had become.",
    date: "2026-02-14",
    category: "Anniversaries",
    image: null,
    createdAt: "2026-02-14T23:15:00Z",
  },
];

export const defaultBucketList: BucketListItem[] = [
  ["Watch a sunrise together", "Find a beautiful place and enjoy the sunrise.", "2026-03-09T05:55:00Z"],
  ["Take a road trip", "No map, one playlist, and an open road.", null],
  ["Visit a new city", "Somewhere neither of us has ever been.", null],
  ["Cook dinner together", "Even if the pasta is questionable.", "2025-12-21T20:00:00Z"],
  ["Watch our favourite movie", "Blankets, popcorn, and no phones.", "2025-10-11T21:00:00Z"],
  ["Take a memorable photograph", "One frame we will want to keep forever.", "2025-03-02T17:30:00Z"],
  ["Stargaze far from the city", "", null],
  ["Write each other letters to open in a year", "", null],
  ["Learn a dance together", "", null],
  ["Celebrate an anniversary somewhere new", "", null],
].map(([title, description, completedAt], index) => ({
  id: `bucket_${String(index + 1).padStart(3, "0")}`,
  title: title as string,
  description: description as string,
  isCompleted: completedAt !== null,
  completedAt: completedAt as string | null,
  createdAt: "2025-02-14T12:00:00Z",
}));

export const defaultImportantDates: ImportantDate[] = [
  { id: "date_001", title: "Our Anniversary", date: "2025-02-14", isRecurring: true, reminderEnabled: true, category: "Anniversary" },
  { id: "date_002", title: "The day we met", date: "2025-01-18", isRecurring: true, reminderEnabled: false, category: "Anniversary" },
  { id: "date_003", title: "Puchi's Birthday", date: "2000-07-08", isRecurring: true, reminderEnabled: true, category: "Birthday" },
  { id: "date_004", title: "Pushkar's Birthday", date: "2000-03-21", isRecurring: true, reminderEnabled: true, category: "Birthday" },
  { id: "date_005", title: "Weekend by the sea", date: "2027-01-10", isRecurring: false, reminderEnabled: false, category: "Special Occasion" },
];

export const defaultPreferences: SharedPreferences = {
  activities: ["Slow Sunday coffee", "Evening walks", "Late-night movies"],
  songs: ["Our road trip playlist"],
  places: ["Marine Drive", "Lonavala"],
};

export const defaultSettings: AppSettings = {
  notifications: { dateReminders: true, puchis: true, memories: false },
  privacy: { hidePreviews: false, requireUnlock: false },
  theme: "ivory",
};

const isObject = (value: unknown): value is Record<string, unknown> => !!value && typeof value === "object";
const isString = (value: unknown): value is string => typeof value === "string";
const isStringArray = (value: unknown): value is string[] => Array.isArray(value) && value.every(isString);
const isPartner = (value: unknown): value is Partner =>
  isObject(value) && isString(value.name) && isString(value.nickname) && (value.avatar === null || isString(value.avatar));

export const isCoupleProfile = (value: unknown): value is CoupleProfile =>
  isObject(value) && isString(value.id) && isPartner(value.partnerOne) && isPartner(value.partnerTwo) &&
  isString(value.relationshipStartDate) && isString(value.tagline) && isValidDate(value.relationshipStartDate);

export const isMilestone = (value: unknown): value is Milestone =>
  isObject(value) && isString(value.id) && isString(value.title) && isString(value.description) && isString(value.date) &&
  isString(value.category) && (MILESTONE_CATEGORIES as readonly string[]).includes(value.category) &&
  (value.image === null || isString(value.image)) && isString(value.createdAt);

export const isBucketListItem = (value: unknown): value is BucketListItem =>
  isObject(value) && isString(value.id) && isString(value.title) && isString(value.description) &&
  typeof value.isCompleted === "boolean" && (value.completedAt === null || isString(value.completedAt)) && isString(value.createdAt);

export const isImportantDate = (value: unknown): value is ImportantDate =>
  isObject(value) && isString(value.id) && isString(value.title) && isString(value.date) &&
  typeof value.isRecurring === "boolean" && typeof value.reminderEnabled === "boolean" &&
  isString(value.category) && (DATE_CATEGORIES as readonly string[]).includes(value.category);

export const isPreferences = (value: unknown): value is SharedPreferences =>
  isObject(value) && isStringArray(value.activities) && isStringArray(value.songs) && isStringArray(value.places);

export const isAppSettings = (value: unknown): value is AppSettings =>
  isObject(value) && isObject(value.notifications) && isObject(value.privacy) && value.theme === "ivory" &&
  typeof value.notifications.dateReminders === "boolean" && typeof value.notifications.puchis === "boolean" &&
  typeof value.notifications.memories === "boolean" && typeof value.privacy.hidePreviews === "boolean" &&
  typeof value.privacy.requireUnlock === "boolean";

export const isArrayOf = <T,>(guard: (value: unknown) => value is T) =>
  (value: unknown): value is T[] => Array.isArray(value) && value.every(guard);

export function createId(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}
