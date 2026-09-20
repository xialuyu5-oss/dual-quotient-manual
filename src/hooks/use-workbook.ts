"use client";

import { useSyncExternalStore } from "react";
import { EMPTY_WORKBOOK, WORKSHOP_KEY, parseWorkbook, type WorkbookStore } from "@/lib/workshop/records";

type Snapshot = { store: WorkbookStore; issue: "" | "unavailable" | "invalid" };
const initial: Snapshot = { store: EMPTY_WORKBOOK, issue: "" };
let snapshot = initial;
let lastRaw: string | null | undefined;
let pending = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach(listener => listener());

function read(): Snapshot {
  if (pending) return snapshot;
  try {
    const raw = window.localStorage.getItem(WORKSHOP_KEY);
    if (raw !== lastRaw) {
      lastRaw = raw;
      try { snapshot = { store: raw ? parseWorkbook(raw) : EMPTY_WORKBOOK, issue: "" }; }
      catch { snapshot = { store: snapshot.store, issue: "invalid" }; }
    }
  } catch {
    if (snapshot.issue !== "unavailable") snapshot = { ...snapshot, issue: "unavailable" };
  }
  return snapshot;
}
function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === WORKSHOP_KEY || event.key === null) {
      // Keep unsaved work in this tab if persistence has failed.
      if (!pending) { lastRaw = undefined; emit(); }
    }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(listener); window.removeEventListener("storage", onStorage); };
}
function write(update: (store: WorkbookStore) => WorkbookStore): boolean {
  const previous = read();
  const store = update(previous.store);
  if (previous.issue === "invalid") {
    snapshot = { store, issue: "invalid" };
    pending = true;
    emit();
    return false;
  }
  const raw = JSON.stringify(store);
  try {
    window.localStorage.setItem(WORKSHOP_KEY, raw);
    lastRaw = raw;
    pending = false;
    snapshot = { store, issue: "" };
  } catch {
    pending = true;
    snapshot = { store, issue: "unavailable" };
  }
  emit();
  return !snapshot.issue;
}

export function useWorkbook() {
  const current = useSyncExternalStore(subscribe, read, () => initial);
  return { ...current, write };
}
