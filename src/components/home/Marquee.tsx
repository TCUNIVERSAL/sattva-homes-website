"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import styles from "./Marquee.module.css";

const WORDS = ["BALANCE", "CLARITY", "CALM"];

/** Endless banner that speeds up, reverses and leans with the scroll. */
export default function Marquee() {
  const { enabled } = useMotion();
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const loop = gsap.to(track.current, { xPercent: -50, repeat: -1, duration: 28, ease: "none" });
    const skew = gsap.quickTo(track.current, "skewX", { duration: 0.5, ease: "power3" });
    ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity(), dir = self.direction;
        gsap.to(loop, {
          timeScale: dir * (1 + Math.min(Math.abs(v) / 400, 5)), duration: 0.2, overwrite: true,
          onComplete: () => { gsap.to(loop, { timeScale: dir, duration: 1.2 }); },
        });
        skew(gsap.utils.clamp(-12, 12, v / -220));
      },
    });
    const settle = () => skew(0);
    ScrollTrigger.addEventListener("scrollEnd", settle);
    return () => ScrollTrigger.removeEventListener("scrollEnd", settle);
  }, { dependencies: [enabled], revertOnUpdate: true });

  // Two identical halves so the -50% loop is seamless.
  const words = [...WORDS, ...WORDS, ...WORDS, ...WORDS];
  return (
    <div className={styles.mq} aria-hidden="true">
      <div ref={track} className={styles.track}>
        {words.map((w, i) => <span key={i}>{w}</span>)}
      </div>
    </div>
  );
}
