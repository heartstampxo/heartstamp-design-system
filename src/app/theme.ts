/* ═══════════════════════════════════════════════════════════
   HeartStamp Design System — Runtime Theme
   ─────────────────────────────────────────────────────────
   This file owns every JS-level CSS-variable map and token
   table. Do NOT import this from component files — it is
   intentionally app-boundary config only.

   Layout
   ──────
   SHARED_TOKENS       radius / shadow / button / typo / input
                       (same values both modes — defined once)
   DARK_THEME          app-root dark CSS-var map
   LIGHT_THEME         app-root light CSS-var map
   PREVIEW_DARK_VARS   mini dark-override for the Preview panel
   LIGHT_TOKENS        color table for the Color-tokens doc page
   DARK_TOKENS         color table for the Color-tokens doc page
   TOKEN_VARIABLE_NAMES CSS var name map (used to build CSS snippet)
   GROUP_DESCRIPTIONS  prose labels for each token group
═══════════════════════════════════════════════════════════ */

/** Tokens that are identical in both light and dark modes. */
const SHARED_TOKENS: Record<string, string> = {
  /* ── Radius ────────────────────────────────────────────── */
  "--radius-none":   "0px",
  "--radius-xs":     "4px",
  "--radius-sm":     "6px",
  "--radius-md":     "7px",
  "--radius-lg":     "8px",
  "--radius-xl":     "10px",
  "--radius-2xl":    "12px",
  "--radius-3xl":    "14px",
  "--radius-button": "25px",
  "--radius-input":  "32px",
  "--radius-full":   "999px",
  /* ── Shadow ─────────────────────────────────────────────── */
  "--shadow-xs":  "0 1px 3px rgba(0,0,0,0.12)",
  "--shadow-sm":  "0 1px 3px rgba(0,0,0,0.20)",
  "--shadow-md":  "0 4px 12px rgba(0,0,0,0.20)",
  "--shadow-lg":  "0 8px 24px rgba(0,0,0,0.15)",
  "--shadow-xl":  "0 8px 32px rgba(0,0,0,0.15)",
  "--shadow-2xl": "0 24px 64px rgba(0,0,0,0.30)",
  /* ── Button ─────────────────────────────────────────────── */
  "--btn-padding-sm":      "0px 12px",
  "--btn-padding-default": "0px 16px",
  "--btn-padding-lg":      "0px 20px",
  "--btn-padding-icon-sm": "10px",
  "--btn-padding-icon":    "12px",
  "--btn-padding-icon-lg": "14px",
  "--btn-gap":             "6px",
  "--lucide-stroke-width": "2",
  "--font-size-btn-sm":    "12px",
  "--font-size-btn":       "13px",
  "--font-size-btn-lg":    "15px",
  "--font-weight-btn":     "500",
  /* ── Typography ─────────────────────────────────────────── */
  "--font-family-heading":        "'Stack Sans Text', 'Instrument Sans', system-ui, sans-serif",
  "--font-family-body":           "'DM Sans', system-ui, sans-serif",
  "--font-family-mono":           "ui-monospace, 'Cascadia Code', monospace",
  "--font-size-h1":               "56px",
  "--font-weight-h1":             "700",
  "--letter-spacing-h1":          "0em",
  "--font-size-h2":               "40px",
  "--font-weight-h2":             "600",
  "--letter-spacing-h2":          "0em",
  "--font-size-h3":               "36px",
  "--font-weight-h3":             "400",
  "--letter-spacing-h3":          "-0.04em",
  "--font-size-h4":               "20px",
  "--font-weight-h4":             "400",
  "--letter-spacing-h4":          "-0.02em",
  "--font-size-h5":               "18px",
  "--font-weight-h5":             "400",
  "--letter-spacing-h5":          "0em",
  "--font-size-subheadline":      "24px",
  "--font-weight-subheadline":    "300",
  "--letter-spacing-subheadline": "0em",
  "--font-size-body-15":          "15px",
  "--font-weight-body-15":        "400",
  "--font-size-label-15":         "15px",
  "--font-weight-label-15":       "500",
  "--font-size-label-sb-15":      "15px",
  "--font-weight-label-sb-15":    "600",
  "--font-size-label-12":         "12px",
  "--font-weight-label-12":       "500",
  "--font-size-body-13":          "13px",
  "--font-weight-body-13":        "400",
  /* ── Input ──────────────────────────────────────────────── */
  "--inp-padding":          "10px 12px",
  "--font-size-inp":        "15px",
  "--inp-opacity-disabled": "0.5",
};

