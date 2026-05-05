import React from "react";

/* HeartStamp — ScrollBox primitive */

interface ScrollBoxProps {
  children: React.ReactNode;
  height?: number | string;
  style?: React.CSSProperties;
}

export function ScrollBox({ children, height = 160, style }: ScrollBoxProps) {
  return (
    <div
      style={{
        height,
        overflowY: "auto",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        padding: "var(--space-3)",
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
        ...style,
      } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
