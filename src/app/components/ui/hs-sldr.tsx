import React from "react";

/* HeartStamp — Slider primitive */

interface SldrProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
}

export function Sldr({ value, onChange, min = 0, max = 100 }: SldrProps) {
  return (
    <div style={{ width: "100%", padding: "var(--space-2) 0", position: "relative" }}>
      <div style={{ height: "var(--space-1)", borderRadius: "var(--radius-full)", background: "var(--muted)", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            borderRadius: "var(--radius-full)",
            background: "var(--accent)",
            width: `${((value - min) / (max - min)) * 100}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={e => onChange(Number(e.target.value))}
        style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", margin: 0 }}
      />
    </div>
  );
}
