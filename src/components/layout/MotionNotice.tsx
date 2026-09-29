"use client";

import { useMotion } from "@/lib/motion";
import styles from "./MotionNotice.module.css";

/** Shown only when the device has reduced motion on, so visitors can choose to see the animations. */
export default function MotionNotice() {
  const { canOptIn, optIn } = useMotion();
  if (!canOptIn) return null;
  return (
    <div className={styles.bar} role="region" aria-label="Animation setting">
      <span>Animations are off on this device.</span>
      <button type="button" onClick={optIn}>Play animations</button>
    </div>
  );
}
