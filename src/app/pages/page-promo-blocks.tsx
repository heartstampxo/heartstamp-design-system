import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { ChristmasPromo } from "../components/blocks/hs-christmas-promo";
import { ThanksgivingPromo } from "../components/blocks/hs-thanksgiving-promo";
import { IndependencePromo } from "../components/blocks/hs-independence-promo";
import { HalloweenPromo } from "../components/blocks/hs-halloween-promo";
import { ValentinesPromo } from "../components/blocks/hs-valentines-promo";
import { NewYearPromo } from "../components/blocks/hs-new-year-promo";

/* ═══════════════════════════════════════════════════════════════════════════
   PROMO BLOCKS — the seasonal campaign bands, one page.

   The family is Christmas, Thanksgiving, Independence Day, New Year and
   Valentine's Day. Each is a section here rather than its own nav entry,
   because they are the same block dressed for a different date: a marketing
   team picking this year's band wants to see them beside each other.

   All six are built: Christmas, Thanksgiving, Independence Day, Halloween,
   Valentine's Day and New Year. A season is a `<DocSection>` below plus a
   preset in blocks/, and nothing else.
   ═══════════════════════════════════════════════════════════════════════════ */

const CHRISTMAS_USAGE = `import {
  ChristmasPromo,
  CHRISTMAS_PROMO_CARDS,
  CHRISTMAS_PROMO_FEATURES,
  CHRISTMAS_PROMO_PIXEL_BAND,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block, pixel for pixel:
//   <ChristmasPromo />
// Everything below is that same block with each default written out.

<ChristmasPromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>It’s Christmas in July!<br />Get a super early jumpstart.</>}

  // Spread the approved set to change one field, or pass your own array.
  //   cards={[{ ...CHRISTMAS_PROMO_CARDS[1], href: "/holiday-cards" }]}
  //   cards={false}                          // removes the row entirely
  cards={CHRISTMAS_PROMO_CARDS}

  // Slice to shorten the grid; a plain icon needs no crop geometry.
  //   features={CHRISTMAS_PROMO_FEATURES.slice(0, 4)}
  //   features={[{ icon: "/icons/gift.svg", title: "Gift wrap", desc: "Free." }]}
  //   features={false}
  features={CHRISTMAS_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px

  // ── Offer bar ────────────────────────────────────────────────────────
  // With href it renders an <a>, without one a <button>.
  //   banner={false}                         // removes the bar and its space
  banner={{
    label: "Christmas in July: 50% off holiday cards, printed and posted for you",
    href: "/offers",
    onClick: openOffer,
    hideChevron: false,
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  ground="rgb(14, 51, 30)"                   // fixed in light and dark alike
  pixelBand={CHRISTMAS_PROMO_PIXEL_BAND}     // false drops the knitted strip
  pixelBandHeight={63}
  bandPadding="140px 0 96px"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
  className="my-page-block"
/>`;

const THANKSGIVING_USAGE = `import {
  ThanksgivingPromo,
  THANKSGIVING_PROMO_CARDS,
  THANKSGIVING_PROMO_FEATURES,
  THANKSGIVING_PROMO_PIXEL_BAND,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block:
//   <ThanksgivingPromo />
// Everything below is that same block with each default written out.

<ThanksgivingPromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>Thanksgiving is here!<br />Start your holiday preparations early.</>}

  // The card art is the approved Christmas photography, standing in until
  // Thanksgiving's own lands — the handoff carried placeholders.
  //   cards={[{ ...THANKSGIVING_PROMO_CARDS[0], src: "/img/turkey.webp" }]}
  //   cards={false}                          // removes the row entirely
  cards={THANKSGIVING_PROMO_CARDS}

  // The same six HeartStamp callouts every season carries.
  features={THANKSGIVING_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px

  // ── Offer bar ────────────────────────────────────────────────────────
  banner={{
    label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
    href: "/offers",
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  // The ground is a gradient here, not a flat colour — any CSS background
  // value works, so no engine change was needed to carry it.
  ground="linear-gradient(180deg, #DFB083 0%, #E87000 100%)"
  pixelBand={THANKSGIVING_PROMO_PIXEL_BAND}  // false drops the strip
  pixelBandHeight={95}                       // taller than Christmas's 63
  bandPadding="160px 0 68px"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
/>`;

