import React from "react";
import { X } from "lucide-react";

interface DlgProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Dlg({ open, onClose, title, children, footer }: DlgProps) {
  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,.6)",
          backdropFilter: "blur(4px)",
        }}
      />
      <div
        style={{
          position: "relative",
          background: "var(--bg)",
          borderRadius: "var(--radius-3xl)",
          border: "1px solid var(--border)",
          padding: "var(--space-6)",
          width: "min(440px,90%)",
          boxShadow: "0 24px 64px rgba(0,0,0,.3)",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "var(--space-3)",
          }}
        >
          <div style={{ fontSize: "var(--font-size-label-sb-15)", fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"], color: "var(--fg)" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-fg)",
              padding: "var(--space-1)",
              borderRadius: "var(--radius-sm)",
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: "var(--space-5)" }}>
          {children}
        </div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "var(--space-2)" }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
