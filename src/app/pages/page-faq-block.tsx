import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { FaqBlock } from "../components/blocks/hs-faq";

const USAGE = `import { FaqBlock, FAQ_GROUPS } from "@heartstampxo/design-system";

// Bare, it is the site's own question set:
//   <FaqBlock />
// Everything below is that same block with each default written out.

<FaqBlock
  // ── Content ──────────────────────────────────────────────────────────
  // A group is { label?, items: [{ q, a }] }. Omit the label and the
  // questions take the full row width.
  //   groups={FAQ_GROUPS.slice(0, 2)}            // fewer groups
  //   groups={[{ items: myQuestions }]}          // one unlabelled list
  //   groups={[{ ...FAQ_GROUPS[0], label: "Basics" }]}
  groups={FAQ_GROUPS}

  // q and a take nodes, not just strings:
  //   { q: <>Refunds <em>after</em> dispatch?</>, a: <p>Yes — <a href="/help">read more</a>.</p> }

  // ── Open state ───────────────────────────────────────────────────────
  singleOpen                                 // one answer open across ALL groups
  defaultOpen={[0, 0]}                       // [group, item]; null starts closed
  onToggle={(group, item, open) => track("faq", { group, item, open })}

  // ── Chrome ───────────────────────────────────────────────────────────
  dividers                                   // rules between groups
  padding="68px var(--space-6)"

  // ── Behaviour ────────────────────────────────────────────────────────
  reveal                                     // off under prefers-reduced-motion
  className="my-page-faq"
/>`;

const ACCORDION_ONLY = `import { FaqAccordion } from "@heartstampxo/design-system";

// The list on its own, without the section chrome around it.
<FaqAccordion
  items={[{ q: "How do credits work?", a: "They pay for art generation." }]}
  defaultOpenIndex={0}      // null starts closed
  collapsible               // clicking the open row closes it
  onToggle={(i, open) => track("faq-row", { i, open })}
/>

// Controlled, if the open row lives in your own state:
<FaqAccordion items={items} openIndex={open} onToggle={i => setOpen(i)} />`;

function ReplayButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: "inline-flex", alignItems: "center", gap: 6, cursor: "pointer",
        fontSize: 11.5, fontWeight: "var(--font-weight-medium, 500)" as any,
        padding: "5px 11px", borderRadius: "var(--radius-full)",
        border: "1px solid var(--border)", background: "var(--muted)", color: "var(--fg)",
        whiteSpace: "nowrap" as const,
      }}
    >
      <RotateCw size={12} aria-hidden="true" /> Replay motion
    </button>
  );
}

