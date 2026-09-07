import * as React from "react";
import { PromoBand } from "./hs-promo-band";
import type {
  PromoBandCard,
  PromoBandFeature,
  PromoBandBanner,
  PromoBandDecoration,
  PromoBandProps,
} from "./hs-promo-band";
import { PROMO_FEATURES, PROMO_CARD_IMAGES } from "./hs-promo-content";

import topBanner from "../../../assets/promo/halloween/top-banner.svg?url";
import batLarge from "../../../assets/promo/halloween/bat-large.svg?url";
import batSmall from "../../../assets/promo/halloween/bat-small.svg?url";
import web115 from "../../../assets/promo/halloween/web-115.svg?url";
import web157 from "../../../assets/promo/halloween/web-157.svg?url";
import web163 from "../../../assets/promo/halloween/web-163.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   HALLOWEEN PROMO — the seasonal band, dressed for October.

   The most decorated of the seasons: a strip along the top like Christmas and
   Thanksgiving, and then five loose pieces — two bats and three spiders' webs
   — scattered across the band behind the content. That scattering is the
   `decorations` slot, and this is the season it was built for.

   Placement follows the handoff's 1728px canvas, with one change of anchor
   per piece: anything on the right-hand side hangs off `right` rather than
   `left`, so it stays in the margin as the band narrows instead of drifting
   in across the cards. The large bat is the exception and the interesting
   one — it sits in the gap between the band's edge and the centred header,
   and that gap closes as the band narrows, so a fixed offset would walk it
   into the heading. It holds its place relative to the centre instead.

   The card art came through as placehold.co boxes, so the approved
   photography is used — the same three images the other seasons carry.
   ═══════════════════════════════════════════════════════════════════════════ */

/* The item types are the band's own, aliased for symmetry with the other
   seasons so a consumer can name the type they are building. */
export type HalloweenPromoCard = PromoBandCard;
export type HalloweenPromoFeature = PromoBandFeature;
export type HalloweenPromoBanner = PromoBandBanner;

/** HeartStamp's product callouts — the same list every season carries. */
export const HALLOWEEN_PROMO_FEATURES: HalloweenPromoFeature[] = PROMO_FEATURES;

export const HALLOWEEN_PROMO_CARDS: HalloweenPromoCard[] = [
  { src: PROMO_CARD_IMAGES.card1, title: "Free Address Collector", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Get Started", href: "#" },
  { src: PROMO_CARD_IMAGES.card2, title: "Holiday Cards", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
  { src: PROMO_CARD_IMAGES.card3, title: "Free Dedicated Designer", desc: "Missing addresses? Just text or email, and your Shutterfly address book updates automatically.", cta: "Shop Holiday Cards", href: "#" },
];

export const HALLOWEEN_PROMO_BANNER: HalloweenPromoBanner = {
  label: "New to HeartStamp? Get 30% off your first card order with code NC30CARD",
};

/** The parade of pumpkins, ghosts and bats along the top of the band. */
export const HALLOWEEN_PROMO_TOP_BANNER = topBanner;
export const HALLOWEEN_PROMO_TOP_BANNER_HEIGHT = 93;

/** The individual pieces, exported so a campaign can rescatter them. */
export const HALLOWEEN_PROMO_ART = {
  batLarge,
  batSmall,
  webSmall: web115,
  webMedium: web157,
  webLarge: web163,
} as const;

/**
 * The loose art, placed as the handoff has it on a 1728px canvas.
 *
 * The large bat holds its place beside the centred header — `calc(50% - 344px)`
 * puts it at the handoff's 520px when the band is 1728 wide, and walks it back
 * out into the margin as the band narrows, which a fixed 520px would not. The
 * rest hang off whichever edge they are nearest, so they stay in the margins.
 */
export const HALLOWEEN_PROMO_DECORATIONS: PromoBandDecoration[] = [
  { src: batLarge, width: 88,  height: 87,  top: 197, left: "calc(50% - 344px)" },
  { src: web163,   width: 163, height: 163, top: 604, left: 98 },
  { src: web115,   width: 115, height: 115, top: 604, right: 57 },
  { src: batSmall, width: 57,  height: 50,  top: 573, right: 235 },
  { src: web157,   width: 157, height: 157, top: 835, right: 125 },
];

/** The band's ground — near-black, fixed in light and dark alike. */
export const HALLOWEEN_PROMO_GROUND = "#070E17";

/** Vertical padding on the band, as the handoff has it. */
export const HALLOWEEN_PROMO_BAND_PADDING = "160px 0 68px";

export interface HalloweenPromoProps extends PromoBandProps {}

/**
 * The Halloween promotional band: header, promo cards, feature callouts and
 * an offer bar, under a parade of pumpkins and ghosts, with bats and webs
 * scattered behind the content.
 *
 * Rendered bare — `<HalloweenPromo />` — it is the approved seasonal block.
 * Every part of it is a prop, so the same component covers the next Halloween
 * campaign: pass `cards`, `features`, `heading` and `ground` to re-dress it,
 * `decorations` to rescatter the loose art, or `false` to any section to drop
 * it. It fills the width it is given and stacks below 900px of its own width,
 * where the scattered art is dropped and the strip stays.
 */
export function HalloweenPromo({
  eyebrow = "For the real holiday lovers",
  heading,
  cards = HALLOWEEN_PROMO_CARDS,
  features = HALLOWEEN_PROMO_FEATURES,
  banner = HALLOWEEN_PROMO_BANNER,
  ground = HALLOWEEN_PROMO_GROUND,
  pixelBand = HALLOWEEN_PROMO_TOP_BANNER,
  pixelBandHeight = HALLOWEEN_PROMO_TOP_BANNER_HEIGHT,
  /* This strip runs from the very top of the band and sits 3px in, where the
     Christmas and Thanksgiving strips are held 6px inside on both counts. */
  pixelBandTop = 0,
  pixelBandInset = 3,
  decorations = HALLOWEEN_PROMO_DECORATIONS,
  bandPadding = HALLOWEEN_PROMO_BAND_PADDING,
  ...rest
}: HalloweenPromoProps) {
  /* `heading` is the one prop that cannot default in the signature: `false`
     has to remove it, and `undefined` has to mean "the approved headline",
     which a default parameter cannot distinguish once it has fired. */
  const headingNode =
    heading === undefined ? (
      <>
        It’s Halloween in October!
        <br />
        Get a spooky head start.
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
      pixelBandInset={pixelBandInset}
      decorations={decorations}
      bandPadding={bandPadding}
      {...rest}
    />
  );
}
