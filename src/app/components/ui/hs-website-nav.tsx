import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Search, FileHeart, ShoppingCart, Menu, X } from "lucide-react";
import { Btn } from "./btn";
import { Sep } from "./hs-sep";
import { HSLockup, HSEmblem } from "./hs-logo";
import { Inp } from "./hs-inp";
import { Avt } from "./hs-avt";
import { ProfileNavDesktop, ProfileNavMobile } from "./profile-nav";

/*
  hs-website-nav — HeartStamp website navigation

  WebsiteNav (desktop/tablet)
  · bgVariant "default"  frosted glass — homepage hero overlay
  · bgVariant "solid"    opaque bg     — inner pages
  · ResizeObserver switches to compact (24px padding, 8px gaps) below 900px

  WebsiteNavMobile
  · Closed by default; ☰ opens the nav panel
  · Search icon opens search view; "Close" dismisses it
  · Avatar (logged-in) opens ProfileNavMobile overlay
  · view "nav"    → category links + auth actions
  · view "search" → search input + recent / trending chips

  WebsiteNavResponsive
  · Container-aware: ≥768px → WebsiteNav, <768px → WebsiteNavMobile
*/

/* ─── Data ───────────────────────────────────────────────────── */

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

/* ─── Shared styles ──────────────────────────────────────────── */

const sectionLabel: React.CSSProperties = {
  fontSize:      "var(--font-size-label-12)",
  fontWeight:    "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
  color:         "var(--color-text-secondary)",
  textTransform: "uppercase",
  letterSpacing: ".06em",
  margin:        "0 0 var(--space-2-5)",
};

/* ══════════════════════════════════════════════════════════════
   Private sub-components
══════════════════════════════════════════════════════════════ */

/* ── Cart button with badge ─────────────────────────────────── */
function CartButton({ cartCount, iconSize = 16 }: { cartCount: number; iconSize?: number }) {
  return (
    <div style={{ position: "relative", display: "inline-flex", flexShrink: 0 }}>
      <Btn
        variant="outline"
        size="icon-sm"
        style={{ border: "none" }}
        aria-label={cartCount > 0 ? `Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}` : "Cart"}
      >
        <ShoppingCart size={iconSize} />
      </Btn>

      {cartCount > 0 && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute", top: -4, right: -4,
            minWidth: "var(--space-4)", height: "var(--space-4)",
            padding: "0 var(--space-1)",
            background: "var(--color-state-error)",
            color: "var(--color-text-on-primary)",
            /* Badge numerals intentionally sub-label (10px) — no token at this size */
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

/* ── Desktop category strip item ────────────────────────────── */
function CategoryItem({ children }: { children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        height: "100%",
        padding: "0 var(--space-4)",
        display: "flex", alignItems: "center",
        border: "none", borderRadius: 0,
        background: "transparent",
        cursor: "pointer",
        fontFamily: "inherit",
        fontSize:   "var(--font-size-body-13)" as React.CSSProperties["fontSize"],
        fontWeight: "var(--font-weight-btn)" as React.CSSProperties["fontWeight"],
        color: "var(--color-text-primary)",
        textTransform: "uppercase",
        /* Category tracking — design spec value, no system token */
        letterSpacing: "1.04px",
        whiteSpace: "nowrap", flexShrink: 0,
        /* Inset shadow avoids layout shift on hover */
        boxShadow:  hovered ? "inset 0 -2px 0 var(--color-brand-primary)" : "none",
        transition: "box-shadow 0.15s ease",
      }}
    >
      {children}
    </button>
  );
}

/* ── Desktop avatar with ProfileNav dropdown ────────────────── */
function NavAvatar({ src, fallback }: { src?: string; fallback: string }) {
  const [open, setOpen]               = useState(false);
  const [theme, setTheme]             = useState<"light" | "dark" | "system">("system");
  const [focusVisible, setFocusVisible] = useState(false);
  const pointerDown                   = useRef(false);
  const ref                           = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onMouse = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: "relative", marginLeft: "var(--space-1)", flexShrink: 0 }}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Account menu"
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen(o => !o)}
        onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(o => !o))}
        onPointerDown={() => { pointerDown.current = true; }}
        onFocus={() => { if (!pointerDown.current) setFocusVisible(true); }}
        onBlur={() => { setFocusVisible(false); pointerDown.current = false; }}
        style={{
          cursor: "pointer", display: "flex", borderRadius: "50%", outline: "none",
          boxShadow: focusVisible ? "0 0 0 2px var(--color-ring)" : "none",
          transition: "box-shadow 0.15s ease",
        }}
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

