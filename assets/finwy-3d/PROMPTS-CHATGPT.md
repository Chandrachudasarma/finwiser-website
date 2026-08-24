# Finwy 3D — ChatGPT prompt pack

**32 prompts.** Run these yourself in ChatGPT image generation with
`fw-deck-2026/slides/finwy-3d.png` **attached as the reference image every time**.
That render is the character; this pack exists so the rest of the set comes out as
the *same* character.

Save every output into `assets/finwy-3d/incoming/`. An agent does the
post-processing afterwards — alpha cleanup, glow removal, scale normalisation,
WebP/AVIF at 1× / 2× / 3×. **You only need clean generations.** Do not crop,
resize, or convert anything yourself.

Naming: `finwy3d-<slug>-vNN.png` — e.g. `finwy3d-wake-04-v02.png`,
`finwy3d-goal-vehicle-v01.png`. Keep the rejects too, bump `vNN`; it is easier to
pick a winner from four than to regenerate.

---

## Read this first — what the three files already in `incoming/` got wrong

`finwy3d-wave-v01.png`, `finwy3d-wave-v02.png` and `finwy3d-jars-v01.png` prove the
route works — the body, the face, the stitch row, the ₹ notes and the mitten cuffs
are all right. Three things are wrong in all three, and the preamble below is
written to kill them:

1. **A teal glow and a black vignette are baked into the alpha.** The background is
   not transparent, it is a dark halo. That has to come off before the asset is
   usable, and keying it out eats the character's own edge.
2. **The waving hand has four/five fingers.** Finwy has **mittens** — one paddle,
   one thumb lobe. This is the single most repeated failure across every generation
   the project has ever produced.
3. **The jars scene has gold coins and a blue jar.** Money in a Finwiser
   illustration is an **Indian ₹ note**. Never a coin, never a dollar bill.

---

## STYLE PREAMBLE — paste this above every prompt

> Use the attached image as the exact character reference. Reproduce **this same
> character**, same model, same proportions, same materials — only the pose, the
> expression and the props change.
>
> **Character.** Finwy is an open wallet standing on two legs. The shell is a **W**
> silhouette in **matte deep navy** with a soft satin sheen, no gloss highlight. The
> front of the shell is a wide **mint** panel shaped like a shield, coming to a point
> at the bottom centre, and it carries the whole face. A **mint rim** folds over the
> wallet's top edge; two navy-backed, mint-lined **flaps** stand up at the left and
> right corners. Inside the pocket sits a small fan of **Indian rupee banknotes** in
> mint and teal — the front note shows a large **₹** and a round portrait medallion.
> Feet and leg cuffs are mint. Proportions: the body is about as wide as it is tall
> below the rim; the notes rise about a third of the body height above the rim.
>
> **Face.** On the mint panel, in navy: a row of **six short dashed stitches** curving
> across the top like a brow; below it two **plain round navy eyes**, no pupils, no
> highlights, no eyelashes; below that one **simple curved smile**, a rounded navy
> stroke. Nothing else. No nose, no cheeks, no eyebrows beyond the stitch row.
>
> **Hands.** If the pose needs arms: rounded navy tube arms with a **mint cuff band**
> at the wrist, ending in **MITTENS — one rounded paddle and one thumb lobe, and
> nothing else. Never fingers. Never four fingers, never five.**
>
> **Colour.** Only these: navy `#002D56`, deep navy `#001F3D`, mint `#35D6C6`,
> teal `#00B6AD`, and warm gold `#F5C26B` where a third accent is genuinely needed.
> No green, no purple, no pink, no orange, no red, no saturated yellow.
>
> **Light and render.** One soft key light from the **upper left**, gentle fill from
> the right, broad soft shadow terminators, slightly rounded bevels on every edge.
> Clean studio 3D, like a soft-plastic toy.
>
> **Background — this is the part that keeps going wrong.** A completely **plain,
> flat, fully transparent background**. **No glow, no bloom, no halo, no rim-light
> spill, no vignette, no gradient, no floor, no ground shadow, no cast shadow, no
> reflection.** If transparency is not possible, use a **flat pure white `#FFFFFF`**
> background with nothing else on it at all.
>
> **Never:** any text, letters, numbers, words, logos, watermarks or speech bubbles
> baked into the image. No sparkles, stars, confetti, speed lines or motion streaks.
> No dollar signs, no green US bills, no gold coins. No human hair, faces, clothes,
> hats or accessories. No crown.
>
> **Frame.** Character centred, **complete and fully inside the frame with clear
> margin — feet, flaps and note tips must not touch or cross any edge.** Front view
> unless the prompt says otherwise.

---

## The prompts

