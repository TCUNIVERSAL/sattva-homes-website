import { site } from "@/lib/site";
import styles from "./Numbers.module.css";

const fmt = (n: number) => n.toLocaleString("en-AU");

/** Company stats from the current site (confirm with the client before launch). */
export default function Numbers() {
  return (
    <section className={`section ${styles.nums}`} aria-labelledby="numbers-title">
      <div className={styles.head}>
        <span className="eyebrow">Our track record</span>
        <h2 id="numbers-title" className="display">Built with <span className="serif">care,</span> one home at a time.</h2>
        <p>A growing Brisbane home builder, and the new homes we&apos;ve delivered so far.</p>
      </div>
      <dl className={styles.grid}>
        {site.stats.map((s) => (
          <div key={s.label}>
            <dt>{s.label}</dt>
            <dd className="tabular">{s.prefix}{fmt(s.value)}<small>{s.suffix}</small></dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
