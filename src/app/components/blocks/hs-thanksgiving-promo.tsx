import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type { PromoBandCard, PromoBandFeature, PromoBandBanner, PromoBandProps } from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import bandStrip from "../../../assets/promo/thanksgiving-pixel-band.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   THANKSGIVING PROMO — the seasonal band, dressed for Thanksgiving.

   Structurally this is the Christmas band: same header, same three cards,
   same six callouts, same offer bar. The handoff differs in exactly two
   places — the ground is a gradient rather than a flat colour, and the strip
   along the top is a different, taller piece of pixel art — so this file is
   the dressing and hs-promo-band.tsx does the work.

   The strip is the design team's own PATTERN.svg: 2849px of pixel art at 95px
   tall. It draws at that height and repeats across whatever width the band
   is, which is how the handoff has it — at the 1728px design canvas the strip
   was already a clipped window onto the wider drawing, not a scaled copy of
   it. Re-cutting it means writing a new export over
   assets/promo/thanksgiving-pixel-band.svg; nothing here reads its contents.

   One thing still outstanding: the card art came through as placehold.co
   boxes, so the approved Christmas photography is used until Thanksgiving's
   own lands. Pass `cards` to swap it without touching anything else.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased for symmetry with the other
   seasons so a consumer can name the type they are building. */
export type ThanksgivingPromoCard = PromoBandCard;
export type ThanksgivingPromoFeature = PromoBandFeature;
export type ThanksgivingPromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — the same list the other seasons carry. */
export const THANKSGIVING_PROMO_FEATURES: ThanksgivingPromoFeature[] = PROMO_FEATURES;

export const THANKSGIVING_PROMO_CARDS: ThanksgivingPromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
];

export const THANKSGIVING_PROMO_BANNER: ThanksgivingPromoBanner = {
  label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
};

/** The pixel strip that runs along the top of the band. */
export const THANKSGIVING_PROMO_PIXEL_BAND = bandStrip;

/** Height of that strip, in px — taller than the Christmas knit's 63. */
export const THANKSGIVING_PROMO_PIXEL_BAND_HEIGHT = 95;

/**
 * The band's ground: a vertical gradient rather than Christmas's flat green.
 * Any CSS background value works here, which is why no change to the engine
 * was needed to carry it.
 */
export const THANKSGIVING_PROMO_GROUND = "linear-gradient(180deg, #DFB083 0%, #E87000 100%)";

/** Vertical padding on the band, as the handoff has it — the taller strip
    wants more room above the eyebrow than Christmas's does. */
export const THANKSGIVING_PROMO_BAND_PADDING = "160px 0 68px";

export interface ThanksgivingPromoProps extends PromoBandProps {}

/**
 * The Thanksgiving promotional band: header, promo cards, feature callouts
 * and an offer bar.
 *
 * Rendered bare — `<ThanksgivingPromo />` — it is the approved seasonal
 * block. Every part of it is a prop, so the same component covers the next
 * Thanksgiving campaign: pass `cards`, `features`, `heading` and `ground` to
 * re-dress it, or `false` to any section to drop it. It fills the width it is
 * given and stacks below 900px of its own width.
 */
export function ThanksgivingPromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = THANKSGIVING_PROMO_CARDS,
  features = THANKSGIVING_PROMO_FEATURES,
  banner = THANKSGIVING_PROMO_BANNER,
  ground = THANKSGIVING_PROMO_GROUND,
  pixelBand = THANKSGIVING_PROMO_PIXEL_BAND,
  pixelBandHeight = THANKSGIVING_PROMO_PIXEL_BAND_HEIGHT,
  bandPadding = THANKSGIVING_PROMO_BAND_PADDING,
  ...rest
}: ThanksgivingPromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        Thanksgiving is here!
        <br />
        Start your holiday preparations early.
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
