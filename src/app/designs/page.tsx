import type { Metadata } from "next";
import { Suspense } from "react";
import DesignFinder from "@/components/designs/DesignFinder";
import { getAllDesigns } from "@/lib/designs";
import styles from "./designs.module.css";

export const metadata: Metadata = {
  title: "Home designs",
  description: "Browse 128 single and double storey home designs across the Essence, Horizon and Meadowline series, and find one that fits your block.",
};

export default function DesignsPage() {
  const designs = getAllDesigns();
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <span className="label">Home designs</span>
        <h1 className="display">Find the one that <span className="serif">fits.</span></h1>
        <p>{designs.length} designs across three series. Set your block width to see only the homes that suit it.</p>
      </header>
      {/* The finder reads ?series= from the URL, so it renders on the client. */}
      <Suspense fallback={<p className={styles.loading}>Loading designs…</p>}>
        <DesignFinder designs={designs} />
      </Suspense>
    </main>
  );
}
