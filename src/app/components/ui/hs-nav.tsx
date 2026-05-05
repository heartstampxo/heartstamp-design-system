import React, { useState } from "react";
import { Search, Menu, X } from "lucide-react";
import { Btn } from "./btn";
import { HSLogo, useIsDark } from "./hs-logo";
import lockupDark from "../../../assets/type=Lockup, color=brand, Theme=Dark.svg?url";

const iconBtn: React.CSSProperties = {
  width: "var(--space-6)", height: "var(--space-6)", display: "flex", alignItems: "center", justifyContent: "center",
  background: "none", border: "none", cursor: "pointer",
  color: "var(--muted-fg)", borderRadius: "var(--radius-sm)", flexShrink: 0,
};

/* ─────────────────────────────────────────────────────────────
   hs-nav — HeartStamp website Top Nav
   ─ Desktop : Logo + search + Log in / Sign up
   ─ Mobile  : Hamburger | Logo | Hamburger + slide-out drawer
─────────────────────────────────────────────────────────────── */

const NAV_LINKS = ["Home", "Explore", "Campaigns", "Pricing", "About"];

/* ── TopNavDesktop ─────────────────────────────────────────── */
export function TopNavDesktop() {
  const isDark = useIsDark();
  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        width: "100%",
        padding: "0 var(--space-10)",
        height: 76,
        background: "var(--bg)",
        borderBottom: "1px solid var(--border)",
        gap: "var(--space-6)",
      }}
    >
      {isDark
        ? <img src={lockupDark} height={36} width={144} alt="HeartStamp" style={{ display: "block" }} />
        : <HSLogo type="lockup" color="brand" height={36} />
      }

      {/* Pill search */}
      <div style={{ flex: 1, maxWidth: 420 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-full)",
            padding: "0 var(--space-3)",
            height: 38,
          }}
        >
          <Search size={14} style={{ color: "var(--muted-fg)", flexShrink: 0 }} />
          <input
            placeholder="Search"
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: "var(--font-size-body-13)",
              color: "var(--fg)",
              fontFamily: "inherit",
            }}
          />
          <span
            style={{
              fontSize: "var(--font-size-label-12)",
              color: "var(--muted-fg)",
              background: "var(--muted)",
              padding: "var(--space-0) var(--space-1-5)",
              borderRadius: "var(--radius-xs)",
              flexShrink: 0,
              fontFamily: "inherit",
            }}
          >
            ⌘F
          </span>
        </div>
      </div>

      {/* Auth buttons */}
      <div style={{ display: "flex", gap: "var(--space-2)", marginLeft: "auto", flexShrink: 0 }}>
        <Btn variant="outline" size="sm">Log in</Btn>
        <Btn variant="default" size="sm">Sign up</Btn>
      </div>
    </nav>
  );
}

/* ── TopNavMobile ──────────────────────────────────────────── */
export function TopNavMobile() {
  const [open, setOpen] = useState(false);
  const isDark = useIsDark();

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 393, overflow: "hidden" }}>
      {/* Bar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          padding: "0 var(--space-4)",
          height: 64,
          background: "var(--bg)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <button
          style={iconBtn}
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-brand-secondary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
        >
          <Menu size={18} />
        </button>
        {isDark
          ? <img src={lockupDark} height={32} width={128} alt="HeartStamp" style={{ display: "block" }} />
          : <HSLogo type="lockup" color="brand" height={32} />
        }
        <button
          style={iconBtn}
          aria-label="Search"
          onMouseEnter={e => (e.currentTarget.style.color = "var(--color-brand-secondary)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--muted-fg)")}
        >
          <Search size={18} />
        </button>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: "absolute",
          inset: 0,
          top: 64,
          background: "rgba(0,0,0,0.3)",
          zIndex: 40,
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "absolute",
          top: 64,
          left: 0,
          width: 260,
          background: "var(--bg)",
          borderRight: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          borderRadius: "0 0 var(--radius-lg) 0",
          transform: open ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4,0,0.2,1)",
          zIndex: 50,
          display: "flex",
          flexDirection: "column",
          padding: "var(--space-4)",
          gap: "var(--space-0)",
          height: 400,
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "var(--space-3)",
          }}
        >
          <HSLogo type="lockup" color="brand" height={32} />
          <Btn variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close menu">
            <X size={16} />
          </Btn>
        </div>

        {/* Links */}
        {NAV_LINKS.map((link) => (
          <button
            key={link}
            onClick={() => setOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              textAlign: "left",
              fontSize: "var(--font-size-body-13)",
              fontWeight: "var(--font-weight-label-15)",
              color: "var(--fg)",
              padding: "var(--space-2) var(--space-2)",
              borderRadius: "var(--radius-md)",
              fontFamily: "inherit",
              transition: "background 0.12s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            {link}
          </button>
        ))}

        {/* Auth */}
        <div
          style={{
            marginTop: "auto",
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-2)",
            paddingTop: "var(--space-3)",
            borderTop: "1px solid var(--border)",
          }}
        >
          <Btn variant="outline" style={{ width: "100%", justifyContent: "center" }}>Log in</Btn>
          <Btn variant="default" style={{ width: "100%", justifyContent: "center" }}>Sign up</Btn>
        </div>
      </div>
    </div>
  );
}
