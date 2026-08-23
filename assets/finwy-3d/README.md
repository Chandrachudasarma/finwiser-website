# Finwy 3D — brand assets

**Founder decision, 2026-08-23: Finwy is the 3D-rendered character, and the 3D head
goes into the wordmark's `W` slot.** The flat 2D vector redraw in
`finwiser-website/assets/finwy/` was rejected as art. It is kept as the *spec* —
its construction rules, palette rules and asset list still govern this folder — and
its `README.md §2–3` is the reference for anything not settled here.

Everything in this folder is generated from **one** source image:
`fw-deck-2026/slides/finwy-3d.png` (1024 × 1536 RGBA). There is no `.blend`,
`.glb` or `.fbx` anywhere in the repo — verified. The route to more assets is
either `PROMPTS-CHATGPT.md` (cheap, today) or `BRIEF-3D-ARTIST.md` (proper, later).

> ⚠️ This folder deliberately contradicts audit finding **F-04** ("kill the 3D").
> F-04 was written against *four incompatible mascots*; the founder's answer is to
> make the 3D one the only one. The audit's real requirement — one character
> everywhere — is still binding, and is the first acceptance criterion in both briefs.

---

## 1 · What shipped

| File | What it is | Size |
|---|---|---|
| `finwiser-logo-3d.svg` | Primary lockup. Wordmark as vector paths, 3D head as an embedded base64 WebP in the W slot. Navy letters, for light grounds. | 52.3 KB |
| `finwiser-logo-3d-reversed.svg` | Same, white letters, for `--navy` / `--navy-deep` grounds. | 52.3 KB |
| `finwy-mark-flat.svg` | Flat two-colour fallback mark, traced from the 3D head's own alpha. For 16–48 px, where the render is mud. | 2.4 KB |
| `og-image-3d.png` / `.webp` | Share card, 1200 × 630. | 47.0 / 36.7 KB |
| `favicon/` | Favicon + app-icon set (see §4). | — |
| `raster/` | PNG + WebP of both lockups at nav sizes and a 1600 px master; hero-size renders of the head. | — |
| `src/` | The build. Seven numbered scripts + two look-at-it sheet generators. | — |
| `incoming/` | Drop folder for new ChatGPT generations. See `PROMPTS-CHATGPT.md`. **Three test generations are already in there** (`wave-v01/v02`, `jars-v01`) — they prove the route works, and all three need post-processing: a teal glow + black vignette is baked into the alpha, the waving hand has fingers instead of a mitten, and the jars scene has gold coins and a blue jar. | — |
| `BRIEF-3D-ARTIST.md` | Commission brief for one real 3D model (the fallback route). | — |
| `PROMPTS-CHATGPT.md` | Prompt pack the founder runs himself (the cheap route). | — |

Nothing here overwrites an existing file. The root `favicon.*`, `og-image.png`,
`finwiserlogo*.svg`, `index.html` and `brand.css` are untouched — the PM swaps
them in after the founder signs off.

---

## 2 · The alignment numbers

Measured off a headless-Chrome raster of `finwiserlogo-optimised.svg` at
2400 px wide (viewBox `324.51706 × 64.044037`, so **7.395577 px per viewBox unit**):

| Element | x (px) | y (px) |
|---|---|---|
| `logof` | 1 – 330 | 1 – 472 → **cap top y = 1, baseline y = 472** |
| `logoi1` | 355 – 466 | 11 – 472 |
| `logon` | 511 – 859 | 120 – 472 |
| **flat mascot** | **861 – 1251** (390 wide) | **0 – 473** |
| `logoi2` | 1264 – 1375 | 11 – 472 |
| `logos` | 1411 – 1736 | 110 – 472 |
| `logoe` | 1758 – 2125 | 109 – 472 |
| `logor` | 2147 – 2398 | 128 – 472 |

So the flat mascot is set to **cap height with a 1 px overshoot top and bottom**.
The 3D head reproduces that exactly: measured back off the built lockup, the head's
ink runs `y 1 – 464` against the letters' `y 1 – 464` at that raster size — **cap top
and baseline both match to the pixel**.

### The one compromise you need to know about

The 3D character is proportionally **wider** than the flat one:

* 3D alpha bbox `888 × 980` → 0.906 w/h
* flat mascot `390 × 474` → 0.825 w/h

At true cap height the 3D head is **429 px wide** where the flat is 390, and the
gap between `logon` and `logoi2` is only **404 px**. Its wing tips would collide with
the ink of the `n` and the `i`.