const INDEPENDENCE_USAGE = `import {
  IndependencePromo,
  INDEPENDENCE_PROMO_CARDS,
  INDEPENDENCE_PROMO_FEATURES,
  INDEPENDENCE_PROMO_FLAG,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block:
//   <IndependencePromo />
// Everything below is that same block with each default written out.

<IndependencePromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>Celebrate Independence Day this July!<br />Join us for a festive kickoff.</>}

  // The card art is the approved photography, standing in until this
  // campaign's own lands — the handoff carried placeholders.
  cards={INDEPENDENCE_PROMO_CARDS}

  // The same six HeartStamp callouts every season carries.
  features={INDEPENDENCE_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px
  headWidth={770}                            // keeps the headline on one line

  // ── Offer bar ────────────────────────────────────────────────────────
  banner={{
    label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
    href: "/offers",
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  ground="#132941"                           // flat navy, light and dark alike

  // This season decorates with a corner drawing instead of a top strip, so
  // the strip is switched off and the flag switched on.
  pixelBand={false}
  cornerArt={INDEPENDENCE_PROMO_FLAG}        // false drops the flag
  cornerArtWidth={988}
  cornerArtHeight={231}
  bandPadding="240px 0 68px"          // clears the flag at any width

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
/>`;

const HALLOWEEN_USAGE = `import {
  HalloweenPromo,
  HALLOWEEN_PROMO_CARDS,
  HALLOWEEN_PROMO_DECORATIONS,
  HALLOWEEN_PROMO_ART,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block:
//   <HalloweenPromo />
// Everything below is that same block with each default written out.

<HalloweenPromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>It’s Halloween in October!<br />Get a spooky head start.</>}
  cards={HALLOWEEN_PROMO_CARDS}
  features={HALLOWEEN_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px

  // ── Offer bar ────────────────────────────────────────────────────────
  banner={{
    label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
    href: "/offers",
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  ground="#070E17"                           // near-black, light and dark alike

  // The parade along the top. This strip runs from the very top of the band
  // and sits 3px in, where the other seasons' are held 6px inside on both.
  pixelBand={HALLOWEEN_PROMO_TOP_BANNER}
  pixelBandHeight={93}
  pixelBandTop={0}
  pixelBandInset={3}

  // The loose art. Each piece carries its own size and offsets; anything on
  // the right hangs off "right" so it stays in the margin as the band
  // narrows. Rescatter them, or pass false to drop the lot.
  //   decorations={[
  //     { src: HALLOWEEN_PROMO_ART.batSmall, width: 57, height: 50, top: 240, right: 120 },
  //   ]}
  //   decorations={false}
  decorations={HALLOWEEN_PROMO_DECORATIONS}
  bandPadding="160px 0 68px"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
/>`;

const VALENTINES_USAGE = `import {
  ValentinesPromo,
  VALENTINES_PROMO_CARDS,
  VALENTINES_PROMO_FEATURES,
  VALENTINES_PROMO_TOP_BAND,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block:
//   <ValentinesPromo />
// Everything below is that same block with each default written out.

<ValentinesPromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>Valentine’s Day is just around the corner!<br />Start planning your perfect celebration.</>}
  headWidth={790}                            // the longest headline of any season
  cards={VALENTINES_PROMO_CARDS}
  features={VALENTINES_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px

  // ── Offer bar ────────────────────────────────────────────────────────
  banner={{
    label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
    href: "/offers",
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  ground="#810316"                           // deep red, light and dark alike
  pixelBand={VALENTINES_PROMO_TOP_BAND}      // false drops the strip
  pixelBandHeight={87}
  pixelBandTop={0}                           // runs from the very top
  bandPadding="160px 0 68px"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
/>`;

const NEW_YEAR_USAGE = `import {
  NewYearPromo,
  NEW_YEAR_PROMO_CARDS,
  NEW_YEAR_PROMO_FEATURES,
  NEW_YEAR_PROMO_TOP_BAND,
} from "@heartstampxo/design-system";

// Bare, it is the approved seasonal block:
//   <NewYearPromo />
// Everything below is that same block with each default written out.

<NewYearPromo
  // ── Content ──────────────────────────────────────────────────────────
  eyebrow="For the real holiday lovers"      // false removes it
  heading={<>Celebrate the New Year in style!<br />Kick off the festivities early.</>}
  cards={NEW_YEAR_PROMO_CARDS}
  features={NEW_YEAR_PROMO_FEATURES}
  featureColumns={2}                         // collapses to 1 under 900px

  // ── Offer bar ────────────────────────────────────────────────────────
  banner={{
    label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
    href: "/offers",
  }}

  // ── Appearance ───────────────────────────────────────────────────────
  ground="#0C255E"                           // deep navy, light and dark alike

  // Same slot as the other strips, but 351px deep rather than ~90 — the
  // header sits inside the fireworks rather than below them.
  pixelBand={NEW_YEAR_PROMO_TOP_BAND}
  pixelBandHeight={351}
  pixelBandTop={0}
  bandPadding="160px 0 68px"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
/>`;

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        fontSize: 11.5, fontWeight: "var(--font-weight-medium, 500)" as any,
        padding: "5px 11px", borderRadius: "var(--radius-full)",
        border: "1px solid var(--border)", background: "var(--muted)", color: "var(--fg)",
        whiteSpace: "nowrap" as const,
      }}
    >
      <RotateCw size={12} aria-hidden="true" /> Replay motion
    </button>
  );
}

