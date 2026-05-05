import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { ChatHeader } from "../../components/ui/hs-stampy-chat";

const DESC_STYLE: React.CSSProperties = { fontSize: 14, color: "var(--muted-fg)", marginBottom: 16 };

const DEMO_CONVERSATIONS = [
  { id: "1", name: "Jack's Birthday Bi..." },
  { id: "2", name: "Lupe's Luau" },
  { id: "3", name: "Mom's Anniversary" },
];

const HEADER_WRAPPER_STYLE: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  border: "1px solid var(--border)",
  borderRadius: "20px 20px 0 0",
};

export function PageChatHeader() {
  return (
    <DocPage
      title="Chat Header"
      subtitle="The top bar of the Stampy Chatbot — contains the Stampy label, conversation switcher dropdown, PiP expand toggle, and minimize button."
    >
      <DocSection title="Default">
        <p style={DESC_STYLE}>
          Standard header with conversation name pill and action buttons. Click the pill to open
          the conversation switcher dropdown with inline rename support.
        </p>
        <Preview
          title="Chat header — default"
          height={120}
          code={`import { ChatHeader } from '@heartstamp/design-system';
import { useState } from 'react';

const [expanded, setExpanded] = useState(false);

<ChatHeader
  conversationName="Jack's Birthday Card"
  conversations={[
    { id: "1", name: "Jack's Birthday Card" },
    { id: "2", name: "Lupe's Luau" },
    { id: "3", name: "Mom's Anniversary" },
  ]}
  expanded={expanded}
  onToggleExpand={() => setExpanded(e => !e)}
  onMinimize={() => setChatOpen(false)}
  onSelectConversation={(id) => switchToConversation(id)}
  onNewConversation={() => createNewConversation()}
  onRename={(id, newName) => renameConversation(id, newName)}
/>`}
        >
          <div style={HEADER_WRAPPER_STYLE}>
            <ChatHeader conversationName="Jack's Birthday Bi..." conversations={DEMO_CONVERSATIONS} />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Expanded State">
        <p style={DESC_STYLE}>
          When the chatbot is in PiP (picture-in-picture) expanded mode, the expand icon changes
          to indicate collapse.
        </p>
        <Preview
          title="Chat header — expanded"
          height={120}
          code={`import { ChatHeader } from '@heartstamp/design-system';

// Pass expanded={true} to show the collapse icon instead of expand
<ChatHeader
  conversationName="Jack's Birthday Card"
  conversations={[
    { id: "1", name: "Jack's Birthday Card" },
    { id: "2", name: "Lupe's Luau" },
  ]}
  expanded={true}
  onToggleExpand={() => setExpanded(false)}
/>`}
        >
          <div style={HEADER_WRAPPER_STYLE}>
            <ChatHeader
              conversationName="Jack's Birthday Bi..."
              conversations={DEMO_CONVERSATIONS}
              expanded={true}
            />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={[
          { name: "conversationName",     type: "string",                              def: '"Jack\'s Birthday Bi..."',   desc: "Label shown in the conversation pill" },
          { name: "conversations",        type: "{ id: string; name: string }[]",      def: "2 sample conversations",    desc: "List of conversations shown in the dropdown" },
          { name: "expanded",             type: "boolean",                             def: "false",                     desc: "Switches the expand icon to indicate collapse" },
          { name: "defaultDropdownOpen",  type: "boolean",                             def: "false",                     desc: "Opens the dropdown on mount (useful for snapshots)" },
          { name: "onToggleExpand",       type: "() => void",                          def: "—",                         desc: "Called when the expand/collapse button is clicked" },
          { name: "onMinimize",           type: "() => void",                          def: "—",                         desc: "Called when the minimize (–) button is clicked" },
          { name: "onSelectConversation", type: "(id: string) => void",                def: "—",                         desc: "Called when a conversation item is selected from the dropdown" },
          { name: "onNewConversation",    type: "() => void",                          def: "—",                         desc: "Called when 'New Conversation' is clicked" },
          { name: "onRename",             type: "(id: string, newName: string) => void", def: "—",                       desc: "Called after a conversation is renamed inline; receives the id and trimmed new name" },
        ]} />
      </DocSection>
    </DocPage>
  );
}
