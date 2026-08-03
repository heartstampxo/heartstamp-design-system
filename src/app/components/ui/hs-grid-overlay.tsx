import React, { useCallback, useEffect, useState } from "react";
import { Grid3x3 } from "lucide-react";
import { Btn } from "./btn";
import { FONT_BODY, SUBTLE_BORDER } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Grid Overlay
   Column guide for design QA, plus a sticky inspector bar so
   developers and marketing can toggle it and read the live grid
   values while they scroll.

   ·  GridOverlay   — the red column guide (styles live in grid.css)
   ·  GridInspector — the bar: toggle, breakpoint readout, shortcut

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

/* ── Bar ────────────────────────────────────────────────────────────
   Three elements only — action, headline, shortcut — so the eye lands on
   the toggle first. The per-breakpoint numbers are held back until the
   grid is actually on, since they are only useful once you are reading
   columns against content.

   The bar must outrank the overlay (z-index 9000 in grid.css), or the red
   columns paint straight over the control that turns them off.
──────────────────────────────────────────────────────────────────── */

const OVERLAY_Z = 9000;

const barBase: React.CSSProperties = {
  position: "sticky",
  top: 0,
  zIndex: OVERLAY_Z + 1,
  display: "flex",
  alignItems: "center",
  gap: "var(--space-3, 12px)",
  padding: "var(--space-2, 8px) var(--space-3, 12px)",
  marginBottom: "var(--space-4, 16px)",
  borderRadius: "var(--radius-xl, 10px)",
  // Opaque, so the overlay behind it never bleeds through
  background: "var(--color-bg-main, #ffffff)",
  border: SUBTLE_BORDER,
  transition: "background 150ms ease, border-color 150ms ease",
};

/* Active: a brand-tinted wash and edge, so the state reads at a glance
   without competing with the button. */
const barActive: React.CSSProperties = {
  background: "color-mix(in srgb, var(--color-brand-primary, #be1d2c) 4%, var(--color-bg-main, #fff))",
  borderColor: "color-mix(in srgb, var(--color-brand-primary, #be1d2c) 22%, transparent)",
  boxShadow: "0 4px 16px rgba(36, 36, 35, 0.08)",
};

const infoStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 1,
  minWidth: 0,
};

/** Headline — the one value worth reading at a glance. */
const headlineStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-body-13, 13px)",
  fontWeight: 600,
  color: "var(--color-text-primary, #242423)",
  whiteSpace: "nowrap",
};

const dimStyle: React.CSSProperties = {
  fontWeight: 400,
  color: "var(--color-text-secondary, #6e6d6a)",
};

/** Supporting detail, one quiet line rather than four competing pills. */
const detailStyle: React.CSSProperties = {
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12, 12px)",
  color: "var(--color-text-secondary, #6e6d6a)",
  whiteSpace: "nowrap",
};

const kbdStyle: React.CSSProperties = {
  marginLeft: "auto",
  flexShrink: 0,
  padding: "2px var(--space-1-5, 6px)",
  borderRadius: "var(--radius-sm, 6px)",
  border: SUBTLE_BORDER,
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12, 12px)",
  color: "var(--color-text-disabled, #a9a8a4)",
  whiteSpace: "nowrap",
};

export interface GridInspectorProps {
  /** Element (or selector) the overlay should align to. */
  alignTo?: string | HTMLElement | null;
  /** Start with the overlay on. */
  defaultVisible?: boolean;
  /** Bind a keyboard shortcut — Ctrl+G, or Cmd+G on a Mac. Default true. */
  shortcut?: boolean;
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

  const barStyle: React.CSSProperties = {
    ...barBase,
    ...(visible ? barActive : null),
    ...style,
  };

  return (
    <>
      <div className={className} style={barStyle}>
        <Btn
          variant={visible ? "default" : "outline"}
          size="sm"
          onClick={toggle}
          aria-pressed={visible}
        >
          <Grid3x3 size={14} />
          {visible ? "Hide grid" : "Show grid"}
        </Btn>

        <span style={infoStyle} aria-live="polite">
          <span style={headlineStyle}>
            {bp.name} <span style={dimStyle}>· {viewport}px</span>
          </span>
          {/* Held back until the grid is on — noise otherwise */}
          {visible && (
            <span style={detailStyle}>
              {bp.columns} columns · {bp.gutter}px gutter · {bp.margin}px margin
            </span>
          )}
        </span>

        {shortcut && <kbd style={kbdStyle}>⌘G</kbd>}
      </div>

      <GridOverlay visible={visible} alignTo={alignTo} />
    </>
  );
}
