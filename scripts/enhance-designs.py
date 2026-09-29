"""
Builds the web copies of the design facades in public/images/designs/ from the untouched
originals in research/source-images/designs/.

- Small originals (most of the catalogue is 340-377px wide) get the same clean-up, 2x
  upscale and sharpening as scripts/enhance-image.py, so cards stay crisp on high-DPI screens.
- Large originals are just re-saved as high-quality JPEG, capped at 3200px wide.

Run after `node scripts/import-designs.mjs`:  python scripts/enhance-designs.py
"""
import json
from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "research" / "source-images" / "designs"
OUT = ROOT / "public" / "images" / "designs"
SMALL = 1200  # below this, upscale


def enhance(im: Image.Image, width: int) -> Image.Image:
    w, h = im.size
    im = im.filter(ImageFilter.SMOOTH)
    mid = (w + width) // 2
    im = im.resize((mid, round(h * mid / w)), Image.LANCZOS)
    im = im.resize((width, round(h * width / w)), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.6, percent=65, threshold=2))
    return im.filter(ImageFilter.UnsharpMask(radius=0.6, percent=40, threshold=1))


designs = json.loads((ROOT / "src" / "data" / "designs.json").read_text(encoding="utf8"))
OUT.mkdir(parents=True, exist_ok=True)
for old in OUT.glob("*"):
    old.unlink()

upscaled = 0
for d in designs:
    src = next(SRC.glob(f"{d['slug']}.*"))
    im = Image.open(src).convert("RGB")
    if im.width < SMALL:
        im = enhance(im, min(im.width * 2, SMALL))
        upscaled += 1
    elif im.width > 3200:
        im = im.resize((3200, round(im.height * 3200 / im.width)), Image.LANCZOS)
    im.save(OUT / f"{d['slug']}.jpg", "JPEG", quality=92, optimize=True, progressive=True, subsampling=0)

print(f"{len(designs)} web images written, {upscaled} upscaled from small originals")
