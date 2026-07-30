import React, { useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { EMOJI_CATEGORIES, matchesEmoji, type EmojiCategory, type EmojiEntry } from "./hs-emoji-data";
import { PopoverNotch } from "./hs-popover-notch";
import {
  CONTROL_CLASS, ControlStyles, FONT_BODY, FONT_EMOJI, PLACEHOLDER_CLASS,
  PlaceholderStyle, SUBTLE_BORDER, panelShell,
} from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Emoji Picker
   Popover opened by the formatting toolbar's emoji control.
   Search, sticky category headers, and a category nav along the
   bottom that jumps the scroller to a section.

   Emoji are plain unicode rendered with the platform emoji font —
   no sprite sheets and no emoji package. Dataset lives in
   hs-emoji-data.ts.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const DEFAULT_WIDTH   = 288;
const DEFAULT_COLUMNS = 5;    // derived from the section frame heights
const BODY_MAX_H      = 300;
const SEARCH_H        = 34;
const SEARCH_ICON     = 16;
const CELL_GAP        = 2;    // off-scale, nothing below --space-1 (4px)
const EMOJI_SIZE      = 23;
const NAV_H           = 30;
const NAV_EMOJI       = 16;
const NAV_IDLE_OPACITY = 0.7;
const SHELL_RADIUS    = 16;   // between --radius-3xl (14) and --radius-input (32)
const HEADER_SIZE     = 11;   // no --font-size-* token at 11px
const HEADER_TRACKING = 0.55;
const INPUT_SIZE      = 14;   // no --font-size-* token at 14px

// Popover shadow — deeper than any --shadow-* token so the panel clears
// the surface it floats over.
const SHELL_SHADOW = "0px 18px 50px rgba(0, 0, 0, 0.24)";

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = panelShell(SHELL_RADIUS, SHELL_SHADOW);

const searchRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-2, 8px)",
  padding: "var(--space-2-5, 10px) var(--space-3, 12px) var(--space-1-5, 6px)",
};

const searchInputStyle: React.CSSProperties = {
  boxSizing: "border-box",
  flex: "1 1 0",
  minWidth: 0,
  height: SEARCH_H,
  padding: "0 var(--space-3, 12px)",
  background: "var(--color-bg-editor, #f5f5f4)",
  border: "none",
  borderRadius: "var(--radius-xl, 10px)",
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: INPUT_SIZE,
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
};

const bodyStyle: React.CSSProperties = {
  maxHeight: BODY_MAX_H,
  overflowY: "auto",
  padding: "2px var(--space-2-5, 10px) var(--space-2, 8px)",
};

const headerStyle: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: 1,
  padding: "var(--space-2-5, 10px) var(--space-1, 4px) var(--space-1-5, 6px)",
  background: "var(--color-bg-main, #ffffff)",
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: HEADER_SIZE,
  fontWeight: "var(--font-weight-label-12-bd, 700)" as React.CSSProperties["fontWeight"],
  textTransform: "uppercase",
  letterSpacing: HEADER_TRACKING,
};

const cellBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  aspectRatio: "1 / 1",
  border: "none",
  borderRadius: "var(--radius-lg, 8px)",
  cursor: "pointer",
  padding: 0,
  fontFamily: FONT_EMOJI,
  fontSize: EMOJI_SIZE,
  lineHeight: 1,
  transition: "background 120ms ease-in-out",
};

const navRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: CELL_GAP,
  padding: "var(--space-1-5, 6px) var(--space-2, 8px)",
  background: "var(--color-bg-muted, #faf6f0)",
  borderTop: SUBTLE_BORDER,
};

const navBtnBase: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flex: "1 1 0",
  height: NAV_H,
  border: "none",
  borderRadius: "var(--radius-lg, 8px)",
  cursor: "pointer",
  padding: 0,
  fontFamily: FONT_EMOJI,
  fontSize: NAV_EMOJI,
  lineHeight: 1,
  transition: "background 120ms ease-in-out, opacity 120ms ease-in-out",
};

