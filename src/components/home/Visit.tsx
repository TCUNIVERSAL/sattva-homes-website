import Image from "next/image";
import Link from "next/link";
import { site, addressLine } from "@/lib/site";
import styles from "./Visit.module.css";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Sattva Homes, ${addressLine}`)}`;

/** The display home invitation: a navy panel with the address, hours and the two next steps. */
export default function Visit() {
  return (
    <section className={styles.wrap} id="visit" aria-labelledby="visit-title">
      <div className={styles.panel}>
        <div className={styles.copy}>
          <span className={`eyebrow ${styles.eyebrow}`}>Display home</span>
          <h2 id="visit-title" className="display">Visit our display home <span className="serif">in Willawong.</span></h2>
          <p>{site.displayHomeIntro}</p>
          <div className={styles.actions}>
            <Link href="/contact?enquiry=visit" className={`btn ${styles.primary}`}>Book a visit</Link>
            <a href={mapsUrl} target="_blank" rel="noopener" className={`btn ${styles.secondary}`}>Get directions</a>
          </div>
          <dl className={styles.info}>
            <div><dt>Address</dt><dd>{addressLine}</dd></div>
            <div><dt>Open</dt><dd>{site.hours.map((h) => <span key={h.days}>{h.days} {h.time}<br /></span>)}</dd></div>
            <div><dt>Call</dt><dd><a className="tabular" href={site.phoneHref}>{site.phone}</a></dd></div>
            <div><dt>Email</dt><dd><a href={`mailto:${site.email}`}>{site.email}</a></dd></div>
          </dl>
        </div>
        <div className={styles.photo}>
          <Image src="/images/home/windermere.jpg" alt="Windermere double storey home design by Sattva Homes" fill
            sizes="(max-width: 900px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}
