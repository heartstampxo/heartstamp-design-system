import React from "react";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Popover kit

   Shared chrome for the floating panels the formatting toolbar opens
   (emoji picker, link editor, link button editor, social handles,
   font picker) and the coach tip card.

   Only the pieces that are genuinely identical live here. Each panel
   keeps its own Figma-derived geometry — radii, paddings and shadows
   differ per design and are documented at their point of use.
═══════════════════════════════════════════════════════ */

/* ── Type stacks ────────────────────────────────────────────────── */

export const FONT_BODY = "var(--font-family-body, 'DM Sans', system-ui, sans-serif)";
export const FONT_HEADING = "var(--font-family-heading, 'Stack Sans Text', system-ui, sans-serif)";

/** Emoji must come from the platform emoji font, or some platforms
 *  substitute monochrome glyphs for colour ones. */
export const FONT_EMOJI =
  '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", "Segoe UI Symbol", sans-serif';

/* ── Surfaces and interaction fills ─────────────────────────────── */

/** Hairline that every panel and field shares.
 *
 *  Figma exports these as a 1px inset outline (`outlineOffset: -1px`); a border
 *  is the layout-safe equivalent and clips to the border radius reliably. */
export const SUBTLE_BORDER = "1px solid var(--color-element-subtle, rgba(36, 36, 35, 0.10))";

/** Pointer hover / keyboard focus wash. */
export const FILL_HOVER = "var(--color-state-hover, rgba(36, 36, 35, 0.06))";

/** The stronger fill for a control whose formatting is applied. */
export const FILL_ACTIVE = "var(--color-element-subtle, rgba(36, 36, 35, 0.10))";

/** Placeholder text — the "Disabled / Placeholder" role in theme.ts. */
export const PLACEHOLDER_COLOR = "var(--color-text-disabled, #a9a8a4)";

/**
 * Base for a floating panel. Callers pass their own radius and shadow, since
 * both vary per design, and spread their own layout on top.
 */
export function panelShell(radius: number | string, shadow: string): React.CSSProperties {
  return {
    boxSizing: "border-box",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    background: "var(--color-bg-main, #ffffff)",
    borderRadius: radius,
    boxShadow: shadow,
    border: SUBTLE_BORDER,
  };
}

/* ── Shared text roles ──────────────────────────────────────────── */

/** Panel heading — 19px in the heading face. */
export const panelTitleStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_HEADING,
  fontSize: 19,
  fontWeight: 600,
};

/** Explanatory copy under a panel heading. */
export const panelDescStyle: React.CSSProperties = {
  margin: 0,
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-body-13, 13px)",
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
  lineHeight: "19.5px",
};

/** Circular icon button — panel close, row remove. 30×30 per the designs. */
export const roundIconBtnStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 30,
  height: 30,
  border: "none",
  borderRadius: "var(--radius-full, 999px)",
  background: FILL_HOVER,
  cursor: "pointer",
  padding: 0,
};

/* ── Placeholder styling ────────────────────────────────────────────
   ::placeholder cannot be set inline, so panels tag their inputs with
   PLACEHOLDER_CLASS and render <PlaceholderStyle /> once. Every panel emits the
   same declaration, so repeated tags are idempotent.
──────────────────────────────────────────────────────────────────── */

export const PLACEHOLDER_CLASS = "hs-placeholder";

const PLACEHOLDER_CSS =
  `.${PLACEHOLDER_CLASS}::placeholder { color: ${PLACEHOLDER_COLOR}; opacity: 1; }`;

export function PlaceholderStyle() {
  return <style>{PLACEHOLDER_CSS}</style>;
}
