import React from "react";
import { Info, XCircle, CheckCircle2, AlertTriangle } from "lucide-react";

/* HeartStamp — Alert primitive */
export function Alrt({ variant = "default", title, children }: any) {
  const vmap: any = {
    default:     { border: "var(--border)",      bg: "var(--muted)",        color: "var(--fg)",     Icon: Info },
    destructive: { border: "var(--state-error)", bg: "var(--accent-subtle)", color: "var(--accent)", Icon: XCircle },
    success:     { border: "#22c55e60",          bg: "#22c55e10",            color: "#22c55e",       Icon: CheckCircle2 },
    warning:     { border: "#f59e0b60",          bg: "#f59e0b10",            color: "#f59e0b",       Icon: AlertTriangle },
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
          <div style={{ fontWeight: 600, fontSize: "var(--font-size-body-13)", marginBottom: 2, color: "var(--fg)" }}>
            {title}
          </div>
        )}
        <div style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.5 }}>{children}</div>
      </div>
    </div>
  );
}
