import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { Sep } from "./hs-sep";

interface AccItem {
  title: React.ReactNode;
  content: React.ReactNode;
}

interface AccProps {
  items: AccItem[];
  multiple?: boolean;
  defaultOpen?: number[];
  variant?: "default" | "ghost";
}

/* HeartStamp — Accordion primitive
   Props:
   - items      : { title, content }[]
   - multiple   : boolean — allow multiple panels open at once (default false)
   - defaultOpen: number[] — indices open on first render
   - variant    : "default" | "ghost" — ghost removes card border/radius for inline use (e.g. sidebar)
*/
export function Acc({ items, multiple = false, defaultOpen = [], variant = "default" }: AccProps) {
  const [openSet, setOpenSet] = useState<Set<number>>(new Set(defaultOpen));

  useEffect(() => {
    setOpenSet(prev => {
      const toAdd = defaultOpen.filter(i => !prev.has(i));
      if (toAdd.length === 0) return prev;
      const next = new Set(prev);
      toAdd.forEach(i => next.add(i));
      return next;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(defaultOpen)]);

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
    <div style={isGhost ? {} : { border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
      {items.map((item, i) => (
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
                padding: isGhost ? "var(--space-1) var(--space-4)" : "var(--space-3-5) var(--space-4)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: isGhost ? "var(--muted-fg)" : "var(--fg)",
                fontSize: isGhost ? "var(--font-size-label-12)" : "var(--font-size-body-13)",
                fontWeight: isGhost ? 700 : "var(--font-weight-label-15)",
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
              <div style={isGhost ? { marginTop: 1 } : { padding: "0 var(--space-4) var(--space-3-5)", fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", lineHeight: 1.7 }}>
                {item.content}
              </div>
            )}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}
