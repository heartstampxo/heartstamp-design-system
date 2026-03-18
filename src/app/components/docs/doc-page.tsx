import React from "react";

interface DocPageProps {
  title: string;
  subtitle?: string;
  sourceSlug?: string;
  children: React.ReactNode;
}

export function DocPage({ title, subtitle, sourceSlug, children }: DocPageProps) {
  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--fg)", letterSpacing: "-.02em" }}>{title}</h1>
          {sourceSlug && (
            <a
              href={`https://ui.shadcn.com/docs/components/${sourceSlug}`}
              target="_blank"
              rel="noreferrer"
              style={{ fontSize: 11.5, color: "var(--muted-fg)", textDecoration: "underline", marginTop: 6, whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Shadcn docs ↗
            </a>
          )}
        </div>
        {subtitle && (
          <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted-fg)", lineHeight: 1.7, maxWidth: 540 }}>{subtitle}</p>
        )}
        <div style={{ height: 1, background: "var(--border)" }} />
      </div>
      {children}
    </div>
  );
}

interface DocSectionProps {
  title: string;
  desc?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}

export function DocSection({ title, desc, action, children }: DocSectionProps) {
  return (
    <section style={{ marginBottom: "var(--space-12)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</h2>
          {desc && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted-fg)" }}>{desc}</p>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {children}
    </section>
  );
}
