import type { Metadata } from "next";
import { Suspense } from "react";
import DesignFinder from "@/components/designs/DesignFinder";
import { getAllDesigns } from "@/lib/designs";
import styles from "./designs.module.css";

export const metadata: Metadata = {
  title: "Brisbane House Designs & Floor Plans",
  description: "Browse 128 single and double storey house designs by Sattva Homes, a Brisbane home builder. Filter by block width, bedrooms and storeys to find your home.",
  alternates: { canonical: "/designs" },
};

export default function DesignsPage() {
  const designs = getAllDesigns();
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <span className="label">Brisbane house designs</span>
        <h1 className="display">House designs that <span className="serif">fit your block.</span></h1>
        <p>
          {designs.length} single and double storey home designs across the Essence, Horizon and Meadowline series.
          Set your block width to see only the floor plans that suit it.
        </p>
      </header>
      {/* The finder reads ?series= from the URL, so it renders on the client. */}
      <Suspense fallback={<p className={styles.loading}>Loading designs…</p>}>
        <DesignFinder designs={designs} />
      </Suspense>
    </main>
  );
}
