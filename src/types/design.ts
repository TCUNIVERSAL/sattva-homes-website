export type SeriesId = "essence" | "horizon" | "meadowline";

export interface Design {
  slug: string;
  name: string;
  series: SeriesId;
  storeys: 1 | 2;
  bedrooms: number;
  bathrooms: number;
  garage: number | null;
  living: number | null;
  areaM2: number;
  /** House footprint, metres. Missing for a few designs on the old site. */
  houseLengthM: number | null;
  houseWidthM: number | null;
  /** Narrowest block the design is drawn for, metres. */
  lotWidthM: number;
  lotDepthM: number | null;
  image: string;
  /** Size of the original photo. Most are small (under 400px), which limits how large they can be shown. */
  imageWidth: number;
  imageHeight: number;
  brochureUrl: string;
}

export interface Series {
  id: SeriesId;
  name: string;
  count: number;
}
