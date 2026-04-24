import React, { useState, useRef, useEffect } from "react";
import { motion } from "motion/react";
import { Menu, Undo2, Redo2, Eye, ShoppingCart, SaveAll, Plus, Palette, Trash2, ChevronDown, EllipsisVertical, Minus } from "lucide-react";
import { Btn } from "./btn";
import { Bdg } from "./hs-bdg";
import { Sep } from "./hs-sep";
import { HSLockup } from "./hs-logo";

const COMMAND_ITEMS = [
  { Icon: SaveAll, label: "Save as copy" },
  { Icon: Plus,    label: "Create new"  },
  { Icon: Palette, label: "My Cards"    },
  { Icon: Trash2,  label: "Delete"      },
] as const;

const DESKTOP_COMMAND_ITEMS = [
  { Icon: SaveAll, label: "Save as copy" },
  { Icon: Plus,    label: "New Card"     },
  { Icon: Palette, label: "My Cards"     },
  { Icon: Trash2,  label: "Delete Card"  },
] as const;

interface EditorTopNavProps {
  cartCount?: number;
}

export function EditorTopNav({ cartCount = 0 }: EditorTopNavProps) {
  const [open, setOpen] = useState(false);
  const trackRef  = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxDrag, setMaxDrag] = useState(0);

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
        width: "100%", height: 64, padding: "0 16px",
        background: "var(--bg)", borderBottom: open ? "none" : "1px solid var(--border)",
      }}>
        {/* Left: menu + undo/redo */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <Btn variant="outline" size="icon-sm" aria-label="Menu" style={{ border: "none" }}>
            <Menu size={20} />
          </Btn>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Btn variant="outline" size="icon-sm" aria-label="Undo" style={{ border: "none" }}>
              <Undo2 size={20} />
            </Btn>
            <Btn variant="outline" size="icon-sm" aria-label="Redo" style={{ border: "none" }}>
              <Redo2 size={20} />
            </Btn>
          </div>
        </div>

        {/* Right: Preview + Prepare + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Btn variant="outline" size="sm" style={{ background: "var(--color-bg-editor)", border: "none" }}>
            <Eye size={16} />
            Preview
          </Btn>
          <Btn variant="default" size="sm">
            Prepare
          </Btn>
          <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
            <Btn variant="outline" size="icon-sm" aria-label="Cart" style={{ background: "var(--color-bg-editor)", border: "none" }}>
              <ShoppingCart size={16} />
            </Btn>
            {cartCount > 0 && (
              <Bdg
                variant="default"
                style={{
                  position: "absolute", top: -5, right: -5,
                  minWidth: 16, height: 16, padding: "0 4px",
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
        </div>
      </nav>

      {/* ── Command row — Vaul open + motion swipe ──────────── */}
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
          {/* drag track */}
          <div ref={trackRef} style={{ overflow: "hidden", width: "100%", height: 40 }}>
            <motion.div
              ref={contentRef}
              drag="x"
              dragConstraints={{ left: -maxDrag, right: 0 }}
              dragElastic={0.08}
              dragTransition={{ timeConstant: 250, power: 0.4 }}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                height: 40, padding: "0 8px",
                width: "max-content", minWidth: "100%",
                cursor: maxDrag > 0 ? "grab" : "default",
              }}
              whileTap={{ cursor: "grabbing" }}
            >
              {COMMAND_ITEMS.map(({ Icon, label }) => (
                <Btn
                  key={label}
                  variant="outline"
                  size="sm"
                  style={{ border: "none", background: "transparent", fontWeight: 700, fontSize: 13, gap: 8, flexShrink: 0, whiteSpace: "nowrap", pointerEvents: "none" }}
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
          aria-label={open ? "Collapse" : "Expand"}
          style={{
            position: "relative", display: "flex", alignItems: "center", justifyContent: "center",
            width: 77, height: 20, padding: 0,
            background: "transparent", border: "none",
            cursor: "pointer", color: "var(--muted-fg)",
            transition: "color 0.15s ease",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
        >
          <svg
            width="77" height="20" viewBox="0 0 77 20" fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{ position: "absolute", inset: 0, transform: "rotate(180deg)" }}
          >
            <path
              d="M66.3577 6.25C65.7317 3.125 62.9289 0 59.4715 0H39.126H18.7805C15.3231 0 12.5203 2.5 11.2683 6.25C11.2683 6.25 6.26016 20 0 20H77C71.1889 20 66.3577 6.25 66.3577 6.25Z"
              fill="var(--bg)" stroke="var(--border)" strokeWidth="1"
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

/* ── Desktop ─────────────────────────────────────────────── */

interface EditorTopNavDesktopProps {
  cartCount?: number;
  zoom?: number;
}

export function EditorTopNavDesktop({ cartCount = 0, zoom = 70 }: EditorTopNavDesktopProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
      width: "100%", height: 60, padding: "0 20px",
      background: "var(--bg)", borderBottom: "1px solid var(--border)",
      position: "relative",
    }}>
      {/* Left: logo */}
      <HSLockup height={24} />

      {/* Right: controls */}
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {/* Zoom pill */}
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid var(--border)", borderRadius: "var(--radius)",
          overflow: "hidden",
        }}>
          <Btn variant="ghost" size="icon-sm" aria-label="Zoom out" style={{ borderRadius: 0, border: "none" }}>
            <Minus size={14} />
          </Btn>
          <span style={{ padding: "0 8px", fontSize: 12, fontWeight: 600, color: "var(--fg)", minWidth: 40, textAlign: "center" }}>
            {zoom}%
          </span>
          <Btn variant="ghost" size="icon-sm" aria-label="Zoom in" style={{ borderRadius: 0, border: "none" }}>
            <Plus size={14} />
          </Btn>
        </div>

        <Sep orientation="vertical" style={{ height: 20 }} />

        <Btn variant="outline" size="icon-sm" aria-label="Undo" style={{ border: "none" }}>
          <Undo2 size={16} />
        </Btn>
        <Btn variant="outline" size="icon-sm" aria-label="Redo" style={{ border: "none" }}>
          <Redo2 size={16} />
        </Btn>

        <Sep orientation="vertical" style={{ height: 20 }} />

        {/* More options trigger + dropdown */}
        <div ref={menuRef} style={{ position: "relative" }}>
          <Btn
            variant="outline"
            size="icon-sm"
            aria-label="More options"
            onClick={() => setOpen(o => !o)}
            style={{ background: "var(--color-bg-editor)", border: "none" }}
          >
            <EllipsisVertical size={16} />
          </Btn>

          {/* Floating dropdown */}
          <div style={{
            position: "absolute", top: "calc(100% + 8px)", right: 0,
            width: 248,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.10)",
            overflow: "hidden",
            pointerEvents: open ? "auto" : "none",
            opacity: open ? 1 : 0,
            transform: open ? "translateY(0) scale(1)" : "translateY(-8px) scale(0.96)",
            transformOrigin: "top right",
            transition: "opacity 0.22s cubic-bezier(0.32,0.72,0,1), transform 0.22s cubic-bezier(0.32,0.72,0,1)",
            zIndex: 50,
          }}>
            <div style={{ padding: "10px 12px 8px", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "var(--muted-fg)", fontWeight: 500 }}>
                Options for card actions
              </span>
            </div>
            <div style={{ padding: 4 }}>
              {DESKTOP_COMMAND_ITEMS.map(({ Icon, label }) => (
                <Btn
                  key={label}
                  variant="ghost"
                  size="sm"
                  style={{ width: "100%", justifyContent: "flex-start", gap: 8, borderRadius: 8 }}
                >
                  <Icon size={15} />
                  {label}
                </Btn>
              ))}
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

        {/* Cart + badge */}
        <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
          <Btn variant="outline" size="icon-sm" aria-label="Cart" style={{ background: "var(--color-bg-editor)", border: "none" }}>
            <ShoppingCart size={16} />
          </Btn>
          {cartCount > 0 && (
            <Bdg
              variant="default"
              style={{
                position: "absolute", top: -5, right: -5,
                minWidth: 16, height: 16, padding: "0 4px",
                fontSize: 10, lineHeight: 1,
                display: "flex", alignItems: "center", justifyContent: "center",
                borderRadius: "var(--radius-full)", pointerEvents: "none",
              }}
            >
              {cartCount > 99 ? "99+" : cartCount}
            </Bdg>
          )}
        </div>
      </div>
    </nav>
  );
}
