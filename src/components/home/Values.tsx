"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { site } from "@/lib/site";
import styles from "./Values.module.css";

/** "Why build with Sattva": the five values from the client's current homepage. */
export default function Values() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    gsap.utils.toArray<HTMLElement>(`.${styles.row}`).forEach((row) => {
      gsap.from(row.children, {
        y: 40, opacity: 0.15, duration: 1, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: row, start: "top 88%" },
      });
    });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.values} id="why-sattva" aria-label="Why build with Sattva">
      <div className={styles.head}>
        <span className={`label ${styles.label}`}>Why build with Sattva</span>
        <h2 className="display">More than a place <span className="serif">to live.</span></h2>
        <p>
          Your home is a sanctuary where your aspirations come to life, your style finds expression and your vision
          becomes reality. This is how we get you there.
        </p>
      </div>
      <ul className={styles.list}>
        {site.values.map((v) => (
          <li key={v.title} className={styles.row}>
            <span className={`serif ${styles.kicker}`}>{v.kicker}</span>
            <h3 className="display">{v.title}</h3>
            <p>{v.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
