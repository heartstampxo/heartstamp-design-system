import React from "react";

/* HeartStamp — Skeleton primitive */
export function Skl({ style }: any) {
  return (
    <div
      style={{
        borderRadius: 6,
        background: "var(--muted)",
        backgroundImage: "linear-gradient(90deg,var(--muted) 25%,var(--bg-editor) 50%,var(--muted) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}
