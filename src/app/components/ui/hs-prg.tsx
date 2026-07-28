import React from "react";

/* HeartStamp — Progress primitive */

interface PrgProps {
  value: number;
  style?: React.CSSProperties;
  /**
   * CSS transition applied to the fill. The default smooths discrete value
   * updates. Pass "none" when driving the value continuously (e.g. via
   * requestAnimationFrame) so the bar stays exactly in sync and never lags.
   */
  fillTransition?: string;
}

export function Prg({ value, style, fillTransition = "width .3s" }: PrgProps) {
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
          transition: fillTransition,
        }}
      />
    </div>
  );
}
