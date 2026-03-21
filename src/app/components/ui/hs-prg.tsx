import React from "react";

/* HeartStamp — Progress primitive */

interface PrgProps {
  value: number;
  style?: React.CSSProperties;
}

export function Prg({ value, style }: PrgProps) {
  return (
    <div
      style={{
        height: "var(--space-2)",
        borderRadius: "var(--radius-full)",
        background: "var(--muted)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: "var(--radius-full)",
          background: "var(--accent)",
          width: `${value}%`,
          transition: "width .3s",
        }}
      />
    </div>
  );
}
