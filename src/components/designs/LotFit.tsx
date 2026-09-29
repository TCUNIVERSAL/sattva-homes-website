import type { Design } from "@/types/design";
import styles from "./LotFit.module.css";

const W = 300, H = 380, PAD = 34, SETBACK = 5;
const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * The house footprint drawn to scale on the narrowest block it suits.
 * A guide only: centred, with a 5 m front setback.
 */
export default function LotFit({ design: d }: { design: Design }) {
  if (!d.houseWidthM || !d.houseLengthM) return null;
  const lotW = Math.max(d.lotWidthM, d.houseWidthM);
  const lotD = Math.max(d.lotDepthM ?? 0, d.houseLengthM + SETBACK + 6);
  const s = Math.min((W - PAD * 2) / lotW, (H - PAD * 2 - 20) / lotD);
  const w = lotW * s, h = lotD * s, x0 = (W - w) / 2, y0 = PAD;
  const hw = d.houseWidthM * s, hl = d.houseLengthM * s;
  const hx = x0 + (w - hw) / 2, hy = y0 + h - SETBACK * s - hl;
  const side = r2((lotW - d.houseWidthM) / 2);

  return (
    <figure className={styles.fit}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${d.name}, ${r2(d.houseWidthM)} by ${r2(d.houseLengthM)} metres, on a ${r2(lotW)} metre wide block`}>
        <rect x={x0} y={y0} width={w} height={h} className={styles.lot} />
        <rect x={hx} y={hy} width={hw} height={hl} rx={2} className={styles.house} />
        <text x={hx + hw / 2} y={hy + hl / 2 + 4} className={styles.inHouse}>{r2(d.houseWidthM)} × {r2(d.houseLengthM)} m</text>
        <line x1={x0} y1={y0 - 14} x2={x0 + w} y2={y0 - 14} className={styles.dim} />
        <line x1={x0} y1={y0 - 19} x2={x0} y2={y0 - 9} className={styles.dim} />
        <line x1={x0 + w} y1={y0 - 19} x2={x0 + w} y2={y0 - 9} className={styles.dim} />
        <text x={x0 + w / 2} y={y0 - 20} className={styles.dimText}>block from {r2(lotW)} m</text>
        {side >= 0.8 && (
          <>
            <text x={x0 + (hx - x0) / 2} y={hy + hl / 2 + 4} className={styles.side}>{side}</text>
            <text x={hx + hw + (hx - x0) / 2} y={hy + hl / 2 + 4} className={styles.side}>{side}</text>
          </>
        )}
        <line x1={x0 - 8} y1={y0 + h} x2={x0 + w + 8} y2={y0 + h} className={styles.street} />
        <text x={W / 2} y={y0 + h + 18} className={styles.streetText}>STREET</text>
      </svg>
      <figcaption>Drawn to scale, centred with a 5 m front setback. A guide only; check your estate&apos;s building rules.</figcaption>
    </figure>
  );
}
