// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Overflow menu components
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState, useEffect } from "react";
import { X, Pencil, ChevronRight, ChevronLeft, Mail } from "lucide-react";
import { cn } from "./utils";
import { Btn } from "./btn";
import { Sep } from "./hs-sep";
import { Lbl } from "./hs-lbl";
import { Inp } from "./hs-inp";
import { motion, AnimatePresence } from "motion/react";

import { dmSans400, dmSans500 } from "./hs-stampy-constants";
import { SEND_ARROW_PATH, CHECKMARK_PATH } from "./hs-chat-svg";
import type {
  OverflowPage, ChecklistPage, TemplateCard, ActionMenuConfig,
} from "./hs-chat-types";

// ── Shared primitives ──────────────────────────────────────────────────────

const hoverItem = {
  onMouseEnter: (e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.backgroundColor = "var(--color-element-subtle)"),
  onMouseLeave: (e: React.MouseEvent<HTMLDivElement>) => (e.currentTarget.style.backgroundColor = "transparent"),
};

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

/** Numbered pill badge used in OverflowMenu and ActionOverflowMenuList */
function NumBadge({ num }: { num: string }) {
  return (
    <div className="flex items-center justify-center rounded-[4px] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
      <p className="leading-[20px] text-[14px] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{num}</p>
    </div>
  );
}

/** Pencil input + Skip + Send row shared across all 4 overflow menu variants */
function OverflowInput({
  value, onChange, onKeyDown, onSkip, onSend, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSkip: () => void;
  onSend: () => void;
  placeholder: string;
}) {
  return (
    <div className="rounded-[12px] flex items-center px-[12px] py-[8px] w-full" style={{ border: "1px solid var(--color-element-subtle)" }}>
      <div className="flex flex-1 items-center gap-[4px] min-w-0">
        <div className="shrink-0 size-[20px] flex items-center justify-center rounded-[4px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
          <Pencil size={14} color="var(--color-text-primary)" strokeWidth={2.5} />
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none border-none text-[14px] leading-[20px] min-w-0"
          style={{ ...dmSans400, color: "var(--color-text-primary)" }}
        />
      </div>
      <div className="flex items-center gap-[8px]">
        <Btn type="button" variant="outline" size="sm" onClick={onSkip}>Skip</Btn>
        <Btn type="button" variant="default" size="icon-sm" onClick={onSend}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d={SEND_ARROW_PATH} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </Btn>
      </div>
    </div>
  );
}

// ── OverflowMenu ───────────────────────────────────────────────────────────

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
              className="flex gap-[8px] items-center h-[36px] px-[8px] py-[6px] w-full rounded-[6px] transition-colors cursor-pointer"
              {...hoverItem}
              onClick={() => handleItemClick(item)}
            >
              <NumBadge num={item.num} />
              <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
            </div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* "Something else" input */}
      <div className="rounded-[12px] flex items-center px-[12px] py-[8px] w-full" style={{ border: "1px solid var(--color-element-subtle)" }}>
        <div className="flex flex-1 items-center gap-[4px] min-w-0">
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
    <div className="flex flex-col gap-[4px] items-start py-[12px] px-[8px] relative rounded-[12px] w-full" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
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
                <div key={item.id} className="flex gap-[8px] items-center h-[36px] px-[8px] py-[6px] rounded-[6px] w-full cursor-pointer transition-colors" {...hoverItem} onClick={() => toggleItem(item.id)}>
                  <div className="relative rounded-[4px] shrink-0 size-[16px] flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: checked ? "var(--color-brand-primary)" : "transparent", border: checked ? "1px solid var(--color-brand-primary)" : "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
                    {checked && <svg width="10.7" height="7.75" viewBox="0 0 10.6633 7.74667" fill="none"><path d={CHECKMARK_PATH} stroke="var(--color-text-on-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /></svg>}
                  </div>
                  <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      <OverflowInput
        value={inputValue}
        onChange={setInputValue}
        onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
        onSkip={() => onComplete([])}
        onSend={handleSend}
        placeholder={inputPlaceholder ?? "You make the call"}
      />
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
    <div className="flex flex-col gap-[16px] py-[12px] relative rounded-[12px] w-full z-10" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
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
              <div
                key={item.num}
                className="relative rounded-[16px] cursor-pointer overflow-hidden transition-colors h-[224px]"
                style={{ border: "1px solid var(--color-element-subtle)", backgroundColor: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--color-element-subtle)"; e.currentTarget.style.borderColor = "var(--color-text-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "var(--color-element-subtle)"; }}
                onClick={() => onComplete(`${item.title}: "${item.front}" — ${item.insideHeading ?? ""} ${item.insideBody}`)}
              >
                <div className="p-[12px] h-full flex flex-col gap-[6px] text-[13px] leading-[18px]" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>
                  <p className="shrink-0"><span style={{ ...dmSans500 }}>Front:</span>{` ${item.front}`}</p>
                  <p className="flex-1 overflow-hidden"><span style={{ ...dmSans500 }}>Inside:</span>{` ${item.insideHeading ?? ""} ${item.insideBody}`}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="px-[8px] w-full">
        <OverflowInput
          value={customInput}
          onChange={setCustomInput}
          onKeyDown={(e) => { if (e.key === "Enter") onComplete(customInput.trim() || "skip"); }}
          onSkip={() => onComplete("skip")}
          onSend={() => onComplete(customInput.trim() || "skip")}
          placeholder={inputPlaceholder ?? "Something else"}
        />
      </div>
    </div>
  );
}

