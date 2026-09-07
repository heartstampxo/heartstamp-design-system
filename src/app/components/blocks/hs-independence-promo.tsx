import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type { PromoBandCard, PromoBandFeature, PromoBandBanner, PromoBandProps } from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import flag from "../../../assets/promo/independence-flag.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   INDEPENDENCE DAY PROMO — the seasonal band, dressed for the 4th of July.

   Same band as the other seasons underneath. Two things are its own: the
   ground is a flat navy, and the decoration is a corner drawing rather than a
   strip running the width of the band — the first season to use that slot.

   The flag is 988x231 pinned to the top-left, behind the content, neither
   clipped nor faded. What it does need is room: the header is centred and the
   flag is not, so as the band narrows the header slides left towards art that
   has not moved, and around the 1200 grid the eyebrow lands on the flag's
   lower stripes. The band's top padding therefore clears the flag's full
   height rather than using the 120px the handoff drew at 1728px, where the
   two happened to be far enough apart. Below 900px the engine clears it too,
   from the art's own height.

   The card art came through as placehold.co boxes, so the approved
   photography is used — the same three images the other seasons carry. Pass
   `cards` to swap it without touching anything else.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased for symmetry with the other
   seasons so a consumer can name the type they are building. */
export type IndependencePromoCard = PromoBandCard;
export type IndependencePromoFeature = PromoBandFeature;
export type IndependencePromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — the same list every season carries. */
export const INDEPENDENCE_PROMO_FEATURES: IndependencePromoFeature[] = PROMO_FEATURES;

export const INDEPENDENCE_PROMO_CARDS: IndependencePromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
];

export const INDEPENDENCE_PROMO_BANNER: IndependencePromoBanner = {
  label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
};

/** The waving flag pinned to the band's top-left corner. */
export const INDEPENDENCE_PROMO_FLAG = flag;

/** The flag's natural size, in px. */
export const INDEPENDENCE_PROMO_FLAG_WIDTH = 988;
export const INDEPENDENCE_PROMO_FLAG_HEIGHT = 231;

/** The band's ground — a flat navy, fixed in light and dark alike. */
export const INDEPENDENCE_PROMO_GROUND = "#132941";

/**
 * Vertical padding on the band.
 *
 * The handoff's own number was 120px of top, which works at the 1728px canvas
 * it was drawn on: the header is centred, the flag is pinned left, and at that
 * width the two are far enough apart. They are not at narrower widths — the
 * centred header moves left as the band narrows while the flag stays put, so
 * around the 1200 grid the eyebrow lands on the flag's lower stripes.
 *
 * 240px clears the flag's full 231px height with 9px of air under it, at any
 * width — the only version of this that does not depend on how wide the band
 * happens to be. It is deliberately close to the art now: 9px is the whole
 * margin, so a taller flag needs this raised with it.
 */
export const INDEPENDENCE_PROMO_BAND_PADDING = "240px 0 68px";

/**
 * The measure the heading wraps at. 770px is the handoff's own number and it
 * is what keeps "Celebrate Independence Day this July!" on one line — at
 * Christmas's narrower 611px that headline breaks in two and the header
 * renders as three lines rather than the two the design has.
 */
export const INDEPENDENCE_PROMO_HEAD_WIDTH = 770;

export interface IndependencePromoProps extends PromoBandProps {}

/**
 * The Independence Day promotional band: header, promo cards, feature
 * callouts and an offer bar, with the flag in the top-left corner.
 *
 * Rendered bare — `<IndependencePromo />` — it is the approved seasonal
 * block. Every part of it is a prop, so the same component covers the next
 * 4th of July campaign: pass `cards`, `features`, `heading` and `ground` to
 * re-dress it, or `false` to any section to drop it. It fills the width it is
 * given and stacks below 900px of its own width.
 */
export function IndependencePromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = INDEPENDENCE_PROMO_CARDS,
  features = INDEPENDENCE_PROMO_FEATURES,
  banner = INDEPENDENCE_PROMO_BANNER,
  ground = INDEPENDENCE_PROMO_GROUND,
  headWidth = INDEPENDENCE_PROMO_HEAD_WIDTH,
  /* No strip along the top on this one — the flag is the whole decoration. */
  pixelBand = false,
  cornerArt = INDEPENDENCE_PROMO_FLAG,
  cornerArtWidth = INDEPENDENCE_PROMO_FLAG_WIDTH,
  cornerArtHeight = INDEPENDENCE_PROMO_FLAG_HEIGHT,
  bandPadding = INDEPENDENCE_PROMO_BAND_PADDING,
  ...rest
}: IndependencePromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        Celebrate Independence Day this July!
        <br />
        Join us for a festive kickoff.
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
      cornerArt={cornerArt}
      cornerArtWidth={cornerArtWidth}
      cornerArtHeight={cornerArtHeight}
      bandPadding={bandPadding}
      {...rest}
    />
  );
}
