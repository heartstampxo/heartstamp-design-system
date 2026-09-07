import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { UspGrid } from "../components/blocks/hs-usp-grid";

const USAGE = `import { UspGrid, USP_ITEMS } from "@heartstampxo/design-system";

// Bare, it is the approved nine selling points:
//   <UspGrid />
// Everything below is that same block with each default written out.

<UspGrid
  eyebrow="Why We Are different"        // false removes it
  heading="Anything but off-the-shelf"   // false removes it

  // Any number of items — the grid reflows. Spread one to change a field.
  //   items={USP_ITEMS.slice(0, 6)}
  //   items={[{ ...USP_ITEMS[0], desc: "New copy" }]}
  items={[
    // icon is path data drawn on a 40x40 viewBox, filled with currentColor
    // so the hover tint reaches it:
    { icon: "M12 2 2 7l10 5 10-5-10-5z", title: "Free delivery", desc: "On every order." },
    // …or hand it a whole element when one path will not do:
    { iconNode: <MyIcon />, title: "Gift wrap", desc: "Included, always." },
  ]}
  columns={3}                            // drops to 2, then 1, as it narrows
  reveal                                 // off under prefers-reduced-motion
/>`;

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} style={{
      display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
      fontSize: 11.5, fontWeight: "var(--font-weight-medium, 500)" as any,
      padding: "5px 11px", borderRadius: "var(--radius-full)",
      border: "1px solid var(--border)", background: "var(--muted)", color: "var(--fg)",
      whiteSpace: "nowrap" as const,
    }}>
      <RotateCw size={12} aria-hidden="true" /> Replay motion
    </button>
  );
}

export function PageUspGrid() {
  const [run, setRun] = React.useState(0);

  return (
    <DocPage title="USP Grid" subtitle="The “Why we are different” grid — an eyebrow and headline over selling points, each with an icon that lifts and tints on hover.">
      <DocSection
        title="USP Grid"
        desc="Rendered bare it is the approved nine. Every part of it is a prop; the Code tab has the whole surface written out."
        action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      >
        <Preview title="USP Grid" code={USAGE} fullWidth height={900} contentAlign="start">
          <UspGrid key={run} />
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
                    { name: "eyebrow",   type: "ReactNode | false",   def: '"Why We Are different"', desc: "Small uppercase line above the headline. false removes it." },
                    { name: "heading",   type: "ReactNode | false",   def: '"Anything but off-the-shelf"', desc: "The headline. false removes it." },
                    { name: "items",     type: "UspItem[]",           def: "USP_ITEMS", desc: "The selling points — { title, desc, icon? | iconNode? }. Any number; the grid reflows." },
                    { name: "columns",   type: "number",              def: "3", desc: "Columns on the widest tier. Drops to 2 below 900px of the block width and 1 below 560px regardless." },
                    { name: "reveal",    type: "boolean",             def: "true", desc: "Fade-and-rise on scroll. Ignored under prefers-reduced-motion." },
                    { name: "className", type: "string",              desc: "Extra class on the block's root." },
                    { name: "style",     type: "React.CSSProperties", desc: "Inline style on the block's root." },
                  ]} />
                </div>
              ),
            },
            {
              title: "Icons",
              content: (
                <Callout variant="info">
                  Pass <code>icon</code> as SVG path data on a <strong>40x40 viewBox</strong> — it
                  is filled with <code>currentColor</code>, which is what lets the hover tint
                  reach it. For anything a single path cannot express, pass{" "}
                  <code>iconNode</code> instead and it is rendered as-is; make sure it inherits
                  colour the same way. <code>USP_ITEMS</code> and the <code>UspItem</code> type
                  are exported.
                </Callout>
              ),
            },
            {
              title: "Motion",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Two stagger groups on the shared cascade — the heading, then the cells, 130ms
                    apart. On hover a cell lifts its icon 4px and tints it{" "}
                    <code>--color-brand-primary</code> over 150ms.
                  </Callout>
                  <Callout variant="info">
                    The marketing page drives that hover from its behaviour class, tracking the
                    cell under the pointer in React state. Here it is plain CSS — the same result
                    without a re-render on every mouse movement across nine cells.
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
