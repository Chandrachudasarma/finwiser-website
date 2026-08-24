#!/usr/bin/env python3
"""Step 7 — hero-size sharpness check, and the honest resolution ceiling.

The homepage hero slot is 204 CSS px wide (desktop) and there is a 260 CSS px
variant. Device pixels needed:
    204 @2x = 408   204 @3x = 612   260 @2x = 520   260 @3x = 780

The render's OPAQUE pixels are 888 x 980 (the file is 1024 x 1536, the rest is
transparent padding - quoting 1024/2 = 512 counts padding and overstates it).
So, downscale-only:
    2x-sharp up to  888/2 = 444 CSS px wide   (490 CSS px tall)
    3x-sharp up to  888/3 = 296 CSS px wide   (326 CSS px tall)
Every hero size above is a DOWNSCALE except 260 @3x = 780, which is still a
downscale at 1.14x headroom. Nothing here is upscaled, which is exactly what
the retired 409px raster could not say.

Writes the proof sheet to the audit screenshots folder.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
OUT = Path("/Volumes/FinwiserDev/finwiser-projects/website-audit-2026-08-23/"
           "screenshots/tier2")
RAS = HERE.parent / "raster"
NAVY = (0, 45, 86)
SRC_W, SRC_H = 888, 980

SLOTS = [("204 CSS @2x", 408), ("204 CSS @3x", 612),
         ("260 CSS @2x", 520), ("260 CSS @3x", 780)]

if __name__ == "__main__":
    head = Image.open(HERE / "head-graded.png").convert("RGBA")
    pad = 26
    cols = [w + pad for _, w in SLOTS]
    W = sum(cols) + pad
    H = max(round(w * SRC_H / SRC_W) for _, w in SLOTS) + 340
    s = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(s)
    band = H - 300
    d.rectangle([0, band, W, H], fill=NAVY)
    x = pad
    for (label, w) in SLOTS:
        h = round(w * SRC_H / SRC_W)
        im = head.resize((w, h), Image.LANCZOS)
        s.paste(im, (x, 40), im)
        ratio = SRC_W / w
        d.text((x, 14), f"{label}  =  {w}x{h} device px   "
                        f"[{'downscale' if ratio >= 1 else 'UPSCALE'} {ratio:.2f}x]",
               fill=(0, 0, 0))
        # 1:1 detail crop of the face, on navy, to show the edge quality
        cw = min(260, w)
        crop = im.crop((round(w * 0.22), round(h * 0.30),
                        round(w * 0.22) + cw, round(h * 0.30) + 180))
        s.paste(crop, (x, band + 46), crop)
        d.text((x, band + 22), "1:1 detail on --navy", fill=(255, 255, 255))
        # save the deliverable raster
        p = RAS / f"finwy-3d-hero-{w}w.webp"
        im.save(p, "WEBP", quality=90, method=6)
        im.save(p.with_suffix(".png"), optimize=True)
        x += w + pad
    d.text((pad, band + 250),
           f"source opaque {SRC_W}x{SRC_H} -> 2x-sharp to {SRC_W//2} CSS px wide "
           f"({SRC_H//2} tall);  3x-sharp to {SRC_W//3} CSS px wide "
           f"({SRC_H//3} tall). No slot above is upscaled.",
           fill=(255, 255, 255))
    s.save(OUT / "logo3d-hero-sizes.png")
    print("  ->", (OUT / "logo3d-hero-sizes.png").name, s.size)
    for _, w in SLOTS:
        p = RAS / f"finwy-3d-hero-{w}w.webp"
        print(f"  finwy-3d-hero-{w}w.webp  {p.stat().st_size/1024:5.1f} KB   "
              f"png {(p.with_suffix('.png')).stat().st_size/1024:6.1f} KB")
