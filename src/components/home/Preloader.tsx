"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { getLenis } from "@/lib/scroll";
import styles from "./Preloader.module.css";

export const INTRO_DONE = "sattva:intro-done";

/**
 * The logo mark builds up from the ground while counting to 100, then the curtain lifts.
 * Rendered on the server so there's no flash of the page underneath; removed at once
 * when motion is off (and hidden by a <noscript> style when JavaScript is off).
 */
export default function Preloader() {
  const { ready, enabled } = useMotion();
  const [done, setDone] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    if (!ready || done) return;
    const finish = () => { setDone(true); window.dispatchEvent(new Event(INTRO_DONE)); };
    if (!enabled) { finish(); return; }

    const mark = root.current!.querySelector(`.${styles.mark}`);
    const n = { v: 0 };
    getLenis()?.stop();
    gsap.timeline({ onComplete: () => { getLenis()?.start(); finish(); } })
      .fromTo(mark, { clipPath: "inset(100% 0 0 0)" }, { clipPath: "inset(0% 0 0 0)", duration: 1.15, ease: "power2.inOut" }, 0)
      .to(n, { v: 100, duration: 1.2, ease: "power2.inOut", onUpdate: () => { if (count.current) count.current.textContent = String(Math.round(n.v)); } }, 0)
      .to(root.current, { yPercent: -100, duration: 0.9, ease: "expo.inOut" }, 1.35)
      // Let the hero start its entrance while the curtain is still lifting.
      .call(() => window.dispatchEvent(new Event(INTRO_DONE)), [], 1.6);
  }, { dependencies: [ready, enabled] });

  if (done) return null;
  return (
    <>
      <noscript><style>{`.${styles.pre}{display:none}`}</style></noscript>
      <div ref={root} className={styles.pre} aria-hidden="true" data-preloader>
        <Image className={styles.mark} src="/images/brand/sattva-mark.png" alt="" width={452} height={448} priority />
        <span className={`label ${styles.word}`}>Sattva Homes · Brisbane</span>
        <span ref={count} className={`tabular ${styles.count}`}>0</span>
      </div>
    </>
  );
}
