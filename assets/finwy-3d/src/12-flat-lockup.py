#!/usr/bin/env python3
"""Step 12 — the flat-mark lockup, and the measurement the nav decision needs.

README §8 rule: **3D head at >= 48 CSS px, flat mark below.** The nav logo is
30 CSS px tall on a phone and 38 on desktop (brand.css §9.1), so the question
is what the head measures at those heights — not what the bar measures.

This script
  1. builds `finwiser-logo-flat.svg` / `-reversed.svg`: the identical wordmark
     with the flat mark substituted into the W slot in place of the embedded
     3D WebP, so the two lockups are drop-in swaps for each other (same
     viewBox, same aspect 5.152, same letter-spacing);
  2. rasterises both families at the real nav heights and MEASURES the head's
     ink, so the >= 48 px rule is decided on a number and not on an assumption.

Run:  python3 src/12-flat-lockup.py
"""
import re
from pathlib import Path

import numpy as np
from PIL import Image

import importlib.util
HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
spec = importlib.util.spec_from_file_location("render", HERE / "render.py")
render = importlib.util.module_from_spec(spec)
spec.loader.exec_module(render)

SHEETS = Path(__file__).resolve().parents[4] / \
    "website-audit-2026-08-23/screenshots/tier2"
SHEETS.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------- build ----
lockup = (ROOT / "finwiser-logo-3d.svg").read_text()
flat = (ROOT / "finwy-mark-flat.svg").read_text()

m = re.search(r'<image id="finwy-head"[^>]*?/>', lockup)
assert m, "head <image> not found in finwiser-logo-3d.svg"
head_tag = m.group(0)
attrs = dict(re.findall(r'(\w+)="([^"]+)"', head_tag))
x, y = float(attrs["x"]), float(attrs["y"])
w, h = float(attrs["width"]), float(attrs["height"])

# the flat mark's own box
fvb = re.search(r'viewBox="([\d.\s-]+)"', flat).group(1).split()
fw, fh = float(fvb[2]), float(fvb[3])
body = flat[flat.index(">", flat.index("<title")) + 1:flat.rindex("</svg>")]
body = body.replace("</title>", "")
body = re.sub(r"<title>.*?</title>", "", body, flags=re.S)

nested = (f'<svg x="{x}" y="{y}" width="{w}" height="{h}" '
          f'viewBox="0 0 {fw} {fh}" preserveAspectRatio="xMidYMid meet" '
          f'overflow="visible">{body}</svg>')

flat_lockup = lockup.replace(head_tag, nested)
(ROOT / "finwiser-logo-flat.svg").write_text(flat_lockup)
(ROOT / "finwiser-logo-flat-reversed.svg").write_text(
    flat_lockup.replace('fill="#002d56"', 'fill="#ffffff"')
    # the mark itself must stay navy-on-mint-contour so it reads on both
    # grounds; only the LETTERS reverse. Put the mark's own fill back.
    .replace(f'<svg x="{x}"', f'<svg data-mark="1" x="{x}"'))

# the blanket replace above also whitened the mark's body fill — restore it
rev = (ROOT / "finwiser-logo-flat-reversed.svg").read_text()
i = rev.index('<svg data-mark="1"')
j = rev.index("</svg>", i) + 6
rev = rev[:i] + nested.replace("<svg x=", '<svg data-mark="1" x=') + rev[j:]
(ROOT / "finwiser-logo-flat-reversed.svg").write_text(rev)

for f in ("finwiser-logo-flat.svg", "finwiser-logo-flat-reversed.svg"):
    print(f"{f}  {(ROOT/f).stat().st_size/1024:.1f} KB")

# ------------------------------------------------------------- measure ----
def head_ink(svg, height):
    """Rasterise at a CSS height and return (total ink h, head ink h) in px."""
    out = ROOT / f".__m_{Path(svg).stem}_{height}.png"
    render.rasterise(ROOT / svg, out, height=height * 8, bg="transparent")
    a = np.array(Image.open(out).convert("RGBA").getchannel("A")) > 8
    ys, xs = np.nonzero(a)
    total_h = (ys.max() - ys.min() + 1) / 8
    # the head sits in the W slot: viewBox x 117.23 .. 175.26 of 329.95
    W = a.shape[1]
    x0, x1 = int(W * 117.2318 / 329.94996), int(W * (117.2318 + 58.0317) / 329.94996)
    sub = a[:, x0:x1]
    sy = np.nonzero(sub)[0]
    out.unlink(missing_ok=True)
    return total_h, (sy.max() - sy.min() + 1) / 8, (x1 - x0) / 8


print("\nHEAD SIZE AT THE REAL NAV HEIGHTS  (README rule: 3D head >= 48 CSS px)")
print(f"{'lockup':34s} {'nav logo h':>10s} {'lockup w':>9s} {'head h':>7s} {'head w':>7s}  verdict")
for svg in ("finwiser-logo-3d.svg", "finwiser-logo-flat.svg"):
    for hgt in (30, 38, 44, 48, 56):
        th, hh, hw = head_ink(svg, hgt)
        is3d = "3d" in svg
        ok = ("n/a — flat mark, no floor above 16px" if not is3d
              else ("OK" if hh >= 48 else f"FAILS (<48)"))
        print(f"{svg:34s} {hgt:8d}px {hgt*5.152:8.1f}px {hh:6.1f}px {hw:6.1f}px  {ok}")

# --------------------------------------------------------------- sheet ----
rows = []
for hgt in (30, 38, 48):
    for svg, ground in (("finwiser-logo-3d.svg", "#ffffff"),
                        ("finwiser-logo-3d-reversed.svg", "#001f3d"),
                        ("finwiser-logo-flat.svg", "#ffffff"),
                        ("finwiser-logo-flat-reversed.svg", "#001f3d")):
        p = ROOT / f".__s_{Path(svg).stem}_{hgt}.png"
        render.rasterise(ROOT / svg, p, height=hgt * 3, bg=ground)
        rows.append((f"{Path(svg).stem}  @{hgt}px", Image.open(p), ground))

PADX, PADY, LBL = 24, 30, 16
Wt = max(im.width for _, im, _ in rows) + 2 * PADX
Ht = sum(im.height + PADY + LBL for _, im, _ in rows) + PADY
sheet = Image.new("RGB", (Wt, Ht), (245, 246, 248))
from PIL import ImageDraw
d = ImageDraw.Draw(sheet)
yy = PADY
for lbl, im, ground in rows:
    d.rectangle([PADX - 8, yy - 6, PADX + im.width + 8, yy + im.height + 6],
                fill=ground)
    sheet.paste(im, (PADX, yy), im if im.mode == "RGBA" else None)
    d.text((PADX, yy + im.height + 8), lbl, fill=(30, 40, 55))
    yy += im.height + PADY + LBL
sheet.save(SHEETS / "home3-nav-logo-variants.png")
for p in ROOT.glob(".__s_*.png"):
    p.unlink()
print(f"\nsheet -> {SHEETS/'home3-nav-logo-variants.png'}")
