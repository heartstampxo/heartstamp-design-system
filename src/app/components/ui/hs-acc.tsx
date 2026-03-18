import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

/* HeartStamp — Accordion primitive */
export function Acc({ items }: any) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {items.map((item: any, i: number) => (
        <div
          key={i}
          style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}
        >
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--fg)",
              fontSize: 14,
              fontWeight: 500,
              textAlign: "left",
            }}
          >
            {item.title}
            <ChevronDown
              size={16}
              style={{
                transition: ".2s",
                transform: open === i ? "rotate(180deg)" : "none",
                color: "var(--muted-fg)",
                flexShrink: 0,
              }}
            />
          </button>
          {open === i && (
            <div
              style={{
                padding: "0 16px 14px",
                fontSize: 13,
                color: "var(--muted-fg)",
                lineHeight: 1.7,
              }}
            >
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
