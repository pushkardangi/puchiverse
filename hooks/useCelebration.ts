"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Briefly flags one item id (e.g. a just-completed wish) so it can play a small celebration. */
export function useCelebration(durationMs = 1400) {
  const [id, setId] = useState<string>();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const celebrate = useCallback((nextId: string) => {
    window.clearTimeout(timer.current);
    setId(nextId);
    timer.current = window.setTimeout(() => setId(undefined), durationMs);
  }, [durationMs]);

  return [id, celebrate] as const;
}
