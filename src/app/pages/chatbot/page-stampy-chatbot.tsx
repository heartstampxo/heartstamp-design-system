import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { StampyChatbot } from "../../components/ui/hs-stampy-chat";
import demoChatScript from "../../components/ui/hs-chat-demo-script";
import chatMascotImg   from "../../../assets/stampy/mascot.png";
import chatAiIconImg   from "../../../assets/stampy/ai-icon.png";
import chatHomeBgImg   from "../../../assets/stampy/home-bg.png";
import stampyIconImg   from "../../../assets/stampy/icon.svg";
import partyPopperImg  from "../../../assets/stampy/party-popper.gif";

const DEMO_CODE = `import { StampyChatbot } from '@heartstamp/design-system';
import type { ChatScript } from '@heartstamp/design-system';

const chatScript: ChatScript = {
  examplePrompts: [
    "Make a birthday card for my best friend",
    "Write a thank-you card for my boss",
  ],
  steps: [
    { type: "stampy", message: "I can help with that! What kind of card are you making?", delay: 1200 },
    {
      type: "overflow",
      pages: [{
        question: "What kind of vibe are you going for?",
        options: [
          { num: "1", label: "Funny" },
          { num: "2", label: "Sentimental" },
          { num: "3", label: "Celebratory" },
        ],
      }],
    },
  ],
};

<StampyChatbot
  chatScript={chatScript}
  mascotSrc="/stampy/mascot.png"
  aiIconSrc="/stampy/ai-icon.png"
  backgroundSrc="/stampy/home-bg.png"
  stampyIconSrc="/stampy/icon.svg"
  partyPopperSrc="/stampy/party-popper.gif"
/>`;

const MAIN_PROPS = [
  { name: "chatScript",     type: "ChatScript", def: "—",         required: true as const, desc: "Conversation script (prompts + step array)" },
  { name: "mascotSrc",      type: "string",     def: "(required)", required: true as const, desc: "Mascot image URL" },
  { name: "aiIconSrc",      type: "string",     def: "(required)", required: true as const, desc: "AI sparkle icon URL" },
  { name: "backgroundSrc",  type: "string",     def: "(required)", required: true as const, desc: "Home background pattern URL" },
  { name: "stampyIconSrc",  type: "string",     def: "(required)", required: true as const, desc: "FAB icon URL" },
  { name: "partyPopperSrc", type: "string",     def: "(required)", required: true as const, desc: "Party popper GIF URL" },
  { name: "containerHeight",type: "number",     def: "window.innerHeight",                  desc: "Height (px) used for the expanded panel — pass your container height to avoid overflow" },
  { name: "className",      type: "string",     def: '""',                                  desc: "Additional CSS classes on root" },
];

const STEP_TYPES = [
  { name: "stampy",         type: "step", def: "—", desc: "AI sends a typed message with optional trigger buttons" },
  { name: "overflow",       type: "step", def: "—", desc: "Radio-button style option picker (paginated)" },
  { name: "checklist",      type: "step", def: "—", desc: "Multi-select checklist with custom input" },
  { name: "template",       type: "step", def: "—", desc: "2-column card grid for template selection" },
  { name: "style-carousel", type: "step", def: "—", desc: "Horizontal scrollable style picker with images" },
  { name: "action",         type: "step", def: "—", desc: "Generate button + Or Adjust options" },
  { name: "final-card",     type: "step", def: "—", desc: "Summary message with trigger button" },
  { name: "banner",         type: "step", def: "—", desc: "Loading → done animated banner" },
];

export function PageStampyChatbot() {
  return (
    <DocPage
      title="Stampy Chatbot"
      subtitle="A fully interactive AI chatbot widget with conversation flow, overflow menus, template selection, checklist, style carousel, and animated typing indicators."
    >
      <DocSection title="Live Demo">
        <p className="text-muted-foreground text-[15px] mb-4">
          Click the Stampy icon in the bottom-right to open the chatbot. Try typing a message or
          selecting a suggestion to start the conversation flow.
        </p>
        <Preview title="Stampy Chatbot" height={750} fullWidth code={DEMO_CODE}>
          <div style={{ width: "100%", height: 750, position: "relative", overflow: "hidden", borderRadius: 12 }}>
            <StampyChatbot
              chatScript={demoChatScript}
              mascotSrc={chatMascotImg}
              aiIconSrc={chatAiIconImg}
              backgroundSrc={chatHomeBgImg}
              stampyIconSrc={stampyIconImg}
              partyPopperSrc={partyPopperImg}
              containerHeight={750}
            />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={MAIN_PROPS} />
      </DocSection>

      <DocSection title="Step Types">
        <PropsTable props={STEP_TYPES} />
      </DocSection>
    </DocPage>
  );
}
