import React from "react";

interface CrdProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export function Crd({ children, style }: CrdProps) {
  return (
    <div
      style={{
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-2xl)",
        background: "var(--bg)",
        overflow: "hidden",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export function CrdHeader({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

export function CrdBody({ children }: { children: React.ReactNode }) {
  return <div style={{ padding: "var(--space-4) var(--space-5)" }}>{children}</div>;
}

export function CrdFooter({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: "var(--space-3) var(--space-5)",
        borderTop: "1px solid var(--border)",
        background: "var(--muted)",
      }}
    >
      {children}
    </div>
  );
}

export function CrdTitle({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"], fontSize: "var(--font-size-body-15)", color: "var(--fg)", marginBottom: "var(--space-1)" }}>
      {children}
    </div>
  );
}

export function CrdDesc({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: "var(--font-size-label-12)", color: "var(--muted-fg)" }}>{children}</div>;
}
