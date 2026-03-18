import React, { useState } from "react";
import { Search, Home, FileText, Plus, Upload, Trash2, Settings, Bell } from "lucide-react";

/* HeartStamp — Command palette primitive */
export function Cmd({ placeholder = "Type a command…" }: any) {
  const [q, setQ] = useState("");
  const cmds = [
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
        borderRadius: 12,
        overflow: "hidden",
        width: "100%",
        maxWidth: 400,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "10px 14px",
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
            fontSize: 13,
            color: "var(--fg)",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div style={{ maxHeight: 280, overflowY: "auto", padding: "4px 0" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "var(--muted-fg)" }}>
            No results found.
          </div>
        ) : (
          filtered.map(g => (
            <div key={g.group}>
              <div
                style={{
                  padding: "6px 14px 2px",
                  fontSize: 10.5,
                  fontWeight: 700,
                  color: "var(--muted-fg)",
                  textTransform: "uppercase",
                  letterSpacing: ".06em",
                }}
              >
                {g.group}
              </div>
              {g.items.map((item: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    padding: "8px 14px",
                    cursor: "pointer",
                    fontSize: 13,
                    color: item.destructive ? "#ef4444" : "var(--fg)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                >
                  <span style={{ color: item.destructive ? "#ef4444" : "var(--muted-fg)" }}>
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
