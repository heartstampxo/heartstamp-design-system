import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { ChatHomeScreen, OccasionSuggestions } from "../../components/ui/hs-stampy-chat";
import chatMascotImg from "../../../assets/stampy/mascot.png";

const DESC_STYLE: React.CSSProperties = { fontSize: 14, color: "var(--muted-fg)", marginBottom: 16 };

export function PageChatHomeScreen() {
  return (
    <DocPage
      title="Home Screen"
      subtitle="The initial state of the Stampy Chatbot — shown when the chat opens before any conversation begins. Features a greeting, a typewriter animation cycling through example prompts, and the input bar."
    >
      <DocSection title="Chat Home Screen">
        <p style={DESC_STYLE}>
          The mascot appears to the left of the greeting. The "Try:" prompt cycles through{" "}
          <code>examplePrompts</code> with a typewriter effect, refreshed on every open.
        </p>
        <Preview
          title="Chat home screen"
          height={210}
          fullWidth
          code={`import { ChatHomeScreen } from '@heartstamp/design-system';

<ChatHomeScreen
  mascotSrc="/stampy/mascot.png"
  examplePrompts={[
    "Make a birthday card for my best friend",
    "Write a thank-you card for my boss",
    "Create an anniversary card for my parents",
  ]}
/>`}
        >
          <div style={{ marginLeft: 80, width: 450, flexShrink: 0 }}>
            <ChatHomeScreen mascotSrc={chatMascotImg} />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "mascotSrc",      type: "string",   def: "(required)", required: true, desc: "URL for the mascot image rendered to the left of the greeting" },
          { name: "examplePrompts", type: "string[]", def: "4 built-in prompts",         desc: "Prompts cycled by the typewriter animation in the input hint" },
        ]} />
      </DocSection>

      <DocSection title="Occasion Suggestions">
        <p style={DESC_STYLE}>
          A numbered suggestion list shown above the input bar on the home screen. Prompts the user
          to pick a card occasion before typing. Dismissible via the × button.
        </p>
        <Preview
          title="Occasion suggestions"
          height={220}
          code={`import { OccasionSuggestions } from '@heartstamp/design-system';

<OccasionSuggestions
  suggestions={["Birthday", "Thank you", "Anniversary", "Graduation"]}
  onSelect={(occasion) => console.log("Selected:", occasion)}
  onClose={() => setShowSuggestions(false)}
/>`}
        >
          <div style={{ width: "100%", maxWidth: 420, padding: 16 }}>
            <OccasionSuggestions />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "suggestions", type: "string[]",          def: "4 random occasions", desc: "List of occasion strings shown as numbered rows" },
          { name: "onSelect",    type: "(s: string) => void", def: "—",                desc: "Called when the user taps a suggestion row" },
          { name: "onClose",     type: "() => void",          def: "—",                desc: "Called when the user taps the × button" },
        ]} />
      </DocSection>
    </DocPage>
  );
}
