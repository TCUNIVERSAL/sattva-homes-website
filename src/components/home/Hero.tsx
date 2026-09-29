"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import BrisbaneClock from "@/components/ui/BrisbaneClock";
import { INTRO_DONE } from "./Preloader";
import styles from "./Hero.module.css";

const LETTERS = ["S", "A", "T", "T", "V", "A"];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** The house-shaped window (the logo's outline) opens to full screen as you scroll while the wordmark parts. */
export default function Hero({ designCount }: { designCount: number }) {
  const { enabled } = useMotion();
  const root = useRef<HTMLElement>(null);
  const win = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!enabled) return;
    const q = gsap.utils.selector(root);
    // Two copies of the wordmark (one under the window, one inside it), 6 letters each.
    const letters = q(`.${styles.word} [data-l]`);
    const n = (i: number) => i % LETTERS.length;
    const foot = q(`.${styles.foot} > *`);

    // Entrance: letters rise once the preloader lifts (or straight away if it's gone).
    gsap.set(letters, { yPercent: 110, opacity: 0 });
    gsap.set(foot, { y: 24, opacity: 0 });
    const intro = () => {
      gsap.to(letters, { yPercent: 0, opacity: 1, duration: 1.1, ease: "expo.out", delay: (i: number) => n(i) * 0.06 });
      gsap.to(foot, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", stagger: 0.08, delay: 0.25 });
    };
    if (document.querySelector("[data-preloader]")) window.addEventListener(INTRO_DONE, intro, { once: true });
    else intro();

    // Scroll: interpolate the house polygon out to the full viewport rectangle.
    const P = { p: 0 };
    const applyHouse = () => {
      const vw = window.innerWidth, vh = window.innerHeight, t = P.p;
      // Keep a house-like proportion on every screen; on phones the window is wider, not taller.
      const w0 = vw < 700 ? Math.min(vw * 0.64, 340) : Math.min(vw * 0.34, 500);
      const h0 = Math.min(vh * 0.6, w0 * 1.15, 560), roof = h0 * 0.34;
      const cx = vw / 2, top = (vh - h0) / 2 - vh * 0.03;
      const pts: [number, number, number, number][] = [
        [cx, top, cx, 0],
        [cx + w0 / 2, top + roof, vw, 0],
        [cx + w0 / 2, top + h0, vw, vh],
        [cx - w0 / 2, top + h0, 0, vh],
        [cx - w0 / 2, top + roof, 0, 0],
      ];
      win.current!.style.clipPath = `polygon(${pts.map(([x0, y0, x1, y1]) => `${lerp(x0, x1, t).toFixed(1)}px ${lerp(y0, y1, t).toFixed(1)}px`).join(",")})`;
    };
    applyHouse();
    window.addEventListener("resize", applyHouse);

    gsap.timeline({ scrollTrigger: { trigger: root.current, start: "top top", end: "+=140%", pin: true, scrub: 0.7 } })
      .to(P, { p: 1, ease: "power2.inOut", onUpdate: applyHouse, duration: 1 }, 0)
      .to(q(`.${styles.img}`), { scale: 1, ease: "power1.out", duration: 1 }, 0)
      .to(letters, { xPercent: (i: number) => (n(i) - 2.5) * 95, yPercent: (i: number) => (n(i) % 2 ? -40 : 40), opacity: 0, ease: "power2.in", duration: 0.6 }, 0)
      .to(q(`.${styles.foot}`), { opacity: 0, y: -30, duration: 0.3 }, 0)
      .fromTo(q(`.${styles.cap}`), { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.3 }, 0.7);

    return () => {
      window.removeEventListener("resize", applyHouse);
      window.removeEventListener(INTRO_DONE, intro);
      if (win.current) win.current.style.clipPath = "";
    };
  }, { scope: root, dependencies: [enabled], revertOnUpdate: true });

  return (
    <section ref={root} className={styles.hero} aria-label="Sattva Homes, Brisbane home builder">
      {/* Navy wordmark on ivory, under the window. The heading text for search engines and screen readers is the hidden line. */}
      <h1 className={styles.word}>
        <span className="visually-hidden">Sattva Homes: home builder in Brisbane. </span>
        {LETTERS.map((l, i) => <span key={i} data-l aria-hidden="true">{l}</span>)}
      </h1>

      <div ref={win} className={styles.win}>
        <div className={styles.img}>
          <Image src="/images/home/hero-springdale.jpg" alt="Springdale double storey home design by Sattva Homes, with a front verandah, balcony and double garage" fill priority quality={95} sizes="100vw" />
        </div>
        {/* ...and a copy clipped to the window, so the word stays on top of the photo (its colour is set in the CSS). */}
        <div className={`${styles.word} ${styles.wordIn}`} aria-hidden="true">
          {LETTERS.map((l, i) => <span key={i} data-l>{l}</span>)}
        </div>
      </div>

      <div className={styles.foot}>
        <p className={styles.tag}>Homes in <b>balance.</b></p>
        <p className={`label ${styles.mid}`}>
          <span>Brisbane home builder · {designCount} house designs</span>
          <BrisbaneClock fallback="Willawong, Brisbane" template={(t) => `${t} in Willawong`} />
        </p>
        <p className={`label ${styles.scroll}`}>Scroll <i /></p>
      </div>

      <div className={styles.cap}>
        <p className="label">Featured · Essence Series</p>
        <h2 className="display">Springdale</h2>
      </div>
    </section>
  );
}
