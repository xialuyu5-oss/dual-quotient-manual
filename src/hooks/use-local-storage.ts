"use client";

import { useCallback, useSyncExternalStore } from "react";

type Listener = () => void;

const listeners = new Map<string, Set<Listener>>();
const snapshots = new Map<string, { raw: string | null; value: unknown }>();

function readRaw(key: string): string | null {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function notify(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function subscribe(key: string, listener: Listener) {
  let set = listeners.get(key);
  if (!set) {
    set = new Set();
    listeners.set(key, set);
  }
  set.add(listener);

  const onStorage = (event: StorageEvent) => {
    if (event.key === key || event.key === null) listener();
  };
  window.addEventListener("storage", onStorage);

  return () => {
    set?.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

/**
 * localStorage-backed state that is safe for server rendering: the server (and
 * the first client render during hydration) sees `fallback`, then the real
 * value is swapped in via useSyncExternalStore without a setState-in-effect.
 */
export function useLocalStorage<T>(
  key: string,
  fallback: T,
  normalize: (parsed: unknown) => T,
): [T, (update: T | ((prev: T) => T)) => void] {
  const getSnapshot = useCallback((): T => {
    const raw = readRaw(key);
    const cached = snapshots.get(key);
    if (cached && cached.raw === raw) return cached.value as T;

    let value: T = fallback;
    if (raw !== null) {
      try {
        value = normalize(JSON.parse(raw));
      } catch {
        value = fallback;
      }
    }
    snapshots.set(key, { raw, value });
    return value;
  }, [key, fallback, normalize]);

  const getServerSnapshot = useCallback(() => fallback, [fallback]);

  const value = useSyncExternalStore(
    useCallback((listener: Listener) => subscribe(key, listener), [key]),
    getSnapshot,
    getServerSnapshot,
  );

  const setValue = useCallback(
    (update: T | ((prev: T) => T)) => {
      const prev = getSnapshot();
      const next =
        typeof update === "function" ? (update as (prev: T) => T)(prev) : update;
      const raw = JSON.stringify(next);
      try {
        window.localStorage.setItem(key, raw);
      } catch {
        // Storage may be unavailable; keep the in-memory snapshot so the UI still updates.
      }
      snapshots.set(key, { raw, value: next });
      notify(key);
    },
    [key, getSnapshot],
  );

  return [value, setValue];
}

const noopSubscribe = () => () => {};

/** True after hydration; false during server render and the hydration pass. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
