import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import {
  Menu, Undo2, Redo2, Eye, ShoppingCart,
  SaveAll, Plus, Palette, Trash2,
  ChevronDown, EllipsisVertical, Minus, Maximize2,
} from "lucide-react";
import { Btn } from "./btn";
import { Bdg } from "./hs-bdg";
import { Sep } from "./hs-sep";
import { HSLockup, HSEmblem } from "./hs-logo";

/* ── Constants ───────────────────────────────────────────────── */

/** Mobile command strip — short labels fit the draggable row */
const MOBILE_COMMAND_ITEMS = [
  { Icon: SaveAll, label: "Save as copy" },
  { Icon: Plus,    label: "New Card"     },
  { Icon: Palette, label: "My Cards"     },
  { Icon: Trash2,  label: "Delete"       },
] as const;

/** Desktop dropdown — full labels */
const DESKTOP_COMMAND_ITEMS = [
  { Icon: SaveAll, label: "Save as copy" },
  { Icon: Plus,    label: "New Card"     },
  { Icon: Palette, label: "My Cards"     },
  { Icon: Trash2,  label: "Delete Card"  },
] as const;

/* ── Shared dropdown item style ─────────────────────────────── */
const dropdownItemStyle: React.CSSProperties = {
  width: "100%",
  justifyContent: "flex-start",
  gap: 8,
  borderRadius: "var(--radius-sm)",
  border: "none",
  height: 32,
  paddingLeft: 8,
  paddingRight: 8,
  fontWeight: "var(--font-weight-normal)" as React.CSSProperties["fontWeight"],
  fontSize: "var(--font-size-body-15)",
};

/* ── Types ───────────────────────────────────────────────────── */

export interface EditorTopNavProps {
  cartCount?: number;
}

export interface EditorTopNavDesktopProps {
  cartCount?: number;
  zoom?: number;
  credits?: number;
}

/* ── Mobile ──────────────────────────────────────────────────── */

