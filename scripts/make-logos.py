"""
Builds the web logo files from the client's logo (research/brand/SATTVA_HQ.png, a square
PNG on an off-white background, taken from sattva.com.au).

Outputs to public/images/brand/:
  sattva-logo.png           stacked logo, original colours, transparent (for light backgrounds)
  sattva-logo-reversed.png  stacked logo, navy swapped for white (for dark backgrounds)
  sattva-lockup-reversed.png  horizontal mark + wordmark for the header (dark backgrounds)
  sattva-lockup.png         horizontal, original colours
  sattva-mark.png           the house-and-S mark alone, transparent
  sattva-mark-reversed.png  the mark with a white outline (for dark backgrounds)
and src/app/icon.png + src/app/apple-icon.png (mark on white, for browser tabs / home screens).

Run: python scripts/make-logos.py   (needs Pillow and numpy)
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "research" / "brand" / "SATTVA_HQ.png"
OUT = ROOT / "public" / "images" / "brand"
APP = ROOT / "src" / "app"
BONE = np.array([244, 245, 247], np.float32)


NAVY = np.array([25, 41, 63], np.float32)
GOLD = np.array([172, 134, 84], np.float32)


def separate_inks(rgb: np.ndarray, paper: np.ndarray, inks=(NAVY, GOLD)) -> np.ndarray:
    """
    The logo is two flat inks on paper. For each pixel, find which ink it's a blend of and how
    much (pixel = a*ink + (1-a)*paper), then output that pure ink at coverage a. This keeps the
    colours solid (a plain colour-to-alpha would leave the gold semi-transparent) and the
    anti-aliased edges smooth.
    """
    best_a = np.zeros(rgb.shape[:2], np.float32)
    best_err = np.full(rgb.shape[:2], np.inf, np.float32)
    best_ink = np.zeros(rgb.shape, np.float32)
    for ink in inks:
        d = paper - ink
        a = np.clip(((paper - rgb) @ d) / float(d @ d), 0, 1)
        err = np.linalg.norm(rgb - (a[..., None] * ink + (1 - a[..., None]) * paper), axis=2)
        take = err < best_err
        best_a[take], best_err[take], best_ink[take] = a[take], err[take], ink
    best_a = np.where(best_a < 0.03, 0, np.clip((best_a - 0.03) / 0.9, 0, 1))  # paper noise out, solid cores
    return np.dstack([best_ink, best_a * 255]).astype(np.uint8)


def reverse(rgba: np.ndarray) -> np.ndarray:
    """Navy (blue-dominant) pixels become bone white; gold stays gold."""
    out = rgba.copy()
    rgb = rgba[..., :3].astype(np.float32)
    navy = np.all(rgba[..., :3] == NAVY.astype(np.uint8), axis=2)
    out[navy, :3] = BONE
    return out


def rows_with_ink(alpha: np.ndarray, thresh=20):
    """Group consecutive rows that contain ink into bands: [(top, bottom), ...]."""
    ink = (alpha > thresh).sum(axis=1) > 2
    bands, start = [], None
    for y, v in enumerate(ink):
        if v and start is None:
            start = y
        if not v and start is not None:
            bands.append((start, y)); start = None
    if start is not None:
        bands.append((start, len(ink)))
    return [b for b in bands if b[1] - b[0] > 6]


def trim(img: Image.Image, pad=0) -> Image.Image:
    box = img.getchannel("A").point(lambda v: 255 if v > 20 else 0).getbbox()
    x0, y0, x1, y1 = box
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def lockup(mark: Image.Image, word: Image.Image, homes: Image.Image) -> Image.Image:
    """Mark on the left, SATTVA over HOMES on the right, all vertically centred."""
    h = 400
    mark = mark.resize((round(mark.width * h / mark.height), h), Image.LANCZOS)
    text_w = round(h * 1.9)
    word = word.resize((text_w, round(word.height * text_w / word.width)), Image.LANCZOS)
    homes = homes.resize((text_w, round(homes.height * text_w / homes.width)), Image.LANCZOS)
    gap_x, gap_y = round(h * 0.16), round(h * 0.09)
    text_h = word.height + gap_y + homes.height
    canvas = Image.new("RGBA", (mark.width + gap_x + text_w, max(h, text_h)), (0, 0, 0, 0))
    canvas.alpha_composite(mark, (0, (canvas.height - h) // 2))
    ty = (canvas.height - text_h) // 2
    canvas.alpha_composite(word, (mark.width + gap_x, ty))
    canvas.alpha_composite(homes, (mark.width + gap_x, ty + word.height + gap_y))
    return canvas


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    rgb = np.asarray(Image.open(SRC).convert("RGB")).astype(np.float32)
    bg = np.percentile(np.concatenate([rgb[:20].reshape(-1, 3), rgb[-20:].reshape(-1, 3)]), 95, axis=0)
    logo = separate_inks(rgb, bg)
    rev = reverse(logo)

    full, full_rev = Image.fromarray(logo, "RGBA"), Image.fromarray(rev, "RGBA")
    trim(full, 8).save(OUT / "sattva-logo.png", optimize=True)
    trim(full_rev, 8).save(OUT / "sattva-logo-reversed.png", optimize=True)

    # Bands top to bottom: mark, SATTVA, HOMES (with rules), BRISBANE.
    bands = rows_with_ink(logo[..., 3])
    if len(bands) < 4:
        raise SystemExit(f"expected 4 bands in the logo, found {bands}")
    (m0, m1), (w0, w1), (h0, h1) = bands[0], bands[1], bands[2]
    for src, suffix in ((full, ""), (full_rev, "-reversed")):
        mark = trim(src.crop((0, m0, src.width, m1)))
        word = trim(src.crop((0, w0, src.width, w1)))
        homes = trim(src.crop((0, h0, src.width, h1)))
        lockup(mark, word, homes).save(OUT / f"sattva-lockup{suffix}.png", optimize=True)
        mark.save(OUT / f"sattva-mark{suffix}.png", optimize=True)

    # App icons: the mark centred on white, so it reads in light and dark browser chrome.
    mark = trim(full.crop((0, m0, full.width, m1)))
    for name, size in (("icon.png", 512), ("apple-icon.png", 180)):
        canvas = Image.new("RGBA", (size, size), (255, 255, 255, 255))
        s = size * 0.74 / max(mark.size)
        m = mark.resize((round(mark.width * s), round(mark.height * s)), Image.LANCZOS)
        canvas.alpha_composite(m, ((size - m.width) // 2, (size - m.height) // 2))
        canvas.convert("RGB").save(APP / name, optimize=True)
    print("bands", bands, "bg", bg.round())
    for f in sorted(OUT.glob("sattva-*.png")):
        print(f.name, Image.open(f).size)


main()
