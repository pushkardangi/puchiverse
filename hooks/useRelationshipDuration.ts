"use client";

import { useMemo } from "react";
import { calculateDuration, isValidDate, nextOccurrence } from "@/lib/dates";
import { useToday } from "@/hooks/useToday";

export type DurationState =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "future" }
  | {
      status: "ready";
      years: number;
      months: number;
      days: number;
      totalDays: number;
      daysToAnniversary: number;
      isAnniversaryToday: boolean;
    };

export function useRelationshipDuration(startDate: string): DurationState {
  const today = useToday();

  return useMemo<DurationState>(() => {
    if (!today) return { status: "loading" };
    if (!isValidDate(startDate)) return { status: "invalid" };
    const duration = calculateDuration(startDate, today);
    if (!duration) return { status: "future" };
    const anniversary = nextOccurrence(startDate, today, true);
    const daysToAnniversary = anniversary?.daysRemaining ?? 0;
    return {
      status: "ready",
      ...duration,
      daysToAnniversary,
      isAnniversaryToday: duration.totalDays > 0 && daysToAnniversary === 0,
    };
  }, [startDate, today]);
}
