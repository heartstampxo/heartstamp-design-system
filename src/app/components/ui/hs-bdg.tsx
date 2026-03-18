import React from "react";

/* HeartStamp — Badge primitive */
export function Bdg({ variant = "default", children, style }: any) {
  const vmap: any = {
    default:     { background: "var(--accent)",           color: "var(--text-on-primary)" },
    secondary:   { background: "var(--secondary-subtle)", color: "var(--secondary)" },
    outline:     { background: "transparent",             color: "var(--fg)", border: "1px solid var(--border)" },
    destructive: { background: "var(--color-state-error)", color: "var(--text-on-primary)" },
    success:     { background: "#22c55e",                 color: "var(--text-on-primary)" },
    warning:     { background: "#f59e0b",                 color: "var(--text-on-primary)" },
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 9px",
        borderRadius: "var(--radius-full)",
        fontSize: 11,
        fontWeight: 600,
        ...vmap[variant],
        ...style,
      }}
    >
      {children}
    </span>
  );
}
