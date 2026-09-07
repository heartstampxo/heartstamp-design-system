import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { safeHref } from "../ui/hs-url";

/* ═══════════════════════════════════════════════════════════════════════════
   ANNOUNCEMENT BAR — the offer strip that runs above the navigation.

   One line of copy, a chevron, and the brand pink. Dismissible, because a
   promotional strip that cannot be closed is a nuisance on a return visit.
   ═══════════════════════════════════════════════════════════════════════════ */

/**
 * The approved offer line. Exported, as with the other blocks, so a consumer
 * can render the approved copy explicitly or build from it rather than
 * retyping it.
 */
export const ANNOUNCEMENT_BAR_LABEL =
  "New to HeartStamp? 50% off your first card order — no code needed, it’s already applied";

const BAR_CSS = `
/* The wrapper exists only so the dismiss control can sit beside the bar
   rather than inside it — a button inside a button is invalid. It has to
   carry a width of its own: the bar below is an inline-size container, so its
   own width is resolved WITHOUT measuring its contents, and 100% of a
   shrink-to-fit parent is nothing. Dropped into a flex canvas that collapses
   the whole bar to a sliver. */
/* Containment sits on the wrapper so the bar itself stays styleable from a
   @container query — an element cannot be matched by the container it
   establishes, which is why the narrow-tier padding never applied. */
.hs-annbar__wrap {
  container-type: inline-size;
  position: relative;
  display: flex;
  width: 100%;
}
.hs-annbar {
  width: 100%;
  box-sizing: border-box;
  /* Brand pink in both themes, so the ink is pinned dark in both rather than
     read from --color-text-primary, which flips to near-white on it. */
  background: var(--hs-annbar-bg, var(--color-brand-lockup-heart));
  color: var(--hs-annbar-ink, #242423);
  display: flex;
  flex-direction: row;
  gap: 5px;
  padding: var(--space-1-5) var(--space-2);
  justify-content: center;
  align-items: center;
  border: 0;
  font: inherit;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
}
.hs-annbar__t {
  font-family: var(--font-family-body);
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
  white-space: nowrap;
  /* The ground is full-bleed by design — it is a strip above the navigation —
     but the line inside it is held to the design system track, so a longer
     offer wraps at the same measure as the page beneath it rather than
     running the whole width of a wide screen. Retunable per instance with
     --hs-track-max, like every other block. */
  max-width: var(--hs-track-max, var(--grid-max-width, 1200px));
}
.hs-annbar svg { display: block; flex: none; }
.hs-annbar__x {
  position: absolute;
  right: var(--space-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 0;
  border-radius: var(--radius-full);
  background: transparent;
  color: inherit;
  cursor: pointer;
}
.hs-annbar__x:hover { background: rgba(0, 0, 0, 0.08); }
.hs-annbar--closable { position: relative; padding-right: 44px; }
/* The line is set nowrap so it never breaks mid-offer; on a narrow bar it
   wraps rather than overflowing the page. */
@container (max-width: 720px) {
  .hs-annbar__t { white-space: normal; font-size: 14px; line-height: 20px; }
  .hs-annbar { padding: var(--space-2) var(--space-3); }
  .hs-annbar--closable { padding-right: var(--space-10); }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-annbar__wrap > * {
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

const BAR_CSS_MIN = cssMin(BAR_CSS);

export interface AnnouncementBarProps {
  /** The line of copy. */
  children?: React.ReactNode;
  /** Renders an anchor instead of a button. */
  href?: string;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  /** Hide the trailing chevron. @default false */
  hideChevron?: boolean;
  /** Add a close button. Fires `onDismiss` and hides the bar. @default false */
  dismissible?: boolean;
  onDismiss?: () => void;
  /** Render nothing. Useful when visibility is driven from your own state. */
  hidden?: boolean;
  /** The bar's ground. Brand pink by default, in both themes. */
  background?: string;
  /** The bar's ink. Fixed dark by default, because the ground is fixed. */
  color?: string;
  className?: string;
  style?: React.CSSProperties;
}

const Chevron = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
);

/**
 * The offer strip that runs above the navigation: one line, a chevron, brand
 * pink.
 *
 * With an `href` it renders an anchor, without one a button. `dismissible`
 * adds a close control and hides the bar when it is used.
 */
export function AnnouncementBar({
  children = ANNOUNCEMENT_BAR_LABEL,
  href,
  onClick,
  hideChevron = false,
  dismissible = false,
  onDismiss,
  hidden = false,
  background,
  color,
  className,
  style,
}: AnnouncementBarProps) {
  useInjectedStyle("hs-annbar", BAR_CSS_MIN);
  const [closed, setClosed] = React.useState(false);
  if (hidden || closed) return null;

  const cls = ["hs-annbar", dismissible ? "hs-annbar--closable" : "", className].filter(Boolean).join(" ");
  const vars: React.CSSProperties = {
    ...(background ? ({ "--hs-annbar-bg": background } as React.CSSProperties) : null),
    ...(color ? ({ "--hs-annbar-ink": color } as React.CSSProperties) : null),
    ...style,
  };
  const inner = (
    <>
      <span className="hs-annbar__t">{children}</span>
      {!hideChevron && <Chevron />}
    </>
  );

  return (
    <div className="hs-annbar__wrap">
      {href ? (
        <a className={cls} style={vars} href={safeHref(href)} onClick={onClick}>{inner}</a>
      ) : (
        <button type="button" className={cls} style={vars} onClick={onClick}>{inner}</button>
      )}
      {dismissible && (
        <button
          type="button"
          className="hs-annbar__x"
          aria-label="Dismiss announcement"
          onClick={() => { setClosed(true); onDismiss?.(); }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18" /><path d="m6 6 12 12" />
          </svg>
        </button>
      )}
    </div>
  );
}
