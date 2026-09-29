"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import BrisbaneClock from "@/components/ui/BrisbaneClock";
import styles from "./DayAtHome.module.css";

const MOMENTS = [
  {
    time: "6:40 am",
    title: "Morning.",
    text: "Coffee at a long stone bench, with light down the whole kitchen before anyone else is up.",
    image: "/images/home/kitchen-placeholder.jpg",
    alt: "Kitchen with long stone bench and timber floors",
  },
  {
    time: "3:15 pm",
    title: "Afternoon.",
    text: "Kids home from school, doors open, and a verandah deep enough for a Brisbane storm.",
    image: "/images/home/springdale-verandah.jpg",
    alt: "Deep front verandah on the Springdale design",
  },
  {
    time: "7:30 pm",
    title: "Evening.",
    text: "Lights on, balcony doors open, and the whole house glowing as the street goes quiet.",
    image: "/images/home/gardenwood-balcony-dusk.jpg",
    alt: "Upper balcony of the Gardenwood design lit at dusk",
  },
];

/** A sticky time of day that changes as each moment scrolls past. */
export default function DayAtHome() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(() => {
    if (!enabled) return;
    gsap.utils.toArray<HTMLElement>(`.${styles.moment}`).forEach((m, i) => {
      ScrollTrigger.create({ trigger: m, start: "top 55%", end: "bottom 55%", onToggle: (st) => { if (st.isActive) setActive(i); } });
      gsap.fromTo(m.querySelector("img"), { yPercent: -8 }, {
        yPercent: 0, ease: "none", scrollTrigger: { trigger: m, start: "top bottom", end: "bottom top", scrub: true },
      });
    });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.day} id="living" aria-label="A day at home">
      <div className={styles.stick}>
        <span className={`label ${styles.label}`}>
          A day in a Sattva home
          <BrisbaneClock fallback="" template={(t) => ` · it's ${t} in Brisbane`} />
        </span>
        <div className={styles.times} aria-hidden="true">
          {MOMENTS.map((m, i) => (
            <div key={m.time} className={`serif ${i === active ? styles.on : ""} ${i < active ? styles.past : ""}`}>{m.time}</div>
          ))}
        </div>
        <h2>Designed around the way your day actually goes.</h2>
      </div>
      <div className={styles.list}>
        {MOMENTS.map((m) => (
          <article key={m.time} className={styles.moment}>
            <div className={styles.ph}>
              <Image src={m.image} alt={m.alt} fill quality={90} sizes="(max-width: 900px) 100vw, 55vw" />
            </div>
            <p><b>{m.title}</b> {m.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
