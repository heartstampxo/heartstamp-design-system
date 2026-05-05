import React from "react";

interface PropRow {
  name: string;
  type: string;
  def?: string;
  required?: boolean;
  desc: string;
}

export function PropsTable({ props }: { props: PropRow[] }) {
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
        <thead>
          <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
            {["Prop", "Type", "Default", "Description"].map(h => (
              <th key={h} style={{
                padding: "8px 14px", textAlign: "left", fontWeight: 600,
                color: "var(--muted-fg)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".04em",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p, i) => (
            <tr key={p.name} style={{
              background: i % 2 === 0 ? "var(--bg)" : "var(--muted)",
              borderBottom: "1px solid var(--border)",
            }}>
              <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
                <code style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--fg)", fontSize: 12 }}>{p.name}</code>
                {p.required && <span style={{ color: "var(--accent)", marginLeft: 2 }}>*</span>}
              </td>
              <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
                <code style={{ fontFamily: "monospace", color: "var(--fg)", fontSize: 11, wordBreak: "break-word" }}>{p.type}</code>
              </td>
              <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
                <code style={{ fontFamily: "monospace", color: "var(--muted-fg)", fontSize: 11 }}>{p.def || "—"}</code>
              </td>
              <td style={{ padding: "8px 14px", verticalAlign: "top", color: "var(--muted-fg)", lineHeight: 1.5 }}>{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}