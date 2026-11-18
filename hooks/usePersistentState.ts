"use client";

import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type Options<T> = {
  key: string;
  fallback: T;
  validate: (value: unknown) => value is T;
  /** Strips anything that must not be written to storage (e.g. temporary image URLs). */
  toStorable?: (value: T) => T;
};

/**
 * localStorage-backed state that renders the fallback on the server and first
 * client paint (no hydration mismatch), then loads saved data after mount.
 */
export function usePersistentState<T>({ key, fallback, validate, toStorable }: Options<T>): {
  value: T;
  setValue: Dispatch<SetStateAction<T>>;
  ready: boolean;
  error: string;
} {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem(key);
        if (saved) {
          const parsed: unknown = JSON.parse(saved);
          if (validate(parsed)) setValue(parsed);
          else setError("Some saved details could not be read, so the defaults are shown.");
        }
      } catch {
        setError("Saved details could not be loaded, so the defaults are shown.");
      } finally {
        setReady(true);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [key, validate]);

  useEffect(() => {
    if (!ready) return;
    let errorTimer: number | undefined;
    try {
      window.localStorage.setItem(key, JSON.stringify(toStorable ? toStorable(value) : value));
    } catch {
      errorTimer = window.setTimeout(() => setError("Changes are visible now, but this browser could not save them for later."), 0);
    }
    return () => {
      if (errorTimer) window.clearTimeout(errorTimer);
    };
  }, [key, ready, toStorable, value]);

  return { value, setValue, ready, error };
}
