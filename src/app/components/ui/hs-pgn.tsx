import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* HeartStamp — Pagination primitive */

interface PgnProps {
  total?: number;
  current?: number;
  onChange: (page: number) => void;
}

export function Pgn({ total = 10, current = 1, onChange }: PgnProps) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "var(--space-0)" }}>
      <button
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        style={{
          padding: "var(--space-1-5) var(--space-2)",
          borderRadius: "var(--radius-sm)",
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
              width: "var(--space-8)",
              height: "var(--space-8)",
              borderRadius: "var(--radius-sm)",
              border: `1px solid ${n === current ? "var(--accent)" : "var(--border)"}`,
              background: n === current ? "var(--accent)" : "transparent",
              color: n === current ? "var(--color-text-on-primary)" : "var(--fg)",
              cursor: "pointer",
              fontSize: "var(--font-size-body-13)",
              fontWeight: n === current ? "var(--font-weight-label-sb-15)" : "var(--font-weight-normal)",
            }}
          >
            {n}
          </button>
        ))}

      <button
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        style={{
          padding: "var(--space-1-5) var(--space-2)",
          borderRadius: "var(--radius-sm)",
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
