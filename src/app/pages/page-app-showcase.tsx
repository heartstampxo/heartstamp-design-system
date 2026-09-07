import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { AppShowcase } from "../components/blocks/hs-app-showcase";

const USAGE = `import {
  AppShowcase,
  APP_SHOWCASE_STEPS,
  APP_SHOWCASE_STEPS_PANEL,
  APP_SHOWCASE_BADGE,
} from "@heartstampxo/design-system";

// Bare, it is the approved three-up row:
//   <AppShowcase />
// Everything below is that same row with each default written out.

<AppShowcase
  // ── Left: the iOS panel ──────────────────────────────────────────────
  //   ios={false}                          // drops the column entirely
  ios={{
    heading: "Meet HeartStamp on IOS",
    desc: "Send a card from the couch, the queue, or the car. No desk, no laptop, no waiting.",
    badge: { href: "https://apps.apple.com/…" },   // false removes the button

    // The phone clip ships with the package and plays by default. Point these
    // at your own to host them yourself, or drop them for a static panel.
    //   omit video entirely and the still shows instead
    video: {
      src: "/video/iphone.webm",           // alpha WebM
      fallbackSrc: "/video/iphone.mp4",    // optional; Safari cannot play alpha WebM
      poster: "/img/iphone.png",           // shown while it loads
    },
    image: myPhoneShot,                    // the poster AND the Safari fallback
    //   image: false                      // copy only, no device
  }}

  // ── Middle: how a card gets made ─────────────────────────────────────
  steps={{
    heading: <>Tell us the moment. We’ll handle the rest</>,
    desc: <>Meet the <u>world’s first AI-powered</u> greeting card platform.</>,
    // Exactly three cards are drawn — the tilts and overlaps are authored for
    // three. Spread the approved set, or pass your own with a plain icon.
    //   steps={APP_SHOWCASE_STEPS.slice(0, 3)}
    //   steps={[{ icon: "/icons/pen.svg", title: "Write it", desc: "…" }]}
    steps: APP_SHOWCASE_STEPS,
  }}

  // ── Right: digital cards ─────────────────────────────────────────────
  digital={{
    heading: "A digital card unlike anything you’ve seen",
    desc: "500+ animated backgrounds, effects, and stamps…",
    cta: { label: "Get started for free", href: "/signup", onClick: track },
    //  cta={false}                          // removes the button
    // The clip ships too, alpha and all. image is its poster and its
    // no-video fallback — give it alpha so it composites like the clip does.
    //   image: myTabletShot   |   image: false
    video: { src: "/video/digital.webm", poster: "/img/digital.webp" },
    prompt: { text: "Make me a digital graduation card for my daughter." },
    //  prompt={false}                       // removes the floating bar
  }}

  // ── Appearance & behaviour ───────────────────────────────────────────
  panelBackground="var(--color-brand-secondary-dim)"      // themed by default; pin it if you must
  reveal                                    // off under prefers-reduced-motion
  className="my-page-showcase"
/>`;

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

