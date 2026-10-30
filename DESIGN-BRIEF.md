# Meridian Studio — One-page design brief

**Direction:** `editorial-report` — "The printed annual" (seed 2120773495, agency / editorial).
**The meridian:** a fixed vertical axis at ~42% of the width organises the whole page — one
reference line that every heading, price, promise and project hangs from. This *is* the brand idea,
not decoration, and it echoes your `</>` as a clean vertical rule.

**Idea sentence:** *On this page, the meridian — a single reference line — becomes the axis every
price, promise and project hangs from.* (Passes the competitor test: the line only means something
because the studio is called Meridian.)

**The one live thing (signature):** a drag-to-reveal before/after slider in the hero —
*Instagram page → real website*. Thumb-draggable, keyboard accessible (arrow keys + a labelled
handle), plain fallback shows both states stacked if JS is off.

---

## Palette (warm off-white + espresso + one restrained accent)

Kept the direction's *proportions* (paper ground, one ink, solid colour blocks, accent only on
actions) and swapped in your brand colours.

| Role | Hex | Use |
|---|---|---|
| `--paper` ground | `#F4EEE3` | the page ground (warm off-white) |
| `--surface` | `#EBE2D2` | one tone step up, for alternating rows / light fields |
| `--ink` espresso | `#2B211A` | all body + display text; also the dark colour field (pricing, footer) |
| `--muted` | `#6E5F52` | secondary notes only, never body |
| `--accent` | `#1F5C4B` **(surveyor green — confirm)** | primary buttons, the slider handle, the "order" squares in the process diagram, map marker. Never fills a section. |
| `--accent-ink` | `#F4EEE3` | text on the accent |

> **Accent note / [FILL ME]:** your old badge is two-colour (espresso on off-white) so there's no
> third colour to sample. The house rules *ban* a cream-ground + terracotta/rust accent (it's the
> default "AI" palette), so I'm proposing a deep **surveyor green** — an instrument/navigation colour
> that sits with espresso and reads premium. **Send me the badge PNG and I'll sample a true accent,
> or confirm the green.**

Contrast: espresso on paper ≈ 12:1; paper on green ≈ 6.4:1 — both pass AA.

## Type (self-hosted, two faces)

- **Display / headings:** **Archivo Expanded** (500/600) — wide technical sans, your stated brief.
  Sentence case, tracking −0.02 to −0.03em, leading 0.95–1.05.
- **Body:** **Inter** (400/500) — clean body sans. Leading 1.5–1.55, measure 34–40ch.
- Both OFL, self-hosted as subset woff2. No render-blocking.

**Five steps only:**
`display` clamp(2.6rem, 1.4rem+5.4vw, 5.5rem) · `head` clamp(2rem, 1.2rem+3vw, 3.75rem) ·
`lead` clamp(1.25rem, 1.05rem+0.8vw, 1.6rem) · `body` clamp(1.06rem, 1rem+0.3vw, 1.19rem) ·
`small` clamp(0.81rem, 0.78rem+0.12vw, 0.94rem).

## Grid & frame

- 12 columns, max content ~1320px, centred. **Equal outer margins:** 48px desktop, 32px tablet,
  20px phone.
- **The axis:** headings/body start at 42% of the content width; cols 1–4 (left of axis) hold side
  notes, figures, or composed emptiness. On phone the axis collapses to the 20px left margin, one
  column.
- Section gaps 120–200px desktop, 72–96px phone. No blank stretch over half a screen. One `h1`,
  a heading on every section, AA contrast, visible focus.

## Motion

- **Signature:** masked headline — each hero line rises from behind its baseline, ~900ms ease-out,
  line 2 +110ms; subcopy + button fade up after.
- Section-part entrances (heading → text → picture, staggered 60–90ms, rise 16–32px + fade, once on
  enter). Control feedback on every button/link/tile/slider. One moving picture (slow scale on a
  work image or a found muted clip). Transform/opacity only.
- `prefers-reduced-motion`: drop travel, keep all content; the slider still works by keyboard.

## Section wireframes (in words)

0. **Sticky nav** — wordmark left; links *Work · Packages · Process · FAQ* on/after the axis; one
   button **Get a free preview** at the right. Minimal, no chrome, no glass.
