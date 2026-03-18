import React from "react";
import { X } from "lucide-react";

/* HeartStamp — Dialog primitive */
export function Dlg({ open, onClose, title, children, footer }: any) {
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
          borderRadius: 14,
          border: "1px solid var(--border)",
          padding: 24,
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
            marginBottom: 12,
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--muted-fg)",
              padding: 4,
              borderRadius: 6,
            }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: 20 }}>
          {children}
        </div>
        {footer && (
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>
        )}
      </div>
    </div>
  );
}
