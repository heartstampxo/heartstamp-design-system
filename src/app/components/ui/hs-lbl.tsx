import React from "react";

/* HeartStamp — Label primitive */
export function Lbl({ children, style }: any) {
  return (
    <label
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--fg)",
        display: "block",
        marginBottom: 4,
        ...style,
      }}
    >
      {children}
    </label>
  );
}
