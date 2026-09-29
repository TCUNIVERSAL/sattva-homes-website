import Image from "next/image";
import Link from "next/link";
import { site, addressLine } from "@/lib/site";
import { SERIES_NAMES } from "@/lib/designs";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.foot}>
      <div className={styles.cols}>
        <div className={styles.brand}>
          <Image src="/images/brand/sattva-logo-reversed.png" alt="Sattva Homes, Brisbane" width={928} height={800} className={styles.logo} />
          <p className={`serif ${styles.slogan}`}>{site.slogan}.</p>
          <p>{site.acknowledgement}</p>
        </div>
        <div>
          <h2 className={styles.h}>Designs</h2>
          <ul>
            {Object.entries(SERIES_NAMES).map(([id, name]) => (
              <li key={id}><Link href={`/designs?series=${id}`}>{name}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className={styles.h}>Company</h2>
          <ul>
            <li><Link href="/#how-we-build">How it works</Link></li>
            <li><Link href="/#visit">Display home</Link></li>
            <li><Link href="/designs">All designs</Link></li>
            <li><Link href="/contact">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h2 className={styles.h}>Contact</h2>
          <ul>
            <li><a href={site.phoneHref}>{site.phone}</a></li>
            <li><a href={`mailto:${site.email}`}>{site.email}</a></li>
            <li>{addressLine}</li>
            {site.hours.map((h) => <li key={h.days} className={styles.hours}>{h.days} {h.time}</li>)}
          </ul>
        </div>
      </div>
      <div className={styles.note}>
        <span>© {new Date().getFullYear()} {site.name}</span>
      </div>
    </footer>
  );
}
