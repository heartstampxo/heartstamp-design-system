import React, { useState, useRef } from "react";

/* HeartStamp — Tooltip wrapper primitive */

interface TipProps {
  label: string;
  children: React.ReactNode;
}

export function Tip({ label, children }: TipProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={() => setRect(ref.current?.getBoundingClientRect() ?? null)}
      onMouseLeave={() => setRect(null)}
    >
      {children}
      {rect && (
        <div
          style={{
            position: "fixed",
            top: rect.top - 6,
            left: rect.left + rect.width / 2,
            transform: "translate(-50%, -100%)",
            background: "var(--fg)",
            color: "var(--bg)",
            fontSize: "var(--font-size-label-12)",
            fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
            padding: "var(--space-1) var(--space-2)",
            borderRadius: "var(--radius-sm)",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            zIndex: 9999,
            boxShadow: "var(--shadow-md)",
          }}
        >
          {label}
        </div>
      )}
    </div>
  );
}
