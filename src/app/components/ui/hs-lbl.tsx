import React from "react";

interface LblProps {
  children: React.ReactNode;
  htmlFor?: string;
  style?: React.CSSProperties;
}

export function Lbl({ children, style, htmlFor }: LblProps) {
  return (
    <label
      htmlFor={htmlFor}
      style={{
        fontSize: "var(--font-size-body-13)",
        fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
        color: "var(--color-text-primary)",
        display: "block",
        marginBottom: "var(--space-1)",
        lineHeight: 1.4,
        ...style,
      }}
    >
      {children}
    </label>
  );
}
