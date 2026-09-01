import React, { useState } from "react";
import { Search } from "lucide-react";
import pkg from "../../../../package.json";
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

  // Renders a single nav row; on mobile, picking a page also closes the drawer
  const navRow = (item: { id: string; title: string; label?: string; group?: string }) => (
    <PnNavRow
      key={item.id}
      size="sm"
      label={item.title}
      active={active === item.id}
      onClick={() => { onSelect(item.id); onClose?.(); }}
      badge={item.label && (
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999,
          background: LABEL_COLORS[item.label].bg, color: LABEL_COLORS[item.label].color,
          textTransform: "uppercase", letterSpacing: ".04em",
        }}>{item.label}</span>
      )}
    />
  );

  // Build nav link buttons — when grouped=true, inserts sub-group divider labels.
  // Rows sit in a column with 2px gaps between them.
  const listStyle: React.CSSProperties = {
    display: "flex", flexDirection: "column",
    gap: "var(--space-0-5)",
  };
  const navLinks = (items: { id: string; title: string; label?: string; group?: string }[], grouped = false) => {
    if (!grouped) return <div style={listStyle}>{items.map(navRow)}</div>;

    const nodes: React.ReactNode[] = [];
    let lastGroup = "";
    items.forEach(item => {
      if (item.group && item.group !== lastGroup) {
        lastGroup = item.group;
        nodes.push(
          <div key={`grp-${item.group}`} style={{
            fontSize: "var(--font-size-label-12)",
            fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            color: "var(--color-text-disabled)",
            textTransform: "uppercase",
            letterSpacing: ".06em",
            padding: "var(--space-3) var(--space-4) var(--space-1)",
            marginTop: nodes.length > 0 ? "var(--space-1)" : 0,
          }}>
            {item.group}
          </div>
        );
      }
      nodes.push(navRow(item));
    });
    return <div style={listStyle}>{nodes}</div>;
  };

  // When searching: flat list, no accordion
  const searchResults = ALL_ITEMS.filter(i =>
    i.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <nav style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* search — using Inp component */}
      <div style={{ padding: "var(--space-3) var(--space-3) var(--space-2)", position: "relative" }}>
        <Inp
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          placeholder="Search components…"
          iconLeft={<Search size={14} />}
        />
      </div>

      {/* nav items — using Acc component in ghost variant */}
      <div style={{ flex: 1, overflowY: "auto", paddingTop: "var(--space-2)" }}>
        {search.trim() ? (
          // Flat search results (no accordion)
          <div style={{ marginTop: "var(--space-1)" }}>
            {searchResults.length > 0
              ? navLinks(searchResults)
              : <p style={{ fontSize: "var(--font-size-label-12)", color: "var(--muted-fg)", padding: "var(--space-1-5) var(--space-2-5)" }}>No results</p>
            }
          </div>
        ) : (
          // Accordion groups
          <Acc
            variant="ghost"
            collapsible={false}
            defaultOpen={[activeGroupIndex >= 0 ? activeGroupIndex : 0]}
            items={NAV.map(group => ({
              title: (
                <span style={{ display: "inline-flex", alignItems: "center", gap: "var(--space-1-5)" }}>
                  {group.title}
                  <span style={{
                    fontSize: 10, fontWeight: 600, lineHeight: "15px", padding: "0 6px",
                    borderRadius: 999, letterSpacing: 0,
                    background: "var(--muted)", color: "var(--muted-fg)", border: "1px solid var(--border)",
                  }}>{group.items.length}</span>
                </span>
              ),
              content: navLinks(group.items, group.title === "Components"),
            }))}
          />
        )}
      </div>

      {/* footer — version chip opens the changelog */}
      <div style={{
        padding: "var(--space-2-5) var(--space-3-5)", borderTop: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-2)",
      }}>
        <span style={{ fontSize: "var(--font-size-label-12)", fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"], color: "var(--muted-fg)" }}>
          HeartStamp DS
        </span>
        <button
          onClick={() => { onSelect("changelog"); onClose?.(); }}
          title="What changed in this version"
          style={{
            fontSize: "var(--font-size-label-12)", fontWeight: 600, fontFamily: "inherit",
            color: active === "changelog" ? "var(--accent)" : "var(--muted-fg)",
            background: "var(--muted)", border: "1px solid var(--border)",
            borderRadius: 999, padding: "1px 8px", cursor: "pointer",
          }}
        >
          v{pkg.version}
        </button>
      </div>
    </nav>
  );
}
