import React, { useRef, useState, useEffect } from "react";
import { HSLogo, useIsDark } from "./hs-logo";
import { SOCIAL_PLATFORMS } from "./hs-social-icons";
import lockupDark from "../../../assets/type=Lockup, color=brand, Theme=Dark.svg?url";

/* ─────────────────────────────────────────────────────────────
   hs-footer — HeartStamp website Footer (responsive)
   ─ Wide  (≥768px) : Logo + nav links | social icons / divider / copyright + legal
   ─ Narrow (<768px) : Centered stacked layout
─────────────────────────────────────────────────────────────── */

const NAV_LINKS = ["Home", "About Us", "Contact"];
const LEGAL_LINKS = ["Privacy Policy", "Terms of Service", "Cookies Settings"];

/* ── Social marks live in hs-social-icons so the footer and the social
   handles editor share one copy of each glyph ─────────────────── */
const SOCIAL_ICONS = SOCIAL_PLATFORMS.map(({ name, Icon }) => ({ name, Icon }));

/* shared styles — using design tokens */
const linkStyle: React.CSSProperties = {
  color: "var(--color-text-secondary)",
  fontSize: "var(--font-size-body-15)",
  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "inherit",
  whiteSpace: "nowrap",
};

const legalStyle: React.CSSProperties = {
  color: "var(--color-text-secondary)",
  fontSize: "var(--font-size-body-15)",
  fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
  lineHeight: "20px",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
  fontFamily: "inherit",
};

const dividerStyle: React.CSSProperties = {
  alignSelf: "stretch",
  height: 0,
  borderTop: "1px solid var(--color-element-subtle)",
};

const socialIconStyle: React.CSSProperties = {
  color: "var(--color-text-primary)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  background: "none",
  border: "none",
  padding: 0,
};

/* hover helpers — using semantic color tokens */
const hoverFg = (e: React.MouseEvent<HTMLButtonElement>) =>
  (e.currentTarget.style.color = "var(--color-text-primary)");
const resetMuted = (e: React.MouseEvent<HTMLButtonElement>) =>
  (e.currentTarget.style.color = "var(--color-text-secondary)");

/* ── Social icon row with spotlight hover ───────────────────── */
function SocialIconRow({ gap }: { gap: string }) {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap,
      }}
      onMouseLeave={() => setHovered(null)}
    >
      {SOCIAL_ICONS.map(({ name, Icon }) => {
        const isActive = hovered === name;
        const isDimmed = hovered !== null && !isActive;
        return (
          <button
            key={name}
            style={{
              ...socialIconStyle,
              color: isActive
                ? "var(--color-text-primary)"
                : isDimmed
                  ? "var(--color-text-disabled)"
                  : "var(--color-text-primary)",
              opacity: isDimmed ? 0.35 : 1,
              transition: "color 0.2s ease, opacity 0.2s ease",
              transform: isActive ? "scale(1.1)" : "scale(1)",
            }}
            aria-label={name}
            onMouseEnter={() => setHovered(name)}
          >
            <Icon />
          </button>
        );
      })}
    </div>
  );
}

/* ── Breakpoint for layout switch ───────────────────────────── */
const BP = 768;

interface FooterProps {
  /** Force a specific layout. When omitted the component auto-switches
   *  between "desktop" and "mobile" based on its own container width (768 px). */
  layout?: "desktop" | "mobile";
}

