"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Design, SeriesId } from "@/types/design";
import { SERIES_NAMES } from "@/lib/designs";
import DesignCard from "./DesignCard";
import styles from "./DesignFinder.module.css";

type Choice<T> = T | "any";
const SORTS = {
  "area-desc": { label: "Largest first", fn: (a: Design, b: Design) => b.areaM2 - a.areaM2 },
  "area-asc": { label: "Smallest first", fn: (a: Design, b: Design) => a.areaM2 - b.areaM2 },
  name: { label: "Name A–Z", fn: (a: Design, b: Design) => a.name.localeCompare(b.name) },
} as const;
type SortKey = keyof typeof SORTS;

function Segmented<T extends string | number>({ label, value, options, onChange }: {
  label: string; value: Choice<T>; options: { value: Choice<T>; label: string }[]; onChange: (v: Choice<T>) => void;
}) {
  return (
    <div className={styles.group} role="group" aria-label={label}>
      <span className={styles.groupLabel}>{label}</span>
      <div className={styles.seg}>
        {options.map((o) => (
          <button key={String(o.value)} type="button" aria-pressed={o.value === value} onClick={() => onChange(o.value)}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

/** Filters for the full catalogue: series, storeys, bedrooms and block width. */
export default function DesignFinder({ designs }: { designs: Design[] }) {
  const params = useSearchParams();
  const initialSeries = params.get("series");
  const [series, setSeries] = useState<Choice<SeriesId>>(
    initialSeries && initialSeries in SERIES_NAMES ? (initialSeries as SeriesId) : "any");
  const [storeys, setStoreys] = useState<Choice<1 | 2>>("any");
  const [beds, setBeds] = useState<Choice<3 | 4 | 5>>("any");
  const maxLot = Math.ceil(Math.max(...designs.map((d) => d.lotWidthM)));
  const [block, setBlock] = useState(maxLot);
  const [sort, setSort] = useState<SortKey>("area-desc");

  const results = useMemo(() => designs
    .filter((d) => (series === "any" || d.series === series)
      && (storeys === "any" || d.storeys === storeys)
      && (beds === "any" || d.bedrooms === beds)
      && d.lotWidthM <= block)
    .sort(SORTS[sort].fn), [designs, series, storeys, beds, block, sort]);

  const reset = () => { setSeries("any"); setStoreys("any"); setBeds("any"); setBlock(maxLot); };

  return (
    <div className={styles.finder}>
      <div className={styles.filters}>
        <Segmented label="Series" value={series} onChange={setSeries}
          options={[{ value: "any", label: "All" }, ...(Object.keys(SERIES_NAMES) as SeriesId[]).map((id) => ({ value: id, label: SERIES_NAMES[id] }))]} />
        <Segmented label="Storeys" value={storeys} onChange={setStoreys}
          options={[{ value: "any", label: "Any" }, { value: 1, label: "Single" }, { value: 2, label: "Double" }]} />
        <Segmented label="Bedrooms" value={beds} onChange={setBeds}
          options={[{ value: "any", label: "Any" }, { value: 3, label: "3" }, { value: 4, label: "4" }, { value: 5, label: "5" }]} />
        <div className={styles.group}>
          <label className={styles.groupLabel} htmlFor="block-width">My block is <b className="tabular">{block} m</b> wide</label>
          <input id="block-width" type="range" min={4} max={maxLot} step={0.5} value={block} onChange={(e) => setBlock(Number(e.target.value))} />
        </div>
      </div>

      <div className={styles.bar}>
        <p aria-live="polite"><b className="tabular">{results.length}</b> of {designs.length} designs</p>
        <div className={styles.barRight}>
          <label className="visually-hidden" htmlFor="sort">Sort designs</label>
          <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            {(Object.keys(SORTS) as SortKey[]).map((k) => <option key={k} value={k}>{SORTS[k].label}</option>)}
          </select>
          <button type="button" className={styles.reset} onClick={reset}>Clear filters</button>
        </div>
      </div>

      {results.length ? (
        <div className={styles.grid}>{results.map((d) => <DesignCard key={d.slug} design={d} />)}</div>
      ) : (
        <p className={styles.empty}>No designs match. Try a wider block or clear a filter.</p>
      )}
    </div>
  );
}