Each is ≤ 80 words and assumes the preamble above is already in the conversation.

### A · Wake-up flipbook — 12 frames (prompts 1–12)

These must read as **one continuous motion**. Generate them in order, in the same
conversation, and attach the previous frame alongside the reference for 2–12.
**Identical camera, identical distance, identical eye level, identical body scale in
every frame** — only the pose changes. Forward-only: asleep → stir → eyes open →
stretch → stand → wave.

1. **Asleep.** Finwy slumped low, body settled down onto its feet, top flaps drooped
   forward, notes sunk almost out of sight. Eyes are two short flat horizontal navy
   dashes (closed). Smile relaxed into a small flat curve. No arms. Portrait 2:3.
2. **Asleep, deeper.** Same slump, body compressed a fraction lower, flaps drooped a
   little further, notes fractionally lower. Eyes still closed dashes, smile still
   flat. No arms. Portrait 2:3.
3. **First stir.** Body lifts slightly out of the slump, one flap begins to rise.
   Eyes still closed dashes but the stitch row tilts a touch. Notes edge upward. No
   arms. Portrait 2:3.
4. **Eyes cracking open.** Body half risen. Eyes are narrow navy ovals, roughly
   one-third open. Both flaps rising. Smile beginning to curve. No arms. Portrait 2:3.
5. **Eyes open.** Body upright but still settled, weight low. Eyes are full round
   navy circles, neutral. Flaps up. Notes at normal height. Smile small. No arms.
   Portrait 2:3.
6. **Waking, arms appearing.** Upright, weight low. Round eyes. Two navy tube arms
   with mint wrist cuffs, hanging loose at the sides, **mitten hands**. Portrait 2:3.
7. **Stretch, arms rising.** Body lifting, both arms rising outward to shoulder
   height, mitten hands open. Round eyes, small smile. Notes tip slightly. Portrait 2:3.
8. **Full stretch.** Both arms raised high in a wide V above the rim, mitten hands
   open, body stretched tall, notes fanned upward. Eyes round, mouth a small open
   navy oval mid-yawn. Portrait 2:3.
9. **Settling from the stretch.** Arms coming back down to just above shoulder
   height, mitten hands relaxed. Body still tall. Eyes round, smile returning.
   Portrait 2:3.
10. **Standing tall.** Body at full standing height, both arms down at the sides with
    mitten hands, feet planted apart. Round eyes, easy smile. Notes upright and
    fanned. Portrait 2:3.
11. **Right arm lifting to wave.** Standing tall. Left arm at the side. Right arm
    raised to shoulder height and bent, mitten hand at head level. Round eyes, wider
    smile. Portrait 2:3.
12. **The wave.** Standing tall, left arm at the side, right arm raised above the rim,
    **mitten hand open in a clear wave**. Round eyes, full smile. Notes fanned
    upright. This frame is the hold — make it the most confident pose. Portrait 2:3.

### B · The canonical wave (prompt 13)

13. **Hero wave.** Finwy standing tall, front view, feet planted apart, left arm
    relaxed at the side, right arm raised above the rim with the **mitten hand open in
    a wave**. Round navy eyes, full smile, six stitches, ₹ notes fanned upright in the
    pocket. The single most confident, friendliest version of this character.
    Portrait 2:3, character fills about 80 % of the frame height.

### C · Allocation scene — the ₹ jars (prompts 14–15)

14. **Jars, simple — must read at 96 px.** Finwy centre, front view, both arms out,
    a **mitten hand** on each side holding one ₹ banknote. In front of him, three
    identical wide-mouthed glass jars in a row, tinted **mint**, **teal** and **gold**.
    One thin mint arc from each hand into a jar. **Banknotes only — no coins.** Big
    simple shapes, minimum detail. Landscape 3:2.
15. **Jars, detailed.** Same layout and same three mint / teal / gold jars, but with
    several ₹ notes in flight arcing into each jar and a few notes already inside.
    Each jar is a plain glass jar; nothing is written or printed on them.
    **Banknotes only — no coins, no lids, no labels.** Landscape 3:2.

### D · Goal glyphs — objects only, no character (prompts 16–19)

Same material and lighting as Finwy, but **Finwy is not in these**. Single object,
centred, square 1:1, generous margin.

16. **Emergency.** A rounded navy shield with a soft mint front face and a single
    mint heartbeat pulse line across it. Nothing else.
17. **Retirement.** A soft mint sun disc rising over one simple navy horizon bar,
    with three short mint rays. Nothing else.
18. **Education.** A navy graduation mortarboard, mint underside, one mint tassel
    hanging from the corner. Nothing else.
19. **Vehicle.** A small rounded navy hatchback car, three-quarter front view, mint
    windows and mint wheel hubs. Nothing else.

