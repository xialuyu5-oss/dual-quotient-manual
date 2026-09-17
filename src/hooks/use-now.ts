"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * Current time, bucketed to `intervalMs`, as an external store. Returns null on
 * the server and during hydration so date-dependent UI never mismatches.
 */
export function useNow(intervalMs = 60_000): Date | null {
  const subscribe = useCallback(
    (listener: () => void) => {
      const id = window.setInterval(listener, intervalMs);
      return () => window.clearInterval(id);
    },
    [intervalMs],
  );

  const getSnapshot = useCallback(
    () => Math.floor(Date.now() / intervalMs) * intervalMs,
    [intervalMs],
  );

  const bucket = useSyncExternalStore(subscribe, getSnapshot, () => 0);
  return bucket === 0 ? null : new Date(bucket);
}
