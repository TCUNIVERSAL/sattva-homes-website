import Image from "next/image";
import Link from "next/link";
import type { Design } from "@/types/design";
import { SERIES_NAMES, formatArea, isWideImage } from "@/lib/designs";
import styles from "./DesignCard.module.css";

const SIZES = "(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw";

export default function DesignCard({ design: d }: { design: Design }) {
  const wide = isWideImage(d);
  return (
    <Link href={`/designs/${d.slug}`} className={styles.card}>
      <div className={`${styles.ph} ${wide ? styles.wide : ""}`}>
        {/* Wide panoramas show whole, over a soft blurred copy, instead of losing both ends of the house. */}
        {wide && <Image src={d.image} alt="" aria-hidden="true" fill sizes="30vw" className={styles.backdrop} />}
        <Image src={d.image} alt={`${d.name} facade`} fill sizes={SIZES} />
      </div>
      <div className={styles.meta}>
        <h3>{d.name}</h3>
        <span className="serif">{SERIES_NAMES[d.series]}</span>
      </div>
      <dl className={`tabular ${styles.spec}`}>
        <div><dt>Bed</dt><dd>{d.bedrooms}</dd></div>
        <div><dt>Bath</dt><dd>{d.bathrooms}</dd></div>
        <div><dt>Car</dt><dd>{d.garage ?? "–"}</dd></div>
        <div><dt>Area</dt><dd>{formatArea(d.areaM2)} m²</dd></div>
        <div><dt>Block from</dt><dd>{d.lotWidthM} m</dd></div>
      </dl>
    </Link>
  );
}
