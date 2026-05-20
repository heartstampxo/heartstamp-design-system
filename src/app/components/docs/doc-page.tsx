import React from "react";
import { CopyLinkButton, CopySectionLinkButton } from "./doc-copy-link";

interface DocPageProps {
  title: string;
  subtitle?: string;
  sourceSlug?: string;
  /** Direct link to the Figma component or frame for this page */
  figmaUrl?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

function FigmaIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={Math.round(size * 1.5)} viewBox="0 0 100 150" fill="none" aria-hidden="true">
      <path d="M50 50H25A25 25 0 0 1 25 0H50Z"                             fill="#F24E1E" />
      <path d="M50 0H75A25 25 0 0 1 75 50H50Z"                             fill="#FF7262" />
      <path d="M0 75A25 25 0 0 1 25 50H50V100H25A25 25 0 0 1 0 75Z"       fill="#A259FF" />
      <circle cx="75" cy="75" r="25"                                        fill="#1ABCFE" />
      <path d="M50 100V125A25 25 0 0 1 0 125V100Z"                         fill="#0ACF83" />
    </svg>
  );
}

export function DocPage({ title, subtitle, sourceSlug, figmaUrl, children, style }: DocPageProps) {
  return (
    <div style={{ transition: "background 0.15s ease, color 0.15s ease", ...style }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: "var(--space-1-5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--fg)", letterSpacing: "-.02em" }}>{title}</h1>
            <CopyLinkButton />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginTop: "var(--space-1-5)" }}>
            {figmaUrl && (
              <a
                href={figmaUrl}
                target="_blank"
                rel="noreferrer"
                className="hs-figma-link"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "4px 9px", borderRadius: 6,
                  border: "1px solid var(--color-element-subtle)",
                  background: "transparent",
                  color: "var(--color-text-secondary)",
                  fontSize: 11.5, textDecoration: "none", whiteSpace: "nowrap",
                  fontFamily: "var(--font-family-body, 'DM Sans', system-ui, sans-serif)",
                }}
                aria-label={`Open ${title} in Figma`}
              >
                <FigmaIcon size={11} />
                Figma ↗
              </a>
            )}
            {sourceSlug && (
              <a
                href={`https://ui.shadcn.com/docs/components/${sourceSlug}`}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: 11.5, color: "var(--muted-fg)", textDecoration: "underline", whiteSpace: "nowrap" }}
              >
                Shadcn docs ↗
              </a>
            )}
          </div>
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

function slugify(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function DocSection({ title, desc, action, children }: DocSectionProps) {
  const id = slugify(title);
  return (
    <section id={id} style={{ marginBottom: "var(--space-12)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</h2>
            <CopySectionLinkButton sectionId={id} />
          </div>
          {desc && <p style={{ margin: "4px 0 0", fontSize: 13, color: "var(--muted-fg)" }}>{desc}</p>}
        </div>
        {action && <div style={{ flexShrink: 0 }}>{action}</div>}
      </div>
      {children}
    </section>
  );
}
