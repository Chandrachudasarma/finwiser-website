#!/usr/bin/env python3
"""Step 6 — og-image-3d.png, 1200x630, <= 120 KB.

Same layout as the shipping og-image.png, measured off it:
  white tile + wordmark  x60 y32, 64px tall   -> replaced by the REVERSED 3D
                                                 lockup at 52px; the tile only
                                                 existed because no reversed
                                                 logo did (audit F-02)
  mint rule              x60 y226, 96 x 6
  headline               x60, line tops y272 / y361, white, ~88px Inter 800
  footer line            x60 y569, mint bullet + white 21px
  finwiser.org           right, mint
  mascot                 x846-1138, y159-520   -> the 3D head, same box

Inter is not installed on this box, so the latin variable subset is fetched
once into src/inter-latin-var.woff2 and inlined as a data URI - the render must
not depend on the network at build time twice.
"""
import base64, json, subprocess, sys, urllib.request
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from render import CHROME
from PIL import Image

HERE = Path(__file__).resolve().parent
OUT = HERE.parent
FONT = HERE / "inter-latin-var.woff2"
GF = ("https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800"
      "&display=swap")
UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36")

HEADLINE_1 = "Three minutes."
HEADLINE_2 = "Your full picture."
FOOTER = "SEBI Registered Investment Adviser · INA000021331"


def ensure_font():
    if FONT.exists():
        return
    import re
    req = urllib.request.Request(GF, headers={"User-Agent": UA})
    css = urllib.request.urlopen(req, timeout=20).read().decode()
    blocks = re.findall(r"/\*\s*latin\s*\*/\s*@font-face\s*\{(.*?)\}", css, re.S)
    url = re.search(r"url\((https[^)]+)\)", blocks[-1]).group(1)
    FONT.write_bytes(urllib.request.urlopen(url, timeout=30).read())


def html():
    font = base64.b64encode(FONT.read_bytes()).decode()
    head = base64.b64encode((HERE / "head-embed.webp").read_bytes()).decode()
    logo = base64.b64encode(
        (OUT / "finwiser-logo-3d-reversed.svg").read_bytes()).decode()
    return f"""<style>
@font-face{{font-family:Inter;font-weight:100 900;font-display:block;
 src:url(data:font/woff2;base64,{font}) format('woff2')}}
*{{margin:0;padding:0;box-sizing:border-box}}
html,body{{width:1200px;height:630px;overflow:hidden}}
body{{position:relative;font-family:Inter,system-ui,sans-serif;
 background:#001f3d;
 background-image:radial-gradient(120% 100% at 100% 46%,
   #0b4d74 0%, #063f66 26%, #002b53 58%, #001f3d 100%)}}
#logo{{position:absolute;left:60px;top:32px;height:52px}}
#rule{{position:absolute;left:60px;top:226px;width:96px;height:6px;
 background:#35d6c6;border-radius:3px}}
h1{{position:absolute;left:60px;top:243px;color:#fff;font-weight:800;
 font-size:88px;line-height:89px;letter-spacing:-.035em}}
#foot{{position:absolute;left:60px;top:566px;display:flex;align-items:center;
 gap:14px;color:#e8eef5;font-size:21px;font-weight:600;letter-spacing:-.005em}}
#dot{{width:9px;height:9px;border-radius:50%;background:#35d6c6}}
#url{{position:absolute;right:60px;top:564px;color:#35d6c6;font-size:26px;
 font-weight:700;letter-spacing:-.01em}}
#head{{position:absolute;left:846px;top:150px;width:292px}}
</style>
<img id="logo" src="data:image/svg+xml;base64,{logo}">
<div id="rule"></div>
<h1>{HEADLINE_1}<br>{HEADLINE_2}</h1>
<img id="head" src="data:image/webp;base64,{head}">
<div id="foot"><span id="dot"></span>{FOOTER}</div>
<div id="url">finwiser.org</div>
"""


if __name__ == "__main__":
    ensure_font()
    shim = HERE / ".og.html"
    shim.write_text(html())
    raw = HERE / ".og-raw.png"
    subprocess.run([str(CHROME), "--headless", "--disable-gpu",
                    "--hide-scrollbars", "--force-device-scale-factor=2",
                    "--window-size=1200,630", f"--screenshot={raw}",
                    f"file://{shim}"], capture_output=True)
    im = Image.open(raw).convert("RGB").resize((1200, 630), Image.LANCZOS)
    p = OUT / "og-image-3d.png"
    # FASTOCTREE lands at ~47 KB against MEDIANCUT's ~118 KB for a visually
    # identical card (compared at 2x on the head and on the gradient), so it
    # is the default and MEDIANCUT is only the fallback.
    best = None
    for colours, meth, label in ((256, Image.FASTOCTREE, "octree-256"),
                                 (220, Image.MEDIANCUT, "mediancut-220"),
                                 (160, Image.MEDIANCUT, "mediancut-160")):
        im.quantize(colors=colours, method=meth).save(p, optimize=True)
        n = p.stat().st_size
        if n <= 120 * 1024:
            best = (label, n)
            break
    im.save(OUT / "og-image-3d.webp", "WEBP", quality=88, method=6)
    shim.unlink(missing_ok=True); raw.unlink(missing_ok=True)
    print(f"  og-image-3d.png   1200x630  {best[1]/1024:.1f} KB  ({best[0]} palette)")
    print(f"  og-image-3d.webp  1200x630  {(OUT/'og-image-3d.webp').stat().st_size/1024:.1f} KB")
    print(f"  budget 120 KB     {'OK' if best[1] <= 120*1024 else 'OVER'}")