/* ── Footer (responsive) ────────────────────────────────────── */
export function Footer({ layout }: FooterProps = {}) {
  const ref = useRef<HTMLElement>(null);
  const isDark = useIsDark();
  const [autoWide, setAutoWide] = useState(true);

  useEffect(() => {
    /* Skip ResizeObserver when layout is forced via prop */
    if (layout) return;
    const el = ref.current;
    if (!el) return;
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(([entry]) => {
      setAutoWide(entry.contentRect.width >= BP);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [layout]);

  /* Resolve final layout: prop wins, otherwise auto-detect */
  const wide = layout ? layout === "desktop" : autoWide;

  /* shared pieces */
  const logo = isDark ? (
    <img
      src={lockupDark}
      height={wide ? 44 : 35}
      width={wide ? 176 : 140}
      alt="HeartStamp"
      style={{ display: "block" }}
    />
  ) : (
    <HSLogo type="lockup" color="brand" height={wide ? 44 : 35} />
  );

  const navLinks = NAV_LINKS.map((link) => (
    <button
      key={link}
      style={{
        ...linkStyle,
        textAlign: wide ? undefined : "center",
      }}
      onMouseEnter={hoverFg}
      onMouseLeave={resetMuted}
    >
      {link}
    </button>
  ));

  const legalLinks = LEGAL_LINKS.map((link) => (
    <button
      key={link}
      style={{
        ...legalStyle,
        textAlign: wide ? undefined : "center",
        fontSize: wide ? "var(--font-size-body-15)" : "var(--font-size-body-13)",
      }}
      onMouseEnter={hoverFg}
      onMouseLeave={resetMuted}
    >
      {link}
    </button>
  ));

  /* ── Wide / Desktop layout ────────────────────────────────── */
  if (wide) {
    return (
      <footer
        ref={ref}
        style={{
          width: "100%",
          paddingTop: "var(--space-12)",
          paddingBottom: "calc(var(--space-12) * 2)",
          paddingLeft: "var(--space-10)",
          paddingRight: "var(--space-10)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-8)",
          background: "var(--color-bg-main)",
        }}
      >
        <div
          style={{
            alignSelf: "stretch",
            paddingLeft: "var(--space-6)",
            paddingRight: "var(--space-6)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "calc(var(--space-8) * 2)",
          }}
        >
          {/* Top row: logo + nav | social icons */}
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-6)" }}>
              {logo}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-8)" }}>
                {navLinks}
              </div>
            </div>
            <SocialIconRow gap="var(--space-8)" />
          </div>

          <div style={dividerStyle} />

          {/* Bottom row: copyright | legal links */}
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--font-size-body-15)",
                fontWeight: "var(--font-weight-normal)" as React.CSSProperties["fontWeight"],
                lineHeight: "20px",
              }}
            >
              Copyright 2025 &copy; Heartstamp Inc.
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-7)" }}>
              {legalLinks}
            </div>
          </div>
        </div>
      </footer>
    );
  }

  /* ── Narrow / Mobile layout ───────────────────────────────── */
  return (
    <footer
      ref={ref}
      style={{
        width: "100%",
        paddingTop: "var(--space-12)",
        paddingBottom: "calc(var(--space-8) * 2)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "var(--space-8)",
        background: "var(--color-bg-main)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 672,
          paddingLeft: "var(--space-4)",
          paddingRight: "var(--space-4)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6)",
        }}
      >
        {/* Logo + nav + social — stacked centered */}
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-12)",
          }}
        >
          {logo}
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "var(--space-6)",
            }}
          >
            {navLinks}
          </div>
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <SocialIconRow gap="var(--space-6)" />
          </div>
        </div>

        <div style={dividerStyle} />

        {/* Legal + copyright — stacked */}
        <div
          style={{
            alignSelf: "stretch",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "var(--space-3)",
          }}
        >
          <div
            style={{
              alignSelf: "stretch",
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "var(--space-3)",
              flexWrap: "wrap",
            }}
          >
            {legalLinks}
          </div>
          <span
            style={{
              alignSelf: "stretch",
              textAlign: "center",
              color: "var(--color-text-secondary)",
              fontSize: "var(--font-size-body-13)",
              fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
              lineHeight: "20px",
            }}
          >
            Copyright 2025 &copy; Heartstamp Inc.
          </span>
        </div>
      </div>
    </footer>
  );
}

/* Convenience named exports for explicit layout */
export function FooterDesktop() { return <Footer layout="desktop" />; }
export function FooterMobile() { return <Footer layout="mobile" />; }
