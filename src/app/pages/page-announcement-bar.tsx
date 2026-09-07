import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { AnnouncementBar } from "../components/blocks/hs-announcement-bar";

const USAGE = `import { AnnouncementBar } from "@heartstampxo/design-system";

// Bare, it is the approved offer line:
//   <AnnouncementBar />

<AnnouncementBar
  href="/offers"                  // omit href and it renders a <button>
  onClick={track}
  hideChevron={false}
  dismissible                     // adds a close control
  onDismiss={() => rememberDismissed()}
  hidden={alreadyDismissed}       // drive visibility from your own state
  background="var(--color-brand-lockup-heart)"
  color="#242423"
>
  New to HeartStamp? 50% off your first card order — no code needed
</AnnouncementBar>`;


export function PageAnnouncementBar() {

  return (
    <DocPage title="Announcement Bar" subtitle="The offer strip that runs above the navigation — one line, a chevron, brand pink.">
      <DocSection
        title="Announcement Bar"
        desc="Rendered bare it is the approved offer. With an href it is an anchor, without one a button."
      >
        <Preview title="Announcement Bar" code={USAGE} fullWidth height={120} contentAlign="start">
          <AnnouncementBar />
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
                    { name: "children",    type: "ReactNode",           def: "the approved offer", desc: "The line of copy." },
                    { name: "href",        type: "string",              desc: "Renders an anchor instead of a button." },
                    { name: "onClick",     type: "(e) => void",         desc: "Fired when the bar is activated." },
                    { name: "hideChevron", type: "boolean",             def: "false", desc: "Hide the trailing chevron." },
                    { name: "dismissible", type: "boolean",             def: "false", desc: "Add a close control that hides the bar." },
                    { name: "onDismiss",   type: "() => void",          desc: "Fired when the close control is used — persist it your side." },
                    { name: "hidden",      type: "boolean",             def: "false", desc: "Render nothing, for when visibility is driven from your own state." },
                    { name: "background",  type: "string",              def: "var(--color-brand-lockup-heart)", desc: "The bar's ground." },
                    { name: "color",       type: "string",              def: '"#242423"', desc: "The bar's ink." },
                    { name: "className",   type: "string",              desc: "Extra class on the bar." },
                    { name: "style",       type: "React.CSSProperties", desc: "Inline style on the bar." },
                  ]} />
                </div>
              ),
            },
            {
              title: "Theming",
              content: (
                <Callout variant="warning">
                  The ground is a brand pink in <strong>both</strong> themes (<code>#f5bdc2</code>{" "}
                  light, <code>#eb7a85</code> dark), so the ink is pinned dark in both rather than
                  read from <code>--color-text-primary</code> — which flips to near-white and
                  would leave the offer at about 2.3:1 on pink. Override the pair together with{" "}
                  <code>background</code> and <code>color</code> if you re-ground it.
                </Callout>
              ),
            },
            {
              title: "Dismissal",
              content: (
                <Callout variant="info">
                  <code>dismissible</code> adds the close control and hides the bar when it is
                  used, but the component does not remember that — a promotional strip that
                  reappears on every route change is worse than one that cannot be closed. Persist
                  it in <code>onDismiss</code> and feed it back through <code>hidden</code>.
                </Callout>
              ),
            },
            {
              title: "Full bleed, not the grid",
              content: (
                <Callout variant="info">
                  Unlike the marketing blocks, this bar deliberately does <strong>not</strong> sit
                  on the grid track — an offer strip that stopped at the 1200px column with the
                  page ground either side would read as a banner someone forgot to stretch. It
                  spans whatever it is given, and the copy inside it centres. So there is no{" "}
                  <code>grid.css</code> requirement here; <code>tokens.css</code> alone is enough,
                  for the colour and type tokens it uses.
                </Callout>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
