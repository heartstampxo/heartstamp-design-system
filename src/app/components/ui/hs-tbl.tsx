import React from "react";

/* HeartStamp — Table primitive */

interface TblColumn {
  key: string;
  label: string;
}

type TblRow = Record<string, React.ReactNode>;

interface TblProps {
  columns: TblColumn[];
  rows: TblRow[];
}

export function Tbl({ columns, rows }: TblProps) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: "var(--radius-xl)", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "var(--font-size-body-13)" }}>
        <thead>
          <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
            {columns.map(c => (
              <th
                key={c.key}
                style={{
                  padding: "var(--space-2) var(--space-3-5)",
                  textAlign: "left",
                  fontWeight: "var(--font-weight-label-sb-15)",
                  color: "var(--muted-fg)",
                  fontSize: "var(--font-size-label-12)",
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
          {rows.map((row, i) => (
            <tr
              key={i}
              style={{
                borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
                background: i % 2 === 0 ? "var(--bg)" : "var(--muted)",
              }}
            >
              {columns.map(c => (
                <td key={c.key} style={{ padding: "var(--space-2) var(--space-3-5)", color: "var(--fg)" }}>
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
