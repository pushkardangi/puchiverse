"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BucketListRequestError,
  createBucketListItem,
  deleteBucketListItem,
  fetchBucketList,
  toggleBucketListItem,
  updateBucketListItem,
} from "@/lib/bucket-list-client";
import type { BucketListInput, BucketListItem } from "@/lib/bucket-list-types";

export type { BucketListInput } from "@/lib/bucket-list-types";

function messageOf(error: unknown) {
  return error instanceof BucketListRequestError
    ? error.message
    : "Could not update the bucket list. Please try again.";
}

export function useBucketList() {
  const [items, setItems] = useState<BucketListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [loadAttempt, setLoadAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    fetchBucketList(controller.signal)
      .then(({ data }) => {
        setItems(data);
        setReady(true);
        setError("");
      })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(messageOf(reason));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [loadAttempt]);

  const addItem = useCallback(async (input: BucketListInput) => {
    setError("");
    try {
      const { data } = await createBucketListItem(input);
      setItems((current) => [data, ...current]);
      return data;
    } catch (reason) {
      setError(messageOf(reason));
      return null;
    }
  }, []);

  const updateItem = useCallback(async (id: string, input: BucketListInput) => {
    setError("");
    try {
      const { data } = await updateBucketListItem(id, input);
      setItems((current) =>
        current.map((item) => (item.id === id ? data : item)),
      );
      return data;
    } catch (reason) {
      setError(messageOf(reason));
      return null;
    }
  }, []);

  const toggleItem = useCallback(async (id: string) => {
    setError("");
    try {
      const { data } = await toggleBucketListItem(id);
      setItems((current) =>
        current.map((item) => (item.id === id ? data : item)),
      );
      return data;
    } catch (reason) {
      setError(messageOf(reason));
      return null;
    }
  }, []);

  const deleteItem = useCallback(async (id: string) => {
    setError("");
    try {
      await deleteBucketListItem(id);
      setItems((current) => current.filter((item) => item.id !== id));
      return true;
    } catch (reason) {
      setError(messageOf(reason));
      return false;
    }
  }, []);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    setLoadAttempt((attempt) => attempt + 1);
  }, []);

  const completed = items
    .filter((item) => item.isCompleted)
    .sort((a, b) => (b.completedAt ?? "").localeCompare(a.completedAt ?? ""));
  const pending = items.filter((item) => !item.isCompleted);

  return {
    items,
    completed,
    pending,
    loading,
    ready,
    error,
    retry,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
  };
}
