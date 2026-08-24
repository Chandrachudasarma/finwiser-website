#!/usr/bin/env python3
"""Step 4 — the flat fallback mark, traced from the 3D head's own outline.

Why it exists: the PM's mock proved the embedded render turns to a blob at
30px and below (favicon, 16px bullets). A glossy 3D object cannot survive
16px; a two-colour silhouette of the SAME shape can, and it keeps the mark
recognisably this character rather than the older flat drawing.

No potrace / mkbitmap / ImageMagick on this box, so the trace is done here:
  1. classify every opaque pixel of head-graded.png into navy / mint / teal
     by hue+value (the render is a 3-material object, so this is clean)
  2. Moore-neighbour boundary follow on each mask
  3. Ramer-Douglas-Peucker simplify
  4. emit as polygon paths in a 0 0 100 116 viewBox

The face furniture (stitch row, eyes, smile) is NOT traced. Tracing 3D lit
blobs of it produces lumpy 12-point polygons that alias to mud at 16px. It is
redrawn as primitives - ellipses, a stroked arc, six round-capped dashes -
positioned at the centroids MEASURED off the render, which is both smaller and
sharper. That is the one deliberate departure from a literal trace.
"""
import sys, json
sys.setrecursionlimit(20000)
from pathlib import Path
import numpy as np
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent

NAVY, MINT, TEAL, NAVY_DEEP = "#002d56", "#35d6c6", "#00b6ad", "#001f3d"
WORK = 360                      # trace resolution (px tall)
VB_H = 116.0                    # design space: 100 wide x 116 tall


# ---------------------------------------------------------------- segmentation
def classify(im):
    a = np.array(im).astype(np.float32)
    rgb, al = a[..., :3] / 255.0, a[..., 3]
    mx, mn = rgb.max(-1), rgb.min(-1)
    v = mx
    opaque = al > 140
    navy = opaque & (v < 0.46)
    mint = opaque & (v >= 0.66)
    teal = opaque & ~navy & ~mint
    return opaque, navy, mint, teal


# ---------------------------------------------------------------- contour
def fill_holes(m):
    """flood from the border through the background; anything unreached is a
    hole -> fill it, so we trace one outer ring per region."""
    h, w = m.shape
    bg = ~m
    seen = np.zeros_like(bg)
    from collections import deque
    q = deque()
    for x in range(w):
        for y in (0, h - 1):
            if bg[y, x] and not seen[y, x]:
                seen[y, x] = True; q.append((y, x))
    for y in range(h):
        for x in (0, w - 1):
            if bg[y, x] and not seen[y, x]:
                seen[y, x] = True; q.append((y, x))
    while q:
        y, x = q.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny, nx = y + dy, x + dx
            if 0 <= ny < h and 0 <= nx < w and bg[ny, nx] and not seen[ny, nx]:
                seen[ny, nx] = True; q.append((ny, nx))
    return m | (bg & ~seen)


def smooth(m, passes=3):
    """3x3 majority filter. The render's material edges are soft, so a raw
    threshold gives a contour that wobbles by a pixel or two; RDP then turns
    that wobble into visible notches. Majority-filtering first is cheaper than
    a higher RDP epsilon, which would flatten the real curves."""
    m = m.copy()
    for _ in range(passes):
        p = np.pad(m.astype(np.int8), 1)
        n = sum(p[1 + dy:1 + dy + m.shape[0], 1 + dx:1 + dx + m.shape[1]]
                for dy in (-1, 0, 1) for dx in (-1, 0, 1))
        m = n >= 5
    return m


