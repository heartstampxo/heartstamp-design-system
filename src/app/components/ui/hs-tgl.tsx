import React from "react";

/* HeartStamp — Toggle primitive */

interface TglProps {
  pressed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function Tgl({ pressed, onToggle, children }: TglProps) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: "var(--space-1-5) var(--space-3-5)",
        borderRadius: "var(--radius-md)",
        border: "1px solid var(--border)",
        fontFamily: "inherit",
        fontSize: "var(--font-size-body-13)",
        fontWeight: "var(--font-weight-label-15)",
        cursor: "pointer",
        transition: "all .15s",
        background: pressed ? "var(--secondary)" : "transparent",
        color: pressed ? "var(--color-text-on-primary)" : "var(--fg)",
      }}
    >
      {children}
    </button>
  );
}
