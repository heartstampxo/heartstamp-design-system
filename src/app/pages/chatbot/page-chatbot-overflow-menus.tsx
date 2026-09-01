import React from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import {
  OverflowMenu,
  ChecklistOverflowMenu,
  TemplateOverflowMenu,
  ActionOverflowMenu,
  ActionOverflowMenuList,
  ActionChecklistOverflowMenu,
  OccasionSuggestions,
  SignupOverflowMenu,
  OTPOverflowMenu,
} from "../../components/ui/hs-stampy-chat";

const DESC_STYLE: React.CSSProperties = { fontSize: "var(--font-size-body-15)", color: "var(--color-text-secondary)", marginBottom: "var(--space-4)" };
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

const ACTION_CONFIG_V1 = {
  title: "Ready to generate?",
  subtitle: "Your card concept is ready.",
  generateButtonLabel: "Generate Card",
  adjustOptions: ["Change Concept", "Start Over"],
};

const ACTION_CONFIG_V2 = {
  title: "Ready to generate?",
  subtitle: "Your card concept is ready.",
  generateButtonLabel: "Generate Card",
  adjustHeader: "Or, want to make changes?",
  adjustItems: [
    { num: "1", label: "Change the front artwork" },
    { num: "2", label: "Update inside message" },
    { num: "3", label: "Try different style" },
    { num: "4", label: "Make the tone more sarcastic" },
    { num: "5", label: "Looks great, I am done" },
  ],
};

const ACTION_CONFIG_CHECKLIST = {
  title: "Ready to generate?",
  subtitle: "Your card concept is ready.",
  generateButtonLabel: "Generate Card",
  adjustHeader: "Or, want to make changes?",
};

// ── Page ────────────────────────────────────────────────────────────────────

