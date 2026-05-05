import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, FileHeart, Heart, ShoppingCart, Menu, X, ChevronRight, LogIn } from "lucide-react";
import { Btn } from "./btn";
import { Sep } from "./hs-sep";
import { HSLockup, HSEmblem } from "./hs-logo";
import { Inp } from "./hs-inp";
import { Avt } from "./hs-avt";
import { ProfileNavDesktop } from "./profile-nav";

/* ─────────────────────────────────────────────────────────────
   hs-website-nav — HeartStamp website navigation

   WebsiteNav (desktop)
   · bgVariant "default"  frosted glass — homepage overlay
   · bgVariant "solid"    opaque bg    — inner pages

   WebsiteNavMobile
   · view "nav"    → logged-out or logged-in sheet
   · view "search" → search panel with recent / trending chips
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

const RECENT_SEARCHES   = ["Birthday cards", "Valentine's Day", "Baby shower"];
const TRENDING_SEARCHES = ["Wedding", "Thank you cards", "Graduation", "Baby shower", "Christmas"];

/* ── Shared section label style ─────────────────────────────── */
const sectionLabelStyle: React.CSSProperties = {
  fontSize:      "var(--font-size-label-12)",
  fontWeight:    "var(--font-weight-medium)" as React.CSSProperties["fontWeight"],
  color:         "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  margin:        "0 0 var(--space-2-5)",
};

/* ══════════════════════════════════════════════════════════════
   DESKTOP — WebsiteNav
══════════════════════════════════════════════════════════════ */

export type WebsiteNavBgVariant = "default" | "solid";

export interface WebsiteNavProps {
  bgVariant?:      WebsiteNavBgVariant;
  isLoggedIn?:     boolean;
  credits?:        number;
  cartCount?:      number;
  avatarSrc?:      string;
  avatarInitials?: string;
}

const BG_STYLES: Record<WebsiteNavBgVariant, React.CSSProperties> = {
  default: {
    background:          "color-mix(in srgb, var(--color-bg-main) 75%, transparent)",
    backdropFilter:       "saturate(200%) blur(20px)",
    WebkitBackdropFilter: "saturate(200%) blur(20px)",
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
          <HSLockup height={32} />
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

              {/* Icon cluster — 6px gap internally, -4px left offset keeps 12px from Credits */}
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
                variant="default" size="sm"
                style={{ borderRadius: "var(--radius-full)", background: "var(--color-state-error)", color: "var(--color-text-on-primary)" }}
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
        overflowX: "auto", scrollbarWidth: "none",
      }}>
        {CATEGORIES.map(cat => <CategoryItem key={cat}>{cat}</CategoryItem>)}
      </div>

    </div>
  );
}

/* ── Avatar with ProfileNav dropdown ───────────────────────── */
function NavAvatar({ src, fallback }: { src?: string; fallback: string }) {
  const [open, setOpen]   = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("system");
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", marginLeft: "var(--space-1)", flexShrink: 0 }}>
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
        <div style={{ position: "absolute", top: "calc(100% + var(--space-2))", right: 0, zIndex: 100 }}>
          <ProfileNavDesktop theme={theme} setTheme={setTheme} />
        </div>
      )}
    </div>
  );
}

