import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";
import { safeHref } from "../ui/hs-url";

import bannerClip from "../../../assets/deals/banner.mp4";
import card3dClip from "../../../assets/deals/card-3d.mp4";
import badge25 from "../../../assets/deals/discount-1.svg?url";
import badge50 from "../../../assets/deals/discount-2.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   DEALS — "Shop This Week's Top Deals".

   Two offer cards side by side. The first lays copy over a clip behind a
   gradient scrim; the second splits into a solid panel and a clip, with the
   discount badge straddling the seam between them.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface DealMedia {
  src: string;
  poster?: string;
}

export interface DealCard {
  title: React.ReactNode;
  desc: React.ReactNode;
  action?: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Badge art, dropped into the card's corner. */
  badge?: { src: string; alt: string } | false;
  video?: DealMedia;
  image?: string;
  /**
   * "overlay" lays the copy over the media behind a scrim; "split" puts it on
   * a solid panel beside the media.
   */
  layout?: "overlay" | "split";
  /** The solid panel's colour, for a split card. */
  panel?: string;
}

export const DEAL_CARDS: DealCard[] = [
  {
    layout: "overlay",
    title: "Save more on custom printed cards",
    desc: "No need to wait for the holidays, design your cards now using the photos.",
    action: "Make My Free Card",
    href: "#",
    video: { src: bannerClip },
    badge: { src: badge25, alt: "25% off" },
  },
  {
    layout: "split",
    panel: "rgb(200, 32, 47)",
    title: "Get 50% off digital cards",
    desc: "No need to wait for the holidays, design your cards now using the photos.",
    action: "Make My Free Card",
    href: "#",
    video: { src: card3dClip },
    badge: { src: badge50, alt: "50% off" },
  },
];

const DEALS_CSS = `
/* Containment sits on this wrapper, not on .hs-deals: an element cannot be
   matched by the @container query it establishes, so the narrow-tier padding
   and gap below never applied while the panel was its own container. */
.hs-deals__ct {
  container-type: inline-size;
  display: flex;
  width: 100%;
}
.hs-deals {
  width: 100%;
  box-sizing: border-box;
  background: var(--hs-deals-panel, var(--color-brand-secondary-dim));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-10);
  padding: 64px 0 72px;
}
.hs-deals__h {
  margin: 0;
  align-self: stretch;
  text-align: center;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-h3);
  line-height: 40px;
  color: var(--color-text-primary);
}
.hs-deals__row {
  /* The design system grid track. Its contract: --grid-max-width is the OUTER
     width and --grid-margin is subtracted from inside it, so content lands at
     1168px on the 1200px tier and lines up with .hs-page-grid — and the wide
     tier follows automatically, because tokens.css restates --grid-max-width
     as 1400px at >= 2000px. Retune one block with --hs-track-max /
     --hs-track-margin rather than redefining the grid tokens, which would
     retune every consumer in the subtree and, if pinned to a number, sever
     the wide tier. */
  width: min(var(--hs-track-max, var(--grid-max-width, 1200px)), 100%);
  margin-inline: auto;
  padding-inline: var(--hs-track-margin, var(--grid-margin, 16px));
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
}
.hs-deals__card {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 288px;
  overflow: hidden;
}
.hs-deals__card--split { display: flex; flex-direction: row; }
.hs-deals__media { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
/* The scrim: transparent at the top, solid where the copy sits. */
.hs-deals__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(30, 41, 59, 0) 0%, rgba(30, 41, 59, 0.9) 70%, rgb(30, 41, 59) 100%);
  pointer-events: none;
}
.hs-deals__cap {
  position: absolute;
  left: 32px;
  bottom: 70px;
  width: 517px;
  max-width: calc(100% - 64px);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  pointer-events: none;
}
.hs-deals__t {
  margin: 0;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-subheadline);
  line-height: 24px;
  color: var(--color-text-on-primary);
}
.hs-deals__d {
  margin: 0;
  font-family: var(--font-family-body);
  font-size: var(--font-size-body-15);
  line-height: 20px;
  color: color-mix(in srgb, var(--color-text-on-primary) 90%, transparent);
}
/* A translucent pill on the media, so it reads on any frame beneath it. */
.hs-deals__btn {
  height: 36px;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.14);
  padding: 0 var(--space-4);
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  border: 0;
  font-family: var(--font-family-body);
  font-weight: 500;
  font-size: 16px;
  line-height: 20px;
  color: var(--color-text-on-primary);
  text-decoration: none;
  transition: background 0.15s ease;
}
.hs-deals__btn:hover { background: rgba(255, 255, 255, 0.24); }
.hs-deals__card--overlay .hs-deals__btn { position: absolute; left: 32px; bottom: 21px; }
.hs-deals__badge { position: absolute; width: 104px; height: 100px; display: block; pointer-events: none; }
.hs-deals__card--overlay .hs-deals__badge { right: 18px; top: 16px; }
/* On the split card the badge straddles the seam between panel and media. */
.hs-deals__card--split .hs-deals__badge { left: 0; top: 16px; transform: translateX(-50%); z-index: 1; }

.hs-deals__panel {
  width: 47%;
  box-sizing: border-box;
  padding: var(--space-8);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
}
.hs-deals__panel .hs-deals__t { padding-right: 44px; line-height: 1.2; }
.hs-deals__panel .hs-deals__d { line-height: 1.45; color: color-mix(in srgb, var(--color-text-on-primary) 85%, transparent); }
.hs-deals__panel .hs-deals__btn { margin-top: var(--space-2); height: 44px; padding: 0 22px; font-weight: 600; font-size: var(--font-size-body-15); }
.hs-deals__side { position: relative; width: 53%; }
.hs-deals__side .hs-deals__media { position: relative; }

@container (max-width: 900px) {
  .hs-deals { padding: var(--space-10) 0 var(--space-12); gap: var(--space-8); }
  .hs-deals__row { flex-direction: column; }
  .hs-deals__cap { width: auto; right: 32px; }
  /* Stacked, the split card is taller than it is wide; side by side its two
     halves would each be too narrow to hold their copy. */
  .hs-deals__card--split { flex-direction: column; height: auto; }
  .hs-deals__panel, .hs-deals__side { width: 100%; }
  .hs-deals__side { height: 200px; }
  .hs-deals__card--split .hs-deals__badge { left: auto; right: 18px; transform: none; }
}
`;