const emptyStyle: React.CSSProperties = {
  padding: "var(--space-6, 24px) var(--space-2, 8px)",
  textAlign: "center",
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-body-13, 13px)",
};

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export interface EmojiPickerProps {
  categories?: EmojiCategory[];
  /** Fired with the chosen emoji character and its dataset entry. */
  onSelect?: (char: string, entry: EmojiEntry) => void;
  /** Fired on Escape. */
  onClose?: () => void;
  columns?: number;
  width?: number | string;
  /** Max height of the scrolling body, excluding search row and category nav. */
  maxHeight?: number;
  searchPlaceholder?: string;
  autoFocusSearch?: boolean;
  /** Show the notch on the top edge. */
  arrow?: boolean;
  /** Distance in px from the left edge to the notch centre. Omit to centre it. */
  arrowOffset?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   EmojiPicker
═══════════════════════════════════════════════════════ */

export function EmojiPicker({
  categories = EMOJI_CATEGORIES,
  onSelect,
  onClose,
  columns = DEFAULT_COLUMNS,
  width = DEFAULT_WIDTH,
  maxHeight = BODY_MAX_H,
  searchPlaceholder = "Search",
  autoFocusSearch = false,
  arrow = true,
  arrowOffset,
  ariaLabel = "Emoji picker",
  style,
  className,
}: EmojiPickerProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [query, setQuery] = useState("");
  const [focusIdx, setFocusIdx] = useState(0);
  const [activeCat, setActiveCat] = useState(categories[0]?.id ?? "");

  /* Filtered categories, empty ones dropped so headers never orphan. */
  const visible = useMemo(
    () =>
      categories
        .map((c) => ({ ...c, emoji: c.emoji.filter((e) => matchesEmoji(e, query)) }))
        .filter((c) => c.emoji.length > 0),
    [categories, query],
  );

  /* Each cell carries its position in the flat left-to-right order, which drives
     the roving tabindex and arrow-key navigation across category boundaries. */
  const sections = useMemo(() => {
    let i = 0;
    return visible.map((c) => ({ ...c, cells: c.emoji.map((entry) => ({ entry, index: i++ })) }));
  }, [visible]);

  const cellCount = sections.reduce((n, s) => n + s.cells.length, 0);
  const roving = Math.min(focusIdx, Math.max(cellCount - 1, 0));

  const focusCell = (index: number) => {
    const next = Math.max(0, Math.min(index, cellCount - 1));
    setFocusIdx(next);
    bodyRef.current
      ?.querySelector<HTMLButtonElement>(`button[data-emoji-index="${next}"]`)
      ?.focus();
  };

  const handleGridKeys = (e: React.KeyboardEvent) => {
    const from = focusIdx;
    switch (e.key) {
      case "ArrowRight": e.preventDefault(); return focusCell(from + 1);
      case "ArrowLeft":  e.preventDefault(); return focusCell(from - 1);
      case "ArrowDown":  e.preventDefault(); return focusCell(from + columns);
      case "ArrowUp":    e.preventDefault(); return focusCell(from - columns);
      case "Home":       e.preventDefault(); return focusCell(0);
      case "End":        e.preventDefault(); return focusCell(cellCount - 1);
      default: return;
    }
  };

  /* Scroll-spy: the section whose header has passed the top of the scroller. */
  const handleScroll = () => {
    const body = bodyRef.current;
    if (!body) return;
    const top = body.scrollTop;
    let current = sections[0]?.id ?? "";
    for (const c of sections) {
      const el = sectionRefs.current[c.id];
      if (el && el.offsetTop - body.offsetTop <= top + 8) current = c.id;
    }
    setActiveCat(current);
  };

  const jumpTo = (id: string) => {
    const el = sectionRefs.current[id];
    const body = bodyRef.current;
    if (!el || !body) return;
    body.scrollTo({ top: el.offsetTop - body.offsetTop });
    setActiveCat(id);
  };

  const setQueryAndReset = (value: string) => {
    setQuery(value);
    setFocusIdx(0);
  };

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className={className}
      style={{ ...shellStyle, width, ...style }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {arrow && <PopoverNotch offset={arrowOffset} />}

      {/* ── Search ────────────────────────────────────────── */}
      <div style={searchRowStyle}>
        <Search size={SEARCH_ICON} strokeWidth={1.33} style={{ color: "var(--color-text-secondary, #6e6d6a)", flexShrink: 0 }} />
        <input
          type="search"
          value={query}
          onChange={(e) => setQueryAndReset(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label="Search emoji"
          autoFocus={autoFocusSearch}
          className={PLACEHOLDER_CLASS}
          style={searchInputStyle}
        />
        <PlaceholderStyle />
      <ControlStyles />
      </div>

      {/* ── Scrolling body ────────────────────────────────── */}
      <div ref={bodyRef} style={{ ...bodyStyle, maxHeight }} onScroll={handleScroll} onKeyDown={handleGridKeys}>
        {cellCount === 0 && <div style={emptyStyle}>No emoji match “{query.trim()}”.</div>}

        {sections.map((cat) => (
          <div key={cat.id} ref={(el) => { sectionRefs.current[cat.id] = el; }}>
            <div style={headerStyle}>{cat.label}</div>
            <div
              role="group"
              aria-label={cat.label}
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
                gap: CELL_GAP,
              }}
            >
              {cat.cells.map(({ entry, index }) => (
                <button
                  key={`${cat.id}-${index}`}
                  type="button"
                  className={CONTROL_CLASS}
                  data-emoji-index={index}
                  tabIndex={index === roving ? 0 : -1}
                  aria-label={entry.name}
                  title={entry.name}
                  onClick={() => onSelect?.(entry.char, entry)}
                  onFocus={() => setFocusIdx(index)}
                  style={cellBase}
                >
                  {entry.char}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Category nav ──────────────────────────────────── */}
      <div style={navRowStyle}>
        {categories.map((cat) => {
          const on = cat.id === activeCat;
          return (
            <button
              key={cat.id}
              type="button"
              className={CONTROL_CLASS}
              data-on={on ? "true" : undefined}
              aria-label={`Jump to ${cat.label}`}
              aria-current={on ? "true" : undefined}
              title={cat.label}
              onClick={() => jumpTo(cat.id)}
              style={{ ...navBtnBase, opacity: on ? 1 : NAV_IDLE_OPACITY }}
            >
              {cat.icon}
            </button>
          );
        })}
      </div>
    </div>
  );
}
