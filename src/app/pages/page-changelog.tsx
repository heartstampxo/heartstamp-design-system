import React from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";

/* ═══════════════════════════════════════════════════════════
   CHANGELOG DATA
   ─────────────────────────────────────────────────────────
   Newest first. Patch versions publish automatically on every
   push to main, so consecutive housekeeping releases are rolled
   up into ranges. Add a new entry (or extend the top one) in the
   same push as the change it describes.
═══════════════════════════════════════════════════════════ */

type Release = {
  version: string;   // "2.1.41" or a rollup like "2.1.28 – 2.1.33"
  date: string;      // "1 Sep 2026"
  title: string;
  tags: string[];    // keys of TAG_STYLES
  items: string[];
};

const TAG_STYLES: Record<string, { bg: string; color: string }> = {
  feature: { bg: "rgba(16,185,129,.13)",  color: "#10b981" },
  fix:     { bg: "rgba(245,158,11,.13)",  color: "#f59e0b" },
  tokens:  { bg: "rgba(190,29,44,.10)",   color: "#be1d2c" },
  design:  { bg: "rgba(139,92,246,.13)",  color: "#8b5cf6" },
  docs:    { bg: "rgba(59,130,246,.13)",  color: "#3b82f6" },
  perf:    { bg: "rgba(20,184,166,.13)",  color: "#14b8a6" },
  major:   { bg: "rgba(239,68,68,.13)",   color: "#ef4444" },
};