Two ways out; one of them is honest:

* **(a) shrink to fit** → 424 px tall, 50 px short of cap height. The head visibly
  sinks below the letters. **Rejected.**
* **(b) keep cap height, open the slot** → letter-space `iser` right by
  **5.4329 viewBox units (40.2 px at 2400 = 1.7 % of the wordmark)**, which buys
  **8 px of clearance on each side** of the head — the flat mascot had 2 px left and
  13 px right, so this is if anything tidier. **This is what shipped.**

**Consequence for the PM:** the lockup's aspect goes from **5.067 → 5.152**
(viewBox `0 0 329.94996 64.044037`). A nav rule that sizes by *height* is unaffected.
A rule that sizes by *width* needs the new number.

### The head's own shadow

There is none. Alpha scan of the source: nothing at all below y = 1230, and the tight
alpha bbox is `x 69–956, y 251–1230`. The dark pooling at the bottom of the shell is
the character's own form shading, inside the silhouette. Nothing needed masking.

The semi-transparent edge pixels average RGB `(181, 213, 222)` — a **light** fringe,
not a black premultiply fringe, so there is no dark halo on white. A 1.06 alpha gamma
in `01-extract-head.py` pulls the outermost ring in slightly so it does not read as a
halo on navy either. Verified by eye at 2× on `logo3d-lockup-navy.png`.

---

## 3 · Colour: the render is off-palette, and it was graded

Measured cluster means in the source render vs the brand tokens:

| | render | token | delta |
|---|---|---|---|
| navy | `#123a72` | `--navy #002d56` | ~10° too indigo, under-dark |
| mint | `#6de4dd` | `--mint #35d6c6` | hue right, ~25 % under-saturated |

`src/01-extract-head.py` applies a **hue-dependent** rotation (−10° at the navy hue,
−1° at the mint hue — a single global rotation fixed one and turned the other
emerald), +45→+19 % chroma across the same ramp, and a mild value gamma. Result:
navy `#053f67`, mint `#3cded0`. Both files are kept:

* `src/head-raw.png` — as rendered
* `src/head-graded.png` — **what ships**

If the founder prefers the original render's colour, change `head_b64()` in
`02-build-lockup.py` to `head_b64("head-raw.png")` and re-run steps 2–7.

---

## 4 · Favicons — split by size, on purpose

| File | Artwork | Why |
|---|---|---|
| `favicon/favicon.svg` | flat mark, square viewBox | scales, stays 2.4 KB |
| `favicon/favicon-16.png` `-32` `-48` | flat mark | the render is mud below ~48 px; this is the whole reason the flat mark exists |
| `favicon/apple-touch-icon-180.png` | **3D head** on a navy rounded tile | at 180 px the render is the point; the tile stops a transparent silhouette vanishing on a dark home screen |
| `favicon/icon-192.png` `icon-512.png` | 3D head on a navy rounded tile | PWA manifest |
| `favicon/icon-512-maskable.png` | 3D head, full-bleed navy, 22 % safe zone | Android maskable |

The 16/32/48 PNGs are rendered at 8× and LANCZOS-downsampled, not rasterised
directly at 16 px — Chrome's direct 16 px raster drops the stitch row entirely, and
the downsample keeps it as a grey suggestion, which is what still makes it read as a
face.

---

## 5 · Hero sizes — the resolution ceiling

The render's **opaque** pixels are `888 × 980`. The file is 1024 × 1536; the rest is
transparent padding, so quoting "1024 / 2 = 512 CSS px" overstates it.

| Hero slot | device px | headroom |
|---|---|---|
| 204 CSS @2× | 408 × 450 | downscale 2.18× |
| 204 CSS @3× | 612 × 675 | downscale 1.45× |
| 260 CSS @2× | 520 × 574 | downscale 1.71× |
| 260 CSS @3× | 780 × 861 | downscale 1.14× |

**Nothing in the hero is an upscale.** The honest ceilings:

* **2×-sharp up to 444 CSS px wide (490 CSS px tall)**
* **3×-sharp up to 296 CSS px wide (326 CSS px tall)**

Proof sheet: `screenshots/tier2/logo3d-hero-sizes.png`.
Rasters: `raster/finwy-3d-hero-{408,520,612,780}w.{png,webp}`.

---

## 6 · Rebuild