/* ─── Dark mode app-root token map ─────────────────────────── */
export const DARK_THEME: Record<string, string> = {
  "--bg":                "#141414",
  "--fg":                "#f5f5f4",
  "--muted":             "#1e1d1b",
  "--muted-fg":          "#c4c3c1",
  "--border":            "rgba(245,245,244,0.13)",
  "--accent":            "#cf2737",
  "--accent-subtle":     "rgba(207,39,55,0.12)",
  "--accent-hover":      "#d93545",
  "--accent-pressed":    "#b92331",
  "--secondary":         "#f5f5f4",
  "--secondary-subtle":  "rgba(245,245,244,0.13)",
  "--secondary-hover":   "#e9e9e7",
  "--secondary-pressed": "#ddddda",
  "--text-on-primary":   "#f8f8f7",
  "--text-on-secondary": "#141414",
  "--text-disabled":     "#7a7a77",
  "--bg-input":          "rgba(255,255,255,0.0325)",
  "--bg-menus":          "#1c1c1c",
  "--bg-editor":         "#1f1f1f",
  "--state-hover":            "rgba(245,245,244,0.08)",
  "--state-pressed":          "rgba(245,245,244,0.10)",
  "--state-error":            "#f54051",
  "--link":                   "#f54051",
  "--heart":                  "#eb7a85",
  "--color-element-disabled": "rgba(245,245,244,0.09)",
  /* ── Semantic --color-* aliases (match TOKEN_VARIABLE_NAMES) ── */
  "--color-text-primary":          "#f5f5f4",
  "--color-text-secondary":        "#c4c3c1",
  "--color-text-disabled":         "#7a7a77",
  "--color-text-on-primary":       "#f8f8f7",
  "--color-text-on-secondary":     "#141414",
  "--color-bg-main":               "#141414",
  "--color-bg-muted":              "#1e1d1b",
  "--color-bg-menus":              "#1c1c1c",
  "--color-bg-input":              "rgba(255,255,255,0.0325)",
  "--color-bg-editor":             "#1f1f1f",
  "--color-brand-primary":         "#cf2737",
  "--color-brand-primary-dim":     "rgba(207,39,55,0.12)",
  "--color-brand-primary-hover":   "#d93545",
  "--color-brand-primary-pressed": "#b92331",
  "--color-brand-secondary":       "#f5f5f4",
  "--color-brand-secondary-dim":   "rgba(245,245,244,0.08)",
  "--color-brand-secondary-hover":   "#e9e9e7",
  "--color-brand-secondary-pressed": "#ddddda",
  "--color-brand-lockup-heart":    "#eb7a85",
  "--color-element-subtle":        "rgba(245,245,244,0.13)",
  "--color-element-link":          "#f54051",
  "--color-state-hover":           "rgba(245,245,244,0.08)",
  "--color-state-pressed":         "rgba(245,245,244,0.10)",
  "--color-state-error":           "#f54051",
  /* Secondary-ghost hover – 12% bg / 15% border (dark) */
  "--btn-secondary-ghost-hover-bg":  "rgba(245,245,244,0.12)",
  "--btn-secondary-ghost-hover-bdr": "rgba(245,245,244,0.15)",
  ...SHARED_TOKENS,
};

