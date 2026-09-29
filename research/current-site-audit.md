# Sattva Homes — current site audit (sattva.com.au)

Reviewed 28 Sep 2026, desktop (1366px) and mobile (375px).

## What exists today

| Page | URL | Notes |
|---|---|---|
| Home | `/` | Hero + design search, welcome copy, stats, "Explore designs" CTA, "Why choose our floor plans", contact CTA |
| Home Designs | `/home-designs/` | 128 designs, FacetWP filters (beds, baths, cars, storeys, area, lot width), 9 per page + Load More |
| Series | `/home-category/{essence,horizon,meadowline}-series/` | Same grid, filtered |
| Contact | `/contact-us/` | Name, email, phone, location (Brisbane / Adelaide), message. Land acknowledgement. No map |
| About | `#` | **Dead link** |

**Stack:** WordPress + Astra + custom child theme `webleyhub` + Elementor, Elementor Pro, Elementor Extras, PowerPack, FacetWP, WPForms Lite, Yoast. Very plugin-heavy for a small site.

**Business details:**
- 71 Waters Street, Willawong QLD 4110 (display home)
- 07 3708 1091 · info@sattva.com.au
- Hours: Mon–Fri 11am–6pm, Sat–Sun 9am–5pm
- Stats: 73+ homes completed · 12+ in progress · 18,341 m² built · $24M+ value built

## Design catalogue (saved to `home-designs.json`)

- **128 designs**: Meadowline 66, Essence 40, Horizon 22
- 86 single-storey, 42 double-storey
- 3 bed: 21 · 4 bed: 85 · 5 bed: 22
- Floor area 136.65 – 715.33 m²; lot widths 8.5 – 18.5 m
- Each has a facade image (377×263, low-res) and a PDF brochure
- Fields: name, slug, series, storeys, beds, baths, garage, living, area, length, width, lot width/depth, image, brochure
- "Brentwood" appears twice (two different posts), so check with the client

## Problems to fix

### Content & trust (most urgent)
1. **Expired offer still live.** "$20,000 free upgrades if you sign before 31 Dec 2023" appears in the welcome copy and the "Affordable Luxury" card. It's nearly 3 years out of date.
2. **Social links go to another builder.** Facebook and Instagram point to `fenix.homes.au` / `fenix__homes`, which looks like a leftover from a template.
3. **Location is unclear.** Copy says "best custom-designed homes in **South Australia**", but the office is in Brisbane (QLD) and the form offers Brisbane or Adelaide. We need to confirm the real service areas.
4. **About page doesn't exist.** The nav link goes to `#`.
5. **Stock photos everywhere** (a café wall of clipboards, generic interiors). No real Sattva builds, team or display home photos.
6. **Awkward copy**, e.g. "Designed To Be Used On Any Day You Want Home".
7. No testimonials, reviews, completed-home gallery, build process, inclusions, licence numbers (QBCC) or HIA/MBA memberships.

### UX
8. **Designs have no pages of their own.** 128 designs can only be reached by downloading a PDF, so there's no floor plan preview, nothing to share and nothing for Google to index.
9. No way to shortlist or compare designs, and no enquiry tied to a design ("Enquire about Birchfield").
10. Design images are small (377 px) and there are no floor plan images on the site.
11. Low-contrast faded grey and beige headings (fail WCAG contrast).
12. On mobile the hero search form fills the whole first screen.
13. No map, no display home directions, no "book a visit".

### SEO / tech
14. No meta description. Page title is "HOME - Sattva Homes".
15. The staging URL `sattva-homes.local` leaks through the post GUIDs.
16. Heavy Elementor stack, which is slow and hard to maintain.

## Assets we can reuse
- Logo: https://sattva.com.au/wp-content/uploads/2026/06/SATTVA_HQ.png (need a vector/SVG from the client)
- 128 facade images + 128 PDF brochures (URLs in `home-designs.json`)
- Stats, contact details, land acknowledgement text