export function PageChatbotOverflowMenus() {
  return (
    <DocPage
      title="Overflow Menus"
      subtitle="Every overflow menu variant used in the Stampy Chatbot conversation flow."
    >
      <DocSection title="Overflow — Numbered List">
        <p style={DESC_STYLE}>
          Radio-style numbered option picker. Supports multiple pages, an optional Show more…
          action, and an optional Skip button the consumer wires up itself.
        </p>

        <Preview
          title="Overflow menu"
          height={320}
          code={`import { OverflowMenu } from '@heartstampxo/design-system';
import type { OverflowPage } from '@heartstampxo/design-system';

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
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
  onSkip={() => sendMessage('skip')}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OverflowMenu
              pages={[{ question: "🤗 What kind of vibe are you going for?", options: VIBE_OPTIONS }]}
              onClose={NOOP}
              onComplete={NOOP}
              onSkip={NOOP}
            />
          </div>
        </Preview>

        <Preview
          title="Multi-page overflow (paginated)"
          height={320}
          code={`import { OverflowMenu } from '@heartstampxo/design-system';

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
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
  onSkip={() => sendMessage('skip')}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OverflowMenu
              pages={RECIPIENT_PAGES}
              onClose={NOOP}
              onComplete={NOOP}
              onSkip={NOOP}
            />
          </div>
        </Preview>

        <Preview
          title="With Show More (single page only)"
          height={320}
          code={`<OverflowMenu
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
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
  onShowMore={() => openFullList()}
  onSkip={() => sendMessage('skip')}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OverflowMenu
              pages={[{ question: "What kind of vibe are you going for?", options: VIBE_OPTIONS }]}
              onClose={NOOP}
              onComplete={NOOP}
              onShowMore={() => alert("Show more clicked")}
              onSkip={() => alert("Skip clicked")}
            />
          </div>
        </Preview>

        <PropsTable props={[
          { name: "pages",            type: "OverflowPage[]",        def: "(required)", required: true, desc: "Array of pages — each has a question string and options array ({ num, label })" },
          { name: "onComplete",       type: "(label: string) => void", def: "(required)", required: true, desc: "Called with the selected option label. On multi-page menus it fires on the last page with every page’s pick joined by “, ”." },
          { name: "onClose",          type: "() => void",            def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onShowMore",       type: "() => void",            def: "—",                          desc: "When provided, renders the Show more… action in the footer. Only shown when there is a single page." },
          { name: "isLoadingShowMore", type: "boolean",              def: "false",                      desc: "Shows a spinner in the Show more… action and blocks repeat taps while more options load" },
          { name: "showMoreLabel",    type: "string",                def: '"Show more..."',             desc: "Copy for the show-more action, for localisation" },
          { name: "onSkip",           type: "() => void",            def: "—",                          desc: "When provided, renders the Skip button in the footer. The consumer decides what skipping does — omit it and no Skip button is rendered." },
          { name: "skipLabel",        type: "string",                def: '"Skip"',                     desc: "Copy for the Skip button, for localisation" },
        ]} />
      </DocSection>

      <DocSection title="Checklist — Multi-Select">
        <p style={DESC_STYLE}>
          Checkbox-style multi-select. Items toggle on tap; the menu reports what is ticked
          through onSelectionChange and the consumer submits.
        </p>
        <Preview
          title="Checklist overflow"
          height={380}
          code={`import { ChecklistOverflowMenu } from '@heartstampxo/design-system';
import type { ChecklistPage } from '@heartstampxo/design-system';

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
  onClose={() => setOpen(false)}
  onSelectionChange={(selected) => setPending(selected)}
  onSkip={() => sendMessage('skip')}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ChecklistOverflowMenu
              pages={[{ question: "🎂 What are they into?", items: INTEREST_ITEMS }]}
              onClose={NOOP}
              onSelectionChange={NOOP}
              onSkip={NOOP}
            />
          </div>
        </Preview>
        <Preview
          title="With Show More"
          height={380}
          code={`<ChecklistOverflowMenu
  pages={[{
    question: "What are they into?",
    items: [
      { id: "cooking", label: "Cooking" },
      { id: "hiking",  label: "Hiking" },
      { id: "gaming",  label: "Gaming" },
    ],
  }]}
  onClose={() => setOpen(false)}
  onSelectionChange={(selected) => setPending(selected)}
  onSkip={() => sendMessage('skip')}
  onShowMore={() => openFullList()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ChecklistOverflowMenu
              pages={[{ question: "What are they into?", items: INTEREST_ITEMS }]}
              onClose={NOOP}
              onSelectionChange={NOOP}
              onShowMore={() => alert("Show more clicked")}
              onSkip={() => alert("Skip clicked")}
            />
          </div>
        </Preview>

        <PropsTable props={[
          { name: "pages",            type: "ChecklistPage[]",           def: "(required)", required: true, desc: "Array of pages — each has a question string and items array ({ id, label })" },
          { name: "onClose",          type: "() => void",                def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onSelectionChange", type: "(selected: string[]) => void", def: "—",              desc: "Fired on every toggle with the labels currently ticked, across all pages. The menu has no send button — mirror this into your own state and submit it from your own input." },
          { name: "onShowMore",       type: "() => void",            def: "—",                          desc: "When provided, renders the Show more… action in the footer" },
          { name: "isLoadingShowMore", type: "boolean",              def: "false",                      desc: "Shows a spinner in the Show more… action and blocks repeat taps while more options load" },
          { name: "showMoreLabel",    type: "string",                def: '"Show more..."',             desc: "Copy for the show-more action, for localisation" },
          { name: "onSkip",           type: "() => void",            def: "—",                          desc: "When provided, renders the Skip button in the footer. The consumer decides what skipping does — omit it and no Skip button is rendered." },
          { name: "skipLabel",        type: "string",                def: '"Skip"',                     desc: "Copy for the Skip button, for localisation" },
        ]} />
      </DocSection>

      <DocSection title="Template — Card Picker">
        <p style={DESC_STYLE}>
          2-column card grid for selecting a greeting card template. Supports pagination.
        </p>
        <Preview
          title="Template card picker"
          height={440}
          code={`import { TemplateOverflowMenu } from '@heartstampxo/design-system';
import type { TemplateCard } from '@heartstampxo/design-system';

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
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
  onSkip={() => sendMessage('skip')}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <TemplateOverflowMenu
              header="Pick a template"
              cards={TEMPLATE_CARDS}
              onClose={NOOP}
              onComplete={NOOP}
              onSkip={NOOP}
            />
          </div>
        </Preview>
        <Preview
          title="With Show More"
          height={440}
          code={`<TemplateOverflowMenu
  header="Pick a template"
  cards={[...]}
  onClose={() => setOpen(false)}
  onComplete={(label) => handleAnswer(label)}
  onSkip={() => sendMessage('skip')}
  onShowMore={() => openAllTemplates()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <TemplateOverflowMenu
              header="Pick a template"
              cards={TEMPLATE_CARDS}
              onClose={NOOP}
              onComplete={NOOP}
              onShowMore={() => alert("Show more clicked")}
              onSkip={() => alert("Skip clicked")}
            />
          </div>
        </Preview>

        <PropsTable props={[
          { name: "header",           type: "string",               def: "(required)", required: true, desc: "Heading text shown above the card grid" },
          { name: "cards",            type: "TemplateCard[]",        def: "(required)", required: true, desc: "Array of template cards — each has: num, title, front, insideBody, giftMessage, and optional insideHeading" },
          { name: "onComplete",       type: "(label: string) => void", def: "(required)", required: true, desc: "Called with a formatted description string when the user selects a card" },
          { name: "onClose",          type: "() => void",            def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onShowMore",       type: "() => void",            def: "—",                          desc: "When provided, renders the Show more… action in the footer" },
          { name: "isLoadingShowMore", type: "boolean",              def: "false",                      desc: "Shows a spinner in the Show more… action and blocks repeat taps while more options load" },
          { name: "showMoreLabel",    type: "string",                def: '"Show more..."',             desc: "Copy for the show-more action, for localisation" },
          { name: "onSkip",           type: "() => void",            def: "—",                          desc: "When provided, renders the Skip button in the footer. The consumer decides what skipping does — omit it and no Skip button is rendered." },
          { name: "skipLabel",        type: "string",                def: '"Skip"',                     desc: "Copy for the Skip button, for localisation" },
        ]} />
      </DocSection>

      <DocSection title="Action V1 — Ghost Buttons">
        <p style={DESC_STYLE}>
          Final action panel with a generate button and horizontal &ldquo;Or Adjust&rdquo; ghost
          buttons.
        </p>
        <Preview
          title="ActionOverflowMenu (V1)"
          height={240}
          code={`import { ActionOverflowMenu } from '@heartstampxo/design-system';

<ActionOverflowMenu
  config={{
    title: "Ready to generate?",
    subtitle: "Your card concept is ready.",
    generateButtonLabel: "Generate Card",
    adjustOptions: ["Change Concept", "Start Over"],
  }}
  onClose={() => setOpen(false)}
  onGenerate={() => generateCard()}
  onAdjust={(label) => handleChoice(label)}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ActionOverflowMenu
              config={ACTION_CONFIG_V1}
              onClose={NOOP}
              onGenerate={NOOP}
              onAdjust={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "config",           type: "ActionMenuConfig", def: "(required)", required: true, desc: "Config object: { title, subtitle, generateButtonLabel, adjustOptions: string[] }" },
          { name: "onGenerate",       type: "() => void",       def: "(required)", required: true, desc: "Called when the primary generate button is clicked" },
          { name: "onClose",          type: "() => void",       def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onAdjust",         type: "(label: string) => void", def: "—",                   desc: "Called with the adjust option the user picked. Falls back to onClose when omitted." },
          { name: "generateButtonLabel", type: "string",        def: "config.generateButtonLabel", desc: "Overrides the generate button copy without rebuilding config" },
          { name: "isLoadingGenerate", type: "boolean",         def: "false",                      desc: "Shows a spinner in the generate button and disables it" },
        ]} />
      </DocSection>

      <DocSection title="Action V2 — Numbered List">
        <p style={DESC_STYLE}>
          Final action panel with a generate button and a vertical numbered list of
          modification options.
        </p>
        <Preview
          title="ActionOverflowMenuList (V2)"
          height={420}
          code={`import { ActionOverflowMenuList } from '@heartstampxo/design-system';

<ActionOverflowMenuList
  config={{
    title: "Ready to generate?",
    subtitle: "Your card concept is ready.",
    generateButtonLabel: "Generate Card",
    adjustHeader: "Or, want to make changes?",
    adjustItems: [
      { num: "1", label: "Change the front artwork" },
      { num: "2", label: "Update inside message" },
      { num: "3", label: "Try different style" },
    ],
  }}
  onClose={() => setOpen(false)}
  onGenerate={() => generateCard()}
  onComplete={(label) => handleChoice(label)}
  onShowMore={() => openFullList()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ActionOverflowMenuList
              config={ACTION_CONFIG_V2}
              onClose={NOOP}
              onGenerate={NOOP}
              onComplete={NOOP}
              onShowMore={() => alert("Show more clicked")}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "config",           type: "ActionMenuConfig", def: "(required)", required: true, desc: "Config object: { title, subtitle, generateButtonLabel, adjustHeader?, adjustItems: {num, label}[] }" },
          { name: "onGenerate",       type: "() => void",       def: "(required)", required: true, desc: "Called when the primary generate button is clicked" },
          { name: "onComplete",       type: "(label: string) => void", def: "(required)", required: true, desc: "Called with the label of the adjust-list item the user picked" },
          { name: "onClose",          type: "() => void",       def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onShowMore",       type: "() => void",       def: "—",                          desc: "When provided, renders the Show more… action under the list" },
          { name: "isLoadingShowMore", type: "boolean",         def: "false",                      desc: "Shows a spinner in the Show more… action and blocks repeat taps while more options load" },
          { name: "showMoreLabel",    type: "string",           def: '"Show more..."',             desc: "Copy for the show-more action, for localisation" },
        ]} />
      </DocSection>

      <DocSection title="Action — Multi-Select Checklist">
        <p style={DESC_STYLE}>
          The Action header — title, subtitle, and primary generate button — over a multi-select
          checklist instead of a numbered list. Like the other menus it has no send button: it
          reports what is ticked through <code>onSelectionChange</code> and the consumer submits.
        </p>
        <Preview
          title="ActionChecklistOverflowMenu"
          height={420}
          code={`import { ActionChecklistOverflowMenu } from '@heartstampxo/design-system';

<ActionChecklistOverflowMenu
  config={{
    title: "Ready to generate?",
    subtitle: "Your card concept is ready.",
    generateButtonLabel: "Generate Card",
    adjustHeader: "Or, want to make changes?",
  }}
  items={[
    { id: "cooking", label: "Cooking" },
    { id: "golf",    label: "Golf" },
    { id: "gaming",  label: "Gaming" },
  ]}
  onClose={() => setOpen(false)}
  onGenerate={() => generateCard()}
  onSelectionChange={(selected) => setPending(selected)}
  onShowMore={() => openFullList()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <ActionChecklistOverflowMenu
              config={ACTION_CONFIG_CHECKLIST}
              items={INTEREST_ITEMS}
              onClose={NOOP}
              onGenerate={NOOP}
              onSelectionChange={NOOP}
              onShowMore={() => alert("Show more clicked")}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "config",           type: "ActionMenuConfig", def: "(required)", required: true, desc: "Config object: { title, subtitle, generateButtonLabel, adjustHeader? }. adjustItems is ignored — the items prop drives the checklist." },
          { name: "items",            type: "{ id, label }[]",  def: "(required)", required: true, desc: "Checklist items rendered under the header" },
          { name: "onGenerate",       type: "() => void",       def: "(required)", required: true, desc: "Called when the primary generate button is clicked" },
          { name: "onClose",          type: "() => void",       def: "(required)", required: true, desc: "Called when the × close button is tapped" },
          { name: "onSelectionChange", type: "(selected: string[]) => void", def: "—",             desc: "Fired on every toggle with the labels currently ticked. The menu has no send button — mirror this into your own state and submit it from your own input." },
          { name: "generateButtonLabel", type: "string",        def: "config.generateButtonLabel", desc: "Overrides the generate button copy without rebuilding config" },
          { name: "isLoadingGenerate", type: "boolean",         def: "false",                      desc: "Shows a spinner in the generate button and disables it" },
          { name: "onShowMore",       type: "() => void",       def: "—",                          desc: "When provided, renders the Show more… action under the checklist" },
          { name: "isLoadingShowMore", type: "boolean",         def: "false",                      desc: "Shows a spinner in the Show more… action and blocks repeat taps while more options load" },
          { name: "showMoreLabel",    type: "string",           def: '"Show more..."',             desc: "Copy for the show-more action, for localisation" },
        ]} />
      </DocSection>

      <DocSection title="Signup — Social + Email">
        <p style={DESC_STYLE}>
          Sign-up panel with Apple, Google, and Facebook OAuth buttons plus an email CTA. Shown when
          the user triggers account creation from the chatbot flow.
        </p>
        <Preview
          title="SignupOverflowMenu"
          height={500}
          code={`import { SignupOverflowMenu } from '@heartstampxo/design-system';

<SignupOverflowMenu
  onClose={() => setOpen(false)}
  onApple={() => signUpWith("apple")}
  onGoogle={() => signUpWith("google")}
  onFacebook={() => signUpWith("facebook")}
  onEmail={() => goToEmailSignup()}
  onSignIn={() => goToSignIn()}
  onTerms={() => openTerms()}
  onPrivacy={() => openPrivacy()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <SignupOverflowMenu
              onClose={NOOP}
              onApple={NOOP}
              onGoogle={NOOP}
              onFacebook={NOOP}
              onEmail={NOOP}
              onSignIn={NOOP}
              onTerms={NOOP}
              onPrivacy={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "title",       type: "string",      def: '"Create your free account"',                                      desc: "Heading text" },
          { name: "subtitle",    type: "string",      def: '"Sign up for free..."',                                           desc: "Sub-heading below the title" },
          { name: "onClose",     type: "() => void",  def: "(required)", required: true,                                      desc: "Called when the × close button is tapped" },
          { name: "onApple",     type: "() => void",  def: "—",                                                              desc: "Called when the Sign in with Apple button is clicked" },
          { name: "onGoogle",    type: "() => void",  def: "—",                                                              desc: "Called when the Sign in with Google button is clicked" },
          { name: "onFacebook",  type: "() => void",  def: "—",                                                              desc: "Called when the Sign in with Facebook button is clicked" },
          { name: "onEmail",     type: "() => void",  def: "—",                                                              desc: "Called when the Sign in with email CTA is clicked" },
          { name: "onSignIn",    type: "() => void",  def: "—",                                                              desc: "Called when the 'Sign in' link in the footer is clicked" },
          { name: "onTerms",     type: "() => void",  def: "—",                                                              desc: "Called when the Terms of Use link is clicked" },
          { name: "onPrivacy",   type: "() => void",  def: "—",                                                              desc: "Called when the Privacy Policy link is clicked" },
        ]} />
      </DocSection>

      <DocSection title="OTP — Code Verification">
        <p style={DESC_STYLE}>
          Verification step shown after the user enters their email. Accepts a numeric OTP code and
          exposes a resend handler.
        </p>
        <Preview
          title="OTPOverflowMenu"
          height={460}
          code={`import { OTPOverflowMenu } from '@heartstampxo/design-system';

<OTPOverflowMenu
  buttonLabel="Verify"
  onClose={() => setOpen(false)}
  onVerify={(code) => verifyOTP(code)}
  onResend={() => resendCode()}
  onSignIn={() => goToSignIn()}
  onTerms={() => openTerms()}
  onPrivacy={() => openPrivacy()}
/>`}
        >
          <div style={MENU_WRAPPER_STYLE}>
            <OTPOverflowMenu
              onClose={NOOP}
              onVerify={NOOP}
              onResend={NOOP}
              onSignIn={NOOP}
              onTerms={NOOP}
              onPrivacy={NOOP}
            />
          </div>
        </Preview>
        <PropsTable props={[
          { name: "title",       type: "string",                 def: '"Create your free account"', desc: "Heading text" },
          { name: "subtitle",    type: "string",                 def: '"Sign up for free..."',       desc: "Sub-heading below the title" },
          { name: "buttonLabel", type: "string",                 def: '"Verify"',                   desc: "Label for the primary action button" },
          { name: "onClose",     type: "() => void",             def: "(required)", required: true,  desc: "Called when the × close button is tapped" },
          { name: "onVerify",    type: "(code: string) => void", def: "(required)", required: true,  desc: "Called with the entered code when the user taps Verify or presses Enter" },
          { name: "onResend",    type: "() => void",             def: "—",                          desc: "Called when the Resend link is clicked" },
          { name: "onSignIn",    type: "() => void",             def: "—",                          desc: "Called when the 'Sign in' link in the footer is clicked" },
          { name: "onTerms",     type: "() => void",             def: "—",                          desc: "Called when the Terms of Use link is clicked" },
          { name: "onPrivacy",   type: "() => void",             def: "—",                          desc: "Called when the Privacy Policy link is clicked" },
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
          code={`import { OccasionSuggestions } from '@heartstampxo/design-system';

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
