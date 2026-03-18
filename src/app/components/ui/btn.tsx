import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

/* ─────────────────────────────────────────────────────────────
   Btn — HeartStamp primary button primitive
   ·  Built with cva (Shadcn pattern) + Tailwind utility classes
   ·  All colours driven by HeartStamp --color-* semantic tokens
   ·  Sizing / spacing driven by --btn-* / --radius-button tokens
   ·  No JS hover state — uses CSS hover: / active: / disabled:
   ·  Text color applied via inline style (Tailwind v4 does not
      generate [color:var(...)] arbitrary property classes)
───────────────────────────────────────────────────────────── */

/* ── Text colour per variant (inline style — see note above) ─ */
const COLOR_MAP: Record<string, string> = {
  default:          "var(--color-text-on-primary)",
  secondary:        "var(--color-text-on-primary)",
  outline:          "var(--color-text-primary)",
  ghost:            "var(--color-brand-primary)",
  "secondary-ghost":"var(--color-brand-secondary)",
  link:             "var(--color-element-link)",
  destructive:      "var(--color-text-on-primary)",
};

const btnVariants = cva(
  /* ── base ─────────────────────────────────────────────────── */
  [
    "inline-flex items-center justify-center whitespace-nowrap select-none leading-none",
    "rounded-[var(--radius-button)] border border-transparent",
    "font-[var(--font-weight-btn)] gap-[var(--btn-gap)]",
    "transition-all duration-150 ease-in-out cursor-pointer",
    "outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand-primary)] focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
  ].join(" "),
  {
    variants: {
      /* ── colour variants ────────────────────────────────────── */
      variant: {
        default: [
          "bg-[var(--color-brand-primary)] border-[var(--color-brand-primary)]",
          "hover:bg-[var(--color-brand-primary-hover)] hover:border-[var(--color-brand-primary-hover)]",
          "active:bg-[var(--color-brand-primary-pressed)] active:border-[var(--color-brand-primary-pressed)]",
        ].join(" "),

        secondary: [
          "bg-[var(--color-brand-secondary)] border-[var(--color-brand-secondary)]",
          "hover:bg-[var(--color-brand-secondary-hover)] hover:border-[var(--color-brand-secondary-hover)]",
          "active:bg-[var(--color-brand-secondary-pressed)] active:border-[var(--color-brand-secondary-pressed)]",
        ].join(" "),

        outline: [
          "bg-transparent border-[var(--color-element-subtle)]",
          "hover:bg-[var(--color-state-hover)]",
          "active:bg-[var(--color-state-pressed)]",
        ].join(" "),

        ghost: [
          "bg-[var(--color-brand-primary-dim)] border-transparent",
          "hover:opacity-80",
          "active:opacity-60",
        ].join(" "),

        "secondary-ghost": [
          "bg-[var(--color-brand-secondary-dim)] border-transparent",
          "hover:bg-[var(--color-element-subtle)]",
          "active:bg-[var(--color-state-pressed)]",
        ].join(" "),

        link: [
          "bg-transparent border-transparent underline",
          "hover:opacity-80",
          "active:opacity-60",
        ].join(" "),

        destructive: [
          "bg-[var(--color-state-error)] border-[var(--color-state-error)]",
          "hover:opacity-90",
          "active:opacity-80",
        ].join(" "),
      },

      /* ── size variants ──────────────────────────────────────── */
      size: {
        /* labeled: explicit height + horizontal padding hit 36/40/44px targets */
        default: "h-[40px] px-[16px] text-[var(--font-size-btn)]",
        sm:      "h-[36px] px-[12px] text-[var(--font-size-btn-sm)]",
        lg:      "h-[44px] px-[20px] text-[var(--font-size-btn-lg)]",
        /* icon-only: square at target size, no padding needed */
        "icon-sm": "h-[36px] w-[36px]",
        icon:      "h-[40px] w-[40px]",
        "icon-lg": "h-[44px] w-[44px]",
      },
    },
    compoundVariants: [
      /* link has no height/padding constraints — it flows inline */
      { variant: "link", class: "h-auto px-0" },
    ],
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
    VariantProps<typeof btnVariants> {}

/* ── Component ───────────────────────────────────────────────── */
export function Btn({
  variant = "default",
  size    = "default",
  className,
  style,
  children,
  ...props
}: BtnProps) {
  const textColor = props.disabled
    ? "var(--color-text-disabled)"
    : COLOR_MAP[variant ?? "default"];

  return (
    <button
      className={cn(btnVariants({ variant, size }), className)}
      style={{ color: textColor, ...style }}
      {...props}
    >
      {children}
    </button>
  );
}
