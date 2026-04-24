import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Search, X, Mail, Languages, PencilLine, Signature,
  Layers, Check, Loader2, ArrowLeft, PaintbrushIcon,
} from "lucide-react";
import { Inp } from "./hs-inp";
import { Btn } from "./btn";
import { Kbd } from "./hs-kbd";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./tabs";
import { Avt } from "./hs-avt";

/* ─── Types ──────────────────────────────────────────────── */

export interface StyleItem {
  id: string;
  name: string;
  /** Thumbnail URL — falls back to gradient placeholder when absent */
  src?: string;
}

export interface StyleSidebarProps {
  /** Controlled open state */
  open?: boolean;
  /** Uncontrolled initial open state */
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Styles shown in the Recommended section */
  recommended?: StyleItem[];
  /** Styles shown in the tabbed browse section */
  styles?: StyleItem[];
  /** Controlled selected style id */
  selected?: string | null;
  onSelect?: (id: string | null) => void;
  /** Fired when user clicks Apply */
  onApply?: (id: string) => void;
}

/* ─── Constants ──────────────────────────────────────────── */

const PANEL_WIDTH = 327;
const TOOLBAR_WIDTH = 80;
const PAGE_SIZE = 9;

const SPRING = { type: "spring", stiffness: 320, damping: 32 } as const;

const CARD_GRADIENTS = [
  "linear-gradient(135deg,#fde68a,#f97316)",
  "linear-gradient(135deg,#bfdbfe,#6366f1)",
  "linear-gradient(135deg,#d9f99d,#22c55e)",
  "linear-gradient(135deg,#fecaca,#ef4444)",
  "linear-gradient(135deg,#e9d5ff,#8b5cf6)",
  "linear-gradient(135deg,#cffafe,#06b6d4)",
  "linear-gradient(135deg,#fef3c7,#d97706)",
  "linear-gradient(135deg,#f3e8ff,#a855f7)",
  "linear-gradient(135deg,#dcfce7,#16a34a)",
  "linear-gradient(135deg,#fee2e2,#dc2626)",
  "linear-gradient(135deg,#dbeafe,#2563eb)",
  "linear-gradient(135deg,#f0fdf4,#15803d)",
];

const TABS = [
  { id: "art",      label: "Art Style" },
  { id: "trending", label: "Trending"  },
  { id: "featured", label: "Featured"  },
  { id: "popular",  label: "Popular"   },
];

const NAV_ITEMS = [
  { id: "styles",    icon: <Layers size={20} />,     label: "Styles"    },
  { id: "message",   icon: <PencilLine size={20} />, label: "Message"   },
  { id: "signature", icon: <Signature size={20} />,  label: "Signature" },
  { id: "envelope",  icon: <Mail size={20} />,       label: "Envelope"  },
  { id: "translate", icon: <Languages size={20} />,  label: "Translate", dividerBefore: true },
];

/* ─── Sample data ────────────────────────────────────────── */

export const DEFAULT_RECOMMENDED: StyleItem[] = [
  { id: "soft-3d",     name: "Soft 3D Toy Render",           src: "/style-thumbs/soft-3d.jpg"     },
  { id: "sculpted",    name: "Sculpted Paper Relief",         src: "/style-thumbs/sculpted.jpg"    },
  { id: "victorian",   name: "Vintage Victorian Holiday",     src: "/style-thumbs/victorian.jpg"   },
  { id: "watercolor",  name: "Whimsical Watercolor & Ink",   src: "/style-thumbs/watercolor.jpg"  },
  { id: "chinoiserie", name: "Eclectic Chinoiserie & Toile", src: "/style-thumbs/chinoiserie.jpg" },
  { id: "pastel-3d",   name: "Pastel 3D Paper Frame",        src: "/style-thumbs/pastel-3d.jpg"   },
];

export const DEFAULT_STYLES: StyleItem[] = [
  { id: "shabby",      name: "Shabby Chic & Distressed Grunge", src: "/style-thumbs/shabby.jpg"      },
  { id: "gouache",     name: "Whimsical Gouache Illustration",  src: "/style-thumbs/gouache.jpg"     },
  { id: "baroque",     name: "Dark Baroque Masquerade",         src: "/style-thumbs/baroque.jpg"     },
  { id: "quilling",    name: "Intricate Paper Quilling",        src: "/style-thumbs/quilling.jpg"    },
  { id: "silkscreen",  name: "Gritty Silkscreen & Stencil Art",src: "/style-thumbs/silkscreen.jpg"  },
  { id: "storybook",   name: "Messy Storybook Watercolor",      src: "/style-thumbs/storybook.jpg"   },
  { id: "pop-art",     name: "Vibrant Pop-Art Linocut",         src: "/style-thumbs/pop-art.jpg"     },
  { id: "wanderlust",  name: "Whimsical Wanderlust Watercolor", src: "/style-thumbs/wanderlust.jpg"  },
  { id: "pink-media",  name: "Textured Pink Mixed Media",       src: "/style-thumbs/pink-media.jpg"  },
  { id: "neon-noir",   name: "Neon Noir Cityscape",             src: "/style-thumbs/neon-noir.jpg"   },
  { id: "botanical",   name: "Botanical Line & Wash",           src: "/style-thumbs/botanical.jpg"   },
  { id: "retro-pixel", name: "Retro Pixel Art",                 src: "/style-thumbs/retro-pixel.jpg" },
];

