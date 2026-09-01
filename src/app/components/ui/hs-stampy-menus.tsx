// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Overflow menu components
// ═══════════════════════════════════════════════════════════════════════════

import React, { useState } from "react";
import { X, ChevronRight, ChevronLeft, Mail } from "lucide-react";
import { cn } from "./utils";
import { Btn } from "./btn";
import { Sep } from "./hs-sep";
import { Lbl } from "./hs-lbl";
import { Inp } from "./hs-inp";
import { motion, AnimatePresence } from "motion/react";

import { dmSans400, dmSans500 } from "./hs-stampy-constants";
import { CHECKMARK_PATH } from "./hs-chat-svg";
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
    <div className="flex gap-[var(--space-1)] items-center">
      <button className="flex items-center justify-center size-[16px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30" onClick={onPrev} disabled={page === 1}>
        <ChevronLeft size={16} strokeWidth={1.5} absoluteStrokeWidth style={{ color: "var(--color-text-secondary)" }} />
      </button>
      <p className="leading-normal text-[length:var(--font-size-body-13)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{page} of {total}</p>
      <button className="flex items-center justify-center size-[16px] cursor-pointer opacity-60 hover:opacity-100 transition-opacity disabled:opacity-30" onClick={onNext} disabled={page === total}>
        <ChevronRight size={16} strokeWidth={1.5} absoluteStrokeWidth style={{ color: "var(--color-text-secondary)" }} />
      </button>
    </div>
  );
}

/** Numbered pill badge used in OverflowMenu and ActionOverflowMenuList */
function NumBadge({ num }: { num: string }) {
  return (
    <div className="flex items-center justify-center rounded-[var(--radius-xs)] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
      <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{num}</p>
    </div>
  );
}

/** Underlined text action in the OverflowMenu footer (left slot).
 *  While loading it is disabled and the label stays put — the spinner is laid out
 *  inline before it (never stacked on top of it) and inherits the label colour
 *  via currentColor.
 *  No opacity transition and no hover state: animating opacity here made Safari
 *  paint the pre- and post-state labels on top of each other. */
function OverflowShowMoreBtn({ label, onClick, isLoading }: { label: string; onClick: () => void; isLoading?: boolean }) {
  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-[var(--space-1-5)] px-[var(--space-3)] py-[var(--space-2)]",
        isLoading ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
      style={{ borderRadius: "var(--radius-button)", color: "var(--color-text-primary)" }}
      onClick={onClick}
      disabled={isLoading}
      aria-busy={isLoading}
    >
      {isLoading && (
        <svg className="shrink-0 animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true">
          <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" />
        </svg>
      )}
      <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] underline whitespace-nowrap" style={dmSans500}>
        {label}
      </p>
    </button>
  );
}

/** Dimmed pill action in the OverflowMenu footer (right slot). */
function OverflowSkipBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex shrink-0 items-center justify-center gap-[var(--space-1)] px-[var(--space-3)] py-[var(--space-1-5)] cursor-pointer transition-colors"
      style={{ backgroundColor: "var(--color-brand-secondary-dim)", borderRadius: "var(--radius-button)" }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--color-element-subtle)")}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}
      onClick={onClick}
    >
      <span className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{label}</span>
    </button>
  );
}

/** Title + subtitle + primary action + close, shared by the two action menus so
 *  they stay pixel-identical. Full-bleed separator sits directly under it. */
function ActionMenuHeader({
  config, onClose, onGenerate, isLoadingGenerate, generateButtonLabel,
}: {
  config: ActionMenuConfig;
  onClose: () => void;
  onGenerate: () => void;
  isLoadingGenerate?: boolean;
  generateButtonLabel?: string;
}) {
  return (
    <div className="flex items-center gap-[var(--space-4)] px-[var(--space-4)] py-[var(--space-2)] w-full">
      <div className="flex flex-1 gap-[var(--space-3)] items-center min-w-0">
        <div className="flex flex-col gap-[var(--space-1)] flex-1 min-w-0">
          <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.title}</p>
          <p className="leading-[17px] text-[length:var(--font-size-body-13)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{config.subtitle}</p>
        </div>
        <Btn onClick={onGenerate} className="shrink-0 flex items-center gap-[var(--space-1-5)]" disabled={isLoadingGenerate}>
          {isLoadingGenerate && <svg className="shrink-0 animate-spin" width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5" strokeDasharray="20 12" /></svg>}
          {generateButtonLabel ?? config.generateButtonLabel}
        </Btn>
      </div>
      <OverflowCloseBtn onClose={onClose} />
    </div>
  );
}

