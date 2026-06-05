import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "./utils";
import { Tip } from "./hs-tip";

/* ─────────────────────────────────────────────────────────────
   Btn — HeartStamp primary button primitive
   ·  Built with cva — variant/size map to explicit hs-btn--* classes
   ·  All colours driven by HeartStamp --color-* semantic tokens
   ·  Sizing / spacing driven by --btn-* / --radius-button tokens
   ·  No JS hover state — uses CSS :hover / :active / :disabled
   ·  Text color applied via inline style (dynamic per-variant)
   ·  Styles live in btn.css — no Tailwind utilities in this file
───────────────────────────────────────────────────────────── */

/* ── Text colour per variant (inline style — see note above) ─ */
const COLOR_MAP: Record<string, string> = {
  default:          "var(--color-text-on-primary)",
  secondary:        "var(--color-text-on-secondary)",
  outline:          "var(--color-text-primary)",
  ghost:            "var(--color-brand-primary)",
  "primary-ghost":  "var(--color-brand-primary)",
  "secondary-ghost":"var(--color-brand-secondary)",
  link:             "var(--color-element-link)",
  destructive:      "var(--color-text-on-primary)",
  // `plain` is a naked icon/text button: no background, no border, and it
  // inherits the surrounding text colour. Built for affordances embedded
  // inside other components (e.g. an X clear inside a search field).
  plain:            "inherit",
};

const btnVariants = cva(
  /* ── base — all visual rules in btn.css (.hs-btn) ─────────── */
  "hs-btn",
  {
    variants: {
      /* ── colour variants ────────────────────────────────────── */
      variant: {
        default:          "hs-btn--default",
        secondary:        "hs-btn--secondary",
        outline:          "hs-btn--outline",
        ghost:            "hs-btn--ghost",
        "primary-ghost":  "hs-btn--primary-ghost",
        "secondary-ghost":"hs-btn--secondary-ghost",
        link:             "hs-btn--link",
        destructive:      "hs-btn--destructive",
        plain:            "hs-btn--plain",
      },

      /* ── size variants ──────────────────────────────────────── */
      size: {
        default:   "hs-btn--size-default",
        sm:        "hs-btn--size-sm",
        lg:        "hs-btn--size-lg",
        xl:        "hs-btn--size-xl",
        "icon-sm": "hs-btn--size-icon-sm",
        icon:      "hs-btn--size-icon",
        "icon-lg": "hs-btn--size-icon-lg",
        "icon-xl": "hs-btn--size-icon-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

/* ── Types ───────────────────────────────────────────────────── */
export type BtnVariant = NonNullable<VariantProps<typeof btnVariants>["variant"]>;
export type BtnSize    = NonNullable<VariantProps<typeof btnVariants>["size"]>;

export interface BtnProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof btnVariants> {
  /** Tooltip shown on hover when the button is disabled. Defaults to "Disabled". */
  disabledTooltip?: string;
  /** Shows a spinner and disables interaction. Does not show the disabled tooltip. */
  loading?: boolean;
}

/* ── Component ───────────────────────────────────────────────── */
export function Btn({
  variant = "default",
  size    = "default",
  type    = "button",
  className,
  style,
  children,
  disabledTooltip = "Disabled",
  loading,
  ...props
}: BtnProps) {
  const textColor = COLOR_MAP[variant ?? "default"];

  const button = (
    <button
      type={type}
      className={cn(btnVariants({ variant, size }), className)}
      style={{ color: textColor, ...style }}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={15} className="hs-btn__spinner" />
          {children}
        </>
      ) : children}
    </button>
  );

  if (props.disabled) {
    return <Tip label={disabledTooltip}>{button}</Tip>;
  }

  return button;
}
