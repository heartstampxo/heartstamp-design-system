import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import {
  OverflowMenu,
  ChecklistOverflowMenu,
  TemplateOverflowMenu,
  ActionOverflowMenu,
  OccasionSuggestions,
} from "../../components/ui/hs-stampy-chat";

const DESC_STYLE: React.CSSProperties = { fontSize: 14, color: "var(--muted-fg)", marginBottom: 16 };
const MENU_WRAPPER_STYLE: React.CSSProperties = { width: "100%", maxWidth: 400 };
const NOOP = () => {};

// ── Shared demo data ────────────────────────────────────────────────────────

const VIBE_OPTIONS = [
  { num: "1", label: "Funny" },
  { num: "2", label: "Sentimental" },
  { num: "3", label: "Serious / Heartfelt" },
  { num: "4", label: "Celebratory" },
  { num: "5", label: "Formal" },
];

const RECIPIENT_PAGES = [
  {
    question: "Tell me about the recipient",
    options: [
      { num: "1", label: "Friend" },
      { num: "2", label: "Partner" },
      { num: "3", label: "Boss" },
      { num: "4", label: "Coworker" },
      { num: "5", label: "Parent" },
    ],
  },
  {
    question: "How close are you?",
    options: [
      { num: "1", label: "Very close" },
      { num: "2", label: "Casual" },
      { num: "3", label: "Work only" },
    ],
  },
];

const INTEREST_ITEMS = [
  { id: "cooking",  label: "Cooking" },
  { id: "golf",     label: "Golf" },
  { id: "gaming",   label: "Gaming" },
  { id: "hiking",   label: "Hiking" },
  { id: "reading",  label: "Reading" },
  { id: "running",  label: "Running" },
  { id: "sports",   label: "Sports" },
  { id: "travel",   label: "Travel" },
];

const TEMPLATE_CARDS = [
  { num: "1", title: "For Someone Who Means the World",  front: "For Someone Who Means the World!",  insideBody: "From your love of Hiking to the way you light up a room — you make life better just by being in it.", giftMessage: "Hope this little treat makes your birthday soar!" },
  { num: "2", title: "Have a Bird-tastic Birthday!",     front: "Have a Bird-tastic Birthday!",      insideBody: "Hope your big day flies high! Squawk and celebrate — you're the coolest bird in the flock.",          giftMessage: "A little something to help you celebrate!" },
  { num: "3", title: "Another Trip Around the Sun",      front: "Another Trip Around the Sun!",      insideBody: "Here's to the trails you've hiked, the views you've conquered, and the adventures still to come.",    giftMessage: "Fuel up for your next great adventure!" },
  { num: "4", title: "Born to Be Wild",                  front: "Born to Be Wild!",                  insideBody: "You bring energy and joy wherever you go. May this year take you to new heights!",                   giftMessage: "A little boost for your next big climb!" },
];

const ACTION_CONFIG = {
  title: "Ready to generate?",
  subtitle: "Your card concept is ready.",
  generateButtonLabel: "Generate Card",
  adjustOptions: ["Change Concept", "Start Over"],
};

// ── Page ────────────────────────────────────────────────────────────────────

