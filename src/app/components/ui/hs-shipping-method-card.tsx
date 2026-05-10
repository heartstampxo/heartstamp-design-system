import React, { useRef, useState } from "react";

/*
  hs-shipping-method-card — Selectable shipping method row

  ShippingMethodCard
  · Displays a shipping method with an optional tag pill, method name, arrival estimate, and price
  · Checked / unchecked selection state with accessible keyboard interaction
*/

/* ─── Private: checkbox ──────────────────────────────────────── */

function ShipCheckbox({ checked }: { checked: boolean }) {
  return (
    <div
      aria-hidden="true"
      style={{
        width:        "var(--space-6)",
        height:       "var(--space-6)",
        flexShrink:   0,
        borderRadius: "var(--radius-lg)",
        border:       checked ? "none" : "1.5px solid var(--color-element-subtle)",
        background:   checked ? "var(--color-text-primary)" : "transparent",
        display:      "flex",
        alignItems:   "center",
        justifyContent: "center",
        transition:   "background 0.15s ease, border-color 0.15s ease",
      }}
    >
      {checked && (
        <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
          <path
            d="M1.5 5L5 8.5L11.5 1.5"
            stroke="var(--color-bg-main)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   ShippingMethodCard
══════════════════════════════════════════════════════════════ */

export interface ShippingMethodCardProps {
  /** Optional tag pill label (e.g. `"Economy"`, `"Standard"`, `"Rush"`). Hidden when omitted. */
  tag?: string;
  /** Shipping method name (e.g. `"Standard Shipping"`). */
  name: string;
  /** Arrival estimate text (e.g. `"Arrives Oct 15–17"`). */
  estimate: string;
  /** Price string (e.g. `"Free"` or `"$4.99"`). */
  price: string;
  /** Whether this method is currently selected. Defaults to `false`. */
  selected?: boolean;
  /** Called when the user clicks or presses the card row. */
  onChange?: (selected: boolean) => void;
  style?: React.CSSProperties;
  className?: string;
}

export function ShippingMethodCard({
  tag,
  name,
  estimate,
  price,
  selected  = false,
  onChange,
  style,
  className,
}: ShippingMethodCardProps) {
  const [focusVisible, setFocusVisible] = useState(false);
  const pointerDown = useRef(false);

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-label={name}
      tabIndex={0}
      onClick={() => onChange?.(!selected)}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), onChange?.(!selected))}
      onPointerDown={() => { pointerDown.current = true; }}
      onFocus={() => { if (!pointerDown.current) setFocusVisible(true); }}
      onBlur={() => { setFocusVisible(false); pointerDown.current = false; }}
      style={{
        display:       "flex",
        alignItems:    "center",
        gap:           "var(--space-8)",
        minHeight:     120,
        boxSizing:     "border-box",
        padding:       "var(--space-5)",
        borderRadius:  "var(--radius-2xl)",
        border:        "none",
        boxShadow:     selected
          ? "0 0 0 2px var(--color-text-primary)"
          : "0 0 0 1px var(--border)",
        outline:       focusVisible ? "2px solid var(--color-ring)" : "none",
        outlineOffset: 2,
        background:    "var(--color-bg-main)",
        cursor:        "pointer",
        userSelect:    "none",
        transition:    "box-shadow 0.15s ease",
        ...style,
      }}
      className={className}
    >
      {/* ── Left: tag + name + estimate ─────────────── */}
      <div style={{
        flex:          1,
        display:       "flex",
        flexDirection: "column",
        gap:           "var(--space-2)",
      }}>
        {tag && (
          <span style={{
            alignSelf:    "flex-start",
            display:      "inline-flex",
            padding:      "2px var(--space-2)",
            borderRadius: "var(--radius-full)",
            background:   "var(--color-element-disabled)",
            fontSize:     "var(--font-size-label-12)",
            fontWeight:   "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            color:        "var(--color-text-primary)",
            lineHeight:   1.4,
          }}>
            {tag}
          </span>
        )}
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "var(--space-1)",
        }}>
          <span style={{
            fontSize:   "var(--font-size-label-15)",
            fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            lineHeight: 1.2,
          }}>
            {name}
          </span>
          <span style={{
            fontSize:   "var(--font-size-body-15)",
            fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-secondary)",
          }}>
            {estimate}
          </span>
        </div>
      </div>

      {/* ── Price ───────────────────────────────────── */}
      <span style={{
        flexShrink: 0,
        fontSize:   "var(--font-size-label-15)",
        fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
        color:      "var(--color-text-primary)",
      }}>
        {price}
      </span>

      {/* ── Checkbox ────────────────────────────────── */}
      <ShipCheckbox checked={selected} />
    </div>
  );
}
