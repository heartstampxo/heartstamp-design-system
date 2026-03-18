import React from "react";
import { Info, AlertTriangle, CheckCircle2, XCircle } from "lucide-react";

type CalloutVariant = "info" | "warning" | "success" | "danger";

const VARIANTS: Record<CalloutVariant, { bg: string; border: string; color: string; Icon: React.ElementType }> = {
  info:    { bg: "rgba(56,189,248,.08)",  border: "rgba(56,189,248,.3)",  color: "#38bdf8", Icon: Info },
  warning: { bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.3)",  color: "#f59e0b", Icon: AlertTriangle },
  success: { bg: "rgba(52,211,153,.08)", border: "rgba(52,211,153,.3)",  color: "#34d399", Icon: CheckCircle2 },
  danger:  { bg: "rgba(239,68,68,.08)",  border: "rgba(239,68,68,.3)",   color: "#ef4444", Icon: XCircle },
};

interface CalloutProps {
  variant?: CalloutVariant;
  children: React.ReactNode;
}

export function Callout({ variant = "info", children }: CalloutProps) {
  const { bg, border, color, Icon } = VARIANTS[variant];
  return (
    <div style={{
      display: "flex", gap: 10, padding: "10px 14px", borderRadius: 8,
      border: `1px solid ${border}`, background: bg, fontSize: 13, marginBottom: 16,
    }}>
      <Icon size={15} style={{ color, marginTop: 1, flexShrink: 0 }} />
      <span style={{ lineHeight: 1.6, color: "var(--fg)" }}>{children}</span>
    </div>
  );
}
