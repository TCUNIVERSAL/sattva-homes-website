"use client";

import type Lenis from "lenis";

// The active Lenis instance (null when smooth scrolling is off), shared so any
// component can pause scrolling or scroll to a section.
let instance: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  instance = l;
}

export function getLenis(): Lenis | null {
  return instance;
}

/** Smooth-scroll back to the top of the page. */
export function scrollToTop() {
  if (instance) instance.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", "/");
}

/** Smooth-scroll to a same-page target like "#visit". Falls back to native scrolling. */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  if (instance) instance.scrollTo(el as HTMLElement, { duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
  return true;
}
