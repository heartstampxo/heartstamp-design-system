import React from "react";
import { RotateCw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { CtaBand } from "../components/blocks/hs-cta-band";
import { WebsiteFooter } from "../components/blocks/hs-website-footer";

const USAGE = ["import { CtaBand, WebsiteFooter, CTA_BAND_PHOTO } from \"@heartstampxo/design-system\";",
  "",
  "// The closing section is the two together, in this order. The footer carries",
  "// a -32px top margin so the dark grounds meet with no seam.",
  "<>",
  "  <CtaBand />",
  "  <WebsiteFooter />",
  "</>",
  "",
  "// Written out in full:",
  "<CtaBand",
  "  heading={<>Someone's letterbox <img src={CTA_BAND_PHOTO} alt=\"\" /> is waiting.</>}",
  "  subheading=\"At Heartstamp we've got greetings cards for every occasion.\"",
  "  action=\"Make My Free Card\"              // false removes the button",
  "  onAction={() => startCard()}",
  "  //  actions={<><Btn size=\"xl\">Start</Btn><Btn variant=\"outline\">Browse</Btn></>}",
  "  background=\"var(--color-brand-secondary)\"",
  "  reveal",
  "/>",
  "<WebsiteFooter",
  "  about={{ title: \"About HeartStamp\", body: \"Cards worth keeping.\" }}",
  "  columns={[{ title: \"My HeartStamp\", links: \"Create Account\\nSign In\" }]}",
  "  mark                                    // the oversized masked lockup",
  "  payments={WEBSITE_FOOTER_PAYMENTS}      // false removes the group",
  "  appStore={{ href: \"https://apps.apple.com/…\" }}",
  "  socials={[{ label: \"Facebook\", href: \"#\" }, { label: \"X\", href: \"#\" }]}",
  "  // tuck                                 // only if your layout has the homepage's gap",
  "  reveal",
  "/>"].join("\n")

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

export function PageCtaBand() {
  const [run, setRun] = React.useState(0);

  return (
    <DocPage title="Closing Section" subtitle="The call to action and the footer, together — one closing surface. The footer is drawn to tuck 32px under the band, so the band's bottom border is the separator between them.">
      <DocSection
        title="Closing Section"
        desc="Both halves rendered as they ship on the site. They are separate exports — CtaBand and WebsiteFooter — so either can be used alone, but this is how they are drawn to sit."
        action={<ReplayButton onClick={() => setRun(n => n + 1)} />}
      >
        <Preview title="Closing Section" code={USAGE} fullWidth height={1180} contentAlign="start">
          <div key={run} style={{ width: "100%" }}>
            <CtaBand />
            <WebsiteFooter />
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
                    { name: "heading",    type: "ReactNode | false",   def: "the approved headline", desc: "The headline. Takes nodes, so the inline portrait or emphasis is yours to place." },
                    { name: "subheading", type: "ReactNode | false",   def: "the approved line", desc: "The supporting line under it. false removes it." },
                    { name: "action",     type: "ReactNode | false",   def: '"Make My Free Card"', desc: "The button label. false removes the button." },
                    { name: "onAction",   type: "(e) => void",         desc: "Fired when the default button is pressed." },
                    { name: "actions",    type: "ReactNode",           desc: "Replaces the default button entirely — for two buttons, or a form." },
                    { name: "background", type: "string",              def: "var(--color-brand-secondary)", desc: "The band's ground." },
                    { name: "reveal",     type: "boolean",             def: "true", desc: "Stagger the heading, line and button in on scroll. Ignored under prefers-reduced-motion." },
                    { name: "className",  type: "string",              desc: "Extra class on the band." },
                    { name: "style",      type: "React.CSSProperties", desc: "Inline style on the band." },
                  ]} />
                </div>
              ),
            },
            {
              title: "WebsiteFooter props",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
                  <PropsTable props={[
                    { name: "about",     type: "{ title, body } | false", def: "the approved column", desc: "The About column beside the links. false removes it." },
                    { name: "columns",   type: "FooterColumn[]",          def: "WEBSITE_FOOTER_COLUMNS", desc: "The link columns — { title, links }. Strings keep the site's newline-per-link form; pass nodes for real anchors." },
                    { name: "mark",      type: "boolean",                 def: "true", desc: "The oversized masked lockup. Hidden below 900px regardless — it is drawn at 1199px and only smears when scaled." },
                    { name: "payments",  type: "FooterPayment[] | false", def: "WEBSITE_FOOTER_PAYMENTS", desc: "Payment marks — { src, alt, filter? }. filter flattens white-drawn marks onto the light chip." },
                    { name: "appStore",  type: "{ href } | false",        def: "{ href: '#' }", desc: "The App Store button. false removes it." },
                    { name: "socials",   type: "{ label, href }[] | false", def: "Facebook + X", desc: "Social links. Artwork ships for Facebook and X; any other label renders its initial." },
                    { name: "tuck",      type: "boolean",                 def: "false", desc: "Pull up 32px, as the marketing page does. That cancels a gap the homepage's layout introduces; composed directly it instead covers the band's bottom border and removes the separator between the two." },
                    { name: "reveal",    type: "boolean",                 def: "true", desc: "Stagger the columns, lockup and bottom bar in on scroll." },
                  ]} />
                  <Callout variant="info">
                    This is the tall marketing footer, and it is <strong>not</strong> the packaged{" "}
                    <code>Footer</code> — that one is the compact two-layout component, still on
                    the <a href="#footer">Footer</a> page. Both are exported; this one is what the
                    homepage runs. The lockup is a gradient masked by the artwork rather than two
                    colourways, so it takes the theme's own tones.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Motion",
              content: (
                <Callout variant="info">
                  The three parts rise 48px over 650ms on{" "}
                  <code>cubic-bezier(0.22, 1.18, 0.36, 1)</code>, at{" "}
                  <strong>0.15s, 0.32s and 0.49s</strong> — the marketing page's own timings. They
                  are held at zero opacity until the band is 12% on screen, or the sequence plays
                  against a viewport that has not reached it. Under reduced motion nothing
                  animates and all three render at full opacity rather than stuck hidden.
                </Callout>
              ),
            },
            {
              title: "Footer columns on the grid",
              content: (
                <Callout variant="info">
                  The four link lists span <strong>eight of the twelve columns</strong> on the
                  1200px track and <strong>seven</strong> once it widens to 1400px at 2000px and
                  up — the About column takes the rest. Both spans are derived from the tokens
                  rather than measured by hand:{" "}
                  <code>column = (track − 11 gutters) / 12</code>, and{" "}
                  <code>N spans = N columns + (N−1) gutters</code>. The gap between the lists is{" "}
                  <code>--grid-gutter</code> too, so the four land on grid columns two apart. A
                  change to the gutter or the column count carries through instead of needing
                  this recomputed.
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
            {
              title: "Sizing",
              content: (
                <Callout variant="info">
                  The content column is 790px, capped at the width it is given. Below 900px of the
                  block's own width the padding tightens, the headline falls from{" "}
                  <code>--font-size-h1</code> to <code>--font-size-h2</code> with a ratio line
                  height, and the inline portrait shrinks from 61px to 40px so it still sits on
                  the line rather than pushing it apart.
                </Callout>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
