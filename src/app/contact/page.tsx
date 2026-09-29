import type { Metadata } from "next";
import { Suspense } from "react";
import EnquiryForm from "@/components/contact/EnquiryForm";
import { getAllDesigns } from "@/lib/designs";
import { site, addressLine } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata: Metadata = {
  title: "Contact Us & Book a Display Home Visit",
  description: `Contact Sattva Homes, Brisbane home builder. Call ${site.phone}, send an enquiry or visit our display home at ${addressLine}.`,
  alternates: { canonical: "/contact" },
};

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Sattva Homes, ${addressLine}`)}`;

export default function ContactPage() {
  const designs = getAllDesigns().map((d) => ({ slug: d.slug, name: d.name }));
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <span className="label">Get in touch</span>
        <h1 className="display">Talk to us about your <span className="serif">new home.</span></h1>
        <p>
          Call, email or send an enquiry below, or book a visit to our display home in Willawong, Brisbane.
          We&apos;ll help you find the right design for your block.
        </p>
      </header>

      <div className={styles.body}>
        <aside className={styles.details}>
          <div>
            <h2 className="label">Display home &amp; office</h2>
            <p>{addressLine}</p>
            <a href={mapsUrl} target="_blank" rel="noopener" className={styles.link}>Get directions ↗</a>
          </div>
          <div>
            <h2 className="label">Call us</h2>
            <p><a href={site.phoneHref} className="tabular">{site.phone}</a></p>
          </div>
          <div>
            <h2 className="label">Email us</h2>
            <p><a href={`mailto:${site.email}`}>{site.email}</a></p>
          </div>
          <div>
            <h2 className="label">Open</h2>
            {site.hours.map((h) => <p key={h.days}>{h.days} <span className={styles.muted}>{h.time}</span></p>)}
          </div>
        </aside>

        <Suspense fallback={null}>
          <EnquiryForm designs={designs} />
        </Suspense>
      </div>

      <p className={styles.ack}>{site.acknowledgement}</p>
    </main>
  );
}
