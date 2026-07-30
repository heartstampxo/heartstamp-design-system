import React, { useMemo, useRef, useState } from "react";
import {
  ALargeSmall, AlignCenter, AlignLeft, AlignRight, ChevronDown,
  Link, Link2, Share2, Smile,
} from "lucide-react";
import { CONTROL_CLASS, ControlStyles, FILL_ACTIVE, FONT_BODY, SUBTLE_BORDER } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Formatting Toolbar
   Text formatting controls for rich-text surfaces. Data-driven:
   pass `groups` of items and dividers are rendered between them.

   Stateful via a single pair of props — `active` holds the ids that
   are currently on, `onAction` fires with the id that was pressed.
   Follows the WAI-ARIA toolbar pattern (roving tabindex, arrow keys).
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const BTN_SIZE     = 38;
const FONT_BTN_W   = 96;
const DIVIDER_H    = 22;
const SWATCH_SIZE  = 17;
const ICON_SIZE    = 17;
const FONT_ICON    = 18;   // the text-size glyph is drawn 1px larger
const CHEVRON_SIZE = 15;
const SHELL_PAD    = 5;    // off the --space-* scale (between 4 and 6)
const ITEM_GAP     = 2;    // off-scale, nothing below --space-1 (4px)
const DIVIDER_PAD  = 3;    // off-scale
const FONT_PAD_L   = 11;   // off-scale
const PILL_GAP     = 7;    // off-scale, between --space-1-5 (6) and --space-2 (8)
const LABEL_SIZE   = 14;   // no --font-size-* token at 14px
const CHEVRON_DIM  = 0.45; // chevron is dimmed relative to the label

// Two-layer lifted shadow tinted with the text-primary hue (36,36,35) rather
// than pure black. No --shadow-* token matches.
const SHELL_SHADOW =
  "0px 2px 6px rgba(36, 36, 35, 0.08), 0px 10px 30px rgba(36, 36, 35, 0.18)";

// The swatch ring is a touch stronger than --color-element-subtle (0.10) so it
// stays visible against a light fill. No token at 0.15.
const SWATCH_RING = "1px solid rgba(36, 36, 35, 0.15)";

// B / I / U / S are conventionally set in a serif face. Georgia is not in the
// font tokens — it is a deliberate, self-contained choice for these glyphs.
const FONT_GLYPH = "Georgia, 'Times New Roman', serif";

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = {
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  gap: ITEM_GAP,
  padding: SHELL_PAD,
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-3xl, 14px)",
  boxShadow: SHELL_SHADOW,
  border: SUBTLE_BORDER,
  maxWidth: "100%",
  overflowX: "auto",
};

// Shared reset for every control: the design has no resting fill, so the
// background is driven per-state below.
const controlBase: React.CSSProperties = {
  boxSizing: "border-box",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  height: BTN_SIZE,
  border: "none",
  background: "transparent",
  color: "var(--color-text-primary, #242423)",
  cursor: "pointer",
  padding: 0,
  flexShrink: 0,
  transition: "background 120ms ease-in-out",
};

const iconBtnStyle: React.CSSProperties = {
  ...controlBase,
  width: BTN_SIZE,
  borderRadius: "var(--radius-xl, 10px)",
};

const fontBtnStyle: React.CSSProperties = {
  ...controlBase,
  width: FONT_BTN_W,
  minWidth: FONT_BTN_W,
  justifyContent: "space-between",
  paddingLeft: FONT_PAD_L,
  paddingRight: "var(--space-2, 8px)",
  borderRadius: "var(--radius-xl, 10px)",
};

const pillStyle: React.CSSProperties = {
  ...controlBase,
  gap: PILL_GAP,
  paddingLeft: "var(--space-3-5, 14px)",
  paddingRight: "var(--space-3-5, 14px)",
  borderRadius: "var(--radius-button, 25px)",
};

const labelStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: LABEL_SIZE,
  fontWeight: 600,
  lineHeight: 1,
  whiteSpace: "nowrap",
};

