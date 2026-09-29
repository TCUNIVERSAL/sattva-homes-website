"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { BUILD_STAGES } from "./buildStages";
import styles from "./ProcessCards.module.css";

/** The build stages as sticky stacking cards. Used when the 3D build can't run. */
export default function ProcessCards() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const steps = gsap.utils.toArray<HTMLElement>(`.${styles.step}`);
    steps.slice(0, -1).forEach((s, i) => gsap.to(s, {
      scale: 0.94, filter: "brightness(.9)", ease: "none",
      scrollTrigger: { trigger: steps[i + 1], start: "top bottom", end: "top 30%", scrub: true },
    }));
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.proc} id="how-we-build" aria-label="How we build">
      <div className={styles.head}>
        <h2 className="display">From first <span className="serif">hello</span> to handing you the keys.</h2>
        <p>Five stages, one team. You always know what happens next.</p>
      </div>
      <div className={styles.stack}>
        {BUILD_STAGES.map((s, i) => (
          <article key={s.title} className={styles.step} style={{ "--i": i } as React.CSSProperties}>
            <span className={`serif ${styles.no}`}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display">{s.title}</h3>
            <p>{s.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
