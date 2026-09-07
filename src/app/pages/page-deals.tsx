import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { Deals } from "../components/blocks/hs-deals";

const USAGE = `import { Deals, DEAL_CARDS } from "@heartstampxo/design-system";

// Bare, it is the approved pair of offers:
//   <Deals />

<Deals
  heading="Shop This Week&rsquo;s Top Deals"        // false removes it

  // Any number of cards; they share the row evenly.
  //   cards={DEAL_CARDS.slice(0, 1)}
  cards={[
    {
      layout: "overlay",              // copy over the media, behind a scrim
      title: "Save more on custom printed cards",
      desc: "Design your cards now using the photos.",
      action: "Make My Free Card", href: "/create",
      video: { src: "/video/banner.mp4", poster: "/img/banner.jpg" },
      badge: { src: badge25, alt: "25% off" },      // false removes it
    },
    {
      layout: "split",                // solid panel beside the media
      panel: "rgb(200, 32, 47)",
      title: "Get 50% off digital cards",
      desc: "No need to wait for the holidays.",
      action: "Make My Free Card", href: "/digital",
      video: { src: "/video/3d-card.mp4" },
      badge: { src: badge50, alt: "50% off" },      // straddles the seam
    },
  ]}

  background="var(--color-brand-secondary-dim)"
  reveal
/>`;


export function PageDeals() {

  return (
    <DocPage title="Deals" subtitle="Offer cards over video — the weekly promotions band. Each card is either copy laid over the media behind a scrim, or a solid panel beside it.">
      <DocSection
        title="Deals"
        desc="Rendered bare it is the approved pair. Every part of it is a prop; the Code tab has the whole surface written out."
      >
        <Preview title="Deals" code={USAGE} fullWidth height={520} contentAlign="start">
          <Deals />
        </Preview>

        <Acc
          multiple
          defaultOpen={[0]}
          items={[
            {
              title: "Props",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <PropsTable props={[
                    { name: "heading",    type: "ReactNode | false",   def: '"Shop This Week\u2019s Top Deals"', desc: "The section heading. false removes it." },
                    { name: "cards",      type: "DealCard[]",          def: "DEAL_CARDS", desc: "The offer cards. Each is layout overlay or split, with title, desc, action, href, video | image and badge." },
                    { name: "background", type: "string",              def: "var(--color-brand-secondary-dim)", desc: "The band's ground." },
                    { name: "reveal",     type: "boolean",             def: "true", desc: "Fade-and-rise on scroll. Ignored under prefers-reduced-motion." },
                    { name: "className",  type: "string",              desc: "Extra class on the band." },
                    { name: "style",      type: "React.CSSProperties", desc: "Inline style on the band." },
                  ]} />
                </div>
              ),
            },
            {
              title: "Layouts",
              content: (
                <Callout variant="info">
                  <strong>overlay</strong> lays the copy over the media behind a gradient scrim —
                  transparent at the top, solid where the words sit, so they read on any frame
                  beneath them. <strong>split</strong> puts the copy on a solid panel beside the
                  media, with the discount badge straddling the seam between the two. Stacked
                  below 900px the split card goes vertical, since side by side its halves are too
                  narrow to hold their copy.
                </Callout>
              ),
            },
            {
              title: "Grid",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="warning">
                    This block sits on the design system grid, so the host page must import it:
                    <br />
                    <code>@import "@heartstampxo/design-system/tokens.css";</code>
                    <br />
                    <code>@import "@heartstampxo/design-system/grid.css";</code>
                    <br />
                    Both, not just the grid — <code>tokens.css</code> carries the media query that
                    restates <code>--grid-max-width</code> as 1400px at 2000px and up. With only
                    the grid imported the var() fallbacks hold it at 1200px, so the wide tier
                    silently never arrives rather than visibly breaking.
                  </Callout>
                  <Callout variant="info">
                    The track is <code>min(--grid-max-width, 100%)</code> with{" "}
                    <code>--grid-margin</code> as inside padding — the grid's own contract, where
                    the max-width is the OUTER measure. Content lands at 1168px on the 1200px tier
                    and lines up with <code>.hs-page-grid</code> exactly. To retune one block, set{" "}
                    <code>--hs-track-max</code> or <code>--hs-track-margin</code> on it rather than
                    redefining the grid tokens, which retunes every consumer in the subtree and,
                    pinned to a number, severs the wide tier.
                  </Callout>
                </div>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
