import React from "react";

type BdgVariant = "default" | "secondary" | "outline" | "destructive" | "success" | "warning";

interface BdgProps {
  variant?: BdgVariant;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface VariantStyle {
  background: string;
  color: string;
  border?: string;
}

/* HeartStamp — Badge primitive */
export function Bdg({ variant = "default", children, style }: BdgProps) {
  const vmap: Record<BdgVariant, VariantStyle> = {
    default:     { background: "var(--accent)",           color: "var(--color-text-on-primary)" },
    secondary:   { background: "var(--secondary-subtle)", color: "var(--secondary)" },
    outline:     { background: "transparent",             color: "var(--fg)", border: "1px solid var(--border)" },
    destructive: { background: "var(--color-state-error)", color: "var(--color-text-on-primary)" },
    success:     { background: "var(--color-state-success, #22c55e)", color: "var(--color-text-on-primary)" },
    warning:     { background: "var(--color-state-warning, #f59e0b)", color: "var(--color-text-on-primary)" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-full)",
        fontSize: "var(--font-size-label-12)",
        fontWeight: "var(--font-weight-label-sb-15)",
        ...vmap[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