1. **Hero** — composed void: top row, then ~55vh of quiet with the meridian line faint on the axis.
   Bottom third: 2-line statement starting on the axis; subcopy (≤32ch) bottom-left of the axis;
   two CTAs (**Get a free preview** button, *See my work* link). Immediately below, a full-bleed
   plate holds the **before/after slider** large (≥40% screen), captioned *Instagram page → real
   website · drag to reveal*.
2. **Proof** — *Recognition as a table*, but **facts only** (no invented awards): a no-line table,
   alternating warm rows — e.g. *MyToolPad · 22 free tools · live & fast · SEO-ready (sitemap +
   schema)*. Heading on the axis: "Proof, not promises."
3. **What you get** — *Paragraph with picture words*: one large paragraph naming fast, mobile-first,
   bookings, Google-ready, **you own it** — with tiny interface crops inline after each key noun.
   Hidden heading; supporting line + CTA at the axis.
4. **Packages** — *Colour fields* (adapted two→**three**): Starter / Business / Growth as full-height
   flat-colour blocks meeting at hard edges (paper / surface / espresso); **Business** widest +
   accent as the one that matters. Price big bottom-left, button bottom-right, what's-included as a
   short paragraph (no tick lists). Slim **care-plan** strip beneath. All prices marked **[FILL ME]**
   ($450 / $950 / $1,800 / $35 mo placeholders).
5. **Work** — *Staggered tiles, empty cells*: four device-framed tiles — **Barber, Cafe, Mechanic**
   concept mini-sites (built for real in `/concepts`, labelled "Concept project") + **MyToolPad** as
   the live case study. Heading sits in an empty cell. Captions: name left, label right.
6. **Process** — *Many into one*: an SVG diagram of small squares going scatter → tight ribbon →
   ordered rows in the accent (Instagram chaos → a clear site; the meridian pulling things into
   line). Four step names: **Free preview · Build in days · Launch · Look after it.**
7. **FAQ** — *Answers as reading text*: 6–8 Q&As as two-column continuous reading text, run-in
   questions in medium weight (cost, time, ownership, booking, hosting, edits, what the free preview
   is, what if you don't like it). No accordions.
8. **Contact** — editorial invite sentence + *"I reply within one business day"* + email + areas on
   the left; a real **Formspree form** on the right (name, business, email, message) with a one-line
   note on how details are used. *(The blueprint says "no form" — your brief overrides it.)*
9. **Footer** — *Contact as the headline*: full-bleed **espresso** field ≥90vh; the email set huge
   as the display line (breaks before @); small top row (Sydney & Newcastle NSW · one-liner ·
   back-to-top); bottom meta (Privacy · credits · city + year); small wordmark top.

## Wordmark / monogram

New original SVG: a vertical **meridian stroke** flanked by angle brackets `‹ | ›` — abstracts your
`</>` and reads as a point of orientation / an "M". Clean line mark, single colour (ink; accent on
hover). Full wordmark "MERIDIAN STUDIO" in Archivo Expanded beside it.

## Imagery plan

1. Device-framed screenshots of the **real** concept mini-sites + MyToolPad (count as UI pictures).
2. Real licence-free **archival pictures of Sydney/Newcastle streets + the trades** (barber chair,
   cafe, workshop) from open collections (Wikimedia/Openverse/museums) via the skill's asset finder,
   one treatment, credited in the footer.
3. SVG drawn in code for the monogram + the process diagram.
4. Hero/concept photo slots that would be stronger as generated images are marked
   **[IMAGE TOOL, FILL ME]**.

Minimum 4 real pictures (likely 6–12). Credits list kept and printed in the report.

## Technical

Static HTML/CSS/vanilla JS, no framework (best for Lighthouse 95+). Self-hosted fonts, no
render-blocking third-party. One long page + `/privacy` + `404`. `noindex` until you publish.
Title, meta description, canonical, OG image, **ProfessionalService JSON-LD** (Sydney/Newcastle),
sitemap, robots. Semantic landmarks, one h1, visible focus, AA. Deployable to Vercel.
**Booking link [CAL.COM URL, FILL ME]**, **Formspree [ENDPOINT, FILL ME]**.

## Open items for you
- **Accent:** confirm surveyor green `#1F5C4B`, or send the badge to sample.
- References [REF 1/2/3] + the **Crescent Prestige Autohaus** link — if you send them I'll say what I
  borrowed from each; otherwise I'll borrow from the three studied sites on the direction sheet.
- Cal.com URL, Formspree endpoint, any image generator you connected.
