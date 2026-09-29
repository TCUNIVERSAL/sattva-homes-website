"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import type { Design, Series } from "@/types/design";
import { specParts } from "@/lib/designs";
import styles from "./Collection.module.css";

/** Featured designs. Scrolls sideways on wide screens, stacks on phones. */
export default function Collection({ designs, series, total }: { designs: Design[]; series: Series[]; total: number }) {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const mm = gsap.matchMedia();
    mm.add("(min-width: 901px)", () => {
      const t = track.current!;
      const dist = () => t.scrollWidth - window.innerWidth;
      const h = gsap.to(t, {
        x: () => -dist(), ease: "none",
        scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true },
      });
      gsap.to(`.${styles.bar} i`, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${dist()}`, scrub: true } });
      gsap.utils.toArray<HTMLElement>(`.${styles.ph} img`).forEach((img) => {
        gsap.fromTo(img, { xPercent: 6 }, {
          xPercent: -6, ease: "none",
          scrollTrigger: { trigger: img.closest(`.${styles.card}`), containerAnimation: h, start: "left right", end: "right left", scrub: true },
        });
      });
    });
    mm.add("(max-width: 900px)", () => {
      gsap.utils.toArray<HTMLElement>(`.${styles.card}`).forEach((c) =>
        gsap.from(c, { y: 60, opacity: 0.2, duration: 1, ease: "power3.out", scrollTrigger: { trigger: c, start: "top 90%" } }));
    });
    return () => mm.revert();
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.coll} id="collection" aria-label="The collection">
      <div ref={track} className={styles.track}>
        <div className={styles.intro}>
          <h2 className="display">Three series.<br /><span className={styles.nowrap}><span className="serif">{total}</span> homes.</span></h2>
          <p>Single and double storey designs for blocks from 4.5 m wide. Start with one you love, then make it yours.</p>
          <div className={styles.series}>
            {series.map((s) => (
              <Link key={s.id} href={`/designs?series=${s.id}`}><b>{s.name}</b><span>{s.count} designs</span></Link>
            ))}
          </div>
        </div>

        {designs.map((d, i) => (
          <Link key={d.slug} href={`/designs/${d.slug}`} className={styles.card}>
            <div className={styles.ph}>
              <Image src={d.image} alt={`${d.name} facade`} fill sizes="(max-width: 900px) 100vw, 34vw" />
            </div>
            <div className={styles.meta}>
              <h3 className="display">{d.name}</h3>
              <span className={`serif tabular ${styles.n}`}>{String(i + 1).padStart(2, "0")}</span>
            </div>
            <div className={styles.spec}>{specParts(d).map((s) => <span key={s}>{s}</span>)}</div>
          </Link>
        ))}

        <div className={styles.end}>
          <Link href="/designs">All {total} designs<small>find yours</small></Link>
        </div>
      </div>
      <div className={styles.bar} aria-hidden="true"><i /></div>
    </section>
  );
}
