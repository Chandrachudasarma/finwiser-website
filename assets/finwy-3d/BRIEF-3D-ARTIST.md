# Brief — build the Finwy 3D model

**One model. One material. One light rig. Every asset rendered from it.**

Finwiser is a SEBI-registered investment adviser. Finwy is its mascot, and the
founder's decision on 2026-08-23 is that **the 3D character is the character** — it
now sits inside the wordmark's `W`, so it is not decoration, it is the logo.

There is **one** render of him in existence:
`fw-deck-2026/slides/finwy-3d.png` (1024 × 1536 RGBA). No `.blend`, `.glb` or
`.fbx` exists anywhere. **That render is the brief.** Your job is to rebuild it as a
real model and then produce the asset list in §6 from it.

The flat 2D vector version at `finwiser-website/assets/finwy/finwy-model-sheet.svg`
and its `README.md` are the **construction spec** — proportions, palette and the
character's rules. Read `README.md §2` (palette + the two-ground rule) and `§3`
(construction + material rules) before you start. Where that document and this one
disagree on *medium*, this one wins; where they disagree on *proportion, colour or
what Finwy is*, that one wins.

> **The cheaper route exists and may be taken instead.** The original render was made
> by giving the flat 2D logo to ChatGPT's image generator. A consistent set can be
> regenerated the same way, using the render as a reference image — see
> `PROMPTS-CHATGPT.md` and §8 below. That route is minutes and free; this brief is
> the route that gives a reusable, re-poseable, re-lightable asset. Read §8 before
> quoting.

---

## 1 · What Finwy is

An **open wallet standing on two legs**, in a **W** silhouette — the same W as the
one in the "Finwiser" wordmark, which is why the head can sit inside it.

| Part | Description |
|---|---|
| **shell** | the W body, **matte navy**, satin not glossy, softly bevelled edges |
| **front panel** | a wide **mint** shield across the front of the shell, coming to a point at the bottom centre; carries the entire face |
| **rim** | a **mint** lining folded over the wallet's top edge, deepest at the corners, tapering toward the centre |
| **flaps** | two navy-backed, mint-lined corner flaps standing up at the left and right of the opening |
| **pocket** | the wallet interior behind the panel, in **deep navy** |
| **notes** | a small fan of **Indian ₹ banknotes** in mint and teal riding in the pocket and rising above the rim |
| **legs / feet** | two legs from the W's lower points, **mint** cuffs and feet |
| **arms** | **absent in the reference render.** They must be added — see §3 |

### The face — this is the identity, get it exact

On the mint panel, in navy, and nothing else:

* a curving row of **six short dashed stitches** across the top, like a brow
* two **plain round navy eyes** — flat discs, **no pupils, no specular highlight, no
  eyelashes**
* one **simple curved smile**, a rounded navy stroke

No nose. No cheeks. No eyebrows beyond the stitch row. No tongue in the default
state. No crown, ever.

---

## 2 · Turnaround expected

Build and deliver a real turnaround, and render a contact sheet of it:

| View | Purpose |
|---|---|
| **front** | the canonical view; the logo head and most assets use it |
| **three-quarter left** and **three-quarter right** | personas, scenes |
| **side** | fixes the wallet's depth — the reference render gives you almost no depth information, so this is the view where you are *designing*, not copying. Keep it shallow: Finwy is a wallet, not a bucket |
| **back** | the navy shell closing behind the pocket |
| **top-down of the opening** | fixes the rim, the flaps and how the note fan sits |

Plus a **construction / proportion sheet**: body height H, body width, rim depth,
leg dip, note height above the rim, eye diameter and eye line, stitch count and
stitch arc, arm length and reach, mitten size. Express every measure as a fraction
of H so the character can be reproduced at any scale. Cross-check against
`assets/finwy/README.md §3`, which already states these for the flat version.

---

## 3 · Arms and hands — the part you are inventing

The reference render has **no arms**. Add them, and take the pose language from the
painterly flipbook frame `fw-deck-2026/slides/frame-5.png` — the reach, the shoulder
height and the wave angle in that drawing are right — but render them in **this
model's material**, not that drawing's.

* arms are **rounded navy tubes** with a soft bevel, springing from just below the
  rim at the shoulder line
* a **mint cuff band** at the wrist
* hands are **MITTENS**: one rounded paddle, one thumb lobe. **Never fingers.**
  Not four, not five. This is the single most repeated failure in every previous
  attempt at this character — a five-finger hand is what disqualified the retired
  `frame-15.png`, and every AI generation so far has produced fingers.
* the mitten is always derived from the arm's end point and angle, so it never
  detaches or floats
* arms must be **rig-able and removable** — the logo head and the expression heads
  have no arms at all

---

## 4 · Money — always ₹, never $

Money in a Finwiser illustration is an **Indian rupee banknote**. Mint face, teal
edge, a large **₹** and a round portrait medallion printed on the front note.

