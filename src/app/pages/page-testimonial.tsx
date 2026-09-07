import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { Testimonial } from "../components/blocks/hs-testimonial";

const USAGE = `import { Testimonial, TESTIMONIAL_STATS } from "@heartstampxo/design-system";

// Bare, it is the approved quote and figures:
//   <Testimonial />
// Everything below is that same block with each default written out.

<Testimonial
  // ── Content ──────────────────────────────────────────────────────────
  // Wrap the emphasised clause in <em> — it takes the brand colour, and
  // stays upright rather than italic.
  quote={<>My nan kept it on the mantelpiece for a month. She thought <em>I'd drawn it myself.</em></>}
  attribution="Priya, sent a get-well card to grandma"
  //  quote={false}  attribution={false}     // either can be dropped

  // ── Figures ──────────────────────────────────────────────────────────
  // Any number of them; each counts from zero to its value.
  //   stats={TESTIMONIAL_STATS.slice(0, 2)}
  //   stats={false}                          // removes the row
  stats={[
    { value: 12,  suffix: "k+", label: "Cards posted" },
    { value: 100, suffix: "%",  label: "One-of-a-kind" },
    { value: 24,  suffix: "h",  label: "Print to postbox" },
  ]}

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // rise + count-up; off under reduced motion
  className="my-page-quote"
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

export function PageTestimonial() {
  const [run, setRun] = React.useState(0);
  return (
    <DocPage
      title="Testimonial"
      subtitle="A customer quote over three counting statistics — the social-proof band from the marketing page."
    >
      <DocSection
        title="Testimonial"
        desc="Rendered bare it is the approved quote and figures. Every part of it is a prop; the Code tab has the whole surface written out."
        action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      >
        <Preview title="Testimonial" code={USAGE} fullWidth height={520} contentAlign="start">
          <Testimonial key={run} />
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
                    { name: "quote",       type: "ReactNode | false",    def: "the approved quote", desc: "The quote. Wrap the emphasised clause in <em> to give it the brand colour; it renders upright, not italic." },
                    { name: "attribution", type: "ReactNode | false",    def: "the approved line", desc: "Who said it. false removes the line." },
                    { name: "stats",       type: "TestimonialStat[] | false", def: "TESTIMONIAL_STATS", desc: "The counting figures — { value, suffix?, label }. Any number; false removes the row." },
                    { name: "reveal",      type: "boolean",              def: "true", desc: "Rise the band in and count the figures up. Ignored under prefers-reduced-motion." },
                    { name: "className",   type: "string",               desc: "Extra class on the block's root." },
                    { name: "style",       type: "React.CSSProperties",  desc: "Inline style on the block's root." },
                  ]} />
                  <Callout variant="info">
                    <code>TESTIMONIAL_STATS</code> and the <code>TestimonialStat</code> type are
                    exported, so you can slice the approved set or spread one entry and change a
                    single field rather than retyping it.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Motion",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Two pieces, both from the marketing page. The band rises 48px over 750ms on{" "}
                    <code>cubic-bezier(0.22, 1.18, 0.36, 1)</code> once it is 12% on screen. The
                    figures count from zero over 1600ms on a cubic ease-out, on their own observer
                    at a <strong>0.6 threshold</strong> — the row has to be properly in view, or
                    the count finishes before anyone has read it.
                  </Callout>
                  <Callout variant="info">
                    The figures are set in <code>tabular-nums</code>. Without it the row twitches
                    as the digits change width mid-count. Under{" "}
                    <code>prefers-reduced-motion: reduce</code> neither runs and the figures
                    render at their final value rather than stuck at zero.
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
            {
              title: "Sizing",
              content: (
                <Callout variant="info">
                  Container queried like the other blocks. Below 900px of the block's own width
                  the padding tightens, the stat gap drops from 64px to 20px, and the 60px figures
                  fall back to <code>--font-size-h3</code> so three of them still fit a phone.
                </Callout>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
