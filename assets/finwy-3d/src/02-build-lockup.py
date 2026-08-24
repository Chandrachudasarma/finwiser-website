#!/usr/bin/env python3
"""Step 2 — the wordmark lockup with the 3D head in the W slot.

WHAT WAS MEASURED (headless-Chrome raster of finwiserlogo-optimised.svg at
2400px wide; viewBox 324.51706 x 64.044037, so 7.395577 px per viewBox unit):

  element        x(px)        y(px)      note
  logof     1  -  330      1 - 472      cap top y=1, BASELINE y=472
  logoi1  355  -  466     11 - 472
  logon   511  -  859    120 - 472      x-height top y=120
  MASCOT  861  - 1251      0 - 473      the flat head: full viewBox height
  logoi2 1264  - 1375     11 - 472
  logos  1411  - 1736    110 - 472
  logoe  1758  - 2125    109 - 472
  logor  2147  - 2398    128 - 472

  So the flat mascot is set to CAP HEIGHT with a 1px overshoot top and bottom
  (0..473 against the F's 1..472). That is the alignment to reproduce.
  Its slot clearance is 2px on the left (n ends 859) and 13px on the right.

THE ONE REAL PROBLEM: the 3D character is proportionally WIDER than the flat
one. Alpha bbox 888 x 980 = 0.906 w/h; the flat mascot is 391 x 474 = 0.825.
Scaled to the same cap height the 3D head is 429px wide against the flat's 391
- 38px more than the 404px slot can hold, so at true cap height its wing tips
collide with the ink of the 'n' and the 'i'.

Two ways out, and only one of them is honest:
  (a) shrink the head to fit the slot -> 424px tall, 50px short of cap height,
      and it visibly sinks below the letters. Rejected.
  (b) keep cap height and OPEN THE SLOT by letter-spacing 'iser' to the right.
      A lockup is allowed to space differently from running text; 5.45 units
      (40px at 2400 = 1.7% of the wordmark) is imperceptible as rhythm and
      buys 8px of clearance on each side of the head.
Option (b) is what is built here. Consequence the PM must know: the lockup
aspect goes from 5.067 to 5.152, so a nav rule sized by HEIGHT is unaffected
but one sized by WIDTH needs the new number.
"""
import base64, re
from pathlib import Path
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
ROOT = OUT.parents[1]
WORDMARK = ROOT / "finwiserlogo-optimised.svg"

PX_PER_U = 2400 / 324.51706          # 7.395577
VB_H = 64.044037                     # viewBox height  = 473.6 px
VB_W0 = 324.51706

# --- measured, in px at the 2400 raster -------------------------------------
BASELINE_PX = 472.0
CAP_TOP_PX = 1.0
FLAT_X0, FLAT_X1 = 861.0, 1251.0     # flat mascot slot
N_END_PX, I2_START_PX = 859.0, 1264.0
HEAD_SRC_W, HEAD_SRC_H = 888.0, 980.0
CLEARANCE_PX = 8.0

# --- derived ----------------------------------------------------------------
head_h_px = VB_H * PX_PER_U                      # 473.60 - full cap span
k = head_h_px / HEAD_SRC_H                       # 0.48327
head_w_px = HEAD_SRC_W * k                       # 429.14
head_x0_px = N_END_PX + CLEARANCE_PX             # 867.0
head_x1_px = head_x0_px + head_w_px              # 1296.1
shift_px = (head_x1_px + CLEARANCE_PX) - I2_START_PX
SHIFT_U = round(shift_px / PX_PER_U, 4)
VB_W = round(VB_W0 + SHIFT_U, 5)

HEAD_X = round(head_x0_px / PX_PER_U, 4)
HEAD_W = round(head_w_px / PX_PER_U, 4)

SHIFT_IDS = ["logoi2", "logos", "logoe", "logor"]   # everything after the W
EMBED_W = 600
EMBED_Q = 82


def head_b64(src="head-graded.png"):
    im = Image.open(HERE / src).convert("RGBA")
    im = im.resize((EMBED_W, round(EMBED_W * HEAD_SRC_H / HEAD_SRC_W)), Image.LANCZOS)
    p = HERE / "head-embed.webp"
    im.save(p, "WEBP", quality=EMBED_Q, method=6)
    return base64.b64encode(p.read_bytes()).decode(), p.stat().st_size