// ── ActionOverflowMenu (V1 — Ghost Buttons) ────────────────────────────────

export function ActionOverflowMenu({
  config, inputPlaceholder, onClose, onGenerate,
}: {
  config: ActionMenuConfig; inputPlaceholder?: string; onClose: () => void; onGenerate: () => void;
}) {
  const [customInput, setCustomInput] = useState("");

  return (
    <div className="flex flex-col gap-[4px] items-start py-[12px] relative rounded-[12px] w-full" style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" }}>
      <div className="flex items-center gap-[16px] px-[20px] py-[8px] w-full">
        <div className="flex flex-col gap-[4px] flex-1 min-w-0">
          <p className="leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.title}</p>
          <p className="leading-[20px] text-[13px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{config.subtitle}</p>
        </div>
        <Btn onClick={onGenerate} className="shrink-0">{config.generateButtonLabel}</Btn>
        <OverflowCloseBtn onClose={onClose} />
      </div>
      <div className="w-full h-[1px]" style={{ backgroundColor: "var(--color-element-subtle)" }} />
      <div className="flex flex-col gap-[8px] px-[20px] py-[8px] w-full">
        <p className="leading-[20px] text-[15px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Or Adjust</p>
        <div className="flex gap-[16px] items-center">
          {(config.adjustOptions ?? []).map((label) => (
            <Btn key={label} variant="outline" size="sm" onClick={onClose}>{label}</Btn>
          ))}
        </div>
      </div>
      <div className="px-[8px] w-full">
        <OverflowInput
          value={customInput}
          onChange={setCustomInput}
          onKeyDown={(e) => { if (e.key === "Enter" && customInput.trim()) onClose(); }}
          onSkip={onClose}
          onSend={() => { if (customInput.trim()) onClose(); }}
          placeholder={inputPlaceholder ?? "Something else"}
        />
      </div>
    </div>
  );
}

// ── ActionOverflowMenuList (V2 — Numbered List) ────────────────────────────

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
                className="flex gap-[8px] items-center h-[36px] px-[8px] py-[6px] w-full rounded-[6px] transition-colors cursor-pointer"
                {...hoverItem}
                onClick={() => onComplete(item.label)}
              >
                <NumBadge num={item.num} />
                <p className="flex-1 leading-[20px] text-[14px] truncate min-w-0" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Input */}
      <div className="px-[8px] w-full">
        <OverflowInput
          value={customInput}
          onChange={setCustomInput}
          onKeyDown={(e) => { e.stopPropagation(); if (e.key === "Enter" && customInput.trim()) onComplete(customInput.trim()); }}
          onSkip={onClose}
          onSend={() => { if (customInput.trim()) onComplete(customInput.trim()); }}
          placeholder={inputPlaceholder ?? "Something else"}
        />
      </div>
    </div>
  );
}