/* Every season takes the same props — they are PromoBandProps — and differs
   only in what each one defaults to. One table, with the defaults per season
   in their own columns, beats repeating thirteen rows for each. */
function SeasonProps({
  season,
}: {
  season: "christmas" | "thanksgiving" | "independence" | "halloween" | "valentines" | "newyear";
}) {
  const xmas = season === "christmas";
  const july = season === "independence";
  const oct = season === "halloween";
  const feb = season === "valentines";
  const jan = season === "newyear";
  const CONST =
    xmas ? "CHRISTMAS_PROMO"
    : july ? "INDEPENDENCE_PROMO"
    : oct ? "HALLOWEEN_PROMO"
    : feb ? "VALENTINES_PROMO"
    : jan ? "NEW_YEAR_PROMO"
    : "THANKSGIVING_PROMO";
  const headline =
    xmas ? "the Christmas headline"
    : july ? "the Independence Day headline"
    : oct ? "the Halloween headline"
    : feb ? "the Valentine's Day headline"
    : jan ? "the New Year headline"
    : "the Thanksgiving headline";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <PropsTable props={[
        { name: "eyebrow",        type: "ReactNode | false", def: '"For the real holiday lovers"', desc: "Small uppercase line above the heading. false removes it." },
        { name: "heading",        type: "ReactNode | false", def: headline, desc: "Takes nodes, so line breaks are yours to place. false removes it; with eyebrow false too, the whole header goes." },
        { name: "cards",          type: "PromoBandCard[] | false",    def: `${CONST}_CARDS`, desc: "The promo cards. false removes the row. Slice or spread the exported default to change one without restating all three." },
        { name: "features",       type: "PromoBandFeature[] | false", def: `${CONST}_FEATURES`, desc: "The feature callouts. false removes the grid. Slice the exported default to shorten it." },
        { name: "featureColumns", type: "number",            def: "2", desc: "Columns in the feature grid. Collapses to 1 below 900px of the block's width regardless." },
        { name: "headWidth",      type: "number",            def: july ? "770" : feb ? "790" : season === "thanksgiving" ? "738" : "611", desc: "The measure the heading wraps at, in px. Per-season, because each headline is a different length. Capped at 100% of the band." },
        { name: "banner",         type: "PromoBandBanner | false",    def: `${CONST}_BANNER`, desc: "The offer bar under the band. false removes it entirely. With an href it renders an anchor, without one a button." },
        { name: "ground",         type: "string",            def: xmas ? '"rgb(14, 51, 30)"' : july ? '"#132941"' : oct ? '"#070E17"' : feb ? '"#810316"' : jan ? '"#0C255E"' : "the orange gradient", desc: "The band's ground. Any CSS background value, so gradients work. Fixed across light and dark by design." },
        { name: "pixelBand",      type: "string | false",    def: july ? "false" : "the packaged strip", desc: july ? "The strip along the top. This season decorates with corner art instead, so it is off." : "The pixel strip along the top. Pass a URL to swap it, false to drop it." },
        { name: "pixelBandHeight", type: "number",           def: xmas ? "63" : july ? "—" : oct ? "93" : feb ? "87" : jan ? "351" : "95", desc: "Height of that strip in px. The art is drawn at this height and its width scales with it." },
        { name: "cornerArt",      type: "string | false",    def: july ? "INDEPENDENCE_PROMO_FLAG" : "false", desc: "A fixed drawing pinned to the band's top-left corner, behind the content. The other shape a season's decoration takes." },
        { name: "cornerArtWidth", type: "number",            def: july ? "988" : "—", desc: "Width of that drawing in px. The band clips it, so a narrower band shows less of it." },
        { name: "cornerArtHeight", type: "number",           def: july ? "231" : "—", desc: "Height of that drawing in px." },
        { name: "pixelBandTop",   type: "number",            def: oct || feb || jan ? "0" : "6", desc: "Offset of the strip from the band's top edge, in px." },
        { name: "pixelBandInset", type: "number",            def: oct ? "3" : "6", desc: "Inset of the strip from the band's left and right edges, in px." },
        { name: "decorations",    type: "PromoBandDecoration[] | false", def: oct ? "HALLOWEEN_PROMO_DECORATIONS" : "—", desc: "Loose art scattered behind the content. Each piece carries its own size and offsets. Dropped below 900px, where the stacked layout makes the desktop placements meaningless." },
        { name: "bandPadding",    type: "string",            def: xmas ? '"140px 0 96px"' : july ? '"240px 0 68px"' : '"160px 0 68px"', desc: "Vertical padding on the band, as a CSS padding shorthand." },
        { name: "reveal",         type: "boolean",           def: "true", desc: "Fade-and-rise the header, cards and features in as they scroll into view. Ignored under prefers-reduced-motion." },
        { name: "onCtaClick",     type: "() => void",        desc: "Shorthand for banner.onClick, so the default bar can be wired without restating the banner." },
        { name: "className",      type: "string",            desc: "Extra class on the block's root." },
        { name: "style",          type: "React.CSSProperties", desc: "Inline style on the block's root." },
      ]} />
      <Callout variant="info">
        The item types are exported too — <code>PromoBandCard</code>,{" "}
        <code>PromoBandFeature</code> and <code>PromoBandBanner</code>, aliased per season
        as <code>{xmas ? "ChristmasPromoCard" : july ? "IndependencePromoCard" : oct ? "HalloweenPromoCard" : feb ? "ValentinesPromoCard" : jan ? "NewYearPromoCard" : "ThanksgivingPromoCard"}</code> and so on —
        along with this season's{" "}
        <code>{`${CONST}_*`}</code> defaults. Build from
        those rather than retyping the approved copy, and a change upstream reaches you.
      </Callout>
    </div>
  );
}

