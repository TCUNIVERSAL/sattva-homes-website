import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DesignCard from "@/components/designs/DesignCard";
import LotFit from "@/components/designs/LotFit";
import { SERIES_NAMES, formatArea, formatMetres, getAllDesigns, getDesign, getRelatedDesigns, isHighRes } from "@/lib/designs";
import { site, jsonLd } from "@/lib/site";
import type { Design } from "@/types/design";
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
  const storey = d.storeys === 2 ? "Double" : "Single";
  const title = `${d.name}: ${d.bedrooms} Bed ${storey} Storey House Design`;
  return {
    // Long design names would push the title past ~60 characters, so they drop the " · Sattva Homes" suffix.
    title: title.length + ` · ${site.name}`.length > 60 ? { absolute: title } : title,
    description: `${d.name}: a ${d.bedrooms} bed, ${d.bathrooms} bath ${storey.toLowerCase()} storey house design (${formatArea(d.areaM2)} m²) for blocks from ${d.lotWidthM} m wide, from the ${SERIES_NAMES[d.series]} Series by Sattva Homes, Brisbane.`,
    alternates: { canonical: `/designs/${d.slug}` },
    openGraph: { images: [d.image] },
  };
}

/** A short, unique description of the design, written from its specs. */
function summary(d: Design): string {
  const storey = d.storeys === 2 ? "double" : "single";
  const garage = d.garage ? ` and a ${d.garage} car garage` : "";
  const size = d.houseWidthM && d.houseLengthM ? ` The house itself is ${formatMetres(d.houseWidthM)} wide and ${formatMetres(d.houseLengthM)} long.` : "";
  return `The ${d.name} is a ${d.bedrooms} bedroom, ${d.bathrooms} bathroom ${storey} storey home design from our ${SERIES_NAMES[d.series]} Series, with ${formatArea(d.areaM2)} m² of floor area${garage}. It suits blocks from ${d.lotWidthM} m wide.${size} Visit our Willawong display home or send an enquiry to talk it through for your block.`;
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
  const alt = `${d.name} ${d.storeys === 2 ? "double" : "single"} storey house design facade by Sattva Homes`;
  const breadcrumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site.url },
      { "@type": "ListItem", position: 2, name: "House designs", item: `${site.url}/designs` },
      { "@type": "ListItem", position: 3, name: d.name, item: `${site.url}/designs/${d.slug}` },
    ],
  };

  return (
    <main className={styles.page}>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbs)} />
      <nav className={`label ${styles.crumbs}`} aria-label="Breadcrumb">
        <Link href="/designs">Designs</Link> / <Link href={`/designs?series=${d.series}`}>{SERIES_NAMES[d.series]}</Link> / <span aria-current="page">{d.name}</span>
      </nav>

      <header className={styles.head}>
        <h1 className="display">{d.name}</h1>
        <p className="serif">{SERIES_NAMES[d.series]} Series</p>
      </header>

      {isHighRes(d) ? (
        <div className={styles.hero}>
          <Image src={d.image} alt={alt} fill priority quality={90} sizes="100vw" />
        </div>
      ) : (
        // Small originals are shown uncropped at a size they stay sharp at, not stretched full-bleed.
        <figure className={styles.framed}>
          <Image src={d.image} alt={alt} width={d.imageWidth * 2} height={d.imageHeight * 2} priority quality={90}
            sizes="(max-width: 900px) 100vw, 900px" style={{ maxWidth: `min(100%, ${Math.min(d.imageWidth * 2.2, 1100)}px)` }} />
        </figure>
      )}

      <section className={styles.body}>
        <div className={styles.info}>
          <p className={styles.lede}>{summary(d)}</p>
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
        <section className={styles.related} aria-label="Similar house designs">
          <h2 className="display">Similar house <span className="serif">designs</span></h2>
          <div className={styles.relatedGrid}>{related.map((r) => <DesignCard key={r.slug} design={r} />)}</div>
        </section>
      )}
    </main>
  );
}
