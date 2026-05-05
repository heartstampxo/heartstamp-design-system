import React from "react";

/* HeartStamp — Separator primitive */

interface SepProps {
  orientation?: "horizontal" | "vertical";
  style?: React.CSSProperties;
}

export function Sep({ orientation = "horizontal", style }: SepProps) {
  return (
    <div
      style={{
        [orientation === "horizontal" ? "height" : "width"]: 1,
        [orientation === "horizontal" ? "width" : "height"]: "100%",
        background: "var(--border)",
        ...style,
      }}
    />
  );
}
