// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Overflow menu components
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect } from "react";
import { X, Pencil, CheckCheck, ChevronRight, ChevronLeft } from "lucide-react";
import { Btn } from "./btn";
import { motion, AnimatePresence } from "motion/react";

import { dmSans400, dmSans500 } from "./hs-stampy-constants";
import {
  SEND_ARROW_PATH, CHECKMARK_PATH,
} from "./hs-chat-svg";
import type {
  OverflowPage, ChecklistPage, TemplateCard, ActionMenuConfig,
} from "./hs-chat-types";

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

// ── ActionOverflowMenu (V1 — Ghost Buttons) ──────────────────────────────

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
          {(config.adjustOptions ?? []).map((label) => (
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

// ── ActionOverflowMenuList (V2 — Numbered List) ───────────────────────────

export function ActionOverflowMenuList({
  config, inputPlaceholder, onClose, onGenerate, onComplete,
}: {
  config: ActionMenuConfig; inputPlaceholder?: string; onClose: () => void; onGenerate: () => void; onComplete: (label: string) => void;
}) {
  const [customInput, setCustomInput] = useState("");
  const adjustHeader = config.adjustHeader ?? "Or, want to make changes?";
  const items = config.adjustItems ?? [];

  return (
    <div className="flex flex-col gap-[4px] items-start py-[12px] relative rounded-[12px] w-full" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
      {/* bullets — Header + Separator + list */}
      <div className="flex flex-col gap-[16px] w-full">
        {/* Header */}
        <div className="flex items-center gap-[16px] px-[20px] py-[8px] w-full">
          <div className="flex flex-1 gap-[24px] items-center min-w-0">
            <div className="flex flex-col gap-[4px] flex-1 min-w-0">
              <p className="leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.title}</p>
              <p className="leading-[20px] text-[13px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{config.subtitle}</p>
            </div>
            <Btn onClick={onGenerate} className="shrink-0">{config.generateButtonLabel}</Btn>
          </div>
          <OverflowCloseBtn onClose={onClose} />
        </div>
        {/* Separator */}
        <div className="w-full h-[1px]" style={{ backgroundColor: "var(--color-element-subtle)" }} />
        {/* "or" section */}
        <div className="flex flex-col gap-[8px] w-full">
          <p className="leading-[20px] text-[15px] px-[20px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{adjustHeader}</p>
          <div className="flex flex-col px-[12px] w-full">
            {items.map((item) => (
              <div
                key={item.num}
                className="flex flex-col h-[36px] items-start w-full rounded-[6px] transition-colors cursor-pointer"
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-element-subtle)")}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                onClick={() => onComplete(item.label)}
              >
                <div className="flex gap-[8px] items-center px-[8px] py-[6px] w-full h-full">
                  <div className="flex items-center justify-center rounded-[4px] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
                    <p className="leading-[20px] text-[14px] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.num}</p>
                  </div>
                  <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="px-[8px] w-full">
        <div className="rounded-[12px] flex items-center px-[12px] py-[8px] w-full" style={{ border: "1px solid var(--color-element-subtle)" }}>
          <div className="flex flex-1 items-center gap-[4px] min-w-0">
            <div className="shrink-0 size-[20px] flex items-center justify-center rounded-[4px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
              <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
            </div>
            <input type="text" value={customInput} onChange={(e) => setCustomInput(e.target.value)} onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter" && customInput.trim()) onComplete(customInput.trim()); }} placeholder={inputPlaceholder ?? "Something else"} className="flex-1 bg-transparent outline-none border-none text-[14px] leading-[20px] min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }} />
          </div>
          <div className="flex items-center gap-[8px]">
            <Btn type="button" variant="outline" size="sm" onClick={onClose}>Skip</Btn>
            <Btn type="button" variant="default" size="icon-sm" onClick={() => { if (customInput.trim()) onComplete(customInput.trim()); }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" /></svg>
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
