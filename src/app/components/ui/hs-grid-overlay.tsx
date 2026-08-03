import React, { useCallback, useEffect, useState } from "react";
import { Grid3x3 } from "lucide-react";
import { Btn } from "./btn";
import { FONT_BODY, FONT_HEADING } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Grid Overlay
   Column guide for design QA, plus a prominent inspector panel so
   developers and marketing can toggle it and read the live grid values
   while they scroll.

   ·  GridOverlay   — the red column guide (styles live in grid.css)
   ·  GridInspector — the panel: toggle, breakpoint readout, shortcut

   Alignment: the overlay is position:fixed and defaults to the whole
   viewport, which is right on a marketing page. Inside a narrower
   column — a docs shell with a sidebar, an app frame — pass `alignTo`
   and it measures that element, driving --grid-overlay-left/-width.
═══════════════════════════════════════════════════════ */

/* Mirrors the breakpoints in grid.css — keep the two in step. */
export interface GridBreakpoint {
  name: string;
  columns: number;
  gutter: number;
  margin: number;
}

export function gridBreakpointFor(width: number): GridBreakpoint {
  if (width < 768) return { name: "Mobile", columns: 4, gutter: 16, margin: 16 };
  if (width < 1024) return { name: "Tablet", columns: 12, gutter: 16, margin: 16 };
  return { name: "Desktop", columns: 12, gutter: 24, margin: 16 };
}

/** Resolves a selector or element to a node, SSR-safely. */
const resolve = (target?: string | HTMLElement | null): HTMLElement | null => {
  if (!target) return null;
  if (typeof target !== "string") return target;
  return typeof document === "undefined" ? null : document.querySelector<HTMLElement>(target);
};

/* ═══════════════════════════════════════════════════════
   GridOverlay
═══════════════════════════════════════════════════════ */

export interface GridOverlayProps {
  visible?: boolean;
  /** Column count. Defaults to the active breakpoint's. */
  columns?: number;
  /**
   * Element (or selector) whose horizontal bounds the overlay should match.
   * Omit to span the viewport, which suits a page-level marketing grid.
   */
  alignTo?: string | HTMLElement | null;
}

export function GridOverlay({ visible = false, columns, alignTo }: GridOverlayProps) {
  const [box, setBox] = useState<{ left: number; width: number } | null>(null);
  const [viewport, setViewport] = useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );

  /* Track the target's box. It moves on resize, on sidebar collapse, and
     whenever the surrounding layout reflows — so observe, don't measure once. */
  useEffect(() => {
    if (!visible) return;

    const measure = () => {
      setViewport(window.innerWidth);
      const el = resolve(alignTo);
      if (!el) return setBox(null);
      const r = el.getBoundingClientRect();
      setBox({ left: r.left, width: r.width });
    };

    measure();
    window.addEventListener("resize", measure);

    /* ResizeObserver catches the target changing width without the window
       doing so — a sidebar collapsing, a panel opening. Guarded because it is
       absent in jsdom and in older browsers, where an unguarded constructor
       throws inside the effect and takes the whole overlay down. Resize
       handling above still covers the common case. */
    const el = resolve(alignTo);
    const ro =
      el && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && el) ro.observe(el);

    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [visible, alignTo]);

  const count = columns ?? gridBreakpointFor(viewport).columns;

  return (
    <div
      className={`hs-grid-overlay${visible ? " hs-grid-overlay--visible" : ""}`}
      aria-hidden="true"
      style={
        box
          ? ({
              "--grid-overlay-left": `${box.left}px`,
              "--grid-overlay-width": `${box.width}px`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <div className="hs-grid-overlay__track">
        {Array.from({ length: count }, (_, i) => (
          <div key={i} className="hs-grid-overlay__col" />
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   GridInspector
═══════════════════════════════════════════════════════ */

/* ── Panel ──────────────────────────────────────────────────────────
   This is a tool, not a row of page content, and it has to read that way.
   A thin strip of the same weight as everything else around it disappears
   on a page this dense.

   Prominence comes from surface and anchor rather than height: a
   brand-tinted field that is plainly not body copy, a filled icon tile to
   anchor the eye, a named heading, and a full-size button. It stays
   compact vertically so pinning it is not intrusive.

   It must also outrank the overlay (z-index 9000 in grid.css), or the red
   columns paint over the control that dismisses them.
──────────────────────────────────────────────────────────────────── */

const OVERLAY_Z = 9000;

const BRAND = "var(--color-brand-primary, #be1d2c)";
const tint = (pct: number) => `color-mix(in srgb, ${BRAND} ${pct}%, var(--color-bg-main, #fff))`;
const edge = (pct: number) => `color-mix(in srgb, ${BRAND} ${pct}%, transparent)`;

const panelBase: React.CSSProperties = {
  zIndex: OVERLAY_Z + 1,
  display: "flex",
  alignItems: "center",
  gap: "var(--space-3-5, 14px)",
  padding: "var(--space-3, 12px) var(--space-3-5, 14px)",
  marginBottom: "var(--space-6, 24px)",
  borderRadius: "var(--radius-3xl, 14px)",
  // A distinct field, so it never reads as body content
  background: tint(5),
  border: `1px solid ${edge(20)}`,
  transition: "background 150ms ease, border-color 150ms ease, box-shadow 150ms ease",
};

/** On: stronger field and a lift, so the state is unmistakable. */
const panelActive: React.CSSProperties = {
  background: tint(9),
  border: `1px solid ${edge(34)}`,
  boxShadow: "0 6px 20px rgba(190, 29, 44, 0.10)",
};

/** Filled tile — anchors the eye and marks the region as a tool. */
const tileStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: 40,
  height: 40,
  borderRadius: "var(--radius-2xl, 12px)",
  background: BRAND,
  color: "var(--color-text-on-primary, #ffffff)",
};

const infoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  minWidth: 0,
  flex: "1 1 0",
};

const titleStyle: React.CSSProperties = {
  fontFamily: FONT_HEADING,
  fontSize: "var(--font-size-label-sb-15, 15px)",
  fontWeight: 600,
  color: "var(--color-text-primary, #242423)",
  lineHeight: 1.2,
};

/** One line: what it does at rest, the live numbers once it is on. */
const subStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12, 12px)",
  color: "var(--color-text-secondary, #6e6d6a)",
  lineHeight: 1.45,
};

const strongStyle: React.CSSProperties = {
  color: "var(--color-text-primary, #242423)",
  fontWeight: 600,
};

const actionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-2-5, 10px)",
  flexShrink: 0,
};

const kbdStyle: React.CSSProperties = {
  padding: "3px var(--space-1-5, 6px)",
  borderRadius: "var(--radius-sm, 6px)",
  background: "var(--color-bg-main, #ffffff)",
  border: `1px solid ${edge(20)}`,
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12, 12px)",
  color: "var(--color-text-secondary, #6e6d6a)",
  whiteSpace: "nowrap",
};