export function PageFaqBlock() {
  const [run, setRun] = React.useState(0);

  return (
    <DocPage
      title="FAQ"
      subtitle="The marketing site's question section — labelled groups, a rule between each, and one answer open across the whole list. The accordion inside it ships separately, for a list with no section chrome around it."
    >
      <DocSection
        title="FAQ"
        desc="Rendered bare it is the site's own question set. Every part of it is a prop — the Code tab has the whole surface written out."
        action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      >
        <Preview title="FAQ" code={USAGE} fullWidth height={860} contentAlign="start">
          <FaqBlock key={run} />
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
                    { name: "groups",      type: "FaqGroup[]",                       def: "FAQ_GROUPS", desc: "The labelled groups. A group is { label?, items: [{ q, a }] }; omit the label and its questions take the full row." },
                    { name: "singleOpen",  type: "boolean",                          def: "true", desc: "One answer open across every group, the way the marketing page behaves. false gives each group its own open row." },
                    { name: "defaultOpen", type: "[number, number] | null",          def: "[0, 0]", desc: "Which row starts open, as [group, item]. null starts fully closed." },
                    { name: "dividers",    type: "boolean",                          def: "true", desc: "Rules between groups." },
                    { name: "padding",     type: "string",                           def: '"68px var(--space-6)"', desc: "Section padding, as a CSS shorthand." },
                    { name: "reveal",      type: "boolean",                          def: "true", desc: "Scroll-in cascade. Ignored under prefers-reduced-motion." },
                    { name: "onToggle",    type: "(g: number, i: number, open: boolean) => void", desc: "Fires with the group and item indices, and whether that row is now open." },
                    { name: "className",   type: "string",                           desc: "Extra class on the section root." },
                    { name: "style",       type: "React.CSSProperties",              desc: "Inline style on the section root." },
                  ]} />
                  <Callout variant="info">
                    <code>FAQ_GROUPS</code> and the <code>FaqGroup</code> / <code>FaqItem</code>{" "}
                    types are exported, so you can slice the approved set or spread one group and
                    change a single field rather than retyping the copy. <code>q</code> and{" "}
                    <code>a</code> take nodes, not just strings — links and emphasis work.
                  </Callout>
                </div>
              ),
            },
            {
              title: "The accordion on its own",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <Callout variant="info">
                    <code>FaqAccordion</code> is the question list without the section around it —
                    documented, with a live example, on the{" "}
                    <a href="#accordion" style={{ color: "var(--color-element-link, inherit)" }}>Accordion</a>{" "}
                    page beside the general-purpose <code>Acc</code>. Use it when you want these
                    rows inside your own layout; use <code>FaqBlock</code> for the whole section.
                  </Callout>
                  <PropsTable props={[
                    { name: "items",            type: "FaqItem[]",                        required: true, desc: "The rows. q and a both take nodes." },
                    { name: "openIndex",        type: "number | null",                    desc: "Controlled open row. null closes them all. Omit to let the component keep its own state." },
                    { name: "defaultOpenIndex", type: "number | null",                    def: "0", desc: "Uncontrolled starting row. null starts closed." },
                    { name: "collapsible",      type: "boolean",                          def: "true", desc: "Let the open row be closed by clicking it again." },
                    { name: "onToggle",         type: "(i: number, open: boolean) => void", desc: "Fires with the row clicked and whether it is now open." },
                    { name: "revealStagger",    type: "boolean",                          def: "false", desc: "Tag the list as a reveal stagger group for a surrounding cascade. Does nothing without one above it." },
                    { name: "className",        type: "string",                           desc: "Extra class on the list root." },
                    { name: "style",            type: "React.CSSProperties",              desc: "Inline style on the list root." },
                  ]} />
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
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Like the other blocks this measures its own container, not the window:{" "}
                    <code>container-type: inline-size</code>. Below <strong>900px of its own
                    width</strong> the group label moves above its questions instead of sitting
                    beside them, and the list gives up its 872px / 72% cap for the full row.
                  </Callout>
                  <Callout variant="info">
                    Width comes from <code>--hs-grid</code>, falling back to 1200px. Set it on an
                    ancestor to line the section up with a host page's own column.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Motion",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Opening a row animates <code>grid-template-rows</code> from{" "}
                    <code>0fr</code> to <code>1fr</code> over 380ms rather than animating a
                    height, so the answer grows to whatever height its text actually needs and
                    nothing has to be measured. The answer fades over 260ms and the plus loses its
                    upright stroke over 320ms, turning into a minus.
                  </Callout>
                  <Callout variant="info">
                    On scroll the rules, the group labels and the questions ride the same cascade
                    as the other blocks — 56px up over 950ms on{" "}
                    <code>cubic-bezier(0.22, 1, 0.36, 1)</code>, questions 130ms apart. Under{" "}
                    <code>prefers-reduced-motion: reduce</code> both the cascade and the
                    open/close transitions are dropped; the rows still open, just instantly.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Accessibility",
              content: (
                <Callout variant="info">
                  Rows are real <code>&lt;button&gt;</code> elements carrying{" "}
                  <code>aria-expanded</code> and <code>aria-controls</code>, so the list is
                  keyboard operable and announced correctly. The canvas original was a{" "}
                  <code>&lt;div&gt;</code> with an <code>onClick</code>, reachable only by mouse —
                  that is the one deliberate departure from it.
                </Callout>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
