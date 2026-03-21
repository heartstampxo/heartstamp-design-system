import React from "react";
import { ChevronRight } from "lucide-react";

interface BrdProps {
  items: React.ReactNode[];
}

/* HeartStamp — Breadcrumb primitive */
export function Brd({ items }: BrdProps) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: "var(--space-1)", fontSize: "var(--font-size-body-13)", flexWrap: "wrap" }}>
      {items.map((item, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          {i > 0 && <ChevronRight size={13} style={{ color: "var(--muted-fg)" }} />}
          {i < items.length - 1 ? (
            <a
              href="#"
              onClick={e => e.preventDefault()}
              style={{ color: "var(--muted-fg)", textDecoration: "none" }}
            >
              {item}
            </a>
          ) : (
            <span style={{ color: "var(--fg)", fontWeight: "var(--font-weight-label-15)" }}>{item}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
