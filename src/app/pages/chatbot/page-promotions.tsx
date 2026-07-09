import React, { useState } from "react";
import { DocPage, DocSection } from "../../components/docs/doc-page";
import { Preview } from "../../components/docs/doc-preview";
import { PropsTable } from "../../components/docs/doc-props-table";
import { StampyPromotions } from "../../components/ui/hs-stampy-promotions";
import { ChatHeader } from "../../components/ui/hs-stampy-panels";

/* Sample chat input — rendered inside the reward screen via renderInput */
const SAMPLE_INPUT = (
  <div style={{
    background: "white",
    border: "1px solid rgba(36,36,35,0.1)",
    borderRadius: 12,
    padding: "12px 8px 8px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "0 6px" }}>
      <span style={{ fontSize: 13, color: "rgba(36,36,35,0.4)" }}>✦</span>
      <span style={{ fontSize: 15, color: "rgba(36,36,35,0.4)", flex: 1 }}>Something else? Write your own…</span>
    </div>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 2px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6,
        background: "rgba(36,36,35,0.06)", borderRadius: 100,
        padding: "6px 8px", fontSize: 12, fontWeight: 500, color: "#242423",
      }}>
        <span>🖼</span> Add reference images
      </div>
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ width: 32, height: 32, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 18 }}>🎤</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: 20, background: "rgba(36,36,35,0.06)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 14 }}>↑</span>
        </div>
      </div>
    </div>
  </div>
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
          code={`import { StampyPromotions } from '@heartstampxo/design-system';

<StampyPromotions
  swipesUntilReward={15}
  creditsEarned={20}
  autoAdvanceSec={8}
  onSwipe={(card, dir) => console.log(card.title, dir)}
  onClose={() => setVisible(false)}
  renderInput={<YourChatInput />}
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
                autoAdvanceSec={8}
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
          { name: "autoAdvanceSec",    type: "number",               def: "8",              desc: "Seconds before the progress bar auto-swipes right." },
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
