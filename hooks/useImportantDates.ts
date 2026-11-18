"use client";

import { useCallback } from "react";
import {
  createId,
  defaultImportantDates,
  isArrayOf,
  isImportantDate,
  US_STORAGE_KEYS,
  type ImportantDate,
} from "@/data/relationshipData";
import { nextOccurrence } from "@/lib/dates";
import { useToday } from "@/hooks/useToday";
import { usePersistentState } from "@/hooks/usePersistentState";

export type ImportantDateInput = Omit<ImportantDate, "id">;

export type ImportantDateView = ImportantDate & {
  nextDate: string;
  daysRemaining: number;
  years: number;
};

const validate = isArrayOf(isImportantDate);

export function useImportantDates() {
  const today = useToday();
  const { value, setValue, ready, error } = usePersistentState<ImportantDate[]>({
    key: US_STORAGE_KEYS.dates,
    fallback: defaultImportantDates,
    validate,
  });

  // Upcoming (soonest first), then dates that have already passed (most recent first).
  const dates: ImportantDateView[] = [];
  if (today) {
    for (const item of value) {
      const occurrence = nextOccurrence(item.date, today, item.isRecurring);
      if (occurrence) dates.push({ ...item, nextDate: occurrence.date, daysRemaining: occurrence.daysRemaining, years: occurrence.years });
    }
    dates.sort((a, b) => {
      const aPast = a.daysRemaining < 0;
      const bPast = b.daysRemaining < 0;
      if (aPast !== bPast) return aPast ? 1 : -1;
      return aPast ? b.daysRemaining - a.daysRemaining : a.daysRemaining - b.daysRemaining;
    });
  }

  const addDate = useCallback((input: ImportantDateInput) => {
    setValue((current) => [...current, { ...input, id: createId("date") }]);
  }, [setValue]);

  const updateDate = useCallback((id: string, input: ImportantDateInput) => {
    setValue((current) => current.map((item) => (item.id === id ? { ...item, ...input } : item)));
  }, [setValue]);

  const deleteDate = useCallback((id: string) => {
    setValue((current) => current.filter((item) => item.id !== id));
  }, [setValue]);

  const toggleReminder = useCallback((id: string) => {
    setValue((current) => current.map((item) => (item.id === id ? { ...item, reminderEnabled: !item.reminderEnabled } : item)));
  }, [setValue]);

  return { dates, rawDates: value, loading: !today, ready, error, addDate, updateDate, deleteDate, toggleReminder };
}
