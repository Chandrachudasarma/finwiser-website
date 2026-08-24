#!/usr/bin/env python3
"""Step 3 — PNG + WebP rasters of both lockups, for the slots that cannot take
an SVG (og tags, email, Play listing, anything that needs a fixed pixel box).

Nav heights come from the tier-2 spec: 64 CSS px desktop, 56 CSS px mobile.
  desktop  2x -> 128 tall   3x -> 192 tall
  mobile   2x -> 112 tall   3x -> 168 tall
plus a 1600px-WIDE master of each variant.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import rasterise
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
RAS = OUT / "raster"
RAS.mkdir(exist_ok=True)

HEIGHTS = [("nav-desktop@2x", 128), ("nav-desktop@3x", 192),
           ("nav-mobile@2x", 112), ("nav-mobile@3x", 168)]

VARIANTS = [("finwiser-logo-3d.svg", "finwiser-logo-3d"),
            ("finwiser-logo-3d-reversed.svg", "finwiser-logo-3d-reversed")]

if __name__ == "__main__":
    for svg, stem in VARIANTS:
        for label, h in HEIGHTS:
            # render at 4x then downsample: Chrome's own SVG raster at 112px
            # tall soft-pedals the letterform edges, LANCZOS from 4x does not
            tmp = HERE / f".tmp_{stem}_{h}.png"
            big = rasterise(OUT / svg, tmp, height=h * 4)
            im = big.convert("RGBA").resize(
                (round(big.width / 4), h), Image.LANCZOS)
            name = f"{stem}-{h}h"
            im.save(RAS / f"{name}.png", optimize=True)
            im.save(RAS / f"{name}.webp", "WEBP", quality=92, method=6)
            tmp.unlink(missing_ok=True)
            print(f"  {name:<38} {im.size}  png {(RAS/(name+'.png')).stat().st_size/1024:5.1f} KB"
                  f"  webp {(RAS/(name+'.webp')).stat().st_size/1024:5.1f} KB   [{label}]")
        # 1600-wide master
        tmp = HERE / f".tmp_{stem}_m.png"
        big = rasterise(OUT / svg, tmp, width=1600 * 2)
        im = big.convert("RGBA").resize((1600, round(big.height / 2)), Image.LANCZOS)
        name = f"{stem}-1600w"
        im.save(RAS / f"{name}.png", optimize=True)
        im.save(RAS / f"{name}.webp", "WEBP", quality=90, method=6)
        tmp.unlink(missing_ok=True)
        print(f"  {name:<38} {im.size}  png {(RAS/(name+'.png')).stat().st_size/1024:5.1f} KB"
              f"  webp {(RAS/(name+'.webp')).stat().st_size/1024:5.1f} KB   [master]")
