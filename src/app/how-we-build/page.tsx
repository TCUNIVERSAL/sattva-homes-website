import type { Metadata } from "next";
import Link from "next/link";
import Build from "@/components/home/Build";
import MotionNotice from "@/components/layout/MotionNotice";
import styles from "./how-we-build.module.css";

export const metadata: Metadata = {
  title: "How We Build Your New Home in Brisbane",
  description: "See how Sattva Homes builds your new home in five clear steps, from choosing a design and finishes to approvals, construction and handover in Brisbane.",
  alternates: { canonical: "/how-we-build" },
};

export default function HowWeBuildPage() {
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <span className="eyebrow">How we build</span>
        <h1 className="display">From first plan <span className="serif">to handing over the keys.</span></h1>
        <p>
          Building a home should never be a guessing game. Scroll through the five steps and watch a home take
          shape, from the footprint on your block to the lights coming on.
        </p>
      </header>

      <Build />

      <section className={styles.next} aria-labelledby="next-title">
        <h2 id="next-title" className="display">Ready to start <span className="serif">with step one?</span></h2>
        <p>Browse the designs, or come and see the quality in person at our Willawong display home.</p>
        <div className={styles.actions}>
          <Link href="/designs" className="btn btn-primary">Explore designs</Link>
          <Link href="/contact?enquiry=visit" className="btn btn-secondary">Book a display home visit</Link>
        </div>
      </section>
      <MotionNotice />
    </main>
  );
}
