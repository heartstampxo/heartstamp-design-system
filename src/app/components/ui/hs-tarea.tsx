import React, { useState } from "react";

/* HeartStamp — Textarea primitive */

interface TareaProps {
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
}

export function Tarea({ placeholder, rows = 3, disabled }: TareaProps) {
  const [v, setV] = useState("");
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      value={v}
      onChange={e => setV(e.target.value)}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "var(--space-2) var(--space-3)",
        borderRadius: "var(--radius-2xl)",
        border: `1px solid ${focused ? "var(--secondary)" : "var(--border)"}`,
        background: "var(--bg-input)",
        color: "var(--fg)",
        fontSize: "var(--font-size-body-15)",
        fontFamily: "inherit",
        outline: "none",
        resize: "vertical",
        opacity: disabled ? 0.5 : 1,
        transition: "border-color 0.15s ease",
        cursor: disabled ? "not-allowed" : "auto",
      }}
    />
  );
}
