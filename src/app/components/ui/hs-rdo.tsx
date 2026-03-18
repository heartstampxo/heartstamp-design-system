import React from "react";

/* HeartStamp — Radio primitive */
export function Rdo({ checked, onChange, label }: any) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
      onClick={onChange}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: `2px solid ${checked ? "var(--accent)" : "var(--border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .15s",
        }}
      >
        {checked && (
          <div
            style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }}
          />
        )}
      </div>
      {label && <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>}
    </div>
  );
}
