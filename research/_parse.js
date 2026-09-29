// Builds research/home-designs.json from the FacetWP listing HTML (_list1..15.html, fetched via
// POST https://sattva.com.au/wp-json/facetwp/v1/refresh with paged=1..15, template "home_designs")
// plus the WP REST dump (raw-designs-*.json) for slug / series / storeys.
const fs = require("fs");
const raw = [...require("./raw-designs-1.json"), ...require("./raw-designs-2.json")];
const byImage = new Map();
for (const d of raw) {
  const m = d._embedded && d._embedded["wp:featuredmedia"] && d._embedded["wp:featuredmedia"][0];
  if (m && m.source_url) byImage.set(m.source_url, d);
}
const byTitle = new Map(raw.map((d) => [d.title.rendered.trim().toLowerCase(), d]));

const out = new Map();
for (let p = 1; p <= 15; p++) {
  const html = fs.readFileSync(`_list${p}.html`, "utf8").replace(/\s+/g, " ").replace(/> </g, "><");
  for (const b of html.split('<div class="fhline-box">').slice(1)) {
    const g = (re) => { const m = b.match(re); return m ? m[1].trim() : null; };
    const num = (cls) => { const v = g(new RegExp(`class="${cls}">([^<]*)<`)); return v ? Number(v) : null; };
    const name = g(/class="fhp-name">([^<]+)</);
    const image = g(/<img[^>]*src="([^"]+)"/);
    const key = `${name}|${image}`;
    if (!name || out.has(key)) continue;
    const r = byImage.get(image) || byTitle.get(name.toLowerCase());
    const cls = r ? r.class_list : [];
    const type = cls.find((c) => c.startsWith("type_of_home-")) || "";
    const lotNote = g(/class="blockinfo">([^<]+)</);
    // Two formats: "suit 15.24m x 25m block" / "+16m x +25m" (minimums), or "Fits lot 13.91m wide"
    const lot = (lotNote || "").match(/\+?([\d.]+)\s*m?\s*x\s*\+?([\d.]+)\s*m/i)
      || ((m) => m && [m[0], m[1], null])((lotNote || "").match(/([\d.]+)\s*m wide/i));
    out.set(key, {
      name,
      slug: r ? r.slug : null,
      series: (cls.find((c) => c.startsWith("home-category-")) || "").replace("home-category-", "") || null,
      storeys: type.startsWith("type_of_home-2") ? 2 : type.startsWith("type_of_home-1") ? 1 : null,
      bedrooms: num("bed-icon"),
      bathrooms: num("bath-icon"),
      garage: num("park-icon"),
      living: num("sofa-icon"),
      areaM2: parseFloat(g(/>Area<\/td><td class="tdright">([\d.]+)/)) || null,
      lengthM: parseFloat(g(/>Length<\/td><td class="tdright">([\d.]+)/)) || null,
      widthM: parseFloat(g(/>Width<\/td><td class="tdright">([\d.]+)/)) || null,
      lotWidthM: lot ? Number(lot[1]) : null,
      lotDepthM: lot && lot[2] ? Number(lot[2]) : null,
      lotNote,
      image,
      brochure: g(/href="([^"]+\.pdf)"/),
    });
  }
}

const arr = [...out.values()];
fs.writeFileSync("home-designs.json", JSON.stringify(arr, null, 2));
const count = (k) => arr.reduce((m, d) => ((m[d[k]] = (m[d[k]] || 0) + 1), m), {});
const range = (k) => { const v = arr.map((d) => d[k]).filter((x) => x != null); return `${Math.min(...v)}–${Math.max(...v)} (${v.length} set)`; };
console.log("parsed", arr.length, "of", raw.length);
console.log("series", count("series"), "storeys", count("storeys"), "beds", count("bedrooms"));
console.log("area", range("areaM2"), "lot width", range("lotWidthM"));
