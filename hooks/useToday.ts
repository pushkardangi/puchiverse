"use client";

import { useSyncExternalStore } from "react";
import { localToday, msUntilNextLocalMidnight } from "@/lib/dates";

function subscribe(onChange: () => void) {
  let timer: number;
  const schedule = () => {
    timer = window.setTimeout(() => {
      onChange();
      schedule();
    }, msUntilNextLocalMidnight());
  };
  const onVisible = () => {
    if (document.visibilityState === "visible") onChange();
  };
  schedule();
  document.addEventListener("visibilitychange", onVisible);
  return () => {
    window.clearTimeout(timer);
    document.removeEventListener("visibilitychange", onVisible);
  };
}

const getSnapshot = () => localToday();
const getServerSnapshot = () => null;

/** Today's local date (YYYY-MM-DD). Null on the server so SSR never bakes in a date. */
export function useToday() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
