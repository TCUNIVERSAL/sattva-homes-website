import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { getAllDesigns } from "@/lib/designs";
import styles from "./HomeHero.module.css";

/**
 * The first screen says what Sattva is and what it promises, then offers the two next steps.
 * No animation: the brand brief asks for clarity, not effects.
 */
export default function HomeHero() {
  const total = getAllDesigns().length;
  const [completed, building] = site.stats;
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.copy}>
        <h1 id="hero-title" className="display">
          Clarity before commitment. <span className="serif">A Brisbane home, delivered as agreed.</span>
        </h1>
        <p className={styles.lede}>
          Sattva Homes designs and builds premium homes for Queensland living. Choose from {total} single and
          double storey designs, with clear communication from your first plan to the day you get the keys.
        </p>
        <div className={styles.actions}>
          <Link href="/designs" className="btn btn-primary">Explore {total} designs</Link>
          <Link href="/#visit" className="btn btn-secondary">Book a display home visit</Link>
        </div>
        <ul className={styles.ticks}>
          <li>Three series: Essence, Horizon, Meadowline</li>
          <li>Single and double storey</li>
          <li>Display home open 7 days</li>
        </ul>
      </div>

      <div className={styles.visual}>
        <div className={styles.photo}>
          <Image src="/images/home/hero-springdale.jpg" priority quality={95} fill
            alt="Springdale double storey home design by Sattva Homes, with a front verandah, balcony and double garage"
            sizes="(max-width: 900px) 100vw, 48vw" />
        </div>
        <div className={`${styles.card} ${styles.cardBottom}`}>
          <span className={styles.cardLabel}>Track record</span>
          <b className="tabular">{completed.value}{completed.suffix} {completed.label.toLowerCase()}</b>
          <span className="tabular">and {building.value}{building.suffix} being built right now</span>
        </div>
      </div>
    </section>
  );
}