/* ─── Helpers ────────────────────────────────────────────── */

/** Strip the `__N` suffix cycleItems adds so selection round-trips correctly */
const baseId = (id: string) => id.split("__")[0];

/** Repeat items up to `count`, giving each a unique React key via __N suffix */
function cycleItems(items: StyleItem[], count: number): StyleItem[] {
  if (!items.length) return [];
  return Array.from({ length: count }, (_, i) => ({
    ...items[i % items.length],
    id: `${items[i % items.length].id}__${i}`,
  }));
}

function thumbBg(index: number): string {
  return CARD_GRADIENTS[index % CARD_GRADIENTS.length];
}

/* ─── Animation variants ─────────────────────────────────── */

const staggerContainer = (delay: number) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: delay } },
});

const staggerCard = {
  hidden:  { opacity: 0, y: 20, scale: 0.93 },
  visible: { opacity: 1, y: 0,  scale: 1,    transition: { type: "spring" as const, stiffness: 340, damping: 26 } },
};

const viewTransition = { type: "spring", stiffness: 340, damping: 28 } as const;

/* ─── StyleCard ──────────────────────────────────────────── */

interface StyleCardProps {
  item: StyleItem;
  index: number;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string) => void;
  fillWidth?: boolean;
}

function StyleCard({ item, index, selected, dimmed, onSelect, fillWidth }: StyleCardProps) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-2)",
        alignItems: "center",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        flex: fillWidth ? undefined : "1 0 0",
        width: fillWidth ? "100%" : undefined,
        minWidth: 0,
        opacity: dimmed ? 0.2 : 1,
        transition: "opacity .2s ease",
      }}
    >
      <div style={{
        position: "relative",
        width: "100%",
        aspectRatio: "1",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: item.src ? undefined : thumbBg(index),
        outline: selected ? "2.5px solid var(--fg)" : "2.5px solid transparent",
        outlineOffset: 2,
        transition: "outline .12s",
        flexShrink: 0,
      }}>
        {item.src && (
          <img
            src={item.src}
            alt={item.name}
            style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
          />
        )}
        {selected && (
          <div style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{
              width: 20, height: 20, borderRadius: "50%",
              background: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Check size={12} color="var(--bg)" strokeWidth={2.5} />
            </div>
          </div>
        )}
      </div>
      <span style={{
        fontSize: "var(--font-size-label-12)",
        color: "var(--color-text-secondary)",
        textAlign: "center",
        lineHeight: 1.35,
        width: "100%",
        overflow: "hidden",
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
      }}>
        {item.name}
      </span>
    </button>
  );
}

/* ─── StyleGrid ──────────────────────────────────────────── */

interface StyleGridProps {
  items: StyleItem[];
  startIndex?: number;
  selected: string | null;
  onSelect: (id: string) => void;
  stagger?: boolean;
  staggerDelay?: number;
}

function StyleGrid({ items, startIndex = 0, selected, onSelect, stagger, staggerDelay = 0.02 }: StyleGridProps) {
  if (stagger) {
    return (
      <motion.div
        variants={staggerContainer(staggerDelay)}
        initial="hidden"
        animate="visible"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "var(--space-2)",
          rowGap: "var(--space-3)",
        }}
      >
        {items.map((item, i) => (
          <motion.div key={item.id} variants={staggerCard}>
            <StyleCard
              item={item}
              index={startIndex + i}
              selected={selected !== null && baseId(selected) === baseId(item.id)}
              dimmed={selected !== null && baseId(selected) !== baseId(item.id)}
              onSelect={id => onSelect(baseId(id))}
              fillWidth
            />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  const rows: StyleItem[][] = [];
  for (let i = 0; i < items.length; i += 3) rows.push(items.slice(i, i + 3));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-start" }}>
          {row.map((item, ci) => (
            <StyleCard
              key={item.id}
              item={item}
              index={startIndex + ri * 3 + ci}
              selected={selected !== null && baseId(selected) === baseId(item.id)}
              dimmed={selected !== null && baseId(selected) !== baseId(item.id)}
              onSelect={id => onSelect(baseId(id))}
            />
          ))}
          {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
            <div key={`gap-${i}`} style={{ flex: "1 0 0", minWidth: 0 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

/* ─── ToolbarButton ──────────────────────────────────────── */

interface ToolbarButtonProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

function ToolbarButton({ icon, label, active, onClick }: ToolbarButtonProps) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-1)",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        height: "var(--space-16)",
        padding: "var(--space-3)",
        borderRadius: "var(--radius-lg)",
        background: active ? "var(--muted)" : "transparent",
        border: "none",
        cursor: "pointer",
        transition: "background .12s",
        color: active ? "var(--fg)" : "var(--muted-fg)",
      }}
    >
      {icon}
      <span style={{
        fontSize: "var(--font-size-label-12)",
        fontWeight: 400,
        lineHeight: 1,
        color: "inherit",
      }}>
        {label}
      </span>
    </button>
  );
}

/* ─── NavLink ────────────────────────────────────────────── */

function NavLink({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "var(--font-size-label-13)",
        color: "var(--muted-fg)",
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-md)",
        fontFamily: "inherit",
        transition: "background .12s, color .12s",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "var(--muted)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--fg)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.background = "none";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--muted-fg)";
      }}
    >
      {children}
    </button>
  );
}

