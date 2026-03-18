import React from "react";
import { ChevronRight } from "lucide-react";

/* HeartStamp — Breadcrumb primitive */
export function Brd({ items }: any) {
  return (
    <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, flexWrap: "wrap" }}>
      {items.map((item: any, i: number) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
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
            <span style={{ color: "var(--fg)", fontWeight: 500 }}>{item}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
