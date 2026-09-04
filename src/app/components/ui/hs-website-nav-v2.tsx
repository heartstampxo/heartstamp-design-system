// ═══════════════════════════════════════════════════════════════════════════
// WebsiteNavV2 — next-generation website navigation. TESTING PHASE.
//
// Direct port of the approved standalone ("HeartStamp Top Nav", Claude
// design), which is itself token-based. Figma source: cards / node 72-1459.
//
// One component covers both layouts. Callers mount WebsiteNavV2 and nothing
// else; it measures its own box and swaps bars at `breakpoint` (768px), or
// obeys `mobile` when the layout is forced.
//
//   Desktop
//     Row 1 (68px): brand lockup · search pill with rotating typewriter
//       placeholder, blinking caret and ⌘K chip · Get the App · Reminders ·
//       language / notifications / cart icon buttons · avatar
//     Row 2 (48px): category links (hover = brand red, aria-current is the
//       mega-panel hook) · Ask Stampy AI chip with twin sheen sweeps
//   Compact (56px): 112px lockup · search / reminders / language /
//     notifications / cart icon cluster. Everything else drops.
//
// Deviations from the standalone, all deliberate:
//   - the layout switch measures the nav's own width rather than the
//     viewport, so it also collapses inside a narrow frame on a wide screen
//     (docs previews, device frames), which a media query cannot see;
//   - the content track uses --grid-max-width (1200px, 1400px wide tier)
//     instead of a fixed 1200px, and gets the grid's 16px margins so the
//     bar still breathes below 1200px viewports. --nav-track-max and
//     --nav-track-margin override that track for a page whose own grid is
//     measured differently, without touching the grid tokens themselves;
//     see the note on .hs-nav-v2 in NAV_CSS;
//   - the logo renders through HSLogo instead of a baked-in image.
//
// The current WebsiteNav (hs-website-nav.tsx) remains the production
// component until this one graduates.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Search, Globe, ShoppingCart, CalendarCheck, Check, ListFilter } from "lucide-react";
import { HSLogo } from "./hs-logo";
import { cssMin, useInjectedStyle } from "./hs-style-inject";
import { Kbd } from "./hs-kbd";
import { Avt } from "./hs-avt";
import { Btn } from "./btn";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle } from "./sheet";
import { Notification, type NotificationItem } from "./hs-notifications";
import { MEGA_MENUS, type MegaMenu } from "./hs-mega-menu-data";
import stampyBtnGraphic from "../../../assets/stampy/stampy-btn-graphic.svg?url";

/* ── Static data (from the standalone) ─────────────────────────────────── */

export const WEBSITE_NAV_V2_CATEGORIES = [
  "Bday", "Congrats", "Thank you", "Cards for Kids", "Anniversary", "Wedding",
  "Thinking of you", "Baby", "New Home", "Graduation", "Retirement",
];

export interface NavLanguage {
  /** Stable value reported by onLanguageChange. */
  value: string;
  label: string;
  /** Flag emoji shown ahead of the label. */
  flag: string;
}

export const WEBSITE_NAV_V2_LANGUAGES: NavLanguage[] = [
  { value: "English", label: "English", flag: "🇬🇧" },
  { value: "Spanish", label: "Spanish", flag: "🇪🇸" },
  { value: "French",  label: "French",  flag: "🇫🇷" },
];

const SEARCH_LINES = [
  "I'm looking for a birthday card for my son who's turning 10.",
  "I need graduation greeting cards for my daughter — she just finished med school.",
  "Something for my wife for our 25th anniversary. Make it sweet.",
  "A baby shower card for my sister. She's having a girl.",
  "A get-well card for my grandma who's in hospital.",
  "Something funny for my best mate turning 40.",
  "A thank-you card for the nurse who looked after my dad.",
  "A card for my parents' ruby wedding anniversary.",
  "Something cheeky for my boyfriend on Valentine's Day.",
  "A congratulations card — my brother just landed his dream job.",
  "A new-home card for my daughter and her partner.",
  "An 'I'm sorry' card for a friend I let down.",
  "A christening card for my godson.",
  "A retirement card for my boss after 30 years.",
  "Just a 'thinking of you' card for my mum, no occasion.",
];

/* Production typewriter timings from the standalone. */
const TIMING = { type: 55, erase: 26, hold: 1700, gap: 420 };

/* Reminders sheet measurements. Component values from the spec, not design
   system tokens (the handoff lists them under component measurements, and
   there is no token at 456px or for a ground one step off page white).
   They are literals rather than CSS custom properties because the sheet
   portals outside .hs-nav-v2, where nav-scoped properties do not resolve. */
const REM_SHEET_W = "456px";
const REM_SHEET_BG = "#f9f9f9";

/* Mega panel: the grace period before a pointer leaving the row closes the
   drop, and the dataset shown before any category has been hovered. */
const MEGA_CLOSE_DELAY = 140;
const MEGA_FALLBACK = "Bday";

/* Own-property lookup. These maps are keyed by category label and the docs
   tell consumers to feed them from the CMS, so a label of "__proto__",
   "constructor" or "toString" would otherwise resolve to an inherited member
   of Object, test truthy, slip past the ?? fallback and throw on .filters. */
function ownProp<T>(map: Record<string, T> | undefined, key: string): T | undefined {
  return map && Object.prototype.hasOwnProperty.call(map, key) ? map[key] : undefined;
}

/* ── Typewriter hook (standalone timings, reduced-motion aware) ────────── */

function useNavTypewriter(lines: string[], fallback: string): string {
  const [text, setText] = useState(fallback);
  /* Read lines through a ref (same pattern as useTypewriter) so an inline
     array prop does not restart the animation on every render. */
  const linesRef = useRef(lines);
  useEffect(() => { linesRef.current = lines; }, [lines]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setText(fallback);
      return;
    }
    let li = 0, ci = 0, dir = 1;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      const line = linesRef.current[li % linesRef.current.length];
      ci += dir;
      setText(line.slice(0, ci));
      let wait = dir > 0 ? TIMING.type : TIMING.erase;
      if (dir > 0 && ci >= line.length) { dir = -1; wait = TIMING.hold; }
      else if (dir < 0 && ci <= 0) { dir = 1; li = (li + 1) % linesRef.current.length; wait = TIMING.gap; }
      timer = setTimeout(tick, wait);
    };
    timer = setTimeout(tick, 900);
    return () => clearTimeout(timer);
  }, [fallback]);

  return text;
}

/* ── Scroll auto-hide ──────────────────────────────────────────────────
   Mirrors initNavAutoHide in the handoff: the bar slides away on a
   downward scroll and comes back on an upward one. MIN_DELTA ignores
   scroll jitter, and AFTER_PX keeps the bar put near the top of the page
   so it never flickers away on the first flick. The nav may live inside a
   scrolling frame (a docs preview, a device frame) rather than the
   document, so the listener attaches to the nearest scrolling ancestor. */

const AUTO_HIDE_MIN_DELTA = 6;
const AUTO_HIDE_AFTER_PX = 90;

