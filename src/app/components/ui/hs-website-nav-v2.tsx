// ═══════════════════════════════════════════════════════════════════════════
// WebsiteNavV2 — next-generation website navigation. TESTING PHASE.
//
// Direct port of the approved standalone ("HeartStamp Top Nav", Claude
// design), which is itself token-based. Figma source: cards / node 72-1459.
//
//   Row 1 (68px): brand lockup · search pill with rotating typewriter
//     placeholder, blinking caret and ⌘K chip · Get the App · Reminders ·
//     language / notifications / cart icon buttons · avatar
//   Row 2 (48px): category links (hover = brand red, aria-current is the
//     mega-panel hook) · Ask Stampy AI chip with twin sheen sweeps
//
// Deviations from the standalone, both deliberate:
//   - the content track uses --grid-max-width (1200px, 1400px wide tier)
//     instead of a fixed 1200px, and gets the grid's 16px margins so the
//     bar still breathes below 1200px viewports;
//   - the logo renders through HSLogo instead of a baked-in image.
//
// The current WebsiteNav (hs-website-nav.tsx) remains the production
// component until this one graduates.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from "react";
import { Search, Globe, Bell, ShoppingCart, CalendarCheck } from "lucide-react";
import { HSLogo } from "./hs-logo";
import { cssMin, useInjectedStyle } from "./hs-style-inject";
import { Kbd } from "./hs-kbd";
import { Avt } from "./hs-avt";
import stampyBtnGraphic from "../../../assets/stampy/stampy-btn-graphic.svg?url";

/* ── Static data (from the standalone) ─────────────────────────────────── */

export const WEBSITE_NAV_V2_CATEGORIES = [
  "Bday", "Congrats", "Thank you", "Cards for Kids", "Anniversary", "Wedding",
  "Thinking of you", "Baby", "New Home", "Graduation", "Retirement",
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
:where(.hs-nav-v2 button) {
  appearance: none;
  border: 0;
  cursor: pointer;
  transition: background 150ms ease, color 150ms ease;
}
.hs-nav-v2 :focus-visible { outline: 2px solid var(--color-brand-primary); outline-offset: 2px; }

.hs-nav-v2 {
  /* Nav-specific measurements from the spec (no global tokens at these
     values). z-index: the standalone says 9200 for a bare marketing page;
     40 keeps the nav below app-level overlays in composed layouts. */
  --nav-row-h: 68px;
  --nav-links-h: 48px;
  --nav-z: 40;
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
}
.hs-nav-v2--static { position: static; }
.hs-nav-v2__row {
  width: min(var(--grid-max-width, 1200px), 100%);
  box-sizing: border-box;
  padding: 0 var(--grid-margin, 16px);
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
.hs-nav-v2__dot {
  position: absolute;
  right: 3px;
  top: 2px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-brand-primary);
  box-shadow: 0 0 0 2px var(--color-bg-main);
  pointer-events: none;
}
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
.hs-nav-v2__link:hover,
.hs-nav-v2__link[aria-current="true"] { color: var(--color-brand-primary); }

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
@media (prefers-reduced-motion: reduce) {
  .hs-nav-v2__caret, .hs-nav-v2__sheen { animation: none; }
  .hs-nav-v2__sheen { opacity: 0; }
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
  /** Unread dot on the notifications button. */
  unread?: boolean;
  /** Stick the header to the top of the scroll container (spec default). */
  sticky?: boolean;
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
  onNotifications?: () => void;
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
  unread = true,
  sticky = true,
  searchPlaceholder = "Search for cards, invitations, digital cards...",
  searchPrompts = SEARCH_LINES,
  avatarSrc,
  avatarInitials = "HS",
  stampySrc,
  onSearch, onGetApp, onReminders, onLanguage, onNotifications,
  onCart, onProfile, onAskStampy, onCategoryClick, onCategoryHover,
}: WebsiteNavV2Props) {
  useInjectedStyle("hs-nav-v2", NAV_CSS_MIN);
  const typed = useNavTypewriter(searchPrompts, searchPlaceholder);
  const [hovered, setHovered] = useState<string | null>(null);

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

  const current = hovered ?? activeCategory ?? null;

  return (
    <header className={`hs-nav-v2${sticky ? "" : " hs-nav-v2--static"}`}>
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

          <button type="button" className="hs-nav-v2__pill hs-nav-v2__pill--ghost" onClick={onReminders}>
            <CalendarCheck size={20} strokeWidth={2} style={{ flex: "none", strokeWidth: "var(--lucide-stroke-width, 2)" }} aria-hidden />
            <span>Reminders</span>
          </button>

          <div className="hs-nav-v2__icons">
            <button type="button" className="hs-nav-v2__iconbtn" aria-label="Language" onClick={onLanguage}>
              <Globe size={18} strokeWidth={2} style={{ strokeWidth: "calc(var(--lucide-stroke-width, 2) * 1.111)" }} aria-hidden />
            </button>
            <button type="button" className="hs-nav-v2__iconbtn" aria-label="Notifications" onClick={onNotifications}>
              <Bell size={18} strokeWidth={2} style={{ strokeWidth: "calc(var(--lucide-stroke-width, 2) * 1.111)" }} aria-hidden />
              {unread && <span className="hs-nav-v2__dot" aria-hidden="true" />}
            </button>
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
          onMouseLeave={() => { setHovered(null); onCategoryHover?.(null); }}
        >
          <div className="hs-nav-v2__row hs-nav-v2__row--links">
            <nav className="hs-nav-v2__links" aria-label="Card categories">
              {categories.map(label => (
                <button
                  type="button"
                  key={label}
                  className="hs-nav-v2__link"
                  aria-current={current === label ? "true" : undefined}
                  onMouseEnter={() => { setHovered(label); onCategoryHover?.(label); }}
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
        </div>
      )}
    </header>
  );
}
