"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { getLenis, setLenis } from "@/lib/scroll";
import { INTRO_DONE } from "@/components/home/Preloader";

/** Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync. */
export default function SmoothScroll() {
  const { enabled } = useMotion();
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;
    const lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      setLenis(null);
    };
  }, [enabled]);

  // New page: start at the top and re-measure everything. A link to a section of another
  // page ("/#visit" from /contact) then jumps there, but only once the preloader is done and
  // the pinned sections have added their scroll space; before that the section isn't where
  // it will end up.
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    const id = requestAnimationFrame(() => ScrollTrigger.refresh());

    let jumped = false;
    const toHash = () => {
      if (jumped) return;
      jumped = true;
      const el = window.location.hash ? document.querySelector<HTMLElement>(window.location.hash) : null;
      if (!el) return;
      ScrollTrigger.refresh();
      const lenis = getLenis();
      // `force` because the preloader may still have Lenis paused.
      if (lenis) lenis.scrollTo(el, { immediate: true, force: true });
      else el.scrollIntoView();
    };
    const preloading = !!document.querySelector("[data-preloader]");
    if (preloading) window.addEventListener(INTRO_DONE, toHash, { once: true });
    // Safety net in case the intro event never comes (e.g. it finished before this ran).
    const timer = window.setTimeout(toHash, preloading ? 4000 : 60);

    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timer);
      window.removeEventListener(INTRO_DONE, toHash);
    };
  }, [pathname]);

  return null;
}
