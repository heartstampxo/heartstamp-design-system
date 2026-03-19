import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Sep } from "./hs-sep";

/* HeartStamp — Accordion primitive
   Props:
   - items      : { title, content }[]
   - multiple   : boolean — allow multiple panels open at once (default false)
   - defaultOpen: number[] — indices open on first render
   - variant    : "default" | "ghost" — ghost removes card border/radius for inline use (e.g. sidebar)
*/
export function Acc({ items, multiple = false, defaultOpen = [], variant = "default" }: any) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set(defaultOpen));

  const toggle = (i: number) => {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(i)) {
        next.delete(i);
      } else {
        if (!multiple) next.clear();
        next.add(i);
      }
      return next;
    });
  };

  const isGhost = variant === "ghost";

  return (
    <div style={isGhost ? {} : { border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
      {items.map((item: any, i: number) => (
        <React.Fragment key={i}>
          {isGhost && i > 0 && <Sep style={{ margin: "var(--space-2) 0" }} />}
        <div
          style={isGhost ? {} : { borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}
        >
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: isGhost ? "5px var(--space-4)" : "14px 16px",
              background: "none",
              border: "none",
              cursor: "pointer",
              color: isGhost ? "var(--muted-fg)" : "var(--fg)",
              fontSize: isGhost ? 10.5 : 14,
              fontWeight: isGhost ? 700 : 500,
              textAlign: "left",
              textTransform: isGhost ? "uppercase" : "none",
              letterSpacing: isGhost ? ".06em" : "normal",
              fontFamily: "inherit",
            }}
          >
            {item.title}
            <ChevronDown
              size={isGhost ? 10 : 16}
              style={{
                transition: ".2s",
                transform: openSet.has(i) ? "rotate(180deg)" : "none",
                color: "var(--muted-fg)",
                flexShrink: 0,
              }}
            />
          </button>
          {openSet.has(i) && (
            <div style={isGhost ? { marginTop: 1 } : { padding: "0 16px 14px", fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>
              {item.content}
            </div>
          )}
        </div>
        </React.Fragment>
      ))}
    </div>
  );
}