/* ── Category nav item — bottom-stroke on hover ─────────────── */
function CategoryItem({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
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
        fontSize: "var(--font-size-body-13)" as React.CSSProperties["fontSize"],
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
            minWidth: "var(--space-4)", height: "var(--space-4)", padding: "0 var(--space-1)",
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

/* ══════════════════════════════════════════════════════════════
   MOBILE — WebsiteNavMobile
══════════════════════════════════════════════════════════════ */

export interface WebsiteNavMobileProps {
  isLoggedIn?:     boolean;
  credits?:        number;
  cartCount?:      number;
  avatarSrc?:      string;
  avatarInitials?: string;
  userName?:       string;
  /** Pre-open a specific view — useful for docs demos */
  initialView?:    "nav" | "search";
}

export function WebsiteNavMobile({
  isLoggedIn     = false,
  credits        = 50,
  cartCount      = 0,
  avatarSrc,
  avatarInitials = "JS",
  userName       = "Jane Smith",
  initialView    = "nav",
}: WebsiteNavMobileProps) {
  const [view, setView]           = useState<"nav" | "search">(initialView);
  const [searchVal, setSearchVal] = useState("");
  const [bodyMinH, setBodyMinH]   = useState(0);
  const navBodyRef                = useRef<HTMLDivElement>(null);

  const isSearch = view === "search";

  /* Snapshot nav height before switching so container never shrinks */
  const openSearch = () => {
    if (navBodyRef.current) setBodyMinH(navBodyRef.current.offsetHeight);
    setView("search");
  };
  const closeSearch = () => { setView("nav"); setSearchVal(""); };

  return (
    <div style={{ width: "100%", maxWidth: 393, background: "var(--color-bg-main)" }}>

      {/* ── Top bar — stable across views ───────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isSearch ? "auto 1fr auto" : "1fr auto 1fr",
        alignItems: "center",
        height: 64, padding: "0 var(--space-4)",
        borderBottom: "1px solid var(--color-element-subtle)",
        gap: "var(--space-2)",
      }}>

        {/* Left: menu */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Menu">
            <Menu size={20} />
          </Btn>
        </div>

        {/* Center: logo ↔ search input — always truly centered */}
        <div style={{ position: "relative", overflow: "hidden", minWidth: 0 }}>
          <AnimatePresence initial={false} mode="wait">
            {isSearch ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              >
                <Inp
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search"
                  iconLeft={<Search size={14} />}
                  style={{ borderRadius: "var(--radius-full)" }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <HSLockup height={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: cart+search ↔ close */}
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <AnimatePresence initial={false} mode="wait">
            {isSearch ? (
              <motion.div
                key="close-btn"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
              >
                <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Close search" onClick={closeSearch}>
                  <X size={20} />
                </Btn>
              </motion.div>
            ) : (
              <motion.div
                key="nav-icons"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ type: "spring", stiffness: 400, damping: 28 }}
                style={{ display: "flex", alignItems: "center", gap: "var(--space-1)" }}
              >
                <CartButton cartCount={cartCount} />
                <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Search" onClick={openSearch}>
                  <Search size={20} />
                </Btn>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Body — animates between nav and search ───────────── */}
      <div style={{ minHeight: bodyMinH || undefined, overflow: "hidden" }}>
        <AnimatePresence initial={false} mode="wait">

          {isSearch ? (
            /* ── Search panel ─────────────────────────────────── */
            <motion.div
              key="search-body"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{ padding: "var(--space-5) var(--space-4) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
            >
              <div>
                <p style={sectionLabelStyle}>Recent searches</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {RECENT_SEARCHES.map(term => (
                    <Btn key={term} variant="outline" size="sm" style={{ borderRadius: "var(--radius-full)", height: "var(--space-8)", fontSize: "var(--font-size-label-13)" }}>
                      {term}
                    </Btn>
                  ))}
                </div>
              </div>

              <Sep orientation="horizontal" />

              <div>
                <p style={sectionLabelStyle}>Trending searches 🔥</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                  {TRENDING_SEARCHES.map(term => (
                    <Btn key={term} variant="outline" size="sm" style={{ borderRadius: "var(--radius-full)", height: "var(--space-8)", fontSize: "var(--font-size-label-13)" }}>
                      {term}
                    </Btn>
                  ))}
                </div>
              </div>
            </motion.div>

          ) : (
            /* ── Nav panel ────────────────────────────────────── */
            <motion.div
              key="nav-body"
              ref={navBodyRef}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ type: "spring", stiffness: 340, damping: 28 }}
              style={{ padding: "var(--space-4) var(--space-4) var(--space-6)", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}
            >
              {/* Auth: user card + Invitation */}
              {isLoggedIn && (
                <>
                  <button style={{
                    display: "flex", alignItems: "center", gap: "var(--space-3)",
                    padding: "var(--space-3)",
                    background: "var(--color-brand-secondary-dim)",
                    border: "none", borderRadius: "var(--radius-2xl)",
                    cursor: "pointer", textAlign: "left", width: "100%",
                  }}>
                    <Avt size={36} src={avatarSrc} fallback={avatarInitials} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: "var(--font-size-label-15)", fontWeight: "var(--font-weight-medium)" as React.CSSProperties["fontWeight"], color: "var(--color-text-primary)", margin: 0, lineHeight: "1.3" }}>
                        {userName}
                      </p>
                      <p style={{ fontSize: "var(--font-size-label-12)", color: "var(--color-text-secondary)", margin: 0, display: "flex", alignItems: "center", gap: "var(--space-1)" }}>
                        <HSEmblem height={12} />
                        {credits} Heart Credits
                      </p>
                    </div>
                    <ChevronRight size={16} style={{ color: "var(--color-text-secondary)", flexShrink: 0 }} />
                  </button>

                  <Btn variant="secondary" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                    <FileHeart size={16} />
                    Invitation
                  </Btn>
                </>
              )}

              {/* Category links */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                {CATEGORIES.map(cat => (
                  <button key={cat} style={{
                    display: "flex", alignItems: "center",
                    height: 44, padding: "0 var(--space-2)",
                    background: "transparent", border: "none", borderRadius: 0,
                    cursor: "pointer", fontFamily: "inherit",
                    fontSize: "var(--font-size-body-13)" as React.CSSProperties["fontSize"],
                    fontWeight: "var(--font-weight-medium)" as React.CSSProperties["fontWeight"],
                    color: "var(--color-text-primary)",
                    textTransform: "uppercase", letterSpacing: "1.04px",
                    textAlign: "left",
                  }}>
                    {cat}
                  </button>
                ))}
              </div>

              <Sep orientation="horizontal" />

              {isLoggedIn ? (
                <>
                  <Btn variant="secondary-ghost" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                    <Heart size={16} />
                    Favorite Cards
                  </Btn>
                  <Btn variant="ghost" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                    <LogIn size={16} />
                    Sign out
                  </Btn>
                </>
              ) : (
                <>
                  <Btn variant="secondary" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                    <FileHeart size={16} />
                    Invitation
                  </Btn>
                  <Btn variant="outline" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                    Log in
                  </Btn>
                  <Btn variant="default" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%", background: "var(--color-state-error)", color: "var(--color-text-on-primary)" }}>
                    Sign up
                  </Btn>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
