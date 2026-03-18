import React from "react";

/* HeartStamp — ScrollBox primitive */
export function ScrollBox({ children, height = 160 }: any) {
  return (
    <div
      style={{
        height,
        overflowY: "auto",
        border: "1px solid var(--border)",
        borderRadius: 8,
        padding: 12,
        scrollbarWidth: "thin",
        scrollbarColor: "var(--border) transparent",
      } as any}
    >
      {children}
    </div>
  );
}
