// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Faithful port from the Stampy Chatbot Component project.
// Every sub-component, style, animation, and color is matched to the live app.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useId } from "react";
import { ImagePlus, Mic, ArrowUp, X, PencilLine, Pencil, CheckCheck, ChevronRight, ChevronLeft, ChevronDown, Plus, Loader2 } from "lucide-react";
import { Btn } from "./btn";
import { motion, AnimatePresence } from "motion/react";

import {
  MIC_PATH, ADD_IMAGE_PATH, SEND_ARROW_PATH, CHECKMARK_PATH,
} from "./hs-chat-svg";
import type {
  ChatScript, ChatMessage, ConversationStep,
  OverflowPage, ChecklistPage, TemplateCard, ActionMenuConfig,
} from "./hs-chat-types";

// Assets are passed as props to avoid bloating the library bundle.
// Consumers import their own assets or use the defaults from the demo page.

// ── Constants ──────────────────────────────────────────────────────────────

const OCCASIONS = [
  "Birthday", "Retirement", "Thank you", "Anniversary", "Wedding",
  "Graduation", "Baby shower", "Get well soon", "Congratulations",
  "New job", "Sympathy", "Housewarming", "Valentine's Day", "Mother's Day",
  "Father's Day", "Christmas", "Halloween", "New Year", "Promotion",
  "Just because", "Thinking of you", "Good luck", "Welcome back",
  "Farewell", "Engagement",
];

