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
    // Panels carry a fixed design width; without this the 382px sheets
    // overflow a 320px viewport. Callers may still narrow it further.
    maxWidth: "calc(100vw - var(--space-4, 16px) * 2)",
  };
}

/* ── Interaction states ─────────────────────────────────────────────
   Inline styles cannot express pseudo-classes, so every interactive
   control opts into one shared stylesheet instead of hand-rolling hover
   in JS. That is the only way to get :active and :focus-visible, and it
   keeps hover, press and focus on the interaction tokens.

   Tag a control with CONTROL_CLASS and render <ControlStyles /> once.
   Leave its resting `background` unset — an inline background would win
   over these rules and kill the states.

     data-on="true"   the control's formatting is applied (toolbar toggles)
     :disabled        dimmed and not interactive
──────────────────────────────────────────────────────────────────── */

export const CONTROL_CLASS = "hs-ctl";

const CONTROL_CSS = `
.${CONTROL_CLASS} { transition: background 120ms ease-in-out; }
.${CONTROL_CLASS}:hover:not(:disabled) { background: var(--color-state-hover, rgba(36, 36, 35, 0.06)); }
.${CONTROL_CLASS}:active:not(:disabled) { background: var(--color-state-pressed, rgba(36, 36, 35, 0.08)); }
.${CONTROL_CLASS}:focus-visible { outline: 2px solid var(--color-ring); outline-offset: 2px; }
.${CONTROL_CLASS}[data-on="true"] { background: var(--color-element-subtle, rgba(36, 36, 35, 0.10)); }
.${CONTROL_CLASS}[data-on="true"]:active { background: var(--color-state-pressed, rgba(36, 36, 35, 0.08)); }
.${CONTROL_CLASS}:disabled { opacity: 0.5; cursor: not-allowed; }
`;

export function ControlStyles() {
  return <style>{CONTROL_CSS}</style>;
}

/* ── The wide form panel ────────────────────────────────────────────
   SocialHandles and LinkBtnEditor are the same 382px sheet: 342px of
   content inside 20px gutters, an 18px radius, and the same lifted
   shadow. Only the row gap differs, so that is the one parameter.
──────────────────────────────────────────────────────────────────── */

export const FORM_PANEL_CONTENT_W = 342;
export const FORM_PANEL_PAD_X = 20;
export const FORM_PANEL_WIDTH = FORM_PANEL_CONTENT_W + FORM_PANEL_PAD_X * 2;   // 382

/** 18px sits between --radius-3xl (14) and --radius-button (25). */
const FORM_PANEL_RADIUS = 18;

/** Tinted with the text-primary hue (36,36,35). No --shadow-* token matches. */
const FORM_PANEL_SHADOW = "0px 14px 40px rgba(36, 36, 35, 0.20)";

export function formPanelShell(gap: number): React.CSSProperties {
  return {
    ...panelShell(FORM_PANEL_RADIUS, FORM_PANEL_SHADOW),
    alignItems: "stretch",
    gap,
    padding: `var(--space-4, 16px) ${FORM_PANEL_PAD_X}px var(--space-5, 20px)`,
  };
}

/** Title on the left, close button hard right. */
export const panelHeaderStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "var(--space-3, 12px)",
};

/** 46px pill input — the field both wide panels use. */
export const pillFieldStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: 46,
  padding: "0 var(--space-4, 16px)",
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-full, 999px)",
  border: SUBTLE_BORDER,
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: 14,
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
};

/** Full-width 44px primary commit action, and its top spacing. */
export const panelCtaStyle: React.CSSProperties = {
  width: "100%",
  height: 44,
  borderRadius: "var(--radius-button, 25px)",
  fontSize: 15,
};

export const panelCtaWrapStyle: React.CSSProperties = { paddingTop: "var(--space-1-5, 6px)" };

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

/** Circular icon button — panel close, row remove. 30×30 per the designs.
 *  Its resting fill is the hover token by design, so it sits a step above the
 *  panel; pair with CONTROL_CLASS so press and focus still register. */
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
