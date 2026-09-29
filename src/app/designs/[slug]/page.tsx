import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DesignCard from "@/components/designs/DesignCard";
import LotFit from "@/components/designs/LotFit";
import { SERIES_NAMES, formatArea, formatMetres, getAllDesigns, getDesign, getRelatedDesigns, isHighRes } from "@/lib/designs";
import styles from "./design.module.css";

export function generateStaticParams() {
  return getAllDesigns().map((d) => ({ slug: d.slug }));
}

// Only the 128 known designs exist; anything else is a 404.
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/designs/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) return {};
  return {
    title: `${d.name} · ${SERIES_NAMES[d.series]} Series`,
    description: `${d.name}: a ${d.bedrooms} bedroom, ${d.storeys === 2 ? "double" : "single"} storey home of ${formatArea(d.areaM2)} m² for blocks from ${d.lotWidthM} m wide.`,
    openGraph: { images: [d.image] },
  };
}

export default async function DesignPage(props: PageProps<"/designs/[slug]">) {
  const { slug } = await props.params;
  const d = getDesign(slug);
  if (!d) notFound();

  const specs: [string, string][] = [
    ["Bedrooms", String(d.bedrooms)],
    ["Bathrooms", String(d.bathrooms)],
    ["Car spaces", d.garage ? String(d.garage) : "–"],
    ["Living areas", d.living ? String(d.living) : "–"],
    ["Storeys", d.storeys === 2 ? "Double" : "Single"],
    ["Floor area", `${formatArea(d.areaM2)} m²`],
    ["House width", d.houseWidthM ? formatMetres(d.houseWidthM) : "–"],
    ["House length", d.houseLengthM ? formatMetres(d.houseLengthM) : "–"],
    ["Block width from", `${d.lotWidthM} m`],
  ];
  const enquire = `/contact?design=${d.slug}`;
  const related = getRelatedDesigns(d);

  return (
    <main className={styles.page}>
      <nav className={`label ${styles.crumbs}`} aria-label="Breadcrumb">
        <Link href="/designs">Designs</Link> / <Link href={`/designs?series=${d.series}`}>{SERIES_NAMES[d.series]}</Link> / <span aria-current="page">{d.name}</span>
      </nav>

      <header className={styles.head}>
        <h1 className="display">{d.name}</h1>
        <p className="serif">{SERIES_NAMES[d.series]} Series</p>
      </header>

      {isHighRes(d) ? (
        <div className={styles.hero}>
          <Image src={d.image} alt={`${d.name} facade`} fill priority quality={90} sizes="100vw" />
        </div>
      ) : (
        // Small originals are shown uncropped at a size they stay sharp at, not stretched full-bleed.
        <figure className={styles.framed}>
          <Image src={d.image} alt={`${d.name} facade`} width={d.imageWidth * 2} height={d.imageHeight * 2} priority quality={90}
            sizes="(max-width: 900px) 100vw, 900px" style={{ maxWidth: `min(100%, ${Math.min(d.imageWidth * 2.2, 1100)}px)` }} />
        </figure>
      )}

      <section className={styles.body}>
        <div className={styles.info}>
          <dl className={`tabular ${styles.specs}`}>
            {specs.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className={styles.actions}>
            <Link className={styles.primary} href={enquire}>Enquire about {d.name}</Link>
            <a className={styles.secondary} href={d.brochureUrl} target="_blank" rel="noopener">Download brochure (PDF)</a>
          </div>
        </div>
        <LotFit design={d} />
      </section>

      {related.length > 0 && (
        <section className={styles.related} aria-label="Similar designs">
          <h2 className="display">You might also <span className="serif">like</span></h2>
          <div className={styles.relatedGrid}>{related.map((r) => <DesignCard key={r.slug} design={r} />)}</div>
        </section>
      )}
    </main>
  );
}
