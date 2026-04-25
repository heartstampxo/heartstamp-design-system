import React, { useState, useRef, useEffect } from "react";

interface DdMenuItem {
  label?: string;
  icon?: React.ReactNode;
  shortcut?: string;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  separator?: boolean;
  /** Extra inline styles for the item row (e.g. custom fontFamily) */
  style?: React.CSSProperties;
}

interface DdMenuProps {
  trigger: React.ReactNode;
  items: DdMenuItem[];
  style?: React.CSSProperties;
  /**
   * When true, the dropdown is rendered with position:fixed using
   * getBoundingClientRect — escapes overflow:hidden/auto parents.
   */
  fixed?: boolean;
}

export function DdMenu({ trigger, items, style, fixed }: DdMenuProps) {
  const [open, setOpen] = useState(false);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  function handleOpen() {
    if (fixed && ref.current) setRect(ref.current.getBoundingClientRect());
    setOpen(o => !o);
  }

  const dropdownStyle: React.CSSProperties = fixed && rect
    ? {
        position: "fixed",
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
        zIndex: 9999,
      }
    : {
        position: "absolute",
        top: "calc(100% + var(--space-1))",
        left: 0,
        zIndex: 100,
        minWidth: "100%",
      };

  return (
    <div ref={ref} style={{ position: "relative", display: "inline-block", ...style }}>
      <div onClick={handleOpen}>{trigger}</div>
      {open && (
        <div
          style={{
            ...dropdownStyle,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            overflow: "hidden",
            padding: "var(--space-1) 0",
          }}
        >
          {items.map((item, i) =>
            item.separator ? (
              <div key={i} style={{ height: 1, background: "var(--border)", margin: "var(--space-1) 0" }} />
            ) : (
              <button
                key={i}
                onClick={() => { item.onClick?.(); setOpen(false); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-2)",
                  padding: "var(--space-2) var(--space-3-5)",
                  background: "none",
                  border: "none",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  fontSize: "var(--font-size-body-13)",
                  color: item.destructive
                    ? "var(--color-state-error)"
                    : item.disabled
                    ? "var(--color-text-disabled)"
                    : "var(--fg)",
                  textAlign: "left",
                  opacity: item.disabled ? 0.5 : 1,
                  fontFamily: "inherit",
                  transition: "background 0.1s ease",
                  ...item.style,
                }}
                onMouseEnter={e => { if (!item.disabled) e.currentTarget.style.background = "var(--color-state-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                {item.icon && (
                  <span style={{ color: item.destructive ? "var(--color-state-error)" : "var(--muted-fg)" }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
                {item.shortcut && (
                  <span style={{ marginLeft: "auto", fontSize: "var(--font-size-label-12)", color: "var(--color-text-disabled)" }}>
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