### E · Personas — Finwy plus one prop (prompts 20–22)

20. **Young earner.** Finwy standing, three-quarter left, one **mitten hand** resting
    on the lid of an open navy laptop with a plain **blank mint screen**. Round eyes,
    easy smile. **Nothing written on the screen.** Square 1:1.
21. **Working parent.** Finwy standing, front view, a rounded navy-and-mint school
    backpack with mint straps slung over one shoulder flap, one **mitten hand** holding
    the strap. Warm smile. Square 1:1.
22. **Retiring parent.** Finwy relaxed, seated in a simple mint-and-navy folding deck
    chair, arms resting on the chair arms with **mitten hands**, feet forward. Content,
    settled smile, softly curved eyes. Square 1:1.

### F · The logo head — two lighting versions (prompts 23–24)

Both must be the **exact same camera and pose as the attached reference**: straight
front view, no arms, no legs below the W, notes fanned above the rim.

23. **Lit for a white ground.** Straight front view, no arms. Soft key from the upper
    left, a slightly stronger fill so the navy shell's outer edge stays clearly
    darker than white and the silhouette reads crisply against pure white. Square 1:1.
24. **Lit for a navy ground.** Identical camera and pose, but a brighter mint rim
    light tracing the whole outer edge of the navy shell, so the silhouette separates
    from a **dark navy** background. Square 1:1.

### G · Expression heads — 8 faces (prompts 25–32)

Front view, no arms, identical camera and framing in all eight — only the face and
the note fan change. Square 1:1.

25. **Neutral.** Round navy eyes, straight small smile, six stitches level.
26. **Happy.** Round eyes, wide open smile curve, notes fanned a little higher.
27. **Thinking.** Eyes looking up and to the left, stitch row tilted on one side,
    mouth a small flat navy line off to one side.
28. **Worried.** Eyes slightly narrowed, stitch row angled down at the outer ends,
    mouth a small downward navy curve. Notes sagging slightly lower in the pocket.
29. **Celebrating.** Eyes as two upward mint-outlined navy arcs (squeezed shut with
    joy), wide open smile, notes fanned high and spread wide. **No confetti.**
30. **Sleeping.** Eyes as two short flat navy dashes, mouth a small relaxed curve,
    flaps drooped forward, notes sunk low. **No Z's, no text.**
31. **Winking.** One round navy eye open, the other a short flat navy dash, smile
    pulled up higher on the winking side.
32. **Waving face.** Round eyes, the broadest friendliest smile of the set, stitch row
    level, notes upright — the face that pairs with prompt 13. No arms in this one.

---

## REJECT list — check every output before you save it

Reject and regenerate if you see **any** of these:

- [ ] **Fingers.** Any hand that is not a mitten (one paddle + one thumb lobe).
- [ ] **A glow, halo, bloom, vignette or coloured spill** around the character.
- [ ] **Any ground shadow, cast shadow, floor, platform or reflection.**
- [ ] **Any text** — letters, numbers, words, a logo, a watermark, a speech bubble.
      *(The `₹` printed on a banknote is the one exception, and only on a banknote.)*
- [ ] **A dollar sign, a green US bill, or a gold coin.** ₹ notes only.
- [ ] **Off-palette colour** — green, purple, pink, orange, red, saturated yellow.
- [ ] **Cropped feet, cropped flaps or cropped note tips** touching the frame edge.
- [ ] **A different face** — pupils, highlights, eyelashes, a nose, cheeks, a tongue,
      a crown, more or fewer than six stitches, eyes that are not plain navy discs.
- [ ] **A different body** — wrong proportions, no mint rim, no side flaps, a face
      panel that is not a pointed shield, a gloss/specular finish instead of matte.
- [ ] **Camera drift** inside a numbered sequence (A and G especially) — if frame 7
      is a different distance or eye level from frame 6, the flipbook will jump.

If two or three of a set come back good and one keeps failing, generate the failing
one again with the two good ones attached alongside the reference — consistency
improves sharply with more in-conversation examples.

---

## What happens after you drop the files

An agent picks up `incoming/` and does all of this, so do not attempt it yourself:

- key out the glow / white ground and rebuild a clean 8-bit alpha
- crop to the character's true alpha bounds and normalise scale and baseline across a
  set so a flipbook does not jitter
- colour-grade toward the six brand hexes (the same hue-ramp used on the logo head —
  see `README.md §3`)
- export PNG + WebP + AVIF at 1× / 2× / 3× for each slot's real display size
- run the palette guard and put every asset on `#ffffff` **and** `#002d56` before it
  ships

---

*Written 2026-08-23, against the three generations already in `incoming/`.*
