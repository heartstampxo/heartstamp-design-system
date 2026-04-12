import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import {
  WorkingSpinner,
  StampyBubble,
  BubbleButton,
  UserBubble,
  StyleCarousel,
  TadaBanner,
} from "../../components/ui/hs-stampy-chat";
import partyPopperImg from "../../../assets/stampy/party-popper.gif";

const DESC_STYLE: React.CSSProperties = { fontSize: 14, color: "var(--muted-fg)", marginBottom: 16 };

/** Stateful wrapper so StyleCarousel has its own selection state in the preview. */
function StyleCarouselDemo() {
  const [choice, setChoice] = React.useState<string | null>(null);
  return <StyleCarousel themeChoice={choice} setThemeChoice={setChoice} />;
}

export function PageChatBubbles() {
  return (
    <DocPage
      title="Chat Bubbles"
      subtitle="The individual message and indicator types that appear inside the Stampy Chatbot conversation view."
    >
      <DocSection title="Working Spinner">
        <p style={DESC_STYLE}>
          Shown while Stampy is processing a request. Displays a spinning arc loader alongside a
          status message.
        </p>
        <Preview
          title="Working spinner"
          height={90}
          code={`import { WorkingSpinner } from '@heartstamp/design-system';

<WorkingSpinner text="Working on your request..." delay={0} />`}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <WorkingSpinner />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "text",  type: "string", def: '"Working on your request..."', desc: "Status text displayed next to the spinner" },
          { name: "delay", type: "number", def: "0",                            desc: "Entry animation delay in seconds" },
        ]} />
      </DocSection>

      <DocSection title="Stampy Bubble">
        <p style={DESC_STYLE}>
          Left-aligned message bubble for AI (Stampy) responses. Optionally renders one or more
          trigger buttons below the message text.
        </p>
        <Preview
          title="Stampy message bubble"
          height={110}
          code={`import { StampyBubble } from '@heartstamp/design-system';

<StampyBubble
  text="I can definitely help you put together a great birthday card. To get started:"
  buttons={["What kind of vibe are you going for?"]}
/>`}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <StampyBubble
              text="I can definitely help you put together a great birthday card. To get started:"
              buttons={["What kind of vibe are you going for?"]}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "text",    type: "string",   def: "(required)", required: true, desc: "Message text displayed inside the bubble" },
          { name: "buttons", type: "string[]", def: "—",                         desc: "Optional trigger button labels rendered below the text" },
        ]} />
      </DocSection>

      <DocSection title="Bubble Button">
        <p style={DESC_STYLE}>
          Inline tappable option rendered inside a Stampy bubble — a chevron + label row. Once
          selected (<code>isUsed=true</code>) the button dims and becomes non-interactive.
        </p>
        <Preview
          title="Bubble button"
          height={100}
          code={`import { BubbleButton } from '@heartstamp/design-system';

// Available (not yet selected)
<BubbleButton label="What kind of vibe are you going for?" isUsed={false} onClick={() => handleSelect("vibe")} />

// Already selected — dimmed and non-interactive
<BubbleButton label="Tell me about the recipient" isUsed={true} />`}
        >
          <div style={{ width: "100%", maxWidth: 440, padding: "8px 0" }}>
            <BubbleButton label="What kind of vibe are you going for?" isUsed={false} />
            <BubbleButton label="Tell me about the recipient" isUsed={true} />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "label",   type: "string",      def: "(required)", required: true, desc: "Button label text" },
          { name: "isUsed",  type: "boolean",     def: "(required)", required: true, desc: "When true the button is dimmed and non-interactive (already selected)" },
          { name: "onClick", type: "() => void",  def: "—",                         desc: "Called when the user taps the button (only fires when isUsed is false)" },
          { name: "delay",   type: "number",      def: "0",                         desc: "Entry animation delay in seconds" },
        ]} />
      </DocSection>

      <DocSection title="User Bubble">
        <p style={DESC_STYLE}>
          Right-aligned message bubble for user messages. Plain text only, no buttons.
        </p>
        <Preview
          title="User message bubble"
          height={80}
          code={`import { UserBubble } from '@heartstamp/design-system';

<UserBubble text="I'm making a card for my girlfriend that will make her laugh for her birthday" />`}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <UserBubble text="I'm making a card for my girlfriend that will make her laugh for her birthday" />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "text", type: "string", def: "(required)", required: true, desc: "Message text displayed inside the bubble" },
        ]} />
      </DocSection>

      <DocSection title="Style Carousel">
        <p style={DESC_STYLE}>
          A horizontally scrollable grid of art style cards shown inside a Stampy bubble. Supports
          touch and mouse drag. Selecting a card locks the choice and dims the others.
        </p>
        <Preview
          title="Style carousel"
          height={200}
          code={`import { StyleCarousel } from '@heartstamp/design-system';
import { useState } from 'react';

function StyleCarouselDemo() {
  const [choice, setChoice] = useState<string | null>(null);
  return <StyleCarousel themeChoice={choice} setThemeChoice={setChoice} />;
}`}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <StyleCarouselDemo />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "themeChoice",    type: "string | null",     def: "null",        desc: "Currently selected style label; null means no selection yet" },
          { name: "setThemeChoice", type: "(s: string) => void", def: "(required)", required: true, desc: "Callback fired when the user selects a style card" },
        ]} />
      </DocSection>

      <DocSection title="Tada Banner">
        <p style={DESC_STYLE}>
          A two-state loading → done banner shown when Stampy generates a card. Transitions from a
          spinner with muted styling to a checkmark with brand-red header after{" "}
          <code>loadingDuration</code> ms.
        </p>
        <Preview
          title="Tada banner"
          height={160}
          code={`import { TadaBanner } from '@heartstamp/design-system';

<TadaBanner
  loadingDuration={8000}
  loadingTitle="Creating your card…"
  loadingMessage="Initial generation might take a moment."
  doneTitle="Tada, Card generation is done!"
  doneMessage="Your birthday card for Keith is ready to preview."
  partyPopperSrc="/stampy/party-popper.gif"
/>`}
        >
          <div style={{ width: "100%", maxWidth: 440 }}>
            <TadaBanner loadingDuration={5000} partyPopperSrc={partyPopperImg} />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "loadingDuration", type: "number", def: "10000",                           desc: "Milliseconds before switching to the done state" },
          { name: "loadingTitle",    type: "string", def: '"Creating your card…"',            desc: "Header text while loading" },
          { name: "loadingMessage",  type: "string", def: '"Initial generation might take…"', desc: "Body text while loading" },
          { name: "doneTitle",       type: "string", def: '"Tada, Card generation is done!"', desc: "Header text after completion" },
          { name: "doneMessage",     type: "string", def: '"Your birthday card for Keith…"',  desc: "Body text after completion" },
          { name: "partyPopperSrc",  type: "string", def: "—",                               desc: "Optional party popper GIF URL shown on completion" },
        ]} />
      </DocSection>
    </DocPage>
  );
}
