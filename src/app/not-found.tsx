import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <span className="label">404</span>
      <h1 className="display">This page isn&apos;t <span className="serif">built yet.</span></h1>
      <p>The page you&apos;re looking for doesn&apos;t exist. Try one of our 128 home designs instead.</p>
      <Link href="/designs" className={styles.link}>Browse designs</Link>
    </main>
  );
}
