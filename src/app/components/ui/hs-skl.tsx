import React from "react";

/* HeartStamp — Skeleton primitive */

interface SklProps {
  style?: React.CSSProperties;
}

export function Skl({ style }: SklProps) {
  return (
    <div
      style={{
        borderRadius: "var(--radius-sm)",
        background: "var(--muted)",
        backgroundImage: "linear-gradient(90deg,var(--muted) 25%,var(--bg-editor) 50%,var(--muted) 75%)",
        backgroundSize: "200% 100%",
        animation: "shimmer 1.5s infinite",
        ...style,
      }}
    />
  );
}
