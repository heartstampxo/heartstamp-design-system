import React, { useState, useRef, useEffect } from "react";
import { Search, FileHeart, Heart, ShoppingCart } from "lucide-react";
import { Btn } from "./btn";
import { Sep } from "./hs-sep";
import { HSLockup, HSEmblem } from "./hs-logo";
import { Inp } from "./hs-inp";
import { Avt } from "./hs-avt";
import { ProfileNavDesktop } from "./profile-nav";

/* ─────────────────────────────────────────────────────────────
   hs-website-nav — HeartStamp website top navigation

   bgVariant
   · "default"  frosted glass (backdrop-blur) — homepage only
   · "solid"    opaque var(--color-bg-main)   — inner pages

   isLoggedIn
   · false  Invitation · Cart · Log in · Sign up
   · true   Invitation · Credits · Favorites · Cart · · Avatar
─────────────────────────────────────────────────────────────── */

const CATEGORIES = [
  "Birthday",
  "Valentine's Day",
  "Baby",
  "Anniversary",
  "Elegant",
  "Funny",
  "Party Invites",
];

export type WebsiteNavBgVariant = "default" | "solid";

export interface WebsiteNavProps {
  bgVariant?:       WebsiteNavBgVariant;
  isLoggedIn?:      boolean;
  credits?:         number;
  cartCount?:       number;
  avatarSrc?:       string;
  avatarInitials?:  string;
}

const BG_STYLES: Record<WebsiteNavBgVariant, React.CSSProperties> = {
  default: {
    background:           "color-mix(in srgb, var(--color-bg-main) 75%, transparent)",
    backdropFilter:        "saturate(200%) blur(20px)",
    WebkitBackdropFilter:  "saturate(200%) blur(20px)",
  },
  solid: {
    background: "var(--color-bg-main)",
  },
};

export function WebsiteNav({
  bgVariant      = "default",
  isLoggedIn     = false,
  credits        = 50,
  cartCount      = 0,
  avatarSrc,
  avatarInitials = "JS",
}: WebsiteNavProps) {
  return (
    <div style={{ width: "100%", ...BG_STYLES[bgVariant] }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 72, padding: "0 var(--space-10)",
        borderBottom: "1px solid var(--color-element-subtle)",
        gap: "var(--space-4)",
      }}>

        {/* Left: logo + search */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", flex: 1 }}>
          <HSLockup height={24} />

          <div style={{ width: 480, flexShrink: 0 }}>
            <Inp
              placeholder="Search"
              iconLeft={<Search size={14} />}
              kbd="⌘F"
              style={{ borderRadius: "var(--radius-full)" }}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)", flexShrink: 0 }}>

          <Btn variant="secondary" size="sm">
            <FileHeart size={16} />
            Invitation
          </Btn>

          {isLoggedIn ? (
            <>
              <Btn variant="secondary-ghost" size="sm">
                <HSEmblem height={16} />
                {credits} Heart Credits
              </Btn>

              {/* Icon cluster: 6px internal, 12px from Credits (16 − 4), sep→avatar 10px (6 + 4) */}
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)", marginLeft: -4 }}>
                <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Favorites">
                  <Heart size={16} />
                </Btn>

                <CartButton cartCount={cartCount} />

                <Sep orientation="vertical" style={{ height: 20 }} />

                <NavAvatar src={avatarSrc} fallback={avatarInitials} />
              </div>
            </>
          ) : (
            <>
              <CartButton cartCount={cartCount} />

              <Btn variant="outline" size="sm" style={{ borderRadius: "var(--radius-full)" }}>
                Log in
              </Btn>

              <Btn
                variant="default"
                size="sm"
                style={{
                  borderRadius: "var(--radius-full)",
                  background: "var(--color-state-error)",
                  color: "var(--color-text-on-primary)",
                }}
              >
                Sign up
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* ── Category strip ──────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "stretch",
        height: "var(--space-12)", padding: "0 var(--space-6)",
        gap: "var(--space-1)",
        overflowX: "auto",
        scrollbarWidth: "none",
      }}>
        {CATEGORIES.map(cat => <CategoryItem key={cat}>{cat}</CategoryItem>)}
      </div>

    </div>
  );
}

/* ── Avatar with ProfileNav dropdown ───────────────────────── */
function NavAvatar({ src, fallback }: { src?: string; fallback: string }) {
  const [open, setOpen]     = useState(false);
  const [theme, setTheme]   = useState<"light" | "dark" | "system">("system");
  const ref                 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", marginLeft: 4, flexShrink: 0 }}>
      <div
        role="button"
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        tabIndex={0}
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => e.key === "Enter" && setOpen(o => !o)}
        style={{ cursor: "pointer", display: "flex", borderRadius: "50%", outline: "none" }}
      >
        <Avt size={36} src={src} fallback={fallback} />
      </div>

      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 100 }}>
          <ProfileNavDesktop theme={theme} setTheme={setTheme} />
        </div>
      )}
    </div>
  );
}

/* ── Category nav item with bottom-stroke hover ─────────────── */
function CategoryItem({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <button
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: "100%", padding: "0 var(--space-4)",
        display: "flex", alignItems: "center",
        border: "none", borderRadius: 0,
        background: "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: "var(--font-weight-medium)" as React.CSSProperties["fontWeight"],
        color: "var(--color-text-primary)",
        textTransform: "uppercase",
        letterSpacing: "1.04px",
        whiteSpace: "nowrap", flexShrink: 0,
        boxShadow: hovered ? "inset 0 -2px 0 var(--color-brand-primary)" : "none",
        transition: "box-shadow 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

/* ── Cart button with optional badge ───────────────────────── */
function CartButton({ cartCount }: { cartCount: number }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <Btn
        variant="outline"
        size="icon-sm"
        style={{ border: "none" }}
        aria-label={`Cart${cartCount > 0 ? `, ${cartCount} item${cartCount === 1 ? "" : "s"}` : ""}`}
      >
        <ShoppingCart size={16} />
      </Btn>
      {cartCount > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: -4, right: -4,
            minWidth: 16, height: 16, padding: "0 var(--space-1)",
            background: "var(--color-state-error)",
            color: "var(--color-text-on-primary)",
            fontSize: 10, fontWeight: 700, lineHeight: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "var(--radius-full)",
            pointerEvents: "none",
          }}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </div>
  );
}