* **never** a green US dollar bill
* **never** a `$`
* **never** a gold coin
* the `₹` is the **only** glyph allowed anywhere in any asset, and only on a banknote

The retired asset set shipped US dollar bills in `finwy-allocating.png`. Do not
repeat it.

---

## 5 · Material and lighting — read off the reference render

This is a description of what is actually in `finwy-3d.png`, not a wish list:

**Materials**

* **navy shell** — matte, a soft satin sheen with a broad diffuse falloff, no sharp
  specular hit, no clearcoat. Reads as soft moulded plastic.
* **mint front panel and rim** — the same base material but a step glossier: there is
  a soft, wide specular roll along the top of the rim and down the panel's left
  shoulder, never a hard hotspot.
* **note stack** — flat matte mint face, slightly darker teal on the cut edges, with
  a visible thin gap between each note in the fan.
* **face elements** — the eyes, smile and stitches are **recessed grooves** in the
  panel, not decals. They catch a thin lighter edge on their upper lip and hold a
  soft shadow in the base. That recession is a large part of why the character reads
  as a physical object; keep it.
* every edge on the model is **rounded** with a small, consistent bevel. There is not
  one hard corner in the render.

**Lighting**

* one **soft key from the upper left**, large source, soft terminator
* a weaker fill from the lower right, enough to keep the shell's right side from
  going black
* a subtle broad top light that catches the rim
* **no ground shadow of any kind** — the alpha of the reference render carries nothing
  below the feet, which is exactly right and must stay that way
* no HDRI reflections, no environment colour, no bloom, no vignette, no glow

**Measured colour — and a correction you must apply.** The reference render is
**off-palette**: its navy cluster means `#123a72` against the brand `--navy #002d56`
(about 10° too indigo), and its mint means `#6de4dd` against `--mint #35d6c6`
(hue correct, ~25 % under-saturated). Build the model to the **brand hexes**, not to
the render's samples. The six permitted values are the whole palette:

| Hex | Token | Used for |
|---|---|---|
| `#002D56` | `--navy` | shell · eyes · smile · stitches · arms |
| `#001F3D` | `--navy-deep` | pocket interior · recessed planes |
| `#35D6C6` | `--mint` | front panel · rim · cuffs · feet · note face |
| `#00B6AD` | `--teal` | note edges · secondary planes |
| `#F5C26B` | `--gold` | one accent only, where a third colour is genuinely needed |
| `#FFFFFF` | `--white` | nothing on Finwy himself |

---

## 6 · Asset list

Every item: **PNG or WebP with 8-bit alpha, at 1× / 2× / 3× of the stated CSS size.**
Slot sizes are the real display sizes on finwiser.org and in the deck.

| # | Asset | Slot | CSS size (deliver 1× / 2× / 3×) | Notes |
|---|---|---|---|---|
| 1–12 | **Wake-up poses, 12 frames** | homepage hero flipbook | 204 and 260 CSS px wide | forward-only: asleep → stir → eyes open → stretch → stand → wave. **Identical camera, distance, eye level and ground line in all twelve** — the flipbook jumps otherwise |
| 13 | **Wave pose** | hero hold, "same surplus" block, final CTA | 204 and 260 CSS px wide | the confident hero pose; frame 12 of the flipbook is this |
| 14 | **₹-jars scene, simple** | flow section | **96** and 192 CSS px wide | must read at **96 px** — big shapes, minimum detail. Three jars: mint / teal / gold |
| 15 | **₹-jars scene, detailed** | flow section, deck | **288** and **780** CSS px wide | notes in flight, notes in the jars. Same three jars. **No coins.** Nothing printed on the jars |
| 16 | **goal — emergency** | goals section, deck | 24 / 48 / 100 / 300 px, square | shield + pulse line. Object only, no Finwy |
| 17 | **goal — retirement** | same | same | sun over a horizon |
| 18 | **goal — education** | same | same | mortarboard + tassel |
| 19 | **goal — vehicle** | same | same | small hatchback, three-quarter front |
| 20 | **persona — young earner** | deck, personas section | 220 / 440 / 660 px | Finwy + open laptop, **blank screen** |
| 21 | **persona — working parent** | same | same | Finwy + school bag |
| 22 | **persona — retiring parent** | same | same | Finwy + deck chair |
| 23 | **logo head — lit for white** | the `W` in the wordmark, on light grounds | head rendered at **≥ 900 px wide** | front view, **no arms, no legs below the W**, exactly the reference render's camera |
| 24 | **logo head — lit for navy** | the `W`, on `--navy` grounds | same | identical camera and pose; a brighter mint rim light so the silhouette separates from `#002d56` |
| 25–32 | **expression heads, 8** | product, deck, docs | 120 / 240 / 360 px | neutral · happy · thinking · worried · celebrating · sleeping · winking · waving. Front view, no arms, **identical camera in all eight** |

