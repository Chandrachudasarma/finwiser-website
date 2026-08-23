#!/usr/bin/env python3
"""Shared rasteriser: headless Chrome (the only SVG engine on this box).

No cairosvg / rsvg / ImageMagick / potrace here, so every SVG -> PNG in this
folder goes through chrome-headless-shell with a one-element HTML shim.
"""
import subprocess, tempfile, os
from pathlib import Path
from PIL import Image

CHROME = Path.home() / (
    ".cache/puppeteer/chrome-headless-shell/mac_arm-131.0.6778.204/"
    "chrome-headless-shell-mac-arm64/chrome-headless-shell")


def rasterise(svg_path, out_png, width=None, height=None, bg="transparent",
              pad=0, scale=1):
    """Render one SVG at a given CSS width or height. bg='transparent' keeps
    the alpha channel (needed to measure ink extents)."""
    svg_path = Path(svg_path).resolve()
    out_png = Path(out_png).resolve()
    im = None
    with Image.open(svg_path) if False else open(os.devnull) as _:
        pass
    # work out the box from the SVG's own viewBox
    import re
    vb = re.search(r'viewBox="([\d.\s-]+)"', svg_path.read_text(errors="ignore"))
    vw, vh = (float(x) for x in vb.group(1).split()[2:4])
    if width and not height:
        height = width * vh / vw
    elif height and not width:
        width = height * vw / vh
    W, H = round(width) + 2 * pad, round(height) + 2 * pad
    css = f"width:{width:.4f}px;height:{height:.4f}px"
    html = (f'<body style="margin:0;padding:{pad}px;'
            f'background:{"none" if bg=="transparent" else bg}">'
            f'<img src="{svg_path.name}" style="display:block;{css}"></body>')
    tmp = svg_path.parent / f".__shim_{out_png.stem}.html"
    tmp.write_text(html)
    cmd = [str(CHROME), "--headless", "--disable-gpu", "--hide-scrollbars",
           f"--force-device-scale-factor={scale}",
           "--default-background-color=00000000",
           f"--window-size={W},{H}", f"--screenshot={out_png}",
           f"file://{tmp}"]
    subprocess.run(cmd, capture_output=True)
    tmp.unlink(missing_ok=True)
    return Image.open(out_png)
