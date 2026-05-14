import React, { useId, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";

export interface PillTabItem {
  value: string;
  label: string;
  /** Count shown as a badge. Used by the "count" (pill, right) and "badge" (square, left) variants. */
  count?: number;
  /** Icon rendered to the left of the label. Only used by the "icon" variant. */
  icon?: React.ReactNode;
}

export interface PillTabsProps {
  value: string;
  onValueChange: (value: string) => void;
  tabs: PillTabItem[];
  /**
   * "default" — equal-width tabs, no extras (standard pill switcher).
   * "count"   — content-sized tabs; pill badge on the right (primary on active, subtle on inactive).
   * "badge"   — content-sized tabs; filled square badge on the left (primary on active, subtle on inactive).
   * "icon"    — content-sized tabs; ReactNode icon on the left.
   */
  variant?: "default" | "count" | "badge" | "icon";
  /** Accessible label for the tab group. Recommended when multiple PillTabs appear on the same page. */
  "aria-label"?: string;
  style?: React.CSSProperties;
}

/* ── Shared spring for the sliding active indicator ──────────── */
const INDICATOR_SPRING = { type: "spring", stiffness: 400, damping: 32 } as const;

export function PillTabs({
  value,
  onValueChange,
  tabs,
  variant = "default",
  style,
  "aria-label": ariaLabel,
}: PillTabsProps) {
  const id      = useId();
  const reduced = useReducedMotion();
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const isCount   = variant === "count";
  const isBadge   = variant === "badge";
  const isIcon    = variant === "icon";
  const isCompact = isCount || isBadge || isIcon;

  function handleKeyDown(e: React.KeyboardEvent, index: number) {
    let next = -1;
    if (e.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (e.key === "ArrowLeft")  next = (index - 1 + tabs.length) % tabs.length;
    if (next === -1) return;
    e.preventDefault();
    onValueChange(tabs[next].value);
    btnRefs.current[next]?.focus();
  }

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      style={{
        display: "flex",
        background: "var(--color-brand-secondary-dim)",
        borderRadius: "var(--radius-full)",
        padding: "var(--space-1)",
        gap: isCompact ? "var(--space-2)" : undefined,
        position: "relative",
        ...style,
      }}
    >
      {tabs.map((tab, i) => {
        const isActive = value === tab.value;
        return (
          <button
            key={tab.value}
            ref={el => { btnRefs.current[i] = el; }}
            type="button"
            role="tab"
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onValueChange(tab.value)}
            onKeyDown={e => handleKeyDown(e, i)}
            style={{
              flex: isCompact ? undefined : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: isCompact ? "var(--space-1-5)" : undefined,
              height: 30,
              padding: isCompact ? "var(--space-1) var(--space-3)" : undefined,
              borderRadius: "var(--radius-full)",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-family-body)",
              fontSize: "var(--font-size-body-13)",
              fontWeight: (isActive
                ? "var(--font-weight-medium)"
                : "var(--font-weight-normal)") as React.CSSProperties["fontWeight"],
              color: isActive ? "var(--color-text-primary)" : "var(--color-text-secondary)",
              background: "transparent",
              position: "relative",
              zIndex: 1,
              outline: "none",
              whiteSpace: "nowrap",
              transition: "color .15s",
            }}
          >
            {/* Sliding active pill indicator */}
            {isActive && (
              <motion.div
                layoutId={`pill-tab-indicator-${id}`}
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-bg-main)",
                  boxShadow: "0 0 2px rgba(0,0,0,.08), 0 1px 3px rgba(0,0,0,.08)",
                  zIndex: -1,
                }}
                transition={reduced ? { duration: 0 } : INDICATOR_SPRING}
              />
            )}

            {/* Badge variant — filled square badge on the LEFT */}
            {isBadge && tab.count !== undefined && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minWidth: "var(--space-5)",
                  padding: "var(--space-0-5) var(--space-2)",
                  borderRadius: "var(--radius-md)",
                  background: isActive ? "var(--color-brand-primary)" : "var(--color-element-subtle)",
                  fontFamily: "var(--font-family-body)",
                  fontSize: "var(--font-size-label-12)",
                  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
                  color: isActive ? "var(--color-text-on-primary)" : "var(--color-text-primary)",
                  flexShrink: 0,
                  transition: "background .15s, color .15s",
                }}
              >
                {tab.count}
              </span>
            )}

            {/* Icon variant — ReactNode icon on the LEFT */}
            {isIcon && tab.icon && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 16,
                  height: 16,
                  flexShrink: 0,
                }}
              >
                {tab.icon}
              </span>
            )}

            {tab.label}

            {/* Count variant — pill badge on the RIGHT */}
            {isCount && tab.count !== undefined && (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "var(--space-5)",
                  minWidth: "var(--space-5)",
                  padding: "0 var(--space-1)",
                  borderRadius: "var(--radius-full)",
                  background: isActive ? "var(--color-brand-primary)" : "var(--color-element-subtle)",
                  fontFamily: "var(--font-family-body)",
                  fontSize: "var(--font-size-label-12)",
                  fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
                  color: isActive ? "var(--color-text-on-primary)" : "var(--color-text-primary)",
                  transition: "background .15s, color .15s",
                }}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