function useNavAutoHide(ref: React.RefObject<HTMLElement | null>, enabled: boolean) {
  useEffect(() => {
    const root = ref.current;
    if (!root || !enabled) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    let box: HTMLElement | null = null;
    for (let n = root.parentElement; n; n = n.parentElement) {
      const oy = getComputedStyle(n).overflowY;
      if ((oy === "auto" || oy === "scroll") && n.scrollHeight > n.clientHeight) { box = n; break; }
    }

    /* Seed from the current offset, not 0. This effect re-runs whenever
       auto-hide is re-enabled (a surface closing, the layout switching), and
       from 0 the next scroll anywhere below the fold reads as a large
       downward delta, hiding the bar on an upward flick. Browser scroll
       restoration on mount has the same effect. */
    let last = box ? box.scrollTop : (window.scrollY || document.documentElement.scrollTop || 0);
    const onScroll = () => {
      const y = box ? box.scrollTop : (window.scrollY || document.documentElement.scrollTop || 0);
      const d = y - last;
      if (Math.abs(d) < AUTO_HIDE_MIN_DELTA) return;
      if (d > 0 && y > AUTO_HIDE_AFTER_PX) root.setAttribute("data-hidden", "");
      else root.removeAttribute("data-hidden");
      last = y;
    };

    const target: HTMLElement | Window = box ?? window;
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      target.removeEventListener("scroll", onScroll);
      root.removeAttribute("data-hidden");
    };
  }, [ref, enabled]);
}

/* ── Apple company mark (glyph from the standalone) ────────────────────── */

function AppleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ flex: "none", marginTop: -2 /* optical: centers the fruit against the label */ }} aria-hidden="true">
      <path d="M17.05 12.536c-.026-2.606 2.128-3.854 2.225-3.917-1.211-1.771-3.096-2.014-3.767-2.042-1.604-.163-3.131.944-3.945.944-.813 0-2.069-.92-3.4-.895-1.75.026-3.362 1.017-4.262 2.583-1.816 3.15-.464 7.816 1.306 10.373.865 1.252 1.897 2.657 3.252 2.607 1.305-.052 1.797-.844 3.375-.844 1.578 0 2.021.844 3.401.818 1.404-.026 2.293-1.274 3.152-2.531.993-1.452 1.402-2.858 1.426-2.93-.031-.014-2.736-1.05-2.763-4.166zM14.44 4.9c.72-.87 1.204-2.08 1.072-3.285-1.036.042-2.29.69-3.033 1.559-.667.77-1.25 2.001-1.093 3.182 1.155.09 2.334-.587 3.054-1.456z" />
    </svg>
  );
}

/* ── Styles — ported verbatim from the standalone (token-based) ────────── */

