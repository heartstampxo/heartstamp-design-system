import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { NAV, ALL_ITEMS } from "../../nav-config";
import { Inp } from "../ui/hs-inp";
import { Acc } from "../ui/hs-acc";

const LABEL_COLORS: Record<string, { bg: string; color: string }> = {
  new:        { bg: "rgba(16,185,129,.13)",  color: "#10b981" },
  beta:       { bg: "rgba(245,158,11,.13)",  color: "#f59e0b" },
  deprecated: { bg: "rgba(239,68,68,.13)",   color: "#ef4444" },
};

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
}

export function Sidebar({ active, onSelect, onClose }: SidebarProps) {
  const activeGroupIndex = NAV.findIndex(g => g.items.some(i => i.id === active));
  const [search, setSearch] = useState("");

  // Build nav link buttons for a group
  const navLinks = (items: any[]) => (
    <>
      {items.map((item: any) => (
        <button
          key={item.id}
          onClick={() => onSelect(item.id)}
          style={{
            width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "6px 10px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12.5,
            fontWeight: active === item.id ? 600 : 400, textAlign: "left", transition: "all .12s",
            background: active === item.id ? "var(--accent-subtle)" : "transparent",
            color: active === item.id ? "var(--accent)" : "var(--muted-fg)",
            fontFamily: "inherit",
          }}
        >
          {item.title}
          {item.label && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 999,
              background: LABEL_COLORS[item.label].bg, color: LABEL_COLORS[item.label].color,
              textTransform: "uppercase", letterSpacing: ".04em",
            }}>{item.label}</span>
          )}
        </button>
      ))}
    </>
  );

  // When searching: flat list, no accordion
  const searchResults = ALL_ITEMS.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <nav style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* search — using Inp component */}
      <div style={{ padding: "10px 10px 6px", position: "relative" }}>
        <Search size={12} style={{
          position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)",
          color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
        }} />
        <Inp
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search components…"
          style={{ paddingLeft: 28, paddingRight: search ? 28 : undefined, fontSize: 12 }}
        />
        {search && (
          <button onClick={() => setSearch("")} style={{
            position: "absolute", right: 18, top: "50%", transform: "translateY(-50%)",
            background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 0, display: "flex",
          }}>
            <X size={11} />
          </button>
        )}
      </div>

      {/* nav items — using Acc component in ghost variant */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {search.trim() ? (
          // Flat search results (no accordion)
          <div style={{ marginTop: 4 }}>
            {searchResults.length > 0
              ? navLinks(searchResults)
              : <p style={{ fontSize: 12, color: "var(--muted-fg)", padding: "6px 10px" }}>No results</p>
            }
          </div>
        ) : (
          // Accordion groups
          <Acc
            variant="ghost"
            multiple
            defaultOpen={NAV.map((_, i) => i).filter(i => i < 3 || i === activeGroupIndex)}
            items={NAV.map(group => ({
              title: group.title,
              content: navLinks(group.items),
            }))}
          />
        )}
      </div>

      {/* footer */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted-fg)" }}>
        HeartStamp DS · v1.0.0
      </div>
    </nav>
  );
}
