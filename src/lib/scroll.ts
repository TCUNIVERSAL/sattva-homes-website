"use client";

/** Smooth-scroll back to the top of the page. */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
  history.replaceState(null, "", "/");
}

/** Smooth-scroll to a same-page target like "#visit". Returns false when it isn't on this page. */
export function scrollToHash(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth" });
  history.replaceState(null, "", hash);
  return true;
}
