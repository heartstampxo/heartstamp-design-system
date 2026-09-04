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
  tokens:  { bg: "rgba(190,29,44,.10)",   color: "var(--accent)" },
  design:  { bg: "rgba(139,92,246,.13)",  color: "#8b5cf6" },
  docs:    { bg: "rgba(59,130,246,.13)",  color: "#3b82f6" },
  perf:    { bg: "rgba(20,184,166,.13)",  color: "#14b8a6" },
  major:   { bg: "rgba(239,68,68,.13)",   color: "#ef4444" },
};

const RELEASES: Release[] = [
  {
    version: "2.1.57", date: "4 Sep 2026",
    title: "WebsiteNavV2: overridable grid track",
    tags: ["fix", "docs"],
    items: [
      "WebsiteNavV2's content track is now overridable per nav, through --nav-track-max and --nav-track-margin. Both are unset by default and fall through to --grid-max-width / --grid-margin, so nothing changes for a consumer who does not touch them and the bar still picks up the 1400px wide tier on its own at viewports of 2000px and up. The rows, the mega panel grid and the rail hairline all read the same pair, so they cannot drift apart.",
      "Why it exists: the grid's contract is that --grid-max-width is the OUTER width of the track and --grid-margin is subtracted from inside it, so content lands at 1168px on the 1200px tier and matches .hs-page-grid exactly. A page whose own grid measures 1200px to the content box is 32px wider, which put the bar 16px in from the page on each side and scrolled the last category out of the strip with no scrollbar to show for it, since the category row hides its own. The only fix available was to redefine --grid-margin page-wide, which retunes every grid consumer in the subtree, and pinning --grid-max-width alongside it severed the wide tier so the bar stayed at 1200px while the page went to 1400px.",
      "The two properties are deliberately not declared on .hs-nav-v2. The nav is a descendant of whatever scope a consumer overrides on, so a default declared on the component itself would beat the inherited value and the override would silently do nothing. The defaults live in the var() fallback chain at each usage site instead, and a contract test now holds them there.",
      "Grid docs: --grid-max-width was described in the token table as the maximum content width, which is the opposite of what it does and the most likely reason a consumer expects 1200px of content and does not get it. It is now named as the outer track width, with the content arithmetic spelled out. The Website Navigation page gained the alignment recipe.",
      "Red interactive text now uses the Link role rather than the brand red: the mega menu's filters and items, the category links' hover and active states, and Notification's Mark all as read. The two are the same #be1d2c in light mode, so nothing moves there, but dark mode splits them and Link's lighter #f54051 is the legible one against a dark ground.",
      "WebsiteNavV2's bare-button reset now zeroes background, padding and margin, matching the one Notification already shipped. Without them every mega-menu filter and item kept the browser's default ButtonFace grey behind it and the default 1px 6px padding, so the panel drew a grey chip behind each label and pushed them 6px right of the column heading they align under. The language dropdown rows and the promo tile's absolutely positioned contents were affected the same way. The docs app never showed any of it because Tailwind's preflight already zeroes all three; a consumer without a preflight saw it on first mount. A contract test now holds both sheets to a standalone-safe reset.",
    ],
  },
  {
    version: "2.1.56", date: "2 Sep 2026",
    title: "WebsiteNavV2: mega menu, language, reminders, mobile",
    tags: ["feature", "design", "fix"],
    items: [
      "Mega menu, from the mega-menu handoff: the panel drops out of the category row on hover with a filter rail, four link columns and a promo tile. Switching categories swaps the dataset without closing, leaving the row closes after a 140ms grace period so the pointer can cross the gap, focus opens it exactly as hover does, and Escape closes at once. Eleven datasets ship as the default and are overridable via megaMenus; onMegaSelect reports the category alongside the filter, item or promo clicked. Production has no mobile mega menu, so the compact bar drops the row and the panel with it.",
      "Language dropdown on the globe: 167px card with an inset hairline ring under the shadow, staggered pop-in, radio semantics and a check on the active row. Wired through languages / language / onLanguageChange.",
      "Reminders sidebar on the Reminders action, built on the design system's own Sheet (direction=right) so the overlay, slide, focus handling and close button come from one place. The nav supplies the contents plus the spec's 456px width and off-white ground.",
      "The notification tray now opens from the nav's bell. Notification ships its own trigger, so the nav's duplicate bell was removed rather than a second one added; the two were already pixel-identical. Notification gained an additive onOpenChange so the nav can react to the panel opening.",
      "One component covers both layouts. WebsiteNavV2 measures its own box and swaps to a compact 56px bar below 768px, so a caller mounts it once and needs no second import. It measures itself rather than the viewport, so it also collapses inside a narrow frame on a wide screen; mobile forces the phone layout for design review.",
      "Scroll auto-hide on the compact bar, phone only, skipped under reduced motion and paused while any surface is open, since transforming the nav would drag the fixed tray and sheet along with it.",
      "Accessibility fix with wider reach than the nav: cssMin stripped whitespace on both sides of a colon, which collapsed \".root :focus-visible\" to \".root:focus-visible\" and silently moved the focus ring off every child and onto the root. Keyboard focus outlines were missing throughout WebsiteNavV2 and the notification tray. Colons are now stripped on the trailing side only.",
      "The closed mega panel no longer holds ~40 buttons in the tab order: pointer-events does not remove focusability, so the closed state now carries visibility:hidden and aria-hidden, with a delayed transition so the collapse still animates. A dataset taller than the fixed 372px drop now scrolls, which the code comment had always claimed but nothing implemented.",
      "Hardening: the category-keyed dataset maps are read with own-property lookups. megaMenus is documented as CMS-fed, and a label of \"__proto__\", \"constructor\" or \"toString\" previously resolved to an inherited member of Object, defeated the fallback and crashed the panel.",
      "The notification sheet's phone offset now reads the nav bar's own height (--notif-m-top resolves to --nav-m-h) instead of a hardcoded 46px that predated the compact bar, so the two cannot drift.",
      "Sheet gained an optional container prop, forwarded to its portal, so a sheet can be bounded inside a docs preview or device frame instead of the viewport.",
      "Docs Preview: desktop is the default viewport again, and the full-screen button is a real Fullscreen API toggle rather than a second 100% width preset that did nothing.",
    ],
  },
  {
    version: "2.1.55", date: "1 Sep 2026",
    title: "Notification component",
    tags: ["feature"],
    items: [
      "New Notification component from the approved standalone: bell trigger with unread dot, pop-in panel with staggered rows, per-row kebab menus (mark as unread, archive), Mark all as read, optional Show more link and delivery-progress strip.",
      "On touch screens or narrow viewports, rows swipe right to mark read and left to archive, revealing the action panes.",
      "Data-driven via NotificationItem[]; documented under Feedback & Status; exported from the package root and the /hs entry.",
      "NotificationRow is exported for standalone composition; the docs show read / unread states and the delivery progress at every stage.",
      "Mobile: under 768px the panel becomes a full-height sheet below the header, and the mobile prop forces the phone presentation (and mouse swipe) at any width, shown in a device frame on the docs page.",
      "QA + security pass: component stylesheets are now minified at load and injected into <head> once per component type (ref-counted, useInsertionEffect, no paint flash, animations untouched); removed the unused react-router dependency, clearing the only high-severity production vulnerability; all dangerouslySetInnerHTML sites reviewed as static bundled content.",
    ],
  },
  {
    version: "2.1.53", date: "1 Sep 2026",
    title: "WebsiteNavV2 (testing phase)",
    tags: ["feature", "design"],
    items: [
      "Next-generation website navigation, in validation on the Website Navigation page: typewriter search pill with ⌘K shortcut, Apple-mark Get the App, Reminders, language / notifications / cart buttons, category strip with mega-panel hover hooks, and the Ask Stampy AI chip with twin sheen sweeps.",
      "Dogfoods HSLogo, Kbd, and Avt; both rows ride the marketing grid track; reduced-motion disables the caret and sheens.",
      "HSLogo no longer clips its edge-to-edge artwork at small sizes (overflow: visible on all variants).",
      "Copy-paste audit across every component page: all 57 code-sample imports now use @heartstampxo/design-system (the pre-rename @heartstamp scope and internal @/ paths are gone), the copy button's import rewriter targets the right package, the Toast sample uses the real Toaster + sonner API instead of a nonexistent useToast hook, and all 48 sampled symbols are verified against the built package exports.",
    ],
  },
  {
    version: "2.1.52", date: "1 Sep 2026",
    title: "Docs site on the grid",
    tags: ["fix", "design"],
    items: [
      "On wide viewports the grid overlay stayed at 1200px while the inspector readout correctly said 1400px: the docs app never imported tokens.css, which carries the 2000px media override for --grid-max-width. The grid tokens and wide-tier media query now also live in the docs theme.css.",
      "The docs content column now rides the grid track itself: --grid-max-width wide with the grid's 16px margins (was a hardcoded 1140px), so pages widen to 1400px on the wide tier and align with the GridInspector overlay.",
    ],
  },
  {
    version: "2.1.51", date: "1 Sep 2026",
    title: "Token audit: Tailwind values and docs chrome",
    tags: ["tokens", "docs"],
    items: [
      "Stampy chat suite and shadcn primitives: arbitrary Tailwind px values (text-[15px], leading-[20px], gap-[8px], rounded-[12px], ...) now reference the existing tokens via var().",
      "Docs app: ~400 hardcoded sizes, weights, radii, and spacing values snapped to their exact token equivalents; code samples now demonstrate token usage too.",
      "Left by policy: sub-12px micro chrome and off-scale one-offs (17, 22, 26px, 20px radii) that have no token equivalent.",
    ],
  },
  {
    version: "2.1.50", date: "1 Sep 2026",
    title: "Token audit: colors, weights, shadows",
    tags: ["tokens", "fix"],
    items: [
      "All numeric font weights in published components moved to the --font-weight-* scale (52 spots); shadows matching the scale moved to --shadow-* tokens.",
      "Button Builder destructive preview matched the shipped button: it now uses the error token instead of a stray #ef4444.",
      "Docs: 44 hardcoded accent reds replaced with var(--accent) / var(--accent-subtle), fixing the wrong red in dark mode.",
      "Intentional literals (brand palettes, swatch data, the white paper zone, mascot ground, switch thumb) documented in code as deliberate exceptions.",
    ],
  },
  {
    version: "2.1.49", date: "1 Sep 2026",
    title: "Docs body text on tokens",
    tags: ["tokens", "docs"],
    items: [
      "Page subtitles were hardcoded at 14px in the shared DocPage component; they now use Body 15, and section descriptions use the Body 13 token.",
    ],
  },
  {
    version: "2.1.46 – 2.1.48", date: "1 Sep 2026",
    title: "Sidebar spacing",
    tags: ["design"],
    items: [
      "Nav rows get 2px vertical gaps between them.",
      "Sidebar width settled at 280px on all viewports.",
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
      display: "inline-flex", alignItems: "center", padding: "1px 8px", borderRadius: "var(--radius-full)",
      fontSize: 10, fontWeight: "var(--font-weight-semibold, 600)" as any, letterSpacing: ".03em", textTransform: "uppercase" as const,
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
        <div style={{ position: "relative", paddingLeft: "var(--space-6)" }}>
          {/* timeline rail */}
          <div style={{ position: "absolute", left: 5, top: 6, bottom: 6, width: 2, background: "var(--border)", borderRadius: 1 }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-7)" }}>
            {RELEASES.map((r, i) => (
              <div key={r.version} style={{ position: "relative" }}>
                {/* timeline dot */}
                <div style={{
                  position: "absolute", left: -24, top: 5, width: 12, height: 12, borderRadius: "var(--radius-full)",
                  background: i === 0 ? "var(--accent)" : "var(--bg)",
                  border: i === 0 ? "2px solid var(--accent)" : "2px solid var(--border)",
                  boxSizing: "border-box" as const,
                }} />
                <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2-5)", flexWrap: "wrap" as const, marginBottom: "var(--space-1-5)" }}>
                  <code style={{
                    fontFamily: "monospace", fontSize: "var(--font-size-label-12)", fontWeight: "var(--font-weight-bold, 700)" as any, color: "var(--accent)",
                    background: "var(--accent-subtle)", padding: "2px 9px", borderRadius: "var(--radius-full)",
                  }}>v{r.version}</code>
                  {i === 0 && (
                    <span style={{ fontSize: 10, fontWeight: "var(--font-weight-bold, 700)" as any, letterSpacing: ".04em", textTransform: "uppercase" as const, color: "var(--accent)" }}>Latest</span>
                  )}
                  <span style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>{r.date}</span>
                  <span style={{ display: "flex", gap: "var(--space-1)", flexWrap: "wrap" as const }}>
                    {r.tags.map(t => <TagBadge key={t} tag={t} />)}
                  </span>
                </div>
                <div style={{ fontSize: "var(--font-size-label-sb-15)", fontWeight: "var(--font-weight-label-sb-15)" as any, color: "var(--fg)", marginBottom: "var(--space-1-5)" }}>{r.title}</div>
                <ul style={{ margin: 0, paddingLeft: 18, display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
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
