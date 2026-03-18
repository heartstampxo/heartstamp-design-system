import React, { useState } from "react";
import { Check } from "lucide-react";

/* HeartStamp — Checkbox primitive
   Supports both controlled (checked + onChange) and
   uncontrolled (defaultChecked) usage patterns.         */
export function Cbx({ checked, defaultChecked, onChange, onCheckedChange, label, disabled, id, style }: any) {
  /* internal state for uncontrolled mode */
  const [internal, setInternal] = useState<boolean>(defaultChecked ?? false);

  const isControlled = checked !== undefined;
  const isChecked    = isControlled ? Boolean(checked) : internal;

  const handleClick = () => {
    if (disabled) return;
    const next = !isChecked;
    if (!isControlled) setInternal(next);
    if (typeof onChange         === "function") onChange(next);
    if (typeof onCheckedChange  === "function") onCheckedChange(next);
  };

  return (
    <div
      id={id}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 4,
          border: `2px solid ${isChecked ? "var(--accent)" : "var(--border)"}`,
          background: isChecked ? "var(--accent)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .15s",
          flexShrink: 0,
        }}
      >
        {isChecked && <Check size={10} color="#fff" strokeWidth={3} />}
      </div>
      {label && <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>}
    </div>
  );
}
