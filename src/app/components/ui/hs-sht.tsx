import React from "react";
import { X } from "lucide-react";

/* HeartStamp — Sheet (side-drawer) primitive */
export function Sht({ open, onClose, side = "right", title, children }: any) {
  const pos: any = {
    right:  { right: 0,  top: 0,    bottom: 0, width: 320  },
    left:   { left: 0,   top: 0,    bottom: 0, width: 320  },
    bottom: { bottom: 0, left: 0,   right: 0,  height: 360 },
    top:    { top: 0,    left: 0,   right: 0,  height: 360 },
  };
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 999 }}>
      <div
        onClick={onClose}
        style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }}
      />
      <div
        style={{
          position: "absolute",
          ...pos[side],
          background: "var(--bg)",
          borderLeft:  side === "right"  ? "1px solid var(--border)" : "none",
          borderRight: side === "left"   ? "1px solid var(--border)" : "none",
          borderTop:   side === "bottom" ? "1px solid var(--border)" : "none",
          padding: 24,
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 4 }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}
