import React, { useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface PillTabItem {
  value: string;
  label: string;
}

export interface PillTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: PillTabItem[];
  /** Accessible label for the tab group. Recommended when multiple PillTabs are on the same page. */
  "aria-label"?: string;
  style?: React.CSSProperties;
}

export function PillTabs({ value, onValueChange, tabs, style, "aria-label": ariaLabel }: PillTabsProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft")  next = (index - 1 + tabs.length) % tabs.length;
    if (next === -1) return;
    e.preventDefault();
    onValueChange(tabs[next].value);
    btnRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        background: "var(--muted)",
        borderRadius: "var(--radius-full)",
        padding: "var(--space-1)",
        position: "relative",
        ...style,
      }}
    >
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          ref={el => { btnRefs.current[i] = el; }}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          tabIndex={value === tab.value ? 0 : -1}
          onClick={() => onValueChange(tab.value)}
          onKeyDown={e => handleKeyDown(e, i)}
          style={{
            flex: 1,
            height: 30,
            borderRadius: "var(--radius-full)",
            border: "none",
            cursor: "pointer",
            fontSize: "var(--font-size-body-13)",
            fontWeight: value === tab.value ? 500 : 400,
            background: "transparent",
            color: value === tab.value ? "var(--fg)" : "var(--muted-fg)",
            transition: "color .15s",
            fontFamily: "var(--font-family-body)",
            position: "relative",
            zIndex: 1,
            outline: "none",
          }}
        >
          {value === tab.value && (
            <motion.div
              layoutId={`pill-tab-indicator-${id}`}
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: "var(--radius-full)",
                background: "var(--bg)",
                boxShadow: "0 0 2px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.08)",
                zIndex: -1,
              }}
              transition={
                reduced
                  ? { duration: 0 }
                  : { type: "spring", stiffness: 400, damping: 32 }
              }
            />
          )}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
