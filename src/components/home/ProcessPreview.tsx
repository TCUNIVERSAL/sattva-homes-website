import Link from "next/link";
import { BUILD_STAGES } from "./buildStages";
import styles from "./ProcessPreview.module.css";

/** The five steps at a glance. The full walkthrough, with the 3D house, is on /how-we-build. */
export default function ProcessPreview() {
  return (
    <section className={`section ${styles.process}`} aria-labelledby="process-title">
      <div className="section-head">
        <span className="eyebrow">How it works</span>
        <h2 id="process-title" className="display">From first plan <span className="serif">to handing over the keys.</span></h2>
        <p>Five clear steps, one team beside you. You always know what happens next.</p>
      </div>

      <ol className={styles.steps}>
        {BUILD_STAGES.map((s, i) => (
          <li key={s.title}>
            <span className={`serif ${styles.no}`}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className="display">{s.title}</h3>
            <p>{s.text}</p>
          </li>
        ))}
      </ol>

      <div className={styles.more}>
        <Link href="/how-we-build" className="btn btn-primary">See how we build</Link>
        <span>Watch a home take shape, stage by stage, in 3D.</span>
      </div>
    </section>
  );
}
