"use client";

import { useCallback } from "react";
import {
  createId,
  defaultBucketList,
  isArrayOf,
  isBucketListItem,
  US_STORAGE_KEYS,
  type BucketListItem,
} from "@/data/relationshipData";
import { usePersistentState } from "@/hooks/usePersistentState";

export type BucketListInput = Pick<BucketListItem, "title" | "description">;

const validate = isArrayOf(isBucketListItem);

export function useBucketList() {
  const { value: items, setValue, ready, error } = usePersistentState<BucketListItem[]>({
    key: US_STORAGE_KEYS.bucketList,
    fallback: defaultBucketList,
    validate,
  });

  const completed = items.filter((item) => item.isCompleted).sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const pending = items.filter((item) => !item.isCompleted);

  const addItem = useCallback((input: BucketListInput) => {
    const item: BucketListItem = { ...input, id: createId("bucket"), isCompleted: false, completedAt: null, createdAt: new Date().toISOString() };
    setValue((current) => [item, ...current]);
  }, [setValue]);

  const updateItem = useCallback((id: string, input: BucketListInput) => {
    setValue((current) => current.map((item) => (item.id === id ? { ...item, ...input } : item)));
  }, [setValue]);

  const toggleItem = useCallback((id: string) => {
    setValue((current) => current.map((item) => (
      item.id === id
        ? { ...item, isCompleted: !item.isCompleted, completedAt: item.isCompleted ? null : new Date().toISOString() }
        : item
    )));
  }, [setValue]);

  const deleteItem = useCallback((id: string) => {
    setValue((current) => current.filter((item) => item.id !== id));
  }, [setValue]);

  return { items, completed, pending, ready, error, addItem, updateItem, toggleItem, deleteItem };
}
