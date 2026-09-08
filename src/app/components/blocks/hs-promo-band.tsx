import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";
import { safeHref, backgroundImage } from "../ui/hs-url";

/* ═══════════════════════════════════════════════════════════════════════════
   PROMO BAND — the seasonal marketing band, without a season.

   This is the shape every promo block shares: a pixel-art strip along the top,
   a header, a row of promo cards, a grid of feature callouts, and an offer bar
   under the band. Christmas was the first one built and this engine was lifted
   out of it unchanged when Thanksgiving arrived, because the two differ only
   in their ground, their strip and their copy — not in their structure.

   Nothing here is seasonal. It ships no content, no colours beyond a fallback
   and no art; a season is a thin wrapper that supplies those as defaults (see
   hs-christmas-promo.tsx and hs-thanksgiving-promo.tsx). Reach for PromoBand
   directly only for a campaign that is not one of the packaged seasons.

   Sizing is by CONTAINER, not viewport. The docs Preview sets a width on a
   plain wrapper rather than an iframe, so a `@media` query would report the
   browser window and render the desktop layout inside the 390px phone
   preview. `container-type: inline-size` on the root makes the block respond
   to whatever box it is dropped into, which is also the honest behaviour for
   a section that can sit inside any page column.
   ═══════════════════════════════════════════════════════════════════════════ */

/* ── Content model ─────────────────────────────────────────────────────────
   Everything the band renders is data, so a season can take the approved set,
   take one field off it, or replace it wholesale without forking anything. */

