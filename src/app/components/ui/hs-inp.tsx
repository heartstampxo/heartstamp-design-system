import React, { useState } from "react";

/* HeartStamp — Input primitive */
export function Inp({ placeholder, value, onChange, type = "text", disabled, error, id, style }: any) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? "var(--state-error)" : focused ? "var(--secondary)" : "var(--border)";
  return (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        width: "100%",
        padding: "var(--inp-padding)",
        borderRadius: "var(--radius-input)",
        border: `1px solid ${borderColor}`,
        background: "var(--bg-input)",
        color: "var(--fg)",
        fontSize: "var(--font-size-inp)" as any,
        fontFamily: "inherit",
        outline: "none",
        opacity: disabled ? ("var(--inp-opacity-disabled)" as any) : 1,
        cursor: disabled ? "not-allowed" : "auto",
        transition: "border-color 0.15s ease",
        ...style,
      }}
    />
  );
}