/* ── Shared search clear button ─────────────────────────────── */
function SearchClearBtn({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Clear search"
      style={{
        background: "none", border: "none", cursor: "pointer", padding: 0,
        display: "flex", color: "var(--color-text-secondary)", pointerEvents: "auto",
      }}
    >
      <X size={12} />
    </button>
  );
}

/* ── Mobile search input ────────────────────────────────────── */
function MobileSearchInp({
  value, onChange, onClear,
}: { value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; onClear: () => void }) {
  return (
    <Inp
      value={value}
      onChange={onChange}
      placeholder="Search"
      iconLeft={<Search size={14} />}
      iconRight={value ? <SearchClearBtn onClick={onClear} /> : undefined}
      style={{ borderRadius: "var(--radius-full)" }}
    />
  );
}

/* ── Mobile category list item ──────────────────────────────── */
function MobileCategoryLink({ children }: { children: React.ReactNode }) {
  return (
    <button
      type="button"
      style={{
        display: "flex", alignItems: "center",
        /* 44px touch target — no token at this size */
        height: 44, padding: "0 var(--space-2)",
        background: "transparent", border: "none", borderRadius: 0,
        cursor: "pointer", fontFamily: "inherit",
        fontSize:   "var(--font-size-body-13)" as React.CSSProperties["fontSize"],
        fontWeight: "var(--font-weight-btn)" as React.CSSProperties["fontWeight"],
        color: "var(--color-text-primary)",
        textTransform: "uppercase",
        letterSpacing: "1.04px",
        textAlign: "left", width: "100%",
      }}
    >
      {children}
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   DESKTOP / TABLET — WebsiteNav
══════════════════════════════════════════════════════════════ */

export type WebsiteNavBgVariant = "default" | "solid";

export interface WebsiteNavProps {
  bgVariant?:         WebsiteNavBgVariant;
  isLoggedIn?:        boolean;
  credits?:           number;
  cartCount?:         number;
  avatarSrc?:         string;
  avatarInitials?:    string;
  /** Show or hide the category nav strip below the top bar. Defaults to true. */
  showCategoryStrip?: boolean;
  /** Show or hide the Invitation button. Defaults to true. */
  showInvitationBtn?: boolean;
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
  bgVariant          = "default",
  isLoggedIn         = false,
  credits            = 50,
  cartCount          = 0,
  avatarSrc,
  avatarInitials     = "JS",
  showCategoryStrip  = true,
  showInvitationBtn  = true,
}: WebsiteNavProps) {
  const [searchVal, setSearchVal] = useState("");
  const containerRef              = useRef<HTMLDivElement>(null);
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setIsCompact(entries[0].contentRect.width < 900);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const sidePad  = isCompact ? "var(--space-6)" : "var(--space-10)";
  const rightGap = isCompact ? "var(--space-2)" : "var(--space-4)";

  return (
    <div ref={containerRef} style={{ width: "100%", ...BG_STYLES[bgVariant] }}>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        /* 72px top bar — no token at this height */
        height: 72, padding: `0 ${sidePad}`,
        borderBottom: "1px solid var(--color-element-subtle)",
        gap: "var(--space-4)",
      }}>

        {/* Left: logo + search */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-5)", flex: 1 }}>
          <HSLockup height={32} />
          <div style={{ flex: 1, maxWidth: 480, minWidth: 120 }}>
            <Inp
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              placeholder="Search"
              iconLeft={<Search size={14} />}
              iconRight={searchVal ? <SearchClearBtn onClick={() => setSearchVal("")} /> : undefined}
              style={{ borderRadius: "var(--radius-full)" }}
            />
          </div>
        </div>

        {/* Right: actions */}
        <div style={{ display: "flex", alignItems: "center", gap: rightGap, flexShrink: 0 }}>
          {showInvitationBtn && (
            <Btn variant="secondary" size="sm">
              <FileHeart size={16} />
              Invitation
            </Btn>
          )}

          {isLoggedIn ? (
            <>
              <Btn variant="secondary-ghost" size="sm">
                <HSEmblem height={16} />
                {isCompact ? credits : `${credits} Heart Credits`}
              </Btn>

              <div style={{
                display: "flex", alignItems: "center",
                gap: "var(--space-1-5)",
                marginLeft: isCompact ? 0 : -4,
              }}>
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
              <Btn variant="destructive" size="sm" style={{ borderRadius: "var(--radius-full)" }}>
                Sign up
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* ── Category strip ──────────────────────────────────── */}
      {showCategoryStrip && (
        <div style={{
          display: "flex", alignItems: "stretch",
          height: "var(--space-12)", padding: "0 var(--space-6)",
          gap: "var(--space-1)",
          overflowX: "auto", scrollbarWidth: "none",
        }}>
          {CATEGORIES.map(cat => <CategoryItem key={cat}>{cat}</CategoryItem>)}
        </div>
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
  /** Pre-open the nav panel — useful for docs demos */
  initialOpen?:    boolean;
  /** Pre-open a specific view — useful for docs demos */
  initialView?:    "nav" | "search";
  /** Override the default 393px max-width */
  maxWidth?:       number | string;
  /** Show or hide the Invitation button. Defaults to true. */
  showInvitationBtn?: boolean;
  /** Frosted glass (default) or solid background */
  bgVariant?:      WebsiteNavBgVariant;
}

export function WebsiteNavMobile({
  isLoggedIn     = false,
  credits        = 50,
  cartCount      = 0,
  avatarSrc,
  avatarInitials = "JS",
  initialOpen       = false,
  initialView       = "nav",
  maxWidth          = 393,
  showInvitationBtn = true,
  bgVariant         = "default",
}: WebsiteNavMobileProps) {
  const [navOpen, setNavOpen]         = useState(initialOpen || initialView === "search");
  const [view, setView]               = useState<"nav" | "search">(initialView);
  const [searchVal, setSearchVal]     = useState("");
  const [profileOpen, setProfileOpen] = useState(false);
  const [theme, setTheme]             = useState<"light" | "dark" | "system">("system");

  const isSearch = view === "search";

  const toggleNav = () => {
    if (navOpen && !profileOpen) { setNavOpen(false); setView("nav"); setSearchVal(""); }
    else { setNavOpen(true); setProfileOpen(false); }
  };

  const openSearch  = () => { setNavOpen(true); setView("search"); setProfileOpen(false); };
  const closeSearch = () => { setView("nav"); setSearchVal(""); };

  /* Left ☰ icon: X when nav is open (and profile is not covering it), Menu otherwise */
  const menuIcon = navOpen && (isLoggedIn ? !profileOpen : true)
    ? <X size={20} />
    : <Menu size={20} />;

  return (
    <div style={{
      width: "100%", maxWidth: maxWidth,
      ...BG_STYLES[bgVariant],
      position: "relative", overflow: "hidden",
    }}>

      {/* ── Top bar ──────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: isSearch && navOpen ? "1fr auto" : "auto 1fr auto",
        alignItems: "center",
        /* 64px top bar — no token at this height */
        height: 64, padding: "0 var(--space-4)",
        borderBottom: "1px solid var(--color-element-subtle)",
        gap: "var(--space-2)",
      }}>

        {/* Left: ☰ — hidden when search is active */}
        {!(isSearch && navOpen) && (
          <Btn
            variant="outline" size="icon-sm"
            style={{ border: "none", flexShrink: 0 }}
            aria-label={navOpen ? "Close menu" : "Open menu"}
            aria-expanded={navOpen}
            onClick={toggleNav}
          >
            {menuIcon}
          </Btn>
        )}

        {/* Center: logo ↔ search input */}
        <div style={{ minWidth: 0, display: "flex", alignItems: "center" }}>
          <AnimatePresence mode="wait" initial={false}>
            {isSearch && navOpen ? (
              <motion.div
                key="search-input"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ width: "100%" }}
              >
                <MobileSearchInp
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onClear={() => setSearchVal("")}
                />
              </motion.div>
            ) : (
              <motion.div
                key="logo"
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
                style={{ display: "flex", alignItems: "center" }}
              >
                <HSLockup height={26} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: context-sensitive actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5)", flexShrink: 0 }}>
          {isSearch && navOpen ? (
            <Btn
              variant="outline" size="sm"
              style={{ border: "none", fontSize: "var(--font-size-body-13)" }}
              aria-label="Close search"
              onClick={closeSearch}
            >
              Close
            </Btn>
          ) : isLoggedIn ? (
            <>
              <Btn variant="secondary-ghost" size="sm" style={{ borderRadius: "var(--radius-full)" }}>
                <HSEmblem height={14} />
                {credits}
              </Btn>
              <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Search" onClick={openSearch}>
                <Search size={20} />
              </Btn>
              <CartButton cartCount={cartCount} iconSize={20} />
              <div
                role="button"
                tabIndex={0}
                aria-label={profileOpen ? "Close profile" : "Open profile"}
                aria-expanded={profileOpen}
                onClick={() => setProfileOpen(o => !o)}
                onKeyDown={e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setProfileOpen(o => !o))}
                style={{
                  cursor: "pointer", display: "flex", borderRadius: "50%",
                  outline: "none", flexShrink: 0,
                  boxShadow: profileOpen ? "0 0 0 2px var(--color-brand-primary)" : "none",
                  transition: "box-shadow 0.15s ease",
                }}
              >
                <Avt size={32} src={avatarSrc} fallback={avatarInitials} />
              </div>
            </>
          ) : (
            <>
              <Btn variant="outline" size="icon-sm" style={{ border: "none" }} aria-label="Search" onClick={openSearch}>
                <Search size={20} />
              </Btn>
              <CartButton cartCount={cartCount} iconSize={20} />
              <Btn variant="outline" size="sm" style={{ borderRadius: "var(--radius-full)" }}>
                Sign in
              </Btn>
            </>
          )}
        </div>
      </div>

      {/* ── Content area: profile panel OR nav panel ─────────── */}
      <AnimatePresence mode="popLayout">

        {profileOpen ? (
          <motion.div
            key="profile-panel"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <ProfileNavMobile
              theme={theme}
              setTheme={setTheme}
              onClose={() => setProfileOpen(false)}
            />
          </motion.div>

        ) : navOpen ? (
          <motion.div
            key="nav-panel"
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ type: "spring", stiffness: 340, damping: 28 }}
          >
            <AnimatePresence mode="wait" initial={false}>

              {isSearch ? (
                <motion.div
                  key="search-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    padding: "var(--space-5) var(--space-4) var(--space-6)",
                    display: "flex", flexDirection: "column", gap: "var(--space-4)",
                  }}
                >
                  <div>
                    <p style={sectionLabel}>Recent searches</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {RECENT_SEARCHES.map(term => (
                        <Btn
                          key={term}
                          variant="outline" size="sm"
                          onClick={closeSearch}
                          style={{ borderRadius: "var(--radius-full)", fontSize: "var(--font-size-body-13)" }}
                        >
                          {term}
                        </Btn>
                      ))}
                    </div>
                  </div>

                  <Sep orientation="horizontal" />

                  <div>
                    <p style={sectionLabel}>Trending searches 🔥</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
                      {TRENDING_SEARCHES.map(term => (
                        <Btn
                          key={term}
                          variant="outline" size="sm"
                          onClick={closeSearch}
                          style={{ borderRadius: "var(--radius-full)", fontSize: "var(--font-size-body-13)" }}
                        >
                          {term}
                        </Btn>
                      ))}
                    </div>
                  </div>
                </motion.div>

              ) : (
                <motion.div
                  key="nav-body"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    padding: "var(--space-4) var(--space-4) var(--space-6)",
                    display: "flex", flexDirection: "column", gap: "var(--space-3)",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {CATEGORIES.map(cat => (
                      <MobileCategoryLink key={cat}>{cat}</MobileCategoryLink>
                    ))}
                  </div>

                  {(showInvitationBtn || !isLoggedIn) && <Sep orientation="horizontal" />}

                  {showInvitationBtn && (
                    <Btn variant="secondary" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                      <FileHeart size={16} />
                      Invitation
                    </Btn>
                  )}

                  {!isLoggedIn && (
                    <Btn variant="destructive" size="sm" style={{ borderRadius: "var(--radius-full)", width: "100%" }}>
                      Sign up
                    </Btn>
                  )}
                </motion.div>
              )}

            </AnimatePresence>
          </motion.div>

        ) : null}

      </AnimatePresence>

    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   RESPONSIVE — WebsiteNavResponsive
   ≥768px → WebsiteNav  (desktop + tablet)
   <768px → WebsiteNavMobile
