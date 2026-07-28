import React, { useState } from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { StampyPromotions } from "../../components/ui/hs-stampy-promotions";
import { ChatHeader } from "../../components/ui/hs-stampy-panels";
import { ChatHomeInput } from "../../components/ui/hs-stampy-chat";

/* Real chat input — rendered inside the reward screen via renderInput */
const SAMPLE_INPUT = (
  <ChatHomeInput
    placeholder="Ask, search or create your card"
    onSend={(value) => console.log(value)}
  />
);

export function PagePromotions() {
  const [key, setKey] = useState(0);

  return (
    <DocPage
      title="Stampy Promotions"
      subtitle="A swipeable card deck shown while a card is generating — lets users tune Stampy's taste and earn Heart Credits. Three gestures: swipe left (dislike), swipe right (like), swipe up or tap heart (super like). A progress bar auto-advances after a configurable delay. After the swipe threshold, a reward screen slides up."
    >
      <DocSection title="Swipe Screen">
        <Preview
          title="Stampy Promotions — inside chat container"
          height={600}
          fullWidth
          code={`import { StampyPromotions, ChatHomeInput } from '@heartstampxo/design-system';

<StampyPromotions
  swipesUntilReward={15}
  creditsEarned={20}
  autoAdvanceSec={5}
  onSwipe={(card, dir) => console.log(card.title, dir)}
  onClose={() => setVisible(false)}
  renderInput={<ChatHomeInput placeholder="Ask, search or create your card" onSend={(value) => console.log(value)} />}
/>`}
        >
          {/* Chat window shell — matches the Figma layout */}
          <div style={{
            width: 420,
            margin: "0 auto",
            borderRadius: 20,
            backgroundColor: "var(--color-bg-main, white)",
            boxShadow: "var(--shadow-xs, 0 2px 12px rgba(0,0,0,0.08))",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
          }}>
            <ChatHeader
              embedded
              conversationName="Father's Day"
              conversations={[
                { id: "1", name: "Father's Day" },
                { id: "2", name: "Valentine's Card" },
                { id: "3", name: "Birthday Bash" },
              ]}
              activeConversationId="1"
            />

            {/* Chat body */}
            <div style={{
              padding: 16,
            }}>
              <StampyPromotions
                key={key}
                swipesUntilReward={5}
                creditsEarned={20}
                autoAdvanceSec={5}
                onClose={() => setKey(k => k + 1)}
                renderInput={SAMPLE_INPUT}
              />
            </div>
          </div>
        </Preview>

        <PropsTable props={[
          { name: "cards",             type: "PromoCard[]",          def: "10 demo cards",  desc: "Array of card objects to swipe through. Loops when exhausted." },
          { name: "swipesUntilReward", type: "number",               def: "15",             desc: "Total swipes before the reward screen appears." },
          { name: "creditsEarned",     type: "number",               def: "20",             desc: "Heart Credits shown in the reward screen." },
          { name: "autoAdvanceSec",    type: "number",               def: "5",              desc: "Seconds before the progress bar auto-swipes right." },
          { name: "onSwipe",           type: "(card, dir) => void",  def: "—",              desc: "Called on every swipe. dir is 'like' | 'dislike' | 'super'." },
          { name: "onClose",           type: "() => void",           def: "—",              desc: "Called when the user taps Close on the reward screen." },
          { name: "renderInput",       type: "ReactNode",            def: "—",              desc: "Input rendered below the reward card. Animates in after 250 ms." },
        ]} />
      </DocSection>

      <DocSection title="PromoCard">
        <PropsTable props={[
          { name: "id",       type: "string", def: "(required)", required: true, desc: "Unique identifier for the card." },
          { name: "imageSrc", type: "string", def: "(required)", required: true, desc: "Image URL. Falls back to a gradient placeholder when empty." },
          { name: "title",    type: "string", def: "(required)", required: true, desc: "Card title shown in the footer (e.g. \"Father's Day\")." },
        ]} />
      </DocSection>
    </DocPage>
  );
}