const RELEASES: Release[] = [
  {
    version: "2.1.46 – 2.1.47", date: "1 Sep 2026",
    title: "Sidebar spacing",
    tags: ["design"],
    items: [
      "Nav rows get 2px vertical gaps between them.",
    ],
  },
  {
    version: "2.1.45", date: "1 Sep 2026",
    title: "Sidebar upgrade",
    tags: ["feature", "design"],
    items: [
      "Exactly one sidebar group stays open; opening another closes the current one, and the open group follows the active page. The Accordion component gains a collapsible prop (default true) to support this.",
      "Sidebar widened from 220px to 320px on desktop (280px mobile drawer).",
      "Group headers show item counts; the version footer now opens this changelog.",
      "On mobile, picking a page closes the drawer.",
    ],
  },
  {
    version: "2.1.44", date: "1 Sep 2026",
    title: "Sidebar readability",
    tags: ["design", "docs"],
    items: [
      "Sidebar nav rows bumped from Label 12 to Label 15; the search input follows the standard input size token.",
      "Group eyebrow titles and the version footer stay at Label 12 by design.",
    ],
  },
  {
    version: "2.1.43", date: "1 Sep 2026",
    title: "Hardcoded font-size sweep",
    tags: ["tokens", "fix"],
    items: [
      "Published components now use type tokens: chat bubbles and popover fields moved off 14px to Body 15 / input tokens, panel titles snapped to H5, tabs and mascot labels to the Label tokens.",
      "Docs: chatbot page descriptions and the remaining 14px labels mapped to Body 15 / Label 15.",
      "Changelog page body copy bumped to Body 15 and Label SB 15 for readability.",
      "Badge numerals (10px) remain an intentional sub-label exception, documented in code.",
    ],
  },
  {
    version: "2.1.42", date: "1 Sep 2026",
    title: "Changelog page",
    tags: ["docs"],
    items: [
      "This page: a curated release timeline under Getting Started, with category tags and housekeeping bumps rolled up into version ranges.",
      "Promo font note corrected: Oldstyle Italic HPLHS is a free HPLHS face, not a licensed one.",
    ],
  },
  {
    version: "2.1.41", date: "1 Sep 2026",
    title: "Typography token sync with Figma",
    tags: ["tokens", "docs"],
    items: [
      "Line-height tokens (--line-height-*) for every text style, sourced from the updated textStyles.json export.",
      "Reusable font-weight scale: --font-weight-light (300) through --font-weight-bold (700).",
      "New H6 heading level: 16px / 24px line height, with element defaults in theme.css.",
      "Three Promo text styles in Oldstyle Italic HPLHS (free HPLHS face, EB Garamond italic fallback until bundled).",
      "H3 and H4 negative letter-spacing removed per the updated Figma spec (was -4% / -2%, now 0).",
      "Typography Tokens docs page: line-height columns, weight variants per heading, Promo section and family card.",
    ],
  },
  {
    version: "2.1.40", date: "22 Aug 2026",
    title: "Dynamic grid: wide tier",
    tags: ["feature", "tokens"],
    items: [
      "The page grid track is no longer fixed at 1200px: viewports 2000px and up now get a 1400px track (12 columns, 24px gutters).",
      "Token-driven via --grid-max-width, so consumers importing tokens.css alongside grid.css pick up the wide tier automatically.",
    ],
  },
  {
    version: "2.1.38 – 2.1.39", date: "8 Aug 2026",
    title: "Bundle-size pass",
    tags: ["perf"],
    items: [
      "Optimised images, modularised imports, and removed unused libraries.",
      "Restored the fflate devDependency used by the demo zip export.",
    ],
  },
  {
    version: "2.1.34 – 2.1.37", date: "7 – 8 Aug 2026",
    title: "Loader fix (ENG-1457)",
    tags: ["fix"],
    items: [
      "Iterative fixes to the loader behaviour tracked under ENG-1457.",
    ],
  },
  {
    version: "2.1.28 – 2.1.33", date: "3 – 4 Aug 2026",
    title: "Grid Inspector",
    tags: ["feature", "fix", "design"],
    items: [
      "Sticky grid-inspector overlay for verifying column alignment, with a pure toggle and a documented component API.",
      "Dark mode treatment for the inspector tool region.",
      "grid.css added to the package exports; CSS setup docs corrected.",
    ],
  },
  {
    version: "2.1.26 – 2.1.27", date: "30 Jul 2026",
    title: "Formatting Toolbar and Coaching Tips",
    tags: ["feature", "fix"],
    items: [
      "New Formatting Toolbar component with its popovers, plus the Coaching Tips component.",
      "Accessibility and responsive fixes: real interaction states, mobile width cap, restored hover / toggle / alignment feedback.",
      "Five referenced-but-missing tokens defined; dropdown menus in fixed mode now size to their content.",
      "Test suite repaired: jsdom canvas stub and Testing Library cleanup.",
    ],
  },
  {
    version: "2.1.23 – 2.1.25", date: "22 – 28 Jul 2026",
    title: "StampyPromotions polish",
    tags: ["feature", "fix"],
    items: [
      "Card artwork, super-like Lottie animation, reward input, and skip-to-back auto-advance for the promotions deck.",
      "inputLeading slot added to the Stampy overflow menu input.",
    ],
  },
  {
    version: "2.1.20 – 2.1.22", date: "19 – 21 Jul 2026",
    title: "Marketing page grid system",
    tags: ["feature", "tokens", "docs"],
    items: [
      "12-column responsive grid: tokens, grid.css, and a Grid System docs page.",
      "Grid System moved into the Getting Started section of the sidebar.",
    ],
  },
  {
    version: "2.1.15 – 2.1.19", date: "10 – 15 Jul 2026",
    title: "Color token cleanup and promotions deck",
    tags: ["feature", "tokens", "fix"],
    items: [
      "StampyPromotions swipeable card deck component.",
      "--color-text-link token introduced (renamed from --color-text-brand); Color Tokens page synced to top-nav dark mode.",
      "Button primary-ghost dark mode fix; link variant now uses --color-text-link.",
    ],
  },
  {
    version: "2.1.13 – 2.1.14", date: "22 Jun 2026",
    title: "React 19",
    tags: ["major", "fix"],
    items: [
      "Libraries and code updated for React 19.",
      "ProfileNav labels updated: My drafts, My favorites, My orders.",
    ],
  },
  {
    version: "2.1.4 – 2.1.12", date: "5 – 11 Jun 2026",
    title: "Mascot page and chatbot overflow menus",
    tags: ["feature", "design"],
    items: [
      "Mascot page with anatomy slider and asset grids.",
      "Iteration series on the Stampy chatbot overflow menus (show more / hide skip behaviours).",
    ],
  },
  {
    version: "2.1.1 – 2.1.3", date: "21 May 2026",
    title: "v2.1: button builder and docs polish",
    tags: ["feature", "docs", "tokens"],
    items: [
      "Button Builder extracted to its own page; bug fixes and token cleanup.",
      "Figma component link added to every DocPage header.",
      "Installation docs updated for v2.1 accuracy.",
    ],
  },
  {
    version: "2.0.1", date: "20 May 2026",
    title: "v2: per-component CSS architecture",
    tags: ["major", "tokens"],
    items: [
      "CSS split into tokens.css plus per-component files (starting with btn.css), replacing the single bundled stylesheet as the primary consumption path.",
    ],
  },
];

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */

function TagBadge({ tag }: { tag: string }) {
  const s = TAG_STYLES[tag] ?? TAG_STYLES.feature;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", padding: "1px 8px", borderRadius: 99,
      fontSize: 10, fontWeight: 600, letterSpacing: ".03em", textTransform: "uppercase" as const,
      background: s.bg, color: s.color,
    }}>
      {tag}
    </span>
  );
}

export function PageChangelog() {
  return (
    <DocPage
      title="Changelog"
      subtitle="What changed in the design system, release by release. Every push to main publishes a patch version automatically; the notable changes are curated here, newest first. Housekeeping releases are rolled up into version ranges."
    >
      <DocSection title="Releases">
        <div style={{ position: "relative", paddingLeft: 24 }}>
          {/* timeline rail */}
          <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "var(--border)", borderRadius: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            {RELEASES.map((r, i) => (
              <div key={r.version} style={{ position: "relative" }}>
                {/* timeline dot */}
                <div style={{
                  position: "absolute", left: -24, top: 5, width: 12, height: 12, borderRadius: 99,
                  background: i === 0 ? "var(--accent)" : "var(--bg)",
                  border: i === 0 ? "2px solid var(--accent)" : "2px solid var(--border)",
                  boxSizing: "border-box" as const,
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const, marginBottom: 6 }}>
                  <code style={{
                    fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#be1d2c",
                    background: "rgba(190,29,44,0.08)", padding: "2px 9px", borderRadius: 99,
                  }}>v{r.version}</code>
                  {i === 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".04em", textTransform: "uppercase" as const, color: "var(--accent)" }}>Latest</span>
                  )}
                  <span style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>{r.date}</span>
                  <span style={{ display: "flex", gap: 4, flexWrap: "wrap" as const }}>
                    {r.tags.map(t => <TagBadge key={t} tag={t} />)}
                  </span>
                </div>
                <div style={{ fontSize: "var(--font-size-label-sb-15)", fontWeight: "var(--font-weight-label-sb-15)" as any, color: "var(--fg)", marginBottom: 6 }}>{r.title}</div>
                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
                  {r.items.map(item => (
                    <li key={item} style={{ fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, color: "var(--muted-fg)", lineHeight: 1.55 }}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p style={{ fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, color: "var(--muted-fg)", margin: "24px 0 0", lineHeight: 1.6 }}>
          Earlier history (v1.x: the Stampy chatbot suite, pill tabs, profile nav, style sidebar, and the original component set) lives in the{" "}
          <a href="https://github.com/heartstampxo/heartstamp-design-system/commits/main" target="_blank" rel="noreferrer" style={{ color: "var(--accent)" }}>
            GitHub commit log
          </a>.
        </p>
      </DocSection>
    </DocPage>
  );
}
