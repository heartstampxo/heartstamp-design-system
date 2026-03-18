import React from "react";

/* HeartStamp — Table primitive */
export function Tbl({ columns, rows }: any) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
            {columns.map((c: any) => (
              <th
                key={c.key}
                style={{
                  padding: "10px 14px",
                  textAlign: "left",
                  fontWeight: 600,
                  color: "var(--muted-fg)",
                  fontSize: 11.5,
                  textTransform: "uppercase",
                  letterSpacing: ".04em",
                }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row: any, i: number) => (
            <tr
              key={i}
              style={{
                borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--bg)" : "var(--muted)",
              }}
            >
              {columns.map((c: any) => (
                <td key={c.key} style={{ padding: "10px 14px", color: "var(--fg)" }}>
                  {row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