const DEALS_CSS_MIN = cssMin(DEALS_CSS);

export interface DealsProps {
  /** The section heading. `false` removes it. */
  heading?: React.ReactNode | false;
  /** The offer cards. Any number; they share the row evenly. */
  cards?: DealCard[];
  /** The band's ground. */
  background?: string;
  /** Fade-and-rise on scroll. Ignored under reduced motion. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * "Shop This Week's Top Deals" — offer cards over video.
 *
 * Each card is either `overlay` (copy over the media, behind a scrim) or
 * `split` (a solid panel beside the media, badge straddling the seam).
 */
export function Deals({
  heading = "Shop This Week’s Top Deals",
  cards = DEAL_CARDS,
  background,
  reveal = true,
  className,
  style,
}: DealsProps) {
  useInjectedStyle("hs-deals", DEALS_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  useRevealCascade(rootRef, reveal, [cards, heading]);

  const media = (c: DealCard) =>
    c.video ? (
      <video className="hs-deals__media" src={c.video.src} poster={c.video.poster} autoPlay muted loop playsInline preload="auto" />
    ) : c.image ? (
      <img className="hs-deals__media" src={c.image} alt="" />
    ) : null;

  const button = (c: DealCard) =>
    c.action ? (
      c.href ? (
        <a className="hs-deals__btn" href={safeHref(c.href)} onClick={c.onClick}>{c.action}</a>
      ) : (
        <button type="button" className="hs-deals__btn" onClick={c.onClick}>{c.action}</button>
      )
    ) : null;

  return (
    <div className="hs-deals__ct">
      <div
        ref={rootRef}
        className={["hs-deals", className].filter(Boolean).join(" ")}
        style={{ ...(background ? ({ "--hs-deals-panel": background } as React.CSSProperties) : null), ...style }}
      >
        {heading !== false && <h2 className="hs-deals__h">{heading}</h2>}
        {cards.length > 0 && (
          <div className="hs-deals__row" data-reveal-stagger>
            {cards.map((c, i) =>
              (c.layout ?? "overlay") === "split" ? (
                <div className="hs-deals__card hs-deals__card--split" key={i}>
                  <div className="hs-deals__panel" style={{ background: c.panel ?? "var(--color-brand-primary)" }}>
                    <h3 className="hs-deals__t">{c.title}</h3>
                    <p className="hs-deals__d">{c.desc}</p>
                    {button(c)}
                  </div>
                  <div className="hs-deals__side">
                    {c.badge !== false && c.badge && <img className="hs-deals__badge" src={c.badge.src} alt={c.badge.alt} />}
                    {media(c)}
                  </div>
                </div>
              ) : (
                <div className="hs-deals__card hs-deals__card--overlay" key={i}>
                  {media(c)}
                  <div className="hs-deals__scrim" aria-hidden="true" />
                  <div className="hs-deals__cap">
                    <h3 className="hs-deals__t">{c.title}</h3>
                    <p className="hs-deals__d">{c.desc}</p>
                  </div>
                  {button(c)}
                  {c.badge !== false && c.badge && <img className="hs-deals__badge" src={c.badge.src} alt={c.badge.alt} />}
                </div>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
}