def largest_blob(m):
    """keep only the biggest 4-connected component"""
    h, w = m.shape
    lab = np.zeros((h, w), np.int32); cur = 0; best = (0, 0)
    from collections import deque
    for sy in range(h):
        for sx in range(w):
            if m[sy, sx] and lab[sy, sx] == 0:
                cur += 1; n = 0; q = deque([(sy, sx)]); lab[sy, sx] = cur
                while q:
                    y, x = q.popleft(); n += 1
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and m[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur; q.append((ny, nx))
                if n > best[1]:
                    best = (cur, n)
    return lab == best[0]


def trace(m):
    """Moore-neighbour boundary follow, clockwise, on the largest blob."""
    ys, xs = np.nonzero(m)
    start = (int(ys.min()), int(xs[ys == ys.min()].min()))
    nb = [(-1, 0), (-1, 1), (0, 1), (1, 1), (1, 0), (1, -1), (0, -1), (-1, -1)]
    h, w = m.shape
    contour = [start]
    cur, bdir = start, 6
    for _ in range(400000):
        found = False
        for i in range(8):
            d = (bdir + i) % 8
            ny, nx = cur[0] + nb[d][0], cur[1] + nb[d][1]
            if 0 <= ny < h and 0 <= nx < w and m[ny, nx]:
                bdir = (d + 5) % 8
                cur = (ny, nx)
                contour.append(cur)
                found = True
                break
        if not found or (len(contour) > 3 and cur == start):
            break
    return [(x, y) for y, x in contour]


def rdp(pts, eps):
    if len(pts) < 3:
        return pts
    p0, p1 = np.array(pts[0]), np.array(pts[-1])
    seg = p1 - p0
    L = np.hypot(*seg)
    P = np.array(pts)
    if L < 1e-9:
        d = np.hypot(*(P - p0).T)
    else:
        d = np.abs(np.cross(seg, P - p0)) / L
    i = int(d.argmax())
    if d[i] > eps:
        return rdp(pts[:i + 1], eps)[:-1] + rdp(pts[i:], eps)
    return [pts[0], pts[-1]]


def to_path(pts, sx, sy, ox, oy, prec=2):
    f = lambda v: ("%." + str(prec) + "f") % v
    d = "M" + " ".join(f"{f((x-ox)*sx)},{f((y-oy)*sy)}" for x, y in pts) + "Z"
    return d.replace("0.00", "0").replace(".00", "")


# ---------------------------------------------------------------- measure face
def face_landmarks(im, navy, mint):
    """eye centroids, smile box, stitch-row y - measured, not eyeballed."""
    a = np.array(im)
    h, w = navy.shape
    # navy features that sit INSIDE the mint panel
    panel = fill_holes(largest_blob(mint))
    inner = navy & panel
    lab = np.zeros((h, w), np.int32); cur = 0; blobs = []
    from collections import deque
    for sy in range(h):
        for sx in range(w):
            if inner[sy, sx] and lab[sy, sx] == 0:
                cur += 1; q = deque([(sy, sx)]); lab[sy, sx] = cur; cells = []
                while q:
                    y, x = q.popleft(); cells.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and inner[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur; q.append((ny, nx))
                if len(cells) > 12:
                    c = np.array(cells)
                    blobs.append(dict(n=len(cells),
                                      cy=float(c[:, 0].mean()), cx=float(c[:, 1].mean()),
                                      y0=int(c[:, 0].min()), y1=int(c[:, 0].max()),
                                      x0=int(c[:, 1].min()), x1=int(c[:, 1].max())))
    blobs.sort(key=lambda b: b["cy"])
    return blobs




# ---------------------------------------------------------------- build
def build():
    from collections import deque
    src = Image.open(HERE / "head-graded.png").convert("RGBA")
    im = src.resize((round(src.width * WORK / src.height), WORK), Image.LANCZOS)
    op, navy, mint, teal = classify(im)
    a = np.array(im).astype(np.float32) / 255.0
    val = a[..., :3].max(-1)

    sil = smooth(fill_holes(largest_blob(op)))
    panel = smooth(fill_holes(largest_blob(mint)))

    # the banknote: the big light region above the panel, centre column
    light = sil & ~panel & (val > 0.50)
    note, wings = None, []
    lab, cur = np.zeros(light.shape, np.int32), 0
    h, w = light.shape
    for sy in range(h):
        for sx in range(w):
            if light[sy, sx] and lab[sy, sx] == 0:
                cur += 1; q = deque([(sy, sx)]); lab[sy, sx] = cur; n = 0
                cells = []
                while q:
                    y, x = q.popleft(); cells.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and light[ny, nx] and lab[ny, nx] == 0:
                            lab[ny, nx] = cur; q.append((ny, nx))
                if len(cells) > 6000:
                    note = lab == cur
                elif len(cells) > 1500:
                    cc = np.array(cells)
                    # only the two TOP flaps count as wings; the same size test
                    # also catches the left rim/leg highlight and the right
                    # foot, which trace to ragged slivers and must be dropped.
                    if cc[:, 0].max() < np.nonzero(panel)[0].min() + 40:
                        wings.append(lab == cur)
    note = smooth(fill_holes(note))
    wings = [smooth(fill_holes(x)) for x in wings]

    # face furniture, measured
    feat = panel & (val < 0.60)
    lab2, cur2, blobs = np.zeros(feat.shape, np.int32), 0, []
    for sy in range(h):
        for sx in range(w):
            if feat[sy, sx] and lab2[sy, sx] == 0:
                cur2 += 1; q = deque([(sy, sx)]); lab2[sy, sx] = cur2; cells = []
                while q:
                    y, x = q.popleft(); cells.append((y, x))
                    for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1),
                                   (1, 1), (1, -1), (-1, 1), (-1, -1)):
                        ny, nx = y + dy, x + dx
                        if 0 <= ny < h and 0 <= nx < w and feat[ny, nx] and lab2[ny, nx] == 0:
                            lab2[ny, nx] = cur2; q.append((ny, nx))
                if len(cells) > 25:
                    c = np.array(cells)
                    blobs.append(dict(n=len(cells), cx=float(c[:, 1].mean()),
                                      cy=float(c[:, 0].mean()),
                                      x0=int(c[:, 1].min()), x1=int(c[:, 1].max()),
                                      y0=int(c[:, 0].min()), y1=int(c[:, 0].max())))
    stitches = sorted([b for b in blobs if b["n"] < 400], key=lambda b: b["cx"])
    eyes = sorted([b for b in blobs if 500 < b["n"] < 1000], key=lambda b: b["cx"])
    smile = max(blobs, key=lambda b: b["n"])

    # design space
    ys, xs = np.nonzero(sil)
    ox, oy = int(xs.min()), int(ys.min())
    s = 100.0 / (int(xs.max()) - ox)
    vh = round((int(ys.max()) - oy) * s, 1)
    P = lambda x, y: (round((x - ox) * s, 1), round((y - oy) * s, 1))

    def path(mask, eps):
        pts = rdp(trace(mask), eps)
        out = []
        for x, y in pts:
            X, Y = P(x, y)
            out.append(f"{X:g},{Y:g}")
        return "M" + "L".join(out) + "Z"

    d_sil = path(sil, 1.2)
    d_panel = path(panel, 1.2)
    d_note = path(note, 1.2)

    # Two-ground rule (assets/finwy/README.md S2): a navy silhouette on a navy
    # section disappears, so the outer contour is stroked in MINT. Same file
    # works on #ffffff and on #002d56 - that is the whole point of the fallback.
    parts = [f'<path fill="{NAVY}" stroke="{MINT}" stroke-width="2.6" '
             f'stroke-linejoin="round" d="{d_sil}"/>']
    for wmask in sorted(wings, key=lambda m: np.nonzero(m)[1].mean()):
        parts.append(f'<path fill="{MINT}" d="{path(wmask, 1.2)}"/>')
    parts.append(f'<path fill="{MINT}" d="{d_note}"/>')

    # Make the note read as a BANKNOTE and not a top hat: the render prints a
    # border and a portrait medallion on it, so both go in. Below ~24px they
    # merge into the mint block, which is the correct failure mode.
    nys, nxs = np.nonzero(note)
    nx0, nx1, ny0, ny1 = nxs.min(), nxs.max(), nys.min(), nys.max()
    iw, ih = (nx1 - nx0), (ny1 - ny0)
    bx0, by0 = P(nx0 + iw * 0.16, ny0 + ih * 0.16)
    bx1, by1 = P(nx1 - iw * 0.16, ny1)
    parts.append(f'<rect x="{bx0:g}" y="{by0:g}" width="{round(bx1-bx0,1):g}" '
                 f'height="{round(by1-by0,1):g}" rx="1.4" fill="none" '
                 f'stroke="{NAVY}" stroke-width="1.8"/>')
    mcx, mcy = P((nx0 + nx1) / 2, ny0 + ih * 0.58)
    parts.append(f'<circle cx="{mcx:g}" cy="{mcy:g}" r="{round(iw*s*0.105,1):g}" fill="{NAVY}"/>')

    parts.append(f'<path fill="{MINT}" d="{d_panel}"/>')

    # stitch row - one round-capped dashed polyline through the measured centres
    if stitches:
        pts = [P(b["cx"], b["cy"]) for b in stitches]
        seg = []
        for b in stitches:
            x0, y0 = P(b["x0"] + 1, b["cy"]); x1, y1 = P(b["x1"] - 1, b["cy"])
            seg.append(f'M{x0:g},{y0:g}L{x1:g},{y1:g}')
        wsl = round((stitches[0]["y1"] - stitches[0]["y0"]) * s * 0.92, 1)
        parts.append(f'<path stroke="{NAVY}" stroke-width="{wsl:g}" '
                     f'stroke-linecap="round" fill="none" d="{"".join(seg)}"/>')
    for b in eyes:
        cx, cy = P(b["cx"], b["cy"])
        rx = round((b["x1"] - b["x0"]) * s / 2, 1)
        ry = round((b["y1"] - b["y0"]) * s / 2, 1)
        parts.append(f'<ellipse fill="{NAVY}" cx="{cx:g}" cy="{cy:g}" rx="{rx:g}" ry="{ry:g}"/>')
    # smile: quadratic through the measured bbox
    sx0, sy0 = P(smile["x0"], smile["y0"] + (smile["y1"] - smile["y0"]) * 0.18)
    sx1, sy1 = P(smile["x1"], smile["y0"] + (smile["y1"] - smile["y0"]) * 0.18)
    qx, qy = P((smile["x0"] + smile["x1"]) / 2, smile["y1"] + (smile["y1"] - smile["y0"]) * 0.55)
    sw = round((smile["y1"] - smile["y0"]) * s * 0.42, 1)
    parts.append(f'<path fill="none" stroke="{NAVY}" stroke-width="{sw:g}" '
                 f'stroke-linecap="round" d="M{sx0:g},{sy0:g}Q{qx:g},{qy:g} {sx1:g},{sy1:g}"/>')

    svg = ('<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Finwy" '
           f'viewBox="0 0 100 {vh:g}" width="100" height="{vh:g}">'
           "<title>Finwy</title>" + "".join(parts) + "</svg>")
    return svg, dict(vh=vh, stitches=len(stitches), eyes=len(eyes),
                     sil_pts=d_sil.count(","), panel_pts=d_panel.count(","),
                     note_pts=d_note.count(","))


if __name__ == "__main__":
    svg, info = build()
    (OUT / "finwy-mark-flat.svg").write_text(svg)
    print("  finwy-mark-flat.svg  %.2f KB  %s" % (len(svg) / 1024, info))
    assert len(svg) <= 5 * 1024, "flat mark over the 5 KB budget"