export function EditorTopNav({ cartCount = 0 }: EditorTopNavProps) {
  const [open, setOpen]     = useState(false);
  const trackRef            = useRef<HTMLDivElement>(null);
  const contentRef          = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);

  /* Keep drag constraints in sync with container width */
  useEffect(() => {
    const track   = trackRef.current;
    const content = contentRef.current;
    if (!track || !content) return;
    const update = () =>
      setMaxDrag(Math.max(0, content.scrollWidth - track.offsetWidth));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    ro.observe(content);
    return () => ro.disconnect();
  }, []);

  return (
    <div style={{ width: "100%", maxWidth: 393 }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: 64, padding: "0 var(--space-4)",
        background: "var(--color-bg-main)",
        borderBottom: open ? "none" : "1px solid var(--color-element-subtle)",
      }}>
        {/* Left: menu + undo/redo */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
          <Btn variant="outline" size="icon-sm" aria-label="Menu" style={{ border: "none" }}>
            <Menu size={20} />
          </Btn>
          <Btn variant="outline" size="icon-sm" aria-label="Undo" style={{ border: "none" }}>
            <Undo2 size={20} />
          </Btn>
          <Btn variant="outline" size="icon-sm" aria-label="Redo" style={{ border: "none" }}>
            <Redo2 size={20} />
          </Btn>
        </div>

        {/* Right: Preview + Prepare + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
          <Btn variant="outline" size="sm" style={{ background: "var(--color-bg-editor)", border: "none" }}>
            <Eye size={16} />
            Preview
          </Btn>
          <Btn variant="default" size="sm">
            Prepare
          </Btn>
          <CartButton cartCount={cartCount} />
        </div>
      </nav>

      {/* ── Command strip (slide-down) ───────────────────────── */}
      <div style={{
        overflow: "hidden",
        height: open ? 41 : 0,
        background: "var(--color-bg-main)",
        transition: "height 0.5s cubic-bezier(0.32,0.72,0,1)",
      }}>
        <div style={{
          transform: open ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 0.5s cubic-bezier(0.32,0.72,0,1)",
        }}>
          <Sep orientation="horizontal" />
          <div ref={trackRef} style={{ overflow: "hidden", width: "100%", height: 40 }}>
            <motion.div
              ref={contentRef}
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.08}
              dragTransition={{ timeConstant: 250, power: 0.4 }}
              style={{
                display: "flex", alignItems: "center", gap: "var(--space-1)",
                height: 40, padding: "0 var(--space-2)",
                width: "max-content", minWidth: "100%",
                cursor: maxDrag > 0 ? "grab" : "default",
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {MOBILE_COMMAND_ITEMS.map(({ Icon, label }) => (
                <Btn
                  key={label}
                  variant="outline"
                  size="sm"
                  style={{
                    border: "none", background: "transparent",
                    fontWeight: "var(--font-weight-btn)" as React.CSSProperties["fontWeight"],
                    fontSize: "var(--font-size-body-13)",
                    gap: "var(--space-2)", flexShrink: 0,
                    whiteSpace: "nowrap", pointerEvents: "none",
                  }}
                >
                  <Icon size={16} />
                  {label}
                </Btn>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Chevron toggle tab ───────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Collapse command strip" : "Expand command strip"}
          aria-expanded={open}
          style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: 77, height: 20, padding: 0,
            background: "transparent", border: "none",
            cursor: "pointer",
            color: "var(--color-text-secondary)",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")}
        >
          {/* Custom tab shape */}
          <svg
            width="77" height="20" viewBox="0 0 77 20" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            style={{ position: "absolute", inset: 0, transform: "rotate(180deg)" }}
          >
            <path
              d="M66.3577 6.25C65.7317 3.125 62.9289 0 59.4715 0H39.126H18.7805C15.3231 0 12.5203 2.5 11.2683 6.25C11.2683 6.25 6.26016 20 0 20H77C71.1889 20 66.3577 6.25 66.3577 6.25Z"
              fill="var(--color-bg-main)"
              stroke="var(--color-element-subtle)"
              strokeWidth="1"
            />
          </svg>
          <span style={{
            position: "relative", display: "flex", zIndex: 1,
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.28s cubic-bezier(0.4,0,0.2,1)",
          }}>
            <ChevronDown size={14} />
          </span>
        </button>
      </div>

    </div>
  );
}

/* ── Desktop ─────────────────────────────────────────────────── */

export function EditorTopNavDesktop({ cartCount = 0, zoom = 70, credits = 50 }: EditorTopNavDesktopProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  /* Close dropdown on outside click — only active when open */
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <nav style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      width: "100%", height: 60, padding: "0 var(--space-5)",
      background: "var(--color-bg-main)",
      borderBottom: "1px solid var(--color-element-subtle)",
      position: "relative",
    }}>

      {/* Left: logo */}
      <HSLockup height={24} />

      {/* Right: controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>

        <Btn variant="secondary-ghost" size="sm">
          <HSEmblem height={16} />
          {credits} Heart Credits
        </Btn>

        {/* Zoom pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "var(--space-3)",
          height: 36, padding: "var(--space-1)",
          background: "var(--color-bg-main)",
          border: "1px solid var(--color-element-subtle)",
          borderRadius: "var(--radius-lg)",
        }}>
          {/* Expand toggle + separator */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-0-5, 2px)", height: "100%" }}>
            <Btn variant="outline" size="icon-sm" aria-label="Toggle expand" style={{ border: "none", borderRadius: "var(--radius-sm)", width: 28, height: 28 }}>
              <Maximize2 size={16} />
            </Btn>
            <Sep orientation="vertical" style={{ height: 28 }} />
          </div>
          {/* Zoom controls */}
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", height: "100%" }}>
            <Btn variant="outline" size="icon-sm" aria-label="Zoom out" style={{ border: "none", borderRadius: "var(--radius-sm)", width: 28, height: 28 }}>
              <Minus size={16} />
            </Btn>
            <span style={{
              fontSize: "var(--font-size-label-15)",
              fontWeight: "var(--font-weight-medium)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
            }}>
              {zoom}%
            </span>
            <Btn variant="outline" size="icon-sm" aria-label="Zoom in" style={{ border: "none", borderRadius: "var(--radius-sm)", width: 28, height: 28 }}>
              <Plus size={16} />
            </Btn>
          </div>
        </div>

        <Sep orientation="vertical" style={{ height: 20 }} />

        <Btn variant="outline" size="icon-sm" aria-label="Undo" style={{ border: "none" }}>
          <Undo2 size={16} />
        </Btn>
        <Btn variant="outline" size="icon-sm" aria-label="Redo" style={{ border: "none" }}>
          <Redo2 size={16} />
        </Btn>

        <Sep orientation="vertical" style={{ height: 20 }} />

        {/* More options + dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <Btn
            variant="outline"
            size="icon-sm"
            aria-label="More options"
            aria-expanded={open}
            aria-haspopup="menu"
            onClick={() => setOpen(o => !o)}
            style={{ background: "var(--color-bg-editor)", border: "none" }}
          >
            <EllipsisVertical size={16} />
          </Btn>

          {/* Floating dropdown */}
          <div
            role="menu"
            style={{
              position: "absolute", top: "calc(100% + 8px)", right: 0,
              width: 248,
              background: "var(--color-bg-main)",
              border: "1px solid var(--color-element-subtle)",
              borderRadius: 10,
              boxShadow: "var(--shadow-lg)",
              overflow: "hidden",
              padding: "var(--space-1) 0",
              pointerEvents: open ? "auto" : "none",
              opacity: open ? 1 : 0,
              transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
              transformOrigin: "top right",
              transition: "opacity 0.22s cubic-bezier(0.32,0.72,0,1), transform 0.22s cubic-bezier(0.32,0.72,0,1)",
              zIndex: 50,
            }}
          >
            {/* Group 1: Card Management */}
            <div style={{ padding: "var(--space-1)" }}>
              <div style={{ padding: "var(--space-1-5) var(--space-2)" }}>
                <span style={{
                  display: "block",
                  fontSize: "var(--font-size-label-12)",
                  fontWeight: "var(--font-weight-medium)" as React.CSSProperties["fontWeight"],
                  color: "var(--color-text-secondary)",
                  lineHeight: "18px",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  Card Management
                </span>
              </div>
              {DESKTOP_COMMAND_ITEMS.slice(0, 3).map(({ Icon, label }) => (
                <Btn
                  key={label}
                  role="menuitem"
                  variant="outline"
                  size="sm"
                  style={dropdownItemStyle}
                >
                  <Icon size={16} />
                  {label}
                </Btn>
              ))}
            </div>

            <Sep orientation="horizontal" />

            {/* Group 2: Destructive actions */}
            <div style={{ padding: "var(--space-1)" }}>
              <Btn
                role="menuitem"
                variant="outline"
                size="sm"
                style={{ ...dropdownItemStyle, color: "var(--color-text-primary)" }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "var(--color-brand-primary-dim)";
                  e.currentTarget.style.color      = "var(--color-state-error)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "";
                  e.currentTarget.style.color      = "var(--color-text-primary)";
                }}
              >
                <Trash2 size={16} style={{ flexShrink: 0 }} />
                <span style={{ lineHeight: "16px" }}>Delete Card</span>
              </Btn>
            </div>
          </div>
        </div>

        <Btn variant="outline" size="sm" style={{ background: "var(--color-bg-editor)", border: "none" }}>
          <Eye size={16} />
          Preview
        </Btn>

        <Btn variant="default" size="sm">
          Prepare to cart
        </Btn>

        <CartButton cartCount={cartCount} />
      </div>

    </nav>
  );
}

/* ── Shared sub-components ───────────────────────────────────── */

/** Cart icon button with optional badge — shared between mobile and desktop */
function CartButton({ cartCount }: { cartCount: number }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <Btn variant="outline" size="icon-sm" aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`} style={{ background: "var(--color-bg-editor)", border: "none" }}>
        <ShoppingCart size={16} />
      </Btn>
      {cartCount > 0 && (
        <Bdg
          variant="default"
          aria-hidden="true"
          style={{
            position: "absolute", top: -5, right: -5,
            minWidth: 16, height: 16, padding: "0 var(--space-1)",
            fontSize: 10, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "var(--radius-full)",
            pointerEvents: "none",
          }}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </Bdg>
      )}
    </div>
  );
}
