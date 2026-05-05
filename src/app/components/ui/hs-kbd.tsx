import React from "react";

/* ─────────────────────────────────────────────────────────────
   hs-kbd — HeartStamp Keyboard component
   Matches Shadcn KBD visual style using design system tokens.
   Exports: Kbd (single key) · KbdGroup (multiple keys with separator)
───────────────────────────────────────────────────────────────*/

interface KbdProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

/** Single keyboard key */
export function Kbd({ children, style }: KbdProps) {
  return (
    <kbd
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-element-subtle)",
        color: "var(--color-text-secondary)",
        fontFamily: "monospace",
        fontSize: "var(--font-size-label-12)",
        fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
        lineHeight: 1,
        padding: "var(--space-1) var(--space-1-5)",
        borderRadius: "var(--radius-xs)",
        userSelect: "none",
        whiteSpace: "nowrap",
        minWidth: 22,
        ...style,
      }}
    >
      {children}
    </kbd>
  );
}

interface KbdGroupProps {
  children: React.ReactNode;
  /** Separator between keys — defaults to "+" */
  separator?: string;
  style?: React.CSSProperties;
}

/** Groups multiple Kbd keys with a separator */
export function KbdGroup({ children, separator = "+", style }: KbdGroupProps) {
  const keys = React.Children.toArray(children);

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "var(--space-1)",
        ...style,
      }}
    >
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          {i > 0 && (
            <span
              style={{
                fontSize: "var(--font-size-label-12)",
                color: "var(--color-element-subtle)",
                userSelect: "none",
              }}
            >
              {separator}
            </span>
          )}
          {key}
        </React.Fragment>
      ))}
    </span>
  );
}
