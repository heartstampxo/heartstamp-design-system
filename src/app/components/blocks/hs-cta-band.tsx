import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { Btn } from "../ui/btn";
import letterboxPhoto from "../../../assets/showcase/letterbox-photo.webp";

/* ═══════════════════════════════════════════════════════════════════════════
   CTA BAND — the closing call to action, above the footer.

   A headline, a supporting line and a button on the brand's dark ground. The
   three arrive in sequence rather than together, which is what stops a band
   this large from landing as one slab.
   ═══════════════════════════════════════════════════════════════════════════ */

/** The round photo that sits inline in the approved headline. */
export const CTA_BAND_PHOTO = letterboxPhoto;

/* Every default is exported, as with the other blocks, so a consumer can take
   the approved copy and change one part of it without restating the rest. */

/** The approved headline, portrait and all. */
export const CTA_BAND_HEADING = (
  <>
    Someone’s letterbox <img src={letterboxPhoto} alt="" /> is waiting. Send your’s for free
  </>
);

/** The approved supporting line. */
export const CTA_BAND_SUBHEADING =
  "At Heartstamp we’ve got greetings cards for every single occasion, including birthday cards, anniversary cards, and thank you cards.";

/** The approved button label. */
export const CTA_BAND_ACTION = "Make My Free Card";

const CTA_CSS = `
.hs-ctaband {
  container-type: inline-size;
  align-self: stretch;
  width: 100%;
  box-sizing: border-box;
  background: var(--color-brand-secondary);
  border-top: 1px solid var(--color-brand-secondary-hover);
  border-bottom: 1px solid var(--color-brand-secondary-hover);
  overflow: hidden;
  /* Horizontal padding is the grid's own margin, so the band's content lines
     up with .hs-page-grid and with every other block on the page instead of
     using a spacing token that happens to be close. */
  padding: 68px var(--hs-track-margin, var(--grid-margin, 16px));
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.hs-ctaband__inner {
  /* 790px is the measure this band was authored at, capped by the design
     system track so the block can be retuned with --hs-track-max like every
     other one rather than being pinned to a number. The track is wider than
     790px at every tier, so this is the floor that matters, not the cap. */
  width: min(790px, var(--hs-track-max, var(--grid-max-width, 1200px)));
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  align-items: center;
}
.hs-ctaband__head {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  align-items: center;
}
.hs-ctaband__h {
  margin: 0;
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 700;
  font-size: var(--font-size-h1);
  line-height: 64px;
  text-align: center;
  text-wrap: pretty;
  color: var(--color-text-on-secondary);
}
/* The inline portrait inside the headline. */
.hs-ctaband__h img {
  width: 61px;
  height: 61px;
  border-radius: 50%;
  object-fit: cover;
  display: inline-block;
  vertical-align: -14px;
}
.hs-ctaband__sub {
  width: 599px;
  max-width: 100%;
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: var(--font-size-h4);
  letter-spacing: -0.02em;
  line-height: 1.3;
  text-align: center;
  color: var(--color-text-on-secondary);
  opacity: 0.8;
}
.hs-ctaband__actions {
  display: flex;
  flex-direction: row;
  gap: var(--space-3);
  align-items: flex-start;
  flex-wrap: wrap;
  justify-content: center;
}

/* Each part waits its turn: heading, then the line under it, then the
   button. Held at zero until the band is on screen, or they would play
   against a viewport that has not reached them. */
@keyframes hs-hero-up { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }
.hs-ctaband:not([data-shown]) .hs-ctaband__h,
.hs-ctaband:not([data-shown]) .hs-ctaband__sub,
.hs-ctaband:not([data-shown]) .hs-ctaband__actions { opacity: 0; }
.hs-ctaband[data-shown] .hs-ctaband__h,
.hs-ctaband[data-shown] .hs-ctaband__sub,
.hs-ctaband[data-shown] .hs-ctaband__actions {
  animation: hs-hero-up 0.65s cubic-bezier(0.22, 1.18, 0.36, 1) both;
}
.hs-ctaband[data-shown] .hs-ctaband__h { animation-delay: 0.15s; }
.hs-ctaband[data-shown] .hs-ctaband__sub { animation-delay: 0.32s; }
.hs-ctaband[data-shown] .hs-ctaband__actions { animation-delay: 0.49s; }

@container (max-width: 900px) {
  .hs-ctaband { padding: 48px var(--space-4); }
  .hs-ctaband__inner { gap: var(--space-8); }
  .hs-ctaband__h { font-size: var(--font-size-h2); line-height: 1.15; }
  .hs-ctaband__h img { width: 40px; height: 40px; vertical-align: -9px; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-ctaband[data-shown] .hs-ctaband__h,
  .hs-ctaband[data-shown] .hs-ctaband__sub,
  .hs-ctaband[data-shown] .hs-ctaband__actions { animation: none; }
  .hs-ctaband:not([data-shown]) .hs-ctaband__h,
  .hs-ctaband:not([data-shown]) .hs-ctaband__sub,
  .hs-ctaband:not([data-shown]) .hs-ctaband__actions { opacity: 1; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-ctaband > * {
    --font-size-h1: var(--font-size-h1-sm, 34px);
    --line-height-h1: var(--line-height-h1-sm, 1.15);
    --font-size-h2: var(--font-size-h2-sm, 28px);
    --line-height-h2: var(--line-height-h2-sm, 1.2);
    --font-size-h3: var(--font-size-h3-sm, 24px);
    --line-height-h3: var(--line-height-h3-sm, 1.25);
    --font-size-h4: var(--font-size-h4-sm, 18px);
    --font-size-h5: var(--font-size-h5-sm, 16px);
    --font-size-subheadline: var(--font-size-subheadline-sm, 20px);
    --font-size-subheadline-md: var(--font-size-subheadline-sm, 20px);
  }
}
`;

