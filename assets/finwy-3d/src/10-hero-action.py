#!/usr/bin/env python3
"""Step 10 — the hero action storyboard (Wave 3).

The founder's storyboard is eight keyframes:

    01 asleep · 02 lifting · 03 arms-up grin · 04 leaning wave
    05 mid-spin · 06 jump · 07 landing · 08 the winking "Hi"

They arrive one at a time in `incoming/` as `finwy3d-act-NN-vNN.png`. This
script consumes **whatever exists right now** and emits a manifest; the hero in
index.html reads the manifest's frame list, so a re-run after more frames land
is the whole re-swap. Nothing here hard-codes eight.

Three things this does that a plain resize does not:

1. **Registration.** Each generation frames the character differently — the
   raw alpha bottoms of act-01/02/03 land at y=1211/1266/1292 on the same
   1024x1536 canvas. Played raw the character sinks 80px between keyframes.
   Every frame is re-anchored on (horizontal centroid of the bottom 40% of the
   silhouette, bottom of the silhouette) — the ground line and the body axis —
   onto one shared canvas, so the cross-fades read as one character moving and
   not as four different renders. The shared canvas is also why the settle
   frame can cross-fade over the last action frame without a jump.

   Scale is deliberately NOT normalised: the silhouette heights (977 sitting,
   1032 lifting, 1126 arms-up, 1162 arm-raised wave) differ because the poses
   differ, and the onion-skin proves the torsos land on top of each other.

2. **Matte.** Reuses `08-cut-incoming.py`'s structure-driven cut (the baked
   black vignette + additive teal bloom cannot be keyed on colour), plus a
   median-filter pass that takes the ragged bite out of the silhouette edge,
   plus multi-component retention so act-03's gold sparkle cues survive
   "largest component only".

3. **Ceilings.** The hero slot is 204 CSS px on a phone and 360 on desktop.
   The registered canvas is 1130 px of real opaque pixels — wider than the
   888 px single-render README §5 measured, so the honest ceilings move to
   2x-sharp at 565 CSS px and 3x-sharp at 377. 360 is inside both. The four
   tiers cover: 408 = phone 2x, 520 = 1x desktop headroom, 612 = phone 3x,
   780 = desktop 2x. Nothing here is an upscale.

Run:  python3 src/10-hero-action.py
"""
import json, re, sys
from pathlib import Path

import numpy as np
import scipy.ndimage as ndi
from PIL import Image
from skimage.segmentation import watershed

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent                        # assets/finwy-3d
INC = ROOT / "incoming"
OUT = ROOT / "hero"
OUT.mkdir(exist_ok=True)

WIDTHS = [408, 520, 612, 780]
SMOOTH = 15          # median-filter window on the binary matte, px
KEEP_FRAC = 0.003    # keep components >= this fraction of the largest
PAD = 24             # transparent margin on the shared canvas, px

# Settle-frame preference, best first. act-08 is the winking "Hi" and is both
# the last action frame and the settle pose when it exists.
SETTLE_PREF = ["finwy3d-act-08", "finwy3d-hero-wave-energetic", "finwy3d-wave"]


def newest(stem):
    """Highest -vNN of `incoming/<stem>-vNN.png`, or None."""
    best, bestv = None, -1
    for p in INC.glob(f"{stem}-v*.png"):
        m = re.fullmatch(rf"{re.escape(stem)}-v(\d+)", p.stem)
        if m and int(m.group(1)) > bestv:
            best, bestv = p, int(m.group(1))
    return best


def matte(src):
    """Structure-driven cut. Returns (rgb float array, bool mask)."""
    a = np.array(Image.open(src).convert("RGB")).astype(np.float32)
    G, B = a[..., 1], a[..., 2]
    lum = a.max(-1)

    hp = lum - ndi.gaussian_filter(lum, 25)
    sil = ndi.binary_fill_holes(
        ndi.binary_closing(np.abs(hp) > 10, np.ones((15, 15))))
    mint = ndi.binary_fill_holes(
        ndi.binary_closing((G > 175) & (B > 150), np.ones((9, 9))))
    rough = ndi.binary_fill_holes(
        ndi.binary_closing(sil | mint, np.ones((11, 11))))
    n, c = ndi.label(rough)
    if c:
        rough = n == int(np.argmax(ndi.sum(rough, n, range(1, c + 1)))) + 1
    rough = ndi.binary_fill_holes(rough)

    fg = ndi.distance_transform_edt(rough) > 8
    bg = ~ndi.binary_dilation(rough, np.ones((3, 3)), iterations=3)
    grad = ndi.gaussian_gradient_magnitude(lum, 1.2)
    mk = np.zeros(lum.shape, np.int32)
    mk[bg], mk[fg] = 1, 2
    k = watershed(grad, mk) == 2
    k = ndi.binary_fill_holes(ndi.binary_closing(k, np.ones((5, 5))))
    k = ndi.median_filter(k, size=SMOOTH)

    n, c = ndi.label(k)
    if c:
        areas = ndi.sum(k, n, range(1, c + 1))
        keep = np.flatnonzero(areas >= areas.max() * KEEP_FRAC) + 1
        k = np.isin(n, keep)
    k = ndi.binary_fill_holes(k)
    return a, k


