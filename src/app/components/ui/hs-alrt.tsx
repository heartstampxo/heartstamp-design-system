import React from "react";
import { Info, XCircle, CheckCircle2, AlertTriangle, LucideIcon } from "lucide-react";

type AlrtVariant = "default" | "destructive" | "success" | "warning";

interface AlrtProps {
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

/* HeartStamp — Alert primitive */
export function Alrt({ variant = "default", title, children }: AlrtProps) {
  const vmap: Record<AlrtVariant, VariantStyle> = {
    default:     { border: "var(--border)",           bg: "var(--muted)",         color: "var(--fg)",              Icon: Info },
    destructive: { border: "var(--state-error)",      bg: "var(--accent-subtle)", color: "var(--accent)",          Icon: XCircle },
    success:     { border: "var(--color-state-success-subtle, #22c55e60)", bg: "var(--color-state-success-bg, #22c55e10)", color: "var(--color-state-success, #22c55e)", Icon: CheckCircle2 },
    warning:     { border: "var(--color-state-warning-subtle, #f59e0b60)", bg: "var(--color-state-warning-bg, #f59e0b10)", color: "var(--color-state-warning, #f59e0b)", Icon: AlertTriangle },
  };
  const v = vmap[variant];
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
      <v.Icon size={16} style={{ color: v.color, marginTop: 1, flexShrink: 0 }} />
      <div>
        {title && (
          <div style={{ fontWeight: "var(--font-weight-label-sb-15)", fontSize: "var(--font-size-body-13)", marginBottom: "var(--space-1)", color: "var(--fg)" }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
}
