import React from "react";
import { Info, XCircle, CheckCircle2, AlertTriangle, LucideIcon } from "lucide-react";
import defaultStampyIcon from "../../../assets/Mascots/Social-Ready Expressions/Excited Smile.webp";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Alerts

   ·  Alrt       — severity callout (default / destructive / success / warning)
   ·  StampyAlrt — mascot-fronted status alert
   ·  AlrtStrong — inline emphasis for StampyAlrt body copy
═══════════════════════════════════════════════════════ */

export type AlrtVariant = "default" | "destructive" | "success" | "warning";

export interface AlrtProps {
  variant?: AlrtVariant;
  title?: React.ReactNode;
  children?: React.ReactNode;
}

interface VariantStyle {
  border: string;
  bg: string;
  color: string;
  Icon: LucideIcon;
}

/* ── Severity tints ─────────────────────────────────────────────────
   Border and background are mixed from the state colour so each variant
   has a single source of truth (matching the color-mix use in
   hs-website-nav). Warning has no state token at all — see below.
──────────────────────────────────────────────────────────────────── */
const tint = (color: string, pct: number) => `color-mix(in srgb, ${color} ${pct}%, transparent)`;

const SUCCESS = "var(--color-state-success, #22c55e)";
const WARNING = "var(--color-state-warning, #f59e0b)";

const VARIANTS: Record<AlrtVariant, VariantStyle> = {
  default:     { border: "var(--border)",      bg: "var(--muted)",         color: "var(--fg)",    Icon: Info },
  destructive: { border: "var(--state-error)", bg: "var(--accent-subtle)", color: "var(--accent)", Icon: XCircle },
  success:     { border: tint(SUCCESS, 38),    bg: tint(SUCCESS, 6),       color: SUCCESS,        Icon: CheckCircle2 },
  warning:     { border: tint(WARNING, 38),    bg: tint(WARNING, 6),       color: WARNING,        Icon: AlertTriangle },
};

const alrtIconStyle: React.CSSProperties = { marginTop: 1, flexShrink: 0 };

const alrtTitleStyle: React.CSSProperties = {
  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
  fontSize: "var(--font-size-body-13)",
  marginBottom: "var(--space-1)",
  color: "var(--fg)",
};

const alrtBodyStyle: React.CSSProperties = {
  fontSize: "var(--font-size-body-13)",
  color: "var(--muted-fg)",
  lineHeight: 1.5,
};

/* HeartStamp — Alert primitive */
export function Alrt({ variant = "default", title, children }: AlrtProps) {
  const v = VARIANTS[variant];

  return (
    <div
      style={{
        display: "flex",
        gap: "var(--space-3)",
        padding: "var(--space-3) var(--space-4)",
        borderRadius: "var(--radius-lg)",
        border: `1px solid ${v.border}`,
        background: v.bg,
      }}
    >
      <v.Icon size={16} style={{ color: v.color, ...alrtIconStyle }} />
      <div>
        {title && <div style={alrtTitleStyle}>{title}</div>}
        <div style={alrtBodyStyle}>{children}</div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   StampyAlrt — mascot-fronted status alert
   A lifted, self-contained callout that reports progress in a
   flow and points at the next action. Stampy carries the tone,
   so there are no severity variants.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const ICON_SIZE    = 64;
const PAD_X        = 15;          // off the --space-* scale (between 14 and 16)
const GAP          = 11;          // off-scale, between --space-2-5 (10) and --space-3 (12)
const TITLE_SIZE   = 13.5;        // no --font-size-* token at 13.5px
const BODY_SIZE    = 12.5;        // no --font-size-* token at 12.5px
const BODY_LEADING = "18.13px";   // computed 12.5 × 1.45

// Lifted shadow tinted with the text-primary hue (36,36,35) rather than pure
// black. No --shadow-* token matches.
const SHADOW = "0px 16px 40px rgba(36, 36, 35, 0.18)";

const FONT_BODY = "var(--font-family-body, 'DM Sans', system-ui, sans-serif)";

const stampyAlrtStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  display: "flex",
  alignItems: "flex-start",
  gap: GAP,
  padding: `var(--space-3-5, 14px) ${PAD_X}px`,
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-3xl, 14px)",
  boxShadow: SHADOW,
  // Figma draws this as a 1px inset outline; a border is the layout-safe
  // equivalent and clips to the radius reliably.
  border: "1px solid var(--color-element-subtle, rgba(36, 36, 35, 0.10))",
};

const stampyIconStyle: React.CSSProperties = {
  width: ICON_SIZE,
  height: ICON_SIZE,
  objectFit: "contain",
  flexShrink: 0,
};

const stampyTextColStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,  // lets long unbroken words wrap instead of overflowing
};

const stampyTitleStyle: React.CSSProperties = {
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: TITLE_SIZE,
  fontWeight: "var(--font-weight-body-13-bd, 700)" as React.CSSProperties["fontWeight"],
};

const stampyBodyStyle: React.CSSProperties = {
  paddingTop: 2,  // no --space-* token below 4px
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: BODY_SIZE,
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
  lineHeight: BODY_LEADING,
};

// Semibold emphasis. The 600 weight tokens are size-scoped
// (--font-weight-label-sb-15), so the numeric value is used directly here.
const alrtStrongStyle: React.CSSProperties = {
  color: "var(--color-text-primary, #242423)",
  fontWeight: 600,
};

export interface AlrtStrongProps {
  children: React.ReactNode;
}

/**
 * Inline emphasis for StampyAlrt body copy — darkens to text-primary and steps
 * up to weight 600. Use it to mark the action the user should take.
 */
export function AlrtStrong({ children }: AlrtStrongProps) {
  return <strong style={alrtStrongStyle}>{children}</strong>;
}

export interface StampyAlrtProps {
  title: React.ReactNode;
  /** Body copy. Wrap the call to action in `<AlrtStrong>`. */
  children?: React.ReactNode;
  /** Image for the 64×64 slot. Ignored when `icon` is supplied. */
  iconSrc?: string;
  /** Replaces the 64×64 slot. Pass `null` to drop it entirely. */
  icon?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

export function StampyAlrt({
  title,
  children,
  iconSrc = defaultStampyIcon,
  icon,
  style,
  className,
}: StampyAlrtProps) {
  return (
    <div
      role="status"
      className={className}
      style={style ? { ...stampyAlrtStyle, ...style } : stampyAlrtStyle}
    >
      {icon !== undefined ? icon : <img src={iconSrc} alt="" style={stampyIconStyle} />}

      <div style={stampyTextColStyle}>
        <div style={stampyTitleStyle}>{title}</div>
        {children && <div style={stampyBodyStyle}>{children}</div>}
      </div>
    </div>
  );
}
