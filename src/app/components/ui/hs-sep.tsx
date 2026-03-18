import React from "react";

/* HeartStamp — Separator primitive */
export function Sep({ orientation = "horizontal", style }: any) {
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
