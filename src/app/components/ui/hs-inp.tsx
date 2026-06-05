import React from "react";
import { Lbl } from "./hs-lbl";
import { Kbd, KbdGroup } from "./hs-kbd";
import { cn } from "./utils";

/* ─────────────────────────────────────────────────────────────
   hs-inp — HeartStamp Input primitive
   ·  Supports: plain, icon-left, icon-right, kbd shortcut, label
   ·  Visual rules live in inp.css (.hs-inp*) — no inline styles,
      no Tailwind utilities in this file
   ·  Focus / error / disabled handled by CSS pseudo-classes and
      BEM modifiers (no JS focus state)
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
  /** Extra class names merged onto the input element. */
  className?: string;
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
  disabled, error, id, style, className, label, iconLeft, iconRight, kbd,
}: InpProps) {
  const kbdKeys = kbd
    ? (Array.isArray(kbd) ? kbd : [kbd])
    : null;

  const hasRight = iconRight || kbdKeys;

  const inputEl = (
    <input
      id={id}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={cn(
        "hs-inp__field",
        iconLeft && "hs-inp__field--icon-left",
        hasRight && "hs-inp__field--icon-right",
        error && "hs-inp__field--error",
        className,
      )}
      style={style}
    />
  );

  /* Plain input — no adornments, no label */
  if (!iconLeft && !hasRight && !label) return inputEl;

  return (
    <div className="hs-inp">
      {label && <Lbl htmlFor={id}>{label}</Lbl>}

      <div className="hs-inp__control">
        {/* Left icon */}
        {iconLeft && (
          <span className="hs-inp__adornment hs-inp__adornment--left">
            {iconLeft}
          </span>
        )}

        {inputEl}

        {/* Right icon */}
        {iconRight && !kbdKeys && (
          <span className="hs-inp__adornment hs-inp__adornment--right">
            {iconRight}
          </span>
        )}

        {/* Right kbd */}
        {kbdKeys && (
          <span className="hs-inp__adornment hs-inp__adornment--kbd">
            <KbdGroup>
              {kbdKeys.map(k => <Kbd key={k}>{k}</Kbd>)}
            </KbdGroup>
          </span>
        )}
      </div>
    </div>
  );
}
