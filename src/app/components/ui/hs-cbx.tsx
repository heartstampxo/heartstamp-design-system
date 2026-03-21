import React, { useState } from "react";
import { Check } from "lucide-react";

interface CbxProps {
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/* HeartStamp — Checkbox primitive
   Supports both controlled (checked + onChange) and
   uncontrolled (defaultChecked) usage patterns. */
export function Cbx({ checked, defaultChecked, onChange, onCheckedChange, label, disabled, id, style }: CbxProps) {
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
        gap: "var(--space-2)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      onClick={handleClick}
    >
      <div
        style={{
          width: "var(--space-4)",
          height: "var(--space-4)",
          borderRadius: "var(--radius-xs)",
          border: `2px solid ${isChecked ? "var(--accent)" : "var(--border)"}`,
          background: isChecked ? "var(--accent)" : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all .15s",
          flexShrink: 0,
        }}
      >
        {isChecked && <Check size={10} color="var(--color-text-on-primary)" strokeWidth={3} />}
      </div>
      {label && <span style={{ fontSize: "var(--font-size-body-13)", color: "var(--fg)" }}>{label}</span>}
    </div>
  );
}
