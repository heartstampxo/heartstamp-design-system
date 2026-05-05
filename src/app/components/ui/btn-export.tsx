/**
 * HeartStamp — Btn component (standalone export)
 *
 * Drop this file into any Figma Make project.
 * The <BtnTokens /> component injects all required CSS variables
 * as defaults — override any of them in your own theme to customise.
 *
 * Usage:
 *   import { Btn, BtnTokens } from "./btn-export";
 *
 *   function App() {
 *     return (
 *       <>
 *         <BtnTokens />                          // inject token defaults once, at the root
 *         <Btn variant="default">Click me</Btn>
 *         <Btn variant="secondary" size="sm">Small</Btn>
 *         <Btn variant="outline" size="lg">Large outline</Btn>
 *         <Btn variant="link">Link</Btn>
 *         <Btn variant="ghost">Ghost</Btn>
 *         <Btn variant="destructive">Delete</Btn>
 *       </>
 *     );
 *   }
 */

import React, { useState } from "react";

/* ─────────────────────────────────────────────────────────────────────────────
   TOKEN DEFAULTS
   Rendered once at the root via <BtnTokens />.
   Any CSS variable already defined higher up in your project wins automatically
   (these are :root fallbacks only).
───────────────────────────────────────────────────────────────────────────── */
export function BtnTokens() {
  return (
    <style>{`
      :root {
        /* ── Spacing & sizing ── */
        --btn-padding-sm:      8px 12px;
        --btn-padding-default: 10px 16px;
        --btn-padding-lg:      12px 20px;
        --btn-padding-icon:    8px;
        --btn-gap:             6px;

        /* ── Typography ── */
        --font-size-btn-sm:  12px;
        --font-size-btn:     13px;
        --font-size-btn-lg:  15px;
        --font-weight-btn:   500;

        /* ── Radius ── */
        --radius-button: 25px;

        /* ── Brand colours (light mode) ── */
        --accent:            #be1d2c;
        --accent-hover:      #d42031;
        --accent-subtle:     rgba(190,29,44,0.08);
        --secondary:         #242423;
        --secondary-hover:   #313130;
        --secondary-subtle:  rgba(36,36,35,0.10);
        --text-on-primary:   #ffffff;
        --text-on-secondary: #ffffff;
        --fg:                #242423;
        --border:            rgba(36,36,35,0.1);
        --state-hover:       rgba(36,36,35,0.06);
        --link:              #be1d2c;

        /* ── Ghost hover ── */
        --btn-secondary-ghost-hover-bg:  rgba(36,36,35,0.12);
        --btn-secondary-ghost-hover-bdr: rgba(36,36,35,0.15);
      }
    `}</style>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
export type BtnVariant =
  | "default"
  | "secondary"
  | "outline"
  | "ghost"
  | "secondary-ghost"
  | "link"
  | "destructive";

export type BtnSize = "default" | "sm" | "lg" | "icon";

export interface BtnProps {
  variant?: BtnVariant;
  size?: BtnSize;
  disabled?: boolean;
  children?: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  style?: React.CSSProperties;
  /** native button type attribute */
  type?: "button" | "submit" | "reset";
}

/* ─────────────────────────────────────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────────────────────────────────────── */
export function Btn({
  variant = "default",
  size = "default",
  disabled,
  children,
  onClick,
  style,
  type = "button",
}: BtnProps) {
  const [hovered, setHovered] = useState(false);

  const hoverMap: Record<string, React.CSSProperties> = {
    default:           { background: "var(--accent-hover)",                 borderColor: "var(--accent-hover)" },
    secondary:         { background: "var(--secondary-hover)",              borderColor: "var(--secondary-hover)" },
    ghost:             { background: "var(--accent-subtle)",                borderColor: "transparent" },
    "secondary-ghost": { background: "var(--btn-secondary-ghost-hover-bg)", borderColor: "var(--btn-secondary-ghost-hover-bdr)" },
    outline:           { background: "var(--state-hover)",                  borderColor: "var(--border)" },
  };

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--btn-gap)",
    fontFamily: "inherit",
    fontWeight: "var(--font-weight-btn)" as React.CSSProperties["fontWeight"],
    borderRadius: "var(--radius-button)",
    border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    transition: "all .15s ease",
    whiteSpace: "nowrap",
    fontSize:
      size === "sm" ? "var(--font-size-btn-sm)"
      : size === "lg" ? "var(--font-size-btn-lg)"
      : "var(--font-size-btn)",
    padding:
      size === "sm"   ? "var(--btn-padding-sm)"
      : size === "lg"   ? "var(--btn-padding-lg)"
      : size === "icon" ? "var(--btn-padding-icon)"
      : "var(--btn-padding-default)",
  };

  const vmap: Record<BtnVariant, React.CSSProperties> = {
    default:           { background: "var(--accent)",           color: "var(--text-on-primary)",   borderColor: "var(--accent)" },
    secondary:         { background: "var(--secondary)",        color: "var(--text-on-secondary)", borderColor: "var(--secondary)" },
    outline:           { background: "transparent",             color: "var(--fg)",                borderColor: "var(--border)" },
    ghost:             { background: "var(--accent-subtle)",    color: "var(--accent)",            borderColor: "transparent" },
    "secondary-ghost": { background: "var(--secondary-subtle)", color: "var(--secondary)",         borderColor: "transparent" },
    link:              { background: "transparent",             color: "var(--link)",              borderColor: "transparent", textDecoration: "underline", padding: "0" },
    destructive:       { background: "#ef4444",                 color: "#fff",                     borderColor: "#ef4444" },
  };

  const hoverStyle = hovered && !disabled && hoverMap[variant] ? hoverMap[variant] : {};

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...base, ...vmap[variant], ...hoverStyle, ...style }}
    >
      {children}
    </button>
  );
}
