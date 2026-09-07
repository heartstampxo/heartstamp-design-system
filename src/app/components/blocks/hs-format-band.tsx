import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";

import deck125 from "../../../assets/deck/card-125.webp";
import deck126 from "../../../assets/deck/card-126.webp";
import deck127 from "../../../assets/deck/card-127.webp";
import deck128 from "../../../assets/deck/card-128.webp";
import deck129 from "../../../assets/deck/card-129.webp";
import deck130 from "../../../assets/deck/card-130.webp";
import deck131 from "../../../assets/deck/card-131.webp";
import deck132 from "../../../assets/deck/card-132.webp";
import deck133 from "../../../assets/deck/card-133.webp";
import deck134 from "../../../assets/deck/card-134.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   FORMAT BAND — the printed-versus-digital panel.

   A heading, the format pills, a line of italic copy, and a deck of cards you
   can drag or scroll sideways. The deck is doubled so it can be dragged past
   either end without running out, and the drag is pointer-based so it works
   with a trackpad, a mouse and a finger from the one implementation.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FormatPill {
  label: React.ReactNode;
  /** Shown instead of `label` when the band is narrow. */
  short?: React.ReactNode;
  /** Small flag on the pill's lower edge, e.g. "Coming Soon". */
  badge?: React.ReactNode;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
}

export interface DeckCard {
  src: string;
  alt?: string;
}

export const FORMAT_PILLS: FormatPill[] = [
  { label: "Printed Card", short: "Printed" },
  { label: "Digital card", short: "Digital card" },
  { label: "Invitation Card", short: "Invitation", badge: "Coming Soon" },
];

export const FORMAT_DECK: DeckCard[] = [
  { src: deck125, alt: "HeartStamp card" },
  { src: deck126, alt: "HeartStamp card" },
  { src: deck127, alt: "HeartStamp card" },
  { src: deck128, alt: "HeartStamp card" },
  { src: deck129, alt: "HeartStamp card" },
  { src: deck130, alt: "HeartStamp card" },
  { src: deck131, alt: "HeartStamp card" },
  { src: deck132, alt: "HeartStamp card" },
  { src: deck133, alt: "HeartStamp card" },
  { src: deck134, alt: "HeartStamp card" },
];

const BAND_CSS = `
.hs-fband {
  container-type: inline-size;
  width: 100%;
  box-sizing: border-box;
  background: var(--color-bg-main);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 0 var(--space-16);
  /* The band's pink tints. No design-system equivalent, so they are exposed
     here; a theme driven by a class rather than the OS should set them. */
  --hs-fband-panel: rgb(251, 216, 221);
  --hs-fband-pill: rgb(255, 228, 230);
  --hs-fband-pill-hover: rgb(255, 214, 218);
}
@media (prefers-color-scheme: dark) {
  .hs-fband {
    --hs-fband-panel: hsl(351 14% 15%);
    --hs-fband-pill: hsl(356 14% 12%);
    --hs-fband-pill-hover: hsl(354 14% 14%);
  }
}
.hs-fband__panel {
  /* This one is a panel with a ground of its own, so it is its OUTER edge that
     has to meet the grid's CONTENT edge — otherwise the pink would sit 16px
     proud of the text in every block above and below it. Same track, with the
     margin taken out of the width instead of added as padding. */
  --hs-fband-inset: calc(2 * var(--hs-track-margin, var(--grid-margin, 16px)));
  width: min(
    calc(var(--hs-track-max, var(--grid-max-width, 1200px)) - var(--hs-fband-inset)),
    calc(100% - var(--hs-fband-inset))
  );
  margin-inline: auto;
  box-sizing: border-box;
  background: var(--hs-fband-panel);
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  padding: 68px 0;
  overflow: hidden;
}
.hs-fband__top {
  align-self: stretch;
  box-sizing: border-box;
  padding: 0 var(--space-10);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: var(--space-16);
}
.hs-fband__h {
  margin: 0;
  width: 384px;
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: 30px;
  line-height: 40px;
  color: var(--color-text-primary);
}
.hs-fband__pills { position: relative; display: flex; flex-direction: row; gap: var(--space-3); align-items: flex-start; }
.hs-fband__pill {
  position: relative;
  border-radius: var(--radius-full);
  background: var(--hs-fband-pill);
  border: 1px solid var(--color-text-primary);
  padding: var(--space-3) var(--space-6);
  display: flex;
  align-items: center;
  cursor: pointer;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-h5);
  line-height: 24px;
  color: var(--color-text-primary);
  box-sizing: border-box;
  transition: background 0.15s ease;
}
.hs-fband__pill:hover { background: var(--hs-fband-pill-hover); }
.hs-fband__badge {
  /* Straddles the pill's lower edge rather than floating above it: the site
     pins it at top:38px against a 50px pill, so 12px of the badge sits over
     the pill and the rest hangs below. Centred here instead of the site's
     hardcoded left:396px, which only held for that one pill row. */
  position: absolute;
  left: 50%;
  top: calc(100% - 12px);
  transform: translateX(-50%);
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
  font-family: var(--font-family-body);
  font-weight: 500;
  font-size: var(--font-size-label-12);
  line-height: 1;
  padding: var(--space-1) var(--space-2-5);
  border-radius: var(--radius-full);
  white-space: nowrap;
}
.hs-fband__short { display: none; }
.hs-fband__mid { align-self: stretch; display: flex; flex-direction: column; gap: var(--space-6); }
.hs-fband__lede {
  margin: 0;
  align-self: flex-end;
  width: 580px;
  max-width: calc(100% - 52px);
  box-sizing: content-box;
  padding-right: 52px;
  text-align: right;
  font-family: 'Oldstyle Italic', 'Iowan Old Style', Palatino, Georgia, serif;
  font-style: italic;
  font-weight: 400;
  font-size: var(--font-size-h5);
  line-height: 20px;
  color: var(--color-text-primary);
}
.hs-fband__deck {
  align-self: stretch;
  overflow: hidden;
  cursor: grab;
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
}
.hs-fband__deck[data-dragging] { cursor: grabbing; }
.hs-fband__track { display: flex; flex-direction: row; gap: var(--space-4); width: max-content; will-change: transform; }
.hs-fband__card {
  width: 108px;
  height: 148px;
  object-fit: cover;
  flex-shrink: 0;
  display: block;
  border-radius: 0;
  pointer-events: auto;
  -webkit-user-drag: none;
  transition: border-radius 0.2s ease;
}
.hs-fband__card:hover { border-radius: var(--radius-2xl); }

@container (max-width: 900px) {
  .hs-fband__panel { padding: var(--space-5) 0; gap: var(--space-8); }
  .hs-fband__top { flex-direction: column; align-items: stretch; gap: var(--space-4); padding: 0 var(--space-4); }
  .hs-fband__h { width: 100%; font-size: 24px; line-height: 32px; }
  .hs-fband__pills { flex-wrap: wrap; }
  .hs-fband__full { display: none; }
  .hs-fband__short { display: inline; }
  .hs-fband__lede { align-self: stretch; width: auto; max-width: none; padding: 0 var(--space-4); text-align: left; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-fband__card { transition: none; }
}
`;

