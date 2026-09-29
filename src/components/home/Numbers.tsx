"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { site } from "@/lib/site";
import styles from "./Numbers.module.css";

const fmt = (n: number) => Math.round(n).toLocaleString("en-AU");

/** Company stats. The final values are in the HTML; motion only counts up to them. */
export default function Numbers() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count), o = { v: 0 };
      ScrollTrigger.create({
        trigger: el, start: "top 85%", once: true,
        onEnter: () => gsap.fromTo(o, { v: 0 }, { v: end, duration: 1.8, ease: "power3.out", onUpdate: () => { el.textContent = fmt(o.v); } }),
      });
    });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.nums} aria-label="Sattva in numbers">
      <div className={styles.head}>
        <h2 className="display">Built with <span className="serif">care,</span> one home at a time.</h2>
        <p>A growing Brisbane builder, and the numbers so far.</p>
      </div>
      <div className={styles.grid}>
        {site.stats.map((s) => (
          <div key={s.label}>
            <b className="tabular">
              {s.prefix}<span data-count={s.value}>{fmt(s.value)}</span><small>{s.suffix}</small>
            </b>
            <span>{s.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
