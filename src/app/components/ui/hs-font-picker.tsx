import React, { useRef, useState } from "react";
import { FILL_HOVER, FONT_BODY, panelShell } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Font Picker
   Dropdown opened by the formatting toolbar's font control. Each row
   previews the face in the face itself: an "Ag" swatch, the family
   name set in that family, and a plain-language description.

   Every family in FONT_OPTIONS is loaded in styles/fonts.css. Adding
   an option without adding the @import there makes its row preview in
   a fallback face — see the guard test in components.test.tsx.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const SHELL_PAD      = 6;
const ROW_GAP        = 11;   // off-scale, between --space-2-5 (10) and --space-3 (12)
const SWATCH         = 36;
const SWATCH_RADIUS  = 9;    // off-scale, between --radius-lg (8) and --radius-xl (10)
const SWATCH_SIZE    = 17;
const NAME_LEADING   = "17.25px";
const DESC_LEADING   = "14.4px";

// Panel shadow, tinted with the text-primary hue (36,36,35). No token matches.
const SHELL_SHADOW = "0px 14px 38px rgba(36, 36, 35, 0.22)";

// A third grey, between --color-text-secondary (#6e6d6a) and
// --color-text-disabled (#a9a8a4). No token carries it.
const DESC_COLOR = "#8A8A87";

// Selected row wash — the brand red at 7%.
const SELECTED_BG = "color-mix(in srgb, var(--color-brand-primary, #be1d2c) 7%, transparent)";

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = {
  ...panelShell("var(--radius-3xl, 14px)", SHELL_SHADOW),
  alignItems: "stretch",
  padding: SHELL_PAD,
  overflowY: "auto",
};

const rowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ROW_GAP,
  width: "100%",
  padding: "var(--space-2, 8px) var(--space-2-5, 10px)",
  border: "none",
  borderRadius: "var(--radius-xl, 10px)",
  background: "transparent",
  cursor: "pointer",
  textAlign: "left",
  transition: "background 120ms ease-in-out",
};

const swatchStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: SWATCH,
  height: SWATCH,
  borderRadius: SWATCH_RADIUS,
  fontSize: SWATCH_SIZE,
  lineHeight: 1,
};

const textColStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: 1,
  minWidth: 0,
};

const nameStyle: React.CSSProperties = {
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  fontSize: "var(--font-size-body-15, 15px)",
  fontWeight: "var(--font-weight-body-15, 400)" as React.CSSProperties["fontWeight"],
  lineHeight: NAME_LEADING,
};

const descStyle: React.CSSProperties = {
  color: DESC_COLOR,
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12, 12px)",
  fontWeight: "var(--font-weight-normal, 400)" as React.CSSProperties["fontWeight"],
  lineHeight: DESC_LEADING,
};

/* ═══════════════════════════════════════════════════════
   Font catalogue
═══════════════════════════════════════════════════════ */

export interface FontOption {
  /** Stable id used by `value` and reported by `onSelect`. */
  id: string;
  /** Display name, rendered in the face itself. */
  name: string;
  /** Plain-language character note, e.g. "Casual marker". */
  description: string;
  /** Full CSS stack applied to the card. */
  stack: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: "dancing-script",      name: "Dancing Script", description: "Flowing script",   stack: "'Dancing Script', cursive" },
  { id: "shadows-into-light",  name: "Shadows",        description: "Handwritten note", stack: "'Shadows Into Light', cursive" },
  { id: "caveat",              name: "Caveat",         description: "Casual marker",    stack: "'Caveat', cursive" },
  { id: "architects-daughter", name: "Architects",     description: "Blueprint hand",   stack: "'Architects Daughter', cursive" },
  { id: "kalam",               name: "Kalam",          description: "Relaxed pen",      stack: "'Kalam', cursive" },
  { id: "dm-sans",             name: "DM Sans",        description: "Clean & modern",   stack: "'DM Sans', system-ui, sans-serif" },
  { id: "georgia",             name: "Georgia",        description: "Classic serif",    stack: "Georgia, 'Times New Roman', serif" },
];

export const findFontOption = (id: string | undefined) => FONT_OPTIONS.find((f) => f.id === id);

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export interface FontPickerProps {
  fonts?: FontOption[];
  /** Id of the selected font. */
  value?: string;
  onSelect?: (id: string, font: FontOption) => void;
  /** Fired on Escape. */
  onClose?: () => void;
  /** Caps the list height and scrolls beyond it. */
  maxHeight?: number;
  width?: number | string;
  /** Sample text in the swatch. */
  sample?: string;
  ariaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   FontPicker
═══════════════════════════════════════════════════════ */

export function FontPicker({
  fonts = FONT_OPTIONS,
  value,
  onSelect,
  onClose,
  maxHeight,
  width,
  sample = "Ag",
  ariaLabel = "Choose a font",
  style,
  className,
}: FontPickerProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const selectedIndex = Math.max(fonts.findIndex((f) => f.id === value), 0);
  const [focusIndex, setFocusIndex] = useState(selectedIndex);
  const roving = Math.min(focusIndex, Math.max(fonts.length - 1, 0));

  const focusRow = (index: number) => {
    const next = Math.max(0, Math.min(index, fonts.length - 1));
    setFocusIndex(next);
    rootRef.current?.querySelector<HTMLButtonElement>(`button[data-font-index="${next}"]`)?.focus();
  };

  /* WAI-ARIA listbox keys: arrows move the active option, Home/End jump. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown": e.preventDefault(); return focusRow(focusIndex + 1);
      case "ArrowUp":   e.preventDefault(); return focusRow(focusIndex - 1);
      case "Home":      e.preventDefault(); return focusRow(0);
      case "End":       e.preventDefault(); return focusRow(fonts.length - 1);
      case "Escape":
        if (onClose) {
          e.stopPropagation();
          onClose();
        }
        return;
      default: return;
    }
  };

  return (
    <div
      ref={rootRef}
      role="listbox"
      aria-label={ariaLabel}
      className={className}
      style={{ ...shellStyle, width, maxHeight, ...style }}
      onKeyDown={handleKeyDown}
    >
      {fonts.map((font, index) => {
        const on = font.id === value;
        const hot = hovered === font.id;
        return (
          <button
            key={font.id}
            type="button"
            role="option"
            aria-selected={on}
            data-font-index={index}
            tabIndex={index === roving ? 0 : -1}
            title={`${font.name} — ${font.description}`}
            onClick={() => onSelect?.(font.id, font)}
            onMouseEnter={() => setHovered(font.id)}
            onMouseLeave={() => setHovered((h) => (h === font.id ? null : h))}
            style={{
              ...rowStyle,
              background: on ? SELECTED_BG : hot ? FILL_HOVER : "transparent",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                ...swatchStyle,
                fontFamily: font.stack,
                background: on
                  ? "var(--color-brand-primary, #be1d2c)"
                  : "var(--color-bg-editor, #f5f5f4)",
                color: on
                  ? "var(--color-text-on-primary, #ffffff)"
                  : "var(--color-text-primary, #242423)",
              }}
            >
              {sample}
            </span>

            <span style={textColStyle}>
              <span
                style={{
                  ...nameStyle,
                  fontFamily: font.stack,
                  color: on
                    ? "var(--color-brand-primary, #be1d2c)"
                    : "var(--color-text-primary, #242423)",
                }}
              >
                {font.name}
              </span>
              <span style={descStyle}>{font.description}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