function ActionMenuSeparator() {
  return <div className="w-full h-[1px] shrink-0" style={{ backgroundColor: "var(--color-element-subtle)" }} />;
}

// ── OverflowMenu ───────────────────────────────────────────────────────────

export function OverflowMenu({
  pages, onClose, onComplete, onShowMore, isLoadingShowMore, showMoreLabel = "Show more...", onSkip, skipLabel = "Skip",
}: {
  pages: OverflowPage[];
  onClose: () => void;
  onComplete: (label: string) => void;
  /** Renders the "Show more…" action (single-page menus only) when provided. */
  onShowMore?: () => void;
  isLoadingShowMore?: boolean;
  /** Copy for the show-more action, so consumers can localise it. */
  showMoreLabel?: string;
  /** Renders the Skip button when provided. The consumer owns what skipping does
   *  — send a "skip" message, close the menu, advance a flow, anything. Omit it
   *  and no Skip button is shown. */
  onSkip?: () => void;
  /** Copy for the Skip button, so consumers can localise it. */
  skipLabel?: string;
}) {
  const totalPages = pages.length;
  const [page, setPage] = useState(1);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);

  const currentPageData = pages[page - 1];
  const items = currentPageData?.options ?? [];
  const header = currentPageData?.question ?? "";

  // Paging through answers is its own way forward, so the show-more escape hatch
  // is only offered on single-page menus.
  const showsShowMore = !!onShowMore && totalPages === 1;
  const showsFooter = showsShowMore || !!onSkip;

  function handleItemClick(item: { num: string; label: string }) {
    const newLabels = [...selectedLabels, item.label];
    if (page < totalPages) { setSelectedLabels(newLabels); setPage(page + 1); }
    else { onComplete(newLabels.join(", ")); }
  }

  return (
    <div
      className="flex flex-col items-start px-[var(--space-3)] py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={page}
          className="flex flex-col gap-[var(--space-2)] w-full"
          initial={{ opacity: 0, x: page > 1 ? 14 : -14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: page > 1 ? -14 : 14 }}
          transition={{ type: "spring", stiffness: 380, damping: 28 }}
        >
          <div className="flex gap-[var(--space-4)] items-start p-[var(--space-2)] w-full">
            <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{header}</p>
            <div className="flex gap-[var(--space-3)] items-center shrink-0">
              {totalPages > 1 && <OverflowPagination page={page} total={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />}
              <OverflowCloseBtn onClose={onClose} />
            </div>
          </div>

          {/* Six 36px rows fit before the list starts scrolling — the design's full height. */}
          <div className={'w-full max-h-[216px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent'}>
            {items.map((item) => (
              <div key={item.num} className="h-[36px] w-full shrink-0">
                <div
                  className="flex gap-[var(--space-2)] items-center px-[var(--space-2)] py-[var(--space-1-5)] w-full rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                  {...hoverItem}
                  onClick={() => handleItemClick(item)}
                >
                  <NumBadge num={item.num} />
                  <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0 truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {showsFooter && (
        <div className="flex items-center justify-between w-full min-h-[36px]">
          {showsShowMore
            ? <OverflowShowMoreBtn label={showMoreLabel} onClick={onShowMore!} isLoading={isLoadingShowMore} />
            : <span />}
          {onSkip && <OverflowSkipBtn label={skipLabel} onClick={onSkip} />}
        </div>
      )}
    </div>
  );
}

// ── ChecklistOverflowMenu ──────────────────────────────────────────────────

export function ChecklistOverflowMenu({
  pages: checklistPages, onClose, onSelectionChange, onShowMore, isLoadingShowMore, showMoreLabel = "Show more...", onSkip, skipLabel = "Skip",
}: {
  pages: ChecklistPage[];
  onClose: () => void;
  /** Fired on every toggle with the labels of everything currently ticked, across
   *  all pages. The design has no send button in the menu, so the consumer owns
   *  submission — mirror this into your own state and send it from your input. */
  onSelectionChange?: (selected: string[]) => void;
  /** Renders the "Show more…" action when provided. */
  onShowMore?: () => void;
  isLoadingShowMore?: boolean;
  /** Copy for the show-more action, so consumers can localise it. */
  showMoreLabel?: string;
  /** Renders the Skip button when provided. The consumer owns what skipping does. */
  onSkip?: () => void;
  /** Copy for the Skip button, so consumers can localise it. */
  skipLabel?: string;
}) {
  const [page, setPage] = useState(0);
  const totalPages = checklistPages.length;
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const labelsFor = (ids: Set<string>) =>
    checklistPages.flatMap(p => p.items).filter(item => ids.has(item.id)).map(item => item.label);

  // The next set is derived here rather than inside a setSelected updater: React
  // may run an updater during the render phase, and notifying the parent from
  // there warns about updating one component while rendering another.
  const toggleItem = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    onSelectionChange?.(labelsFor(next));
  };

  const currentPageData = checklistPages[page];

  const showsFooter = !!onShowMore || !!onSkip;

  return (
    <div
      className="flex flex-col items-start px-[var(--space-3)] py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <div className="flex flex-col gap-[var(--space-2)] items-start w-full">
        <div className="flex gap-[var(--space-4)] items-start p-[var(--space-2)] w-full">
          <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{currentPageData.question}</p>
          <div className="flex gap-[var(--space-3)] items-center shrink-0">
            {totalPages > 1 && <OverflowPagination page={page + 1} total={totalPages} onPrev={() => setPage(p => Math.max(0, p - 1))} onNext={() => setPage(p => Math.min(totalPages - 1, p + 1))} />}
            <OverflowCloseBtn onClose={onClose} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* Six 36px rows fit before the list starts scrolling — the design's full height. */}
          <motion.div key={page} className="w-full flex flex-col max-h-[216px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
            {currentPageData.items.map((item) => {
              const checked = selected.has(item.id);
              return (
                <div key={item.id} className="h-[36px] w-full shrink-0">
                  <div className="flex gap-[var(--space-2)] items-center px-[var(--space-2)] py-[var(--space-1-5)] rounded-[var(--radius-sm)] w-full cursor-pointer transition-colors" {...hoverItem} onClick={() => toggleItem(item.id)}>
                    <div className="relative rounded-[var(--radius-xs)] shrink-0 size-[16px] flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: checked ? "var(--color-brand-primary)" : "transparent", border: checked ? "1px solid var(--color-brand-primary)" : "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
                      {checked && <svg width="10.7" height="7.75" viewBox="0 0 10.6633 7.74667" fill="none"><path d={CHECKMARK_PATH} stroke="var(--color-text-on-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /></svg>}
                    </div>
                    <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0 truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{item.label}</p>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {showsFooter && (
        <div className="flex items-center justify-between w-full min-h-[36px]">
          {onShowMore
            ? <OverflowShowMoreBtn label={showMoreLabel} onClick={onShowMore} isLoading={isLoadingShowMore} />
            : <span />}
          {onSkip && <OverflowSkipBtn label={skipLabel} onClick={onSkip} />}
        </div>
      )}
    </div>
  );
}

// ── TemplateOverflowMenu ───────────────────────────────────────────────────

export function TemplateOverflowMenu({
  header, cards, onClose, onComplete, onShowMore, isLoadingShowMore, showMoreLabel = "Show more...", onSkip, skipLabel = "Skip",
}: {
  header: string;
  cards: TemplateCard[];
  onClose: () => void;
  onComplete: (label: string) => void;
  /** Renders the "Show more…" action when provided. */
  onShowMore?: () => void;
  isLoadingShowMore?: boolean;
  /** Copy for the show-more action, so consumers can localise it. */
  showMoreLabel?: string;
  /** Renders the Skip button when provided. The consumer owns what skipping does. */
  onSkip?: () => void;
  /** Copy for the Skip button, so consumers can localise it. */
  skipLabel?: string;
}) {
  const CARDS_PER_PAGE = 2;
  const totalPages = Math.ceil(cards.length / CARDS_PER_PAGE);
  const [page, setPage] = useState(1);
  const pageCards = cards.slice((page - 1) * CARDS_PER_PAGE, page * CARDS_PER_PAGE);

  const showsFooter = !!onShowMore || !!onSkip;

  return (
    <div
      className="flex flex-col gap-[var(--space-2)] px-[var(--space-3)] py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full z-10"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <div className="flex items-start gap-[var(--space-4)] p-[var(--space-2)] w-full">
        <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0" style={{ ...dmSans500, color: "var(--color-text-primary)", fontVariationSettings: "'opsz' 14" }}>{header}</p>
        <div className="flex gap-[var(--space-3)] items-center shrink-0">
          {totalPages > 1 && <OverflowPagination page={page} total={totalPages} onPrev={() => setPage(p => Math.max(1, p - 1))} onNext={() => setPage(p => Math.min(totalPages, p + 1))} />}
          <OverflowCloseBtn onClose={onClose} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={page} className="flex items-start gap-[var(--space-2)] w-full" initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -14 }} transition={{ type: "spring", stiffness: 380, damping: 28 }}>
          {pageCards.map((item) => {
            // The design renders one pre-wrapped block: "Front: …", a blank line,
            // then "Inside: …" — same weight throughout, clipped at the card height.
            const blocks = [
              item.front && `Front: ${item.front}`,
              (item.insideHeading || item.insideBody) && `Inside: ${[item.insideHeading, item.insideBody].filter(Boolean).join(" ")}`,
            ].filter(Boolean) as string[];

            return (
              <div
                key={item.num}
                className="flex flex-1 h-[160px] min-w-0 flex-col items-start p-[var(--space-2)] rounded-[var(--radius-2xl)] cursor-pointer overflow-hidden transition-colors"
                style={{ border: "1px solid var(--color-element-subtle)", backgroundColor: "transparent" }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = "var(--color-element-subtle)"; e.currentTarget.style.borderColor = "var(--color-text-secondary)"; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.borderColor = "var(--color-element-subtle)"; }}
                onClick={() => onComplete(`${item.title}: "${item.front}" — ${item.insideHeading ?? ""} ${item.insideBody}`)}
              >
                <p
                  className="flex-1 min-h-0 w-full overflow-hidden text-[length:var(--font-size-body-13)] whitespace-pre-wrap"
                  style={{ ...dmSans400, color: "var(--color-text-primary)", lineHeight: "normal" }}
                >
                  {blocks.join("\n\n")}
                </p>
              </div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {showsFooter && (
        <div className="flex items-center justify-between pt-[var(--space-2)] w-full">
          {onShowMore
            ? <OverflowShowMoreBtn label={showMoreLabel} onClick={onShowMore} isLoading={isLoadingShowMore} />
            : <span />}
          {onSkip && <OverflowSkipBtn label={skipLabel} onClick={onSkip} />}
        </div>
      )}
    </div>
  );
}

// ── ActionOverflowMenu (V1 — Ghost Buttons) ────────────────────────────────

export function ActionOverflowMenu({
  config, onClose, onGenerate, onAdjust, isLoadingGenerate, generateButtonLabel,
}: {
  config: ActionMenuConfig;
  onClose: () => void;
  onGenerate: () => void;
  /** Called with the adjust option the user picked. Falls back to closing the
   *  menu when omitted, which is what this variant did before it had a callback. */
  onAdjust?: (label: string) => void;
  isLoadingGenerate?: boolean;
  generateButtonLabel?: string;
}) {
  return (
    <div
      className="flex flex-col gap-[var(--space-4)] items-start py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <ActionMenuHeader
        config={config}
        onClose={onClose}
        onGenerate={onGenerate}
        isLoadingGenerate={isLoadingGenerate}
        generateButtonLabel={generateButtonLabel}
      />
      <ActionMenuSeparator />

      <div className="flex flex-col gap-[var(--space-2)] px-[var(--space-4)] w-full">
        <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.adjustHeader ?? "Or Adjust"}</p>
        <div className="flex flex-wrap gap-[var(--space-2)] items-center">
          {(config.adjustOptions ?? []).map((label) => (
            <Btn key={label} variant="outline" size="sm" onClick={() => (onAdjust ? onAdjust(label) : onClose())}>{label}</Btn>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── ActionOverflowMenuList (V2 — Numbered List) ────────────────────────────

export function ActionOverflowMenuList({
  config, onClose, onGenerate, onComplete, onShowMore, isLoadingShowMore, showMoreLabel = "Show more...", isLoadingGenerate, generateButtonLabel,
}: {
  config: ActionMenuConfig;
  onClose: () => void;
  onGenerate: () => void;
  onComplete: (label: string) => void;
  /** Renders the "Show more…" action when provided. */
  onShowMore?: () => void;
  isLoadingShowMore?: boolean;
  /** Copy for the show-more action, so consumers can localise it. */
  showMoreLabel?: string;
  isLoadingGenerate?: boolean;
  generateButtonLabel?: string;
}) {
  const adjustHeader = config.adjustHeader ?? "Or, want to make changes?";
  const items = config.adjustItems ?? [];

  return (
    <div
      className="flex flex-col gap-[var(--space-4)] items-start py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <ActionMenuHeader
        config={config}
        onClose={onClose}
        onGenerate={onGenerate}
        isLoadingGenerate={isLoadingGenerate}
        generateButtonLabel={generateButtonLabel}
      />
      <ActionMenuSeparator />

      <div className="flex flex-col gap-[var(--space-2)] px-[var(--space-4)] w-full">
        <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{adjustHeader}</p>
        <div className="flex flex-col w-full">
          {/* Six 36px rows fit before the list starts scrolling — the design's full height. */}
          <div className="flex flex-col w-full max-h-[216px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent">
            {items.map((item) => (
              <div key={item.num} className="h-[36px] w-full shrink-0">
                <div
                  className="flex gap-[var(--space-2)] items-center px-[var(--space-2)] py-[var(--space-1-5)] w-full rounded-[var(--radius-sm)] transition-colors cursor-pointer"
                  {...hoverItem}
                  onClick={() => onComplete(item.label)}
                >
                  <NumBadge num={item.num} />
                  <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0 truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{item.label}</p>
                </div>
              </div>
            ))}
          </div>
          {onShowMore && <OverflowShowMoreBtn label={showMoreLabel} onClick={onShowMore} isLoading={isLoadingShowMore} />}
        </div>
      </div>
    </div>
  );
}

// ── ActionChecklistOverflowMenu (Action header + multi-select checklist) ──────

export function ActionChecklistOverflowMenu({
  config, items, onClose, onGenerate, onSelectionChange, onShowMore, isLoadingShowMore, showMoreLabel = "Show more...", isLoadingGenerate, generateButtonLabel,
}: {
  config: ActionMenuConfig;
  items: { id: string; label: string }[];
  onClose: () => void;
  onGenerate: () => void;
  /** Fired on every toggle with the labels currently ticked. Like the other
   *  menus this one has no send button, so the consumer owns submission —
   *  mirror this into your own state and send it from your own input. */
  onSelectionChange?: (selected: string[]) => void;
  /** Renders the "Show more…" action when provided. */
  onShowMore?: () => void;
  isLoadingShowMore?: boolean;
  /** Copy for the show-more action, so consumers can localise it. */
  showMoreLabel?: string;
  isLoadingGenerate?: boolean;
  generateButtonLabel?: string;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());

  // Derived outside a setSelected updater — see the note in ChecklistOverflowMenu.
  const toggleItem = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
    onSelectionChange?.(items.filter(item => next.has(item.id)).map(item => item.label));
  };

  return (
    <div
      className="flex flex-col gap-[var(--space-4)] items-start py-[var(--space-3)] relative rounded-[var(--radius-2xl)] w-full"
      style={{ backgroundColor: "var(--color-bg-menus)", boxShadow: "var(--shadow-sm)", border: "1px solid var(--color-element-subtle)" }}
    >
      <ActionMenuHeader
        config={config}
        onClose={onClose}
        onGenerate={onGenerate}
        isLoadingGenerate={isLoadingGenerate}
        generateButtonLabel={generateButtonLabel}
      />
      <ActionMenuSeparator />

      <div className="flex flex-col gap-[var(--space-2)] px-[var(--space-4)] w-full">
        {config.adjustHeader && (
          <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{config.adjustHeader}</p>
        )}
        <div className="flex flex-col w-full">
          {/* Six 36px rows fit before the list starts scrolling — the design's full height. */}
          <div className="flex flex-col w-full max-h-[216px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted-foreground scrollbar-track-transparent">
            {items.map((item) => {
              const checked = selected.has(item.id);
              return (
                <div key={item.id} className="h-[36px] w-full shrink-0">
                  <div className="flex gap-[var(--space-2)] items-center px-[var(--space-2)] py-[var(--space-1-5)] rounded-[var(--radius-sm)] w-full cursor-pointer transition-colors" {...hoverItem} onClick={() => toggleItem(item.id)}>
                    <div className="relative rounded-[var(--radius-xs)] shrink-0 size-[16px] flex items-center justify-center transition-colors duration-150" style={{ backgroundColor: checked ? "var(--color-brand-primary)" : "transparent", border: checked ? "1px solid var(--color-brand-primary)" : "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
                      {checked && <svg width="10.7" height="7.75" viewBox="0 0 10.6633 7.74667" fill="none"><path d={CHECKMARK_PATH} stroke="var(--color-text-on-primary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33" /></svg>}
                    </div>
                    <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] min-w-0 truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{item.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {onShowMore && <OverflowShowMoreBtn label={showMoreLabel} onClick={onShowMore} isLoading={isLoadingShowMore} />}
        </div>
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
        <p className="leading-[var(--line-height-body-15)] text-[var(--font-size-body-15)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>{subtitle}</p>
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
        <p className="leading-[var(--line-height-body-15)] text-[var(--font-size-body-15)] text-center" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
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
      <p className="leading-[17px] text-[var(--font-size-body-13)] text-center px-[var(--space-4)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
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
                  size="lg"
                  className="w-full"
                  disabled={!email.trim()}
                  loading={loading}
                  onClick={() => {
                    if (!email.trim()) return;
                    setLoading(true);
                    onEmail?.(email.trim());
                  }}
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
                <p className="text-[var(--font-size-body-13)] leading-[var(--line-height-body-15)]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>OR</p>
                <Sep style={{ flex: 1, width: "auto" }} />
              </div>
              <motion.div
                className="flex flex-col gap-[var(--space-2-5)] w-full"
                animate={{ opacity: loading ? 0.4 : 1 }}
                transition={FADE_TRANSITION}
              >
                <Btn
                  variant="default"
                  size="lg"
                  className="w-full"
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
              className="px-[var(--space-5)] w-full"
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
  loading,
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
  loading?: boolean;
}) {
  const [code, setCode] = useState("");
  const [verifying, setVerifying] = useState(false);

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
            loading={loading || verifying}
            onClick={() => { setVerifying(true); onVerify(code); }}
          >
            {buttonLabel}
          </Btn>
          <AuthFooter onSignIn={onSignIn} onBack={onBack} backLabel="Back" onTerms={onTerms} onPrivacy={onPrivacy} />
        </div>
      </div>
    </div>
  );
}