/* ─── Light mode app-root token map ────────────────────────── */
export const LIGHT_THEME: Record<string, string> = {
  "--bg":                "#ffffff",
  "--fg":                "#242423",
  "--muted":             "rgba(36,36,35,0.10)",
  "--muted-fg":          "#6e6d6a",
  "--border":            "rgba(36,36,35,0.1)",
  "--accent":            "#be1d2c",
  "--accent-subtle":     "rgba(190,29,44,0.08)",
  "--accent-hover":      "#d42031",
  "--accent-pressed":    "#a81a27",
  "--secondary":         "#242423",
  "--secondary-subtle":  "rgba(36,36,35,0.10)",
  "--secondary-hover":   "#313130",
  "--secondary-pressed": "#171717",
  "--text-on-primary":   "#ffffff",
  "--text-on-secondary": "#ffffff",
  "--text-disabled":     "#a9a8a4",
  "--bg-input":          "#ffffff",
  "--bg-menus":          "#ffffff",
  "--bg-editor":         "#f5f5f4",
  "--state-hover":            "rgba(36,36,35,0.06)",
  "--state-pressed":          "rgba(36,36,35,0.08)",
  "--state-error":            "#be1d2c",
  "--link":                   "#be1d2c",
  "--heart":                  "#f5bdc2",
  "--color-element-disabled": "rgba(36,36,35,0.06)",
  /* ── Semantic --color-* aliases (match TOKEN_VARIABLE_NAMES) ── */
  "--color-text-primary":          "#242423",
  "--color-text-secondary":        "#6e6d6a",
  "--color-text-disabled":         "#a9a8a4",
  "--color-text-on-primary":       "#ffffff",
  "--color-text-on-secondary":     "#ffffff",
  "--color-bg-main":               "#ffffff",
  "--color-bg-muted":              "#faf6f0",
  "--color-bg-menus":              "#ffffff",
  "--color-bg-input":              "#ffffff",
  "--color-bg-editor":             "#f5f5f4",
  "--color-brand-primary":         "#be1d2c",
  "--color-brand-primary-dim":     "rgba(190,29,44,0.08)",
  "--color-brand-primary-hover":   "#d42031",
  "--color-brand-primary-pressed": "#a81a27",
  "--color-brand-secondary":       "#242423",
  "--color-brand-secondary-dim":   "rgba(36,36,35,0.06)",
  "--color-brand-secondary-hover":   "#313130",
  "--color-brand-secondary-pressed": "#171717",
  "--color-brand-lockup-heart":    "#f5bdc2",
  "--color-element-subtle":        "rgba(36,36,35,0.10)",
  "--color-element-link":          "#be1d2c",
  "--color-state-hover":           "rgba(36,36,35,0.06)",
  "--color-state-pressed":         "rgba(36,36,35,0.08)",
  "--color-state-error":           "#be1d2c",
  /* Secondary-ghost hover – 12% bg / 15% border (light) */
  "--btn-secondary-ghost-hover-bg":  "rgba(36,36,35,0.12)",
  "--btn-secondary-ghost-hover-bdr": "rgba(36,36,35,0.15)",
  ...SHARED_TOKENS,
};

/* ─── Preview panel dark-override ──────────────────────────── */
/** Injected as inline style on the Preview container when its
 *  local dark-bg toggle is ON. Without this, CSS vars resolve
 *  from the app-level light theme, making outline/ghost text
 *  and borders invisible on the dark preview background. */
export const PREVIEW_DARK_VARS: Record<string, string> = {
  ...DARK_THEME,
};

/* ═══════════════════════════════════════════════════════════
   Color token tables — used by the Color Tokens docs page
═══════════════════════════════════════════════════════════ */

export const LIGHT_TOKENS: Record<string, Record<string, string>> = {
  Text: {
    "Primary":                "#242423",
    "Secondary":              "#6e6d6a",
    "Disabled / Placeholder": "#a9a8a4",
    "On Primary":             "#ffffff",
    "On Secondary":           "#ffffff",
  },
  Background: {
    "Main":   "#ffffff",
    "Muted":  "#faf6f0",
    "Menus":  "#ffffff",
    "Input":  "#ffffff",
    "Editor": "#f5f5f4",
  },
  Brand: {
    "Primary":           "#be1d2c",
    "Primary Dim":       "rgba(190, 29, 44, 0.08)",
    "Primary Hover":     "#d42031",
    "Primary Pressed":   "#a81a27",
    "Secondary":         "#242423",
    "Secondary Dim":     "rgba(36, 36, 35, 0.06)",
    "Secondary Hover":   "#313130",
    "Secondary Pressed": "#171717",
    "Lockup Heart":      "#f5bdc2",
  },
  Element: {
    "Subtle":   "rgba(36, 36, 35, 0.10)",
    "Disabled": "rgba(36, 36, 35, 0.06)",
    "Link":     "#be1d2c",
  },
  States: {
    "Hover":   "rgba(36, 36, 35, 0.06)",
    "Pressed": "rgba(36, 36, 35, 0.08)",
    "Error":   "#be1d2c",
  },
};