def letter_paths(reversed_=False):
    """Pull the seven letter elements out of the Inkscape file, drop the
    per-path style novel (all of it is font metadata that renders nothing) and
    keep only the fill. Returns one flat string of <path>/<g> markup."""
    s = WORDMARK.read_text()
    start = s.index('<g id="layer1"')
    open_end = s.index(">", start) + 1
    # collect direct children
    tok = re.compile(r"<(/?)(\w+)([^>]*?)(/?)>")
    depth, out, chunks = 0, [], {}
    cur_id, cur_start = None, None
    for m in tok.finditer(s, open_end):
        close, name, attrs, selfc = m.groups()
        if depth == 0 and not close:
            cur_id = (re.search(r'id="([^"]+)"', attrs) or [None, "-"])[1]
            cur_start = m.start()
        if not close and not selfc:
            depth += 1
        elif close:
            if depth == 0:
                break
            depth -= 1
            if depth == 0:
                chunks[cur_id] = s[cur_start:m.end()]
                out.append(cur_id)
        elif selfc and depth == 0:
            chunks[cur_id] = s[cur_start:m.end()]
            out.append(cur_id)
    del chunks["logomasscot"]                       # the flat head goes

    def clean(t):
        # style="...fill:#002d56..." -> fill="#002d56"
        def sub(mm):
            st = mm.group(1)
            f = re.search(r"fill:(#[0-9a-fA-F]{6})", st)
            return ' fill="%s"' % (f.group(1) if f else "#002d56")
        t = re.sub(r'\sstyle="([^"]*)"', sub, t)
        t = re.sub(r'\s(?:inkscape|sodipodi):[\w-]+="[^"]*"', "", t)
        t = re.sub(r'\s+', " ", t)
        if reversed_:
            t = re.sub(r'fill="#002[dc]5[6b]"', 'fill="#ffffff"', t, flags=re.I)
            t = re.sub(r'fill="#35d6c6"', 'fill="#35d6c6"', t, flags=re.I)
        return t

    fixed = "".join(clean(chunks[i]) for i in chunks if i not in SHIFT_IDS)
    moved = "".join(clean(chunks[i]) for i in SHIFT_IDS)
    return fixed, moved


TPL = (
    '<svg xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink" '
    'role="img" aria-label="Finwiser" '
    'viewBox="0 0 {vw} {vh}" width="{vw}" height="{vh}">'
    "<title>Finwiser</title>"
    '<g id="wordmark" transform="translate(-44.705066,-20.583063)">'
    "{fixed}"
    '<g id="iser" transform="translate({shift},0)">{moved}</g>'
    "</g>"
    '<image id="finwy-head" x="{hx}" y="0" width="{hw}" height="{vh}" '
    'preserveAspectRatio="xMidYMid meet" '
    'xlink:href="{uri}"/>'
    "</svg>"
)


def build(reversed_=False):
    b64, nbytes = head_b64()
    fixed, moved = letter_paths(reversed_)
    uri = "data:image/webp;base64," + b64
    return TPL.format(vw=VB_W, vh=VB_H, fixed=fixed, moved=moved,
                      shift=SHIFT_U, hx=HEAD_X, hw=HEAD_W, uri=uri), nbytes


if __name__ == "__main__":
    print(f"  px/unit          {PX_PER_U:.5f}")
    print(f"  baseline         y={BASELINE_PX}px   cap top y={CAP_TOP_PX}px  cap height {BASELINE_PX-CAP_TOP_PX}px")
    print(f"  flat mascot      x {FLAT_X0}-{FLAT_X1} ({FLAT_X1-FLAT_X0}px)  y 0-473 (474px)")
    print(f"  3D head scale k  {k:.5f}  -> {head_w_px:.1f} x {head_h_px:.1f} px")
    print(f"  3D head slot     x {head_x0_px:.1f}-{head_x1_px:.1f}  clearance {CLEARANCE_PX}px each side")
    print(f"  'iser' shift     {shift_px:.1f}px = {SHIFT_U}u")
    print(f"  viewBox          0 0 {VB_W} {VB_H}   aspect {VB_W/VB_H:.3f} (was {VB_W0/VB_H:.3f})")
    for rev, name in ((False, "finwiser-logo-3d.svg"), (True, "finwiser-logo-3d-reversed.svg")):
        svg, nb = build(rev)
        assert "{" not in svg.split("base64,")[0], "unresolved placeholder"
        (OUT / name).write_text(svg)
        assert len(svg) <= 60 * 1024, f"{name} over the 60 KB budget"
        print(f"  {name:<32} {len(svg)/1024:6.1f} KB  (webp {nb/1024:.1f} KB)")
