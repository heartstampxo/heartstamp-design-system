import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type { PromoBandCard, PromoBandFeature, PromoBandBanner, PromoBandProps } from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import topBand from "../../../assets/promo/valentines-top-band.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   VALENTINE'S DAY PROMO — the seasonal band, dressed for February.

   The plainest of the seasons to build, which is the point: by the time it
   arrived the engine already had everything it needed. A deep red ground, a
   strip of hearts and roses along the top, and a headline wide enough to hold
   its first line — nothing here that Christmas, Thanksgiving, Independence
   Day and Halloween had not already asked for between them.

   The card art came through as placehold.co boxes, so the approved
   photography is used — the same three images the other seasons carry.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased for symmetry with the other
   seasons so a consumer can name the type they are building. */
export type ValentinesPromoCard = PromoBandCard;
export type ValentinesPromoFeature = PromoBandFeature;
export type ValentinesPromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — the same list every season carries. */
export const VALENTINES_PROMO_FEATURES: ValentinesPromoFeature[] = PROMO_FEATURES;

export const VALENTINES_PROMO_CARDS: ValentinesPromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
];

export const VALENTINES_PROMO_BANNER: ValentinesPromoBanner = {
  label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
};

/** The strip of hearts and roses along the top of the band. */
export const VALENTINES_PROMO_TOP_BAND = topBand;
export const VALENTINES_PROMO_TOP_BAND_HEIGHT = 87;

/** The band's ground — a deep red, fixed in light and dark alike. */
export const VALENTINES_PROMO_GROUND = "#810316";

/** Vertical padding on the band, as the handoff has it. */
export const VALENTINES_PROMO_BAND_PADDING = "160px 0 68px";

/**
 * The measure the heading wraps at. 790px is the handoff's own number, sized
 * to hold "Valentine's Day is just around the corner!" on one line — the
 * longest headline of any season, and well past the 611px the shorter ones
 * use.
 */
export const VALENTINES_PROMO_HEAD_WIDTH = 790;

export interface ValentinesPromoProps extends PromoBandProps {}

/**
 * The Valentine's Day promotional band: header, promo cards, feature callouts
 * and an offer bar, under a strip of hearts and roses.
 *
 * Rendered bare — `<ValentinesPromo />` — it is the approved seasonal block.
 * Every part of it is a prop, so the same component covers the next
 * Valentine's campaign: pass `cards`, `features`, `heading` and `ground` to
 * re-dress it, or `false` to any section to drop it. It fills the width it is
 * given and stacks below 900px of its own width.
 */
export function ValentinesPromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = VALENTINES_PROMO_CARDS,
  features = VALENTINES_PROMO_FEATURES,
  banner = VALENTINES_PROMO_BANNER,
  ground = VALENTINES_PROMO_GROUND,
  headWidth = VALENTINES_PROMO_HEAD_WIDTH,
  pixelBand = VALENTINES_PROMO_TOP_BAND,
  pixelBandHeight = VALENTINES_PROMO_TOP_BAND_HEIGHT,
  /* This strip runs from the very top of the band, held 6px in on each side
     as the Christmas and Thanksgiving strips are. */
  pixelBandTop = 0,
  bandPadding = VALENTINES_PROMO_BAND_PADDING,
  ...rest
}: ValentinesPromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        Valentine’s Day is just around the corner!
        <br />
        Start planning your perfect celebration.
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
      headWidth={headWidth}
      pixelBand={pixelBand}
      pixelBandHeight={pixelBandHeight}
      pixelBandTop={pixelBandTop}
      bandPadding={bandPadding}
      {...rest}
    />
  );
}
