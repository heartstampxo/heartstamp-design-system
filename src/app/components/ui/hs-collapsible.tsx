import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface CollapsibleProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
}

export function Collapsible({ trigger, children }: CollapsibleProps) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-3) var(--space-4)",
          background: "var(--muted)",
          border: "none",
          cursor: "pointer",
          color: "var(--fg)",
          fontSize: "var(--font-size-body-13)",
          fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
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
        <div style={{ padding: "var(--space-4)", fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.7 }}>
          {children}
        </div>
      )}
    </div>
  );
}