const NAV_CSS = `
:where(.hs-nav-v2 button, .hs-nav-v2 a) { font: inherit; color: inherit; text-decoration: none; }
/* background/padding/margin are part of the reset, not decoration. Without
   them a bare button keeps the UA's ButtonFace grey and its 1px 6px padding,
   which paints a grey chip behind every mega-menu filter and item and pushes
   their labels 6px right of the column heading they should align under. The
   docs app hid that for a long time because Tailwind's preflight already
   zeroes all three; a consumer without a preflight sees it immediately. Keep
   this in step with the same reset in hs-notifications.tsx. :where() keeps the
   whole thing at zero specificity, so every rule below that does want a
   background or padding still wins on its own. */
:where(.hs-nav-v2 button) {
  appearance: none;
  border: 0;
  background: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.hs-nav-v2 :focus-visible { outline: 2px solid var(--color-brand-primary); outline-offset: 2px; }

.hs-nav-v2 {
  /* Content track. Both rows and the mega panel ride
       width: min(--nav-track-max, 100%); padding: 0 --nav-track-margin
     and both properties fall through to the marketing grid tokens when the
     consumer leaves them alone, so the bar picks up the 1400px wide tier at
     >= 2000px on its own. The grid's contract is that --grid-max-width is the
     OUTER width of the track and --grid-margin is subtracted from inside it,
     so content comes out at max-width - 2 x margin (1168px at the 1200px
     tier). That matches .hs-page-grid exactly.

     A page whose own grid measures 1200px to the CONTENT box instead will be
     32px wider than the bar, which reads as a 16px inset per side and quietly
     scrolls the last category out of the strip. To align them, set
     --nav-track-margin to 0px on the nav or on any ancestor (and
     --nav-track-max as well, if that page's narrow tier differs too).

     NB the example above is written in prose rather than as a declaration on
     purpose: the token-policy test in components.test.tsx scans this file for
     "--name:" to find declared properties and does not skip comments, so a
     worked example here would register as a definition and mask a genuinely
     undefined reference.

     They are deliberately NOT declared here. An unset property lets a value
     inherited from an ancestor win; declaring defaults on .hs-nav-v2 would
     beat the ancestor, since the nav is the descendant, and the override would
     silently do nothing. Prefer these over redefining --grid-max-width or
     --grid-margin, which retunes every grid consumer in the subtree and, if
     --grid-max-width is pinned to a number, severs the wide tier. */

  /* Nav-specific measurements from the spec (no global tokens at these
     values). z-index: the standalone says 9200 for a bare marketing page;
     40 keeps the nav below app-level overlays in composed layouts. */
  --nav-row-h: 68px;
  --nav-links-h: 48px;
  --nav-z: 40;
  /* Compact phone bar. --nav-m-h is read by the notification sheet
     (--notif-m-top) so the sheet always starts flush under this bar. */
  --nav-m-h: 56px;
  --nav-m-logo-w: 112px;
  --nav-m-btn: 36px;
  /* Language dropdown */
  --lang-w: 167px;
  --lang-top: 44px;
  --lang-item-h: 40px;
  /* Mega menu panel. The open height is a FIXED number, not auto: the panel
     animates height, so a taller dataset scrolls rather than growing the drop.
     --mega-rail-w doubles as the offset of the hairline divider, so the two
     must stay in sync. */
  --mega-panel-h: 372px;
  --mega-rail-w: 150px;
  --mega-col-gap: 64px;
  --mega-pad-top: 28px;
  --mega-pad-bottom: 40px;
  --mega-promo-w: 242px;
  --mega-promo-h: 288px;
  --mega-link-ink: rgb(10, 10, 10);
  --mega-item-ink: #4a4a48;
  --mega-rule: rgba(36, 36, 35, 0.08);
  /* The reminders sheet's own measurements are NOT declared here: it portals
     outside this element, where these custom properties would not resolve.
     See REM_SHEET_W / REM_SHEET_BG. */
  position: sticky;
  top: 0;
  z-index: var(--nav-z);
  background: var(--color-bg-main);
  border-bottom: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--font-family-body);
  color: var(--color-text-primary);
  transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-nav-v2--static { position: static; }
/* Scroll auto-hide, phone only, driven by the autoHideOnScroll effect. */
.hs-nav-v2[data-hidden] { transform: translateY(-100%); }
.hs-nav-v2__row {
  width: min(var(--nav-track-max, var(--grid-max-width, 1200px)), 100%);
  box-sizing: border-box;
  padding: 0 var(--nav-track-margin, var(--grid-margin, 16px));
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.hs-nav-v2__row--actions { height: var(--nav-row-h); }
.hs-nav-v2__row--links { height: var(--nav-links-h); }

.hs-nav-v2__logo { flex: none; display: flex; align-items: center; }

.hs-nav-v2__actions {
  flex: 1 1 auto;
  min-width: 0;
  margin-left: var(--space-8);
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  align-items: center;
}

/* ── Search pill (⌘K) — 480×44 is spec geometry ───────────── */
.hs-nav-v2__search {
  flex: 1 1 480px;
  width: 480px;
  min-width: 0;
  max-width: 480px;
  margin: 0 auto 0 0;
  height: 44px;
  box-sizing: border-box;
  padding: 0 var(--space-2) 0 var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2-5);
  border: 1px solid var(--color-text-primary);
  border-radius: var(--radius-input);
  background: var(--color-bg-editor);
  text-align: left;
}
.hs-nav-v2__search:hover { background: var(--color-bg-muted); }
.hs-nav-v2__search-label {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: var(--font-size-inp);
  color: var(--color-text-secondary);
}
.hs-nav-v2__caret {
  display: inline-block;
  width: 1px;
  height: 1em;
  margin-left: 1px;
  vertical-align: -0.15em;
  background: currentColor;
  animation: hs-nav-v2-blink 1s steps(1) infinite;
}

/* ── Pills ────────────────────────────────────────────────── */
.hs-nav-v2__pill {
  flex: none;
  height: 40px;
  margin: 0;
  padding: 0 var(--space-4);
  border-radius: var(--radius-full);
  display: flex;
  flex-direction: row;
  gap: var(--space-1-5);
  align-items: center;
  white-space: nowrap;
  font-weight: var(--font-weight-label-sb-15);
  font-size: var(--font-size-label-sb-15);
}
.hs-nav-v2__pill--ghost { background: var(--color-brand-secondary-dim); }
.hs-nav-v2__pill--ghost:hover { background: var(--color-element-subtle); }
.hs-nav-v2__pill--ghost:active { background: var(--color-state-pressed); }

/* Rest state is pure black per the spec; hover/pressed return to the
   brand-secondary ramp. */
.hs-nav-v2__pill--dark { background: #000000; color: var(--color-text-on-secondary); }
.hs-nav-v2__pill--dark:hover { background: var(--color-brand-secondary-hover); }
.hs-nav-v2__pill--dark:active { background: var(--color-brand-secondary-pressed); }

/* ── Icon buttons ─────────────────────────────────────────── */
.hs-nav-v2__icons { display: flex; flex-direction: row; gap: var(--space-4); align-items: center; }
.hs-nav-v2__iconbtn {
  position: relative;
  flex: none;
  width: 36px;
  height: 36px;
  margin: 0;
  padding: 0;
  border-radius: var(--radius-full);
  background: var(--color-brand-secondary-dim);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hs-nav-v2__iconbtn:hover { background: var(--color-element-subtle); }
.hs-nav-v2__iconbtn:active,
.hs-nav-v2__iconbtn[aria-expanded="true"] { background: var(--color-state-pressed); }
/* Bare wrapper — the avatar itself renders through the DS Avt primitive. */
.hs-nav-v2__avatar {
  flex: none;
  margin: 0;
  padding: 0;
  border: 0;
  background: none;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
}

/* ── Category link row ────────────────────────────────────── */
.hs-nav-v2__linksrow {
  align-self: stretch;
  border-top: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  align-items: center;
  /* The mega panel is absolute against this row, so it must not be static. */
  position: relative;
}

/* ── Mega menu panel ───────────────────────────────────────────────────
   Two nested layers on purpose: the outer one animates HEIGHT and clips,
   the inner one animates transform and opacity. Putting both on one
   element would make the lift clip against its own box. */
.hs-nav-v2__megapanel {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  overflow: hidden;
  height: 0;
  pointer-events: none;
  /* pointer-events alone leaves the closed panel's ~40 buttons focusable and
     announced. visibility takes them out of the tab order and the
     accessibility tree, and it inherits, so the whole subtree goes with it.
     The 0.42s delay on the way out lets the collapse animate with the content
     still visible; opening flips it immediately. */
  visibility: hidden;
  background: var(--color-bg-main);
  box-shadow: 0 18px 30px rgba(0, 0, 0, 0.08);
  transition: height 0.42s cubic-bezier(0.22, 1, 0.36, 1), visibility 0s linear 0.42s;
}
.hs-nav-v2__linksrow[data-mega-open] .hs-nav-v2__megapanel {
  height: var(--mega-panel-h);
  pointer-events: auto;
  visibility: visible;
  transition: height 0.42s cubic-bezier(0.22, 1, 0.36, 1), visibility 0s;
}
.hs-nav-v2__megainner {
  display: flex;
  flex-direction: column;
  align-items: center;
  border-top: 1px solid var(--mega-rule);
  transform: translateY(-14px);
  opacity: 0;
  /* The open height is fixed, so a dataset taller than the drop has to scroll
     here rather than be clipped away silently. */
  max-height: var(--mega-panel-h);
  overflow-y: auto;
  /* Fade is deliberately shorter than the slide. */
  transition: transform 0.42s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease;
}
.hs-nav-v2__linksrow[data-mega-open] .hs-nav-v2__megainner { transform: translateY(0); opacity: 1; }

/* Same track as .hs-nav-v2__row, margins included. The standalone had no
   horizontal inset because its rows had none either; ours adds the grid's
   margins, so the panel has to match or its contents sit outside the track. */
.hs-nav-v2__megagrid {
  position: relative;
  width: min(var(--nav-track-max, var(--grid-max-width, 1200px)), 100%);
  box-sizing: border-box;
  padding: var(--mega-pad-top) var(--nav-track-margin, var(--grid-margin, 16px)) var(--mega-pad-bottom);
  display: flex;
  flex-direction: row;
  gap: var(--mega-col-gap);
  align-items: flex-start;
}
/* Full-height hairline between the rail and the columns. Absolute rather
   than a border so it spans the tallest column whichever dataset shows. */
.hs-nav-v2__megarule {
  position: absolute;
  /* Offset from the grid edge, so it follows the rail past the inset. */
  left: calc(var(--nav-track-margin, var(--grid-margin, 16px)) + var(--mega-rail-w));
  top: 0;
  bottom: 0;
  width: 1px;
  background: var(--mega-rule);
  pointer-events: none;
}
/* The negative margin pulls the first column back over part of the 64px gap,
   so the rule sits mid-gutter instead of hard against the rail. */
.hs-nav-v2__megarail {
  width: var(--mega-rail-w);
  box-sizing: border-box;
  flex: none;
  align-self: stretch;
  padding-right: var(--space-4);
  margin-right: -24px;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}
.hs-nav-v2__megarailhead { display: flex; flex-direction: row; gap: var(--space-2-5); align-items: center; }
/* 16px/20px rail and column headings: off-scale against the type tokens. */
.hs-nav-v2__megaraillabel { font-weight: var(--font-weight-medium); font-size: 16px; line-height: 20px; }
.hs-nav-v2__megalist { display: flex; flex-direction: column; gap: var(--space-3); align-items: flex-start; }
.hs-nav-v2__megafilter {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-label-15);
  line-height: var(--line-height-label-15);
  transition: color 0.15s ease;
}
.hs-nav-v2__megafilter:hover { color: var(--color-element-link); }

.hs-nav-v2__megacol {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}
.hs-nav-v2__megacoltitle {
  font-weight: var(--font-weight-semibold);
  font-size: 16px;
  line-height: 20px;
  white-space: nowrap;
}
.hs-nav-v2__megaitem {
  font-weight: var(--font-weight-regular);
  font-size: var(--font-size-label-15);
  line-height: var(--line-height-label-15);
  color: var(--mega-item-ink);
  white-space: nowrap;
  transition: color 0.15s ease;
}
.hs-nav-v2__megaitem:hover { color: var(--color-element-link); }

.hs-nav-v2__megapromo {
  position: relative;
  margin-left: auto;
  width: var(--mega-promo-w);
  height: var(--mega-promo-h);
  flex: none;
  border-radius: 2px;
  overflow: hidden;
  /* Deep navy shows through while the art loads, or when none is supplied. */
  background: #16305c;
  display: block;
}
.hs-nav-v2__megapromo img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.hs-nav-v2__megascrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(10, 20, 45, 0.55) 0%, rgba(10, 20, 45, 0.1) 55%);
}
/* 21px/27px promo headline: another off-scale one-off from the spec. */
.hs-nav-v2__megapromotext {
  position: absolute;
  left: var(--space-5);
  top: var(--space-5);
  width: 150px;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);
  font-size: 21px;
  line-height: 27px;
  color: var(--color-text-on-primary);
}
.hs-nav-v2__links {
  flex: 1 1 auto;
  min-width: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  font-weight: var(--font-weight-label-sb-15);
  font-size: var(--font-size-label-sb-15);
}
.hs-nav-v2__links::-webkit-scrollbar { display: none; }
.hs-nav-v2__link {
  background: none;
  padding: var(--space-2) var(--space-2-5);
  white-space: nowrap;
  transition: color 150ms ease;
}
.hs-nav-v2__link:first-child { padding-left: 0; }
/* The Link role, not the brand red. They are the same #be1d2c in light mode,
   but dark mode splits them: link is #f54051 against brand's #cf2737, the
   lighter red being the legible one on a dark ground. */
.hs-nav-v2__link:hover,
.hs-nav-v2__link[aria-expanded="true"],
.hs-nav-v2__link[aria-current="true"] { color: var(--color-element-link); }

/* ── Ask Stampy pill (hairline + twin sheen sweeps) ───────── */
.hs-nav-v2__stampy {
  position: relative;
  flex: none;
  margin: 0 0 0 var(--space-4);
  overflow: hidden;
  height: 36px;
  padding: 0 var(--space-3) 0 var(--space-1-5);
  border-radius: var(--radius-full);
  background: var(--color-bg-main);
  box-shadow: inset 0 0 0 1px var(--color-text-primary);
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
  align-items: center;
  white-space: nowrap;
  font-weight: var(--font-weight-label-sb-15);
  font-size: var(--font-size-label-sb-15);
}
.hs-nav-v2__stampy:hover { background: rgba(36, 36, 35, 0.04); } /* spec: half-strength hover wash */
.hs-nav-v2__stampy img { width: 24px; height: 24px; border-radius: var(--radius-full); display: block; }
/* Sheen gradients are effect artwork from the spec, not tokens. */
.hs-nav-v2__sheen {
  position: absolute;
  left: 0;
  top: 0;
  width: 55%;
  height: 100%;
  z-index: 3;
  opacity: 0;
  pointer-events: none;
}
.hs-nav-v2__sheen--l {
  background: linear-gradient(100deg, rgba(36,36,35,0) 0%, rgba(36,36,35,0.08) 38%, rgba(190,29,44,0.16) 50%, rgba(36,36,35,0.08) 62%, rgba(36,36,35,0) 100%);
  animation: hs-nav-v2-sheen-l 6s cubic-bezier(0.3, 0, 0.2, 1) 0.9s infinite;
}
.hs-nav-v2__sheen--r {
  background: linear-gradient(-100deg, rgba(36,36,35,0) 0%, rgba(36,36,35,0.08) 38%, rgba(190,29,44,0.16) 50%, rgba(36,36,35,0.08) 62%, rgba(36,36,35,0) 100%);
  animation: hs-nav-v2-sheen-r 6s cubic-bezier(0.3, 0, 0.2, 1) 3.9s infinite;
}

@keyframes hs-nav-v2-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
@keyframes hs-nav-v2-sheen-l {
  0%   { transform: translateX(-160%) skewX(-18deg); opacity: 0; }
  3%   { opacity: 1; }
  20%  { opacity: 1; }
  23%  { transform: translateX(260%) skewX(-18deg); opacity: 0; }
  100% { transform: translateX(260%) skewX(-18deg); opacity: 0; }
}
@keyframes hs-nav-v2-sheen-r {
  0%   { transform: translateX(260%) skewX(18deg); opacity: 0; }
  3%   { opacity: 1; }
  20%  { opacity: 1; }
  23%  { transform: translateX(-160%) skewX(18deg); opacity: 0; }
  100% { transform: translateX(-160%) skewX(18deg); opacity: 0; }
}
/* ── Compact phone bar ─────────────────────────────────────────────────
   The 68px action row and 48px category row collapse to one 56px bar: a
   112px lockup and an icon-only cluster. The search pill, Get the App, the
   Reminders label, the Ask Stampy chip and the avatar all drop with it.
   The root already draws the bottom border, so the bar does not repeat it. */
.hs-nav-v2__mbar {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: var(--nav-m-h);
  padding: 0 var(--space-4);
  background: var(--color-bg-main);
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.hs-nav-v2__mlogo { flex: none; display: flex; align-items: center; }
/* Spec sizes the lockup by width; height follows the 456/114 ratio. */
.hs-nav-v2__mlogo svg,
.hs-nav-v2__mlogo img { width: var(--nav-m-logo-w); height: auto; display: block; }
.hs-nav-v2__mright {
  flex: 0 0 auto;
  margin-left: auto;
  display: flex;
  flex-direction: row;
  gap: var(--space-2-5);
  align-items: center;
}
/* The same ghost circle as the desktop icon button, with 20px glyphs. */
.hs-nav-v2__mbtn {
  position: relative;
  flex: 0 0 var(--nav-m-btn);
  width: var(--nav-m-btn);
  height: var(--nav-m-btn);
  border-radius: var(--radius-full);
  background: var(--color-brand-secondary-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;
}
.hs-nav-v2__mbtn:active { background: var(--color-state-pressed); }
/* The bell comes from Notification, which draws an 18px glyph for the desktop
   cluster. In the compact bar every glyph is 20px, so size it to match its
   siblings rather than fork the component. */
.hs-nav-v2__mright .hs-notif__trigger svg { width: 20px; height: 20px; }

/* ── Language dropdown ─────────────────────────────────────────────────── */
.hs-nav-v2__lang { position: relative; flex: none; }
.hs-nav-v2__langmenu {
  position: absolute;
  right: 0;
  top: var(--lang-top);
  z-index: 1;
  width: var(--lang-w);
  box-sizing: border-box;
  border-radius: var(--radius-2xl);
  background: var(--color-bg-main);
  /* Inset ring rather than a border: the hairline must not add to the 167px
     box, and it has to sit under the drop shadow. */
  box-shadow: inset 0 0 0 1px var(--color-element-subtle), var(--shadow-md);
  overflow: hidden;
  padding: var(--space-1) 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
  align-items: stretch;
  user-select: none;
  -webkit-user-select: none;
  transform-origin: top right;
  animation: hs-nav-v2-pop-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hs-nav-v2__langitem {
  height: var(--lang-item-h);
  box-sizing: border-box;
  padding: var(--space-2-5) var(--space-4);
  display: flex;
  flex-direction: row;
  gap: var(--space-2-5);
  align-items: center;
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-label-15);
  line-height: var(--line-height-label-15);
  text-align: left;
  opacity: 0;
  animation: hs-nav-v2-pop-item 0.32s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hs-nav-v2__langitem:hover { background: var(--color-state-hover); }
/* Stagger: item n starts at n × 0.05s, per the spec. */
.hs-nav-v2__langitem:nth-child(1) { animation-delay: 0.05s; }
.hs-nav-v2__langitem:nth-child(2) { animation-delay: 0.10s; }
.hs-nav-v2__langitem:nth-child(3) { animation-delay: 0.15s; }
.hs-nav-v2__langitem:nth-child(n+4) { animation-delay: 0.20s; }
/* 16px flag glyph: an off-scale emoji size with no type-token equivalent. */
.hs-nav-v2__langflag { flex: none; font-size: 16px; line-height: var(--line-height-label-15); }
.hs-nav-v2__langlabel { flex: 1; min-width: 0; }
.hs-nav-v2__langcheck { flex: none; opacity: 0; }
.hs-nav-v2__langitem[aria-checked="true"] .hs-nav-v2__langcheck { opacity: 1; }

/* ── Reminders sidebar ─────────────────────────────────────────────────
   The shell is the design system's Sheet (direction="right"), which brings
   the overlay, the slide, focus handling and the close button. Only the
   contents below are the nav's own; the sheet's width, ground and phone
   full-bleed are set inline on SheetContent. */
.hs-nav-v2__remtitle {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);
  font-size: var(--font-size-h4);
  line-height: var(--line-height-h4);
}
.hs-nav-v2__rembody {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  box-sizing: border-box;
  padding: var(--space-4) var(--space-7) var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-7);
}
.hs-nav-v2__rempitch { display: flex; flex-direction: column; align-items: center; gap: var(--space-4); }
/* Width is set inline from the mobile flag (300px / 240px) rather than a
   viewport media query, so it follows the sheet inside a bounded frame. */
.hs-nav-v2__remart { max-width: 100%; height: auto; display: block; }
.hs-nav-v2__remcopy { display: flex; flex-direction: column; align-items: center; gap: var(--space-2); }
/* 26px/32px and 20px/28px copy: off-scale one-offs from the spec, in the same
   class as the 17/22/26px exceptions the token audit left in place. */
.hs-nav-v2__remlede {
  margin: 0;
  max-width: 340px;
  text-align: center;
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium);
  font-size: 26px;
  line-height: 32px;
  letter-spacing: -0.02em;
}
.hs-nav-v2__remsub {
  margin: 0;
  max-width: 340px;
  text-align: center;
  font-weight: var(--font-weight-medium);
  font-size: 20px;
  line-height: 28px;
  color: var(--color-text-secondary);
}
.hs-nav-v2__remactions {
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4) var(--space-7) var(--space-7);
}

@keyframes hs-nav-v2-pop-in {
  0%   { opacity: 0; transform: translateY(-8px) scale(0.96); }
  60%  { opacity: 1; transform: translateY(0) scale(1.008); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hs-nav-v2-pop-item {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .hs-nav-v2__caret, .hs-nav-v2__sheen { animation: none; }
  .hs-nav-v2__sheen { opacity: 0; }
  .hs-nav-v2 { transition: none; }
  .hs-nav-v2__langmenu,
  .hs-nav-v2__langitem { animation: none; opacity: 1; }
  .hs-nav-v2__megapanel,
  .hs-nav-v2__megainner { transition: none; }
  /* The reminders sheet is the design system Sheet and handles its own. */
}
`;

