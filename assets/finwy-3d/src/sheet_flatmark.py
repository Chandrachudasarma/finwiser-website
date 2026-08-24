#!/usr/bin/env python3
"""Look-at-it sheet for the flat mark: actual size at 128/64/32/16 px, with a
4x nearest-neighbour zoom of 64/32/16, on white and on --navy."""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import rasterise
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
OUT = Path("/Volumes/FinwiserDev/finwiser-projects/website-audit-2026-08-23/"
           "screenshots/tier2")
TMP = Path("/private/tmp/claude-501/-Volumes-FinwiserDev-finwiser-projects/"
           "42146559-fd94-42fd-945a-eeb176dd311c/scratchpad")
NAVY = (0, 45, 86)
SIZES = [128, 64, 32, 16]
ZOOM = {64: 4, 32: 4, 16: 4}


def sheet(svg, out_name, title):
    imgs = {h: rasterise(svg, TMP / f"_fm{h}.png", height=h).convert("RGBA")
            for h in SIZES}
    cols = []
    for h in SIZES:
        z = ZOOM.get(h, 0)
        cols.append(max(imgs[h].width, imgs[h].width * z) + 34)
    W, rowh = sum(cols) + 40, 300
    H = rowh * 2 + 20
    s = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(s)
    d.rectangle([0, rowh + 10, W, H], fill=NAVY)
    for row, ink in enumerate(((0, 0, 0), (255, 255, 255))):
        y0 = 34 + row * (rowh + 10)
        d.text((20, y0 - 26), f"{title}   on {'--navy #002d56' if row else 'white'}",
               fill=ink)
        x = 24
        for i, h in enumerate(SIZES):
            im = imgs[h]
            d.text((x, y0 - 12), f"{h}px", fill=ink)
            s.paste(im, (x, y0 + 4), im)
            z = ZOOM.get(h, 0)
            if z:
                zz = im.resize((im.width * z, im.height * z), Image.NEAREST)
                s.paste(zz, (x, y0 + 4 + imgs[128].height + 16), zz)
                d.text((x, y0 + imgs[128].height + 4), f"{z}x", fill=ink)
            x += cols[i]
    s.save(OUT / out_name)
    print("  ->", (OUT / out_name).name, s.size)


if __name__ == "__main__":
    sheet(HERE.parent / "finwy-mark-flat.svg", "logo3d-flatmark-sizes.png",
          "finwy-mark-flat.svg")
