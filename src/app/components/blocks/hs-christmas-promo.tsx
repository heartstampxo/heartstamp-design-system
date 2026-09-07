import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type { PromoBandCard, PromoBandFeature, PromoBandBanner, PromoBandProps } from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import bandTile from "../../../assets/promo/xmas-pixel-band-tile.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   CHRISTMAS PROMO — the "Christmas in July" marketing band.

   Lifted from the approved homepage build, where it was a design-canvas
   export: one tree of inline styles whose responsive behaviour lived in the
   page's own stylesheet rather than in the section. Three things had to come
   with it and did not travel in the markup — the mobile rules, the
   `hs-ul-draw` underline keyframes, and the assets — so the layout was
   restated as a real stylesheet and the block made self-contained.

   That stylesheet and the markup now live in hs-promo-band.tsx, because
   Thanksgiving turned out to be this band with a different ground and a
   different strip. What is left here is the Christmas dressing: its copy,
   its green, its knitted strip, and the props set to them.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased so the Christmas names that
   shipped in the published package keep resolving. */
export type ChristmasPromoCard = PromoBandCard;
export type ChristmasPromoFeature = PromoBandFeature;
export type ChristmasPromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — shared with every other season. */
export const CHRISTMAS_PROMO_FEATURES: ChristmasPromoFeature[] = PROMO_FEATURES;

export const CHRISTMAS_PROMO_CARDS: ChristmasPromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "No need to wait for the holidays, design your cards now using the photos already on your phone.", cta: "Shop All Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "No need to wait for the holidays, design your cards now using the photos already on your phone.", cta: "Shop All Holiday Cards", href: "#" },
];

export const CHRISTMAS_PROMO_BANNER: ChristmasPromoBanner = {
  label: "Christmas in July: 50% off holiday cards, printed and posted for you",
};

/** The pixel-knit strip that runs along the top of the band. */
export const CHRISTMAS_PROMO_PIXEL_BAND = bandTile;

/** Height of that strip, in px. */
export const CHRISTMAS_PROMO_PIXEL_BAND_HEIGHT = 63;

/** The band's fixed festive ground. */
export const CHRISTMAS_PROMO_GROUND = "rgb(14, 51, 30)";

/** Vertical padding on the band, as the approved build had it. */
export const CHRISTMAS_PROMO_BAND_PADDING = "140px 0 96px";

export interface ChristmasPromoProps extends PromoBandProps {}

/**
 * The "Christmas in July" promotional band: header, promo cards, feature
 * callouts and an offer bar.
 *
 * Rendered bare — `<ChristmasPromo />` — it is the approved seasonal block,
 * pixel for pixel. Every part of it is a prop, so the same component covers
 * the next Christmas campaign: pass `cards`, `features`, `heading` and
 * `ground` to re-dress it, or `false` to any section to drop it. It fills the
 * width it is given and stacks below 900px of its own width.
 */
export function ChristmasPromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = CHRISTMAS_PROMO_CARDS,
  features = CHRISTMAS_PROMO_FEATURES,
  banner = CHRISTMAS_PROMO_BANNER,
  ground = CHRISTMAS_PROMO_GROUND,
  pixelBand = CHRISTMAS_PROMO_PIXEL_BAND,
  pixelBandHeight = CHRISTMAS_PROMO_PIXEL_BAND_HEIGHT,
  bandPadding = CHRISTMAS_PROMO_BAND_PADDING,
  ...rest
}: ChristmasPromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        It’s Christmas in July!
        <br />
        Get a super early jumpstart.
      </>
    ) : (
      heading
    );

  return (
    <PromoBand
      eyebrow={eyebrow}
      heading={headingNode}
      cards={cards}
      features={features}
      banner={banner}
      ground={ground}
      pixelBand={pixelBand}
      pixelBandHeight={pixelBandHeight}
      bandPadding={bandPadding}
      {...rest}
    />
  );
}
