import React from "react";

/* HeartStamp — Toggle primitive */
export function Tgl({ pressed, onToggle, children }: any) {
  return (
    <button
      onClick={onToggle}
      style={{
        padding: "7px 14px",
        borderRadius: 7,
        border: "1px solid var(--border)",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all .15s",
        background: pressed ? "var(--secondary)" : "transparent",
        color: pressed ? "var(--text-on-secondary)" : "var(--fg)",
      }}
    >
      {children}
    </button>
  );
}
