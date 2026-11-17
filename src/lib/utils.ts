import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Fixed walkthrough clock so overdue/demo timing stays stable. */
export const DEMO_CLOCK_MS = Date.parse("2026-11-18T14:00:00.000Z");

export function formatTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function minutesFromNow(minutes: number) {
  return new Date(DEMO_CLOCK_MS + minutes * 60_000).toISOString();
}

export function uid(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}
