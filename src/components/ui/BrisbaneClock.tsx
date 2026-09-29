"use client";

import { useSyncExternalStore } from "react";

// Queensland has no daylight saving, so this is always AEST.
const format = new Intl.DateTimeFormat("en-AU", { timeZone: "Australia/Brisbane", hour: "numeric", minute: "2-digit", hour12: true });

function brisbaneTime() {
  return format.format(new Date()).replace(/\s?([ap])\.?m\.?/i, " $1m").toLowerCase();
}

function subscribe(cb: () => void) {
  const id = window.setInterval(cb, 20_000);
  return () => window.clearInterval(id);
}

/** Live Brisbane time. Renders the fallback on the server so hydration always matches. */
export default function BrisbaneClock({ template, fallback }: { template: (time: string) => string; fallback: string }) {
  const time = useSyncExternalStore(subscribe, brisbaneTime, () => null);
  return <span className="tabular">{time ? template(time) : fallback}</span>;
}