export function PageChatbotOverflowMenus() {
  return (
    <DocPage
      title="Overflow Menus"
      subtitle="All four overflow menu variants used in the Stampy Chatbot conversation flow."
    >
      <DocSection title="Overflow — Numbered List">
        <p style={DESC_STYLE}>
          Radio-style numbered option picker. Supports multiple pages and a free-text input row.
        </p>

        <Preview
          title="Overflow menu"
          height={320}
          code={`import { OverflowMenu } from '@heartstamp/design-system';
import type { OverflowPage } from '@heartstamp/design-system';

<OverflowMenu
  pages={[{
    question: "What kind of vibe are you going for?",
    options: [
      { num: "1", label: "Funny" },
      { num: "2", label: "Sentimental" },
      { num: "3", label: "Serious / Heartfelt" },
      { num: "4", label: "Celebratory" },
      { num: "5", label: "Formal" },
    ],
  }]}
  inputPlaceholder="Type your own"
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OverflowMenu
              pages={[{ question: "What kind of vibe are you going for?", options: VIBE_OPTIONS }]}
              inputPlaceholder="Type your own"
              onClose={NOOP}
              onComplete={NOOP}
            />
          </div>
        </Preview>

        <Preview
          title="Multi-page overflow (paginated)"
          height={320}
          code={`import { OverflowMenu } from '@heartstamp/design-system';

// Pass multiple pages to enable pagination arrows
<OverflowMenu
  pages={[
    {
      question: "Tell me about the recipient",
      options: [
        { num: "1", label: "Friend" },
        { num: "2", label: "Partner" },
        { num: "3", label: "Parent" },
      ],
    },
    {
      question: "How close are you?",
      options: [
        { num: "1", label: "Very close" },
        { num: "2", label: "Casual" },
        { num: "3", label: "Work only" },
      ],
    },
  ]}
  inputPlaceholder="Type your own"
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OverflowMenu
              pages={RECIPIENT_PAGES}
              inputPlaceholder="Type your own"
              onClose={NOOP}
              onComplete={NOOP}
            />
          </div>
        </Preview>

        <PropsTable props={[
          { name: "pages",            type: "OverflowPage[]",        def: "(required)", required: true, desc: "Array of pages — each has a question string and options array ({ num, label })" },
          { name: "onComplete",       type: "(label: string) => void", def: "(required)", required: true, desc: "Called with the selected option label when the user picks an item or submits free text" },
          { name: "onClose",          type: "() => void",            def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "inputPlaceholder", type: "string",                def: '"Type your own"',            desc: "Placeholder text for the free-text input row at the bottom" },
        ]} />
      </DocSection>

      <DocSection title="Checklist — Multi-Select">
        <p style={DESC_STYLE}>
          Checkbox-style multi-select. Items can be toggled, with a free-text input and skip/send
          actions.
        </p>
        <Preview
          title="Checklist overflow"
          height={380}
          code={`import { ChecklistOverflowMenu } from '@heartstamp/design-system';
import type { ChecklistPage } from '@heartstamp/design-system';

<ChecklistOverflowMenu
  pages={[{
    question: "What are they into?",
    items: [
      { id: "cooking", label: "Cooking" },
      { id: "hiking",  label: "Hiking" },
      { id: "gaming",  label: "Gaming" },
      { id: "reading", label: "Reading" },
      { id: "travel",  label: "Travel" },
    ],
  }]}
  inputPlaceholder="You make the call"
  onClose={() => setOpen(false)}
  onComplete={(selected) => handleAnswer(selected)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ChecklistOverflowMenu
              pages={[{ question: "What are they into?", items: INTEREST_ITEMS }]}
              inputPlaceholder="You make the call"
              onClose={NOOP}
              onComplete={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "pages",            type: "ChecklistPage[]",           def: "(required)", required: true, desc: "Array of pages — each has a question string and items array ({ id, label })" },
          { name: "onComplete",       type: "(selected: string[]) => void", def: "(required)", required: true, desc: "Called with an array of selected labels (plus any free-text input) when the user taps Send" },
          { name: "onClose",          type: "() => void",                def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "inputPlaceholder", type: "string",                    def: '"You make the call"',         desc: "Placeholder text for the free-text input row at the bottom" },
        ]} />
      </DocSection>

      <DocSection title="Template — Card Picker">
        <p style={DESC_STYLE}>
          2-column card grid for selecting a greeting card template. Supports pagination.
        </p>
        <Preview
          title="Template card picker"
          height={440}
          code={`import { TemplateOverflowMenu } from '@heartstamp/design-system';
import type { TemplateCard } from '@heartstamp/design-system';

<TemplateOverflowMenu
  header="Pick a template"
  cards={[
    {
      num: "1",
      title: "Happy Birthday!",
      front: "Happy Birthday!",
      insideBody: "Wishing you all the best on your special day.",
      giftMessage: "Hope this makes your day!",
    },
    {
      num: "2",
      title: "Another Trip Around the Sun",
      front: "Another Trip Around the Sun!",
      insideBody: "Here's to the adventures still to come.",
      giftMessage: "Fuel up for your next great adventure!",
    },
  ]}
  inputPlaceholder="Something else"
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <TemplateOverflowMenu
              header="Pick a template"
              cards={TEMPLATE_CARDS}
              inputPlaceholder="Something else"
              onClose={NOOP}
              onComplete={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "header",           type: "string",               def: "(required)", required: true, desc: "Heading text shown above the card grid" },
          { name: "cards",            type: "TemplateCard[]",        def: "(required)", required: true, desc: "Array of template cards — each has: num, title, front, insideBody, giftMessage, and optional insideHeading" },
          { name: "onComplete",       type: "(label: string) => void", def: "(required)", required: true, desc: "Called with a formatted description string when the user selects a card or submits free text" },
          { name: "onClose",          type: "() => void",            def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "inputPlaceholder", type: "string",                def: '"Something else"',           desc: "Placeholder for the custom text input at the bottom" },
        ]} />
      </DocSection>

      <DocSection title="Action — Generate &amp; Adjust">
        <p style={DESC_STYLE}>
          Final action panel with a generate button, "Or Adjust" secondary options, and a free-text
          input.
        </p>
        <Preview
          title="Action overflow menu"
          height={240}
          code={`import { ActionOverflowMenu } from '@heartstamp/design-system';
import type { ActionMenuConfig } from '@heartstamp/design-system';

<ActionOverflowMenu
  config={{
    title: "Ready to generate?",
    subtitle: "Your card concept is ready.",
    generateButtonLabel: "Generate Card",
    adjustOptions: ["Change Concept", "Start Over"],
  }}
  inputPlaceholder="Something else"
  onClose={() => setOpen(false)}
  onGenerate={() => generateCard()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ActionOverflowMenu
              config={ACTION_CONFIG}
              inputPlaceholder="Something else"
              onClose={NOOP}
              onGenerate={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "config",           type: "ActionMenuConfig", def: "(required)", required: true, desc: "Config object: { title, subtitle, generateButtonLabel, adjustOptions: string[] }" },
          { name: "onGenerate",       type: "() => void",       def: "(required)", required: true, desc: "Called when the primary generate button is clicked" },
          { name: "onClose",          type: "() => void",       def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "inputPlaceholder", type: "string",           def: '"Something else"',           desc: "Placeholder for the free-text input at the bottom" },
        ]} />
      </DocSection>

      <DocSection title="Occasion Suggestions">
        <p style={DESC_STYLE}>
          Shown on the Stampy home screen when the chatbot opens. Displays 4 randomly selected
          occasion suggestions from a pool of 25, refreshed every time the chat is opened. Users
          can tap an item to start the conversation or dismiss the panel with the × button.
        </p>
        <Preview
          title="Occasion suggestions"
          height={260}
          code={`import { OccasionSuggestions } from '@heartstamp/design-system';

<OccasionSuggestions
  suggestions={["Birthday", "Thank you", "Anniversary", "Graduation"]}
  onSelect={(occasion) => startConversation(occasion)}
  onClose={() => setShowSuggestions(false)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OccasionSuggestions
              suggestions={["Birthday", "Thank you", "Anniversary", "Graduation"]}
              onSelect={NOOP}
              onClose={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "suggestions", type: "string[]",           def: "4 random occasions", desc: "List of occasion strings shown as numbered rows" },
          { name: "onSelect",    type: "(s: string) => void", def: "—",                 desc: "Called with the occasion string when the user taps a row" },
          { name: "onClose",     type: "() => void",          def: "—",                 desc: "Called when the user taps the × dismiss button" },
        ]} />
      </DocSection>
    </DocPage>
  );
}