══════════════════════════════════════════════════════════════ */

export interface WebsiteNavResponsiveProps {
  bgVariant?:         WebsiteNavBgVariant;
  isLoggedIn?:        boolean;
  credits?:           number;
  cartCount?:         number;
  avatarSrc?:         string;
  avatarInitials?:    string;
  showCategoryStrip?: boolean;
  showInvitationBtn?: boolean;
}

export function WebsiteNavResponsive({
  bgVariant         = "default",
  isLoggedIn        = false,
  credits           = 50,
  cartCount         = 0,
  avatarSrc,
  avatarInitials    = "JS",
  showCategoryStrip = true,
  showInvitationBtn = true,
}: WebsiteNavResponsiveProps) {
  const containerRef            = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setIsMobile(entries[0].contentRect.width < 768);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {isMobile ? (
        <WebsiteNavMobile
          isLoggedIn={isLoggedIn}
          credits={credits}
          cartCount={cartCount}
          avatarSrc={avatarSrc}
          avatarInitials={avatarInitials}
          bgVariant={bgVariant}
          showInvitationBtn={showInvitationBtn}
          maxWidth="100%"
        />
      ) : (
        <WebsiteNav
          bgVariant={bgVariant}
          isLoggedIn={isLoggedIn}
          credits={credits}
          cartCount={cartCount}
          avatarSrc={avatarSrc}
          avatarInitials={avatarInitials}
          showCategoryStrip={showCategoryStrip}
          showInvitationBtn={showInvitationBtn}
        />
      )}
    </div>
  );
}