```
cd assets/finwy-3d/src
python3 01-extract-head.py     # crop + grade the head from the deck render
python3 02-build-lockup.py     # both lockup SVGs (asserts <= 60 KB)
python3 03-rasters.py          # nav-size + 1600px rasters, PNG and WebP
python3 04-flat-mark.py        # trace the flat fallback (asserts <= 5 KB)
python3 05-favicons.py         # favicon/ set
python3 06-og-card.py          # og-image-3d.png (asserts <= 120 KB)
python3 07-hero-check.py       # hero rasters + the sharpness proof sheet

python3 sheet_lockup.py        # look-at-it sheets -> screenshots/tier2/
python3 sheet_flatmark.py
```

Requires only Python + Pillow + numpy. There is no cairosvg, rsvg, ImageMagick,
Inkscape or potrace on this machine — every SVG → PNG goes through
`chrome-headless-shell` via `src/render.py`, and the flat mark's trace
(Moore-neighbour boundary follow + Ramer-Douglas-Peucker) is implemented in
`04-flat-mark.py` because potrace is not installed.

`06-og-card.py` fetches the Inter latin variable subset once into
`src/inter-latin-var.woff2` and inlines it; after that it is offline.

---

## 7 · Look-at-it sheets

All under `website-audit-2026-08-23/screenshots/tier2/`:

| Sheet | Shows |
|---|---|
| `logo3d-lockup-white.png` | lockup at 1600 / 240 / 120 px wide on white + 2× junction zoom |
| `logo3d-lockup-navy.png` | reversed lockup, same, on `--navy` |
| `logo3d-nav-sizes.png` | 64 / 56 / 40 CSS px tall on both grounds, with 3× zoom — the real nav slots |
| `logo3d-flatmark-sizes.png` | flat mark at 128 / 64 / 32 / 16 px, actual + 4× zoom, both grounds |
| `logo3d-hero-sizes.png` | hero renders at 408 / 612 / 520 / 780 device px + 1:1 detail |

---

## 8 · Known weaknesses

1. **16 px is the floor and it is a hard floor.** At 16 px the flat mark reads as a
   mint W-shield with a suggestion of eyes; the stitch row and the banknote detail are
   gone. That is the correct failure mode, but it is a floor, not a comfortable size.
2. **On `--navy` the 3D head's navy shell merges with the ground below ~48 CSS px.**
   At 64 and 56 px it holds (the mint rim and the lit edges carry it). At 40 px the
   legs dissolve and you see a mint blob. The flat mark carries a mint outer contour
   for exactly this reason — the 3D head cannot, because the contour would be a
   composite hack on a raster. **Rule: 3D head at ≥ 48 CSS px, flat mark below.**
3. **The colour grade is a global transform, not a re-render.** It lands the mint on
   the token and the navy close; a true `--navy #002d56` shell needs the model.
4. **The lockup is 52 KB of embedded WebP.** Under the 60 KB budget, but it is one
   raster in a vector file — it will not print at billboard scale and it cannot be
   recoloured. `raster/*-1600w.*` exists for anything that needs a plain image.
5. **The wordmark keeps the brand's existing mint bar inside the `e`.** It is in
   `finwiserlogo-optimised.svg` and in the official `finwiserlogo-reversed.svg`, so it
   is reproduced rather than silently fixed. On navy it reads slightly like a defect.
   Worth a separate decision.
6. **The `iser` shift changes the lockup's aspect ratio** (§2). Any CSS that sizes the
   logo by width needs updating.

---


---

## 9 · Wave 3 — the action storyboard, the flat lockup, the expressions

Added 2026-08-23 by the homepage engineer. Four new build steps; nothing above
changed except where noted.

### 9.1 · What shipped

| File / folder | What it is |
|---|---|
| `hero/finwy3d-hero-act-NN-{408,520,612,780}w.{webp,avif}` | The founder's eight-keyframe wake-up, matted, **registered on one shared canvas** and encoded at four tiers. |
| `hero/finwy3d-hero-settle-*` | Only written when the settle pose is NOT the last action frame. With act-08 present the settle IS act-08 and no separate file exists. |
| `hero/manifest.json` | The frame list, the canvas, the tiers. `13-hero-markup.py` reads only this. |
| `finwiser-logo-flat.svg` / `-reversed.svg` | The lockup with the **flat mark** in the W slot instead of the 3D head. Identical viewBox and aspect (5.152), so it is a drop-in swap. 5.2 KB each against the 3D lockup's 52 KB. |
| `finwy3d-face-{happy,thinking,worried}-{96,192,288}w.{webp,avif}` | Expression heads for the three copy placements. |
| `finwy3d-jars-{260,520,780}w.*` | **Re-pointed** from `jars-v01` to `jars-simple-v02`. Same filenames, so no markup changed — but the aspect moved 1144x985 → 1040x972 and the two `<img width/height>` pairs in index.html were updated with it. |
| `finwy3d-jars-detailed-{520,780}w.*` | `jars-detailed-v01`, staged and **referenced nowhere**: every jar slot on the page is 260 CSS px or smaller (seen-scene 260/130/96, step-02 lane 124/64) and the simple composition is the one that reads at that size. The first slot that is genuinely ≥ 288 CSS px should switch to these. |

