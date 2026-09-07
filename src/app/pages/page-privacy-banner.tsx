import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { PrivacyBanner } from "../components/ui/hs-privacy-banner";

const USAGE = [
  'import { PrivacyBanner, PRIVACY_CATEGORIES } from "@heartstampxo/design-system";',
  '',
  '// ── One component, both layouts ──────────────────────────────────────',
  '// There is no second render and no breakpoint of your own to write. The',
  '// card and the compact bar both live inside PrivacyBanner: above 768px',
  '// you get the card, below it the bar, and the swap is CSS in the',
  '// component. Nothing to branch on.',
  '',
  '<PrivacyBanner />',
  '',
  '// That is the whole integration. Everything below is optional.',
  '',
  '',
  '// ── Configured ───────────────────────────────────────────────────────',
  '<PrivacyBanner',
  '  title="We value your privacy"',
  '  categories={PRIVACY_CATEGORIES}      // { id, label, required?, defaultOn? }',
  '',
  '  // Controlled — drive it from your own consent state:',
  '  open={!consent}',
  '  onChoice={(choice, categories) => {',
  '    // choice is "all" | "none" | "custom"; categories is { id: boolean }.',
  '    // Nothing is persisted for you — that is a legal decision, not a',
  "    // component's. Store it however your regime requires:",
  '    saveConsent(choice, categories);',
  '  }}',
  '',
  '  appearAfter={800}                    // uncontrolled trigger distance',
  '  zIndex={9400}',
  '>',
  '  We use cookies to enhance your browsing experience and analyze traffic.',
  '</PrivacyBanner>',
  '',
  '',
  '// ── Tuning the narrow-screen bar (optional) ──────────────────────────',
  '// The one worth setting: the bar pins under your header, so tell it how',
  '// tall that header is. The rest have working defaults.',
  '',
  '<PrivacyBanner',
  '  topOffset={72}                       // your header height + a little',
  '  lines={[                             // one short line at a time, instead',
  '    "We value your privacy",           // of the heading + paragraph',
  '    "Cookies help us make better cards",',
  '    "You choose what we remember",',
  '  ]}',
  '  lineInterval={3600}                  // ms per line; holds while open',
  '/>',
  '',
  '// A single line, if you would rather nothing rotated:',
  '<PrivacyBanner lines={["We value your privacy"]} />',
  '',
  '',
  '// ── variant: you almost certainly do not need this ───────────────────',
  '// "auto" is the default and is what you want. Pin one only to force a',
  '// layout regardless of screen size, or to see the bar on a desktop —',
  '// which is how the two previews above sit side by side.',
  '',
  '<PrivacyBanner variant="compact" />   // always the bar',
  '<PrivacyBanner variant="card" />      // always the card',
].join("\n");

/* Fixed children position against a transformed ancestor, not the viewport —
   which is the only way to pen this into a docs frame. */
const FRAME: React.CSSProperties = {
  position: "relative",
  transform: "translateZ(0)",
  width: "100%",
  height: 300,
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  overflow: "hidden",
  background: "var(--color-bg-main)",
};

/* The compact bar pins to the TOP of its containing block, so its frame needs
   room above rather than below. 390px wide is a phone. */
const PHONE: React.CSSProperties = {
  position: "relative",
  transform: "translateZ(0)",
  width: 390,
  maxWidth: "100%",
  /* Enough for the bar plus the toggle row it opens into, and no more — it
     pins to the top, so any extra height is dead space under it. */
  height: 190,
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-xl)",
  overflow: "hidden",
  background: "var(--color-bg-main)",
};

const LABEL: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 500,
  color: "var(--fg)",
};

