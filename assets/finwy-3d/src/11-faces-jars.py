#!/usr/bin/env python3
"""Step 11 — expression heads and the two jar scenes (Wave 3).

Faces: `incoming/finwy3d-face-{happy,thinking,worried}-v01.png`, 1254 square.
Placed beside copy at <= 96 CSS px, so 96 / 192 / 288 covers 1x / 2x / 3x.

Jars: `finwy3d-jars-simple-v02` replaces `finwy3d-jars-v01` at every slot that
uses `finwy3d-jars-*` (seen-scene centre 260/130/96 CSS px, step-02 flow lane
124/64 CSS px) — every one of those is under the 288 CSS px line, so the simple
composition is the one that ships. `finwy3d-jars-detailed-v01` is exported
under its own name at the larger widths, ready for the first slot that is
actually >= 288 CSS px; nothing references it yet.

Run:  python3 src/11-faces-jars.py
"""
import re
from pathlib import Path

import numpy as np
import scipy.ndimage as ndi
from PIL import Image

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent
INC = ROOT / "incoming"

import importlib.util
spec = importlib.util.spec_from_file_location("act", HERE / "10-hero-action.py")
act = importlib.util.module_from_spec(spec)
spec.loader.exec_module(act)

JOBS = [
    # (incoming stem, output stem, widths)
    ("finwy3d-face-happy",    "finwy3d-face-happy",    [96, 192, 288]),
    ("finwy3d-face-thinking", "finwy3d-face-thinking", [96, 192, 288]),
    ("finwy3d-face-worried",  "finwy3d-face-worried",  [96, 192, 288]),
    ("finwy3d-jars-simple",   "finwy3d-jars",          [260, 520, 780]),
    ("finwy3d-jars-detailed", "finwy3d-jars-detailed", [520, 780]),
]

for src_stem, out_stem, widths in JOBS:
    src = act.newest(src_stem)
    if src is None:
        print(f"!! {src_stem}: nothing in incoming/ — skipped")
        continue
    a, k = act.matte(src)
    im = act.to_rgba(a, k)
    im = im.crop(im.getchannel("A").getbbox())
    print(f"{src.name} -> {out_stem}  native {im.size}  aspect {im.width/im.height:.4f}")
    for w in widths:
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(ROOT / f"{out_stem}-{w}w.webp", "WEBP", quality=88, method=6)
        r.save(ROOT / f"{out_stem}-{w}w.avif", "AVIF", quality=62)
        print(f"    {out_stem}-{w}w  {w}x{h}  "
              f"webp {(ROOT/f'{out_stem}-{w}w.webp').stat().st_size/1024:5.1f} KB  "
              f"avif {(ROOT/f'{out_stem}-{w}w.avif').stat().st_size/1024:5.1f} KB")
