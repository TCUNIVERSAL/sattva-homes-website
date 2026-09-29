// Imports the home design catalogue scraped from the old site (research/home-designs.json):
// downloads each facade image into research/source-images/designs/ (untouched originals),
// records its real pixel size, and writes src/data/designs.json in the shape the app uses.
// Then run `python scripts/enhance-designs.py` to produce the web copies in public/images/designs/.
//
// Run: node scripts/import-designs.mjs          (skips images already downloaded)
//      node scripts/import-designs.mjs --force  (re-downloads everything)

import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const force = process.argv.includes("--force");
const srcDir = path.join(root, "research", "source-images", "designs");

const raw = JSON.parse(await readFile(path.join(root, "research", "home-designs.json"), "utf8"));
await mkdir(srcDir, { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);
const SERIES = { "essence-series": "essence", "horizon-series": "horizon", "meadowline-series": "meadowline" };

/** Width and height from a JPEG or WebP header, without an image library. */
function imageSize(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      // SOF0–SOF15 carry the frame size (excluding DHT, JPG and DAC markers).
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { width: buf.readUInt16BE(i + 7), height: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") {
    const chunk = buf.toString("ascii", 12, 16);
    if (chunk === "VP8X") return { width: 1 + buf.readUIntLE(24, 3), height: 1 + buf.readUIntLE(27, 3) };
    if (chunk === "VP8L") {
      const b = buf.readUInt32LE(21);
      return { width: (b & 0x3fff) + 1, height: ((b >> 14) & 0x3fff) + 1 };
    }
    if (chunk === "VP8 ") return { width: buf.readUInt16LE(26) & 0x3fff, height: buf.readUInt16LE(28) & 0x3fff };
  }
  throw new Error("unknown image format");
}

const designs = [];
for (const d of raw) {
  const ext = path.extname(new URL(d.image).pathname) || ".jpg";
  const file = `${d.slug}${ext}`;
  const dest = path.join(srcDir, file);
  if (force || !(await exists(dest))) {
    const res = await fetch(d.image);
    if (!res.ok) throw new Error(`${d.name}: image ${res.status} ${d.image}`);
    await writeFile(dest, Buffer.from(await res.arrayBuffer()));
    process.stdout.write(".");
  }
  const { width, height } = imageSize(await readFile(dest));
  designs.push({
    slug: d.slug,
    name: d.name,
    series: SERIES[d.series],
    storeys: d.storeys,
    bedrooms: d.bedrooms,
    bathrooms: d.bathrooms,
    garage: d.garage,
    living: d.living,
    areaM2: d.areaM2,
    houseLengthM: d.lengthM,
    houseWidthM: d.widthM,
    lotWidthM: d.lotWidthM,
    lotDepthM: d.lotDepthM,
    // Web copy is always JPEG (see enhance-designs.py); size is the original's.
    image: `/images/designs/${d.slug}.jpg`,
    imageWidth: width,
    imageHeight: height,
    // Brochures still live on the old site until the client sends originals.
    brochureUrl: d.brochure,
  });
}

designs.sort((a, b) => a.name.localeCompare(b.name));
await writeFile(path.join(root, "src", "data", "designs.json"), JSON.stringify(designs, null, 2) + "\n");
console.log(`\n${designs.length} designs written to src/data/designs.json`);
