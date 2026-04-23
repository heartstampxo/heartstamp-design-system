import React, { useState } from "react";
import { Menu, Undo2, Redo2, Eye, ShoppingCart, SaveAll, Plus, Palette, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const iconBtn: React.CSSProperties = {
  width: 36, height: 36,
  display: "flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", cursor: "pointer",
  color: "var(--fg)", borderRadius: 8, flexShrink: 0,
};

const COMMAND_ITEMS = [
  { Icon: SaveAll, label: "Save as copy" },
  { Icon: Plus,    label: "Create new"  },
  { Icon: Palette, label: "My Cards"    },
  { Icon: Trash2,  label: "Delete"      },
] as const;

export function EditorTopNav() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ width: "100%", maxWidth: 393, position: "relative" }}>
      {/* ── Top bar ─────────────────────────────────────────── */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        width: "100%", height: 64, padding: "0 16px",
        background: "var(--bg)", borderBottom: "1px solid var(--border)",
      }}>
        {/* Left: menu + undo/redo */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            style={iconBtn} aria-label="Menu"
            onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <Menu size={20} />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <button
              style={iconBtn} aria-label="Undo"
              onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <Undo2 size={20} />
            </button>
            <button
              style={iconBtn} aria-label="Redo"
              onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <Redo2 size={20} />
            </button>
          </div>
        </div>

        {/* Right: Preview + Prepare + Cart */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 12px", borderRadius: 999,
            background: "var(--muted)", border: "none", cursor: "pointer",
            color: "var(--fg)", fontSize: "var(--font-size-label-15)",
            fontWeight: 500, fontFamily: "inherit", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <Eye size={16} />
            Preview
          </button>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 12px", borderRadius: 25,
            background: "var(--accent)", border: "none", cursor: "pointer",
            color: "#fff", fontSize: "var(--font-size-label-15)",
            fontWeight: 500, fontFamily: "inherit", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            Prepare
          </button>
          <button style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: 25,
            background: "var(--muted)", border: "none", cursor: "pointer",
            color: "var(--fg)", flexShrink: 0,
          }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <ShoppingCart size={16} />
          </button>
        </div>
      </nav>

      {/* ── Command row (expanded) ───────────────────────────── */}
      {open && (
        <div style={{
          display: "flex", alignItems: "center", gap: 8,
          width: "100%", height: 40, padding: "0 8px",
          background: "var(--bg)", borderBottom: "1px solid var(--border)",
          overflowX: "auto",
        }}>
          {COMMAND_ITEMS.map(({ Icon, label }) => (
            <button key={label} style={{
              display: "flex", alignItems: "center", gap: 8,
              height: 40, padding: "6px 8px",
              background: "none", border: "none", cursor: "pointer",
              color: "var(--fg)", fontSize: 13, fontWeight: 700,
              fontFamily: "inherit", borderRadius: 6,
              whiteSpace: "nowrap", flexShrink: 0,
            }}
              onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
              onMouseLeave={e => (e.currentTarget.style.background = "none")}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* ── Chevron toggle tab ───────────────────────────────── */}
      <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
        <button
          onClick={() => setOpen(o => !o)}
          aria-label={open ? "Collapse" : "Expand"}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 77, height: 20,
            background: "var(--bg)", border: "1px solid var(--border)",
            borderTop: "none", borderRadius: "0 0 8px 8px",
            cursor: "pointer", color: "var(--muted-fg)",
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--fg)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
        >
          {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>
    </div>
  );
}
