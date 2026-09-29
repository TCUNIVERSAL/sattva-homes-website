"use client";

import Image from "next/image";
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

/**
 * An editorial split: a tall photo on one side, the statement on the other. The photo opens
 * up as the section arrives and the words brighten one by one as you read down.
 */
export default function Manifesto() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const q = gsap.utils.selector(root);

    // Words: one timeline, placed strictly in reading order, scrubbed by scroll.
    const words = q(`.${styles.w}`);
    const tl = gsap.timeline({
      scrollTrigger: { trigger: q(`.${styles.text}`)[0], start: "top 78%", end: "bottom 50%", scrub: true },
    });
    words.forEach((w, i) => tl.fromTo(w, { opacity: 0.16 }, { opacity: 1, duration: 1, ease: "none" }, i * 0.5));

    // Photo: opens from a narrow slit, then drifts slower than the page.
    gsap.fromTo(q(`.${styles.photo}`), { clipPath: "inset(12% 18% 12% 18% round 6px)" }, {
      clipPath: "inset(0% 0% 0% 0% round 6px)", ease: "none",
      scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: true },
    });
    gsap.fromTo(q(`.${styles.photo} img`), { yPercent: -7 }, {
      yPercent: 7, ease: "none",
      scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true },
    });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.mani} aria-label="What we believe">
      <figure className={styles.photo}>
        <Image src="/images/designs/gardenwood.jpg" alt="Gardenwood double storey home lit at dusk" fill quality={90}
          sizes="(max-width: 900px) 100vw, 44vw" />
      </figure>

      <div className={styles.copy}>
        <span className={`label ${styles.label}`}>What we believe</span>
        <p className={styles.text}>
          {TEXT.flatMap((seg, i) =>
            seg.text.split(" ").map((word, j) => (
              <span key={`${i}-${j}`} className={`${styles.w} ${seg.accent ? "serif" : ""}`}>{word} </span>
            )),
          )}
        </p>
      </div>
    </section>
  );
}
