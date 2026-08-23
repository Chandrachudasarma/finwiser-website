#!/usr/bin/env python3
"""Look-at-it sheets for the two lockups: 1600 / 240 (nav desktop @2x) /
120 (nav mobile @2x) wide, each on white and on --navy, plus a 3x zoom of the
head/letter junction so the optical alignment and the alpha edge can be judged.
"""
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
WIDTHS = [1600, 240, 120]


def sheet(svg, name, ground, ink):
    ims = [rasterise(svg, TMP / f"_lk{w}.png", width=w).convert("RGBA")
           for w in WIDTHS]
    zoom = ims[0].crop((int(ims[0].width * .27), 0,
                        int(ims[0].width * .60), ims[0].height))
    zoom = zoom.resize((zoom.width * 2, zoom.height * 2), Image.LANCZOS)
    H = 40 + ims[0].height + 40 + ims[1].height + 30 + ims[2].height + 40 + zoom.height + 40
    W = max(1700, zoom.width + 80)
    s = Image.new("RGB", (W, H), ground or (255, 255, 255))
    d = ImageDraw.Draw(s)
    y = 34
    for w, im in zip(WIDTHS, ims):
        d.text((40, y - 16), f"{w}px wide"
               + ("   (nav desktop @2x)" if w == 240 else
                  "   (nav mobile @2x)" if w == 120 else "   (master)"), fill=ink)
        s.paste(im, (40, y), im)
        y += im.height + 40
    d.text((40, y - 16), "2x zoom on the head / letter junction", fill=ink)
    s.paste(zoom, (40, y), zoom)
    s.save(OUT / name)
    print("  ->", name, s.size)


if __name__ == "__main__":
    P = HERE.parent
    sheet(P / "finwiser-logo-3d.svg", "logo3d-lockup-white.png",
          (255, 255, 255), (0, 0, 0))
    sheet(P / "finwiser-logo-3d-reversed.svg", "logo3d-lockup-navy.png",
          NAVY, (255, 255, 255))


def nav_sheet():
    """The slots the founder actually judges: 64 CSS px tall (desktop nav) and
    56 CSS px tall (mobile nav), shown at 1x from the @2x raster, on both
    grounds, with a 3x zoom underneath."""
    P = HERE.parent
    rows = []
    for svg, ground, ink in ((P / "finwiser-logo-3d.svg", (255, 255, 255), (0, 0, 0)),
                             (P / "finwiser-logo-3d-reversed.svg", NAVY, (255, 255, 255))):
        for h in (64, 56, 40):
            big = rasterise(svg, TMP / f"_nv{h}.png", height=h * 4).convert("RGBA")
            rows.append((big.resize((round(big.width / 4), h), Image.LANCZOS),
                         ground, ink, h))
    W = max(r[0].width * 3 for r in rows) + 80
    H = sum(r[0].height * 4 + 46 for r in rows) + 40
    s = Image.new("RGB", (W, H), (255, 255, 255))
    d = ImageDraw.Draw(s)
    y = 20
    for im, ground, ink, h in rows:
        blk = im.height * 4 + 46
        d.rectangle([0, y, W, y + blk], fill=ground)
        d.text((30, y + 8), f"{h} CSS px tall   on {'--navy' if ground == NAVY else 'white'}",
               fill=ink)
        s.paste(im, (30, y + 24), im)
        z = im.resize((im.width * 3, im.height * 3), Image.NEAREST)
        s.paste(z, (30 + im.width + 40, y + 24), z)
        y += blk
    s.save(OUT / "logo3d-nav-sizes.png")
    print("  -> logo3d-nav-sizes.png", s.size)
