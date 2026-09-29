"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import { site, addressLine } from "@/lib/site";
import MagneticButton from "@/components/ui/MagneticButton";
import styles from "./Visit.module.css";


export default function Visit() {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    gsap.from(`.${styles.title}`, { yPercent: 30, opacity: 0.2, duration: 1.2, ease: "expo.out", scrollTrigger: { trigger: root.current, start: "top 70%" } });
    gsap.to(`.${styles.bg}`, { yPercent: 8, ease: "none", scrollTrigger: { trigger: root.current, start: "top bottom", end: "bottom top", scrub: true } });
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.visit} id="visit" aria-label="Visit our Willawong display home">
      <div className={styles.bg} aria-hidden="true">
        <Image src="/images/home/windermere.jpg" alt="" fill sizes="100vw" />
      </div>
      <h2 className={`display ${styles.title}`}>Visit our<br />display <span className="serif">home.</span></h2>
      <p className={styles.intro}>{site.displayHomeIntro}</p>
      <div className={styles.row}>
        <MagneticButton href="/contact?enquiry=visit" className={styles.mag}>Book a<br />visit</MagneticButton>
        <dl className={styles.info}>
          <div><dt className="label">Display home</dt><dd>{addressLine}</dd></div>
          <div><dt className="label">Open</dt><dd>{site.hours.map((h) => <span key={h.days}>{h.days} {h.time}<br /></span>)}</dd></div>
          <div><dt className="label">Call</dt><dd><a className="tabular" href={site.phoneHref}>{site.phone}</a></dd></div>
          <div><dt className="label">Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
        </dl>
      </div>
    </section>
  );
}
