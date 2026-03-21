import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

/* HeartStamp — Select dropdown primitive */

interface SelOption {
  value: string;
  label: string;
}

interface SelProps {
  options?: SelOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  style?: React.CSSProperties;
}

export function Sel({ options = [], value, onChange, placeholder = "Select…", style }: SelProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const selected = options.find(o => o.value === value);

  return (
    <div ref={ref} style={{ position: "relative", ...style }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-2) var(--space-3)",
          borderRadius: "var(--radius-input)",
          border: "1px solid var(--border)",
          background: "var(--bg-input)",
          color: selected ? "var(--fg)" : "var(--color-text-disabled)",
          fontSize: "var(--font-size-body-15)",
          fontFamily: "inherit",
          cursor: "pointer",
          transition: "border-color 0.15s ease",
        }}
      >
        <span>{selected?.label || placeholder}</span>
        <ChevronDown
          size={14}
          style={{
            transition: ".2s",
            transform: open ? "rotate(180deg)" : "none",
            color: "var(--muted-fg)",
            flexShrink: 0,
          }}
        />
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + var(--space-1))",
            left: 0,
            right: 0,
            zIndex: 100,
            background: "var(--bg-menus)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-2xl)",
            boxShadow: "0 8px 24px rgba(0,0,0,.15)",
            overflow: "hidden",
          }}
        >
          {options.map(o => (
            <div
              key={o.value}
              onClick={() => { onChange(o.value); setOpen(false); }}
              style={{
                padding: "var(--space-2) var(--space-3-5)",
                fontSize: "var(--font-size-body-13)",
                cursor: "pointer",
                color: "var(--fg)",
                background: o.value === value ? "var(--color-state-hover)" : "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "background 0.1s ease",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--color-state-hover)")}
              onMouseLeave={e => (e.currentTarget.style.background = o.value === value ? "var(--color-state-hover)" : "transparent")}
            >
              {o.label}
              {o.value === value && <Check size={13} style={{ color: "var(--accent)" }} />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
