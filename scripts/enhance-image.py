"""
Prepares a large, crisp web master from a render: gentle clean-up of JPEG blockiness,
high-quality upscale for high-DPI screens, then a light unsharp mask. It can't add detail
that isn't in the source; ask the client for the original renders (usually 4000px+).

Usage: python scripts/enhance-image.py <input> <output.jpg> [--width 3200]
"""
import argparse
from PIL import Image, ImageFilter

p = argparse.ArgumentParser()
p.add_argument("input")
p.add_argument("output")
p.add_argument("--width", type=int, default=3200)
args = p.parse_args()

im = Image.open(args.input).convert("RGB")
w, h = im.size

# 1. Soften 8x8 JPEG block edges before enlarging, so they don't get magnified.
im = im.filter(ImageFilter.SMOOTH)

# 2. Enlarge in two Lanczos steps (smoother than one big jump).
if args.width > w:
    mid = (w + args.width) // 2
    im = im.resize((mid, round(h * mid / w)), Image.LANCZOS)
    im = im.resize((args.width, round(h * args.width / w)), Image.LANCZOS)

# 3. Restore edge crispness: a wide gentle pass for form, a tight pass for fine lines.
im = im.filter(ImageFilter.UnsharpMask(radius=2.4, percent=70, threshold=2))
im = im.filter(ImageFilter.UnsharpMask(radius=0.8, percent=45, threshold=1))

im.save(args.output, "JPEG", quality=93, optimize=True, progressive=True, subsampling=0)
print(args.output, im.size)
