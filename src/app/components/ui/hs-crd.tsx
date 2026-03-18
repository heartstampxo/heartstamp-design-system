import React from "react";

/* HeartStamp — Card family primitives */

export function Crd({ children, style }: any) {
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

export function CrdHeader({ children }: any) {
  return (
    <div style={{ padding: "var(--space-4) var(--space-5)", borderBottom: "1px solid var(--border)" }}>
      {children}
    </div>
  );
}

export function CrdBody({ children }: any) {
  return <div style={{ padding: "var(--space-4) var(--space-5)" }}>{children}</div>;
}

export function CrdFooter({ children }: any) {
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

export function CrdTitle({ children }: any) {
  return (
    <div style={{ fontWeight: 700, fontSize: "var(--font-size-body-15)", color: "var(--fg)", marginBottom: 2 }}>
      {children}
    </div>
  );
}

export function CrdDesc({ children }: any) {
  return <div style={{ fontSize: 12.5, color: "var(--muted-fg)" }}>{children}</div>;
}
