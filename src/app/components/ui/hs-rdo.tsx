import React from "react";

/* HeartStamp — Radio primitive */

interface RdoProps {
  checked: boolean;
  onChange: () => void;
  label?: string;
}

export function Rdo({ checked, onChange, label }: RdoProps) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: "pointer" }}
      onClick={onChange}
    >
      <div
        style={{
          width: "var(--space-4)",
          height: "var(--space-4)",
          borderRadius: "var(--radius-full)",
          border: `2px solid ${checked ? "var(--accent)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .15s",
        }}
      >
        {checked && (
          <div
            style={{ width: "var(--space-1-5)", height: "var(--space-1-5)", borderRadius: "var(--radius-full)", background: "var(--accent)" }}
          />
        )}
      </div>
      {label && <span style={{ fontSize: "var(--font-size-body-13)", color: "var(--fg)" }}>{label}</span>}
    </div>
  );
}