export const DARK_TOKENS: Record<string, Record<string, string>> = {
  Text: {
    "Primary":                "#f5f5f4",
    "Secondary":              "#c4c3c1",
    "Disabled / Placeholder": "#7a7a77",
    "On Primary":             "#f8f8f7",
    "On Secondary":           "#141414",
  },
  Background: {
    "Main":   "#141414",
    "Muted":  "#1e1d1b",
    "Menus":  "#1c1c1c",
    "Input":  "rgba(255, 255, 255, 0.0325)",
    "Editor": "#1f1f1f",
  },
  Brand: {
    "Primary":           "#cf2737",
    "Primary Dim":       "rgba(207, 39, 55, 0.12)",
    "Primary Hover":     "#d93545",
    "Primary Pressed":   "#b92331",
    "Secondary":         "#f5f5f4",
    "Secondary Dim":     "rgba(245, 245, 244, 0.08)",
    "Secondary Hover":   "#e9e9e7",
    "Secondary Pressed": "#ddddda",
    "Lockup Heart":      "#eb7a85",
  },
  Element: {
    "Subtle":   "rgba(245, 245, 244, 0.13)",
    "Disabled": "rgba(245, 245, 244, 0.09)",
    "Link":     "#f54051",
  },
  States: {
    "Hover":   "rgba(245, 245, 244, 0.08)",
    "Pressed": "rgba(245, 245, 244, 0.10)",
    "Error":   "#f54051",
  },
};

export const TOKEN_VARIABLE_NAMES: Record<string, Record<string, string>> = {
  Text: {
    "Primary":                "--color-text-primary",
    "Secondary":              "--color-text-secondary",
    "Disabled / Placeholder": "--color-text-disabled",
    "On Primary":             "--color-text-on-primary",
    "On Secondary":           "--color-text-on-secondary",
  },
  Background: {
    "Main":   "--color-bg-main",
    "Muted":  "--color-bg-muted",
    "Menus":  "--color-bg-menus",
    "Input":  "--color-bg-input",
    "Editor": "--color-bg-editor",
  },
  Brand: {
    "Primary":           "--color-brand-primary",
    "Primary Dim":       "--color-brand-primary-dim",
    "Primary Hover":     "--color-brand-primary-hover",
    "Primary Pressed":   "--color-brand-primary-pressed",
    "Secondary":         "--color-brand-secondary",
    "Secondary Dim":     "--color-brand-secondary-dim",
    "Secondary Hover":   "--color-brand-secondary-hover",
    "Secondary Pressed": "--color-brand-secondary-pressed",
    "Lockup Heart":      "--color-brand-lockup-heart",
  },
  Element: {
    "Subtle":   "--color-element-subtle",
    "Disabled": "--color-element-disabled",
    "Link":     "--color-element-link",
  },
  States: {
    "Hover":   "--color-state-hover",
    "Pressed": "--color-state-pressed",
    "Error":   "--color-state-error",
  },
};

export const GROUP_DESCRIPTIONS: Record<string, string> = {
  Text:       "Text colors used across all typographic elements — headings, body, labels, and on-brand surfaces.",
  Background: "Surface colors that define depth layers: page background, muted fills, overlays, inputs, and editor areas.",
  Brand:      "HeartStamp brand primitives — primary red and secondary dark, with all interactive state variants.",
  Element:    "UI element fills for borders, dividers, disabled states, and link colors.",
  States:     "Interaction state overlays applied on top of surfaces for hover, press, and error feedback.",
};