import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { ChatHomeInput, ChatConversationInput } from "../../components/ui/hs-stampy-chat";
import chatAiIconImg from "../../../assets/stampy/ai-icon.png";

const DESC_STYLE: React.CSSProperties = { fontSize: 14, color: "var(--muted-fg)", marginBottom: 16 };

export function PageChatInput() {
  return (
    <DocPage
      title="Chat Input"
      subtitle="Two input bar variants used inside the Stampy Chatbot — one for the home screen and one for the active conversation view."
    >
      <DocSection title="Home Input">
        <p style={DESC_STYLE}>
          Used on the chatbot home screen. Contains a free-text textarea, an "Add reference images"
          attachment button, a mic toggle, and a send button that activates when the field has content.
        </p>
        <Preview
          title="Chat home input"
          height={140}
          code={`import { ChatHomeInput } from '@heartstamp/design-system';

<ChatHomeInput
  placeholder="Ask, search or create your card"
  onSend={(value) => console.log(value)}
/>`}
        >
          <div style={{ width: "100%", maxWidth: 420 }}>
            <ChatHomeInput />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "placeholder", type: "string",                  def: '"Ask, search or create your card"', desc: "Textarea placeholder text" },
          { name: "onSend",      type: "(value: string) => void", def: "—",                                desc: "Called when the user submits a message" },
        ]} />
      </DocSection>

      <DocSection title="Conversation Input">
        <p style={DESC_STYLE}>
          Used during an active conversation. Features a pulsing AI sparkle icon, a textarea, a
          hairline divider, and the action row with attachment, mic, and send controls.
        </p>
        <Preview
          title="Chat conversation input"
          height={140}
          code={`import { ChatConversationInput } from '@heartstamp/design-system';

<ChatConversationInput
  aiIconSrc="/stampy/ai-icon.png"
  placeholder="Ask, search or create your card"
  onSend={(value) => console.log(value)}
/>`}
        >
          <div style={{ width: "100%", maxWidth: 420, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
            <ChatConversationInput aiIconSrc={chatAiIconImg} />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "aiIconSrc",   type: "string",                  def: "(required)", required: true, desc: "AI sparkle icon URL shown left of the textarea" },
          { name: "placeholder", type: "string",                  def: '"Ask, search or create your card"',   desc: "Textarea placeholder text" },
          { name: "onSend",      type: "(value: string) => void", def: "—",                                   desc: "Called when the user submits a message" },
        ]} />
      </DocSection>
    </DocPage>
  );
}
