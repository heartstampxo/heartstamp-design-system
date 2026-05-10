import React, { useState, useRef, useEffect } from "react";

/* HeartStamp — Popover primitive */

interface PpvrProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  title?: string;
  /** Inline styles applied to the root wrapper (e.g. `{ width: "100%" }`). */
  style?: React.CSSProperties;
  /** Inline styles applied to the floating panel (overrides defaults). */
  contentStyle?: React.CSSProperties;
}

export function Ppvr({ trigger, children, title, style, contentStyle }: PpvrProps) {
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
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }}>
      <div onClick={() => setOpen(o => !o)}>{trigger}</div>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-1-5))",
            left: 0,
            zIndex: 100,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 8px 32px rgba(0,0,0,.15)",
            padding: "var(--space-4)",
            minWidth: 220,
            ...contentStyle,
          }}
        >
          {title && (
            <div style={{ fontWeight: "var(--font-weight-label-sb-15)", fontSize: "var(--font-size-body-13)", marginBottom: "var(--space-2)", color: "var(--fg)" }}>
              {title}
            </div>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
