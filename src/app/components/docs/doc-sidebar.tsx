import React, { useState } from "react";
import { Search, X } from "lucide-react";
import { NAV, ALL_ITEMS, LABEL_COLORS } from "../../nav-config";
import { Inp } from "../ui/hs-inp";
import { Acc } from "../ui/hs-acc";
import { PnNavRow } from "../ui/profile-nav";

interface SidebarProps {
  active: string;
  onSelect: (id: string) => void;
  onClose?: () => void;
}

export function Sidebar({ active, onSelect, onClose }: SidebarProps) {
  const activeGroupIndex = NAV.findIndex(g => g.items.some(i => i.id === active));
  const [search, setSearch] = useState("");

  // Build nav link buttons for a group using PnNavRow
  const navLinks = (items: any[]) => (
    <>
      {items.map((item: any) => (
        <PnNavRow
          key={item.id}
          size="sm"
          label={item.title}
          active={active === item.id}
          onClick={() => onSelect(item.id)}
          badge={item.label && (
            <span style={{
              fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 999,
              background: LABEL_COLORS[item.label].bg, color: LABEL_COLORS[item.label].color,
              textTransform: "uppercase", letterSpacing: ".04em",
            }}>{item.label}</span>
          )}
        />
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
      <div style={{ padding: "10px var(--space-3) var(--space-1-5)", position: "relative" }}>
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
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "var(--space-2)" }}>
        {search.trim() ? (
          // Flat search results (no accordion)
          <div style={{ marginTop: 4 }}>
            {searchResults.length > 0
              ? navLinks(searchResults)
              : <p style={{ fontSize: 12, color: "var(--muted-fg)", padding: "var(--space-1-5) 10px" }}>No results</p>
            }
          </div>
        ) : (
          // Accordion groups
          <Acc
            variant="ghost"
            multiple
            defaultOpen={Array.from(new Set([0, ...NAV.map((_, i) => i).filter(i => i === activeGroupIndex)]))}
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