function getRandomSuggestions(count = 3): string[] {
  const shuffled = [...OCCASIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

// ── Shared text styles ─────────────────────────────────────────────────────

const dmSans400 = { fontFamily: "var(--font-family-body)", fontWeight: 400 } as const;
const dmSans500 = { fontFamily: "var(--font-family-body)", fontWeight: 500 } as const;
// Bubble background maps to the brand-secondary-dim token
const bubbleBg = "var(--color-brand-secondary-dim)";

// ── Spring configs ─────────────────────────────────────────────────────────

const springConfig = { type: "spring" as const, stiffness: 400, damping: 10 };
const entranceSpring = { type: "spring" as const, stiffness: 280, damping: 22 };
const bubbleSpring = { type: "spring" as const, stiffness: 320, damping: 34 };

// ── Hooks ──────────────────────────────────────────────────────────────────

function useTypewriter(prompts: string[]) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const stateRef = useRef({
    promptIndex: 0,
    charIndex: 0,
    phase: "typing" as "typing" | "pause" | "deleting" | "wait",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptsRef = useRef(prompts);

  useEffect(() => { promptsRef.current = prompts; }, [prompts]);

  useEffect(() => {
    function tick() {
      const s = stateRef.current;
      const prompts = promptsRef.current;
      const prompt = prompts[s.promptIndex];

      if (s.phase === "typing") {
        if (s.charIndex < prompt.length) {
          s.charIndex += 1;
          setDisplayText(prompt.slice(0, s.charIndex));
          setIsTyping(true);
          const delay = Math.random() < 0.08 ? 120 + Math.random() * 80 : 28 + Math.random() * 35;
          timeoutRef.current = setTimeout(tick, delay);
        } else {
          setIsTyping(false);
          s.phase = "deleting";
          timeoutRef.current = setTimeout(tick, 2200 + Math.random() * 800);
        }
      } else if (s.phase === "deleting") {
        if (s.charIndex > 0) {
          s.charIndex -= 1;
          setDisplayText(prompt.slice(0, s.charIndex));
          timeoutRef.current = setTimeout(tick, 14 + Math.random() * 18);
        } else {
          s.phase = "wait";
          timeoutRef.current = setTimeout(tick, 400 + Math.random() * 300);
        }
      } else if (s.phase === "wait") {
        const current = s.promptIndex;
        let next = current;
        while (next === current) { next = Math.floor(Math.random() * prompts.length); }
        s.promptIndex = next;
        s.charIndex = 0;
        s.phase = "typing";
        setIsTyping(true);
        timeoutRef.current = setTimeout(tick, 300);
      }
    }
    timeoutRef.current = setTimeout(tick, 500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return { displayText, isTyping };
}

function useBubbleTypewriter(text: string | null) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!text) { setDisplayed(""); setIsDone(false); charRef.current = 0; return; }
    charRef.current = 0;
    setDisplayed("");
    setIsDone(false);

    function tick() {
      charRef.current += 1;
      setDisplayed(text!.slice(0, charRef.current));
      if (charRef.current < text!.length) {
        const delay = Math.random() < 0.06 ? 80 + Math.random() * 60 : 14 + Math.random() * 20;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setIsDone(true);
      }
    }
    timerRef.current = setTimeout(tick, 30);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text]);

  return { displayed, isDone };
}

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

const STYLE_OPTIONS = [
  { label: "Cartoon", image: "https://images.unsplash.com/photo-1767557125491-b3483567d843?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Realistic", image: "https://images.unsplash.com/photo-1767978614407-de68168e7471?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Watercolor", image: "https://images.unsplash.com/photo-1762117499084-2305f510c84c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Sketch", image: "https://images.unsplash.com/photo-1720248090619-95d555f01bfb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Oil Painting", image: "https://images.unsplash.com/photo-1681238339131-7ce2e66df342?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Pixel Art", image: "https://images.unsplash.com/photo-1646061550931-74b78e83863c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Vintage", image: "https://images.unsplash.com/photo-1638009185192-4b03191ab0c3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Minimalist", image: "https://images.unsplash.com/photo-1770009971150-f50bc7d373a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
  { label: "Pop Art", image: "https://images.unsplash.com/photo-1759352641912-d4ce0f948fdc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400" },
];

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

export function StampyBubble({ text, buttons }: { text: string; buttons?: string[] }) {
  return (
    <motion.div
      className="flex w-full justify-start shrink-0 pr-[56px]"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={bubbleSpring}
    >
      <div
        className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px]"
        style={{ backgroundColor: bubbleBg, ...dmSans400, fontSize: 14, color: "var(--color-text-primary)", lineHeight: "1.5" }}
      >
        {text}
        {buttons?.length ? (
          <div className="flex flex-col gap-[6px] mt-[8px]">
            {buttons.map((b, i) => <BubbleButton key={i} label={b} isUsed={false} />)}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

export function UserBubble({ text }: { text: string }) {
  return (
    <motion.div
      className="flex w-full justify-end shrink-0 pl-[56px]"
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={bubbleSpring}
    >
      <div
        className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px]"
        style={{ backgroundColor: bubbleBg, ...dmSans400, fontSize: 14, color: "var(--color-text-primary)", lineHeight: "1.5" }}
      >
        {text}
      </div>
    </motion.div>
  );
}

// ── OverflowMenu ───────────────────────────────────────────────────────────

/** Shared close (×) button used across all 4 overflow menu variants */
function OverflowCloseBtn({ onClose, className = "" }: { onClose: () => void; className?: string }) {
  return (
    <button
      className={`flex items-center justify-center shrink-0 size-[16px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity ${className}`}
      onClick={onClose}
    >
      <X size={16} strokeWidth={1.5} absoluteStrokeWidth style={{ color: "var(--color-text-secondary)" }} />
    </button>
  );
}

/** Shared page-N-of-M pagination row used across 3 overflow menu variants */
function OverflowPagination({ page, total, onPrev, onNext }: {
  page: number; total: number; onPrev: () => void; onNext: () => void;
}) {
  return (
    <div className="flex gap-[4px] items-center">
      <button className="flex items-center justify-center size-[16px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30" onClick={onPrev} disabled={page === 1}>
        <ChevronLeft size={16} strokeWidth={1.5} absoluteStrokeWidth style={{ color: "var(--color-text-secondary)" }} />
      </button>
      <p className="leading-normal text-[13px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{page} of {total}</p>
      <button className="flex items-center justify-center size-[16px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30" onClick={onNext} disabled={page === total}>
        <ChevronRight size={16} strokeWidth={1.5} absoluteStrokeWidth style={{ color: "var(--color-text-secondary)" }} />
      </button>
    </div>
  );
}

export function OverflowMenu({
  pages, inputPlaceholder, onClose, onComplete,
}: {
  pages: OverflowPage[]; inputPlaceholder?: string; onClose: () => void; onComplete: (label: string) => void;
}) {
  const totalPages = pages.length;
  const [page, setPage] = useState(1);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const TYPEWRITER_TARGET = inputPlaceholder ?? "Type your own";
  const [typewriterText, setTypewriterText] = useState("");
  const [typewriterDone, setTypewriterDone] = useState(false);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    let i = 0;
    const tick = () => {
      i += 1;
      setTypewriterText(TYPEWRITER_TARGET.slice(0, i));
      if (i < TYPEWRITER_TARGET.length) { setTimeout(tick, 42 + Math.random() * 30); }
      else { setTypewriterDone(true); setInputValue(TYPEWRITER_TARGET); }
    };
    const start = setTimeout(tick, 320);
    return () => clearTimeout(start);
  }, []);

  const currentPageData = pages[page - 1];
  const items = currentPageData?.options ?? [];
  const header = currentPageData?.question ?? "";

  function handleItemClick(item: { num: string; label: string }) {
    const newLabels = [...selectedLabels, item.label];
    if (page < totalPages) { setSelectedLabels(newLabels); setPage(page + 1); }
    else { onComplete(newLabels.join(", ")); }
  }

  return (
    <div
      className="flex flex-col gap-[4px] items-start p-[8px] relative rounded-[12px] w-full"
      style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="w-full"
          initial={{ opacity: 0, x: page > 1 ? 14 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: page > 1 ? -14 : 14 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <div className="flex flex-row items-center w-full">
            <div className="flex gap-[8px] items-center p-[8px] w-full">
              <p className="flex-1 leading-[20px] text-[15px] min-w-0" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{header}</p>
              <div className="flex gap-[12px] items-center shrink-0">
                {totalPages > 1 && <OverflowPagination page={page} total={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />}
                <OverflowCloseBtn onClose={onClose} />
              </div>
            </div>
          </div>

          {items.map((item) => (
            <div
              key={item.num}
              className="flex flex-col h-[36px] items-start w-full rounded-[6px] transition-colors cursor-pointer"
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-element-subtle)")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
              onClick={() => handleItemClick(item)}
            >
              <div className="flex flex-row items-center size-full">
                <div className="flex gap-[8px] items-center px-[8px] py-[6px] w-full cursor-pointer">
                  <div className="flex items-center justify-center rounded-[4px] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
                    <p className="leading-[20px] text-[14px] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.num}</p>
                  </div>
                  <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* "Something else" input */}
      <div className="rounded-[12px] flex items-center px-[12px] py-[8px] w-full" style={{ outline: "1px solid var(--color-element-subtle)", outlineOffset: "-1px" }}>
        <div className="flex flex-1 items-center gap-[6px] min-w-0">
          <div className="flex items-center justify-center rounded-[4px] shrink-0 size-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
            <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
          </div>
          {typewriterDone ? (
            <input
              className="flex-1 leading-[20px] text-[14px] min-w-0 bg-transparent outline-none border-none"
              style={{ ...dmSans400, color: "var(--color-text-secondary)", caretColor: "var(--color-text-primary)" }}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => { if (inputValue === TYPEWRITER_TARGET) setInputValue(""); }}
              onBlur={() => { if (inputValue.trim() === "") setInputValue(TYPEWRITER_TARGET); }}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter" && inputValue.trim() && inputValue !== TYPEWRITER_TARGET) {
                  onComplete([...selectedLabels, inputValue.trim()].join(", "));
                }
              }}
              spellCheck={false}
            />
          ) : (
            <span className="flex-1 leading-[20px] text-[14px] truncate min-w-0 select-none" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
              {typewriterText}
              <motion.span className="inline-block w-[1px] h-[12px] ml-[1px] align-middle" style={{ backgroundColor: "var(--color-text-secondary)" }} animate={{ opacity: [1, 1, 0, 0] }} transition={{ repeat: Infinity, duration: 0.7, times: [0, 0.45, 0.5, 1] }} />
            </span>
          )}
        </div>
        <div className="flex items-center gap-[8px]">
          <Btn type="button" variant="outline" size="sm" onClick={() => onComplete("skip")}>Skip</Btn>
          <Btn type="button" variant="default" size="icon-sm" onClick={() => { const trimmed = inputValue.trim(); if (trimmed && trimmed !== TYPEWRITER_TARGET) onComplete([...selectedLabels, trimmed].join(", ")); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── ChecklistOverflowMenu ──────────────────────────────────────────────────

export function ChecklistOverflowMenu({
  pages: checklistPages, inputPlaceholder, onClose, onComplete,
}: {
  pages: ChecklistPage[]; inputPlaceholder?: string; onClose: () => void; onComplete: (selected: string[]) => void;
}) {
  const [page, setPage] = useState(0);
  const totalPages = checklistPages.length;
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState("");

  const toggleItem = (id: string) => {
    setSelected(prev => { const next = new Set(prev); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  };

  const handleSend = () => {
    const allItems = checklistPages.flatMap(p => p.items);
    const labels = allItems.filter(item => selected.has(item.id)).map(item => item.label);
    const typed = inputValue.trim();
    if (typed) labels.push(typed);
    onComplete(labels);
  };

  const currentPageData = checklistPages[page];

  return (
    <div className="flex flex-col gap-[4px] items-start pb-[10px] pt-[8px] px-[8px] relative rounded-[12px] w-full" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
      <div className="flex flex-col items-start w-full">
        <div className="flex flex-row items-center w-full">
          <div className="flex gap-[8px] items-center p-[8px] w-full">
            <p className="flex-1 leading-[20px] text-[15px] min-w-0 truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{currentPageData.question}</p>
            <div className="flex gap-[12px] items-center shrink-0">
              {totalPages > 1 && <OverflowPagination page={page + 1} total={totalPages} onPrev={() => setPage(p => Math.max(0, p - 1))} onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))} />}
              <OverflowCloseBtn onClose={onClose} />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={page} className="w-full flex flex-col" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            {currentPageData.items.map((item) => {
              const checked = selected.has(item.id);
              return (
                <div key={item.id} className="relative rounded-[6px] w-full h-[36px] flex items-center cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-element-subtle)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={() => toggleItem(item.id)}>
                  <div className="flex gap-[8px] items-center px-[8px] py-[6px] w-full">
                    <div className="relative rounded-[4px] shrink-0 size-[16px] flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: checked ? "var(--color-brand-primary)" : "transparent", border: checked ? "1px solid var(--color-brand-primary)" : "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
                      {checked && <svg width="10.7" height="7.75" viewBox="0 0 10.6633 7.74667" fill="none"><path d={CHECKMARK_PATH} stroke="var(--color-text-on-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /></svg>}
                    </div>
                    <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="rounded-[12px] flex items-center px-[12px] py-[8px] w-full" style={{ outline: "1px solid var(--color-element-subtle)", outlineOffset: "-1px" }}>
        <div className="flex flex-1 items-center gap-[6px] min-w-0">
          <div className="flex items-center justify-center rounded-[4px] shrink-0 size-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
            <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
          </div>
          <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }} placeholder={inputPlaceholder ?? "You make the call"} className="flex-1 bg-transparent outline-none border-none text-[14px] leading-[20px] min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }} />
        </div>
        <div className="flex items-center gap-[8px]">
          <Btn type="button" variant="outline" size="sm" onClick={() => onComplete([])}>Skip</Btn>
          <Btn type="button" variant="default" size="icon-sm" onClick={handleSend}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── TemplateOverflowMenu ───────────────────────────────────────────────────

export function TemplateOverflowMenu({
  header, cards, inputPlaceholder, onClose, onComplete,
}: {
  header: string; cards: TemplateCard[]; inputPlaceholder?: string; onClose: () => void; onComplete: (label: string) => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const CARDS_PER_PAGE = 2;
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const [page, setPage] = useState(1);
  const pageCards = cards.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  return (
    <div className="flex flex-col gap-[16px] pb-[12px] pt-[12px] relative rounded-[12px] w-full z-10" style={{ backgroundColor: "var(--color-bg-main)" }}>
      <div aria-hidden="true" className="absolute border-solid inset-0 pointer-events-none rounded-[12px]" style={{ border: "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }} />

      <div className="flex flex-col gap-[8px] px-[12px] w-full">
        <div className="flex items-center gap-[16px] p-[8px] w-full">
          <p className="flex-1 leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)", fontVariationSettings: "'opsz' 14" }}>{header}</p>
          <div className="flex gap-[12px] items-center shrink-0">
            {totalPages > 1 && <OverflowPagination page={page} total={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />}
            <OverflowCloseBtn onClose={onClose} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={page} className="grid grid-cols-2 gap-[12px] px-[8px] w-full" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            {pageCards.map((item) => (
              <div key={item.num} className="relative rounded-[16px] cursor-pointer overflow-hidden transition-colors"
                style={{ height: 224, border: "1px solid var(--color-element-subtle)", backgroundColor: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--color-element-subtle)"; e.currentTarget.style.borderColor = "var(--color-text-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "var(--color-element-subtle)"; }}
                onClick={() => onComplete(`${item.title}: "${item.front}" — ${item.insideHeading ?? ""} ${item.insideBody}`)}>
                <div className="p-[12px] h-full flex flex-col gap-[6px]" style={{ fontFamily: "var(--font-family-body)", fontWeight: 400, fontSize: 13, lineHeight: "18px", color: "var(--color-text-primary)" }}>
                  <p className="shrink-0" style={{ margin: 0 }}><span style={{ fontWeight: 600 }}>Front:</span>{` ${item.front}`}</p>
                  <p className="flex-1 overflow-hidden" style={{ margin: 0 }}><span style={{ fontWeight: 600 }}>Inside:</span>{` ${item.insideHeading ?? ""} ${item.insideBody}`}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-[8px] w-full">
        <div className="rounded-[12px] flex items-center px-[12px] py-[8px]" style={{ border: "1px solid var(--color-element-subtle)" }}>
          <div className="flex flex-1 items-center gap-[4px] min-w-0">
            <div className="shrink-0 size-[20px] flex items-center justify-center rounded-[4px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
              <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
            </div>
            <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") onComplete(customInput.trim() || "skip"); }} placeholder={inputPlaceholder ?? "Something else"} className="flex-1 bg-transparent outline-none border-none text-[14px] leading-[20px] min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }} />
          </div>
          <div className="flex items-center gap-[8px]">
            <Btn type="button" variant="outline" size="sm" onClick={() => onComplete("skip")}>Skip</Btn>
            <Btn type="button" variant="default" size="icon-sm" onClick={() => onComplete(customInput.trim() || "skip")}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── ActionOverflowMenu ─────────────────────────────────────────────────────

export function ActionOverflowMenu({
  config, inputPlaceholder, onClose, onGenerate,
}: {
  config: ActionMenuConfig; inputPlaceholder?: string; onClose: () => void; onGenerate: () => void;
}) {
  const [customInput, setCustomInput] = useState("");

  return (
    <div className="flex flex-col gap-[4px] items-start pb-[12px] pt-[12px] relative rounded-[12px] w-full" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
      <div className="flex items-center gap-[16px] px-[20px] py-[8px] w-full">
        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
          <p className="leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.title}</p>
          <p className="leading-[20px] text-[13px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{config.subtitle}</p>
        </div>
        <Btn onClick={onGenerate} className="shrink-0">{config.generateButtonLabel}</Btn>
        <OverflowCloseBtn onClose={onClose} />
      </div>
      <div className="w-full px-0"><div className="w-full h-[1px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} /></div>
      <div className="flex flex-col gap-[8px] px-[20px] py-[8px] w-full">
        <p className="leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Or Adjust</p>
        <div className="flex gap-[16px] items-center">
          {config.adjustOptions.map((label) => (
            <Btn key={label} variant="outline" size="sm" onClick={onClose}>{label}</Btn>
          ))}
        </div>
      </div>
      <div className="rounded-[12px] mx-[8px] flex items-center px-[12px] py-[8px] w-[calc(100%-16px)]" style={{ outline: "1px solid var(--color-element-subtle)", outlineOffset: "-1px" }}>
        <div className="flex flex-1 items-center gap-[6px] min-w-0">
          <div className="shrink-0 size-[20px] flex items-center justify-center rounded-[4px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
            <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
          </div>
          <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && customInput.trim()) onClose(); }} placeholder={inputPlaceholder ?? "Something else"} className="flex-1 bg-transparent outline-none border-none text-[14px] leading-[20px] min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }} />
        </div>
        <div className="flex items-center gap-[8px]">
          <Btn type="button" variant="outline" size="sm" onClick={onClose}>Skip</Btn>
          <Btn type="button" variant="default" size="icon-sm" onClick={() => { if (customInput.trim()) onClose(); }}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
          </Btn>
        </div>
      </div>
    </div>
  );
}

// ── TadaBanner ─────────────────────────────────────────────────────────────

const TADA_SCOPED_TOKENS = `
  --tb-font-family:          var(--font-family-body);
  --tb-font-size-13:         var(--font-size-label-15);
  --tb-font-size-12:         var(--font-size-body-13);
  --tb-font-weight-medium:   400;
  --tb-font-weight-bold:     var(--font-weight-label-sb-15);
  --tb-line-height-13:       1.4;
  --tb-line-height-12:       1.4;
  --tb-space-2:              var(--space-2);
  --tb-space-3:              var(--space-3);
  --tb-space-4:              var(--space-4);
  --tb-space-10:             var(--space-10);
  --tb-radius-2xl:           var(--radius-2xl);
  --tb-icon-size:            16px;
  --tb-color-bg:             var(--color-bg-main);
  --tb-color-fg:             var(--color-text-primary);
  --tb-color-muted:          var(--color-bg-editor);
  --tb-color-destructive:    var(--color-brand-primary);
  --tb-color-destructive-fg: var(--color-text-on-primary);
  --tb-color-brand-dim:      var(--color-brand-primary-dim);
`;

export function TadaBanner({
  loadingDuration = 10_000, loadingTitle = "Creating your card....", loadingMessage = "Initial generation might take a little longer, around 1-2 minutes. Thanks for your patience!",
  doneTitle = "Tada, Card generation is done!", doneMessage = "Your birthday card for Keith is ready! It's going to look wonderful in that Watercolor style.",
  partyPopperSrc,
}: {
  loadingDuration?: number; loadingTitle?: string; loadingMessage?: string; doneTitle?: string; doneMessage?: string; partyPopperSrc?: string;
}) {
  const [isDone, setIsDone] = useState(false);
  const scopeId = useId().replace(/:/g, "");

  useEffect(() => {
    const timer = setTimeout(() => setIsDone(true), loadingDuration);
    return () => clearTimeout(timer);
  }, [loadingDuration]);

  const scopeClass = `tada-banner-${scopeId}`;
  const headerContentStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "var(--tb-space-2)", padding: "var(--tb-space-2) var(--tb-space-4)" };
  const headerTextStyle: React.CSSProperties = { fontWeight: "var(--tb-font-weight-bold)" as unknown as number, fontSize: "var(--tb-font-size-13)", lineHeight: "var(--tb-line-height-13)", fontFamily: "var(--tb-font-family)" };
  const bodyDivStyle: React.CSSProperties = { position: "relative", padding: "var(--tb-space-3) var(--tb-space-4)", fontSize: "var(--tb-font-size-12)", fontWeight: "var(--tb-font-weight-medium)" as unknown as number, lineHeight: "var(--tb-line-height-12)", borderRadius: "var(--tb-radius-2xl) var(--tb-radius-2xl) 11px 11px", boxShadow: "var(--shadow-lg)", background: "var(--tb-color-bg)", color: "var(--tb-color-fg)", fontFamily: "var(--tb-font-family)", overflow: "hidden" };

  return (
    <>
      <style>{`.${scopeClass} { ${TADA_SCOPED_TOKENS} }`}</style>
      <motion.div className={scopeClass} style={{ width: "100%", maxWidth: 362, borderRadius: "var(--tb-radius-2xl)", border: "1px solid var(--tb-color-brand-dim)", overflow: "hidden", fontFamily: "var(--tb-font-family)" }} animate={isDone ? { scale: [1, 1.03, 1] } : { scale: 1 }} transition={isDone ? { duration: 0.5, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] } : {}}>
        <motion.div animate={{ backgroundColor: isDone ? "var(--tb-color-destructive)" : "var(--tb-color-muted)" }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
          <div style={headerContentStyle}>
            <div style={{ position: "relative", width: "var(--tb-icon-size)", height: "var(--tb-icon-size)", flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                {!isDone ? (
                  <motion.div key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0, rotate: 90 }} transition={{ duration: 0.25 }} style={{ position: "absolute", inset: 0 }}>
                    <motion.svg width="var(--tb-icon-size)" height="var(--tb-icon-size)" viewBox="0 0 16 16" fill="none" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="6" stroke="var(--tb-color-fg)" strokeWidth="2" strokeLinecap="round" strokeDasharray="30 10" />
                    </motion.svg>
                  </motion.div>
                ) : (
                  <motion.div key="check" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCheck size={16} color="var(--tb-color-destructive-fg)" strokeWidth={1.6} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                {!isDone ? (
                  <motion.span key="loading-title" initial={{ opacity: 0, x: -10, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 10, filter: "blur(4px)" }} transition={{ duration: 0.3 }} style={{ ...headerTextStyle, display: "block", color: "var(--tb-color-fg)" }}>{loadingTitle}</motion.span>
                ) : (
                  <motion.span key="done-title" initial={{ opacity: 0, x: -12, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 12, filter: "blur(4px)" }} transition={{ duration: 0.35, delay: 0.1 }} style={{ ...headerTextStyle, display: "block", color: "var(--tb-color-destructive-fg)" }}>{doneTitle}</motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={bodyDivStyle}>
            <AnimatePresence mode="wait">
              {!isDone ? (
                <motion.span key="loading-body" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ display: "block" }}>{loadingMessage}</motion.span>
              ) : (
                <motion.span key="done-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} style={{ display: "block", paddingRight: "var(--tb-space-10)" }}>{doneMessage}</motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isDone && (
                <div style={{ position: "absolute", right: "var(--tb-space-2)", top: "50%", transform: "translateY(-50%)", width: "var(--tb-space-10)", height: "var(--tb-space-10)" }}>
                  <motion.img src={partyPopperSrc} alt="" width={40} height={40} initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 350, damping: 14, delay: 0.35 }} aria-hidden />
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── ChatHomeInput ──────────────────────────────────────────────────────────

export interface ChatHomeInputProps {
  /** Input placeholder text */
  placeholder?: string;
  /** Called when the user submits a message */
  onSend?: (value: string) => void;
}

export function ChatHomeInput({
  placeholder = "Ask, search or create your card",
  onSend,
}: ChatHomeInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="flex flex-col gap-[24px] pb-[8px] pt-[12px] px-[8px] rounded-[12px] shrink-0 w-full relative transition-colors duration-200" style={{ backgroundColor: "var(--color-bg-main)", border: "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
      <div className="flex items-center px-[6px] relative shrink-0 w-full min-h-[32px]">
        <textarea
          className="flex-1 w-full resize-none bg-transparent outline-none text-[15px] leading-[20px]"
          style={{ ...dmSans400, color: "var(--color-text-primary)", caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden" }}
          value={inputValue}
          onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
          rows={1}
          placeholder={placeholder}
        />
      </div>
      <div className="flex items-end justify-between relative shrink-0 w-full">
        <div className="flex gap-[8px] items-end relative shrink-0">
          <button className="transition-colors flex gap-[6px] h-[32px] items-center px-[8px] py-[6px] relative rounded-[100px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
            <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
            <p className="font-medium leading-[18px] text-[12px] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
          </button>
        </div>
        <div className="flex gap-[4px] items-center relative shrink-0">
          <button
            className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${isRecording ? "bg-red-100 text-red-500" : ""}`}
            style={!isRecording ? { color: "var(--color-text-primary)" } : undefined}
            onMouseEnter={!isRecording ? e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)") : undefined}
            onMouseLeave={!isRecording ? e => (e.currentTarget.style.backgroundColor = "") : undefined}
            onClick={() => setIsRecording(r => !r)}>
            <Mic size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            disabled={!inputValue.trim() && !isRecording}
            className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!inputValue.trim() ? "cursor-not-allowed" : ""}`}
            style={inputValue.trim() ? { backgroundColor: "var(--color-brand-primary)", color: "white" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}
            onClick={() => { if (inputValue.trim()) { onSend?.(inputValue); setInputValue(""); } }}>
            <ArrowUp size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChatConversationInput ───────────────────────────────────────────────────

export interface ChatConversationInputProps {
  /** AI sparkle icon URL */
  aiIconSrc: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Called when the user submits a message */
  onSend?: (value: string) => void;
}

export function ChatConversationInput({
  aiIconSrc,
  placeholder = "Ask, search or create your card",
  onSend,
}: ChatConversationInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="w-full" style={{ backgroundColor: "var(--color-bg-main)" }}>
      {/* AI icon + textarea */}
      <div className="flex gap-[10px] items-center px-[16px] w-full shrink-0 mt-[8px] mb-[8px]">
        <motion.img
          alt=""
          className="pointer-events-none object-cover shrink-0"
          src={aiIconSrc}
          animate={{ scale: [13 / 16, 1, 13 / 16], opacity: isFocused || !!inputValue ? 1 : 0.5 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ width: 16, height: 16 }}
        />
        <textarea
          className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[20px] min-w-0"
          style={{ ...dmSans400, caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden", color: isFocused || inputValue ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}
          value={inputValue}
          placeholder={placeholder}
          onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          rows={1}
        />
      </div>

      {/* Divider */}
      <div className="relative w-full h-px shrink-0">
        <div className="absolute inset-0">
          <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 640 1">
            <line stroke="var(--color-element-subtle)" x2="640" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-[8px] items-end px-[16px] py-[12px] pb-[16px] w-full">
        <div className="flex flex-[1_0_0] gap-[8px] items-end min-w-px">
          <button className="transition-colors flex gap-[6px] h-[32px] items-center px-[8px] py-[6px] relative rounded-[100px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
            <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
            <p className="font-medium leading-[18px] text-[12px] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
          </button>
        </div>
        <div className="flex gap-[4px] items-center relative shrink-0">
          <button
            className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${isRecording ? "bg-red-100 text-red-500" : ""}`}
            style={!isRecording ? { color: "var(--color-text-primary)" } : undefined}
            onMouseEnter={!isRecording ? e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)") : undefined}
            onMouseLeave={!isRecording ? e => (e.currentTarget.style.backgroundColor = "") : undefined}
            onClick={() => setIsRecording(r => !r)}>
            <Mic size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!inputValue.trim() ? "cursor-not-allowed" : ""}`}
            style={inputValue.trim() ? { backgroundColor: "var(--color-brand-primary)", color: "white" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}
            onClick={() => { if (inputValue.trim()) { onSend?.(inputValue); setInputValue(""); } }}>
            <ArrowUp size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChatHomeScreen ─────────────────────────────────────────────────────────

export interface ChatHomeScreenProps {
  /** Mascot image URL displayed to the left of the greeting */
  mascotSrc: string;
  /** Prompts cycled by the typewriter animation */
  examplePrompts?: string[];
}

export function ChatHomeScreen({
  mascotSrc,
  examplePrompts = [
    "I'm making a card for my girlfriend that will make her laugh",
    "I need a heartfelt thank you card for my best friend",
    "Help me write a funny retirement card for my dad",
    "Something silly and warm for my mom's 60th birthday",
  ],
}: ChatHomeScreenProps) {
  const { displayText, isTyping } = useTypewriter(examplePrompts);

  return (
    <div className="flex flex-col justify-between w-full" style={{ backgroundColor: "var(--color-bg-main)", padding: "16px", gap: 16, position: "relative", overflow: "visible" }}>
      {/* Mascot */}
      <div className="pointer-events-none select-none" style={{ position: "absolute", top: -8, left: -80, width: 150, height: 135, zIndex: 20 }}>
        <img alt="Stampy mascot" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={mascotSrc} />
      </div>

      {/* Greeting + typewriter */}
      <div className="flex flex-col gap-[8px] items-start w-full relative pl-[40px]">
        <p className="font-normal leading-[28px] relative text-[18px] w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>Hi there! I'm Stampy</p>
        <div className="relative w-full" style={{ minHeight: 20 }}>
          <div className="pointer-events-none select-none">
            <span className="text-[15px] leading-[20px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
              Try: {displayText}
              <motion.span
                className="inline-block w-[1.5px] h-[13px] ml-[1px] align-middle"
                style={{ backgroundColor: "var(--color-text-secondary)" }}
                animate={{ opacity: isTyping ? [1, 1, 0, 0] : [1, 0] }}
                transition={isTyping ? { repeat: Infinity, duration: 0.8, times: [0, 0.45, 0.5, 1] } : { repeat: Infinity, duration: 0.6 }}
              />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── OccasionSuggestions ────────────────────────────────────────────────────

export interface OccasionSuggestionsProps {
  /** Suggestions to display. Defaults to 4 random occasions. */
  suggestions?: string[];
  /** Called when a suggestion item is clicked */
  onSelect?: (item: string) => void;
  /** Called when the close (×) button is clicked */
  onClose?: () => void;
}

export function OccasionSuggestions({
  suggestions = getRandomSuggestions(4),
  onSelect,
  onClose,
}: OccasionSuggestionsProps) {
  return (
    <div className="rounded-[12px] p-[8px] w-full flex flex-col items-start" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
      <div className="flex gap-[16px] items-start justify-end p-[8px] relative shrink-0 w-full">
        <p className="flex-1 leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>What's the occasion?</p>
        <button onClick={onClose} className="shrink-0 transition-colors" style={{ color: "var(--color-text-secondary)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")} aria-label="Close suggestions">
          <X size={16} strokeWidth={1.5} absoluteStrokeWidth />
        </button>
      </div>
      <div className="flex flex-col items-start w-full">
        {suggestions.map((item, i) => (
          <button key={item} onClick={() => onSelect?.(item)} className="flex gap-[8px] items-center pl-[8px] pr-[8px] py-[6px] rounded-[6px] w-full transition-colors text-left" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            <div className="flex flex-col items-center justify-center rounded-[4px] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
              <p className="leading-[20px] text-[14px] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{i + 1}</p>
            </div>
            <p className="flex-1 leading-[20px] text-[14px]" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

// ── ChatHeader ─────────────────────────────────────────────────────────────

export interface ChatHeaderProps {
  /** Active conversation name shown in the dropdown pill */
  conversationName?: string;
  /** List of conversations in the dropdown */
  conversations?: { id: string; name: string }[];
  /** Whether the expanded (PiP) state is active */
  expanded?: boolean;
  /** Open the conversation dropdown by default (useful for doc previews) */
  defaultDropdownOpen?: boolean;
  /** Called when the expand button is clicked */
  onToggleExpand?: () => void;
  /** Called when the minimize (–) button is clicked */
  onMinimize?: () => void;
  /** Called when a conversation is selected */
  onSelectConversation?: (id: string) => void;
  /** Called when "New Conversation" is clicked */
  onNewConversation?: () => void;
  /** Called when a conversation is renamed; receives the id and the new name */
  onRename?: (id: string, newName: string) => void;
}

export function ChatHeader({
  conversationName = "Jack's Birthday Bi...",
  conversations = [
    { id: "1", name: "Jack's Birthday Bi..." },
    { id: "2", name: "Lupe's Luau" },
    { id: "3", name: "Mom's Anniversary" },
  ],
  expanded = false,
  defaultDropdownOpen = false,
  onToggleExpand,
  onMinimize,
  onSelectConversation,
  onNewConversation,
  onRename,
}: ChatHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(defaultDropdownOpen);
  const [localConversations, setLocalConversations] = useState(conversations);
  const [editingConvoId, setEditingConvoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalConversations(conversations); }, [conversations]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function commitRename(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) { setEditingConvoId(null); return; }
    setLocalConversations(prev => prev.map(c => c.id === id ? { ...c, name: trimmed } : c));
    onRename?.(id, trimmed);
    setEditingConvoId(null);
  }

  return (
    <div className="border-b border-solid flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full z-30 rounded-t-[20px]" style={{ borderColor: "var(--color-element-subtle)", backgroundColor: "var(--color-bg-main)" }}>
      {/* Left: Stampy label + conversation dropdown */}
      <div className="flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[15px] whitespace-nowrap" style={{ ...dmSans500, fontWeight: 600, color: "var(--color-text-primary)" }}>
          <p className="leading-[normal]">Stampy</p>
        </div>
        <div ref={ref} className="relative min-w-0">
          <button
            className="flex items-center gap-[8px] px-[12px] h-[32px] rounded-[30px] cursor-pointer transition-colors max-w-[180px]"
            style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-pressed)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}
            onClick={() => setDropdownOpen(p => !p)}
          >
            <span className="text-[15px] leading-[20px] truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{conversationName}</span>
            <ChevronDown size={10} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute top-[calc(100%+4px)] left-0 rounded-[12px] py-[4px] min-w-[220px] z-50"
                style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-element-subtle)" }}
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <button className="flex items-center gap-[8px] w-[calc(100%-24px)] mx-[4px] px-[12px] h-[32px] text-left cursor-pointer transition-colors rounded-[6px]" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={() => { setDropdownOpen(false); onNewConversation?.(); }}>
                  <Plus size={14} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
                  <span className="text-[15px] leading-[20px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>New Conversation</span>
                </button>
                <div className="mx-[4px] my-[4px] h-px" style={{ backgroundColor: "var(--color-element-subtle)" }} />
                <div className="max-h-[240px] overflow-y-auto">
                  {localConversations.map(c => {
                    const isActive = c.name === conversationName;
                    return (
                      <div key={c.id} className="group flex items-center justify-between px-[12px] mx-[4px] h-[32px] cursor-pointer transition-colors rounded-[6px]" style={{ backgroundColor: isActive ? "var(--color-brand-secondary-dim)" : "transparent" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--color-state-hover)"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? "var(--color-brand-secondary-dim)" : "transparent"; }} onClick={() => { if (editingConvoId !== c.id) { setDropdownOpen(false); onSelectConversation?.(c.id); } }}>
                        {editingConvoId === c.id ? (
                          <input
                            className="flex-1 text-[15px] leading-[20px] bg-transparent outline-none min-w-0"
                            style={{ ...dmSans400, color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-text-primary)" }}
                            value={editingName}
                            autoFocus
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") commitRename(c.id, editingName); if (e.key === "Escape") setEditingConvoId(null); }}
                            onBlur={() => commitRename(c.id, editingName)}
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <span className="text-[15px] leading-[20px] truncate" style={{ ...(isActive ? dmSans500 : dmSans400), color: "var(--color-text-primary)" }}>{c.name}</span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-[8px] p-[2px] rounded cursor-pointer" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={e => { e.stopPropagation(); setEditingConvoId(c.id); setEditingName(c.name); }} aria-label={`Rename ${c.name}`}>
                              <PencilLine size={14} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: expand + minimize */}
      <div className="flex gap-[8px] items-center relative shrink-0">
        <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={onToggleExpand}>
          {expanded ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 4C20.6569 4 22 5.34315 22 7V17C22 18.6051 20.7394 19.9158 19.1543 19.9961L19 20H5L4.8457 19.9961C3.26055 19.9158 2 18.6051 2 17V7C2 5.34315 3.34315 4 5 4H19ZM5 5.5C4.17157 5.5 3.5 6.17157 3.5 7V17C3.5 17.8284 4.17157 18.5 5 18.5H19C19.8284 18.5 20.5 17.8284 20.5 17V7C20.5 6.17157 19.8284 5.5 19 5.5H5ZM18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H14C13.4477 17 13 16.5523 13 16V8C13 7.44772 13.4477 7 14 7H18Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15.4883 3.33691C17.073 3.41753 18.3338 4.72826 18.334 6.33301V13.666L18.3301 13.8203C18.2525 15.3543 17.0221 16.5841 15.4883 16.6621L15.334 16.666H4.66699C3.01014 16.666 1.66699 15.3229 1.66699 13.666V6.33301C1.66717 4.6763 3.01025 3.33301 4.66699 3.33301H15.334L15.4883 3.33691ZM4.66699 4.83301C3.83867 4.83301 3.16717 5.50473 3.16699 6.33301V13.666C3.16699 14.4944 3.83857 15.166 4.66699 15.166H15.334C16.1621 15.1657 16.834 14.4942 16.834 13.666V6.33301C16.8338 5.50495 16.162 4.83336 15.334 4.83301H4.66699ZM14.833 9.16699C15.3853 9.16699 15.833 9.61471 15.833 10.167V13.167C15.8328 13.7191 15.3852 14.167 14.833 14.167H11.833C11.281 14.1668 10.8332 13.719 10.833 13.167V10.167C10.833 9.61482 11.2809 9.16717 11.833 9.16699H14.833Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
          )}
        </div>
        <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={onMinimize}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16669 10H15.8334" className="stroke-[var(--color-text-secondary)] group-hover:stroke-[var(--color-text-primary)] transition-colors" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}

// ── BottomBar ──────────────────────────────────────────────────────────────

function BottomBar({
  isActive, isRecording, onToggleMic, onSend,
}: {
  isActive: boolean; isRecording: boolean; onToggleMic: () => void; onSend: () => void;
}) {
  return (
    <div className="relative w-full shrink-0">
      <div className="flex flex-row items-end w-full">
        <div className="flex gap-[8px] items-end px-[16px] py-[12px] pb-[16px] w-full">
          <div className="flex flex-[1_0_0] gap-[8px] items-end min-w-px">
            <motion.button className="flex gap-[6px] h-[32px] items-center px-[8px] py-[6px] rounded-[100px] shrink-0 cursor-pointer" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} whileHover={{ backgroundColor: "var(--color-element-subtle)" }} whileTap={{ scale: 0.93 }} transition={{ duration: 0.15 }}>
              <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}>
                <ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth />
              </div>
              <span className="text-[12px] leading-[18px] whitespace-nowrap hidden xs:inline sm:inline" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</span>
            </motion.button>
          </div>
          <div className="flex gap-[4px] items-center shrink-0">
            <motion.button className="flex items-center justify-center p-[10px] rounded-[20px] shrink-0 size-[32px] cursor-pointer transition-colors" animate={{ backgroundColor: isRecording ? "rgba(239, 68, 68, 0.1)" : "rgba(0,0,0,0)" }} whileHover={!isRecording ? { backgroundColor: "var(--color-state-hover)" } : undefined} transition={isRecording ? { repeat: Infinity, duration: 1.5 } : { duration: 0.15 }} onClick={onToggleMic}>
              <Mic size={18} strokeWidth={1.5} color={isRecording ? "#ef4444" : "var(--color-text-primary)"} />
            </motion.button>
            <motion.button className={`flex items-center justify-center p-[10px] rounded-[20px] shrink-0 size-[32px] cursor-pointer transition-colors`} style={isActive ? { backgroundColor: "var(--color-brand-primary)" } : { backgroundColor: "var(--color-brand-secondary-dim)" }} whileHover={isActive ? { backgroundColor: "var(--color-state-pressed)" } : undefined} onClick={onSend}>
              <ArrowUp size={18} strokeWidth={1.5} color={isActive ? "white" : "var(--color-text-secondary)"} />
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: StampyChatbot
// ═══════════════════════════════════════════════════════════════════════════

export interface StampyChatbotProps {
  /** The conversation script driving the chat flow */
  chatScript: ChatScript;
  /** Mascot image URL */
  mascotSrc: string;
  /** AI sparkle icon URL */
  aiIconSrc: string;
  /** Home background pattern URL */
  backgroundSrc: string;
  /** FAB icon URL */
  stampyIconSrc: string;
  /** Party popper GIF URL (used in TadaBanner) */
  partyPopperSrc: string;
  /** CSS class on the root container */
  className?: string;
}

export function StampyChatbot({
  chatScript,
  mascotSrc,
  aiIconSrc,
  backgroundSrc,
  stampyIconSrc,
  partyPopperSrc,
  className = "",
}: StampyChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>(() => getRandomSuggestions(4));
  const { displayText, isTyping } = useTypewriter(chatScript.examplePrompts);
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) { setActiveSuggestions(getRandomSuggestions(4)); setShowSuggestions(true); }
  }, [isOpen]);
  const [isFocused, setIsFocused] = useState(false);

  // Conversation management
  const [conversations, setConversations] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Jack's Birthday Birthda..." },
    { id: "2", name: "Lupe's Luau" },
    { id: "3", name: "Tamara's Thanksgiving" },
    { id: "4", name: "Omar's Octoberfest" },
    { id: "5", name: "Yuri's Yuletide Card" },
    { id: "6", name: "Quin's Quinceañera" },
    { id: "7", name: "Ida's Inauguration Invite" },
    { id: "8", name: "Noelle's New Years" },
  ]);
  const [activeConversationId, setActiveConversationId] = useState("1");
  const [isConvoDropdownOpen, setIsConvoDropdownOpen] = useState(false);
  const [editingConvoId, setEditingConvoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const convoDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isConvoDropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (convoDropdownRef.current && !convoDropdownRef.current.contains(e.target as Node)) {
        setIsConvoDropdownOpen(false); setEditingConvoId(null);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isConvoDropdownOpen]);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Step-based state machine
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingText, setTypingText] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [lastChoice, setLastChoice] = useState("");
  const [themeChoice, setThemeChoice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatsScrollRef = useRef<HTMLDivElement>(null);

  const { displayed: typedText, isDone: typingDone } = useBubbleTypewriter(typingText);
  const committedRef = useRef(false);
  useEffect(() => { committedRef.current = false; }, [typingText]);

  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isWorking = sentMessage !== null;

  const handleNewConversation = () => {
    const newId = String(Date.now());
    setConversations(prev => [{ id: newId, name: "New Conversation" }, ...prev]);
    setActiveConversationId(newId); setIsConvoDropdownOpen(false);
    setSentMessage(null); setStepIndex(-1); setMessages([]); setTypingText(null); setShowMenu(false); setShowBanner(false); setLastChoice(""); setThemeChoice(null);
  };

  const handleRenameConversation = (id: string, newName: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
    setEditingConvoId(null);
  };

  // Step controller
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= chatScript.steps.length) return;
    const step = chatScript.steps[stepIndex];
    if (step.type === "stampy" || step.type === "final-card") {
      const msg = step.message.replace(/\{\{prev\}\}/g, lastChoice);
      const delay = step.delay ?? 2500;
      const timer = setTimeout(() => setTypingText(msg), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "overflow" || step.type === "checklist" || step.type === "template" || step.type === "action") {
      const delay = step.delay ?? 2500;
      const timer = setTimeout(() => setShowMenu(true), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "style-carousel") {
      const delay = step.delay ?? 500;
      const timer = setTimeout(() => setShowMenu(true), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "banner") { setShowBanner(true); }
  }, [stepIndex, lastChoice]);

  // Typewriter completion
  useEffect(() => {
    if (!typingDone || !typingText || committedRef.current) return;
    const step = chatScript.steps[stepIndex];
    if (!step || (step.type !== "stampy" && step.type !== "final-card")) return;
    committedRef.current = true;
    let buttons: string[] | undefined;
    if (step.type === "stampy") buttons = step.buttons;
    else if (step.type === "final-card") buttons = [step.button];
    const resolvedText = step.message.replace(/\{\{prev\}\}/g, lastChoice);
    const nextStep = stepIndex + 1 < chatScript.steps.length ? chatScript.steps[stepIndex + 1] : null;
    const showCarousel = nextStep?.type === "style-carousel" ? true : undefined;
    setMessages(prev => [...prev, { role: "stampy", text: resolvedText, buttons, showCarousel }]);
    setTypingText(null);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }, [typingDone]);

  function handleMenuComplete(choice: string) {
    setShowMenu(false); setLastChoice(choice); setMessages(prev => [...prev, { role: "user", text: choice }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleMenuSkip() {
    setShowMenu(false);
    const step = chatScript.steps[stepIndex];
    if (step.type === "checklist" && step.skipMessage) setMessages(prev => [...prev, { role: "user", text: "Skip" }, { role: "stampy", text: step.skipMessage! }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleStyleSelect(style: string) {
    setThemeChoice(style); setShowMenu(false); setLastChoice(style); setMessages(prev => [...prev, { role: "user", text: style }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleTriggerButton() {
    if (stepIndex >= 0 && stepIndex < chatScript.steps.length) {
      const nextStep = chatScript.steps[stepIndex];
      if (nextStep.type === "overflow" || nextStep.type === "checklist" || nextStep.type === "template" || nextStep.type === "action" || nextStep.type === "style-carousel") setShowMenu(true);
    }
  }

  function handleActionGenerate() {
    setShowMenu(false); setMessages(prev => [...prev, { role: "user", text: "Generate" }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  // Auto-scroll
  useEffect(() => {
    const container = chatsScrollRef.current;
    if (!container) return;
    const scrollToBottom = () => { container.scrollTop = container.scrollHeight; };
    scrollToBottom();
    const scrollInterval = setInterval(scrollToBottom, 16);
    const stopScrollTimer = setTimeout(() => clearInterval(scrollInterval), 1200);
    let isAutoScrolling = true;
    const handleScroll = () => { const { scrollTop, scrollHeight, clientHeight } = container; isAutoScrolling = scrollHeight - scrollTop - clientHeight < 50; };
    container.addEventListener("scroll", handleScroll);
    const ro = new ResizeObserver(() => { if (isAutoScrolling) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; }); });
    ro.observe(container);
    const mo = new MutationObserver((mutations) => { mutations.forEach(m => m.addedNodes.forEach(node => { if (node instanceof Element) ro.observe(node); })); if (isAutoScrolling) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; }); });
    mo.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    return () => { clearInterval(scrollInterval); clearTimeout(stopScrollTimer); container.removeEventListener("scroll", handleScroll); ro.disconnect(); mo.disconnect(); };
  }, [sentMessage, messages, typingText, showMenu, showBanner, stepIndex]);

  function processMessage(msg: string) {
    if (!msg) return;
    if (!sentMessage) { setSentMessage(msg); setMessages([{ role: "user", text: msg }]); setStepIndex(0); setInputValue(""); setIsFocused(false); return; }
    setMessages(prev => [...prev, { role: "user", text: msg }]); setInputValue(""); setIsFocused(false);
  }

  function handleSend() { processMessage(inputValue.trim()); }

  // Speech recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-US";
      let finalTranscript = "";
      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript + " ";
          else interimTranscript += transcript;
        }
        const currentInput = finalTranscript + interimTranscript;
        if (currentInput) setInputValue(currentInput.trim());
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => { setIsRecording(false); finalTranscript = ""; };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
    else { try { recognitionRef.current.start(); setIsRecording(true); } catch {} }
  };

  const currentStep = stepIndex >= 0 && stepIndex < chatScript.steps.length ? chatScript.steps[stepIndex] : null;
  const showWorkingSpinner = stepIndex >= 0 && !typingText && !showMenu && !showBanner && currentStep !== null && (currentStep.type === "stampy" || currentStep.type === "final-card");

  // ── RENDER ─────────────────────────────────────────────────────────────

  return (
    <div className={`relative flex items-end justify-end pt-[24px] pb-[24px] pr-[24px] ${className}`} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundColor: "var(--color-brand-secondary)" }} />
        <div className="absolute inset-0 mix-blend-luminosity opacity-15" style={{ backgroundImage: `url('${backgroundSrc}')`, backgroundSize: "1438px 1079px", backgroundPosition: "top left" }} />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div key="closed" className="cursor-pointer relative z-50 flex items-center justify-center rounded-full" style={{ width: 72, height: 72, boxShadow: "var(--shadow-lg)" }} initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }} transition={entranceSpring} onClick={() => setIsOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img alt="Stampy mascot" className="w-full h-full object-contain pointer-events-none" src={stampyIconSrc} />
          </motion.div>
        ) : (
          <motion.div key="opened" className="relative flex flex-col items-end gap-[8px] w-full sm:w-[540px] px-3 sm:px-0 h-full" style={{ flexShrink: 0 }} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            <div className="flex items-end justify-end w-full relative flex-1">
              <motion.div className="flex flex-col items-start w-full sm:w-[450px] overflow-hidden" style={{ backgroundColor: "var(--color-bg-main)", marginRight: isMobile ? 0 : -5, borderRadius: 20, boxShadow: "var(--shadow-xs)" }} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, scale: 1, y: 0, height: isExpanded ? window.innerHeight - 48 : isMobile ? Math.max(420, window.innerHeight - 80) : 550 }} transition={{ opacity: { duration: 0.3, ease: "easeOut" }, y: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}>

                {/* HEADER */}
                <div className="border-b border-solid flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full z-30 rounded-t-[20px]" style={{ borderColor: "var(--color-element-subtle)", backgroundColor: "var(--color-bg-main)" }}>
                  <div className="flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
                    <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[15px] whitespace-nowrap" style={{ ...dmSans500, fontWeight: 600, color: "var(--color-text-primary)", fontVariationSettings: "'opsz' 14" }}>
                      <p className="leading-[normal]">Stampy</p>
                    </div>
                    <div ref={convoDropdownRef} className="relative min-w-0">
                      <button className="flex items-center gap-[8px] px-[12px] h-[32px] rounded-[30px] cursor-pointer transition-colors max-w-[180px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-pressed)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")} onClick={() => setIsConvoDropdownOpen(p => !p)}>
                        <span className="text-[15px] leading-[20px] truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{activeConversation?.name ?? "New Conversation"}</span>
                        <ChevronDown size={10} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
                      </button>
                      <AnimatePresence>
                        {isConvoDropdownOpen && (
                          <motion.div className="absolute top-[calc(100%+4px)] left-0 rounded-[12px] py-[4px] min-w-[220px] z-50" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-element-subtle)" }} initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.15 }}>
                            <button className="flex items-center gap-[8px] w-[calc(100%-24px)] mx-[4px] px-[12px] h-[32px] text-left cursor-pointer transition-colors rounded-[6px]" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={handleNewConversation}>
                              <Plus size={14} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
                              <span className="text-[15px] leading-[20px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>New Conversation</span>
                            </button>
                            <div className="mx-[4px] my-[4px] h-px" style={{ backgroundColor: "var(--color-element-subtle)" }} />
                            <div className="max-h-[240px] overflow-y-auto">
                              {conversations.map(convo => (
                                <div key={convo.id} className="group flex items-center justify-between px-[12px] mx-[4px] h-[32px] cursor-pointer transition-colors rounded-[6px]" style={{ backgroundColor: convo.id === activeConversationId ? "var(--color-brand-secondary-dim)" : "transparent" }} onMouseEnter={e => { if (convo.id !== activeConversationId) e.currentTarget.style.backgroundColor = "var(--color-state-hover)"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = convo.id === activeConversationId ? "var(--color-brand-secondary-dim)" : "transparent"; }} onClick={() => { if (editingConvoId !== convo.id) { setActiveConversationId(convo.id); setIsConvoDropdownOpen(false); } }}>
                                  {editingConvoId === convo.id ? (
                                    <input className="flex-1 text-[15px] leading-[20px] bg-transparent outline-none min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-text-primary)" }} value={editingName} autoFocus onChange={e => setEditingName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") handleRenameConversation(convo.id, editingName); if (e.key === "Escape") setEditingConvoId(null); }} onBlur={() => handleRenameConversation(convo.id, editingName)} onClick={e => e.stopPropagation()} />
                                  ) : (
                                    <>
                                      <span className="text-[15px] leading-[20px] truncate" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{convo.name}</span>
                                      <button className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-[8px] p-[2px] rounded cursor-pointer" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={e => { e.stopPropagation(); setEditingConvoId(convo.id); setEditingName(convo.name); }}>
                                        <PencilLine size={14} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
                                      </button>
                                    </>
                                  )}
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                  <div className="flex gap-[8px] items-center relative shrink-0">
                    <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={() => setIsExpanded(p => !p)}>
                      {isExpanded ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 4C20.6569 4 22 5.34315 22 7V17C22 18.6051 20.7394 19.9158 19.1543 19.9961L19 20H5L4.8457 19.9961C3.26055 19.9158 2 18.6051 2 17V7C2 5.34315 3.34315 4 5 4H19ZM5 5.5C4.17157 5.5 3.5 6.17157 3.5 7V17C3.5 17.8284 4.17157 18.5 5 18.5H19C19.8284 18.5 20.5 17.8284 20.5 17V7C20.5 6.17157 19.8284 5.5 19 5.5H5ZM18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H14C13.4477 17 13 16.5523 13 16V8C13 7.44772 13.4477 7 14 7H18Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15.4883 3.33691C17.073 3.41753 18.3338 4.72826 18.334 6.33301V13.666L18.3301 13.8203C18.2525 15.3543 17.0221 16.5841 15.4883 16.6621L15.334 16.666H4.66699C3.01014 16.666 1.66699 15.3229 1.66699 13.666V6.33301C1.66717 4.6763 3.01025 3.33301 4.66699 3.33301H15.334L15.4883 3.33691ZM4.66699 4.83301C3.83867 4.83301 3.16717 5.50473 3.16699 6.33301V13.666C3.16699 14.4944 3.83857 15.166 4.66699 15.166H15.334C16.1621 15.1657 16.834 14.4942 16.834 13.666V6.33301C16.8338 5.50495 16.162 4.83336 15.334 4.83301H4.66699ZM14.833 9.16699C15.3853 9.16699 15.833 9.61471 15.833 10.167V13.167C15.8328 13.7191 15.3852 14.167 14.833 14.167H11.833C11.281 14.1668 10.8332 13.719 10.833 13.167V10.167C10.833 9.61482 11.2809 9.16717 11.833 9.16699H14.833Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
                      )}
                    </div>
                    <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={() => { setIsExpanded(false); setIsOpen(false); }}>
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16669 10H15.8334" className="stroke-[var(--color-text-secondary)] group-hover:stroke-[var(--color-text-primary)] transition-colors" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                    </div>
                  </div>
                </div>

                {/* CONTENT */}
                <div className={`flex-1 w-full relative ${isWorking ? "overflow-hidden" : "overflow-visible"} flex flex-col rounded-b-[20px] min-h-0`} style={{ backgroundColor: "var(--color-bg-main)" }}>
                  {!isMobile && (
                    <AnimatePresence>
                      {!isWorking && (
                        <motion.div className="absolute top-[-8px] z-20 pointer-events-none" style={{ width: 150, height: 135, left: -80 }} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ ...entranceSpring, delay: 0.15 }}>
                          <img alt="Stampy mascot" className="w-full h-full object-contain" src={mascotSrc} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}

                  <AnimatePresence mode="wait" initial={false}>
                    {!isWorking ? (
                      /* HOME STATE */
                      <motion.div key="default" className="flex flex-col justify-between w-full flex-1 min-h-0 p-[16px] z-10 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        <div className="flex flex-col gap-[8px] items-start w-full relative pl-[40px]">
                          <p className="font-normal leading-[28px] relative text-[18px] w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>Hi there! I'm Stampy</p>
                          <div className="relative w-full" style={{ minHeight: 20 }}>
                            <motion.div key="placeholder" className="pointer-events-none select-none">
                              <span className="text-[15px] leading-[20px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
                                Try: {displayText}
                                <motion.span className="inline-block w-[1.5px] h-[13px] ml-[1px] align-middle" style={{ backgroundColor: "var(--color-text-secondary)" }} animate={{ opacity: isTyping ? [1, 1, 0, 0] : [1, 0] }} transition={isTyping ? { repeat: Infinity, duration: 0.8, times: [0, 0.45, 0.5, 1] } : { repeat: Infinity, duration: 0.6 }} />
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-[16px] w-full">
                          <AnimatePresence>
                            {showSuggestions && (
                              <motion.div key="suggestions" className="rounded-[12px] p-[8px] w-full flex flex-col items-start" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
                                <div className="flex gap-[16px] items-start justify-end p-[8px] relative shrink-0 w-full">
                                  <p className="flex-1 leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>What's the occasion?</p>
                                  <button onClick={() => setShowSuggestions(false)} className="shrink-0 transition-colors" style={{ color: "var(--color-text-secondary)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")} aria-label="Close suggestions"><X size={16} strokeWidth={1.5} absoluteStrokeWidth /></button>
                                </div>
                                <div className="flex flex-col items-start w-full">
                                  {activeSuggestions.map((item, i) => (
                                    <button key={item} onClick={() => { setShowSuggestions(false); processMessage(item); }} className="flex gap-[8px] items-center pl-[8px] pr-[8px] py-[6px] rounded-[6px] w-full transition-colors text-left" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
                                      <div className="flex flex-col items-center justify-center rounded-[4px] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
                                        <p className="leading-[20px] text-[14px] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{i + 1}</p>
                                      </div>
                                      <p className="flex-1 leading-[20px] text-[14px]" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item}</p>
                                    </button>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Home input box */}
                          <div className="flex flex-col gap-[24px] pb-[8px] pt-[12px] px-[8px] rounded-[12px] shrink-0 w-full relative transition-colors duration-200" style={{ backgroundColor: "var(--color-bg-main)", border: "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
                            <div className="flex items-center px-[6px] relative shrink-0 w-full min-h-[32px]">
                              <textarea className="flex-1 w-full resize-none bg-transparent outline-none text-[15px] leading-[20px]" style={{ ...dmSans400, color: "var(--color-text-primary)", caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden" }} value={inputValue} onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }} rows={1} placeholder="Ask, search or create your card" />
                            </div>
                            <div className="flex items-end justify-between relative shrink-0 w-full">
                              <div className="flex gap-[8px] items-end relative shrink-0">
                                <button className="transition-colors flex gap-[6px] h-[32px] items-center px-[8px] py-[6px] relative rounded-[100px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
                                  <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
                                  <p className="font-medium leading-[18px] text-[12px] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
                                </button>
                              </div>
                              <div className="flex gap-[4px] items-center relative shrink-0">
                                <button
                                  aria-label="Toggle Microphone" type="button" onClick={toggleMic}
                                  className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${isRecording ? "bg-red-100 text-red-500" : ""}`}
                                  style={!isRecording ? { color: "var(--color-text-primary)" } : undefined}
                                  onMouseEnter={!isRecording ? e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)") : undefined}
                                  onMouseLeave={!isRecording ? e => (e.currentTarget.style.backgroundColor = "") : undefined}>
                                  <Mic size={18} strokeWidth={1.5} absoluteStrokeWidth />
                                </button>
                                <button
                                  aria-label="Send" type="button" onClick={handleSend}
                                  disabled={!inputValue.trim() && !isRecording}
                                  className={`flex items-center justify-center p-[8px] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!inputValue.trim() ? "cursor-not-allowed" : ""}`}
                                  style={inputValue.trim() ? { backgroundColor: "var(--color-brand-primary)", color: "white" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}>
                                  <ArrowUp size={18} strokeWidth={1.5} absoluteStrokeWidth />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      /* WORKING STATE */
                      <motion.div key="working" className="flex flex-col w-full flex-1 relative overflow-hidden min-h-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.08 }}>
                        <div className="flex flex-col flex-1 overflow-hidden p-[16px] gap-[24px] min-h-0">
                          <div ref={chatsScrollRef} className="flex flex-col gap-[16px] overflow-y-auto flex-1 min-h-0">
                            <div className="flex-1" />

                            {messages.map((msg, i) => {
                              if (msg.role === "user") {
                                return (
                                  <motion.div key={`msg-${i}`} className="flex w-full justify-end shrink-0 pl-[56px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ ...bubbleSpring, delay: 0.1 }}>
                                    <div className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px]" style={{ backgroundColor: bubbleBg }}>
                                      <p className="leading-[20px] text-[15px] whitespace-pre-wrap" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{msg.text}</p>
                                    </div>
                                  </motion.div>
                                );
                              } else {
                                return (
                                  <motion.div key={`msg-${i}`} className="flex flex-col gap-[16px] w-full shrink-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={bubbleSpring}>
                                    <div className="flex w-full justify-start pr-[56px]">
                                      <div className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px] flex flex-col gap-[12px]" style={{ backgroundColor: bubbleBg }}>
                                        <p className="leading-[20px] text-[15px] whitespace-pre-wrap" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{msg.text}</p>
                                        {msg.buttons?.map((label, bi) => {
                                          const isUsed = i < messages.length - 1;
                                          return <BubbleButton key={label} label={label} isUsed={isUsed} onClick={handleTriggerButton} delay={bi * 0.08} />;
                                        })}
                                      </div>
                                    </div>
                                    {msg.showCarousel && <StyleCarousel themeChoice={themeChoice} setThemeChoice={handleStyleSelect} />}
                                  </motion.div>
                                );
                              }
                            })}

                            <AnimatePresence mode="popLayout">
                              {typingText && (
                                <motion.div key="typing-bubble" className="flex flex-col gap-[16px] w-full shrink-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={bubbleSpring}>
                                  <div className="flex w-full justify-start pr-[56px]">
                                    <div className="rounded-[12px] px-[12px] py-[8px] max-w-[85%] sm:max-w-[440px]" style={{ backgroundColor: bubbleBg }}>
                                      <p className="leading-[20px] text-[15px] whitespace-pre-wrap" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{typedText}</p>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <AnimatePresence>{showWorkingSpinner && <WorkingSpinner key="step-loader" />}</AnimatePresence>

                            <AnimatePresence>
                              {showBanner && currentStep?.type === "banner" && (
                                <motion.div key="generating-banner" className="flex w-full justify-start pr-[56px] shrink-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={bubbleSpring}>
                                  <TadaBanner loadingDuration={currentStep.config.loadingDuration} loadingTitle={currentStep.config.loadingTitle} loadingMessage={currentStep.config.loadingMessage} doneTitle={currentStep.config.doneTitle} doneMessage={currentStep.config.doneMessage} partyPopperSrc={partyPopperSrc} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>

                        {/* Ask section */}
                        <motion.div className="flex gap-[10px] items-center px-[16px] w-full shrink-0 mt-[8px] mb-[8px]" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ ...entranceSpring, delay: 0.35 }}>
                          <motion.img alt="" className="pointer-events-none object-cover shrink-0" src={aiIconSrc} animate={{ scale: [13 / 16, 1, 13 / 16], opacity: isFocused || !!inputValue ? 1 : 0.5 }} transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }} style={{ width: 16, height: 16 }} />
                          <textarea className="flex-1 resize-none bg-transparent outline-none text-[15px] leading-[20px] min-w-0" style={{ ...dmSans400, caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden", color: isFocused || inputValue ? "var(--color-text-primary)" : "var(--color-text-secondary)" }} value={inputValue} placeholder="Ask, search or create your card" onChange={e => { setInputValue(e.target.value); e.target.style.height = "auto"; e.target.style.height = `${e.target.scrollHeight}px`; }} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } if ((e.metaKey || e.ctrlKey) && e.key === "a") { e.stopPropagation(); e.currentTarget.setSelectionRange(0, e.currentTarget.value.length); } }} rows={1} />
                        </motion.div>

                        {/* Divider */}
                        <div className="relative w-full h-px shrink-0">
                          <div className="absolute inset-0">
                            <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 640 1"><line stroke="var(--color-element-subtle)" x2="640" y1="0.5" y2="0.5" /></svg>
                          </div>
                        </div>

                        {/* Bottom bar */}
                        <BottomBar isActive={!!inputValue.trim()} isRecording={isRecording} onToggleMic={toggleMic} onSend={handleSend} />

                        {/* Overflow menus */}
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "overflow" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <OverflowMenu pages={currentStep.pages} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={handleMenuComplete} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "template" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <TemplateOverflowMenu header={currentStep.header} cards={currentStep.cards} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={handleMenuComplete} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "action" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <ActionOverflowMenu config={currentStep.config} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onGenerate={handleActionGenerate} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "checklist" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <ChecklistOverflowMenu pages={currentStep.pages} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={(selected) => { if (selected.length === 0) handleMenuSkip(); else handleMenuComplete(selected.join(", ")); }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "style-carousel" && (
                            <motion.div className="px-[16px] w-full shrink-0 mb-[8px]" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
                              <StyleCarousel themeChoice={themeChoice} setThemeChoice={handleStyleSelect} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StampyChatbot;
