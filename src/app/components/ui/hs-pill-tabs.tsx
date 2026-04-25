import React from "react";

export interface PillTabItem {
  value: string;
  label: string;
}

export interface PillTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: PillTabItem[];
  style?: React.CSSProperties;
}

export function PillTabs({ value, onValueChange, tabs, style }: PillTabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: "flex",
        background: "var(--muted)",
        borderRadius: "var(--radius-full)",
        padding: "var(--space-1)",
        ...style,
      }}
    >
      {tabs.map(tab => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={value === tab.value}
          onClick={() => onValueChange(tab.value)}
          style={{
            flex: 1,
            height: 30,
            borderRadius: "var(--radius-full)",
            border: "none",
            cursor: "pointer",
            fontSize: "var(--font-size-body-13)",
            fontWeight: value === tab.value ? 500 : 400,
            background: value === tab.value ? "var(--bg)" : "transparent",
            color: value === tab.value ? "var(--fg)" : "var(--muted-fg)",
            boxShadow: value === tab.value
              ? "0 0 2px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.08)"
              : "none",
            transition: "background .15s, color .15s, box-shadow .15s",
            fontFamily: "inherit",
          }}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