export function PagePrivacyBanner() {
  const [open, setOpen] = React.useState(true);
  const [last, setLast] = React.useState<string>("—");

  /* Both frames are the same component, so one choice closes both and reports
     once — which is the point being made. */
  const record = (choice: string, cats: Record<string, boolean>) => {
    setOpen(false);
    setLast(choice + " · " + Object.entries(cats).filter(([, v]) => v).map(([k]) => k).join(", "));
  };

  return (
    <DocPage
      title="Privacy Banner"
      subtitle="The cookie consent banner: a small pinned card that expands in place to show per-category toggles, rather than a full-width bar across the reading column — and a compact top bar in its place on narrow screens."
    >
      <DocSection
        title="Privacy Banner"
        desc="One component with two layouts — the card above 768px, a compact top bar below it, swapped automatically. Both are shown together here; driven from the page so you can reopen them. Left to itself it appears once the reader has scrolled past a viewport."
      >
        <Preview title="PrivacyBanner" code={USAGE} height={520} contentAlign="start">
          <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setOpen(true)}
                style={{
                  fontSize: 12, padding: "6px 12px", borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border)", background: "var(--muted)", color: "var(--fg)", cursor: "pointer",
                }}
              >
                Reopen both
              </button>
              <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>last choice: <code>{last}</code></span>
              <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>
                you write <code>&lt;PrivacyBanner /&gt;</code> once — both layouts are inside it
              </span>
            </div>

            {/* One component, both of its layouts. The real swap is automatic
                at 768px; each frame pins one so they can sit side by side —
                a viewport media query cannot fire inside a frame. */}
            <div style={{ display: "flex", gap: "var(--space-4)", flexWrap: "wrap", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: "1 1 420px", minWidth: 0 }}>
                <span style={LABEL}>768px and up — the card</span>
                <div style={FRAME}>
                  <PrivacyBanner variant="card" open={open} onChoice={record} />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", flex: "0 0 auto" }}>
                <span style={LABEL}>below 768px — the compact bar</span>
                <div style={PHONE}>
                  <PrivacyBanner variant="compact" topOffset={16} open={open} onChoice={record} />
                </div>
                <span style={{ ...LABEL, color: "var(--muted-fg)" }}>
                  the line rotates every 3.6s — press More and it holds
                </span>
              </div>
            </div>
          </div>
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
                    { name: "title",       type: "ReactNode",            def: '"We value your privacy"', desc: "The heading." },
                    { name: "children",    type: "ReactNode",            def: "the approved line", desc: "The explanatory copy." },
                    { name: "categories",  type: "PrivacyCategory[]",    def: "PRIVACY_CATEGORIES", desc: "The switchable categories — { id, label, required?, defaultOn? }. A required one is always on and cannot be switched." },
                    { name: "open",        type: "boolean",              desc: "Show it. Omit and the banner decides for itself, appearing once the reader has scrolled past a viewport." },
                    { name: "onChoice",    type: "(choice, categories) => void", desc: 'Fires with "all" | "none" | "custom" and the resulting category map.' },
                    { name: "appearAfter", type: "number",               def: "one viewport", desc: "Scroll distance in px before it appears, when uncontrolled." },
                    { name: "lines",       type: "ReactNode[]",          def: "PRIVACY_LINES", desc: "Carousel copy for the compact bar below 768px, shown one line at a time in place of the card's title and paragraph. Pass a single-item array to hold one line." },
                    { name: "lineInterval", type: "number",              def: "3600", desc: "How long each carousel line holds, in ms. Cycling stops while the categories are open." },
                    { name: "topOffset",   type: "number | string",      def: "72", desc: "Distance from the top of the viewport for the compact bar, which sits under your header. Sets --hs-ckbar-top." },
                    { name: "variant",     type: '"auto" | "card" | "compact"', def: '"auto"', desc: "Which layout to show. auto lets the viewport decide; pin it to override — also the only way to preview the compact bar inside a frame, since the swap is a viewport media query." },
                    { name: "zIndex",      type: "number",               def: "9400", desc: "Stacking order." },
                    { name: "className",   type: "string",               desc: "Extra class on the card." },
                    { name: "style",       type: "React.CSSProperties",  desc: "Inline style on the card." },
                  ]} />
                </div>
              ),
            },
            {
              title: "Responsive — two layouts, one component",
              content: (
                      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                        <Callout variant="success">
                          <strong>One component, not two.</strong> You render{" "}
                          <code>&lt;PrivacyBanner /&gt;</code> once and it handles both screens — there is no
                          second import, no branch on screen size, and no breakpoint of your own to write.
                          Both layouts are in the component and CSS picks between them at 768px. The two
                          frames above are pinned with <code>variant</code> only so they can sit side by
                          side on a desktop; you would not set that in your app. The one prop worth
                          passing is <code>topOffset</code>, so the bar clears your header.
                        </Callout>
                        <Callout variant="info">
                          The card is 420px of heading, paragraph, three toggles and four buttons. There
                          is no arrangement of that which is not a wall on a phone, so the marketing site
                          ships a separate bar instead, and this component carries both. Below 768px the
                          card is <code>display: none</code> and the bar takes over.
                        </Callout>
                        <Callout variant="info">
                          <strong>One line at a time.</strong> Three short lines ride a horizontal track
                          on a 3.6s cycle, 520ms per move. Cycling stops the moment the categories open,
                          so the line under someone's thumb does not move while they are aiming at a
                          toggle, and it resets to the first line so the collapsed bar never returns
                          mid-cycle. Each line truncates with an ellipsis rather than wrapping the bar to
                          two rows. Pass a single-item <code>lines</code> array to hold one line.
                        </Callout>
                        <Callout variant="info">
                          <strong>Pinned to the top.</strong> The foot of a phone screen is already the
                          thumb and the browser chrome, so the bar sits under your header instead —{" "}
                          <code>topOffset</code> is that header's height plus a little, and it enters
                          downward rather than up. Expanded it stops being a pill, squares off to 24px,
                          widens to a 12px inset, and the toggle row scrolls sideways rather than
                          wrapping.
                        </Callout>
                        <Callout variant="warning">
                          Both trees are in the DOM at once and CSS picks one. That is deliberate — there
                          is no viewport measuring, so nothing flashes the wrong layout on first paint
                          and there is nothing to get wrong when hydrating. It does mean{" "}
                          <code>className</code> and <code>style</code> land on both.
                        </Callout>
                      </div>
              ),
            },
            {
              title: "Consent is not persisted",
              content: (
                <Callout variant="warning">
                  The component <strong>does not store the answer</strong>, on purpose. What to
                  keep, for how long, and under which regime is a legal decision rather than a
                  component's — and a design system guessing at it is worse than not guessing.{" "}
                  <code>onChoice</code> hands you the choice and the category map; persist it your
                  side and feed it back through <code>open</code> on the next visit. Left
                  uncontrolled the banner returns every time, which is the right default for a
                  component that cannot know what you stored.
                </Callout>
              ),
            },
            {
              title: "Behaviour",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    It holds back until the reader has scrolled past a viewport, so it does not
                    greet someone before they have seen anything. It is a 420px card pinned to the
                    bottom-left, not a bar across the page, so it never covers the column being
                    read.
                  </Callout>
                  <Callout variant="info">
                    <strong>Customize</strong> expands the toggles in place rather than opening a
                    second dialog. On a choice the card animates out — 320ms on opacity, 420ms on
                    the rise — and unmounts after, instead of disappearing mid-gesture. Both are
                    dropped under <code>prefers-reduced-motion</code>.
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
