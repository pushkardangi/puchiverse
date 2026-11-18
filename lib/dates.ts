export type DateParts = { year: number; month: number; day: number };

export type RelationshipDuration = {
  years: number;
  months: number;
  days: number;
  totalDays: number;
};

export type Occurrence = {
  date: string;
  daysRemaining: number;
  years: number;
};

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 86_400_000;

export function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function parseDate(value?: string): DateParts | null {
  const match = value ? ISO_DATE.exec(value) : null;
  if (!match) return null;
  const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
  if (year < 1900 || month < 1 || month > 12 || day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

export function isValidDate(value?: string) {
  return parseDate(value) !== null;
}

export function toISODate(parts: DateParts) {
  const pad = (n: number, size = 2) => String(n).padStart(size, "0");
  return `${pad(parts.year, 4)}-${pad(parts.month)}-${pad(parts.day)}`;
}

/** Today's date in the user's local timezone, as YYYY-MM-DD. */
export function localToday(now = new Date()) {
  return toISODate({ year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() });
}

/** Whole calendar days between two dates; immune to DST because it works in UTC. */
function dayNumber(parts: DateParts) {
  return Math.round(Date.UTC(parts.year, parts.month - 1, parts.day) / MS_PER_DAY);
}

export function diffInDays(from: DateParts, to: DateParts) {
  return dayNumber(to) - dayNumber(from);
}

export function formatDate(value: string | undefined, options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" }) {
  const parts = parseDate(value);
  if (!parts) return "Date unavailable";
  return new Date(parts.year, parts.month - 1, parts.day).toLocaleDateString("en-US", options);
}

function addMonthsClamped(start: DateParts, months: number): DateParts {
  const total = start.year * 12 + (start.month - 1) + months;
  const year = Math.floor(total / 12);
  const month = (total % 12) + 1;
  return { year, month, day: Math.min(start.day, daysInMonth(year, month)) };
}

/**
 * Years, months and days between `start` and `today`. A 29 Feb start date is
 * treated as 28 Feb in non-leap years, so the anniversary is never skipped.
 * Returns null when either date is invalid or the start is in the future.
 */
export function calculateDuration(start?: string, today?: string): RelationshipDuration | null {
  const from = parseDate(start);
  const to = parseDate(today);
  if (!from || !to) return null;
  const totalDays = diffInDays(from, to);
  if (totalDays < 0) return null;

  let months = (to.year - from.year) * 12 + (to.month - from.month);
  let anchor = addMonthsClamped(from, months);
  if (diffInDays(anchor, to) < 0) {
    months -= 1;
    anchor = addMonthsClamped(from, months);
  }
  return {
    years: Math.floor(months / 12),
    months: months % 12,
    days: diffInDays(anchor, to),
    totalDays,
  };
}

/**
 * Countdown for an event. Recurring events roll to the next annual occurrence
 * (today counts as 0 days); one-off events return negative values once passed.
 */
export function nextOccurrence(value: string, today: string, recurring: boolean): Occurrence | null {
  const origin = parseDate(value);
  const now = parseDate(today);
  if (!origin || !now) return null;

  if (!recurring) {
    return { date: value, daysRemaining: diffInDays(now, origin), years: 0 };
  }

  const occurrenceIn = (year: number): DateParts => ({
    year,
    month: origin.month,
    day: Math.min(origin.day, daysInMonth(year, origin.month)),
  });
  let next = occurrenceIn(now.year);
  if (diffInDays(now, next) < 0) next = occurrenceIn(now.year + 1);
  return {
    date: toISODate(next),
    daysRemaining: diffInDays(now, next),
    years: next.year - origin.year,
  };
}

export function msUntilNextLocalMidnight(now = new Date()) {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  return Math.max(1000, next.getTime() - now.getTime());
}

const plural = (count: number, unit: string) => `${count} ${unit}${count === 1 ? "" : "s"}`;

export function describeDuration(duration: RelationshipDuration) {
  const parts: string[] = [];
  if (duration.years) parts.push(plural(duration.years, "year"));
  if (duration.months) parts.push(plural(duration.months, "month"));
  if (duration.days || parts.length === 0) parts.push(plural(duration.days, "day"));
  return parts.join(", ");
}

export function ordinal(n: number) {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  return `${n}${["th", "st", "nd", "rd"][n % 10] ?? "th"}`;
}
