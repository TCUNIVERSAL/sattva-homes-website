# Sattva Homes website

New website for [Sattva Homes](https://sattva.com.au), a Brisbane home builder with a display home in Willawong, QLD. It replaces the current WordPress/Elementor site.

Built with Next.js 16 (App Router, Turbopack), React 19, TypeScript, CSS Modules, GSAP + ScrollTrigger, Lenis and Three.js.

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (all 131 pages are static)
npm run typecheck
npm run lint
```

## Folder structure

```
src/
  app/                    Routes
    page.tsx              Homepage (composes the sections below, in order)
    designs/page.tsx      Catalogue with filters (/designs?series=essence works)
    designs/[slug]/       One static page per design, from designs.json
    contact/page.tsx      Contact details and enquiry form (?design=slug or ?enquiry=visit prefill it)
    layout.tsx            Fonts, metadata, header, footer, smooth scroll
    globals.css           Brand tokens (navy #19283F, gold #AC8654) and base styles
  components/
    layout/               Header (with phone menu), Footer, SmoothScroll (Lenis), MotionNotice
    home/                 Homepage sections: Preloader, Hero, Manifesto, Marquee,
                          Collection, DayAtHome, Numbers, Values, Build, ProcessCards, Visit
    contact/              EnquiryForm
    designs/              DesignCard, DesignFinder, LotFit
    three/houseScene.ts   The 3D house that builds itself (no React inside)
    ui/                   MagneticButton, BrisbaneClock
  lib/
    designs.ts            Typed access to the design catalogue
    site.ts               Contact details, hours, stats, values, copy from the old site, navigation
    motion.tsx            Motion on/off (respects reduced motion, with opt-in)
    gsap.ts, scroll.ts    Shared GSAP registration and Lenis instance
  types/design.ts
  data/designs.json       Generated, do not edit by hand
public/images/            designs/ (128 facades), home/, brand/ (logo files)
scripts/import-designs.mjs  Downloads facade originals, records their size, rebuilds designs.json
scripts/enhance-designs.py  Builds the web copies of the facades (upscales the small ones)
scripts/enhance-image.py  Cleans up and upscales a single render (used for the homepage images)
scripts/make-logos.py     Builds the web logo files from research/brand/SATTVA_HQ.png
research/                 Local only, not in git: old-site audit, scraped data, original images
```

## How the motion works

- Every animated component checks `useMotion().enabled`. If the device has reduced motion turned on, the site renders a complete static version and shows a small "Play animations" bar. The visitor's choice is remembered.
- The pinned sections (Hero, Collection, Build) must stay in page order in `app/page.tsx`. ScrollTrigger measures later sections based on the pins above them.
- The Build section falls back to `ProcessCards` when motion is off or WebGL isn't available. Three.js is loaded only when the 3D section is used.

## Updating the design catalogue

The `research/` folder is kept out of git. It holds the inputs for the scripts below, so they only run on a machine that has it. The site itself doesn't need it: the generated images and `designs.json` are committed.

`research/home-designs.json` holds the 128 designs scraped from the old site. To regenerate the app data and images:

```bash
npm run import:designs
python scripts/enhance-designs.py
```

## Image quality

The old site's renders are small: the best is 2000px wide, and 105 of the 128 designs are under 400px. To get the most out of them:

- Untouched originals live in `research/source-images/`. The web copies are generated from them, never re-saved from each other.
- Small images get a clean-up, a 2x Lanczos upscale and light sharpening. The hero uses a 3200px master.
- `next.config.ts` serves AVIF/WebP, at quality 90 for full-screen images.
- Design pages only go full-bleed when the original is 1600px or wider. Smaller ones are shown framed, at a size they stay sharp at. Panoramic facades aren't cropped on cards.

The real fix is the original renders from the client's architect or visualiser (usually 4000px+). Drop them into `research/source-images/` and re-run the scripts.

## Logo files

The only logo on the old site is a square PNG on an off-white background (`research/brand/SATTVA_HQ.png`). `python scripts/make-logos.py` separates its two inks (navy `#19283F`, gold `#AC8654`) into transparent files: stacked and horizontal versions, each in original colours and reversed (white and gold, for dark backgrounds). It also makes the mark on its own and the browser icons. Ask the client for a vector (SVG/AI/EPS) logo before launch.

## Still needed from the client

- Real photography: finished homes, interiors, the display home and the team. The kitchen photo on the homepage is a stock placeholder.
- Full-resolution original renders for all 128 designs.
- Floor plan images for each design. Brochure PDFs still link to the old site.
- Confirmed service areas (QLD only, or Adelaide too), current promotion, social links, licence number and memberships.
- Sign-off on all copy (it's draft).
- A form backend. The contact form opens the visitor's email app for now.
- Correct social links. The old site links to Fenix Homes' Facebook and Instagram, so none are shown here.
- ABN, builder licence (QBCC) and memberships. None are on the old site.
- A vector logo.

The old site's issues are listed in `research/current-site-audit.md`.
