#!/usr/bin/env python3
"""Step 9 — ship the two new ChatGPT 3D poses at the slots that use them.

  finwy3d-wave-v02  -> hero settled frame (Motion §9.5). Hero slot is capped at
                       260 CSS px desktop / 204 mobile, so 260 / 408 / 520 / 780
                       covers 1x, mobile 2x, desktop 2x and 3x.
  finwy3d-jars-v01  -> replaces finwy-allocating everywhere (seen-scene centre,
                       260/130/96 px, and the step-02 flow lane, 124/64 px), so
                       260 / 520 / 780 covers 1x/2x/3x of the largest slot.

Both are cut out of their baked black-vignette + teal-glow background by
08-cut-incoming.py first; this script only resizes and encodes.
Run:  python3 src/09-scene-rasters.py
"""
from pathlib import Path
from PIL import Image
import importlib.util, sys

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent                    # assets/finwy-3d
spec = importlib.util.spec_from_file_location("cut", HERE / "08-cut-incoming.py")
cut = importlib.util.module_from_spec(spec); spec.loader.exec_module(cut)

JOBS = [
    ("incoming/finwy3d-wave-v02.png", "finwy3d-wave", [260, 408, 520, 780]),
    ("incoming/finwy3d-jars-v01.png", "finwy3d-jars", [260, 520, 780]),
]

for src, stem, widths in JOBS:
    tmp = HERE / f"{stem}-cut.png"
    im = cut.matte(str(ROOT / src), str(tmp))
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(ROOT / f"{stem}-{w}w.webp", "WEBP", quality=88, method=6)
        r.save(ROOT / f"{stem}-{w}w.avif", "AVIF", quality=62)
        print(f"  {stem}-{w}w  {w}x{h}  "
              f"webp {(ROOT/f'{stem}-{w}w.webp').stat().st_size//1024} KB  "
              f"avif {(ROOT/f'{stem}-{w}w.avif').stat().st_size//1024} KB")
    print(f"{stem}: native {im.size}, aspect {im.width/im.height:.4f}")