const fontLabelStyle: React.CSSProperties = {
  ...labelStyle,
  overflow: "hidden",
  textOverflow: "ellipsis",
};

const glyphStyle: React.CSSProperties = {
  fontFamily: FONT_GLYPH,
  fontSize: "var(--font-size-label-15, 15px)",
  fontWeight: 700,
  lineHeight: 1,
};

const dividerWrapStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  paddingLeft: DIVIDER_PAD,
  paddingRight: DIVIDER_PAD,
  flexShrink: 0,
};

const dividerStyle: React.CSSProperties = {
  width: 1,
  height: DIVIDER_H,
  background: FILL_ACTIVE,
};

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export type FmtItem =
  /** Font family trigger — label plus a chevron, opens the host app's picker. */
  | { kind: "font"; id: string; value: string; label?: string }
  /** Icon-only toggle. */
  | { kind: "icon"; id: string; icon: React.ReactNode; label: string }
  /** Letterform toggle — B / I / U / S. */
  | { kind: "glyph"; id: string; glyph: string; label: string; decoration?: "underline" | "line-through" }
  /** Current text colour, shown as a filled dot. */
  | { kind: "swatch"; id: string; color: string; label: string }
  /** Labelled action with an optional leading icon. Set `toggle` if it holds an on/off state. */
  | { kind: "pill"; id: string; label: string; icon?: React.ReactNode; toggle?: boolean };

export interface FmtToolbarProps {
  /** Item groups, rendered left to right with a divider between each group. */
  groups?: FmtItem[][];
  /** Ids of the items whose formatting is currently applied. */
  active?: string[];
  /**
   * Fired with the id of the pressed item, plus the button element it fired
   * from — anchor popovers (font picker, colour, emoji) to that element.
   */
  onAction?: (id: string, trigger: HTMLButtonElement) => void;
  /** Overrides the `value` of every `font` item — for a font name that changes at runtime. */
  fontValue?: string;
  /** Accessible name for the toolbar. */
  ariaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   Default configuration — mirrors the Figma layout
═══════════════════════════════════════════════════════ */

const icon = (Icon: typeof AlignLeft, size = ICON_SIZE) => <Icon size={size} strokeWidth={1.35} />;

export const FMT_TOOLBAR_GROUPS: FmtItem[][] = [
  [
    { kind: "font", id: "font-family", value: "Kalam" },
    { kind: "icon", id: "font-size", icon: icon(ALargeSmall, FONT_ICON), label: "Text size" },
  ],
  [
    { kind: "glyph", id: "bold",          glyph: "B", label: "Bold" },
    { kind: "glyph", id: "italic",        glyph: "I", label: "Italic" },
    { kind: "glyph", id: "underline",     glyph: "U", label: "Underline", decoration: "underline" },
    { kind: "glyph", id: "strikethrough", glyph: "S", label: "Strikethrough", decoration: "line-through" },
    { kind: "swatch", id: "text-color", color: "var(--color-text-primary, #242423)", label: "Text colour" },
  ],
  [
    { kind: "icon", id: "align-left",   icon: icon(AlignLeft),   label: "Align left" },
    { kind: "icon", id: "align-center", icon: icon(AlignCenter), label: "Align centre" },
    { kind: "icon", id: "align-right",  icon: icon(AlignRight),  label: "Align right" },
  ],
  [
    { kind: "icon", id: "link",  icon: icon(Link),  label: "Insert link" },
    { kind: "icon", id: "emoji", icon: icon(Smile), label: "Insert emoji" },
  ],
  [
    { kind: "pill", id: "handles",  icon: icon(Share2), label: "Handles" },
    { kind: "pill", id: "link-btn", icon: icon(Link2),  label: "Link Btn" },
  ],
];

/* ═══════════════════════════════════════════════════════
   FmtToolbar
═══════════════════════════════════════════════════════ */

export function FmtToolbar({
  groups = FMT_TOOLBAR_GROUPS,
  active,
  onAction,
  fontValue,
  ariaLabel = "Text formatting",
  style,
  className,
}: FmtToolbarProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [focusIndex, setFocusIndex] = useState(0);

  const isActive = (id: string) => !!active?.includes(id);

  // Flat left-to-right order, so the roving tabindex survives regrouping.
  // Memoised: this component re-renders on every hover, and the map would
  // otherwise be rebuilt each time.
  const order = useMemo(
    () => new Map(groups.flat().map((item, i) => [item.id, i] as const)),
    [groups],
  );
  const rovingIndex = Math.min(focusIndex, Math.max(order.size - 1, 0));

  /* WAI-ARIA toolbar: one tab stop, arrows move between controls. */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    const jump = e.key === "Home" ? 0 : e.key === "End" ? -1 : null;
    if (!step && jump === null) return;

    const btns = Array.from(rootRef.current?.querySelectorAll<HTMLButtonElement>("button[data-fmt]") ?? []);
    if (!btns.length) return;
    e.preventDefault();

    const from = btns.findIndex((b) => b === document.activeElement);
    const next = jump !== null
      ? (jump === 0 ? 0 : btns.length - 1)
      : (Math.max(from, 0) + step + btns.length) % btns.length;

    btns[next].focus();
    setFocusIndex(next);
  };

