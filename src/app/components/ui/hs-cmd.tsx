import React, { useState } from "react";
import { Search, Home, FileText, Plus, Upload, Trash2, Settings, Bell, LucideIcon } from "lucide-react";

interface CmdItem {
  icon: React.ReactElement<{ size?: number }>;
  label: string;
  destructive?: boolean;
}

interface CmdGroup {
  group: string;
  items: CmdItem[];
}

interface CmdProps {
  placeholder?: string;
}

/* HeartStamp — Command palette primitive */
export function Cmd({ placeholder = "Type a command…" }: CmdProps) {
  const [q, setQ] = useState("");
  const cmds: CmdGroup[] = [
    {
      group: "Navigation",
      items: [
        { icon: <Home size={14} />,     label: "Go to Dashboard" },
        { icon: <FileText size={14} />, label: "Open Documentation" },
      ],
    },
    {
      group: "Actions",
      items: [
        { icon: <Plus size={14} />,   label: "Create New Component" },
        { icon: <Upload size={14} />, label: "Import Component" },
        { icon: <Trash2 size={14} />, label: "Delete Selected", destructive: true },
      ],
    },
    {
      group: "Settings",
      items: [
        { icon: <Settings size={14} />, label: "Preferences" },
        { icon: <Bell size={14} />,     label: "Notifications" },
      ],
    },
  ];

  const filtered = cmds
    .map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) }))
    .filter(g => g.items.length > 0);

  return (
    <div
      style={{
        background: "var(--bg-menus)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-3-5)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <Search size={15} style={{ color: "var(--muted-fg)", flexShrink: 0 }} />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            outline: "none",
            fontSize: "var(--font-size-body-13)",
            color: "var(--fg)",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div style={{ maxHeight: 280, overflowY: "auto", padding: "var(--space-1) 0" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "var(--space-6)", textAlign: "center", fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)" }}>
            No results found.
          </div>
        ) : (
          filtered.map(g => (
            <div key={g.group}>
              <div
                style={{
                  padding: "var(--space-1-5) var(--space-3-5) var(--space-1)",
                  fontSize: "var(--font-size-label-12)",
                  fontWeight: 700,
                  color: "var(--muted-fg)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {g.group}
              </div>
              {g.items.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "var(--space-2)",
                    padding: "var(--space-2) var(--space-3-5)",
                    cursor: "pointer",
                    fontSize: "var(--font-size-body-13)",
                    color: item.destructive ? "var(--color-state-error)" : "var(--fg)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: item.destructive ? "var(--color-state-error)" : "var(--muted-fg)" }}>
                    {item.icon}
                  </span>
                  {item.label}
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