**Plus the model source: `.blend` (preferred) or `.glb`,** with the rig, the material
set and the light rig intact and named. This is the actual deliverable — the renders
are outputs of it, and without it the next asset costs a full commission again.

### Sizing note that matters

Deliver item 23/24 at **≥ 900 px wide**. The current render's opaque area is
888 × 980 px, which is *just* enough: it is 2×-sharp only up to 444 CSS px wide and
3×-sharp only up to 296 CSS px wide. Anything larger than that on the page today is
extrapolation. Items 1–13 need the same headroom — the hero's largest real demand is
260 CSS px @3× = **780 device px wide**.

---

## 7 · Acceptance criteria

An asset is accepted only if **all** of these hold:

1. **Same character in every asset.** Same proportions, same face construction, same
   materials, same six stitches, same plain navy disc eyes. Put any two assets side by
   side at the same height: they must be obviously the same object.
2. **No baked text.** No letters, numbers, words, logos or watermarks anywhere in any
   artwork. The `₹` on a banknote is the only exception. Labels live in HTML next to
   the asset.
3. **No baked ground shadow**, no floor, no platform, no reflection, no glow, no
   vignette. The alpha channel must contain the character and nothing else — run an
   alpha scan and confirm there is no ink below the feet.
4. **Colours inside the six brand hexes** in §5. No seventh colour, including in
   props, jars and glyphs.
5. **It reads at its slot size.** Render it at the 1× CSS size in the table and look
   at it there — not at 100 %. The jars scene at 96 px is the hardest one; if the
   three jars are not individually distinguishable at 96 px, it fails.
6. **It works on both grounds.** Composite every asset on `#ffffff` **and** on
   `#002d56` and look at both. The homepage is roughly half dark; an asset whose
   silhouette dissolves on navy is not finished. This is the two-ground rule from
   `assets/finwy/README.md §2` and it is the most commonly missed criterion.
7. **Mittens, never fingers.**
8. **Clean 8-bit alpha**, no white matte fringe, no black premultiply fringe, no
   1-bit hard cut.
9. **Sequences hold their camera.** Items 1–12 and 25–32 must not drift in distance,
   eye level or body scale between frames.

---

## 8 · The cheaper alternative — regenerate, don't model

The original `finwy-3d.png` was produced by giving the flat 2D logo to **ChatGPT's
image generator**. That means a consistent set can be regenerated at near-zero cost
with **the existing render attached as the reference image**, and three test
generations already in `assets/finwy-3d/incoming/` confirm it works: the body, face,
stitch row, ₹ notes and mitten cuffs all came back correct.

`PROMPTS-CHATGPT.md` in this folder is the full pack — 32 prompts, a shared style
preamble and a reject checklist. The parameters that route needs:

| Parameter | Value |
|---|---|
| reference image | `fw-deck-2026/slides/finwy-3d.png`, attached to **every** prompt |
| in-context examples | for a sequence, attach the previous accepted frame alongside the reference |
| canvas | 2:3 portrait for full-body, 1:1 for heads and glyphs, 3:2 landscape for scenes |
| background | "plain, flat, fully transparent — no glow, bloom, halo, rim-light spill, vignette, gradient, floor or shadow"; fall back to flat `#FFFFFF` if transparency is refused |
| character lock | "reproduce this same character, same model, same proportions, same materials — only pose, expression and props change" |
| hands | "mittens — one rounded paddle and one thumb lobe; never fingers" |
| money | "Indian rupee banknote, mint and teal, large ₹; never a dollar bill, never a coin" |
| palette | the six hexes, named explicitly, plus an explicit ban on green/purple/pink/orange/red/yellow |
| lighting | "one soft key from the upper left, soft fill from the right, matte navy shell, slightly glossier mint panel, rounded bevels" |
| framing | "centred, complete, clear margin — feet, flaps and note tips must not touch any edge" |
| negatives | no text/letters/numbers/logos/watermarks/speech bubbles, no sparkles/confetti/speed lines, no crown, no human features |
| variations | generate 3–4 per slot and pick; keep rejects, bump the version number |

**What that route does not give you:** a re-poseable model, guaranteed frame-to-frame
camera stability across a 12-frame flipbook, or the ability to re-light the logo head
for a new ground next year. Its three known failure modes, all observed in the test
generations, are a **baked glow in the alpha**, **fingers instead of mittens**, and
**off-palette props** (gold coins, a blue jar).

**Recommended split:** take the generated route for items 14–22 and 25–32, where a
single good frame is enough. Commission the model for items **1–13 and 23–24** — the
flipbook, because camera stability across twelve frames is exactly what generation
cannot promise, and the logo head, because it is the logo and it will need
re-rendering every time a new ground or a new size appears.

---

*Written 2026-08-23 against `fw-deck-2026/slides/finwy-3d.png` and the 2D model sheet
at `finwiser-website/assets/finwy/`.*
