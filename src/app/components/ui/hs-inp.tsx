import React, { useState } from "react";
import { Lbl } from "./hs-lbl";
import { Kbd, KbdGroup } from "./hs-kbd";

/* ─────────────────────────────────────────────────────────────
   hs-inp — HeartStamp Input primitive
   Supports: plain, icon-left, icon-right, kbd shortcut, label
───────────────────────────────────────────────────────────────*/

interface InpProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  error?: boolean;
  id?: string;
  style?: React.CSSProperties;
  /** Label rendered above the input */
  label?: string;
  /** Icon node rendered on the left side */
  iconLeft?: React.ReactNode;
  /** Icon node rendered on the right side */
  iconRight?: React.ReactNode;
  /** Keyboard shortcut displayed on the right — single string or array of keys */
  kbd?: string | string[];
}


/* ── Input ──────────────────────────────────────────────────── */
export function Inp({
  placeholder, value, onChange, type = "text",
  disabled, error, id, style, label, iconLeft, iconRight, kbd,
}: InpProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? "var(--state-error)"
    : focused
      ? "var(--secondary)"
      : "var(--border)";

  const kbdKeys = kbd
    ? (Array.isArray(kbd) ? kbd : [kbd])
    : null;

  const hasRight = iconRight || kbdKeys;

  /* padding offsets so text never slides under icons / kbd */
  const padLeft  = iconLeft ? "calc(var(--space-3) + var(--space-5))" : "var(--inp-padding-x, var(--space-3))";
  const padRight = hasRight ? "calc(var(--space-3) + var(--space-10))" : "var(--inp-padding-x, var(--space-3))";

  const inputEl = (
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
        padding: `var(--inp-padding-y, 9px) ${padRight} var(--inp-padding-y, 9px) ${padLeft}`,
        borderRadius: "var(--radius-input)",
        border: `1px solid ${borderColor}`,
        background: "var(--bg-input)",
        color: "var(--fg)",
        fontSize: "var(--font-size-inp)" as React.CSSProperties["fontSize"],
        fontFamily: "inherit",
        outline: "none",
        opacity: disabled ? ("var(--inp-opacity-disabled)" as React.CSSProperties["opacity"]) : 1,
        cursor: disabled ? "not-allowed" : "auto",
        transition: "border-color 0.15s ease",
        boxSizing: "border-box",
        ...style,
      }}
    />
  );

  /* Plain input — no adornments, no label */
  if (!iconLeft && !hasRight && !label) return inputEl;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      {label && <Lbl htmlFor={id}>{label}</Lbl>}

      <div style={{ position: "relative", display: "flex", alignItems: "center", width: "100%" }}>
        {/* Left icon */}
        {iconLeft && (
          <span style={{
            position: "absolute", left: "var(--space-3)",
            display: "flex", alignItems: "center",
            color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
          }}>
            {iconLeft}
          </span>
        )}

        {inputEl}

        {/* Right icon */}
        {iconRight && !kbdKeys && (
          <span style={{
            position: "absolute", right: "var(--space-3)",
            display: "flex", alignItems: "center",
            color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
          }}>
            {iconRight}
          </span>
        )}

        {/* Right kbd */}
        {kbdKeys && (
          <span style={{
            position: "absolute", right: "var(--space-3)",
            display: "flex", alignItems: "center", zIndex: 1,
          }}>
            <KbdGroup>
              {kbdKeys.map(k => <Kbd key={k}>{k}</Kbd>)}
            </KbdGroup>
          </span>
        )}
      </div>
    </div>
  );
}
