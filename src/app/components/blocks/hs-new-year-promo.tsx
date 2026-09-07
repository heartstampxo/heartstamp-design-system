import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type { PromoBandCard, PromoBandFeature, PromoBandBanner, PromoBandProps } from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import topBand from "../../../assets/promo/new-year-top-band.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   NEW YEAR PROMO — the seasonal band, dressed for midnight.

   The last of the six, and another preset: a deep navy ground and one piece of
   art along the top. What is different is the shape of that art — at 1693x351
   the fireworks are not a strip along the edge but a field the header sits
   inside, four times deeper than the Christmas knit.

   It needs no special handling for that. The strip already draws behind the
   content, and fireworks are sparse line work on navy, so the headline reads
   straight through them — the opposite of the Independence Day flag, which was
   opaque and had to be cleared. Deep art that the content can sit on is the
   easy case; this is what the slot does anyway.

   The card art came through as placehold.co boxes, so the approved
   photography is used — the same three images the other seasons carry.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased for symmetry with the other
   seasons so a consumer can name the type they are building. */
export type NewYearPromoCard = PromoBandCard;
export type NewYearPromoFeature = PromoBandFeature;
export type NewYearPromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — the same list every season carries. */
export const NEW_YEAR_PROMO_FEATURES: NewYearPromoFeature[] = PROMO_FEATURES;

export const NEW_YEAR_PROMO_CARDS: NewYearPromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
];

export const NEW_YEAR_PROMO_BANNER: NewYearPromoBanner = {
  label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
};

/** The fireworks across the top of the band. */
export const NEW_YEAR_PROMO_TOP_BAND = topBand;

/**
 * Height of that art, in px. Much deeper than the other seasons' strips — the
 * header sits inside the fireworks rather than below them.
 */
export const NEW_YEAR_PROMO_TOP_BAND_HEIGHT = 351;

/** The band's ground — a deep navy, fixed in light and dark alike. */
export const NEW_YEAR_PROMO_GROUND = "#0C255E";

/** Vertical padding on the band, as the handoff has it. */
export const NEW_YEAR_PROMO_BAND_PADDING = "160px 0 68px";

export interface NewYearPromoProps extends PromoBandProps {}

/**
 * The New Year promotional band: header, promo cards, feature callouts and an
 * offer bar, with fireworks across the top.
 *
 * Rendered bare — `<NewYearPromo />` — it is the approved seasonal block.
 * Every part of it is a prop, so the same component covers the next New Year
 * campaign: pass `cards`, `features`, `heading` and `ground` to re-dress it,
 * or `false` to any section to drop it. It fills the width it is given and
 * stacks below 900px of its own width.
 */
export function NewYearPromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = NEW_YEAR_PROMO_CARDS,
  features = NEW_YEAR_PROMO_FEATURES,
  banner = NEW_YEAR_PROMO_BANNER,
  ground = NEW_YEAR_PROMO_GROUND,
  pixelBand = NEW_YEAR_PROMO_TOP_BAND,
  pixelBandHeight = NEW_YEAR_PROMO_TOP_BAND_HEIGHT,
  /* The fireworks start at the very top of the band, as Valentine's and
     Halloween's art does. */
  pixelBandTop = 0,
  bandPadding = NEW_YEAR_PROMO_BAND_PADDING,
  ...rest
}: NewYearPromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        Celebrate the New Year in style!
        <br />
        Kick off the festivities early.
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
      pixelBandTop={pixelBandTop}
      bandPadding={bandPadding}
      {...rest}
    />
  );
}
