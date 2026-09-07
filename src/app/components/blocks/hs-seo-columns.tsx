import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";

/* ═══════════════════════════════════════════════════════════════════════════
   SEO COLUMNS — the long-copy band that closes the marketing page.

   A heading over columns of prose. It exists to carry search copy, so the
   column count and the copy itself are the whole API.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface SeoColumn {
  title: React.ReactNode;
  body: React.ReactNode;
}

export const SEO_COLUMNS: SeoColumn[] = [
  {
    title: "Cards & gifts made easy",
    body: "With our reliable next day delivery service even the most last-minute of gifters can make a great impression. Simply order gifts or flowers by 9pm and we’ll deliver them the very next day. For the more organised gifters who like to get ahead of the game, you can order ahead and select a delivery date that suits you. Easy peasy! How about joining HeartStamp Plus where you can enjoy great savings and perks all year? Don’t forget to take a look at our special offers and download our app for even more ways to spread joy.",
  },
  {
    title: "Greeting cards for every occasion",
    body: "At HeartStamp we’ve got greetings cards for every single occasion, including birthday cards, anniversary cards, and thank you cards. We care about all of life’s moments, from the big celebrations, the not-so-happy-moments and everything in between; we’re here for you through all of them.",
  },
];

const SEO_CSS = `
.hs-seo {
  container-type: inline-size;
  align-self: stretch;
  width: 100%;
  background: var(--color-bg-main);
  box-sizing: border-box;
  border-top: 1px solid var(--color-element-subtle);
  border-bottom: 1px solid var(--color-element-subtle);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  align-items: center;
}
.hs-seo__inner {
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
  /* Block padding lives here, not on the root: the root establishes the
     inline-size container, and a @container query cannot style the element
     that establishes it — the narrow-tier padding below never applied while
     it targeted the root. */
  padding-block: 68px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  align-items: flex-start;
}
.hs-seo__h {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h2);
  line-height: 1.1;
  text-align: center;
  color: var(--color-text-primary);
}
.hs-seo__cols {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
  align-items: stretch;
}
.hs-seo__col {
  flex: 1;
  min-width: 0;
  box-sizing: border-box;
  padding: var(--space-10) var(--space-6) 0 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: flex-start;
}
.hs-seo__ctitle {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h4);
  line-height: 100%;
  color: var(--color-text-primary);
}
.hs-seo__cbody {
  align-self: stretch;
  font-family: var(--font-family-body);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}
/* The page stacks these and drops the asymmetric right padding, which only
   exists to keep two columns of prose apart. */
@container (max-width: 900px) {
  .hs-seo__inner { padding-block: var(--space-5); }
  .hs-seo__cols { flex-direction: column; align-items: stretch; gap: var(--space-6); }
  .hs-seo__col { padding: 0; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-seo > * {
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

const SEO_CSS_MIN = cssMin(SEO_CSS);

export interface SeoColumnsProps {
  /** The band's heading. `false` removes it. */
  heading?: React.ReactNode | false;
  /** The prose columns. Any number; they share the row evenly. */
  columns?: SeoColumn[];
  /** Fade-and-rise on scroll. Ignored under reduced motion. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The long-copy band that closes the marketing page: a heading over columns
 * of prose, bordered top and bottom.
 *
 * Bare it is the approved copy. Pass `columns` for your own — any number, they
 * share the row evenly and stack below 900px of the block's own width.
 */
export function SeoColumns({
  heading = "Send greetings cards online",
  columns = SEO_COLUMNS,
  reveal = true,
  className,
  style,
}: SeoColumnsProps) {
  useInjectedStyle("hs-seo", SEO_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  useRevealCascade(rootRef, reveal, [heading, columns]);

  return (
    <div ref={rootRef} className={["hs-seo", className].filter(Boolean).join(" ")} style={style}>
      <div className="hs-seo__inner" data-reveal-stagger>
        {heading !== false && <span className="hs-seo__h">{heading}</span>}
        {columns.length > 0 && (
          <div className="hs-seo__cols" data-reveal-stagger>
            {columns.map((c, i) => (
              <div className="hs-seo__col" key={i}>
                <span className="hs-seo__ctitle">{c.title}</span>
                <span className="hs-seo__cbody">{c.body}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
