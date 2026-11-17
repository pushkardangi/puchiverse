import { useCallback, useSyncExternalStore } from "react";

const millisecondsPerDay = 86_400_000;

function subscribe(onChange: () => void) {
  const timer = setInterval(onChange, 60_000);
  return () => clearInterval(timer);
}

function getServerSnapshot() {
  return null;
}

export function useCountdown(targetDate: string) {
  const getSnapshot = useCallback(
    () => Math.max(0, Math.ceil((new Date(targetDate).getTime() - Date.now()) / millisecondsPerDay)),
    [targetDate],
  );

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
