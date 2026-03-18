import React, { useState, useRef, useEffect } from "react";

/* HeartStamp — Context Menu primitive */
export function CtxMenu({ children, items }: any) {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setPos(null);
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, []);

  return (
    <div
      ref={ref}
      onContextMenu={e => {
        e.preventDefault();
        setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
      }}
      style={{ position: "relative" }}
    >
      {children}
      {pos && (
        <div
          style={{
            position: "absolute",
            left: pos.x,
            top: pos.y,
            zIndex: 200,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            minWidth: 160,
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
                onClick={() => { item.onClick?.(); setPos(null); }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 12.5,
                  fontFamily: "inherit",
                  color: item.destructive ? "var(--state-error)" : "var(--fg)",
                  textAlign: "left",
                  transition: "background 0.1s ease",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "var(--state-hover)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
              >
                {item.icon && (
                  <span style={{ color: item.destructive ? "var(--state-error)" : "var(--muted-fg)" }}>
                    {item.icon}
                  </span>
                )}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
