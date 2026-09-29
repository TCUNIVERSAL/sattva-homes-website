"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useMotion } from "@/lib/motion";
import type { HouseScene } from "@/components/three/houseScene";
import ProcessCards from "./ProcessCards";
import { BUILD_STAGES } from "./buildStages";
import styles from "./Build.module.css";

const PIN_LENGTH = "+=520%";

function webglSupported() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}
// Read once on the client; the server renders the static fallback.
const subscribe = () => () => {};
const useWebGL = () => useSyncExternalStore(subscribe, webglSupported, () => false);

/**
 * "Watch it get built": a pinned section where scrolling builds a 3D house stage by stage.
 * Falls back to stacked process cards without motion or WebGL.
 */
export default function Build() {
  const { enabled } = useMotion();
  const webgl = useWebGL();
  if (!enabled || !webgl) return <ProcessCards />;
  return <BuildScene />;
}

function BuildScene() {
  const root = useRef<HTMLElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const bars = useRef<(HTMLElement | null)[]>([]);
  const [stage, setStage] = useState(0);

  useGSAP(() => {
    let scene: HouseScene | null = null;
    let cancelled = false;
    let target = 0, progress = 0, dirty = true, current = 0;

    // The pin is created now, in page order, so later sections measure correctly.
    // Three.js loads in the background and starts drawing when ready.
    ScrollTrigger.create({ trigger: root.current, start: "top top", end: PIN_LENGTH, pin: true, onUpdate: (st) => { target = st.progress; } });

    const resize = () => {
      const c = canvas.current;
      if (!scene || !c || !c.clientWidth || !c.clientHeight) return;
      // Landscape screens put the text beside the house; portrait screens put it below.
      scene.resize(c.clientWidth, c.clientHeight, c.clientWidth / c.clientHeight > 1.2 ? "wide" : "narrow");
      dirty = true;
    };

    import("@/components/three/houseScene").then(({ createHouseScene }) => {
      if (cancelled || !canvas.current) return;
      scene = createHouseScene(canvas.current);
      resize();
      scene.update(progress);
    });

    const tick = () => {
      if (Math.abs(target - progress) > 0.0004) {
        progress += (target - progress) * 0.12;
        scene?.update(progress);
        dirty = true;
        bars.current.forEach((b, j) => { if (b) b.style.transform = `scaleX(${Math.min(1, Math.max(0, (progress - j * 0.2) / 0.2)).toFixed(3)})`; });
        const i = Math.min(4, Math.floor(progress / 0.2 + 1e-4));
        if (i !== current) { current = i; setStage(i); }
      }
      // Only draw while the canvas is on screen.
      const r = canvas.current?.getBoundingClientRect();
      if (scene && dirty && r && r.bottom > 0 && r.top < window.innerHeight) { scene.render(); dirty = false; }
    };
    gsap.ticker.add(tick);
    window.addEventListener("resize", resize);

    return () => {
      cancelled = true;
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", resize);
      scene?.dispose();
    };
  }, { scope: root });

  return (
    <section ref={root} className={`${styles.build} ${stage === 4 ? styles.night : ""}`} id="how-we-build" aria-label="Watch a Sattva home get built">
      <canvas ref={canvas} className={styles.canvas} aria-hidden="true" />
      <div className={styles.ui}>
        <span className={`label ${styles.label}`}>Watch it get built</span>
        <div className={styles.stages}>
          {BUILD_STAGES.map((s, i) => (
            <div key={s.title} className={`${styles.stage} ${i === stage ? styles.on : ""}`} aria-hidden={i !== stage}>
              <span className="serif">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="display">{s.title}</h2>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
        <div className={styles.prog} aria-hidden="true">
          {BUILD_STAGES.map((s, i) => <span key={s.short}><i ref={(el) => { bars.current[i] = el; }} /></span>)}
        </div>
        <div className={styles.progLabels} aria-hidden="true">
          {BUILD_STAGES.map((s, i) => <span key={s.short} className={i === stage ? styles.on : ""}>{s.short}</span>)}
        </div>
      </div>
      <span className={`label ${styles.hint}`}>Keep scrolling to build</span>
    </section>
  );
}
