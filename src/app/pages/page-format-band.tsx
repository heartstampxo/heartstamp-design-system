import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { FormatBand } from "../components/blocks/hs-format-band";

const USAGE = `import { FormatBand, FORMAT_PILLS, FORMAT_DECK } from "@heartstampxo/design-system";

// Bare, it is the approved panel:
//   <FormatBand />

<FormatBand
  heading="Where the beautiful design meets effortless event management."

  // short is shown instead of label once the band is narrow.
  //   pills={false}                       // removes the row
  pills={[
    { label: "Printed Card",    short: "Printed",    onClick: pick },
    { label: "Digital card",    short: "Digital card" },
    { label: "Invitation Card", short: "Invitation", badge: "Coming Soon" },
  ]}

  lede="We have 100+ categories and 30,000+ cards available…"   // false removes it

  // The deck is doubled internally, so a drag never runs out of cards.
  //   deck={false}                        // removes it
  deck={[{ src: myCard, alt: "Birthday card" }]}

  background="rgb(251, 216, 221)"
  reveal
/>`;


export function PageFormatBand() {

  return (
    <DocPage title="Format Band" subtitle="The printed-versus-digital panel — a heading, the format pills, a line of italic copy, and a deck of cards you can drag or scroll sideways.">
      <DocSection
        title="Format Band"
        desc="Rendered bare it is the approved panel. Drag the deck, or scroll it sideways with a trackpad."
      >
        <Preview title="Format Band" code={USAGE} fullWidth height={620} contentAlign="start">
          <FormatBand />
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
                    { name: "heading",    type: "ReactNode | false",   def: "the approved heading", desc: "The heading. false removes it." },
                    { name: "pills",      type: "FormatPill[] | false", def: "FORMAT_PILLS", desc: "The format pills — { label, short?, badge?, onClick? }. short replaces label once the band is narrow." },
                    { name: "lede",       type: "ReactNode | false",   def: "the approved line", desc: "The italic line above the deck. false removes it." },
                    { name: "deck",       type: "DeckCard[] | false",  def: "FORMAT_DECK", desc: "The card deck. Doubled internally so a drag never runs out." },
                    { name: "background", type: "string",              def: "the pink panel", desc: "The panel's ground." },
                    { name: "reveal",     type: "boolean",             def: "true", desc: "Fade-and-rise on scroll. Ignored under prefers-reduced-motion." },
                    { name: "className",  type: "string",              desc: "Extra class on the band." },
                    { name: "style",      type: "React.CSSProperties", desc: "Inline style on the band." },
                  ]} />
                </div>
              ),
            },
            {
              title: "The deck",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Drag it with a mouse or a finger, or scroll it sideways with a trackpad.
                    Pointer events cover all three from one path; the wheel handler takes
                    horizontal gestures and shift-scroll and deliberately leaves plain vertical
                    scrolling to the page, so the deck never traps the reader.
                  </Callout>
                  <Callout variant="info">
                    The deck is doubled internally, which is why a drag in either direction always
                    has cards to show. Ten cards ship as WebP at 64 KB for the set.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Theming",
              content: (
                <Callout variant="warning">
                  The pink tints have no design-system equivalent, so they are exposed as
                  <code>--hs-fband-panel</code>, <code>--hs-fband-pill</code> and
                  <code>--hs-fband-pill-hover</code>, with the site&rsquo;s light values as
                  defaults and a <code>prefers-color-scheme</code> dark set. A theme driven by a
                  class rather than the OS setting should set the three itself.
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
