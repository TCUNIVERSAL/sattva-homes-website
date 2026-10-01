import Link from "next/link";
import DesignCard from "@/components/designs/DesignCard";
import { getAllDesigns, getFeaturedDesigns, getSeries } from "@/lib/designs";
import styles from "./HomeDesigns.module.css";

/** The three series and a few featured designs, as a plain grid. */
export default function HomeDesigns() {
  const all = getAllDesigns();
  const featured = getFeaturedDesigns().slice(0, 6);
  const series = getSeries().map((s) => {
    const inSeries = all.filter((d) => d.series === s.id);
    const single = inSeries.filter((d) => d.storeys === 1).length;
    return { ...s, single, double: inSeries.length - single };
  });

  return (
    <section className={`section ${styles.designs}`} id="designs" aria-labelledby="designs-title">
      <div className="section-head">
        <span className="eyebrow">Our homes</span>
        <h2 id="designs-title" className="display">Three series. <span className="serif">{all.length} house designs.</span></h2>
        <p>Premium single and double storey homes designed for Queensland blocks and the Brisbane lifestyle. Start with a floor plan you love, then make it yours.</p>
      </div>

      <div className={styles.series}>
        {series.map((s) => (
          <Link key={s.id} href={`/designs?series=${s.id}`} className={styles.seriesCard}>
            <span className="eyebrow">{s.name} Series</span>
            <b className="display">{s.count} designs</b>
            <span className={styles.mix}>
              {[s.single && `${s.single} single storey`, s.double && `${s.double} double storey`].filter(Boolean).join(" · ")}
            </span>
            <span className={styles.arrow} aria-hidden="true">View series →</span>
          </Link>
        ))}
      </div>

      <div className={styles.grid}>
        {featured.map((d) => <DesignCard key={d.slug} design={d} />)}
      </div>

      <div className={styles.more}>
        <Link href="/designs" className="btn btn-primary">Browse all {all.length} designs</Link>
      </div>
    </section>
  );
}