// ── Signup / OTP shared ────────────────────────────────────────────────────

const signupHeading = {
  fontFamily: "var(--font-family-heading)",
  fontWeight: "var(--font-weight-subheadline)" as React.CSSProperties["fontWeight"],
};

const SIGNUP_SHELL = "flex flex-col items-start pt-[var(--space-3)] pb-[var(--space-5)] relative rounded-[var(--radius-2xl)] w-full overflow-hidden";
const SIGNUP_SHELL_STYLE = { backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-xs)", border: "1px solid var(--color-element-subtle)" } as const;

const CONTENT_SPRING = { type: "spring", stiffness: 380, damping: 28 } as const;
const FOOTER_SPRING  = { type: "spring", stiffness: 340, damping: 26 } as const;
const FADE_TRANSITION = { duration: 0.15 } as const;
const TRANSITION_MS = 420;

// ── Social brand icons ─────────────────────────────────────────────────────

function AppleIcon() {
  return (
    <svg width="16" height="20" viewBox="0 0 16 20" fill="currentColor" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M13.173 10.29c-.022-2.298 1.87-3.404 1.956-3.46-1.065-1.556-2.72-1.77-3.31-1.797-1.41-.142-2.746.838-3.46.838-.713 0-1.822-.815-2.995-.792-1.538.023-2.956.897-3.749 2.278-1.6 2.776-.412 6.893 1.151 9.147.762 1.107 1.666 2.353 2.86 2.307 1.148-.046 1.582-.74 2.97-.74 1.387 0 1.787.74 3.004.716 1.24-.023 2.022-1.136 2.774-2.25.878-1.287 1.237-2.534 1.26-2.599-.028-.012-2.435-.937-2.461-3.648zm-2.307-6.697c.634-.766 1.062-1.826.944-2.893-.912.038-2.022.608-2.676 1.372-.589.678-1.104 1.763-.913 2.803.02.004.04.007.06.007.926 0 1.876-.564 2.585-1.289z" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908C16.658 14.13 17.64 11.822 17.64 9.2z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853" />
      <path d="M3.964 10.712A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.712V4.956H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.044l3.007-2.332z" fill="#FBBC05" />
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.956L3.964 7.288C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2" />
    </svg>
  );
}

// ── Shared sub-components ──────────────────────────────────────────────────

function SignupHeader({ title, subtitle, onClose }: { title: string; subtitle: string; onClose: () => void }) {
  return (
    <div className="flex gap-[var(--space-4)] items-start px-[var(--space-5)] py-[var(--space-2)] w-full">
      <div className="flex flex-col gap-[var(--space-2)] flex-1 min-w-0">
        <h2 className="m-0" style={{ ...signupHeading, fontSize: "var(--font-size-h5)", lineHeight: "28px", color: "var(--color-text-primary)" }}>{title}</h2>
        <p className="leading-[20px] text-[var(--font-size-body-15)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{subtitle}</p>
      </div>
      <OverflowCloseBtn onClose={onClose} className="mt-[var(--space-2)] shrink-0" />
    </div>
  );
}

// Handles all three footer variants:
//   onSignIn only  → "Already have an account? Sign in" + Terms
//   onBack only    → back button + Terms
//   both           → "Already have an account? Sign in" + back button + Terms
interface AuthFooterProps {
  onSignIn?: () => void;
  onBack?: () => void;
  backLabel?: string;
  loading?: boolean;
  onTerms?: () => void;
  onPrivacy?: () => void;
}

