import React, { useState, useRef, useEffect } from "react";

/* HeartStamp — Popover primitive */
export function Ppvr({ trigger, children, title }: any) {
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
            top: "calc(100% + 6px)",
            left: 0,
            zIndex: 100,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            padding: 16,
            minWidth: 220,
          }}
        >
          {title && (
            <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--fg)" }}>
              {title}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
