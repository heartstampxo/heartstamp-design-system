import React from "react";
import { X } from "lucide-react";

/* HeartStamp — Sheet (side-drawer) primitive */

type SheetSide = "right" | "left" | "bottom" | "top";

interface ShtProps {
  open: boolean;
  onClose: () => void;
  side?: SheetSide;
  title?: string;
  children?: React.ReactNode;
}

const POS: Record<SheetSide, React.CSSProperties> = {
  right:  { right: 0,  top: 0,    bottom: 0, width: 320  },
  left:   { left: 0,   top: 0,    bottom: 0, width: 320  },
  bottom: { bottom: 0, left: 0,   right: 0,  height: 360 },
  top:    { top: 0,    left: 0,   right: 0,  height: 360 },
};

const BORDER: Record<SheetSide, React.CSSProperties> = {
  right:  { borderLeft:  "1px solid var(--border)" },
  left:   { borderRight: "1px solid var(--border)" },
  bottom: { borderTop:   "1px solid var(--border)" },
  top:    { borderBottom: "1px solid var(--border)" },
};

export function Sht({ open, onClose, side = "right", title, children }: ShtProps) {
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
          ...POS[side],
          ...BORDER[side],
          background: "var(--bg)",
          padding: "var(--space-6)",
          zIndex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-label-sb-15)", color: "var(--fg)" }}>{title}</div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: "var(--space-1)" }}
          >
            <X size={16} />
          </button>
        </div>
        <div style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.7 }}>{children}</div>
      </div>
    </div>
  );
}