function AuthFooter({ onSignIn, onBack, backLabel = "Back to sign up", loading, onTerms, onPrivacy }: AuthFooterProps) {
  return (
    <div className="flex flex-col gap-[var(--space-3)] items-center w-full">
      {onSignIn && (
        <p className="leading-[20px] text-[var(--font-size-body-15)] text-center" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
          Already have an account?{" "}
          <Btn
            variant="link"
            size="sm"
            className="no-underline inline-flex h-auto"
            style={{ color: "var(--color-brand-primary)", fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"] }}
            onClick={onSignIn}
          >
            Sign in
          </Btn>
        </p>
      )}
      {onBack && (
        <Btn
          variant="link"
          size="sm"
          className={cn("no-underline gap-[var(--space-1-5)] h-auto", onSignIn && "mt-[var(--space-2)]")}
          style={{ color: "var(--color-text-secondary)" }}
          disabled={loading}
          onClick={onBack}
        >
          <ChevronLeft size={16} strokeWidth={2} />
          {backLabel}
        </Btn>
      )}
      <p className="leading-[17px] text-[var(--font-size-body-13)] text-center px-[var(--space-8)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
        By proceeding, you accept our{" "}
        <Btn variant="link" size="sm" className="no-underline inline-flex h-auto text-[var(--font-size-body-13)]" style={{ color: "var(--color-text-primary)" }} onClick={onTerms}>Terms of Use</Btn>
        {" "}and{" "}
        <Btn variant="link" size="sm" className="no-underline inline-flex h-auto text-[var(--font-size-body-13)]" style={{ color: "var(--color-text-primary)" }} onClick={onPrivacy}>Privacy Policy</Btn>.
      </p>
    </div>
  );
}

// ── SignupOverflowMenu ─────────────────────────────────────────────────────

export function SignupOverflowMenu({
  title = "Create your free account",
  subtitle = "Sign up for free and grab your heart credits to personalize your greeting cards!",
  onClose,
  onApple,
  onGoogle,
  onFacebook,
  onEmail,
  onSignIn,
  onTerms,
  onPrivacy,
}: {
  title?: string;
  subtitle?: string;
  onClose: () => void;
  onApple?: () => void;
  onGoogle?: () => void;
  onFacebook?: () => void;
  onEmail?: (email: string) => void;
  onSignIn?: () => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
}) {
  const [mode, setMode] = useState<"signup" | "signin" | "email">("signup");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const isSignIn = mode === "signin";

  function transition(next: "signup" | "signin" | "email") {
    setLoading(true);
    setTimeout(() => { setLoading(false); setMode(next); }, TRANSITION_MS);
  }

  return (
    <div className={SIGNUP_SHELL} style={SIGNUP_SHELL_STYLE}>
      <div className="flex flex-col gap-[var(--space-5)] w-full">
        <SignupHeader title={title} subtitle={subtitle} onClose={onClose} />
        <Sep />
        <AnimatePresence mode="wait">
          {mode === "email" ? (
            <motion.div
              key="email"
              className="flex flex-col gap-[var(--space-3)] px-[var(--space-5)] w-full"
              initial={{ opacity: 0, x: 14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 14 }}
              transition={CONTENT_SPRING}
            >
              <motion.div
                className="flex flex-col gap-[var(--space-3)] w-full"
                animate={{ opacity: loading ? 0.4 : 1 }}
                transition={FADE_TRANSITION}
              >
                <Inp
                  type="email"
                  label="Email address"
                  placeholder="john@address.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  iconLeft={<Mail size={16} strokeWidth={2} />}
                />
                <Btn
                  variant="default"
                  size="xl"
                  className="w-full rounded-full"
                  disabled={!email.trim() || loading}
                  onClick={() => email.trim() && onEmail?.(email.trim())}
                >
                  Claim Free Credits
                </Btn>
              </motion.div>
              <AuthFooter
                onSignIn={() => transition("signin")}
                onBack={() => transition("signup")}
                loading={loading}
                onTerms={onTerms}
                onPrivacy={onPrivacy}
              />
            </motion.div>
          ) : (
            <motion.div
              key="social"
              className="flex flex-col gap-[var(--space-6)] px-[var(--space-5)] w-full"
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={CONTENT_SPRING}
            >
              <motion.div
                className="flex flex-col gap-[var(--space-3)] w-full"
                animate={{ opacity: loading ? 0.4 : 1 }}
                transition={FADE_TRANSITION}
              >
                <Btn variant="outline" size="lg" className="w-full gap-[var(--space-2-5)]" disabled={loading} onClick={onApple}>
                  <AppleIcon /><span>{isSignIn ? "Sign in with Apple" : "Sign up with Apple"}</span>
                </Btn>
                <Btn variant="outline" size="lg" className="w-full gap-[var(--space-2-5)]" disabled={loading} onClick={onGoogle}>
                  <GoogleIcon /><span>{isSignIn ? "Sign in with Google" : "Sign up with Google"}</span>
                </Btn>
                <Btn variant="outline" size="lg" className="w-full gap-[var(--space-2-5)]" disabled={loading} onClick={onFacebook}>
                  <FacebookIcon /><span>{isSignIn ? "Sign in with Facebook" : "Sign up with Facebook"}</span>
                </Btn>
              </motion.div>
              <div className="flex items-center gap-[var(--space-3)] w-full">
                <Sep style={{ flex: 1, width: "auto" }} />
                <p className="text-[var(--font-size-body-13)] leading-[20px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>OR</p>
                <Sep style={{ flex: 1, width: "auto" }} />
              </div>
              <motion.div
                className="flex flex-col gap-[var(--space-2-5)] w-full"
                animate={{ opacity: loading ? 0.4 : 1 }}
                transition={FADE_TRANSITION}
              >
                <Btn
                  variant="default"
                  size="xl"
                  className="w-full rounded-full"
                  disabled={loading}
                  onClick={isSignIn ? onSignIn : () => transition("email")}
                >
                  {isSignIn ? "Sign in with email" : "Sign up with email"}
                </Btn>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence mode="wait">
          {mode === "signin" ? (
            <motion.div
              key="back"
              className="px-[var(--space-5)] w-full"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={FOOTER_SPRING}
            >
              <AuthFooter onBack={() => transition("signup")} loading={loading} onTerms={onTerms} onPrivacy={onPrivacy} />
            </motion.div>
          ) : mode === "signup" ? (
            <motion.div
              key="footer"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              transition={FOOTER_SPRING}
            >
              <AuthFooter onSignIn={() => transition("signin")} onTerms={onTerms} onPrivacy={onPrivacy} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ── OTPOverflowMenu ────────────────────────────────────────────────────────

export function OTPOverflowMenu({
  title = "Create your free account",
  subtitle = "Sign up for free and grab your heart credits to personalize your greeting cards!",
  buttonLabel = "Verify",
  onClose,
  onVerify,
  onResend,
  onBack,
  onSignIn,
  onTerms,
  onPrivacy,
}: {
  title?: string;
  subtitle?: string;
  buttonLabel?: string;
  onClose: () => void;
  onVerify: (code: string) => void;
  onResend?: () => void;
  onBack?: () => void;
  onSignIn?: () => void;
  onTerms?: () => void;
  onPrivacy?: () => void;
}) {
  const [code, setCode] = useState("");

  return (
    <div className={SIGNUP_SHELL} style={SIGNUP_SHELL_STYLE}>
      <div className="flex flex-col gap-[var(--space-5)] w-full">
        <SignupHeader title={title} subtitle={subtitle} onClose={onClose} />
        <Sep />
        <div className="flex flex-col gap-[var(--space-5)] px-[var(--space-5)] w-full">
          <div className="flex flex-col gap-[var(--space-4)] w-full">
            <div className="flex items-center w-full">
              <Lbl
                style={{
                  flex: 1,
                  fontSize: "var(--font-size-label-sb-15)",
                  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
                  marginBottom: 0,
                }}
              >
                Verification Code
              </Lbl>
              <Btn variant="link" size="sm" className="no-underline h-auto" style={{ color: "var(--color-text-primary)" }} onClick={onResend}>
                Resend
              </Btn>
            </div>
            <Inp
              type="text"
              placeholder="Enter your code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            />
          </div>
          <Btn
            variant="default"
            size="xl"
            className="w-full rounded-full"
            disabled={code.length < 6}
            onClick={() => onVerify(code)}
          >
            {buttonLabel}
          </Btn>
          <AuthFooter onSignIn={onSignIn} onBack={onBack} backLabel="Back" onTerms={onTerms} onPrivacy={onPrivacy} />
        </div>
      </div>
    </div>
  );
}