const BAND_CSS_MIN = cssMin(BAND_CSS);

/**
 * Drag or scroll the deck sideways. Pointer events cover mouse, trackpad and
 * touch from one path; the wheel handler takes horizontal trackpad gestures
 * and shift-scroll, and leaves plain vertical scrolling to the page.
 */
function useDragScroll(trackRef: React.RefObject<HTMLDivElement | null>, boxRef: React.RefObject<HTMLDivElement | null>) {
  React.useEffect(() => {
    const track = trackRef.current, box = boxRef.current;
    if (!track || !box) return;

    let x = 0, dragging = false, startX = 0, startOffset = 0;
    const limit = () => Math.max(0, track.scrollWidth - box.clientWidth);
    const apply = () => { track.style.transform = `translateX(${-x}px)`; };
    const move = (dx: number) => { x = Math.min(limit(), Math.max(0, x + dx)); apply(); };

    const onWheel = (e: WheelEvent) => {
      const dx = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.shiftKey ? e.deltaY : 0;
      if (!dx) return;
      e.preventDefault();
      move(dx);
    };
    const onDown = (e: PointerEvent) => {
      dragging = true; startX = e.clientX; startOffset = x;
      box.setAttribute("data-dragging", "");
      box.setPointerCapture?.(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      x = Math.min(limit(), Math.max(0, startOffset - (e.clientX - startX)));
      apply();
    };
    const onUp = (e: PointerEvent) => {
      dragging = false;
      box.removeAttribute("data-dragging");
      box.releasePointerCapture?.(e.pointerId);
    };

    box.addEventListener("wheel", onWheel, { passive: false });
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);
    return () => {
      box.removeEventListener("wheel", onWheel);
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
    };
  }, [trackRef, boxRef]);
}

export interface FormatBandProps {
  /** The heading. `false` removes it. */
  heading?: React.ReactNode | false;
  /** The format pills. `false` removes the row. */
  pills?: FormatPill[] | false;
  /** The italic line above the deck. `false` removes it. */
  lede?: React.ReactNode | false;
  /** The card deck. It is doubled internally so a drag never runs out. */
  deck?: DeckCard[] | false;
  /** The panel's ground. */
  background?: string;
  /** Fade-and-rise on scroll. Ignored under reduced motion. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The printed-versus-digital panel: a heading, the format pills, a line of
 * italic copy and a deck of cards you can drag or scroll sideways.
 */
export function FormatBand({
  heading = "Where the beautiful design meets effortless event management.",
  pills = FORMAT_PILLS,
  lede = "We have 100+ categories and a collection of 30,000+ cards available. Plus, you can create a custom card as many as you want ...",
  deck = FORMAT_DECK,
  background,
  reveal = true,
  className,
  style,
}: FormatBandProps) {
  useInjectedStyle("hs-fband", BAND_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);
  useRevealCascade(rootRef, reveal, [heading, pills, lede]);
  useDragScroll(trackRef, boxRef);

  /* Doubled, so dragging in either direction always has cards to show. */
  const cards = deck === false ? [] : deck.concat(deck);

  return (
    <div
      ref={rootRef}
      className={["hs-fband", className].filter(Boolean).join(" ")}
      style={{ ...(background ? ({ "--hs-fband-panel": background } as React.CSSProperties) : null), ...style }}
    >
      <div className="hs-fband__panel">
        {(heading !== false || pills !== false) && (
          <div className="hs-fband__top" data-reveal-stagger>
            {heading !== false && <h2 className="hs-fband__h">{heading}</h2>}
            {pills !== false && pills.length > 0 && (
              <div className="hs-fband__pills">
                {pills.map((p, i) => (
                  <button type="button" className="hs-fband__pill" key={i} onClick={p.onClick}>
                    {p.badge && <span className="hs-fband__badge">{p.badge}</span>}
                    <span className="hs-fband__full">{p.label}</span>
                    <span className="hs-fband__short">{p.short ?? p.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="hs-fband__mid">
          {lede !== false && <p className="hs-fband__lede" data-reveal>{lede}</p>}
          {cards.length > 0 && (
            <div className="hs-fband__deck" ref={boxRef}>
              <div className="hs-fband__track" ref={trackRef}>
                {cards.map((c, i) => (
                  <img className="hs-fband__card" src={c.src} alt={c.alt ?? ""} key={i} draggable={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