const CTA_CSS_MIN = cssMin(CTA_CSS);

export interface CtaBandProps {
  /** The headline. Nodes, so an inline image or emphasis is yours to place. */
  heading?: React.ReactNode | false;
  /** The supporting line under it. `false` removes it. */
  subheading?: React.ReactNode | false;
  /** The button label. `false` removes the button. */
  action?: React.ReactNode | false;
  onAction?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Anything richer than one button — replaces the default action entirely. */
  actions?: React.ReactNode;
  /** The band's ground. @default var(--color-brand-secondary) */
  background?: string;
  /** Stagger the heading, line and button in on scroll. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The closing call to action that sits above the footer: headline, supporting
 * line and a button on the brand's dark ground.
 *
 * Bare it is the approved copy, portrait and all. The three parts arrive in
 * sequence — 0.15s, 0.32s, 0.49s — rather than together.
 */
export function CtaBand({
  heading = CTA_BAND_HEADING,
  subheading = CTA_BAND_SUBHEADING,
  action = CTA_BAND_ACTION,
  onAction,
  actions,
  background,
  reveal = true,
  className,
  style,
}: CtaBandProps) {
  useInjectedStyle("hs-ctaband", CTA_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(!reveal);

  React.useEffect(() => {
    if (!reveal) { setShown(true); return; }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      es => { if (es[0].isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  return (
    <div
      ref={rootRef}
      className={["hs-ctaband", className].filter(Boolean).join(" ")}
      style={{ ...(background ? { background } : null), ...style }}
      {...(shown ? { "data-shown": "" } : {})}
    >
      <div className="hs-ctaband__inner">
        {(heading !== false || subheading !== false) && (
          <div className="hs-ctaband__head">
            {heading !== false && <h2 className="hs-ctaband__h">{heading}</h2>}
            {subheading !== false && <span className="hs-ctaband__sub">{subheading}</span>}
          </div>
        )}
        {(actions || action !== false) && (
          <div className="hs-ctaband__actions">
            {actions ?? <Btn size="xl" onClick={onAction}>{action}</Btn>}
          </div>
        )}
      </div>
    </div>
  );
}
