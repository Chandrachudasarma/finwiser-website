#!/usr/bin/env python3
"""Step 5 — favicon / app-icon set into assets/finwy-3d/favicon/.

Split by size, because one artwork cannot cover 16px and 512px:
  16 / 32 / favicon.svg   the FLAT mark  - the render is mud below ~48px
  180 / 192 / 512         the 3D HEAD on a navy rounded tile - at those sizes
                          the render is the point, and a tile stops the
                          transparent silhouette from vanishing on a dark
                          home screen.

NOTHING here overwrites the root favicon.* files. The PM swaps them after the
founder signs off.
"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import rasterise
from PIL import Image, ImageDraw

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
FAV = OUT / "favicon"
FAV.mkdir(exist_ok=True)
TMP = Path("/private/tmp/claude-501/-Volumes-FinwiserDev-finwiser-projects/"
           "42146559-fd94-42fd-945a-eeb176dd311c/scratchpad")

NAVY = (0, 45, 86, 255)
FLAT = OUT / "finwy-mark-flat.svg"


def square_svg():
    """the flat mark centred in a square viewBox with 6% breathing room"""
    src = FLAT.read_text()
    inner = src.split("</title>", 1)[1].rsplit("</svg>", 1)[0]
    vb = src.split('viewBox="0 0 ', 1)[1].split('"', 1)[0].split()
    w, h = float(vb[0]), float(vb[1])
    side = max(w, h) * 1.12
    dx, dy = (side - w) / 2, (side - h) / 2
    return ('<svg xmlns="http://www.w3.org/2000/svg" role="img" '
            f'aria-label="Finwiser" viewBox="0 0 {side:g} {side:g}" '
            f'width="{side:g}" height="{side:g}"><title>Finwiser</title>'
            f'<g transform="translate({dx:.1f},{dy:.1f})">{inner}</g></svg>')


def flat_png(size):
    """render at 8x and LANCZOS down - Chrome's direct 16px SVG raster drops
    the stitch row entirely; the downsample keeps it as a grey suggestion,
    which is what makes the 16px icon still read as a face."""
    big = rasterise(FAV / "favicon.svg", TMP / f"_fv{size}.png",
                    height=size * 8).convert("RGBA")
    return big.resize((size, size), Image.LANCZOS)


def tile(size, pad_frac=0.13, radius_frac=0.225):
    im = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    m = Image.new("L", (size * 4, size * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle(
        [0, 0, size * 4 - 1, size * 4 - 1], radius=int(size * 4 * radius_frac), fill=255)
    plate = Image.new("RGBA", (size, size), NAVY)
    im.paste(plate, (0, 0), m.resize((size, size), Image.LANCZOS))
    head = Image.open(HERE / "head-graded.png").convert("RGBA")
    inner = int(size * (1 - 2 * pad_frac))
    hh = inner
    hw = round(head.width * hh / head.height)
    if hw > inner:
        hw = inner; hh = round(head.height * hw / head.width)
    head = head.resize((hw, hh), Image.LANCZOS)
    im.alpha_composite(head, ((size - hw) // 2, (size - hh) // 2))
    return im


if __name__ == "__main__":
    (FAV / "favicon.svg").write_text(square_svg())
    print(f"  favicon.svg              {(FAV/'favicon.svg').stat().st_size/1024:5.2f} KB  (flat mark, square)")
    for s in (16, 32, 48):
        p = FAV / f"favicon-{s}.png"
        flat_png(s).save(p, optimize=True)
        print(f"  favicon-{s}.png{'':<11} {p.stat().st_size/1024:5.2f} KB  flat mark")
    for s, name in ((180, "apple-touch-icon-180.png"), (192, "icon-192.png"),
                    (512, "icon-512.png")):
        p = FAV / name
        tile(s).save(p, optimize=True)
        print(f"  {name:<24} {p.stat().st_size/1024:5.2f} KB  3D head on a navy tile")
    # maskable variant: Android crops to a circle inscribed in 80% of the box
    p = FAV / "icon-512-maskable.png"
    tile(512, pad_frac=0.22, radius_frac=0.0).save(p, optimize=True)
    print(f"  {'icon-512-maskable.png':<24} {p.stat().st_size/1024:5.2f} KB  full-bleed navy, 22% safe zone")
