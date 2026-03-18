import React, { useState } from "react";

/* HeartStamp — Tooltip wrapper primitive */
export function Tip({ label, children }: any) {
  const [show, setShow] = useState(false);
  return (
    <div
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          style={{
            position: "absolute",
            bottom: "calc(100% + 6px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--fg)",
            color: "var(--bg)",
            fontSize: 11,
            fontWeight: 500,
            padding: "var(--space-1) var(--space-2)",
            borderRadius: "var(--radius-sm)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 999,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