export interface GridInspectorProps {
  /** Element (or selector) the overlay should align to. */
  alignTo?: string | HTMLElement | null;
  /** Start with the overlay on. */
  defaultVisible?: boolean;
  /** Bind a keyboard shortcut — Ctrl+G, or Cmd+G on a Mac. Default true. */
  shortcut?: boolean;
  /** Pin the panel to the top of the scroller so it stays reachable. Default true. */
  sticky?: boolean;
  title?: string;
  /** Line under the title while the grid is off. */
  description?: string;
  onVisibleChange?: (visible: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Sticky bar that toggles the column guide and reports the live grid values —
 * which breakpoint is active, and the columns, gutter and margin it implies.
 * Stays put while scrolling so the grid can be studied against real content.
 */
export function GridInspector({
  alignTo,
  defaultVisible = false,
  shortcut = true,
  sticky = true,
  title = "Grid inspector",
  description = "Overlay the column guide to check alignment against real content.",
  onVisibleChange,
  style,
  className,
}: GridInspectorProps) {
  const [visible, setVisible] = useState(defaultVisible);
  const [viewport, setViewport] = useState(() =>
    typeof window === "undefined" ? 1200 : window.innerWidth,
  );

  const toggle = useCallback(() => {
    setVisible((v) => {
      onVisibleChange?.(!v);
      return !v;
    });
  }, [onVisibleChange]);

  useEffect(() => {
    const onResize = () => setViewport(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!shortcut) return;
    const onKey = (e: KeyboardEvent) => {
      // Ctrl+G, or Cmd+G on a Mac
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "g") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [shortcut, toggle]);

  const bp = gridBreakpointFor(viewport);

  const panelStyle: React.CSSProperties = {
    ...panelBase,
    ...(sticky ? { position: "sticky", top: 0 } : null),
    ...(visible ? panelActive : null),
    ...style,
  };

  return (
    <>
      <section className={className} style={panelStyle} aria-label={title}>
        <span style={tileStyle} aria-hidden="true">
          <Grid3x3 size={20} strokeWidth={1.75} />
        </span>

        <span style={infoStyle}>
          <span style={titleStyle}>{title}</span>
          {/* At rest, what it does; once on, the live numbers */}
          <span style={subStyle} aria-live="polite">
            {visible ? (
              <>
                <span style={strongStyle}>{bp.name}</span> · {viewport}px ·{" "}
                <span style={strongStyle}>{bp.columns}</span> columns ·{" "}
                {bp.gutter}px gutter · {bp.margin}px margin
              </>
            ) : (
              description
            )}
          </span>
        </span>

        <span style={actionsStyle}>
          {shortcut && <kbd style={kbdStyle}>⌘G</kbd>}
          <Btn variant={visible ? "default" : "outline"} onClick={toggle} aria-pressed={visible}>
            {visible ? "Hide grid" : "Show grid"}
          </Btn>
        </span>
      </section>

      <GridOverlay visible={visible} alignTo={alignTo} />
    </>
  );
}
