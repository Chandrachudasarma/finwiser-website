#!/usr/bin/env python3
"""Cut the ChatGPT 3D Finwy renders out of their baked background.

The generator ships a fully opaque alpha with a black vignette AND an additive
blue/teal rim glow.  Colour alone cannot separate them — measured, the bloom
just outside the left arm is (36,84,159), *bluer and brighter* than the arm it
surrounds — so the cut is driven by structure instead:

  1. high-pass (lum − gauss25) isolates the character's own shading/speculars;
     the bloom is a smooth radial field and vanishes from it.  Closing the
     high-pass edge map and filling it gives a silhouette that already hugs the
     真 outline everywhere the render has local contrast.
  2. the certain-mint colour mask fills in the flat bright panels the high-pass
     misses (face, note fronts).
  3. a marker watershed on the luminance gradient arbitrates the last few px:
     fg marker = that silhouette eroded past the residual band, bg marker =
     anything outside it.
  4. holes filled, largest component kept, AA ring pulled in ~1px so the light
     fringe does not halo on --navy.
"""
import sys, numpy as np
from PIL import Image
from scipy import ndimage
from skimage.segmentation import watershed

def matte(src, dst, hp_t=10, band=8):
    a = np.array(Image.open(src).convert("RGB")).astype(np.float32)
    G, B = a[..., 1], a[..., 2]
    lum = a.max(-1)

    hp = lum - ndimage.gaussian_filter(lum, 25)
    sil = ndimage.binary_fill_holes(
        ndimage.binary_closing(np.abs(hp) > hp_t, np.ones((15, 15))))

    mint = ndimage.binary_fill_holes(
        ndimage.binary_closing((G > 175) & (B > 150), np.ones((9, 9))))

    rough = ndimage.binary_fill_holes(
        ndimage.binary_closing(sil | mint, np.ones((11, 11))))
    n, c = ndimage.label(rough)
    if c:
        rough = n == int(np.argmax(ndimage.sum(rough, n, range(1, c + 1)))) + 1
    rough = ndimage.binary_fill_holes(rough)

    fg = ndimage.distance_transform_edt(rough) > band
    bg = ~ndimage.binary_dilation(rough, np.ones((3, 3)), iterations=3)
    grad = ndimage.gaussian_gradient_magnitude(lum, 1.2)
    mk = np.zeros(lum.shape, np.int32); mk[bg] = 1; mk[fg] = 2
    k = watershed(grad, mk) == 2
    k = ndimage.binary_fill_holes(ndimage.binary_closing(k, np.ones((5, 5))))
    n, c = ndimage.label(k)
    if c:
        k = n == int(np.argmax(ndimage.sum(k, n, range(1, c + 1)))) + 1
    k = ndimage.binary_fill_holes(k)

    al = np.clip((ndimage.gaussian_filter(k.astype(np.float32), 0.8) - 0.50) / 0.42, 0, 1)
    out = Image.fromarray(np.dstack([a.round().astype(np.uint8),
                                     (al * 255).round().astype(np.uint8)]), "RGBA")
    out = out.crop(out.getchannel("A").getbbox())
    out.save(dst)
    print(f"{src} -> {dst}  {out.size}  ink {k.mean()*100:.1f}%")
    return out

if __name__ == "__main__":
    matte(sys.argv[1], sys.argv[2])
