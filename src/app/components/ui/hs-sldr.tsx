import React from "react";

/* HeartStamp — Slider primitive */
export function Sldr({ value, onChange, min = 0, max = 100 }: any) {
  return (
    <div style={{ width: "100%", padding: "8px 0", position: "relative" }}>
      <div style={{ height: 4, borderRadius: 99, background: "var(--muted)", position: "relative" }}>
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            height: "100%",
            borderRadius: 99,
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
