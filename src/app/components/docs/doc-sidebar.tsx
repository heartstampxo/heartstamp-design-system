import React, { useState } from "react";
import { Search, X, ChevronDown, ChevronRight } from "lucide-react";
import { NAV, ALL_ITEMS } from "../../nav-config";

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
  const activeGroup = NAV.find(g => g.items.some(i => i.id === active))?.title;
  const [openG, setOpenG] = useState<Record<string, boolean>>(
    NAV.reduce((a, g, i) => ({ ...a, [g.title]: i < 3 || g.title === activeGroup }), {})
  );

  React.useEffect(() => {
    if (activeGroup) setOpenG(g => ({ ...g, [activeGroup]: true }));
  }, [activeGroup]);
  const [search, setSearch] = useState("");

  const toggle = (t: string) => setOpenG(g => ({ ...g, [t]: !g[t] }));
  const filtered = search.trim()
    ? [{ title: "Results", items: ALL_ITEMS.filter(i => i.title.toLowerCase().includes(search.toLowerCase())) }]
    : NAV;

  return (
    <nav style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* search */}
      <div style={{ padding: "10px 10px 6px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 7,
          border: "1px solid var(--border)", background: "var(--muted)",
        }}>
          <Search size={12} style={{ color: "var(--muted-fg)", flexShrink: 0 }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search components…"
            style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--fg)", fontFamily: "inherit" }}
          />
          {search && (
            <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 0, display: "flex" }}>
              <X size={11} />
            </button>
          )}
        </div>
      </div>

      {/* nav items */}
      <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
        {filtered.map(group => (
          <div key={group.title} style={{ marginBottom: 2 }}>
            {!search && (
              <button onClick={() => toggle(group.title)} style={{
                width: "100%", display: "flex",
                alignItems: "center", justifyContent: "space-between", padding: "5px 10px",
                background: "none", border: "none", cursor: "pointer", fontSize: 10.5, fontWeight: 700,
                color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em",
              }}>
                {group.title}
                {openG[group.title] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
              </button>
            )}
            {(search || openG[group.title]) && (
              <div style={{ marginTop: 1 }}>
                {group.items.map((item: any) => (
                  <button
                    key={item.id}
                    onClick={() => { onSelect(item.id); onClose?.(); }}
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
              </div>
            )}
          </div>
        ))}
      </div>

      {/* footer */}
      <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted-fg)" }}>
        HeartStamp DS · v1.0.0
      </div>
    </nav>
  );
}
