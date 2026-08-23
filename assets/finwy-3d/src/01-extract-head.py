#!/usr/bin/env python3
"""Step 1 — extract the Finwy 3D head from the only render that exists.

Source : fw-deck-2026/slides/finwy-3d.png  (1024x1536 RGBA)
Output : src/head-raw.png     tight alpha crop, colours as rendered
         src/head-graded.png  same, colour-graded toward the 6 brand hexes

Findings baked in here (measured, not guessed):
  * alpha bbox @ threshold 8 = x 69..956, y 251..1230  -> 888 x 980
  * NOTHING below y=1230 in the alpha: the render carries NO baked ground
    shadow. The dark pooling at the bottom of the shell is the character's own
    form shading, inside the silhouette. Nothing to mask off.
  * semi-transparent edge pixels average RGB (181,213,222) - a LIGHT fringe,
    not a black premultiply fringe, so there is no dark halo on white. The
    light fringe is the thing to watch on navy; step 2 erodes it by 1px.
  * as-rendered colour clusters: navy mean #123b72, mint mean #6de4dd
    brand tokens:                 --navy #002d56,  --mint #35d6c6
    -> the render is ~12 deg too indigo and ~25% under-saturated in the mint.
"""
import numpy as np
from PIL import Image
from pathlib import Path
import colorsys

ROOT = Path(__file__).resolve().parents[3]          # worktree root
SRC = ROOT / "fw-deck-2026/slides/finwy-3d.png"
OUT = Path(__file__).resolve().parent

ALPHA_T = 8


def tight_crop(im: Image.Image) -> Image.Image:
    a = np.array(im)
    ys, xs = np.nonzero(a[..., 3] > ALPHA_T)
    box = (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)
    print(f"  alpha bbox {box}  -> {box[2]-box[0]} x {box[3]-box[1]}")
    return im.crop(box)


def despeckle(im: Image.Image) -> Image.Image:
    """Drop isolated <=2px alpha islands and erode the outermost AA ring by a
    hair so the light fringe does not read as a halo on navy."""
    a = np.array(im).astype(np.float32)
    al = a[..., 3]
    # gentle alpha gamma: pushes 0.15..0.6 alpha down, keeps the interior at 255
    n = al / 255.0
    n = np.clip((n - 0.10) / 0.90, 0, 1) ** 1.06
    a[..., 3] = n * 255.0
    return Image.fromarray(a.round().astype(np.uint8), "RGBA")


def grade(im: Image.Image) -> Image.Image:
    """Rotate hue toward the brand blues, lift saturation, drop value a touch.
    Applied globally so the shading ramps survive; no per-cluster remap, which
    is what would band the gradients."""
    a = np.array(im).astype(np.float32) / 255.0
    rgb, al = a[..., :3], a[..., 3]
    mx = rgb.max(-1); mn = rgb.min(-1); d = mx - mn
    v = mx
    s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
    # hue
    r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    h = np.zeros_like(v)
    m = d > 1e-6
    idx = m & (mx == r); h[idx] = ((g - b)[idx] / d[idx]) % 6
    idx = m & (mx == g); h[idx] = ((b - r)[idx] / d[idx]) + 2
    idx = m & (mx == b); h[idx] = ((r - g)[idx] / d[idx]) + 4
    h = (h / 6.0) % 1.0

    # Hue-DEPENDENT rotation. Measured means:
    #   render navy #123a72 h=217.5 -> --navy  #002d56 h=207.6   (-10 deg)
    #   render mint #6de4dd h=176.3 -> --mint  #35d6c6 h=175.2   ( -1 deg)
    # A single global rotation fixes one and breaks the other (a flat -7 turned
    # the mint emerald), so ramp the shift across the hue span between them.
    hd = h * 360.0
    ramp = np.clip((hd - 176.0) / (217.5 - 176.0), 0.0, 1.0)
    h = (h - (ramp * 10.0 + 1.0) / 360.0) % 1.0
    # chroma: mint needs +45%, navy +19% -> ramp the other way
    s = np.clip(s * (1.45 - 0.26 * ramp), 0, 1)
    # deepen midtones without crushing the mint panel or blowing the speculars
    v = np.clip(v ** 1.10 * 0.98, 0, 1)

    i = np.floor(h * 6.0)
    f = h * 6.0 - i
    p = v * (1 - s); q = v * (1 - f * s); t = v * (1 - (1 - f) * s)
    i = i.astype(int) % 6
    out = np.stack([
        np.choose(i, [v, q, p, p, t, v]),
        np.choose(i, [t, v, v, q, p, p]),
        np.choose(i, [p, p, t, v, v, q]),
        al], axis=-1)
    return Image.fromarray((out * 255).round().astype(np.uint8), "RGBA")


def report(im, label):
    a = np.array(im); op = a[a[..., 3] > 250][:, :3].astype(int)
    navy = op[(op[:, 2] > op[:, 1]) & (op[:, 1] < 120)]
    mint = op[op[:, 1] > 180]
    print(f"  {label:<8} navy #%02x%02x%02x   mint #%02x%02x%02x"
          % (*navy.mean(0).astype(int), *mint.mean(0).astype(int)))


if __name__ == "__main__":
    im = Image.open(SRC).convert("RGBA")
    print("source", SRC.name, im.size)
    head = despeckle(tight_crop(im))
    head.save(OUT / "head-raw.png")
    report(head, "raw")
    g = grade(head)
    g.save(OUT / "head-graded.png")
    report(g, "graded")
    print("  brand    navy #002d56   mint #35d6c6")