const NAV_CSS_MIN = cssMin(NAV_CSS);

/* ── Component ─────────────────────────────────────────────────────────── */

export interface WebsiteNavV2Props {
  /** Category strip labels. Defaults to the spec set. */
  categories?: string[];
  /** Persistently highlighted category (hover still moves aria-current). */
  activeCategory?: string;
  /** Hide the category strip row entirely. */
  showLinks?: boolean;
  /** @deprecated The unread dot is now owned by the notifications panel and
   *  derives from `notifications[].unread`. Accepted for source compatibility
   *  but no longer drives the dot. */
  unread?: boolean;
  /** Rows for the notifications panel. Omit to fall back to the demo set. */
  notifications?: NotificationItem[];
  /** Stick the header to the top of the scroll container (spec default). */
  sticky?: boolean;
  /** Own width, in px, below which the compact phone bar replaces the two
   *  desktop rows. The nav measures itself rather than the viewport, so it
   *  also collapses inside a narrow frame on a wide screen. */
  breakpoint?: number;
  /** Force the compact phone bar at any width, for design review and device
   *  frames. Leave unset to let the measured width decide. */
  mobile?: boolean;
  /** Slide the bar away on downward scroll. Compact layout only, and skipped
   *  when the bar is not sticky or the user prefers reduced motion. */
  autoHideOnScroll?: boolean;
  /** Show the globe in the compact bar's cluster. The handoff includes it;
   *  production's mobile cluster drops it, so pass false to match production.
   *  The desktop cluster always shows it. */
  showLanguage?: boolean;
  /** Options in the language dropdown. Defaults to the spec's three. */
  languages?: NavLanguage[];
  /** Selected language value. Leave unset to let the nav track it. */
  language?: string;
  /** Fires with the picked language value. */
  onLanguageChange?: (value: string) => void;
  /** Headline in the reminders sheet. */
  remindersLede?: string;
  /** Body copy under the reminders headline. */
  remindersSub?: string;
  /** Alpha-channel WebM for the reminders illustration. Omit to render no art. */
  remindersArtSrc?: string;
  /** Still image used when the WebM is absent or cannot play. */
  remindersArtFallbackSrc?: string;
  /** Fires when the reminders sheet's primary button is pressed. */
  onSetReminders?: () => void;
  /** Fires when the reminders sheet's secondary button is pressed. */
  onViewAllReminders?: () => void;
  /** Datasets for the mega panel, keyed by category label. Defaults to the
   *  spec's eleven; feed it from the CMS in product. */
  megaMenus?: Record<string, MegaMenu>;
  /** Promo tile art keyed by category label. The handoff's own images are not
   *  bundled, so with none supplied the tile shows its navy ground and copy. */
  megaPromoImages?: Record<string, string>;
  /** Drop the mega panel and leave the category row as plain links. */
  showMegaMenu?: boolean;
  /** Open the panel on this category at mount, for design review and docs. */
  defaultOpenCategory?: string;
  /** Fires with the category and the filter, item or promo that was clicked. */
  onMegaSelect?: (category: string, value: string) => void;
  /** Render the reminders sheet into this element instead of the body, so it
   *  stays inside a bounded box (a docs preview, a device frame) rather than
   *  covering the viewport. Leave unset in an app: viewport-level is correct
   *  there, and it is what the spec asks for. */
  portalContainer?: HTMLElement | null;
  /** Static placeholder, also shown when the user prefers reduced motion. */
  searchPlaceholder?: string;
  /** Lines the search placeholder types through. */
  searchPrompts?: string[];
  avatarSrc?: string;
  avatarInitials?: string;
  /** Mascot image inside the Ask Stampy chip. Defaults to the bundled Stampy. */
  stampySrc?: string;
  onSearch?: () => void;
  onGetApp?: () => void;
  onReminders?: () => void;
  onLanguage?: () => void;
  /** Fires when the notifications panel opens. */
  onNotifications?: () => void;
  /** Fires when a notification row is clicked. */
  onNotificationItemClick?: (item: NotificationItem) => void;
  /** Fires when a row's "Show more" link is clicked. */
  onNotificationShowMore?: (item: NotificationItem) => void;
  /** Fires when a row is archived, by swipe or by the row menu. */
  onNotificationArchive?: (item: NotificationItem) => void;
  /** Fires when "Mark all as read" is pressed. */
  onNotificationMarkAllRead?: () => void;
  onCart?: () => void;
  onProfile?: () => void;
  onAskStampy?: () => void;
  onCategoryClick?: (label: string) => void;
  /** Mega-panel hook: fires as the pointer moves across category links. */
  onCategoryHover?: (label: string | null) => void;
}

