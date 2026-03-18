import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* HeartStamp — Pagination primitive */
export function Pgn({ total = 10, current = 1, onChange }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid var(--border)",
          background: "transparent",
          cursor: current === 1 ? "not-allowed" : "pointer",
          color: "var(--muted-fg)",
          opacity: current === 1 ? 0.4 : 1,
        }}
      >
        <ChevronLeft size={14} />
      </button>

      {Array.from({ length: Math.min(5, total) }, (_, i) => i + Math.max(1, current - 2))
        .filter(n => n <= total)
        .map(n => (
          <button
            key={n}
            onClick={() => onChange(n)}
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: `1px solid ${n === current ? "var(--accent)" : "var(--border)"}`,
              background: n === current ? "var(--accent)" : "transparent",
              color: n === current ? "var(--text-on-primary)" : "var(--fg)",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: n === current ? 600 : 400,
            }}
          >
            {n}
          </button>
        ))}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        style={{
          padding: "6px 10px",
          borderRadius: 6,
          border: "1px solid var(--border)",
          background: "transparent",
          cursor: current === total ? "not-allowed" : "pointer",
          color: "var(--muted-fg)",
          opacity: current === total ? 0.4 : 1,
        }}
      >
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