/* ─── StylePanel ─────────────────────────────────────────── */

interface PanelProps {
  recommended: StyleItem[];
  styles: StyleItem[];
  selected: string | null;
  onSelect: (id: string) => void;
  onClose: () => void;
  onApply: (id: string) => void;
  search: string;
  onSearchChange: (v: string) => void;
  tab: string;
  onTabChange: (v: string) => void;
}

function StylePanel({
  recommended, styles, selected,
  onSelect, onClose, onApply,
  search, onSearchChange, tab, onTabChange,
}: PanelProps) {
  const [page, setPage]         = useState(1);
  const [loading, setLoading]   = useState(false);
  const [viewMore, setViewMore] = useState(false);
  const scrollRef               = useRef<HTMLDivElement>(null);
  const sentinelRef             = useRef<HTMLDivElement>(null);

  const filtered = search.trim()
    ? [...recommended, ...styles].filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const visibleStyles = cycleItems(styles, page * PAGE_SIZE);

  useEffect(() => {
    const sentinel  = sentinelRef.current;
    const container = scrollRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => {
            setPage(p => p + 1);
            setLoading(false);
          }, 700);
        }
      },
      { root: container, threshold: 0.1 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading, tab]);

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
    }}>

      {/* Header — search + close */}
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "var(--space-3)",
        padding: "var(--space-4) var(--space-4) var(--space-2)",
        flexShrink: 0,
      }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={14} style={{
            position: "absolute", left: "var(--space-4)", top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
          }} />
          <Inp
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => onSearchChange(e.target.value)}
            placeholder="Search for styles here"
            style={{
              paddingLeft: 36,
              paddingRight: 52,
              borderRadius: "var(--radius-full)",
            }}
          />
          <div style={{
            position: "absolute", right: "var(--space-3)", top: "50%",
            transform: "translateY(-50%)", pointerEvents: "none",
          }}>
            <Kbd>⌘F</Kbd>
          </div>
        </div>
        <Btn
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          style={{ border: "none", flexShrink: 0, color: "var(--color-text-secondary)" }}
        >
          <X size={16} />
        </Btn>
      </div>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "var(--space-2) var(--space-4) var(--space-4)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        <AnimatePresence mode="wait">

          {filtered ? (
            /* Search results */
            <motion.div
              key="filtered"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={viewTransition}
            >
              <div style={{
                fontSize: "var(--font-size-label-12)",
                fontWeight: 600,
                color: "var(--muted-fg)",
                textTransform: "uppercase",
                letterSpacing: ".05em",
                marginBottom: "var(--space-3)",
              }}>
                {filtered.length} result{filtered.length !== 1 ? "s" : ""}
              </div>
              {filtered.length > 0
                ? <StyleGrid items={filtered} selected={selected} onSelect={onSelect} />
                : <p style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)" }}>No styles found</p>
              }
            </motion.div>

          ) : viewMore ? (
            /* View more — expanded recommended */
            <motion.div
              key="view-more"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={viewTransition}
            >
              <button
                onClick={() => setViewMore(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-1-5)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  color: "var(--muted-fg)",
                  fontSize: "var(--font-size-body-13)",
                  marginBottom: "var(--space-4)",
                }}
              >
                <ArrowLeft size={14} />
                Back
              </button>
              <StyleGrid
                items={cycleItems(recommended, 15)}
                selected={selected}
                onSelect={onSelect}
                stagger
              />
            </motion.div>

          ) : (
            /* Main view */
            <motion.div
              key="main"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={viewTransition}
            >
              {/* Recommended section */}
              <div style={{ marginBottom: "var(--space-6)" }}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "var(--space-4)",
                }}>
                  <span style={{
                    fontSize: "var(--font-size-body-15)",
                    fontWeight: 600,
                    color: "var(--fg)",
                  }}>
                    Recommended Style
                  </span>
                  <NavLink onClick={() => setViewMore(true)}>View more</NavLink>
                </div>
                <StyleGrid
                  items={recommended}
                  selected={selected}
                  onSelect={onSelect}
                  stagger
                  staggerDelay={0.25}
                />
              </div>

              {/* Tabbed browse section */}
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 340, damping: 26, delay: 0.38 }}
              >
                <Tabs value={tab} onValueChange={(v) => { onTabChange(v as string); setPage(1); }}>
                  <TabsList style={{ width: "100%", marginBottom: "var(--space-4)" }}>
                    {TABS.map(t => (
                      <TabsTrigger key={t.id} value={t.id} style={{ flex: 1, fontSize: 13 }}>
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {TABS.map(t => (
                    <TabsContent key={t.id} value={t.id} style={{ marginTop: 0 }}>
                      <StyleGrid
                        items={visibleStyles}
                        startIndex={recommended.length}
                        selected={selected}
                        onSelect={onSelect}
                        stagger
                        staggerDelay={0.25}
                      />
                      <div ref={sentinelRef} style={{ height: 1 }} />
                      {loading && (
                        <div style={{
                          display: "flex",
                          justifyContent: "center",
                          padding: "var(--space-4) 0",
                          color: "var(--muted-fg)",
                        }}>
                          <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />
                        </div>
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* Apply footer — visible only when a style is selected */}
      <AnimatePresence>
        {selected && (
          <motion.div
            key="apply"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              padding: "var(--space-4)",
              borderTop: "1px solid var(--border)",
              flexShrink: 0,
              background: "var(--bg)",
            }}
          >
            <Btn onClick={() => onApply(selected)} style={{ width: "100%" }}>
              <PaintbrushIcon size={15} />
              Apply Style
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── StyleSidebar (main export) ─────────────────────────── */

export function StyleSidebar({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  recommended = DEFAULT_RECOMMENDED,
  styles = DEFAULT_STYLES,
  selected: selectedProp,
  onSelect,
  onApply,
}: StyleSidebarProps) {
  const [openState, setOpenState]       = useState(defaultOpen);
  const [activeNav, setActiveNav]       = useState("styles");
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [search, setSearch]             = useState("");
  const [tab, setTab]                   = useState("art");

  const isOpen   = openProp   !== undefined ? openProp   : openState;
  const selected = selectedProp !== undefined ? selectedProp : selectedState;

  function handleNavClick(id: string) {
    const willOpen = !(id === activeNav && isOpen);
    setActiveNav(id);
    setOpenState(willOpen);
    onOpenChange?.(willOpen);
  }

  function handleClose() {
    setOpenState(false);
    onOpenChange?.(false);
    setSearch("");
  }

  function handleSelect(id: string) {
    const next = selected === id ? null : id;
    setSelectedState(next);
    onSelect?.(next);
  }

  return (
    <div style={{ display: "flex", height: "100%", overflow: "hidden" }}>

      {/* Toolbar */}
      <div style={{
        width: TOOLBAR_WIDTH,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "var(--space-4) var(--space-2)",
        background: "var(--bg)",
        borderRight: "1px solid var(--border)",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          {NAV_ITEMS.map(item => (
            <React.Fragment key={item.id}>
              {item.dividerBefore && (
                <div style={{ height: 1, background: "var(--border)", margin: "var(--space-1) 0" }} />
              )}
              <ToolbarButton
                icon={item.icon}
                label={item.label}
                active={activeNav === item.id && isOpen}
                onClick={() => handleNavClick(item.id)}
              />
            </React.Fragment>
          ))}
        </div>

        <div style={{ alignSelf: "center" }}>
          <Avt src="https://github.com/shadcn.png" fallback="HS" />
        </div>
      </div>

      {/* Panel — clips open from toolbar edge, inner div slides in */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="clip"
            initial={{ width: 0 }}
            animate={{ width: PANEL_WIDTH }}
            exit={{ width: 0 }}
            transition={SPRING}
            style={{ overflow: "hidden", flexShrink: 0, height: "100%" }}
          >
            <motion.div
              initial={{ x: -PANEL_WIDTH }}
              animate={{ x: 0 }}
              exit={{ x: -PANEL_WIDTH }}
              transition={SPRING}
              style={{ width: PANEL_WIDTH, height: "100%" }}
            >
              <StylePanel
                recommended={recommended}
                styles={styles}
                selected={selected ?? null}
                onSelect={handleSelect}
                onClose={handleClose}
                onApply={id => onApply?.(id)}
                search={search}
                onSearchChange={setSearch}
                tab={tab}
                onTabChange={setTab}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