export interface PromoBandCard {
  /** Image URL. Rendered 200px tall, cropped to fill. */
  src: string;
  /** Alt text. Falls back to the title. Pass "" for a decorative image. */
  alt?: string;
  title: string;
  desc: string;
  /** Link text. Omit to render the card without a link. */
  cta?: string;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface PromoBandFeature {
  title: string;
  desc: string;
  /** Icon URL, drawn to fit the 64px box. */
  icon?: string;
  /**
   * Escape hatch for art that is a crop of a larger sheet — which is what the
   * packaged icons are. Any CSS for the inner box; wins over `icon`.
   */
  art?: React.CSSProperties;
}

/**
 * One piece of scattered art — a bat, a spider's web — placed against the
 * band's own box. Give it whichever pair of edges it should hang from:
 * `right` rather than `left` for anything on the right-hand side, so it stays
 * in the margin as the band narrows instead of drifting across the content.
 */
export interface PromoBandDecoration {
  src: string;
  /** Natural size of the art. A number is px. */
  width: number | string;
  height: number | string;
  /**
   * Offsets from the band's edges. A number is px, and a string is any CSS
   * length — `calc(50% - 344px)` for a piece that should hold its place
   * beside the centred header as the band resizes, rather than sitting at a
   * fixed distance from an edge the header is moving away from.
   */
  top?: number | string;
  right?: number | string;
  bottom?: number | string;
  left?: number | string;
}

export interface PromoBandBanner {
  label: string;
  /**
   * What to do when the line is wider than the bar. Left alone it is measured:
   * a line that fits is centred, one that does not scrolls. `false` never
   * scrolls and lets a long line wrap instead. Scrolling is skipped under
   * `prefers-reduced-motion` whatever this says, and the line wraps there.
   * @default measured
   */
  marquee?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Hide the trailing chevron. @default false */
  hideChevron?: boolean;
}

const PROMO_CSS = `
.hs-xpromo {
  container-type: inline-size;
  /* Inline-size containment means this element's width is resolved WITHOUT
     measuring its contents. A block-level parent hands it a width anyway, but
     as a flex or grid item — which is what the docs preview canvas makes it —
     'width: auto' would have nothing left to resolve against and collapse the
     whole band to zero. Always take the full width of whatever we are in. */
  width: 100%;
  box-sizing: border-box;
  background: var(--color-bg-main);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Overridable by the props, and by a consumer's own stylesheet. Each
     season's wrapper passes its own; this is only the fallback. */
  --xpromo-ground: rgb(14, 51, 30);
  /* The offer bar keeps a brand pink in both themes (#f5bdc2 / #eb7a85), so
     its ink must stay dark in both. Deriving it from --color-text-primary is
     what left near-white text on pink in dark mode. */
  --xpromo-banner-bg: var(--color-brand-lockup-heart);
  --xpromo-banner-ink: #242423;
  --xpromo-feature-columns: 2;
}
.hs-xpromo__band {
  position: relative;
  align-self: stretch;
  box-sizing: border-box;
  /* Padding arrives as a custom property rather than an inline style. Inline
     wins over every stylesheet rule regardless of specificity, so a season
     passing bandPadding used to defeat the container queries at the bottom of
     this file and keep its desktop padding all the way down to a phone. */
  padding: var(--xpromo-band-padding, 140px 0 96px);
  /* The band is a fixed festive ground, not a themed surface: it stays the
     season's colour in light and dark alike, which is why the ink below is
     pinned to the on-primary token rather than the page's text colour. */
  background: var(--xpromo-ground);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 56px;
}
.hs-xpromo__pixels {
  position: absolute;
  /* The inset and the top offset are per-season: Christmas and Thanksgiving
     hold their strip 6px inside the band, Halloween's runs from the very top
     and sits 3px in. */
  left: var(--xpromo-pixel-inset, 6px);
  right: var(--xpromo-pixel-inset, 6px);
  top: var(--xpromo-pixel-top, 6px);
  /* Height is a variable because the strip is per-season art: the Christmas
     knit is 63px, the Thanksgiving one 95px. The image itself arrives as an
     inline background-image from the pixelBand prop, so nothing is baked in
     here and a band with no art simply draws nothing. */
  height: var(--xpromo-pixel-height, 63px);
  background-position: top left;
  background-size: auto var(--xpromo-pixel-height, 63px);
  /* The strip is a tile, not a full-width image — the Christmas knit is 904px
     against a band that is usually wider, so it repeats across. */
  background-repeat: repeat-x;
  pointer-events: none;
}
/* Corner art is the other shape a season's decoration comes in: one fixed
   drawing pinned to a corner of the band rather than a strip running its
   width. Independence Day's flag is 988x231 of waving flag whose art tapers
   away to the right, so the heading clears it even though their boxes
   overlap — which is why this sits behind the content and is not clipped.
   The band already has overflow:hidden, so a band narrower than the art
   simply shows less of it. */
.hs-xpromo__corner {
  position: absolute;
  left: 0;
  top: 0;
  width: var(--xpromo-corner-width, 988px);
  height: var(--xpromo-corner-height, 231px);
  background-position: top left;
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}
/* Scattered art: each piece is placed and sized from its own data rather than
   from this rule, which only says how such a piece behaves. */
.hs-xpromo__deco {
  position: absolute;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  pointer-events: none;
}
.hs-xpromo__inner,
.hs-xpromo__features {
  position: relative;
  /* The design system grid track. Its contract: --grid-max-width is the OUTER
     width and --grid-margin is subtracted from inside it, so content lands at
     1168px on the 1200px tier and lines up with .hs-page-grid — and the wide
     tier follows automatically, because tokens.css restates --grid-max-width
     as 1400px at >= 2000px. Retune one block with --hs-track-max /
     --hs-track-margin rather than redefining the grid tokens, which would
     retune every consumer in the subtree and, if pinned to a number, sever
     the wide tier. */
  width: min(var(--hs-track-max, var(--grid-max-width, 1200px)), 100%);
  margin-inline: auto;
  padding-inline: var(--hs-track-margin, var(--grid-margin, 16px));
  box-sizing: border-box;
}
.hs-xpromo__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-12);
}
.hs-xpromo__head {
  /* The measure the heading wraps at, which is a per-season number: each
     headline is a different length and the handoff sets a width to suit it.
     611px is Christmas's, and stays the fallback. */
  width: var(--xpromo-head-width, 611px);
  max-width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
}
.hs-xpromo__eyebrow {
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: 16px;
  line-height: 100%;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-on-primary);
  white-space: nowrap;
}
.hs-xpromo__title {
  margin: 0;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-h2);
  line-height: 1.1;
  letter-spacing: -0.03em;
  text-align: center;
  color: var(--color-text-on-primary);
}
.hs-xpromo__cards {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
  align-items: flex-start;
}
.hs-xpromo__card {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}
.hs-xpromo__card-img {
  align-self: stretch;
  height: 200px;
  object-fit: cover;
  display: block;
}
.hs-xpromo__card-body {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}
.hs-xpromo__card-text {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: flex-start;
}
.hs-xpromo__card-title {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: 21px;
  line-height: 1.2;
  color: var(--color-text-on-primary);
}
.hs-xpromo__card-desc {
  align-self: stretch;
  font-family: var(--font-family-body);
  font-weight: 500;
  font-size: 16px;
  line-height: 24px;
  color: color-mix(in srgb, var(--color-text-on-primary) 72%, transparent);
}
/* The rule is painted as a background so it can be animated; text-decoration
   cannot be. It wipes out to the right, flips sides, then draws back in.
   flex-start rather than stretch so the rule is the width of the words, not
   of the column — the animation reads as underlining the link itself. */
.hs-xpromo__link {
  align-self: flex-start;
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: var(--font-size-body-13);
  line-height: 20px;
  color: var(--color-text-on-primary);
  text-decoration: none;
  padding-bottom: 3px;
  /* Was --color-bg-main, which is the PAGE ground: near-white in light mode
     so it happened to read, and near-black in dark, where the rule vanished
     into the green. The band ink is what actually sits on this ground. */
  background-image: linear-gradient(var(--color-text-on-primary), var(--color-text-on-primary));
  background-repeat: no-repeat;
  background-size: 100% 1.5px;
  background-position: 0 100%;
}
.hs-xpromo__link:hover {
  animation: hs-ul-draw 0.72s cubic-bezier(0.33, 0, 0.15, 1) both;
}
@keyframes hs-ul-draw {
  0%   { background-size: 100% 1.5px; background-position: 100% 100%; }
  42%  { background-size: 0% 1.5px;   background-position: 100% 100%; }
  43%  { background-size: 0% 1.5px;   background-position: 0 100%; }
  100% { background-size: 100% 1.5px; background-position: 0 100%; }
}
.hs-xpromo__features {
  display: grid;
  grid-template-columns: repeat(var(--xpromo-feature-columns), minmax(0, 1fr));
  column-gap: var(--space-6);
  row-gap: 0;
}
.hs-xpromo__feature {
  box-sizing: border-box;
  padding: var(--space-3) 0;
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  align-items: center;
}
.hs-xpromo__ficon {
  position: relative;
  width: 64px;
  height: 64px;
  flex: none;
}
.hs-xpromo__ficon > span { position: absolute; display: block; }
/* A consumer passing a plain icon prop gets the whole box, contained — no
   crop geometry to work out. The packaged icons use art and skip this. */
.hs-xpromo__ficon > span[data-plain] {
  inset: 0;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.hs-xpromo__ftext {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  align-items: flex-start;
  flex: 1;
  min-width: 0;
}
.hs-xpromo__ftitle {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h4);
  line-height: 100%;
  color: var(--color-text-on-primary);
}
.hs-xpromo__fdesc {
  align-self: stretch;
  font-family: var(--font-family-body);
  font-weight: 500;
  font-size: 16px;
  line-height: 1.5;
  color: color-mix(in srgb, var(--color-text-on-primary) 80%, transparent);
}
.hs-xpromo__cta {
  align-self: stretch;
  height: 52px;
  box-sizing: border-box;
  background: var(--xpromo-banner-bg);
  display: flex;
  flex-direction: row;
  gap: 5px;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border: 0;
  width: 100%;
  text-align: center;
  font: inherit;
}
.hs-xpromo__cta { text-decoration: none; color: var(--xpromo-banner-ink); }
/* The window the offer line runs through. It shrinks below its content, which
   is what lets a line too long for the bar scroll instead of wrapping; without
   min-width:0 a flex item refuses to go under its content width. */
.hs-xpromo__cta-vp {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  display: block;
}
.hs-xpromo__cta-track {
  display: inline-flex;
  align-items: center;
  gap: var(--xpromo-marquee-gap, 48px);
}
.hs-xpromo__cta-text {
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h5);
  line-height: 28px;
  text-transform: uppercase;
  color: var(--xpromo-banner-ink);
  white-space: nowrap;
}
.hs-xpromo__cta svg { display: block; flex: none; }

/* ── The offer line, when it does not fit ──────────────────────────────────
   A line too long for the bar used to wrap to two or three rows, which grew
   the bar and broke its 52px band. It now runs as a marquee instead: the line
   is duplicated and the pair translated by exactly one copy plus the gap, so
   the loop closes on itself with no jump.

   Distance and duration are measured and written back by the component, not
   guessed here — the duration is derived from the distance at a fixed speed,
   so a long offer takes longer rather than scrolling faster. */
.hs-xpromo__cta[data-marquee] .hs-xpromo__cta-track {
  animation: hs-xpromo-marquee var(--xpromo-marquee-dur, 18s) linear infinite;
  will-change: transform;
}
@keyframes hs-xpromo-marquee {
  from { transform: translateX(0); }
  to   { transform: translateX(calc(-1 * var(--xpromo-marquee-dist, 0px))); }
}
/* Hovering holds it still, so a line can be read rather than chased. */
.hs-xpromo__cta[data-marquee]:hover .hs-xpromo__cta-track,
.hs-xpromo__cta[data-marquee]:focus-visible .hs-xpromo__cta-track {
  animation-play-state: paused;
}
/* Under reduced motion nothing scrolls, so the line has to wrap to stay
   readable — a clipped offer is worse than a taller bar. The component sets
   this state instead of the marquee when the preference is on. */
.hs-xpromo__cta[data-wrap] { height: auto; min-height: 52px; padding-block: var(--space-2); }
.hs-xpromo__cta[data-wrap] .hs-xpromo__cta-vp { overflow: visible; }
.hs-xpromo__cta[data-wrap] .hs-xpromo__cta-text { white-space: normal; }

/* ── Below the desktop track ──────────────────────────────────────────────
   The source band had no layout of its own under 768px: the page only
   narrowed the container and tightened the gap, which left three cards and a
   two-column feature grid to share a phone screen. Stacking both is new. */
@container (max-width: 900px) {
  .hs-xpromo__band { --xpromo-band-padding: 96px 0 64px; gap: var(--space-10); }
  .hs-xpromo__cards { flex-direction: column; gap: var(--space-8); }
  .hs-xpromo__card-img { height: 220px; }
  .hs-xpromo__features { grid-template-columns: minmax(0, 1fr); }
  .hs-xpromo__inner { gap: var(--space-10); }
}
@container (max-width: 560px) {
  .hs-xpromo__band { --xpromo-band-padding: 84px 0 48px; }
  /* The eyebrow is set nowrap so it never breaks mid-phrase; at this width
     it no longer fits one line of the phone, so let it wrap. */
  .hs-xpromo__eyebrow { white-space: normal; text-align: center; }
  .hs-xpromo__cta { padding-inline: var(--space-4); }
}
/* Below the desktop track the padding above drops to 96px and then 84px of
   top, which is less than corner art is tall — so a band carrying corner art
   clears it explicitly rather than letting the header land on it. Derived from
   the art's own height, so it stays right if the art is swapped. */
@container (max-width: 900px) {
  /* Scattered art is placed from the desktop canvas's own coordinates, and
     those do not survive the stacked layout — the band becomes a different
     shape entirely, so the pieces would land on the content rather than in
     the margins around it. The strip is full-width and stays. */
  .hs-xpromo__deco { display: none; }
  .hs-xpromo--corner .hs-xpromo__band {
    padding-top: calc(var(--xpromo-corner-height, 231px) + var(--space-6));
  }
}
@media (prefers-reduced-motion: reduce) {
  .hs-xpromo__link:hover { animation: none; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-xpromo > * {
    --font-size-h1: var(--font-size-h1-sm, 34px);
    --line-height-h1: var(--line-height-h1-sm, 1.15);
    --font-size-h2: var(--font-size-h2-sm, 28px);
    --line-height-h2: var(--line-height-h2-sm, 1.2);
    --font-size-h3: var(--font-size-h3-sm, 24px);
    --line-height-h3: var(--line-height-h3-sm, 1.25);
    --font-size-h4: var(--font-size-h4-sm, 18px);
    --font-size-h5: var(--font-size-h5-sm, 16px);
    --font-size-subheadline: var(--font-size-subheadline-sm, 20px);
    --font-size-subheadline-md: var(--font-size-subheadline-sm, 20px);
  }
}
`;

const PROMO_CSS_MIN = cssMin(PROMO_CSS);

/** How fast the offer line travels when it has to scroll, in px per second. */
const MARQUEE_SPEED = 60;
/** The breathing space between the line and its repeat. Matches the CSS. */
const MARQUEE_GAP = 48;

/**
 * Decide what the offer bar does with a line that is wider than the bar.
 *
 * Three outcomes, and which one applies is a measurement rather than a
 * breakpoint: a short offer on a phone still fits, and a long one can overflow
 * a desktop bar. `none` leaves it centred on one line, `marquee` scrolls it,
 * and `wrap` lets it run to several rows, which is the reduced-motion answer
 * since nothing is allowed to move.
 *
 * The travel distance is one copy of the line plus the gap, which is what
 * makes the loop close on itself, and the duration comes from that distance at
 * a fixed speed so a longer offer takes longer instead of racing past.
 */
function useOfferFit(
  ref: React.RefObject<HTMLElement | null>,
  deps: React.DependencyList,
  enabled: boolean | undefined,
): "none" | "marquee" | "wrap" {
  const [fit, setFit] = React.useState<"none" | "marquee" | "wrap">("none");

  React.useEffect(() => {
    const root = ref.current;
    if (!root || typeof ResizeObserver === "undefined") return;

    const measure = () => {
      const vp = root.querySelector<HTMLElement>(".hs-xpromo__cta-vp");
      const line = root.querySelector<HTMLElement>(".hs-xpromo__cta-text");
      if (!vp || !line) return;

      /* scrollWidth is the line's natural width and is unaffected by the
         transform the marquee may already be running. */
      const need = line.scrollWidth;
      const have = vp.clientWidth;

      if (enabled === false || need <= have + 1) { setFit("none"); return; }
      if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setFit("wrap"); return; }

      const dist = need + MARQUEE_GAP;
      root.style.setProperty("--xpromo-marquee-dist", `${dist}px`);
      root.style.setProperty("--xpromo-marquee-dur", `${(dist / MARQUEE_SPEED).toFixed(2)}s`);
      setFit("marquee");
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled, ...deps]);

  return fit;
}

export interface PromoBandProps {
  /** Small uppercase line above the heading. `false` removes it. */
  eyebrow?: React.ReactNode | false;
  /**
   * The heading. Takes nodes, so line breaks are yours to place. `false`
   * removes it — with `eyebrow` false too, the whole header goes.
   */
  heading?: React.ReactNode | false;
  /** The promo cards. `false` removes the row. */
  cards?: PromoBandCard[] | false;
  /** The feature callouts. `false` removes the grid. */
  features?: PromoBandFeature[] | false;
  /** Columns for the feature grid. Collapses to 1 below 900px regardless. @default 2 */
  featureColumns?: number;
  /**
   * The measure the heading wraps at, in px. Per-season, because each
   * headline is a different length. Capped at 100% of the band, so a narrow
   * band still fits. @default 611
   */
  headWidth?: number;
  /**
   * The offer bar under the band. `false` removes it entirely — no bar, no
   * gap. Give it an `href` to render an anchor, otherwise it is a button.
   */
  banner?: PromoBandBanner | false;
  /** The band's ground. Any CSS background value, so gradients work. */
  ground?: string;
  /** The pixel-art strip along the top. `false` removes it. */
  pixelBand?: string | false;
  /**
   * Height of that strip, in px. The art is drawn at this height and its width
   * scales with it, so this is how a taller season's strip is fitted.
   * @default 63
   */
  pixelBandHeight?: number;
  /** Inset of the strip from the band's left and right edges, in px. @default 6 */
  pixelBandInset?: number;
  /** Offset of the strip from the band's top edge, in px. @default 6 */
  pixelBandTop?: number;
  /**
   * Loose art scattered across the band, behind the content — bats, spiders'
   * webs. Each piece carries its own size and offsets. Dropped below 900px,
   * where the stacked layout makes the desktop placements meaningless.
   */
  decorations?: PromoBandDecoration[] | false;
  /**
   * A fixed drawing pinned to the band's top-left corner, behind the content
   * — the other shape a season's decoration takes. `false` removes it.
   */
  cornerArt?: string | false;
  /** Width of that drawing, in px. @default 988 */
  cornerArtWidth?: number;
  /** Height of that drawing, in px. @default 231 */
  cornerArtHeight?: number;
  /** Vertical padding on the band, e.g. "96px 0 64px". */
  bandPadding?: string;
  /**
   * Fade-and-rise the header, cards and features in as they scroll into view,
   * matching the marketing site's cascade. Ignored under reduced motion.
   * @default true
   */
  reveal?: boolean;
  /** Convenience for `banner.onClick`, kept for a season's default banner. */
  onCtaClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

const CHEVRON = (
  <svg width="24" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

/**
 * The seasonal promotional band: header, promo cards, feature callouts and an
 * offer bar.
 *
 * This is the engine, not a block you drop on a page — it ships no content and
 * no season. Render `<ChristmasPromo />` or `<ThanksgivingPromo />` for the
 * approved bands, and reach for this only when dressing a campaign that is not
 * one of them. It fills the width it is given and stacks below 900px of its
 * own width.
 */
export function PromoBand({
  eyebrow,
  heading,
  cards,
  features,
  featureColumns = 2,
  headWidth,
  banner,
  ground,
  pixelBand,
  pixelBandHeight,
  pixelBandInset,
  pixelBandTop,
  decorations,
  cornerArt,
  cornerArtWidth,
  cornerArtHeight,
  bandPadding,
  reveal = true,
  onCtaClick,
  className,
  style,
}: PromoBandProps) {
  useInjectedStyle("hs-xpromo", PROMO_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  /* Re-arm the cascade when the content itself changes, not just on mount —
     otherwise swapping the cards leaves the new ones stuck at opacity 0. */
  useRevealCascade(rootRef, reveal, [cards, features, eyebrow, heading]);

  const hasHeader = eyebrow !== false || (heading !== false && heading != null);
  const hasCorner = cornerArt !== false && cornerArt != null;

  /* The offer bar measures its own line, so the decision follows the content
     and the width rather than a breakpoint. Re-measured when the label
     changes, since a new offer is a new width. */
  const ctaRef = React.useRef<HTMLElement>(null);
  const bannerLabel = banner !== false && banner != null ? banner.label : null;
  const bannerMarquee = banner !== false && banner != null ? banner.marquee : undefined;
  const offerFit = useOfferFit(ctaRef, [bannerLabel], bannerMarquee);

  const rootStyle: React.CSSProperties = {
    ...(ground ? ({ "--xpromo-ground": ground } as React.CSSProperties) : null),
    ...(pixelBandHeight ? ({ "--xpromo-pixel-height": `${pixelBandHeight}px` } as React.CSSProperties) : null),
    ...(pixelBandInset != null ? ({ "--xpromo-pixel-inset": `${pixelBandInset}px` } as React.CSSProperties) : null),
    ...(pixelBandTop != null ? ({ "--xpromo-pixel-top": `${pixelBandTop}px` } as React.CSSProperties) : null),
    ...(headWidth ? ({ "--xpromo-head-width": `${headWidth}px` } as React.CSSProperties) : null),
    ...(cornerArtWidth ? ({ "--xpromo-corner-width": `${cornerArtWidth}px` } as React.CSSProperties) : null),
    ...(cornerArtHeight ? ({ "--xpromo-corner-height": `${cornerArtHeight}px` } as React.CSSProperties) : null),
    ...({ "--xpromo-feature-columns": featureColumns } as React.CSSProperties),
    ...style,
  };

  return (
    <div
      ref={rootRef}
      className={["hs-xpromo", hasCorner && "hs-xpromo--corner", className].filter(Boolean).join(" ")}
      style={rootStyle}
    >
      <div
        className="hs-xpromo__band"
        style={bandPadding ? ({ "--xpromo-band-padding": bandPadding } as React.CSSProperties) : undefined}
      >
        {pixelBand !== false && pixelBand != null && (
          <div className="hs-xpromo__pixels" aria-hidden="true" style={backgroundImage(pixelBand)} />
        )}

        {/* Ahead of the header and the features in DOM order, both of which are
            position:relative, so the content paints over the art rather than
            under it. */}
        {decorations !== false && decorations != null && decorations.map((d, i) => (
          <div
            key={i}
            className="hs-xpromo__deco"
            aria-hidden="true"
            style={{
              width: d.width,
              height: d.height,
              ...(d.top != null ? { top: d.top } : null),
              ...(d.right != null ? { right: d.right } : null),
              ...(d.bottom != null ? { bottom: d.bottom } : null),
              ...(d.left != null ? { left: d.left } : null),
              ...backgroundImage(d.src),
            }}
          />
        ))}

        {hasCorner && (
          <div className="hs-xpromo__corner" aria-hidden="true" style={backgroundImage(cornerArt)} />
        )}

        {(hasHeader || (cards !== false && cards != null)) && (
          <div className="hs-xpromo__inner">
            {hasHeader && (
              <div className="hs-xpromo__head" data-reveal-stagger>
                {eyebrow !== false && eyebrow != null && <span className="hs-xpromo__eyebrow">{eyebrow}</span>}
                {heading !== false && heading != null && <h2 className="hs-xpromo__title">{heading}</h2>}
              </div>
            )}

            {cards !== false && cards != null && cards.length > 0 && (
              <div className="hs-xpromo__cards" data-reveal-stagger>
                {cards.map((card, i) => (
                  <div className="hs-xpromo__card" key={i}>
                    <img className="hs-xpromo__card-img" src={card.src} alt={card.alt ?? card.title} />
                    <div className="hs-xpromo__card-body">
                      <div className="hs-xpromo__card-text">
                        <span className="hs-xpromo__card-title">{card.title}</span>
                        <span className="hs-xpromo__card-desc">{card.desc}</span>
                      </div>
                      {card.cta && (
                        <a className="hs-xpromo__link" href={safeHref(card.href)} onClick={card.onClick}>
                          {card.cta}
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {features !== false && features != null && features.length > 0 && (
          <div className="hs-xpromo__features" data-reveal-stagger>
            {features.map((f, i) => (
              <div className="hs-xpromo__feature" key={i}>
                <div className="hs-xpromo__ficon" aria-hidden="true">
                  <span
                    {...(f.art ? {} : { "data-plain": "" })}
                    style={f.art ?? backgroundImage(f.icon)}
                  />
                </div>
                <div className="hs-xpromo__ftext">
                  <span className="hs-xpromo__ftitle">{f.title}</span>
                  <span className="hs-xpromo__fdesc">{f.desc}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {banner !== false && banner != null &&
        (() => {
          /* The chevron sits outside the scrolling window, so it stays put
             while the line travels. The repeat is what closes the loop, and it
             is hidden from assistive tech so the offer is announced once. */
          const contents = (
            <>
              <span className="hs-xpromo__cta-vp">
                <span className="hs-xpromo__cta-track">
                  <span className="hs-xpromo__cta-text">{banner.label}</span>
                  {offerFit === "marquee" && (
                    <span className="hs-xpromo__cta-text" aria-hidden="true">{banner.label}</span>
                  )}
                </span>
              </span>
              {!banner.hideChevron && CHEVRON}
            </>
          );
          const state =
            offerFit === "marquee" ? { "data-marquee": "" }
            : offerFit === "wrap" ? { "data-wrap": "" }
            : {};

          return banner.href ? (
            <a
              ref={ctaRef as React.RefObject<HTMLAnchorElement>}
              className="hs-xpromo__cta"
              href={safeHref(banner.href)}
              onClick={banner.onClick ?? onCtaClick}
              {...state}
            >
              {contents}
            </a>
          ) : (
            <button
              ref={ctaRef as React.RefObject<HTMLButtonElement>}
              type="button"
              className="hs-xpromo__cta"
              onClick={banner.onClick ?? onCtaClick}
              {...state}
            >
              {contents}
            </button>
          );
        })()}
    </div>
  );
}