/* ── Christmas ──────────────────────────────────────────────────────────── */

function ChristmasSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="Christmas"
      desc="Rendered bare it is the approved seasonal band, pixel for pixel. Every part of it is also a prop, so the same component covers the next Christmas campaign — the Code tab has the whole surface written out."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="Christmas Promo" code={CHRISTMAS_USAGE} fullWidth height={1180} contentAlign="start">
        <ChristmasPromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="christmas" /> },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The band is a fixed festive ground — <code>ground</code> defaults to{" "}
                  <code>rgb(14, 51, 30)</code> in light and dark alike — so its ink is pinned to{" "}
                  <code>--color-text-on-primary</code>, which is near-white in both. The card and
                  feature copy derive from that same token with{" "}
                  <code>color-mix</code> rather than restating white by hand.
                </Callout>
                <Callout variant="info">
                  The offer bar keeps a brand pink in both themes (<code>#f5bdc2</code> light,{" "}
                  <code>#eb7a85</code> dark), so its ink has to stay dark in both. It is exposed
                  as <code>--xpromo-banner-bg</code> and <code>--xpromo-banner-ink</code>,
                  overridable on the block or any ancestor. Reading it from{" "}
                  <code>--color-text-primary</code> is what previously left near-white text on
                  pink at about 2.3:1; it now measures <strong>5.66:1</strong> in dark and
                  9.57:1 in light.
                </Callout>
                <Callout variant="info">
                  The animated card underline is painted in{" "}
                  <code>--color-text-on-primary</code>. It used to use{" "}
                  <code>--color-bg-main</code> — the <em>page</em> ground, which is near-white in
                  light so it happened to read, and near-black in dark, where the rule
                  disappeared into the green. It now measures 13:1 against the band in both.
                </Callout>
              </div>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Thanksgiving ───────────────────────────────────────────────────────── */

function ThanksgivingSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="Thanksgiving"
      desc="The same band dressed for Thanksgiving. Only two things actually differ from Christmas — the ground is a gradient rather than a flat colour, and the strip along the top is a different, taller piece of pixel art."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="Thanksgiving Promo" code={THANKSGIVING_USAGE} fullWidth height={1180} contentAlign="start">
        <ThanksgivingPromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="thanksgiving" /> },
          {
            title: "Headline",
            content: (
              <Callout variant="info">
                <code>headWidth</code> is 738px here rather than the 611px the shorter headlines
                use. That is the handoff's own number, sized to hold{" "}
                <em>Start your holiday preparations early.</em> on one line — the longer of this
                season's two lines. At 611px it breaks in two and the header renders as three
                lines instead of the design's two.
              </Callout>
            ),
          },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The ground is a gradient —{" "}
                  <code>linear-gradient(180deg, #DFB083 0%, #E87000 100%)</code> — and it is
                  fixed in light and dark alike, exactly as the Christmas green is. Because{" "}
                  <code>ground</code> is applied as a CSS <code>background</code>, a gradient
                  needed no change to the engine; any background value works, images included.
                </Callout>
                <Callout variant="info">
                  Ink is <code>--color-text-on-primary</code> throughout, as on every band. Worth
                  a check on the darkest part of this gradient before the campaign ships: the
                  heading sits over the pale <code>#DFB083</code> top of the band, which is a
                  much lighter ground than Christmas's green, and near-white on{" "}
                  <code>#DFB083</code> measures about <strong>1.8:1</strong>. The design was
                  handed over this way; it is a design decision to confirm, not a bug in the
                  block.
                </Callout>
                <Callout variant="info">
                  The offer bar is the shared pink with dark ink, same as every other season —{" "}
                  <code>--xpromo-banner-bg</code> and <code>--xpromo-banner-ink</code> override
                  it on the block or any ancestor.
                </Callout>
              </div>
            ),
          },
          {
            title: "Assets",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="warning">
                  The card photography is Christmas's, standing in. The handoff carried{" "}
                  <code>placehold.co</code> boxes, so rather than ship broken images the approved
                  set is used until Thanksgiving's own art lands. Pass <code>cards</code> to swap
                  it — the copy and CTAs are already Thanksgiving's.
                </Callout>
                <Callout variant="info">
                  The pixel strip is the design team's <code>PATTERN.svg</code> — 2849px of art
                  at 95px tall, living at{" "}
                  <code>assets/promo/thanksgiving-pixel-band.svg</code>. It draws at 95px and
                  repeats across whatever width the band is, which is how the handoff has it: at
                  the 1728px design canvas the strip was already a clipped window onto the wider
                  drawing rather than a scaled copy of it, so the motifs stay the same physical
                  size at every screen size. Re-cutting it means writing a new export over that
                  path — nothing in the component reads its contents.
                </Callout>
                <Callout variant="info">
                  At 800KB it is by far the largest asset in the package, so{" "}
                  <code>vite.config.ts</code> emits SVGs over 512KB as files rather than
                  base64-inlining them. Inlined, this one drawing added about 2.3MB of duplicated
                  data URI across the ESM and CJS bundles; as a file it is written once and
                  shared by both.
                </Callout>
              </div>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Independence Day ───────────────────────────────────────────────────── */

function IndependenceSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="Independence Day"
      desc="The 4th of July band. The first season to decorate with corner art instead of a strip along the top — the flag is pinned to the top-left, behind the content."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="Independence Day Promo" code={INDEPENDENCE_USAGE} fullWidth height={1180} contentAlign="start">
        <IndependencePromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="independence" /> },
          {
            title: "Headline",
            content: (
              <Callout variant="info">
                <code>headWidth</code> is 770px here rather than the 611px the other seasons use.
                That is the handoff's own number, and it is what keeps{" "}
                <em>Celebrate Independence Day this July!</em> on one line — at 611px the headline
                breaks in two and the header renders as three lines instead of the design's two.
                It is a per-season value because each headline is a different length.
              </Callout>
            ),
          },
          {
            title: "The flag",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  This is the corner-art slot rather than the strip: one 988×231 drawing pinned to
                  the band's top-left corner, drawn once and never repeated. The strip is switched
                  off for this season — a band can carry either, or both, or neither.
                </Callout>
                <Callout variant="info">
                  It sits <strong>behind</strong> the content. Its box overlaps the centred
                  heading, but the art is a waving flag whose stripes taper away to the right, so
                  the two never actually collide — which is why it is neither clipped nor faded.
                  If a future campaign puts denser art under the heading, that is the point to
                  revisit, not this one.
                </Callout>
                <Callout variant="info">
                  The band already clips its own overflow, so a band narrower than 988px simply
                  shows less of the flag, star field first. The art keeps its natural size at
                  every screen size, the same rule the Thanksgiving strip follows.
                </Callout>
                <Callout variant="warning">
                  What the flag does need is room above the content. The header is centred and
                  the flag is not, so as the band narrows the header slides left towards art that
                  has not moved — around the 1200 grid the eyebrow lands on the flag's lower
                  stripes. <code>bandPadding</code> is therefore <code>240px</code> of top rather
                  than the handoff's 120px, which clears the flag's full 231px at any width
                  instead of only at the 1728px canvas it was drawn on. Below 900px the block
                  clears it from the art's own height, so swapping{" "}
                  <code>cornerArtHeight</code> keeps that correct.
                </Callout>
              </div>
            ),
          },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The ground is a flat navy, <code>#132941</code>, fixed in light and dark alike
                  exactly as the Christmas green is. Ink is{" "}
                  <code>--color-text-on-primary</code> throughout, which measures about{" "}
                  <strong>15:1</strong> against that navy — the most comfortable of the three
                  seasons so far.
                </Callout>
                <Callout variant="info">
                  The offer bar is the shared pink with dark ink, same as every other season —{" "}
                  <code>--xpromo-banner-bg</code> and <code>--xpromo-banner-ink</code> override it
                  on the block or any ancestor.
                </Callout>
              </div>
            ),
          },
          {
            title: "Assets",
            content: (
              <Callout variant="warning">
                The card photography is the approved set the other seasons carry, standing in. The
                handoff carried <code>placehold.co</code> boxes, so rather than ship broken images
                the shared art is used until this campaign's own lands. Pass <code>cards</code> to
                swap it — the copy and CTAs are already Independence Day's.
              </Callout>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Halloween ──────────────────────────────────────────────────────────── */

function HalloweenSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="Halloween"
      desc="The most decorated of the seasons: a parade along the top, and five loose pieces — two bats and three spiders' webs — scattered behind the content. The season the decorations slot was built for."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="Halloween Promo" code={HALLOWEEN_USAGE} fullWidth height={1180} contentAlign="start">
        <HalloweenPromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="halloween" /> },
          {
            title: "The scattered art",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                <Callout variant="info">
                  Five pieces, each with its own size and offsets, drawn behind the content. They
                  are data rather than markup — <code>HALLOWEEN_PROMO_DECORATIONS</code> is
                  exported, the individual files are on{" "}
                  <code>HALLOWEEN_PROMO_ART</code>, and <code>decorations={"{false}"}</code> drops
                  the lot. This is separate from the strip along the top, which is still{" "}
                  <code>pixelBand</code>; a band can carry either, both, or neither.
                </Callout>
                <PropsTable props={[
                  { name: "src",    type: "string",           desc: "The art." },
                  { name: "width",  type: "number | string",  desc: "Natural size. A number is px." },
                  { name: "height", type: "number | string",  desc: "Natural size. A number is px." },
                  { name: "top",    type: "number | string",  desc: "Offset from the band's top edge. A number is px, a string any CSS length." },
                  { name: "right",  type: "number | string",  desc: "Offset from the band's right edge." },
                  { name: "bottom", type: "number | string",  desc: "Offset from the band's bottom edge." },
                  { name: "left",   type: "number | string",  desc: "Offset from the band's left edge." },
                ]} />
                <Callout variant="info">
                  Placement follows the handoff's 1728px canvas with one change: anything on the
                  right-hand side hangs off <code>right</code> rather than <code>left</code>, so
                  it stays in the margin as the band narrows instead of drifting in across the
                  cards.
                </Callout>
                <Callout variant="info">
                  The large bat is the exception, and the reason offsets take strings. It sits in
                  the gap between the band's edge and the centred header — a gap that closes as
                  the band narrows, so a fixed <code>left: 520</code> would walk it into the
                  heading. <code>left: "calc(50% - 344px)"</code> puts it at the handoff's 520px
                  on a 1728px band and moves it back out into the margin as the band shrinks.
                </Callout>
                <Callout variant="warning">
                  Below 900px the scattered pieces are dropped entirely. Their positions come from
                  the desktop canvas, and the stacked layout is a different shape — they would
                  land on the content rather than in the margins around it. The strip is
                  full-width and stays.
                </Callout>
              </div>
            ),
          },
          {
            title: "The strip",
            content: (
              <Callout variant="info">
                Same slot as Christmas and Thanksgiving, positioned differently: this parade runs
                from the very top of the band and sits 3px in, where the others are held 6px
                inside on both counts. <code>pixelBandTop</code> and <code>pixelBandInset</code>{" "}
                carry that, both defaulting to the 6px the earlier seasons use. At 1724×93 it is
                drawn at its natural height and repeats across a band wider than itself.
              </Callout>
            ),
          },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The ground is a near-black <code>#070E17</code>, fixed in light and dark alike.
                  Ink is <code>--color-text-on-primary</code> throughout, which measures about{" "}
                  <strong>18:1</strong> against it — the highest contrast of any season.
                </Callout>
                <Callout variant="info">
                  The webs are drawn in a faint <code>#747795</code> and the bats in near-black,
                  so both read as texture against the ground rather than as content. That is also
                  why they sit behind the cards without any need to fade or clip them.
                </Callout>
              </div>
            ),
          },
          {
            title: "Assets",
            content: (
              <Callout variant="warning">
                The card photography is the approved set the other seasons carry, standing in. The
                handoff carried <code>placehold.co</code> boxes, so rather than ship broken images
                the shared art is used until this campaign's own lands. Pass <code>cards</code> to
                swap it — the copy and CTAs are already Halloween's.
              </Callout>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Valentine's Day ────────────────────────────────────────────────────── */

function ValentinesSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="Valentine's Day"
      desc="A deep red ground and a strip of hearts and roses. The plainest of the seasons to build — by the time it arrived the engine already had everything it needed."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="Valentine's Day Promo" code={VALENTINES_USAGE} fullWidth height={1180} contentAlign="start">
        <ValentinesPromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="valentines" /> },
          {
            title: "Headline",
            content: (
              <Callout variant="info">
                <code>headWidth</code> is 790px, the widest of any season and the handoff's own
                number. <em>Valentine’s Day is just around the corner!</em> is the longest first
                line in the set — at the 611px the shorter headlines use it would break in two and
                the header would render as three lines rather than the design's two.
              </Callout>
            ),
          },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The ground is a deep red <code>#810316</code>, fixed in light and dark alike.
                  Ink is <code>--color-text-on-primary</code> throughout, which measures about{" "}
                  <strong>11:1</strong> against it — comfortable, and the strip carries its own
                  darker outline so it reads against the ground without help.
                </Callout>
                <Callout variant="info">
                  The offer bar is the shared pink with dark ink, same as every other season. It
                  sits closer to this ground than to any other — both are red — so it is worth
                  looking at the seam between band and bar before the campaign ships.{" "}
                  <code>--xpromo-banner-bg</code> overrides it on the block or any ancestor.
                </Callout>
              </div>
            ),
          },
          {
            title: "Assets",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="warning">
                  The card photography is the approved set the other seasons carry, standing in.
                  The handoff carried <code>placehold.co</code> boxes, so rather than ship broken
                  images the shared art is used until this campaign's own lands.
                </Callout>
                <Callout variant="info">
                  The strip is 1716×87 and the second-largest asset in the package at 270KB, after
                  rounding its path coordinates to two decimals — no visible change at 87px tall.
                  It still sits under the 512KB floor at which{" "}
                  <code>vite.config.ts</code> stops base64-inlining SVGs, so it inlines as the
                  other strips do.
                </Callout>
              </div>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── New Year ───────────────────────────────────────────────────────────── */

function NewYearSection() {
  const [run, setRun] = React.useState(0);

  return (
    <DocSection
      title="New Year"
      desc="Fireworks over a deep navy. The art uses the same slot as the other strips but is four times deeper — a field the header sits inside rather than a band along the edge."
      action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
    >
      <Preview title="New Year Promo" code={NEW_YEAR_USAGE} fullWidth height={1180} contentAlign="start">
        <NewYearPromo key={run} />
      </Preview>

      <Acc
        multiple
        items={[
          { title: "Props", content: <SeasonProps season="newyear" /> },
          {
            title: "The fireworks",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  1693×351, which is four times the depth of the Christmas knit and deeper than
                  the band's own 160px of top padding — so the header sits <em>inside</em> the
                  fireworks rather than below them. That needed nothing new:{" "}
                  <code>pixelBand</code> already draws behind the content, and{" "}
                  <code>pixelBandHeight</code> already sized the art.
                </Callout>
                <Callout variant="info">
                  It reads because the fireworks are sparse line work on navy — the headline runs
                  straight through them without losing contrast. That is the opposite of the
                  Independence Day flag, which is opaque across its whole box and had to be
                  cleared with extra top padding. Deep art the content can sit on is the easy
                  case; opaque art is the one that needs room.
                </Callout>
              </div>
            ),
          },
          {
            title: "Theming",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The ground is a deep navy <code>#0C255E</code>, fixed in light and dark alike.
                  Ink is <code>--color-text-on-primary</code> throughout, which measures about{" "}
                  <strong>12:1</strong> against it.
                </Callout>
                <Callout variant="info">
                  The offer bar is the shared pink with dark ink, same as every other season —{" "}
                  <code>--xpromo-banner-bg</code> and <code>--xpromo-banner-ink</code> override it
                  on the block or any ancestor.
                </Callout>
              </div>
            ),
          },
          {
            title: "Assets",
            content: (
              <Callout variant="warning">
                The card photography is the approved set the other seasons carry, standing in. The
                handoff carried <code>placehold.co</code> boxes, so rather than ship broken images
                the shared art is used until this campaign's own lands — as with every other
                season. Pass <code>cards</code> to swap it.
              </Callout>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Shared behaviour ───────────────────────────────────────────────────── */

/* Grid, sizing and motion are properties of the engine, not of a season, so
   they are stated once here rather than repeated under every band. */
function BehaviourSection() {
  return (
    <DocSection
      title="How the bands behave"
      desc="Grid, sizing and motion come from PromoBand, the engine every season is a preset of, so these apply to all of them equally."
    >
      <Acc
        multiple
        items={[
          {
            title: "Grid",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="warning">
                  These blocks sit on the design system grid, so the host page must import it:
                  <br />
                  <code>@import "@heartstampxo/design-system/tokens.css";</code>
                  <br />
                  <code>@import "@heartstampxo/design-system/grid.css";</code>
                  <br />
                  Both, not just the grid — <code>tokens.css</code> carries the media query that
                  restates <code>--grid-max-width</code> as 1400px at 2000px and up. With only
                  the grid imported the var() fallbacks hold it at 1200px, so the wide tier
                  silently never arrives rather than visibly breaking.
                </Callout>
                <Callout variant="info">
                  The track is <code>min(--grid-max-width, 100%)</code> with{" "}
                  <code>--grid-margin</code> as inside padding — the grid's own contract, where
                  the max-width is the OUTER measure. Content lands at 1168px on the 1200px tier
                  and lines up with <code>.hs-page-grid</code> exactly. To retune one block, set{" "}
                  <code>--hs-track-max</code> or <code>--hs-track-margin</code> on it rather than
                  redefining the grid tokens, which retunes every consumer in the subtree and,
                  pinned to a number, severs the wide tier.
                </Callout>
              </div>
            ),
          },
          {
            title: "Sizing",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  Layout is driven by <code>container-type: inline-size</code>, so the cards
                  stack and the feature grid drops to one column below{" "}
                  <strong>900px of the block's own width</strong> — not the viewport's. That is
                  why the phone and tablet buttons on each preview reflow it properly, and why it
                  behaves correctly in a narrow page column rather than only on a narrow screen.
                </Callout>
                <Callout variant="info">
                  Width is <code>min(--hs-track-max, 100%)</code>, where{" "}
                  <code>--hs-track-max</code> falls back to <code>--grid-max-width</code> and
                  then to 1200px, so a band can never overflow its container. Set{" "}
                  <code>--hs-track-max</code> and <code>--hs-track-margin</code> on the block or
                  an ancestor to line it up with a host page's own column — in preference to
                  redefining the grid tokens themselves.
                </Callout>
              </div>
            ),
          },
          {
            title: "Motion",
            content: (
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                <Callout variant="info">
                  The header, the cards and the features are each a stagger group. Their children
                  start 56px low at zero opacity and rise over 950ms on{" "}
                  <code>cubic-bezier(0.22, 1, 0.36, 1)</code>, one 130ms behind the last, each
                  starting slightly lower again so a row reads as a diagonal cascade. These are
                  the marketing site's own numbers, so a block dropped beside its other sections
                  moves in step. A group taller than 85% of the viewport — the stacked phone
                  layout — drops the stagger and reveals each card as it arrives, since otherwise
                  the run would finish before you scrolled to it. Changing <code>cards</code> or{" "}
                  <code>features</code> re-arms the cascade, so swapped content animates rather
                  than appearing pre-revealed.
                </Callout>
                <Callout variant="info">
                  Under <code>prefers-reduced-motion: reduce</code> the cascade never arms and the
                  block renders finished, rather than hidden and waiting.{" "}
                  <code>{"reveal={false}"}</code> switches it off for everyone.
                </Callout>
              </div>
            ),
          },
          {
            title: "Building another season",
            content: (
              <Callout variant="info">
                Each band is a preset of <code>PromoBand</code>, which ships the structure and no
                content. A new season is one file in <code>blocks/</code> that sets{" "}
                <code>heading</code>, <code>cards</code>, <code>banner</code>,{" "}
                <code>ground</code>, <code>pixelBand</code> and <code>pixelBandHeight</code> as
                its defaults. Decoration comes in three shapes and a season picks what it
                needs: <code>pixelBand</code> for a strip along the top,{" "}
                <code>cornerArt</code> for one drawing pinned to a corner, and{" "}
                <code>decorations</code> for loose pieces scattered behind the content. The six
                seasons differ in nothing else. The six product callouts are shared from one
                place, so they stay in step across every band rather than drifting.
              </Callout>
            ),
          },
        ]}
      />
    </DocSection>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────── */

export function PagePromoBlocks() {
  return (
    <DocPage
      title="Promo Blocks"
      subtitle="The seasonal campaign bands, together — whole marketing sections shipped assembled, each with its heading, promo cards, feature callouts and offer bar. They are Blocks rather than components: compositions you drop in, as opposed to the parts they are built from."
    >
      <ChristmasSection />
      <ThanksgivingSection />
      <IndependenceSection />
      <HalloweenSection />
      <ValentinesSection />
      <NewYearSection />
      <BehaviourSection />
    </DocPage>
  );
}
