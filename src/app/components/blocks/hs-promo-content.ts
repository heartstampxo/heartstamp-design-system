import type { PromoBandFeature } from "./hs-promo-band";

import card1 from "../../../assets/promo/card-1.webp";
import card2 from "../../../assets/promo/card-2.webp";
import card3 from "../../../assets/promo/card-3.webp";
import iconPrinting from "../../../assets/promo/icon-printing.webp";
import iconSprite from "../../../assets/promo/icons-sprite.webp";
import iconDigital from "../../../assets/promo/icon-digital.webp";
import iconBulkCards from "../../../assets/promo/icon-bulk-cards.webp";
import iconCustomEnvelope from "../../../assets/promo/icon-custom-envelope.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   PROMO CONTENT — what every season shares.

   The six callouts below are HeartStamp's product features, not a holiday's:
   the printing, the paper, the serial number. They are the same list on the
   Christmas band and the Thanksgiving one, so they live here rather than
   being restated per season and drifting apart. Each season re-exports them
   under its own name, so the published `CHRISTMAS_PROMO_FEATURES` and its
   Thanksgiving counterpart both keep resolving.

   The card images are shared for the same reason — the Thanksgiving handoff
   carried placeholder art, so it uses the approved set until its own lands.
   ═══════════════════════════════════════════════════════════════════════════ */

export const PROMO_CARD_IMAGES = { card1, card2, card3 } as const;

/* The packaged icons are percentage-positioned crops of larger sources. Those
   percentages are ratios of (image size − box size), so they are resolution
   independent — but they are also why these ship as `art` rather than `icon`. */
export const PROMO_FEATURES: PromoBandFeature[] = [
  {
    title: "Printing",
    desc: "Experience premium printing techniques like letterpress & foil-press",
    art: { left: "8px", top: "5.334px", width: "46.09px", height: "53.333px", background: `url("${iconPrinting}") 58.811% 45.597% / 161.850% 134.830% no-repeat` },
  },
  {
    title: "Premium paper",
    desc: "We craft our stationery from the best paper stock",
    art: { left: "5.333px", top: "5.334px", width: "50.901px", height: "53.333px", background: `url("${iconSprite}") 35.695% 34.249% / 639.706% 317.193% no-repeat` },
  },
  {
    title: "Digital",
    desc: "Book a 1:1 appointment with our concierge for free support",
    art: { left: "1px", top: "5px", width: "61px", height: "53px", background: `url("${iconDigital}") 0 0 / 100% 100% no-repeat` },
  },
  {
    title: "One of one.",
    desc: "Each card has a unique serial number, yours is one of a kind.",
    art: { left: "5.333px", top: "5.334px", width: "53.512px", height: "53.333px", background: `url("${iconSprite}") 89.660% 35.479% / 581.940% 303.356% no-repeat` },
  },
  {
    title: "Bulk cards, delivered for you.",
    desc: "One order, many cards. We mail each one for you.",
    art: { left: "8px", top: "5.334px", width: "48.155px", height: "53.333px", background: `url("${iconBulkCards}") 0 0 / 100% 100% no-repeat` },
  },
  {
    title: "Custom Envelope",
    desc: "Add personal notes, add your return address, recipient address, everything is customizable",
    art: { left: "5.334px", top: "5.334px", width: "53.512px", height: "53.333px", background: `url("${iconCustomEnvelope}") 0 0 / 100% 100% no-repeat` },
  },
];
