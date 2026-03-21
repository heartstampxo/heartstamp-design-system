import React, { useState } from "react";

/* HeartStamp — Tooltip wrapper primitive */

interface TipProps {
  label: string;
  children: React.ReactNode;
}

export function Tip({ label, children }: TipProps) {
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
            bottom: "calc(100% + var(--space-1-5))",
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--fg)",
            color: "var(--bg)",
            fontSize: "var(--font-size-label-12)",
            fontWeight: "var(--font-weight-label-15)",
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
