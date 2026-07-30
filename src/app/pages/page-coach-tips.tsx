import React, { useState } from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { CoachTipCard, CoachTips, type CoachTipItem } from "../components/ui/hs-coach-tips";

const TIPS: CoachTipItem[] = [
  {
    id: "welcome",
    title: "Welcome to your studio",
    body: "This is where every card you make comes together. Have a look around — nothing here is permanent.",
  },
  {
    id: "panel",
    title: "Leave the hassle to us",
    body: "Package, colors, message, and send. They're all live in this panel. Just pick what feels right, we'll handle the rest.",
  },
  {
    id: "preview",
    title: "See it before you send it",
    body: "The preview updates as you go, so you always know exactly what lands in their hands.",
  },
  {
    id: "send",
    title: "Send when you're ready",
    body: "Pick a delivery date or send it right now. You can still edit anything up until it goes out.",
  },
];

/* Fixed-width holder — the card fills its parent, so the consumer sizes it */
function TipHolder({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 340 }}>{children}</div>;
}

export function PageCoachTips() {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState<string | null>(null);

  return (
    <DocPage
      title="Coaching Tips"
      subtitle="Onboarding coach marks — short, sequenced tips that introduce one thing at a time. Stampy fronts each tip, a counter pill shows progress, and the user can step through with Next or opt out with Skip."
    >
      <DocSection
        title="Single Tip"
        desc="CoachTipCard renders one tip. Use it when your app already owns the stepping logic."
      >
        <Preview
          title="CoachTipCard"
          code={`import { CoachTipCard } from '@heartstampxo/design-system';

<CoachTipCard
  counter="Tip 2/7"
  title="Leave the hassle to us"
  body="Package, colors, message, and send. They're all live in this panel. Just pick what feels right, we'll handle the rest."
  onSkip={() => setVisible(false)}
  onNext={() => setStep(s => s + 1)}
/>`}
        >
          <TipHolder>
            <CoachTipCard
              counter="Tip 2/7"
              title="Leave the hassle to us"
              body="Package, colors, message, and send. They're all live in this panel. Just pick what feels right, we'll handle the rest."
            />
          </TipHolder>
        </Preview>

        <PropsTable props={[
          { name: "title",      type: "string",      def: "(required)", required: true, desc: "Tip heading. 16px heading font." },
          { name: "body",       type: "ReactNode",   def: "(required)", required: true, desc: "Tip copy. Keep it to two or three lines." },
          { name: "counter",    type: "string",      def: "—",          desc: "Pill text under the avatar, e.g. \"Tip 2/7\". Omit to hide the pill." },
          { name: "avatarSrc",  type: "string",      def: "Stampy — Small Smile", desc: "Image for the 44×44 slot." },
          { name: "avatar",     type: "ReactNode",   def: "—",          desc: "Full override for the 44×44 slot. Takes precedence over avatarSrc." },
          { name: "onSkip",     type: "() => void",  def: "—",          desc: "Skip pressed." },
          { name: "onNext",     type: "() => void",  def: "—",          desc: "Next pressed." },
          { name: "skipLabel",  type: "string",      def: "\"Skip\"",   desc: "Label for the secondary action." },
          { name: "nextLabel",  type: "string",      def: "\"Next\"",   desc: "Label for the primary action." },
          { name: "hideSkip",   type: "boolean",     def: "false",      desc: "Hides Skip — for flows the user must finish." },
        ]} />
      </DocSection>

      <DocSection
        title="Tip Sequence"
        desc="CoachTips takes an array and owns the step index, the counter, and the Next → Done transition on the final tip."
      >
        <Preview
          title="CoachTips — 4 tips"
          height={280}
          code={`import { CoachTips } from '@heartstampxo/design-system';

const TIPS = [
  { id: 'welcome', title: 'Welcome to your studio', body: '…' },
  { id: 'panel',   title: 'Leave the hassle to us', body: '…' },
  { id: 'preview', title: 'See it before you send it', body: '…' },
  { id: 'send',    title: "Send when you're ready", body: '…' },
];

<CoachTips
  tips={TIPS}
  onSkip={() => setVisible(false)}
  onComplete={() => setVisible(false)}
/>`}
        >
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-4)" }}>
            <TipHolder>
              <CoachTips
                tips={TIPS}
                step={step}
                onStepChange={setStep}
                onSkip={() => setDone("skipped")}
                onComplete={() => setDone("completed")}
              />
            </TipHolder>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", fontSize: "var(--font-size-label-12)", color: "var(--color-text-secondary)" }}>
              <span>step {step + 1} of {TIPS.length}{done ? ` · ${done}` : ""}</span>
              <button
                onClick={() => { setStep(0); setDone(null); }}
                style={{
                  background: "none", border: "none", padding: 0, cursor: "pointer",
                  color: "var(--color-text-link)", fontSize: "var(--font-size-label-12)",
                  fontFamily: "var(--font-family-body)",
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </Preview>

        <PropsTable props={[
          { name: "tips",        type: "CoachTipItem[]",       def: "(required)", required: true, desc: "Tips in the order they are shown." },
          { name: "step",        type: "number",               def: "—",          desc: "Controlled step index. Omit to let the component hold its own state." },
          { name: "defaultStep", type: "number",               def: "0",          desc: "Initial step when uncontrolled." },
          { name: "onStepChange",type: "(step) => void",       def: "—",          desc: "Fired when Next advances the sequence." },
          { name: "onSkip",      type: "() => void",           def: "—",          desc: "Skip pressed — the user opted out before the end." },
          { name: "onComplete",  type: "() => void",           def: "—",          desc: "Next pressed on the final tip." },
          { name: "avatarSrc",   type: "string",               def: "Stampy — Small Smile", desc: "Default avatar for every tip without its own avatarSrc." },
          { name: "showCounter", type: "boolean",              def: "true",       desc: "Show the \"Tip n/total\" pill." },
          { name: "doneLabel",   type: "string",               def: "\"Done\"",   desc: "Primary label on the final tip." },
        ]} />
      </DocSection>

      <DocSection
        title="CoachTipItem"
        desc="Shape of each entry in the tips array."
      >
        <PropsTable props={[
          { name: "id",        type: "string",    def: "(required)", required: true, desc: "Unique identifier for the tip." },
          { name: "title",     type: "string",    def: "(required)", required: true, desc: "Tip heading." },
          { name: "body",      type: "ReactNode", def: "(required)", required: true, desc: "Tip copy." },
          { name: "avatarSrc", type: "string",    def: "—",          desc: "Per-tip avatar override." },
        ]} />
      </DocSection>

      <DocSection
        title="Without the counter"
        desc="Drop the pill for a one-off nudge that isn't part of a numbered tour."
      >
        <Preview
          title="No counter, no Skip"
          code={`<CoachTipCard
  hideSkip
  title="See it before you send it"
  body="The preview updates as you go, so you always know exactly what lands in their hands."
  nextLabel="Got it"
/>`}
        >
          <TipHolder>
            <CoachTipCard
              hideSkip
              title="See it before you send it"
              body="The preview updates as you go, so you always know exactly what lands in their hands."
              nextLabel="Got it"
            />
          </TipHolder>
        </Preview>
      </DocSection>
    </DocPage>
  );
}
