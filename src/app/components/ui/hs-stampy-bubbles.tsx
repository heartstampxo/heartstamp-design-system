// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Bubble components (WorkingSpinner, BubbleButton, StampyBubble, UserBubble, StyleCarousel)
// ═══════════════════════════════════════════════════════════════════════════

import { useRef } from "react";
import { Loader2, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { dmSans400, bubbleBg, bubbleSpring, STYLE_OPTIONS } from "./hs-stampy-constants";

// ── Shared sub-components ──────────────────────────────────────────────────

export function WorkingSpinner({ text = "Working on your request...", delay = 0 }: { text?: string; delay?: number }) {
  return (
    <motion.div
      className="flex gap-[8px] items-center shrink-0"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.15 } }}
      transition={{ ...bubbleSpring, delay }}
    >
      <div className="shrink-0 relative" style={{ width: 16, height: 16 }}>
        <motion.div
          className="absolute" style={{ top: 1, left: 1 }}
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
        >
          <Loader2 size={14} strokeWidth={2} color="var(--color-text-primary)" />
        </motion.div>
      </div>
      <p className="leading-[20px] text-[15px]" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{text}</p>
    </motion.div>
  );
}

export function BubbleButton({
  label, isUsed, onClick, delay = 0,
}: {
  label: string; isUsed: boolean; onClick?: () => void; delay?: number;
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 4, backgroundColor: "rgba(0,0,0,0)" }}
      animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
      transition={{ ...bubbleSpring, delay }}
      className={`flex gap-[8px] items-center px-[4px] py-[2px] rounded-[4px] w-full text-left ${!isUsed ? "cursor-pointer" : "cursor-default"}`}
      whileHover={!isUsed ? { backgroundColor: "var(--color-state-hover)" } : {}}
      onClick={!isUsed ? onClick : undefined}
    >
      <div className="shrink-0 size-[18px] flex items-center justify-center">
        <ChevronRight size={12} strokeWidth={1.5}
          style={{ color: isUsed ? "var(--color-text-disabled)" : "var(--color-text-primary)", flexShrink: 0 }}
        />
      </div>
      <p
        className="leading-[20px] text-[15px]"
        style={{
          fontFamily: "var(--font-family-body)",
          fontWeight: 500,
          fontVariationSettings: "'opsz' 14",
          color: isUsed ? "var(--color-text-disabled)" : "var(--color-text-primary)",
        }}
      >
        {label}
      </p>
    </motion.button>
  );
}

// ── StyleCarousel ──────────────────────────────────────────────────────────

export function StyleCarousel({ themeChoice, setThemeChoice }: { themeChoice: string | null; setThemeChoice: (s: string) => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchStartScrollLeft = useRef(0);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);

  return (
    <div className="relative w-full">
      <div
        ref={scrollRef}
        className="flex gap-[12px] items-start overflow-x-auto pb-[2px] w-full style-carousel"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
        onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; touchStartScrollLeft.current = scrollRef.current?.scrollLeft ?? 0; }}
        onTouchMove={(e) => { if (scrollRef.current) { scrollRef.current.scrollLeft = touchStartScrollLeft.current + (touchStartX.current - e.touches[0].clientX); } }}
        onMouseDown={(e) => { isDragging.current = true; dragStartX.current = e.clientX; dragScrollLeft.current = scrollRef.current?.scrollLeft ?? 0; }}
        onMouseMove={(e) => { if (isDragging.current && scrollRef.current) { e.preventDefault(); scrollRef.current.scrollLeft = dragScrollLeft.current + (dragStartX.current - e.clientX); } }}
        onMouseUp={() => { isDragging.current = false; }}
        onMouseLeave={() => { isDragging.current = false; }}
      >
        <style>{`.style-carousel::-webkit-scrollbar { display: none; }`}</style>
        {STYLE_OPTIONS.map(({ label, image }) => (
          <motion.button
            key={label}
            className={`flex flex-col gap-[8px] items-center p-[6px] rounded-[12px] shrink-0 ${!themeChoice ? "cursor-pointer" : "cursor-default"}`}
            style={{ opacity: themeChoice && themeChoice !== label ? 0.35 : 1, userSelect: "none" }}
            animate={{ backgroundColor: themeChoice === label ? "var(--color-element-subtle)" : "var(--color-brand-secondary-dim)" }}
            whileHover={!themeChoice ? { backgroundColor: "var(--color-element-subtle)" } : {}}
            transition={{ duration: 0.12 }}
            onClick={!themeChoice ? () => setThemeChoice(label) : undefined}
            draggable={false}
          >
            <div className="rounded-[8px] shrink-0 overflow-hidden" style={{ width: 99, height: 98 }}>
              <img src={image} alt={label} className="w-full h-full object-cover" draggable={false} />
            </div>
            <p
              className="leading-[20px] text-[15px] text-center whitespace-nowrap"
              style={{ fontFamily: "var(--font-family-body)", fontWeight: 500, fontVariationSettings: "'opsz' 14", color: "var(--color-text-primary)", minWidth: "100%" }}
            >
              {label}
            </p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ── StampyBubble / UserBubble ─────────────────────────────────────────────

export function StampyBubble({
  text, buttons,
  buttonsUsed = false,
  onButtonClick,
  buttonDelay = 0,
}: {
  text: string;
  buttons?: string[];
  /** Greys out buttons when a later message already exists. Defaults to false. */
  buttonsUsed?: boolean;
  /** Called when an active (non-used) button is clicked. */
  onButtonClick?: () => void;
  /** Per-button entrance stagger = index × buttonDelay (seconds). Defaults to 0. */
  buttonDelay?: number;
}) {
  return (
    <motion.div
      className="flex w-full justify-start shrink-0 pr-[56px]"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={bubbleSpring}
    >
      <div
        className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px] flex flex-col gap-[12px]"
        style={{ backgroundColor: bubbleBg, ...dmSans400, fontSize: 14, color: "var(--color-text-primary)", lineHeight: "1.5" }}
      >
        <p className="leading-[20px] text-[15px] whitespace-pre-wrap">{text}</p>
        {buttons?.length ? (
          <div className="flex flex-col gap-[6px]">
            {buttons.map((b, bi) => (
              <BubbleButton
                key={b}
                label={b}
                isUsed={buttonsUsed}
                onClick={!buttonsUsed ? onButtonClick : undefined}
                delay={bi * buttonDelay}
              />
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function UserBubble({ text, delay }: { text: string; delay?: number }) {
  return (
    <motion.div
      className="flex w-full justify-end shrink-0 pl-[56px]"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={delay !== undefined ? { ...bubbleSpring, delay } : bubbleSpring}
    >
      <div
        className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px]"
        style={{ backgroundColor: bubbleBg, ...dmSans400, fontSize: 14, color: "var(--color-text-primary)", lineHeight: "1.5" }}
      >
        <p className="leading-[20px] text-[15px] whitespace-pre-wrap">{text}</p>
      </div>
    </motion.div>
  );
}
