import {
  DATE_CATEGORIES,
  MILESTONE_CATEGORIES,
  type ImportantDate,
  type Milestone,
} from "@/data/relationshipData";
import { isValidDate, nextOccurrence } from "@/lib/dates";

export type EventInput =
  | ({ tag: "milestone" } & Omit<Milestone, "id" | "createdAt">)
  | ({ tag: "important-date" } & Omit<ImportantDate, "id">)
  | { tag: "schedule"; title: string; date: string };

export type SharedEvent = EventInput & { id: string; createdAt: string };

export function parseEventInput(value: unknown): EventInput | null {
  if (!value || typeof value !== "object") return null;
  const item = value as Record<string, unknown>;
  if (
    typeof item.title !== "string" ||
    !item.title.trim() ||
    item.title.trim().length > 100 ||
    typeof item.date !== "string" ||
    !isValidDate(item.date)
  )
    return null;
  const base = { title: item.title.trim(), date: item.date };
  if (item.tag === "schedule") return { ...base, tag: "schedule" };
  if (
    item.tag === "important-date" &&
    base.title.length <= 80 &&
    typeof item.category === "string" &&
    (DATE_CATEGORIES as readonly string[]).includes(item.category) &&
    typeof item.isRecurring === "boolean" &&
    typeof item.reminderEnabled === "boolean"
  ) {
    return {
      ...base,
      tag: "important-date",
      category: item.category as ImportantDate["category"],
      isRecurring: item.isRecurring,
      reminderEnabled: item.reminderEnabled,
    };
  }
  if (
    item.tag === "milestone" &&
    typeof item.description === "string" &&
    item.description.length <= 800 &&
    typeof item.category === "string" &&
    (MILESTONE_CATEGORIES as readonly string[]).includes(item.category) &&
    item.image === null
  ) {
    return {
      ...base,
      tag: "milestone",
      description: item.description.trim(),
      category: item.category as Milestone["category"],
      image: null,
    };
  }
  return null;
}

export function closestEvent(events: SharedEvent[], today: string) {
  return (
    events
      .flatMap((event) => {
        if (event.tag === "milestone") return [];
        const occurrence = nextOccurrence(
          event.date,
          today,
          event.tag === "important-date" && event.isRecurring,
        );
        return occurrence && occurrence.daysRemaining >= 0
          ? [{ event, ...occurrence }]
          : [];
      })
      .sort(
        (a, b) =>
          a.daysRemaining - b.daysRemaining ||
          a.event.title.localeCompare(b.event.title) ||
          a.event.id.localeCompare(b.event.id),
      )[0] ?? null
  );
}
