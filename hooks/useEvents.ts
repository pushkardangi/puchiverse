"use client";

import { useCallback, useEffect, useState } from "react";
import type { EventInput, SharedEvent } from "@/lib/event-types";
import { releaseImagePreview } from "@/lib/imageStorage";

async function request<T>(method: string, body?: object, signal?: AbortSignal): Promise<T> {
  const response = await fetch("/api/events", {
    method, signal, cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || "Could not save your events. Please try again.");
  return result as T;
}

export function useEvents() {
  const [events, setEvents] = useState<SharedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    request<{ data: SharedEvent[] }>("GET", undefined, controller.signal)
      .then(({ data }) => { setEvents(data); setReady(true); })
      .catch((reason: unknown) => {
        if (!controller.signal.aborted) setError(reason instanceof Error ? reason.message : "Could not load your events.");
      })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [revision]);

  const save = useCallback(async (input: EventInput, id?: string): Promise<SharedEvent | null> => {
    setError("");
    try {
      const storable = input.tag === "milestone" ? { ...input, image: null } : input;
      const { data } = await request<{ data: SharedEvent }>(id ? "PUT" : "POST", { id, event: storable });
      const saved = input.tag === "milestone" && data.tag === "milestone" ? { ...data, image: input.image } : data;
      setEvents((current) => id ? current.map((event) => event.id === id ? saved : event) : [...current, saved]);
      return saved;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your event.");
      return null;
    }
  }, []);

  const remove = useCallback(async (id: string) => {
    setError("");
    try {
      await request("DELETE", { id });
      const event = events.find((item) => item.id === id);
      if (event?.tag === "milestone") releaseImagePreview(event.image);
      setEvents((current) => current.filter((item) => item.id !== id));
      return true;
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete your event.");
      return false;
    }
  }, [events]);

  const retry = useCallback(() => {
    setError("");
    setLoading(true);
    setRevision((value) => value + 1);
  }, []);

  return { events, loading, ready, error, save, remove, retry };
}
