"use client";

import { useCallback } from "react";
import {
  createId,
  defaultMilestones,
  isArrayOf,
  isMilestone,
  US_STORAGE_KEYS,
  type Milestone,
} from "@/data/relationshipData";
import { persistableImage, releaseImagePreview } from "@/lib/imageStorage";
import { usePersistentState } from "@/hooks/usePersistentState";

export type MilestoneInput = Omit<Milestone, "id" | "createdAt">;

const validate = isArrayOf(isMilestone);
const toStorable = (items: Milestone[]) => items.map((item) => ({ ...item, image: persistableImage(item.image) }));

export function useMilestones() {
  const { value, setValue, ready, error } = usePersistentState<Milestone[]>({
    key: US_STORAGE_KEYS.milestones,
    fallback: defaultMilestones,
    validate,
    toStorable,
  });

  // Oldest first, so the list reads as a story.
  const milestones = [...value].sort((a, b) => a.date.localeCompare(b.date) || a.createdAt.localeCompare(b.createdAt));

  const addMilestone = useCallback((input: MilestoneInput) => {
    const milestone: Milestone = { ...input, id: createId("milestone"), createdAt: new Date().toISOString() };
    setValue((current) => [...current, milestone]);
    return milestone;
  }, [setValue]);

  const updateMilestone = useCallback((id: string, input: MilestoneInput) => {
    setValue((current) => current.map((item) => (item.id === id ? { ...item, ...input } : item)));
  }, [setValue]);

  const deleteMilestone = useCallback((milestone: Milestone) => {
    releaseImagePreview(milestone.image);
    setValue((current) => current.filter((item) => item.id !== milestone.id));
  }, [setValue]);

  return { milestones, ready, error, addMilestone, updateMilestone, deleteMilestone };
}
