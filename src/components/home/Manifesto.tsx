"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import styles from "./Manifesto.module.css";

// Segments marked `accent` are set in the serif italic.
const TEXT: { text: string; accent?: boolean }[] = [
  { text: "A home should" }, { text: "feel", accent: true }, { text: "right the moment you walk in. Light where you wake. Room where you" },
  { text: "gather.", accent: true }, { text: "Quiet where you rest. That balance is what" }, { text: "sattva", accent: true },
  { text: "means, and it's what we build." },
];

/** Words brighten one by one as the paragraph scrolls through the viewport. */
export default function Manifesto() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const words = gsap.utils.toArray<HTMLElement>(`.${styles.w}`, root.current);
    gsap.fromTo(words, { opacity: 0.16 }, {
      opacity: 1, stagger: 0.12, ease: "none",
      scrollTrigger: { trigger: `.${styles.text}`, start: "top 80%", end: "bottom 45%", scrub: true },
    });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.mani} aria-label="What we believe">
      <span className={`label ${styles.label}`}>What we believe</span>
      <p className={styles.text}>
        {TEXT.flatMap((seg, i) =>
          seg.text.split(" ").map((word, j) => (
            <span key={`${i}-${j}`} className={`${styles.w} ${seg.accent ? "serif" : ""}`}>{word} </span>
          )),
        )}
      </p>
    </section>
  );
}
