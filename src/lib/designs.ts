import data from "@/data/designs.json";
import type { Design, Series, SeriesId } from "@/types/design";

const designs = data as Design[];

export const SERIES_NAMES: Record<SeriesId, string> = {
  essence: "Essence",
  horizon: "Horizon",
  meadowline: "Meadowline",
};

/** Designs picked for the homepage collection, in display order. */
const FEATURED = ["pinehurst", "windermere", "foxglove", "springdale", "hearthstone", "horizon", "goldenrod", "fieldstone"];

export function getAllDesigns(): Design[] {
  return designs;
}

export function getDesign(slug: string): Design | undefined {
  return designs.find((d) => d.slug === slug);
}

export function getFeaturedDesigns(): Design[] {
  return FEATURED.map((slug) => {
    const d = getDesign(slug);
    if (!d) throw new Error(`Featured design "${slug}" is missing from designs.json`);
    return d;
  });
}

export function getSeries(): Series[] {
  return (Object.keys(SERIES_NAMES) as SeriesId[]).map((id) => ({
    id,
    name: SERIES_NAMES[id],
    count: designs.filter((d) => d.series === id).length,
  }));
}

export function getRelatedDesigns(design: Design, limit = 3): Design[] {
  return designs
    .filter((d) => d.slug !== design.slug && d.series === design.series && d.storeys === design.storeys)
    .sort((a, b) => Math.abs(a.areaM2 - design.areaM2) - Math.abs(b.areaM2 - design.areaM2))
    .slice(0, limit);
}

/** "4 bed · 2 bath · 2 car" style summary parts. */
export function specParts(d: Design): string[] {
  return [
    `${d.bedrooms} bed`,
    `${d.bathrooms} bath`,
    d.garage ? `${d.garage} car` : null,
    `${formatArea(d.areaM2)} m²`,
    d.storeys === 2 ? "Double storey" : "Single storey",
  ].filter((s): s is string => s !== null);
}

/** Panoramic facades (e.g. 768x200) that shouldn't be cropped into a 4:3 card. */
export function isWideImage(d: Design): boolean {
  return d.imageWidth / d.imageHeight > 1.8;
}

/** Only large originals are sharp enough to run full-bleed on a design page. */
export function isHighRes(d: Design): boolean {
  return d.imageWidth >= 1600;
}

export function formatArea(m2: number): string {
  return m2.toLocaleString("en-AU", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export function formatMetres(m: number): string {
  return `${Math.round(m * 100) / 100} m`;
}
