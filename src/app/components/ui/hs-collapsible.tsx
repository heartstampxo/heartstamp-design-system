import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* HeartStamp — Collapsible primitive */
export function Collapsible({ trigger, children }: any) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          background: "var(--muted)",
          border: "none",
          cursor: "pointer",
          color: "var(--fg)",
          fontSize: 13,
          fontWeight: 500,
          textAlign: "left",
        }}
      >
        {trigger}
        <ChevronDown
          size={15}
          style={{
            transition: ".2s",
            transform: open ? "rotate(180deg)" : "none",
            color: "var(--muted-fg)",
          }}
        />
      </button>
      {open && (
        <div style={{ padding: 16, fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}
