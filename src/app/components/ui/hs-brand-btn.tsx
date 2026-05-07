import React, { useState } from "react";

/* ─── Shared base ─────────────────────────────────────────────
   Figma spec (node 640:159193):
   · height 56px · border-radius var(--radius-full) pill
   · font-size btn-lg (15px) · font-weight 600 (semibold)
   · padding 0 24px · gap 8px between logo and label
─────────────────────────────────────────────────────────────── */

export interface BrandBtnProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Override the default button label. */
  label?: string;
}

function BrandBase({
  bg,
  hoverBg,
  borderColor,
  hoverBorderColor,
  color,
  label,
  logo,
  disabled,
  style,
  ...props
}: {
  bg: string;
  hoverBg: string;
  borderColor: string;
  hoverBorderColor?: string;
  color: string;
  label: string;
  logo: React.ReactNode;
} & BrandBtnProps) {
  const [hovered, setHovered] = useState(false);
  const active = hovered && !disabled;

  return (
    <button
      disabled={disabled}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        /* 56px height — Figma spec; no space token at this value */
        gap: "var(--space-2)",
        height: "56px",
        paddingLeft: "var(--space-6)",
        paddingRight: "var(--space-6)",
        borderRadius: "var(--radius-full)",
        border: `1px solid ${active ? (hoverBorderColor ?? hoverBg) : borderColor}`,
        background: active ? hoverBg : bg,
        color,
        fontSize: "var(--font-size-btn-lg)",
        fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
        lineHeight: 1,
        cursor: disabled ? "not-allowed" : "pointer",
        userSelect: "none" as React.CSSProperties["userSelect"],
        whiteSpace: "nowrap" as React.CSSProperties["whiteSpace"],
        transition: "background 0.15s ease, border-color 0.15s ease",
        width: "260px",
        boxSizing: "border-box" as React.CSSProperties["boxSizing"],
        outline: "none",
        fontFamily: "inherit",
        opacity: disabled ? 0.5 : 1,
        ...style,
      }}
      {...props}
    >
      {logo}
      {label}
    </button>
  );
}

/* ─── Brand logos ─────────────────────────────────────────────── */

function AppleLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
    </svg>
  );
}

function GoogleLogo({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

/* Amazon Pay wordmark — "amazon" bold + orange smile arc + "pay" (Figma node 2100:17876, 146×28) */
function AmazonPayLogo() {
  return (
    <svg width="130" height="26" viewBox="0 0 130 26" aria-hidden="true">
      <text x="0" y="18" fontSize="17" fontWeight="700" fontFamily="Arial,Helvetica,sans-serif" fill="#111111">amazon</text>
      <path d="M4 22 C25 30 58 30 82 22" stroke="#FF9900" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M78 20.5 L82 22 L79.5 25.5" stroke="#FF9900" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="90" y="18" fontSize="17" fontWeight="400" fontFamily="Arial,Helvetica,sans-serif" fill="#111111">pay</text>
    </svg>
  );
}

/* Link Pay logo — white circle with chevron + "link" text (Figma node 2100:17895, 72×24) */
function LinkPayLogo() {
  return (
    <svg width="72" height="24" viewBox="0 0 72 24" aria-hidden="true">
      <circle cx="12" cy="12" r="11" fill="white" />
      <path d="M9.5 8 L14.5 12 L9.5 16" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="29" y="17" fontSize="15" fontWeight="700" fontFamily="Arial,Helvetica,sans-serif" fill="#111111">link</text>
    </svg>
  );
}

/* ─── Exported brand buttons ─────────────────────────────────── */

/** Apple Pay — dark charcoal pill, white Apple logo + "Pay". Matches Figma node 640:159193. */
export function AppleBtn({ label = "Pay", ...props }: BrandBtnProps) {
  return (
    <BrandBase
      bg="#1c1c1e"
      hoverBg="#2c2c2e"
      borderColor="transparent"
      color="#ffffff"
      label={label}
      logo={<AppleLogo />}
      {...props}
    />
  );
}

/** Google Pay — light pill with border, Google G logo + "Pay". Matches Figma node 640:159193. */
export function GoogleBtn({ label = "Pay", ...props }: BrandBtnProps) {
  return (
    <BrandBase
      bg="#f8f8f7"
      hoverBg="#f0f0ef"
      borderColor="rgba(0,0,0,0.12)"
      hoverBorderColor="rgba(0,0,0,0.18)"
      color="#1d1d1f"
      label={label}
      logo={<GoogleLogo />}
      {...props}
    />
  );
}

/** Amazon Pay — yellow pill, Amazon Pay wordmark centred. Matches Figma node 640:159193. */
export function AmazonBtn({ label = "", ...props }: BrandBtnProps) {
  return (
    <BrandBase
      bg="#FFD814"
      hoverBg="#e6c800"
      borderColor="transparent"
      color="#111111"
      label={label}
      logo={<AmazonPayLogo />}
      {...props}
    />
  );
}

/** Link Pay — green pill, white circle chevron + "link" wordmark. Matches Figma node 640:159193. */
export function LinkBtn({ label = "", ...props }: BrandBtnProps) {
  return (
    <BrandBase
      bg="#00D13F"
      hoverBg="#00b835"
      borderColor="transparent"
      color="#111111"
      label={label}
      logo={<LinkPayLogo />}
      {...props}
    />
  );
}
