import React, { useState, useRef, useEffect } from "react";

/* HeartStamp — Dropdown Menu primitive */
export function DdMenu({ trigger, items }: any) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 4px)",
            left: 0,
            zIndex: 100,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            minWidth: 180,
            overflow: "hidden",
            padding: "4px 0",
          }}
        >
          {items.map((item: any, i: number) =>
            item.separator ? (
              <div key={i} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
            ) : (
              <button
                key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: "none",
                  border: "none",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  fontSize: 13,
                  color: item.destructive
                    ? "var(--state-error)"
                    : item.disabled
                    ? "var(--text-disabled)"
                    : "var(--fg)",
                  textAlign: "left",
                  opacity: item.disabled ? 0.5 : 1,
                  fontFamily: "inherit",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = "var(--state-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                {item.icon && (
                  <span style={{ color: item.destructive ? "var(--state-error)" : "var(--muted-fg)" }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
                {item.shortcut && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--text-disabled)" }}>
                    {item.shortcut}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