export function WebsiteNavV2({
  categories = WEBSITE_NAV_V2_CATEGORIES,
  activeCategory,
  showLinks = true,
  sticky = true,
  breakpoint = 768,
  mobile,
  autoHideOnScroll = true,
  showLanguage = true,
  languages = WEBSITE_NAV_V2_LANGUAGES,
  language,
  onLanguageChange,
  remindersLede = "80% of our customers have got a reminder.",
  remindersSub = "Set a reminder below and never forget an important occasion again, phew!",
  remindersArtSrc,
  remindersArtFallbackSrc,
  onSetReminders,
  onViewAllReminders,
  megaMenus = MEGA_MENUS,
  megaPromoImages,
  showMegaMenu = true,
  defaultOpenCategory,
  onMegaSelect,
  portalContainer,
  searchPlaceholder = "Search for cards, invitations, digital cards...",
  searchPrompts = SEARCH_LINES,
  avatarSrc,
  avatarInitials = "HS",
  stampySrc,
  notifications,
  onSearch, onGetApp, onReminders, onLanguage, onNotifications,
  onNotificationItemClick, onNotificationShowMore,
  onNotificationArchive, onNotificationMarkAllRead,
  onCart, onProfile, onAskStampy, onCategoryClick, onCategoryHover,
}: WebsiteNavV2Props) {
  useInjectedStyle("hs-nav-v2", NAV_CSS_MIN);
  const typed = useNavTypewriter(searchPrompts, searchPlaceholder);
  const rootRef = useRef<HTMLElement>(null);

  /* One component, both layouts. The nav measures its own box rather than the
     viewport, so it also collapses inside a narrow frame on a wide screen
     (docs previews, device frames) where a media query would still read
     "desktop". `mobile` overrides the measurement outright. */
  const [narrow, setNarrow] = useState(false);
  const isMobile = mobile ?? narrow;

  useLayoutEffect(() => {
    if (mobile !== undefined) return;          /* forced, nothing to measure */
    const el = rootRef.current;
    if (!el) return;
    /* Measure once synchronously, before paint. ResizeObserver delivers its
       first callback in a later task, so relying on it alone paints the
       desktop rows once on a phone before they collapse. A zero width means
       there is no layout to read yet (jsdom, or a display:none ancestor);
       treating that as narrow would collapse the bar for the wrong reason, so
       leave the default standing and let the observer correct it. */
    const measured = el.getBoundingClientRect().width;
    if (measured > 0) setNarrow(measured < breakpoint);
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(entries => {
      setNarrow(entries[0].contentRect.width < breakpoint);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [breakpoint, mobile]);

  /* Surfaces that hang off the bar. */
  const [langOpen, setLangOpen] = useState(false);
  const [remOpen, setRemOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [ownLanguage, setOwnLanguage] = useState(languages[0]?.value ?? "");
  const currentLanguage = language ?? ownLanguage;
  const surfaceOpen = langOpen || remOpen || notifOpen;

  /* Switching layouts unmounts the bar's tray and menu and mounts fresh closed
     ones, but Notification owns its open state and reports nothing on unmount.
     Without this reset the mirrored flags stay true, surfaceOpen never clears
     and scroll auto-hide is dead for the rest of the session. */
  useEffect(() => { setNotifOpen(false); setLangOpen(false); }, [isMobile]);

  /* Only a stuck compact bar has anything to hide. A static one scrolls away
     on its own, and translating it would lift it over whatever sits above.
     Auto-hide also pauses while a surface is open: hiding applies a transform
     to the nav, which would make it the containing block for the fixed veil,
     sheet and phone notification tray and drag them along with it. */
  useNavAutoHide(rootRef, autoHideOnScroll && sticky && isMobile && !surfaceOpen);

  /* Mega panel. Hover or focus a category to open it; switching categories
     swaps the dataset without closing. Leaving the row closes after a 140ms
     grace period so the pointer can cross the gap down into the panel. */
  const [megaOpen, setMegaOpen] = useState<string | null>(defaultOpenCategory ?? null);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openMega = (label: string) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(label);
    onCategoryHover?.(label);
  };
  const closeMega = (immediate = false) => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    const shut = () => { setMegaOpen(null); onCategoryHover?.(null); };
    if (immediate) shut();
    else megaTimer.current = setTimeout(shut, MEGA_CLOSE_DELAY);
  };
  useEffect(() => () => { if (megaTimer.current) clearTimeout(megaTimer.current); }, []);

  /* Dataset shown before any hover, matching the spec's fallback. */
  const megaCategory = megaOpen ?? MEGA_FALLBACK;
  const megaData =
    ownProp(megaMenus, megaCategory)
    ?? ownProp(megaMenus, MEGA_FALLBACK)
    ?? Object.values(megaMenus)[0];

  const openReminders = () => { setRemOpen(true); onReminders?.(); };
  const changeLanguage = (value: string) => { setOwnLanguage(value); onLanguageChange?.(value); };
  const toggleLanguage = (open: boolean) => { setLangOpen(open); if (open) onLanguage?.(); };
  const toggleNotifications = (open: boolean) => { setNotifOpen(open); if (open) onNotifications?.(); };

  /* ⌘K / Ctrl+K opens search, exactly like the standalone. */
  useEffect(() => {
    if (!onSearch) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onSearch();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onSearch]);


  return (
    <header ref={rootRef} className={`hs-nav-v2${sticky ? "" : " hs-nav-v2--static"}`}>
      {isMobile ? (
        <CompactBar
          showLanguage={showLanguage}
          languages={languages}
          language={currentLanguage}
          langOpen={langOpen}
          notifications={notifications}
          onSearch={onSearch}
          onOpenReminders={openReminders}
          onLangOpenChange={toggleLanguage}
          onLanguageSelect={changeLanguage}
          onNotificationOpenChange={toggleNotifications}
          onNotificationItemClick={onNotificationItemClick}
          onNotificationShowMore={onNotificationShowMore}
          onNotificationArchive={onNotificationArchive}
          onNotificationMarkAllRead={onNotificationMarkAllRead}
          onCart={onCart}
        />
      ) : (
        <>
        {/* Row 1 — actions */}
        <div className="hs-nav-v2__row hs-nav-v2__row--actions">
          <a className="hs-nav-v2__logo" href="#" aria-label="HeartStamp home" onClick={e => e.preventDefault()}>
            <HSLogo type="lockup" color="brand" height={32} />
          </a>

          <div className="hs-nav-v2__actions">
            {/* Search pill: opens the ⌘K overlay */}
            <button type="button" className="hs-nav-v2__search" onClick={onSearch} aria-label="Search cards, invitations and digital cards">
              <Search size={18} strokeWidth={2} style={{ flex: "none", color: "var(--color-text-secondary)", strokeWidth: "var(--lucide-stroke-width, 2)" }} aria-hidden />
              <span className="hs-nav-v2__search-label">
                <span>{typed}</span>
                <i className="hs-nav-v2__caret" />
              </span>
              <span aria-hidden="true" style={{ flex: "none" }}>
                <Kbd style={{ height: 26, padding: "0 var(--space-2)", borderRadius: "var(--radius-full)", background: "var(--color-bg-main)", letterSpacing: "0.04em" }}>⌘K</Kbd>
              </span>
            </button>

            <button type="button" className="hs-nav-v2__pill hs-nav-v2__pill--dark" onClick={onGetApp}>
              <AppleMark />
              <span>Get the App</span>
            </button>

            <button type="button" className="hs-nav-v2__pill hs-nav-v2__pill--ghost" onClick={openReminders}>
              <CalendarCheck size={20} strokeWidth={2} style={{ flex: "none", strokeWidth: "var(--lucide-stroke-width, 2)" }} aria-hidden />
              <span>Reminders</span>
            </button>

            <div className="hs-nav-v2__icons">
              <LanguageMenu
                languages={languages}
                value={currentLanguage}
                open={langOpen}
                glyphSize={18}
                btnClassName="hs-nav-v2__iconbtn"
                onOpenChange={toggleLanguage}
                onSelect={changeLanguage}
              />
              {/* Owns its own trigger; .hs-notif__trigger matches .hs-nav-v2__iconbtn
                  and .hs-notif is already position:relative/flex:none for this row. */}
              <Notification
                items={notifications}
                onItemClick={onNotificationItemClick}
                onShowMore={onNotificationShowMore}
                onArchive={onNotificationArchive}
                onMarkAllRead={onNotificationMarkAllRead}
                onOpenChange={toggleNotifications}
              />
              <button type="button" className="hs-nav-v2__iconbtn" aria-label="Cart" onClick={onCart}>
                <ShoppingCart size={18} strokeWidth={2} style={{ strokeWidth: "calc(var(--lucide-stroke-width, 2) * 1.111)" }} aria-hidden />
              </button>
              <button type="button" className="hs-nav-v2__avatar" aria-label="Profile" onClick={onProfile}>
                <Avt src={avatarSrc} fallback={avatarInitials} size={36} />
              </button>
            </div>
          </div>
        </div>

        {/* Row 2 — category links */}
        {showLinks && (
          <div
            className="hs-nav-v2__linksrow"
            {...(showMegaMenu && megaOpen ? { "data-mega-open": "" } : {})}
            /* The null close signal fires in both modes: with the panel off,
               consumers drive their own from onCategoryHover and would
               otherwise never be told the pointer left the row. */
            onMouseLeave={showMegaMenu ? () => closeMega() : () => onCategoryHover?.(null)}
            onKeyDown={showMegaMenu ? e => { if (e.key === "Escape") closeMega(true); } : undefined}
          >
            <div className="hs-nav-v2__row hs-nav-v2__row--links">
              <nav className="hs-nav-v2__links" aria-label="Card categories">
                {categories.map(label => (
                  <button
                    type="button"
                    key={label}
                    className="hs-nav-v2__link"
                    aria-current={activeCategory === label ? "true" : undefined}
                    {...(showMegaMenu
                      ? { "aria-haspopup": true as const, "aria-expanded": megaOpen === label }
                      : {})}
                    onMouseEnter={showMegaMenu ? () => openMega(label) : () => onCategoryHover?.(label)}
                    /* Keyboard parity: focus opens the panel a hover would. */
                    onFocus={showMegaMenu ? () => openMega(label) : undefined}
                    onClick={() => onCategoryClick?.(label)}
                  >
                    {label}
                  </button>
                ))}
              </nav>

              <button type="button" className="hs-nav-v2__stampy" onClick={onAskStampy}>
                <span className="hs-nav-v2__sheen hs-nav-v2__sheen--l" aria-hidden="true" />
                <span className="hs-nav-v2__sheen hs-nav-v2__sheen--r" aria-hidden="true" />
                <img src={stampySrc ?? stampyBtnGraphic} alt="" />
                <span>Ask Stampy AI</span>
              </button>
            </div>

            {showMegaMenu && megaData && (
              <MegaPanel
                category={megaCategory}
                data={megaData}
                promoSrc={ownProp(megaPromoImages, megaCategory)}
                open={megaOpen !== null}
                onSelect={onMegaSelect}
              />
            )}
          </div>
        )}
        </>
      )}

      <RemindersSheet
        open={remOpen}
        mobile={isMobile}
        lede={remindersLede}
        sub={remindersSub}
        artSrc={remindersArtSrc}
        artFallbackSrc={remindersArtFallbackSrc}
        container={portalContainer}
        onOpenChange={setRemOpen}
        onSetReminders={onSetReminders}
        onViewAllReminders={onViewAllReminders}
      />
    </header>
  );
}


/* ── Mega menu panel ────────────────────────────────────────────────────
   Internal. Drops out of the category row: a filter rail, four link
   columns and a promo tile, all swapped from the hovered category's
   dataset. Stays mounted while closed so the open and close animations
   both play; the [data-mega-open] flag on the row drives them. */

function MegaPanel({
  category, data, promoSrc, open, onSelect,
}: {
  category: string;
  data: MegaMenu;
  promoSrc?: string;
  open: boolean;
  onSelect?: (category: string, value: string) => void;
}) {
  const pick = (value: string) => (onSelect ? () => onSelect(category, value) : undefined);

  return (
    <div
      className="hs-nav-v2__megapanel"
      role="region"
      aria-label="Category menu"
      aria-hidden={!open}
    >
      <div className="hs-nav-v2__megainner">
        <div className="hs-nav-v2__megagrid">
          <div className="hs-nav-v2__megarule" aria-hidden="true" />

          <div className="hs-nav-v2__megarail">
            <div className="hs-nav-v2__megarailhead">
              <ListFilter size={17} strokeWidth={1.8} aria-hidden />
              <span className="hs-nav-v2__megaraillabel">Filters</span>
            </div>
            <div className="hs-nav-v2__megalist">
              {data.filters.map(f => (
                <button type="button" key={f} className="hs-nav-v2__megafilter" onClick={pick(f)}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {data.cols.map(col => (
            <div className="hs-nav-v2__megacol" key={col.title}>
              <span className="hs-nav-v2__megacoltitle">{col.title}</span>
              <div className="hs-nav-v2__megalist">
                {col.items.map(item => (
                  <button type="button" key={item} className="hs-nav-v2__megaitem" onClick={pick(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {/* Promo art is not bundled: without a src the navy ground carries
              the copy on its own. */}
          <button type="button" className="hs-nav-v2__megapromo" onClick={pick(data.promoText)}>
            {promoSrc && <img src={promoSrc} alt="" />}
            <span className="hs-nav-v2__megascrim" aria-hidden="true" />
            <span className="hs-nav-v2__megapromotext">{data.promoText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Language dropdown ──────────────────────────────────────────────────
   Internal. Sits in the icon cluster of whichever bar is showing, so the
   trigger takes the surrounding bar's button class and glyph size. */

function LanguageMenu({
  languages, value, open, glyphSize, btnClassName,
  onOpenChange, onSelect,
}: {
  languages: NavLanguage[];
  value: string;
  open: boolean;
  glyphSize: number;
  btnClassName: string;
  onOpenChange: (open: boolean) => void;
  onSelect: (value: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const dismiss = () => onOpenChange(false);
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) dismiss();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") dismiss(); };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  return (
    <div className="hs-nav-v2__lang" ref={ref}>
      <button
        type="button"
        className={btnClassName}
        aria-label="Language"
        aria-haspopup="true"
        aria-expanded={open}
        /* Deliberately does NOT stop propagation: the click has to reach the
           notification tray's document-level outside-click listener, or
           opening the globe leaves the bell panel open beside it. The menu's
           own listener is attached in an effect, which runs after this click
           has finished propagating, so it cannot self-close. */
        onClick={() => onOpenChange(!open)}
      >
        <Globe
          size={glyphSize}
          strokeWidth={2}
          style={{ strokeWidth: "var(--lucide-stroke-width, 2)" }}
          aria-hidden
        />
      </button>

      {open && (
        <div className="hs-nav-v2__langmenu" role="menu" aria-label="Language">
          {languages.map(l => (
            <button
              type="button"
              key={l.value}
              className="hs-nav-v2__langitem"
              role="menuitemradio"
              aria-checked={l.value === value}
              onClick={e => { e.stopPropagation(); onSelect(l.value); onOpenChange(false); }}
            >
              <span className="hs-nav-v2__langflag" aria-hidden="true">{l.flag}</span>
              <span className="hs-nav-v2__langlabel">{l.label}</span>
              <Check className="hs-nav-v2__langcheck" size={16} strokeWidth={2} aria-hidden />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Reminders sidebar ──────────────────────────────────────────────────
   Internal. Stays mounted while open so the slide plays both ways; the
   veil and sheet are fixed to the viewport, which is why the nav stops
   auto-hiding (and so stops transforming) whenever a surface is open. */

function RemindersSheet({
  open, mobile, lede, sub, artSrc, artFallbackSrc, container,
  onOpenChange, onSetReminders, onViewAllReminders,
}: {
  open: boolean;
  mobile: boolean;
  lede: string;
  sub: string;
  artSrc?: string;
  artFallbackSrc?: string;
  container?: HTMLElement | null;
  onOpenChange: (open: boolean) => void;
  onSetReminders?: () => void;
  onViewAllReminders?: () => void;
}) {
  const [artFailed, setArtFailed] = useState(false);
  /* Give a new source its own chance to play: without this a single decode
     failure pins the still fallback on for the life of the component. */
  useEffect(() => { setArtFailed(false); }, [artSrc]);

  const showVideo = artSrc && !artFailed;
  const showFallback = artFallbackSrc && (!artSrc || artFailed);

  /* `container` goes to both: the root, so vaul measures the slide against
     that box rather than the window, and the portal, so the overlay and
     sheet land inside it instead of on document.body.

     Full bleed is relative to whatever the sheet is anchored in. Portaled
     into a container that is 100% of the box; on the body it is 100vw.
     Using 100vw inside a container makes the sheet as wide as the browser
     and hangs its contents off the left edge. */
  const edge = container ? "100%" : "100vw";

  return (
    <Sheet direction="right" open={open} onOpenChange={onOpenChange} container={container ?? undefined}>
      {/* Width and ground go through style rather than a class so they beat
          SheetContent's own w-3/4 + sm:max-w-sm without depending on
          stylesheet order. */}
      <SheetContent
        container={container}
        style={{
          width: mobile ? edge : REM_SHEET_W,
          maxWidth: edge,
          background: REM_SHEET_BG,
        }}
      >
        <SheetHeader>
          <SheetTitle className="hs-nav-v2__remtitle">Reminders</SheetTitle>
        </SheetHeader>

        <div className="hs-nav-v2__rembody">
          <div className="hs-nav-v2__rempitch">
            {/* Alpha-channel WebM with a still fallback for browsers that
                cannot play it. Both are supplied by the consumer. */}
            {showVideo && (
              <video
                className="hs-nav-v2__remart"
                style={{ width: mobile ? 240 : 300 }}
                src={artSrc}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                onError={() => setArtFailed(true)}
              />
            )}
            {showFallback && (
              <img className="hs-nav-v2__remart" style={{ width: mobile ? 240 : 300 }} src={artFallbackSrc} alt="" />
            )}

            <div className="hs-nav-v2__remcopy">
              <h3 className="hs-nav-v2__remlede">{lede}</h3>
              <p className="hs-nav-v2__remsub">{sub}</p>
            </div>
          </div>
        </div>

        <SheetFooter className="hs-nav-v2__remactions">
          <Btn size="xl" style={{ width: "100%" }} onClick={onSetReminders}>
            Set Reminders
          </Btn>
          <Btn size="xl" variant="outline" style={{ width: "100%" }} onClick={onViewAllReminders}>
            View All Reminders
          </Btn>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

/* ── Compact phone bar ──────────────────────────────────────────────────
   Internal. WebsiteNavV2 swaps to this in place of the two desktop rows
   once its own width drops below `breakpoint`, so a consumer mounts one
   component and gets both layouts. The 68px action row and the 48px
   category row collapse to a single 56px bar: a 112px lockup and an
   icon-only cluster. The search pill, Get the App, the Reminders label,
   the Ask Stampy chip, the avatar and the whole category row drop. */

type CompactBarProps = Pick<
  WebsiteNavV2Props,
  | "showLanguage" | "languages" | "notifications" | "onSearch"
  | "onNotificationItemClick" | "onNotificationShowMore"
  | "onNotificationArchive" | "onNotificationMarkAllRead" | "onCart"
> & {
  languages: NavLanguage[];
  language: string;
  langOpen: boolean;
  onLangOpenChange: (open: boolean) => void;
  onLanguageSelect: (value: string) => void;
  onOpenReminders: () => void;
  onNotificationOpenChange: (open: boolean) => void;
};

function CompactBar({
  showLanguage,
  languages,
  language,
  langOpen,
  notifications,
  onSearch, onOpenReminders, onLangOpenChange, onLanguageSelect,
  onNotificationOpenChange,
  onNotificationItemClick, onNotificationShowMore,
  onNotificationArchive, onNotificationMarkAllRead,
  onCart,
}: CompactBarProps) {
  const glyph = { strokeWidth: "var(--lucide-stroke-width, 2)" } as React.CSSProperties;

  return (
    <div className="hs-nav-v2__mbar">
      <a
        className="hs-nav-v2__mlogo"
        href="#"
        aria-label="HeartStamp home"
        onClick={e => e.preventDefault()}
      >
        <HSLogo type="lockup" color="brand" height={28} />
      </a>

      <div className="hs-nav-v2__mright">
        <button type="button" className="hs-nav-v2__mbtn" aria-label="Search" onClick={onSearch}>
          <Search size={20} strokeWidth={2} style={glyph} aria-hidden />
        </button>

        <button type="button" className="hs-nav-v2__mbtn" aria-label="Reminders" onClick={onOpenReminders}>
          <CalendarCheck size={20} strokeWidth={2} style={glyph} aria-hidden />
        </button>

        {showLanguage && (
          <LanguageMenu
            languages={languages}
            value={language}
            open={langOpen}
            glyphSize={20}
            btnClassName="hs-nav-v2__mbtn"
            onOpenChange={onLangOpenChange}
            onSelect={onLanguageSelect}
          />
        )}

        {/* Owns its own trigger and, forced to the phone presentation, opens
            as a full-height sheet pinned under this 56px bar. */}
        <Notification
          mobile
          items={notifications}
          onItemClick={onNotificationItemClick}
          onShowMore={onNotificationShowMore}
          onArchive={onNotificationArchive}
          onMarkAllRead={onNotificationMarkAllRead}
          onOpenChange={onNotificationOpenChange}
        />

        <button type="button" className="hs-nav-v2__mbtn" aria-label="Cart" onClick={onCart}>
          <ShoppingCart size={20} strokeWidth={2} style={glyph} aria-hidden />
        </button>
      </div>
    </div>
  );
}
