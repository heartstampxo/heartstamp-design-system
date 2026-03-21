import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* HeartStamp — Calendar mini primitive */
export function CalMini() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear]   = useState(now.getFullYear());
  const [sel, setSel]     = useState(now.getDate());

  const days   = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const firstDay    = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells       = Array(firstDay).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  ) as (number | null)[];

  const prev = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const next = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  return (
    <div
      style={{
        display: "inline-block",
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-2xl)",
        padding: "var(--space-4)",
        userSelect: "none",
        minWidth: 240,
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--space-3)" }}>
        <button
          onClick={prev}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            padding: "var(--space-1) var(--space-2)",
            color: "var(--fg)",
          }}
        >
          <ChevronLeft size={13} />
        </button>
        <span style={{ fontSize: "var(--font-size-body-13)", fontWeight: "var(--font-weight-label-sb-15)", color: "var(--fg)" }}>
          {months[month]} {year}
        </span>
        <button
          onClick={next}
          style={{
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-sm)",
            cursor: "pointer",
            padding: "var(--space-1) var(--space-2)",
            color: "var(--fg)",
          }}
        >
          <ChevronRight size={13} />
        </button>
      </div>

      {/* Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: "var(--space-1)" }}>
        {days.map(d => (
          <div
            key={d}
            style={{ textAlign: "center", fontSize: "var(--font-size-label-12)", fontWeight: "var(--font-weight-label-sb-15)", color: "var(--muted-fg)", padding: "var(--space-1) 0" }}
          >
            {d}
          </div>
        ))}
        {cells.map((d, i) => (
          <div
            key={i}
            onClick={() => d && setSel(d)}
            style={{
              textAlign: "center",
              fontSize: "var(--font-size-label-12)",
              padding: "var(--space-1) 0",
              borderRadius: "var(--radius-sm)",
              cursor: d ? "pointer" : "default",
              background: d === sel && month === now.getMonth() ? "var(--accent)" : "transparent",
              color:
                d === sel && month === now.getMonth()
                  ? "var(--color-text-on-primary)"
                  : d
                  ? "var(--fg)"
                  : "transparent",
              fontWeight: d === sel ? "var(--font-weight-label-sb-15)" : "var(--font-weight-normal)",
            }}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
