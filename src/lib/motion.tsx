"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from "react";

// Motion is on unless the device asks for reduced motion. Visitors with reduced motion
// can still opt in (the site is built around its animations); that choice is remembered.
const STORAGE_KEY = "sattva-motion";
const QUERY = "(prefers-reduced-motion: reduce)";

interface MotionState {
  /** False during server render and hydration, until the device setting is known. */
  ready: boolean;
  /** Whether scroll animations should run. */
  enabled: boolean;
  /** Device prefers reduced motion and the visitor hasn't opted in. */
  canOptIn: boolean;
  optIn: () => void;
}

const MotionContext = createContext<MotionState>({ ready: false, enabled: false, canOptIn: false, optIn: () => {} });

const noopSubscribe = () => () => {};

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

// Opt-in lives in localStorage; listeners are notified when this tab changes it.
const optInListeners = new Set<() => void>();
function subscribeOptIn(cb: () => void) {
  optInListeners.add(cb);
  window.addEventListener("storage", cb);
  return () => { optInListeners.delete(cb); window.removeEventListener("storage", cb); };
}
function readOptIn() {
  try { return window.localStorage.getItem(STORAGE_KEY) === "on"; } catch { return false; }
}

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(QUERY).matches, () => false);
  const optedIn = useSyncExternalStore(subscribeOptIn, readOptIn, () => false);

  const optIn = useCallback(() => {
    try { window.localStorage.setItem(STORAGE_KEY, "on"); } catch {}
    window.scrollTo(0, 0);
    optInListeners.forEach((cb) => cb());
  }, []);

  const value = useMemo<MotionState>(() => ({
    ready,
    enabled: ready && (!reduced || optedIn),
    canOptIn: ready && reduced && !optedIn,
    optIn,
  }), [ready, reduced, optedIn, optIn]);

  // Lets CSS switch between the static and animated layouts.
  useEffect(() => {
    document.documentElement.classList.toggle("motion", value.enabled);
  }, [value.enabled]);

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}