  const renderItem = (item: FmtItem) => {
    const on = isActive(item.id);
    const shared = {
      "data-fmt": item.kind,
      "data-on": on ? "true" : undefined,
      className: CONTROL_CLASS,
      key: item.id,
      type: "button" as const,
      tabIndex: order.get(item.id) === rovingIndex ? 0 : -1,
      onClick: (e: React.MouseEvent<HTMLButtonElement>) => onAction?.(item.id, e.currentTarget),
    };

    switch (item.kind) {
      case "font":
        return (
          <button
            {...shared}
            aria-label={item.label ?? "Font family"}
            aria-haspopup="listbox"
            style={fontBtnStyle}
          >
            <span style={fontLabelStyle}>{fontValue ?? item.value}</span>
            <ChevronDown size={CHEVRON_SIZE} strokeWidth={1.25} style={{ opacity: CHEVRON_DIM, flexShrink: 0 }} />
          </button>
        );

      case "glyph":
        return (
          <button
            {...shared}
            aria-label={item.label}
            aria-pressed={on}
            style={iconBtnStyle}
          >
            <span style={item.decoration ? { ...glyphStyle, textDecoration: item.decoration } : glyphStyle}>
              {item.glyph}
            </span>
          </button>
        );

      case "swatch":
        return (
          <button
            {...shared}
            aria-label={item.label}
            style={iconBtnStyle}
          >
            <span
              style={{
                width: SWATCH_SIZE,
                height: SWATCH_SIZE,
                borderRadius: "var(--radius-full, 999px)",
                background: item.color,
                border: SWATCH_RING,
              }}
            />
          </button>
        );

      case "pill":
        return (
          <button
            {...shared}
            aria-label={item.label}
            aria-pressed={item.toggle ? on : undefined}
            style={pillStyle}
          >
            {item.icon}
            <span style={labelStyle}>{item.label}</span>
          </button>
        );

      case "icon":
      default:
        return (
          <button
            {...shared}
            aria-label={item.label}
            aria-pressed={on}
            style={iconBtnStyle}
          >
            {item.icon}
          </button>
        );
    }
  };

  return (
    <div
      ref={rootRef}
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={className}
      style={style ? { ...shellStyle, ...style } : shellStyle}
      onKeyDown={handleKeyDown}
    >
      <ControlStyles />
      {groups.map((group, gi) => (
        <React.Fragment key={gi}>
          {gi > 0 && (
            <span style={dividerWrapStyle}>
              <span role="separator" aria-orientation="vertical" style={dividerStyle} />
            </span>
          )}
          {group.map(renderItem)}
        </React.Fragment>
      ))}
    </div>
  );
}