### 9.2 · The registration problem, and why the canvas number matters

Each ChatGPT generation frames the character differently. Measured on the raw
1024x1536 canvases, the silhouette bottoms of act-01/02/03 land at
**y = 1211 / 1266 / 1292** — played as-is the character sinks ~80 px between
keyframes and the sequence reads as four different renders cross-fading, not
as one character moving.

`10-hero-action.py` re-anchors every frame on **(horizontal centroid of the
bottom 40% of the silhouette, bottom of the silhouette)** — the body axis and
the ground line — onto one shared canvas sized to the union of all of them.
Scale is deliberately *not* normalised: the silhouette heights differ because
the poses differ (sitting is shorter than arms-up), and the onion-skin proves
the torsos land on each other.

**Current canvas: 1242 x 1185** (aspect 1.0481). It is in index.html twice —
`--hero-aspect` on `.hero__mascot` and the `width`/`height` on every hero
`<img>` — and `13-hero-markup.py` rewrites both. **A new keyframe that reaches
further than the present union bbox changes this number**, which is exactly
why the markup is generated and not hand-written.

### 9.3 · The matte

Reuses `08-cut-incoming.py`'s structure-driven cut, plus two things it lacked:

* a **median filter** (window 15) on the binary mask — the watershed leaves a
  ragged bite along the silhouette where the mint wings meet the additive teal
  bloom, and the two are not separable by colour (measured: dropped pixels
  average RGB `(50,117,141)`, kept pixels `(35,119,157)`);
* **multi-component retention** (≥ 0.3% of the largest) so act-03's gold
  sparkles and the gold motion arcs survive "largest component only".

**Known limitation.** The motion cues the founder asked for are *translucent*
swooshes. A binary matte cannot represent them, so they ship as solid-ish
shapes with a smoothed edge rather than as soft trails. At 204–360 CSS px this
reads as intended; at 2x zoom it does not. The fix is a soft luminance key for
the sub-body regions, not a threshold tweak — a job for whoever revisits the
art.

### 9.4 · Nav sizing — the number that settles the ≥ 48 px rule

`12-flat-lockup.py` rasterises both lockups at every candidate nav height and
measures the head's ink. The result is blunt:

| nav logo height | lockup width | head height | verdict |
|---|---|---|---|
| 30 px | 154.6 px | **30.0 px** | flat mark |
| 38 px | 195.8 px | **38.0 px** | flat mark |
| 44 px | 226.7 px | **44.0 px** | flat mark |
| 48 px | 247.3 px | **48.0 px** | 3D head clears its floor |
| 56 px | 288.5 px | **55.8 px** | 3D head |

**The head's ink is 1:1 with the lockup's height.** §8's "3D head at ≥ 48 CSS
px" therefore means "lockup at ≥ 48 CSS px", i.e. **≥ 247 px wide** — 63% of a
390 px phone, over the 40% cap. So the phone nav cannot carry the 3D head at
all, and ships `finwiser-logo-flat.svg`; ≥ 1024 px ships the 3D lockup at 48 px
in a 64 px bar. Proof sheet: `screenshots/tier2/home3-nav-logo-variants.png`.

### 9.5 · Rebuild

```
cd assets/finwy-3d
python3 src/10-hero-action.py    # matte + register + encode + manifest.json
python3 src/13-hero-markup.py    # rewrite index.html from the manifest
python3 src/11-faces-jars.py     # expression heads + both jar scenes
python3 src/12-flat-lockup.py    # flat-mark lockups + the nav measurement sheet
```

Steps 10 and 13 are the pair to re-run whenever a new `finwy3d-act-NN-vNN.png`
lands. They are idempotent, they always take the **highest `vNN`** per frame,
and 13 refuses to run if the `HERO-FRAMES:BEGIN/END` markers are missing rather
than guessing where the block goes.

---

*Built 2026-08-23. §9 added the same day, Wave 3.*