export function PageAppShowcase() {
  const [run, setRun] = React.useState(0);

  return (
    <DocPage
      title="App Showcase"
      subtitle="The marketing site's three-up device row — the iOS app, how a card gets made, and digital cards. Each panel is drawn on a fixed canvas and scaled to its column, which is what keeps the tilted step cards in register at every width."
    >
      <DocSection
        title="App Showcase"
        desc="Rendered bare it is the approved row, complete and moving — both device clips ship with the package. Every part of it is a prop; the Code tab has the whole surface written out."
        action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      >
        <Preview title="App Showcase" code={USAGE} fullWidth height={780} contentAlign="start">
          <AppShowcase key={run} />
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
                    { name: "ios",             type: "AppShowcaseIosPanel | false",     def: "APP_SHOWCASE_IOS", desc: "The left panel: heading, copy, App Store button and the phone clip. false drops the column and the grid re-flows." },
                    { name: "steps",           type: "AppShowcaseStepsPanel | false",   def: "APP_SHOWCASE_STEPS_PANEL", desc: "The middle panel: heading, copy and the three tilted cards. false drops the column." },
                    { name: "digital",         type: "AppShowcaseDigitalPanel | false", def: "APP_SHOWCASE_DIGITAL", desc: "The right panel: tablet clip, floating prompt bar, copy and button. false drops the column." },
                    { name: "panelBackground", type: "string",                          def: "var(--color-brand-secondary-dim)", desc: "The ground each panel sits on. Follows the theme; pass a literal only if the panel must stay one colour." },
                    { name: "reveal",          type: "boolean",                         def: "true", desc: "Rise the columns and step cards in on scroll, then float them. Ignored under prefers-reduced-motion." },
                    { name: "className",       type: "string",                          desc: "Extra class on the row root." },
                    { name: "style",           type: "React.CSSProperties",             desc: "Inline style on the row root." },
                  ]} />
                  <Callout variant="info">
                    The panel and item types are exported —{" "}
                    <code>AppShowcaseIosPanel</code>, <code>AppShowcaseStepsPanel</code>,{" "}
                    <code>AppShowcaseDigitalPanel</code>, <code>AppShowcaseStep</code> and{" "}
                    <code>AppShowcaseVideo</code> — with the defaults{" "}
                    <code>APP_SHOWCASE_IOS</code>, <code>APP_SHOWCASE_STEPS</code>,{" "}
                    <code>APP_SHOWCASE_STEPS_PANEL</code>,{" "}
                    <code>APP_SHOWCASE_DIGITAL</code> and <code>APP_SHOWCASE_BADGE</code>. Spread
                    one and change a field rather than retyping the approved copy.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Devices: video and stills",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Both clips <strong>ship with the package</strong> — VP9 WebM with an alpha
                    channel, about <strong>9.9 MB</strong> together — because the devices moving
                    is the block. Nothing to configure: the preview above is{" "}
                    <code>&lt;AppShowcase /&gt;</code>. Point <code>ios.video</code> /{" "}
                    <code>digital.video</code> elsewhere to host your own. An alpha WebP still of
                    each ships too, used as the poster and as the fallback in Safari, which has
                    never supported alpha WebM.
                  </Callout>
                  <Callout variant="info">
                    <strong>Both clips now carry a real alpha channel</strong>, so both composite
                    straight onto the panel — <code>background: transparent</code> is on the
                    element and nothing else was needed. The digital panel's clip used to be a
                    flat-ground encode, which was invisible on the light panel it was authored
                    for and a visible grey plate on a dark one; dark mode dims media (the
                    marketing site's own treatment, exposed as <code>--hs-fx-media-dim</code>)
                    but that softened the glare rather than removing the plate. Keying the ground
                    out at playback was tried and rejected on the way here — the tablet's own
                    interface greys fall inside any tolerance wide enough to catch the ground, so
                    it chewed holes in the artwork. A proper alpha encode was the fix.
                  </Callout>
                  <Callout variant="warning">
                    The Safari fallback is keyed on the <em>browser</em>, not on the file: a clip
                    passed to <code>ios.video</code> or <code>digital.video</code> is assumed to
                    need alpha, so Safari gets the still even for a clip it could have played.
                    Give the video a <code>fallbackSrc</code> to have Safari play that instead.
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
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Each panel is authored on a fixed <strong>384 × 644</strong> canvas and scaled
                    to its column, capped at 1.15×. That is why the step cards keep their exact
                    angles, overlaps and blur shadows at every width — laying them out fluidly
                    would pull those relationships apart.
                  </Callout>
                  <Callout variant="info">
                    The scale is measured in JavaScript with a <code>ResizeObserver</code>, not
                    computed in CSS. It cannot be: <code>scale()</code> needs a unitless number,
                    and CSS has no way to divide a length by a length to produce one —{" "}
                    <code>100cqw / 384px</code> is not computable. The row itself is container
                    queried, dropping to two columns at 1040px and one at 720px of its own width.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Motion",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    Once the row is 15% on screen the three columns rise 72px over 900ms on{" "}
                    <code>cubic-bezier(0.22, 1, 0.36, 1)</code>, 110ms apart. The step cards land
                    after them at 420, 560 and 700ms, and from about 1.45s each card and its blur
                    shadow start an endless six-to-seven-second float, on its own period so they
                    never drift into sync. The prompt bar over the tablet floats too.
                  </Callout>
                  <Callout variant="info">
                    This one does not use the shared reveal cascade the other blocks do. That
                    cascade strips its inline transforms once it has finished, which is right for
                    something that lands and stops — but these keep floating, so the motion is CSS
                    gated on a flag instead. Under{" "}
                    <code>prefers-reduced-motion: reduce</code> every animation is dropped and the
                    row renders finished. <code>{"reveal={false}"}</code> does the same for
                    everyone.
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