def to_rgba(a, k):
    al = np.clip((ndi.gaussian_filter(k.astype(np.float32), 0.8) - 0.50) / 0.42, 0, 1)
    return Image.fromarray(
        np.dstack([a.round().astype(np.uint8),
                   (al * 255).round().astype(np.uint8)]), "RGBA")


def anchor(im):
    """(cx, bottom, top, left, right) — cx is the body axis, bottom the ground."""
    A = np.array(im.getchannel("A")) > 16
    ys, xs = np.nonzero(A)
    top, bot = int(ys.min()), int(ys.max())
    h = bot - top
    band = A[int(bot - 0.40 * h):bot + 1, :]
    cx = float(np.nonzero(band)[1].mean())
    return cx, bot, top, int(xs.min()), int(xs.max())


def main():
    # ---- discover -----------------------------------------------------
    acts = []
    for i in range(1, 21):
        p = newest(f"finwy3d-act-{i:02d}")
        if p:
            acts.append((f"act-{i:02d}", p))

    settle_src = None
    for stem in SETTLE_PREF:
        settle_src = newest(stem)
        if settle_src:
            break
    if settle_src is None:
        sys.exit("no settle frame found in incoming/")

    settle_is_last_act = bool(acts) and acts[-1][1] == settle_src
    jobs = list(acts)
    if not settle_is_last_act:
        jobs.append(("settle", settle_src))

    print(f"action frames found: {[k for k, _ in acts] or 'NONE'}")
    print(f"settle frame:        {settle_src.name}"
          f"{'  (== last action frame)' if settle_is_last_act else ''}")
    if not acts:
        print("!! no act-NN frames — index.html keeps the 15-frame deck flipbook")

    # ---- matte --------------------------------------------------------
    cut = []
    for key, path in jobs:
        a, k = matte(path)
        im = to_rgba(a, k)
        cut.append((key, path, im, anchor(im)))
        print(f"  matte {key:8s} {path.name:38s} ink {k.mean()*100:4.1f}%")

    # ---- register on one canvas ---------------------------------------
    L = max(cx - x0 for _, _, _, (cx, b, t, x0, x1) in cut)
    R = max(x1 - cx for _, _, _, (cx, b, t, x0, x1) in cut)
    T = max(b - t for _, _, _, (cx, b, t, x0, x1) in cut)
    W, H = int(round(L + R)) + 2 * PAD, int(round(T)) + 2 * PAD
    AX, AY = int(round(L)) + PAD, H - PAD
    print(f"shared canvas {W}x{H}  anchor ({AX},{AY})  aspect {W/H:.4f}")

    manifest = {"canvas": [W, H], "aspect": round(W / H, 5),
                "widths": WIDTHS, "frames": [], "settle": None,
                "settleIsLastAct": settle_is_last_act}

    total = {w: 0 for w in WIDTHS}
    for key, path, im, (cx, b, t, x0, x1) in cut:
        canvas = Image.new("RGBA", (W, H), (0, 0, 0, 0))
        canvas.paste(im, (int(round(AX - cx)), int(round(AY - b))), im)
        stem = f"finwy3d-hero-{key}"
        rec = {"key": key, "source": path.name, "files": {}}
        for w in WIDTHS:
            h = round(H * w / W)
            r = canvas.resize((w, h), Image.LANCZOS)
            for ext, kw in (("webp", dict(quality=88, method=6)),
                            ("avif", dict(quality=62))):
                f = OUT / f"{stem}-{w}w.{ext}"
                r.save(f, ext.upper(), **kw)
                rec["files"][f"{w}{ext}"] = f"assets/finwy-3d/hero/{f.name}"
            total[w] += (OUT / f"{stem}-{w}w.avif").stat().st_size
            print(f"    {stem}-{w}w  {w}x{h}  "
                  f"webp {(OUT/f'{stem}-{w}w.webp').stat().st_size/1024:5.1f} KB  "
                  f"avif {(OUT/f'{stem}-{w}w.avif').stat().st_size/1024:5.1f} KB")
        rec["px"] = {str(w): [w, round(H * w / W)] for w in WIDTHS}
        if key == "settle":
            manifest["settle"] = rec
        else:
            manifest["frames"].append(rec)
    if settle_is_last_act:
        manifest["settle"] = manifest["frames"][-1]

    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=2) + "\n")
    for w in WIDTHS:
        print(f"AVIF total @{w}w: {total[w]/1024:.1f} KB "
              f"across {len(cut)} frames")
    print(f"manifest -> {OUT/'manifest.json'}")


if __name__ == "__main__":
    main()
