import { site } from "@/lib/site";
import styles from "./WhySattva.module.css";

// Draft copy built from the marketing brief ("clarity before commitment, a home delivered as agreed").
const WITHOUT = [
  "Not knowing what's included until it's too late",
  "Changes and costs that only appear mid-build",
  "Chasing the builder for updates",
  "Feeling like just another job number",
];
const WITH = [
  "Plans, choices and contract made clear before you commit",
  "Your home delivered as agreed",
  "Clear communication from first plans to final walkthrough",
  "Personal service from a team that knows your build",
];

// "Affordable Luxury" is left out: the brief says Sattva doesn't compete on the lowest price.
const VALUES = site.values.filter((v) => v.title !== "Affordable Luxury");

/** The promise, set against what usually worries buyers, then the values that back it up. */
export default function WhySattva() {
  return (
    <section className={`section ${styles.why}`} aria-labelledby="why-title">
      <div className="section-head">
        <span className="eyebrow">Why Sattva Homes</span>
        <h2 id="why-title" className="display">A home is a big commitment. <span className="serif">It shouldn&apos;t be a guessing game.</span></h2>
        <p>Building a home is one of the biggest decisions you&apos;ll make. We keep every step clear before you commit, and we deliver your home as agreed.</p>
      </div>

      <div className={styles.compare}>
        <div className={styles.without}>
          <h3>Building without clarity</h3>
          <ul>{WITHOUT.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
        <div className={styles.with}>
          <h3>Building with Sattva</h3>
          <ul>{WITH.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>

      <ul className={styles.values}>
        {VALUES.map((v) => (
          <li key={v.title}>
            <span className={`serif ${styles.kicker}`}>{v.kicker}</span>
            <h3 className="display">{v.title}</h3>
            <p>{v.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
