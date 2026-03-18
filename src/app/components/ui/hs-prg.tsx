import React from "react";

/* HeartStamp — Progress primitive */
export function Prg({ value, style }: any) {
  return (
    <div
      style={{
        height: 8,
        borderRadius: 99,
        background: "var(--muted)",
        overflow: "hidden",
        ...style,
      }}
    >
      <div
        style={{
          height: "100%",
          borderRadius: 99,
          background: "var(--accent)",
          width: `${value}%`,
          transition: "width .3s",
        }}
      />
    </div>
  );
}
