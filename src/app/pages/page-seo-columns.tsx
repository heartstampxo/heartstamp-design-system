import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { SeoColumns } from "../components/blocks/hs-seo-columns";

const USAGE = `import { SeoColumns, SEO_COLUMNS } from "@heartstampxo/design-system";

// Bare, it is the approved copy:
//   <SeoColumns />
// Everything below is that same block with each default written out.

<SeoColumns
  heading="Send greetings cards online"     // false removes it
  // Any number of columns; they share the row evenly and stack under 900px.
  //   columns={SEO_COLUMNS.slice(0, 1)}
  //   columns={[...SEO_COLUMNS, { title: "Delivery", body: "…" }]}
  columns={[
    { title: "Cards & gifts made easy",        body: "With our reliable next day delivery service…" },
    { title: "Greeting cards for every occasion", body: "At HeartStamp we've got greetings cards…" },
  ]}
  reveal                                     // off under prefers-reduced-motion
  className="my-page-seo"
/>`;

export function PageSeoColumns() {
  return (
    <DocPage
      title="SEO Columns"
      subtitle="The long-copy band that closes the marketing page — a heading over columns of prose, bordered top and bottom."
    >
      <DocSection
        title="SEO Columns"
        desc="Rendered bare it is the approved copy. Every part of it is a prop; the Code tab has the whole surface written out."
      >
        <Preview title="SEO Columns" code={USAGE} fullWidth height={420} contentAlign="start">
          <SeoColumns />
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
                    { name: "heading",   type: "ReactNode | false",   def: '"Send greetings cards online"', desc: "The band's heading. false removes it." },
                    { name: "columns",   type: "SeoColumn[]",         def: "SEO_COLUMNS", desc: "The prose columns — { title, body }. Any number; they share the row evenly." },
                    { name: "reveal",    type: "boolean",             def: "true", desc: "Fade-and-rise on scroll. Ignored under prefers-reduced-motion." },
                    { name: "className", type: "string",              desc: "Extra class on the block's root." },
                    { name: "style",     type: "React.CSSProperties", desc: "Inline style on the block's root." },
                  ]} />
                  <Callout variant="info">
                    <code>SEO_COLUMNS</code> and the <code>SeoColumn</code> type are exported.
                    Spread a column and change one field rather than retyping the approved copy.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Motion & sizing",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Two stagger groups on the shared cascade: the heading and the row arrive
                    first, then the columns within it, 130ms apart. Same 56px rise over 950ms as
                    the other blocks, so it moves in step beside them.
                  </Callout>
                  <Callout variant="info">
                    Below 900px of the block's own width the columns stack and the asymmetric
                    right padding is dropped — it only exists to hold two columns of prose apart,
                    and reads as a stray indent once they are stacked.
                  </Callout>
                </div>
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
