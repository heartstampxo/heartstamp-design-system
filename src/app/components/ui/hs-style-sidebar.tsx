import React, { useState, useRef, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Search, X, Mail, Languages, PencilLine, Signature,
  Layers, Check, Loader2, ArrowLeft, PaintbrushIcon,
  ChevronDown, Plus, Minus, CloudUpload, Trash2,
} from "lucide-react";
import HeartStampSecondary01 from "../../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-01.svg?raw";
import { Inp } from "./hs-inp";
import { Btn } from "./btn";
import { Kbd } from "./hs-kbd";
import { Avt } from "./hs-avt";
import { Tarea } from "./hs-tarea";
import { Lbl } from "./hs-lbl";
import { Sep } from "./hs-sep";
import { Tip } from "./hs-tip";
import { DdMenu } from "./hs-dd-menu";
import { ColorPicker } from "./hs-color-picker";
import { PillTabs } from "./hs-pill-tabs";
import { ProfileNavDesktop } from "./profile-nav";

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
  { id: "featured", label: "Featured"      },
  { id: "trending", label: "Trending"      },
  { id: "popular",  label: "Most Popular"  },
];

const FONTS: { name: string; family: string }[] = [
  { name: "Dancing Script",  family: "'Dancing Script', cursive"  },
  { name: "Great Vibes",     family: "'Great Vibes', cursive"     },
  { name: "Pacifico",        family: "'Pacifico', cursive"        },
  { name: "Caveat",          family: "'Caveat', cursive"          },
  { name: "Sacramento",      family: "'Sacramento', cursive"      },
  { name: "Satisfy",         family: "'Satisfy', cursive"         },
];

const LANGUAGES = [
  "English", "Français", "Español", "Deutsch", "中文 (简体)",
  "русский", "日本語", "Português", "Italiano", "한국어",
  "العربية", "हिन्दी", "Türkçe", "Polski", "Nederlands",
  "Svenska", "Norsk", "Dansk", "Suomi", "Ελληνικά",
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
        fontSize: "var(--font-size-body-13)",
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
              <Btn
                variant="outline"
                size="sm"
                onClick={() => setViewMore(false)}
                style={{ background: "none", border: "none", color: "var(--muted-fg)", marginBottom: "var(--space-4)", paddingLeft: 0 }}
              >
                <ArrowLeft size={14} />
                Back
              </Btn>
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
                <PillTabs
                  value={tab}
                  onValueChange={v => { onTabChange(v); setPage(1); }}
                  tabs={TABS.map(t => ({ value: t.id, label: t.label }))}
                  style={{ marginBottom: "var(--space-4)" }}
                />
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

/* ─── MessagePanel ───────────────────────────────────────── */

interface MessagePanelProps {
  onClose: () => void;
}

/* shared spring for section stagger */
const msgItem = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 340, damping: 26, delay },
});

function MessagePanel({ onClose }: MessagePanelProps) {
  const [msgTab, setMsgTab]       = useState<"type" | "upload">("type");
  const [font, setFont]           = useState(FONTS[0]);
  const [size, setSize]           = useState(20);
  const [message, setMessage]     = useState("");
  const [closing, setClosing]     = useState("");
  const [dragging, setDragging]           = useState(false);
  const [uploadedUrl, setUploadedUrl]     = useState<string | null>(null);
  const [uploading, setUploading]         = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const uploadedUrlRef                    = useRef<string | null>(null);
  const uploadPreviewRef                  = useRef<string | null>(null);

  uploadedUrlRef.current   = uploadedUrl;
  uploadPreviewRef.current = uploadPreview;

  // Revoke any lingering object URLs when component unmounts
  useEffect(() => () => {
    if (uploadedUrlRef.current)   URL.revokeObjectURL(uploadedUrlRef.current);
    if (uploadPreviewRef.current) URL.revokeObjectURL(uploadPreviewRef.current);
  }, []);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (uploadedUrl)   URL.revokeObjectURL(uploadedUrl);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    setUploading(true);
    // Reset input so the same file can be re-selected after removal
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => {
      setUploading(false);
      setUploadedUrl(url);
      setUploadPreview(null);
    }, 1400);
  }

  function handleRemove() {
    if (uploadedUrl)   URL.revokeObjectURL(uploadedUrl);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadedUrl(null);
    setUploadPreview(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
    }}>

      {/* Header */}
      <motion.div
        {...msgItem(0.04)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-4)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>
          Message
        </span>
        <Btn
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          style={{ border: "none", flexShrink: 0, color: "var(--color-text-secondary)" }}
        >
          <X size={16} />
        </Btn>
      </motion.div>

      {/* Tab switcher */}
      <motion.div {...msgItem(0.09)} style={{ padding: "var(--space-3) var(--space-4)", flexShrink: 0 }}>
        <PillTabs
          value={msgTab}
          onValueChange={v => setMsgTab(v as "type" | "upload")}
          tabs={[
            { value: "type",   label: "Type"   },
            { value: "upload", label: "Upload" },
          ]}
        />
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {msgTab === "type" ? (
          <motion.div
            key="type"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}
          >
            <div style={{
              flex: 1,
              padding: "0 var(--space-4) var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-5)",
            }}>

              {/* Font */}
              <motion.div {...msgItem(0.14)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Font</Lbl>
                <DdMenu
                  fixed
                  style={{ width: "100%" }}
                  trigger={
                    <Btn
                      variant="outline"
                      style={{ width: "100%", borderRadius: "var(--radius-full)", justifyContent: "space-between" }}
                    >
                      <span style={{ fontFamily: font.family, fontSize: "var(--font-size-body-15)" }}>{font.name}</span>
                      <ChevronDown size={14} />
                    </Btn>
                  }
                  items={FONTS.map(f => ({
                    label: f.name,
                    style: { fontFamily: f.family, fontSize: "var(--font-size-body-15)" },
                    onClick: () => setFont(f),
                  }))}
                />
              </motion.div>

              {/* Size */}
              <motion.div {...msgItem(0.19)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Size</Lbl>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  height: "var(--space-10)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  padding: "0 var(--space-1)",
                }}>
                  <Btn
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setSize(s => Math.max(8, s - 1))}
                    style={{ border: "none", borderRadius: "var(--radius-full)", color: "var(--fg)", flexShrink: 0 }}
                  >
                    <Minus size={14} />
                  </Btn>
                  <Sep orientation="vertical" style={{ height: "var(--space-5)" }} />
                  <span style={{ flex: 1, textAlign: "center", fontSize: "var(--font-size-body-15)", fontWeight: 500, color: "var(--fg)" }}>
                    {size}
                  </span>
                  <Sep orientation="vertical" style={{ height: "var(--space-5)" }} />
                  <Btn
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setSize(s => Math.min(120, s + 1))}
                    style={{ border: "none", borderRadius: "var(--radius-full)", color: "var(--fg)", flexShrink: 0 }}
                  >
                    <Plus size={14} />
                  </Btn>
                </div>
              </motion.div>

              {/* Message */}
              <motion.div {...msgItem(0.24)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Message</Lbl>
                <Tarea
                  placeholder="Write your message here…"
                  rows={5}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  style={{ height: 110, resize: "none" }}
                />
              </motion.div>

              {/* Closing */}
              <motion.div {...msgItem(0.29)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Closing</Lbl>
                <Inp
                  value={closing}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClosing(e.target.value)}
                  placeholder="e.g. With love,"
                  style={{ borderRadius: "var(--radius-full)" }}
                />
              </motion.div>

            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
          >
            <div style={{ padding: "0 var(--space-4) var(--space-4)" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => handleFiles(e.target.files)}
                style={{ display: "none" }}
              />

              <AnimatePresence mode="wait">
                {uploading ? (
                  /* ── Uploading state ── */
                  <motion.div
                    key="uploading"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26 }}
                    style={{
                      position: "relative",
                      height: 360,
                      borderRadius: "var(--radius-2xl)",
                      border: "1.5px dashed var(--border)",
                      background: "var(--bg-input)",
                      overflow: "hidden",
                    }}
                  >
                    {/* Dimmed image preview behind the loader */}
                    {uploadPreview && (
                      <img
                        src={uploadPreview}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                          padding: "var(--space-6)",
                          opacity: 0.25,
                        }}
                      />
                    )}
                    {/* Loader overlay */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-3)",
                    }}>
                      <Loader2
                        size={28}
                        style={{
                          color: "var(--fg)",
                          animation: "spin 0.9s linear infinite",
                        }}
                      />
                      <span style={{
                        fontSize: "var(--font-size-body-13)",
                        fontWeight: 500,
                        color: "var(--fg)",
                      }}>
                        Uploading…
                      </span>
                    </div>
                  </motion.div>

                ) : uploadedUrl ? (
                  /* ── Preview state ── */
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26 }}
                    style={{ position: "relative", height: 360 }}
                  >
                    {/* Image clipped to border-radius independently */}
                    <div style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "var(--radius-2xl)",
                      border: "1.5px dashed var(--border)",
                      background: "var(--bg-input)",
                      overflow: "hidden",
                    }}>
                      <img
                        src={uploadedUrl}
                        alt="Uploaded message"
                        style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-6)" }}
                      />
                    </div>
                    {/* Button outside overflow:hidden so tooltip is not clipped */}
                    <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", zIndex: 1 }}>
                      <Tip label="Remove">
                        <Btn
                          variant="outline"
                          size="icon-sm"
                          onClick={handleRemove}
                          style={{ background: "var(--bg)", color: "var(--color-text-secondary)" }}
                        >
                          <Trash2 size={15} />
                        </Btn>
                      </Tip>
                    </div>
                  </motion.div>

                ) : (
                  /* ── Drop zone ── */
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26, delay: 0.14 }}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: 360,
                      border: `1.5px dashed ${dragging ? "var(--fg)" : "var(--border)"}`,
                      borderRadius: "var(--radius-2xl)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-3)",
                      cursor: "pointer",
                      padding: "var(--space-6)",
                      background: dragging ? "var(--muted)" : "transparent",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    <CloudUpload size={24} style={{ color: "var(--muted-fg)" }} />
                    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      <p style={{ fontSize: "var(--font-size-body-13)", fontWeight: 500, color: "var(--fg)", margin: 0 }}>
                        Upload your handwritten message
                      </p>
                      <p style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", margin: 0, lineHeight: 1.5 }}>
                        Click to upload or drop your image here. For best results, write on plain white paper.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save footer — Type tab always, Upload tab only after image is ready */}
      <AnimatePresence>
        {(msgTab === "type" || uploadedUrl) && (
          <motion.div
            key="save"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 26, delay: msgTab === "type" ? 0.32 : 0 }}
            style={{
              padding: "var(--space-4)",
              borderTop: "1px solid var(--border)",
              flexShrink: 0,
              background: "var(--bg)",
            }}
          >
            <Btn style={{ width: "100%" }}>Save</Btn>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SignaturePanel ─────────────────────────────────────── */

interface SignaturePanelProps {
  onClose: () => void;
}

const SIG_COLORS: { hex: string; name: string }[] = [
  { hex: "#242423", name: "Black" },
  { hex: "#8B9E87", name: "Sage"  },
  { hex: "#D4A574", name: "Amber" },
  { hex: "#3A4A24", name: "Olive" },
];

function SignaturePanel({ onClose }: SignaturePanelProps) {
  const [sigTab, setSigTab]     = useState<"draw" | "upload" | "type">("draw");
  const [sigText, setSigText]   = useState("");
  const [sigColor, setSigColor] = useState(SIG_COLORS[0].hex);
  const [sigFont, setSigFont]   = useState(FONTS[0]);
  const [sigSize, setSigSize]   = useState(20);
  const [dragging, setDragging]           = useState(false);
  const [uploadedUrl, setUploadedUrl]     = useState<string | null>(null);
  const [uploading, setUploading]         = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const fileInputRef                      = useRef<HTMLInputElement>(null);
  const uploadedUrlRef                    = useRef<string | null>(null);
  const uploadPreviewRef                  = useRef<string | null>(null);
  const [savedSigs, setSavedSigs]         = useState<string[]>([]);
  const [hasDrawing, setHasDrawing]       = useState(false);
  const [pickerOpen, setPickerOpen]       = useState(false);
  const [pickerAnchor, setPickerAnchor]   = useState<DOMRect | null>(null);
  const [recentColors, setRecentColors]   = useState<string[]>([]);
  const rainbowRef                        = useRef<HTMLButtonElement>(null);
  const canvasRef                         = useRef<HTMLCanvasElement | null>(null);
  const isDrawing                   = useRef(false);
  const lastPos                     = useRef<{ x: number; y: number } | null>(null);

  uploadedUrlRef.current   = uploadedUrl;
  uploadPreviewRef.current = uploadPreview;

  useEffect(() => () => {
    if (uploadedUrlRef.current)   URL.revokeObjectURL(uploadedUrlRef.current);
    if (uploadPreviewRef.current) URL.revokeObjectURL(uploadPreviewRef.current);
  }, []);

  function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (uploadedUrl)   URL.revokeObjectURL(uploadedUrl);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    const url = URL.createObjectURL(file);
    setUploadPreview(url);
    setUploading(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
    setTimeout(() => {
      setUploading(false);
      setUploadedUrl(url);
      setUploadPreview(null);
    }, 1400);
  }

  function handleRemove() {
    if (uploadedUrl)   URL.revokeObjectURL(uploadedUrl);
    if (uploadPreview) URL.revokeObjectURL(uploadPreview);
    setUploadedUrl(null);
    setUploadPreview(null);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // Stable callback ref — sets canvas bitmap size once on mount (AnimatePresence
  // delays mount until exit animation finishes, so useEffect([sigTab]) fires too early)
  const canvasCallbackRef = useCallback((canvas: HTMLCanvasElement | null) => {
    canvasRef.current = canvas;
    if (canvas) {
      canvas.width  = canvas.offsetWidth  || 295;
      canvas.height = canvas.offsetHeight || 180;
    }
  }, []);

  function getPos(e: React.MouseEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current!;
    const rect   = canvas.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (canvas.width  / rect.width),
      y: (e.clientY - rect.top)  * (canvas.height / rect.height),
    };
  }

  function startDraw(e: React.MouseEvent<HTMLCanvasElement>) {
    isDrawing.current = true;
    lastPos.current   = getPos(e);
    setHasDrawing(true);
  }

  function draw(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!isDrawing.current || !canvasRef.current || !lastPos.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = sigColor;
    ctx.lineWidth   = 2.5;
    ctx.lineCap     = "round";
    ctx.lineJoin    = "round";
    ctx.stroke();
    lastPos.current = pos;
  }

  function stopDraw() {
    isDrawing.current = false;
    lastPos.current   = null;
  }

  function clearCanvas() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  }

  function handleSave() {
    if (sigTab === "draw" && canvasRef.current && hasDrawing) {
      setSavedSigs(prev => [...prev, canvasRef.current!.toDataURL()]);
      clearCanvas();
    }
  }

  const saveDisabled =
    (sigTab === "draw" && !hasDrawing) ||
    (sigTab === "type" && sigText.trim() === "");

  const isCustomColor     = !SIG_COLORS.some(c => c.hex === sigColor);
  const selectedColorName = isCustomColor
    ? "Custom"
    : (SIG_COLORS.find(c => c.hex === sigColor)?.name ?? "");

  function handleColorChange(hex: string) {
    setSigColor(hex);
    setRecentColors(prev => [hex, ...prev.filter(c => c !== hex)].slice(0, 12));
  }

  function openPicker() {
    setPickerAnchor(rainbowRef.current?.getBoundingClientRect() ?? null);
    setPickerOpen(true);
  }

  const colorSection = (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {/* "Signature color" + dynamic name label */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>
          Signature color
        </span>
        <span style={{ fontSize: "var(--font-size-body-15)", color: "var(--muted-fg)" }}>
          {selectedColorName}
        </span>
      </div>

      {/* Swatch row: 4 presets | vertical sep | rainbow picker trigger */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
        {SIG_COLORS.map(c => (
          <button
            key={c.hex}
            onClick={() => { setSigColor(c.hex); setPickerOpen(false); }}
            style={{
              width: 24, height: 24,
              borderRadius: "50%",
              background: c.hex,
              border: "none",
              outline: sigColor === c.hex ? "2px solid var(--fg)" : "2px solid transparent",
              outlineOffset: 2,
              cursor: "pointer",
              flexShrink: 0,
              transition: "outline .12s",
            }}
          />
        ))}

        <Sep orientation="vertical" style={{ height: "var(--space-5)", margin: "0 var(--space-1)" }} />

        {/* Rainbow circle — opens ColorPicker popover */}
        <button
          ref={rainbowRef}
          onClick={openPicker}
          style={{
            width: 24, height: 24,
            borderRadius: "50%",
            background: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
            border: "none",
            outline: isCustomColor ? "2px solid var(--fg)" : "2px solid transparent",
            outlineOffset: 2,
            cursor: "pointer",
            flexShrink: 0,
            transition: "outline .12s",
            padding: 0,
          }}
        />
      </div>
    </div>
  );

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
    }}>

      {/* Header */}
      <motion.div
        {...msgItem(0.04)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-4)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>
          Signature
        </span>
        <Btn
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          style={{ border: "none", flexShrink: 0, color: "var(--color-text-secondary)" }}
        >
          <X size={16} />
        </Btn>
      </motion.div>

      {/* Tab switcher */}
      <motion.div {...msgItem(0.09)} style={{ padding: "var(--space-3) var(--space-4)", flexShrink: 0 }}>
        <PillTabs
          value={sigTab}
          onValueChange={v => setSigTab(v as "draw" | "upload" | "type")}
          tabs={[
            { value: "draw",   label: "Draw"   },
            { value: "upload", label: "Upload" },
            { value: "type",   label: "Type"   },
          ]}
        />
      </motion.div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {sigTab === "draw" ? (

          /* ── Draw tab ── */
          <motion.div
            key="sig-draw"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "0 var(--space-4) var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>

              {/* Canvas + helper text + clear button */}
              <motion.div {...msgItem(0.14)}>
                <div style={{ position: "relative" }}>
                  {/* Canvas container — matches Input component radius */}
                  <div style={{
                    height: 180,
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-input)",
                    background: "var(--bg-input)",
                    overflow: "hidden",
                  }}>
                    <canvas
                      ref={canvasCallbackRef}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={stopDraw}
                      onMouseLeave={stopDraw}
                      style={{ display: "block", cursor: "crosshair", width: "100%", height: "100%" }}
                    />
                  </div>
                  {/* Clear button — only when user has drawn something */}
                  {hasDrawing && (
                    <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", zIndex: 1 }}>
                      <Tip label="Clear">
                        <Btn
                          variant="outline"
                          size="icon-sm"
                          onClick={clearCanvas}
                          style={{ background: "var(--bg)", color: "var(--color-text-secondary)" }}
                        >
                          <Trash2 size={14} />
                        </Btn>
                      </Tip>
                    </div>
                  )}
                </div>
                {/* Helper text below canvas */}
                <p style={{
                  fontSize: "var(--font-size-body-13)",
                  color: "var(--muted-fg)",
                  textAlign: "center",
                  margin: "var(--space-3) 0 0",
                }}>
                  Use your mouse to draw your signature.
                </p>
              </motion.div>

              {/* Signature color section */}
              <motion.div {...msgItem(0.19)}>{colorSection}</motion.div>

              {/* Divider */}
              <motion.div {...msgItem(0.22)}><Sep /></motion.div>

              {/* Saved signatures list */}
              {savedSigs.length > 0 && (
                <motion.div
                  key="saved-list"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 340, damping: 26 }}
                  style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}
                >
                  {savedSigs.map((src, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "var(--space-2)",
                        padding: "var(--space-2)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-xl)",
                        background: "var(--bg)",
                        boxShadow: "0 1px 4px rgba(0,0,0,.05)",
                      }}
                    >
                      {/* White paper zone — ensures signature is readable on any theme */}
                      <div style={{
                        flex: 1,
                        height: 52,
                        background: "#ffffff",
                        borderRadius: "var(--radius-lg)",
                        border: "1px solid rgba(0,0,0,.07)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        padding: "var(--space-2) var(--space-3)",
                      }}>
                        <img
                          src={src}
                          alt={`Signature ${i + 1}`}
                          style={{ maxHeight: 36, width: "100%", objectFit: "contain" }}
                        />
                      </div>
                      <Btn
                        variant="outline"
                        size="icon-sm"
                        onClick={() => setSavedSigs(prev => prev.filter((_, j) => j !== i))}
                        style={{ border: "none", color: "var(--muted-fg)", flexShrink: 0 }}
                      >
                        <Trash2 size={14} />
                      </Btn>
                    </div>
                  ))}
                </motion.div>
              )}

            </div>
          </motion.div>

        ) : sigTab === "upload" ? (

          /* ── Upload tab ── */
          <motion.div
            key="sig-upload"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, minHeight: 0, overflowY: "auto" }}
          >
            <div style={{ padding: "0 var(--space-4) var(--space-4)" }}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={e => handleFiles(e.target.files)}
                style={{ display: "none" }}
              />
              <AnimatePresence mode="wait">
                {uploading ? (
                  <motion.div
                    key="sig-uploading"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26 }}
                    style={{
                      position: "relative",
                      height: 220,
                      borderRadius: "var(--radius-2xl)",
                      border: "1.5px dashed var(--border)",
                      background: "var(--bg-input)",
                      overflow: "hidden",
                    }}
                  >
                    {uploadPreview && (
                      <img src={uploadPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-6)", opacity: 0.25 }} />
                    )}
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "var(--space-3)" }}>
                      <Loader2 size={28} style={{ color: "var(--fg)", animation: "spin 0.9s linear infinite" }} />
                      <span style={{ fontSize: "var(--font-size-body-13)", fontWeight: 500, color: "var(--fg)" }}>Uploading…</span>
                    </div>
                  </motion.div>
                ) : uploadedUrl ? (
                  <motion.div
                    key="sig-preview"
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26 }}
                    style={{ position: "relative", height: 220 }}
                  >
                    <div style={{
                      position: "absolute", inset: 0,
                      borderRadius: "var(--radius-2xl)",
                      border: "1.5px dashed var(--border)",
                      background: "var(--bg-input)",
                      overflow: "hidden",
                    }}>
                      <img src={uploadedUrl} alt="Uploaded signature" style={{ width: "100%", height: "100%", objectFit: "contain", padding: "var(--space-6)" }} />
                    </div>
                    <div style={{ position: "absolute", top: "var(--space-2)", right: "var(--space-2)", zIndex: 1 }}>
                      <Tip label="Remove">
                        <Btn variant="outline" size="icon-sm" onClick={handleRemove} style={{ background: "var(--bg)", color: "var(--color-text-secondary)" }}>
                          <Trash2 size={15} />
                        </Btn>
                      </Tip>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sig-dropzone"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ type: "spring", stiffness: 340, damping: 26, delay: 0.14 }}
                    onDragOver={e => { e.preventDefault(); setDragging(true); }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={e => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: 220,
                      border: `1.5px dashed ${dragging ? "var(--fg)" : "var(--border)"}`,
                      borderRadius: "var(--radius-2xl)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "var(--space-3)",
                      cursor: "pointer",
                      padding: "var(--space-6)",
                      background: dragging ? "var(--muted)" : "transparent",
                      transition: "border-color .15s, background .15s",
                    }}
                  >
                    <CloudUpload size={24} style={{ color: "var(--muted-fg)" }} />
                    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
                      <p style={{ fontSize: "var(--font-size-body-13)", fontWeight: 500, color: "var(--fg)", margin: 0 }}>
                        Upload your signature image
                      </p>
                      <p style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", margin: 0, lineHeight: 1.5 }}>
                        Click to upload or drop your image here. White background works best.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

        ) : (

          /* ── Type tab ── */
          <motion.div
            key="sig-type"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column" }}
          >
            <div style={{ padding: "0 var(--space-4) var(--space-4)", display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

              {/* Type your signature */}
              <motion.div {...msgItem(0.14)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>
                  Type your signature here
                </Lbl>
                <input
                  type="text"
                  value={sigText}
                  onChange={e => setSigText(e.target.value)}
                  placeholder="Your signature…"
                  style={{
                    width: "100%",
                    height: "var(--space-10)",
                    padding: "0 var(--space-3)",
                    fontFamily: sigFont.family,
                    fontSize: sigSize,
                    color: sigColor,
                    textAlign: "center",
                    border: "1px solid var(--border)",
                    borderRadius: "var(--radius-full)",
                    background: "var(--bg-input)",
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
              </motion.div>

              {/* Font */}
              <motion.div {...msgItem(0.19)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Font</Lbl>
                <DdMenu
                  fixed
                  style={{ width: "100%" }}
                  trigger={
                    <Btn
                      variant="outline"
                      style={{ width: "100%", borderRadius: "var(--radius-full)", justifyContent: "space-between" }}
                    >
                      <span style={{ fontFamily: sigFont.family, fontSize: "var(--font-size-body-15)" }}>{sigFont.name}</span>
                      <ChevronDown size={14} />
                    </Btn>
                  }
                  items={FONTS.map(f => ({
                    label: f.name,
                    style: { fontFamily: f.family, fontSize: "var(--font-size-body-15)" },
                    onClick: () => setSigFont(f),
                  }))}
                />
              </motion.div>

              {/* Size */}
              <motion.div {...msgItem(0.24)}>
                <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Size</Lbl>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  height: "var(--space-10)",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid var(--border)",
                  background: "var(--bg)",
                  padding: "0 var(--space-1)",
                }}>
                  <Btn
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setSigSize(s => Math.max(8, s - 1))}
                    style={{ border: "none", borderRadius: "var(--radius-full)", color: "var(--fg)", flexShrink: 0 }}
                  >
                    <Minus size={14} />
                  </Btn>
                  <Sep orientation="vertical" style={{ height: "var(--space-5)" }} />
                  <span style={{ flex: 1, textAlign: "center", fontSize: "var(--font-size-body-15)", fontWeight: 500, color: "var(--fg)" }}>
                    {sigSize}
                  </span>
                  <Sep orientation="vertical" style={{ height: "var(--space-5)" }} />
                  <Btn
                    variant="outline"
                    size="icon-sm"
                    onClick={() => setSigSize(s => Math.min(120, s + 1))}
                    style={{ border: "none", borderRadius: "var(--radius-full)", color: "var(--fg)", flexShrink: 0 }}
                  >
                    <Plus size={14} />
                  </Btn>
                </div>
              </motion.div>

              {/* Signature color */}
              <motion.div {...msgItem(0.29)}>{colorSection}</motion.div>

            </div>
          </motion.div>

        )}
      </AnimatePresence>

      {/* Save footer — always visible for Draw/Type; Upload only after image is ready */}
      <AnimatePresence>
        {(sigTab !== "upload" || uploadedUrl) && (
          <motion.div
            key="sig-save"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ type: "spring", stiffness: 340, damping: 26, delay: sigTab !== "upload" ? 0.32 : 0 }}
            style={{
              padding: "var(--space-4)",
              borderTop: "1px solid var(--border)",
              flexShrink: 0,
              background: "var(--bg)",
            }}
          >
            <Btn
              disabled={saveDisabled}
              style={{ width: "100%", opacity: saveDisabled ? 0.4 : 1 }}
              onClick={handleSave}
            >
              Save
            </Btn>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Color picker popover — position:fixed, escapes overflow */}
      {pickerOpen && (
        <ColorPicker
          color={sigColor}
          onChange={handleColorChange}
          recentColors={recentColors}
          anchorRect={pickerAnchor}
          onClose={() => setPickerOpen(false)}
        />
      )}
    </div>
  );
}

/* ─── HeartCount ─────────────────────────────────────────── */

function HeartCount(_: { count: number }) {
  return (
    <div
      style={{ width: 20, height: 20, flexShrink: 0 }}
      dangerouslySetInnerHTML={{ __html: HeartStampSecondary01 }}
    />
  );
}

/* ─── TranslatePanel ─────────────────────────────────────── */

interface TranslatePanelProps {
  onClose: () => void;
  count?: number;
}

function TranslatePanel({ onClose, count = 2 }: TranslatePanelProps) {
  const [search, setSearch]     = useState("");
  const [language, setLanguage] = useState("English");

  const filtered = search.trim()
    ? LANGUAGES.filter(l => l.toLowerCase().includes(search.toLowerCase()))
    : LANGUAGES;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "100%",
      background: "var(--bg)",
      borderRight: "1px solid var(--border)",
    }}>

      {/* Header */}
      <motion.div
        {...msgItem(0.04)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "var(--space-4)",
          borderBottom: "1px solid var(--border)",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>
          Translate
        </span>
        <Btn
          variant="outline"
          size="icon-sm"
          onClick={onClose}
          style={{ border: "none", flexShrink: 0, color: "var(--color-text-secondary)" }}
        >
          <X size={16} />
        </Btn>
      </motion.div>

      {/* Search */}
      <motion.div {...msgItem(0.09)} style={{ padding: "var(--space-3) var(--space-4) var(--space-2)", flexShrink: 0 }}>
        <div style={{ position: "relative" }}>
          <Search size={14} style={{
            position: "absolute", left: "var(--space-3)", top: "50%",
            transform: "translateY(-50%)",
            color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
          }} />
          <Inp
            value={search}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            placeholder="Search languages"
            style={{ paddingLeft: 32, paddingRight: search ? 32 : undefined, borderRadius: "var(--radius-full)" }}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                position: "absolute", right: "var(--space-2)", top: "50%",
                transform: "translateY(-50%)", background: "none", border: "none",
                cursor: "pointer", color: "var(--muted-fg)", padding: 0, display: "flex",
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </motion.div>

      {/* Language list */}
      <motion.div
        {...msgItem(0.14)}
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "var(--space-1) var(--space-2)",
          scrollbarWidth: "thin",
          scrollbarColor: "var(--border) transparent",
        }}
      >
        {filtered.length > 0 ? filtered.map(lang => (
          <button
            key={lang}
            type="button"
            onClick={() => setLanguage(lang)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "var(--space-2)",
              width: "100%",
              height: 36,
              padding: "0 var(--space-3)",
              borderRadius: "var(--radius-md)",
              border: "none",
              background: "none",
              cursor: "pointer",
              textAlign: "left",
              fontFamily: "inherit",
              fontSize: "var(--font-size-body-15)",
              fontWeight: language === lang ? 500 : 400,
              color: "var(--fg)",
              transition: "background .1s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--muted)")}
            onMouseLeave={e => (e.currentTarget.style.background = "none")}
          >
            <span style={{ flex: 1 }}>{lang}</span>
            {language === lang && <Check size={14} color="var(--fg)" />}
          </button>
        )) : (
          <p style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)", padding: "var(--space-2) var(--space-3)", margin: 0 }}>
            No languages found
          </p>
        )}
      </motion.div>

      {/* Footer — Update card button */}
      <motion.div
        {...msgItem(0.18)}
        style={{
          padding: "var(--space-4)",
          borderTop: "1px solid var(--border)",
          flexShrink: 0,
          background: "var(--bg)",
        }}
      >
        <Btn style={{ width: "100%", borderRadius: "var(--radius-full)" }}>
          Update card
          <HeartCount count={count} />
        </Btn>
      </motion.div>
    </div>
  );
}

/* ─── EnvelopePanel ──────────────────────────────────────── */

const FLAP_STYLES: { id: string; label: string; price: string | null }[] = [
  { id: "square",   label: "Square",   price: null      },
  { id: "european", label: "European", price: "+$0.30"  },
];

interface EnvelopePanelProps {
  onClose: () => void;
  onSave?: (opts: { flapStyle: string; font: string }) => void;
}

function EnvelopePanel({ onClose, onSave }: EnvelopePanelProps) {
  const [flapStyle, setFlapStyle] = useState("european");
  const [font, setFont]           = useState(FONTS[0]);

  const selected = FLAP_STYLES.find(f => f.id === flapStyle) ?? FLAP_STYLES[0];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--bg)", borderRight: "1px solid var(--border)" }}>

      {/* Header */}
      <motion.div
        {...msgItem(0.04)}
        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-2) var(--space-3) var(--space-2) var(--space-4)", borderBottom: "1px solid var(--border)", flexShrink: 0 }}
      >
        <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>Envelope</span>
        <Btn variant="outline" size="icon-sm" onClick={onClose} style={{ border: "none", flexShrink: 0, color: "var(--color-text-secondary)" }}>
          <X size={16} />
        </Btn>
      </motion.div>

      {/* Content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", display: "flex", flexDirection: "column", gap: "var(--space-6)", padding: "var(--space-4) var(--space-4) var(--space-2)" }}>

        {/* Flap style */}
        <motion.div {...msgItem(0.08)} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>Flap style</span>
            <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>
              {selected.price ?? "+ $0.00"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "var(--space-4)" }}>
            {FLAP_STYLES.map(s => {
              const active = flapStyle === s.id;
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setFlapStyle(s.id)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    gap: 0,
                    alignItems: "stretch",
                    padding: 0,
                    borderRadius: "var(--radius-2xl)",
                    border: active ? "2px solid var(--fg)" : "1px solid var(--border)",
                    background: "var(--bg)",
                    cursor: "pointer",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ width: "100%", height: 108, background: "var(--muted)" }} />
                  <div style={{ display: "flex", gap: "var(--space-1-5)", alignItems: "baseline", padding: "var(--space-2) var(--space-3)" }}>
                    <span style={{ fontSize: "var(--font-size-body-15)", fontWeight: 600, color: "var(--fg)" }}>{s.label}</span>
                    {s.price && (
                      <span style={{ fontSize: "var(--font-size-body-13)", color: "var(--muted-fg)" }}>{s.price}</span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        <div style={{ height: 1, background: "var(--border)", flexShrink: 0 }} />

        {/* Font */}
        <motion.div {...msgItem(0.13)}>
          <Lbl style={{ fontSize: "var(--font-size-body-15)", marginBottom: "var(--space-2)" }}>Font</Lbl>
          <DdMenu
            fixed
            style={{ width: "100%" }}
            trigger={
              <Btn
                variant="outline"
                style={{ width: "100%", borderRadius: "var(--radius-full)", justifyContent: "space-between" }}
              >
                <span style={{ fontFamily: font.family, fontSize: "var(--font-size-body-15)" }}>{font.name}</span>
                <ChevronDown size={14} />
              </Btn>
            }
            items={FONTS.map(f => ({
              label: f.name,
              style: { fontFamily: f.family, fontSize: "var(--font-size-body-15)" },
              onClick: () => setFont(f),
            }))}
          />
        </motion.div>
      </div>

      {/* Footer */}
      <motion.div
        {...msgItem(0.18)}
        style={{ padding: "var(--space-4) var(--space-2)", borderTop: "1px solid var(--border)", flexShrink: 0, background: "var(--bg)" }}
      >
        <Btn
          style={{ width: "100%", borderRadius: "var(--radius-full)", background: "var(--color-brand-primary)", color: "white", border: "none" }}
          onClick={() => onSave?.({ flapStyle, font: font.name })}
        >
          Save
        </Btn>
      </motion.div>
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
  const [tab, setTab]                   = useState("featured");
  const [profileOpen, setProfileOpen]   = useState(false);
  const [profilePos, setProfilePos]     = useState({ bottom: 0, left: 0 });
  const [theme, setTheme]               = useState<"light" | "dark" | "system">("system");
  const avatarRef                       = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profileOpen) return;
    function handle(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [profileOpen]);

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
              {item.dividerBefore && <Sep style={{ margin: "var(--space-1) 0" }} />}
              <ToolbarButton
                icon={item.icon}
                label={item.label}
                active={activeNav === item.id && isOpen}
                onClick={() => handleNavClick(item.id)}
              />
            </React.Fragment>
          ))}
        </div>

        <div ref={avatarRef} style={{ alignSelf: "center", position: "relative" }}>
          <button
            type="button"
            onClick={() => {
              if (!avatarRef.current) return;
              const rect = avatarRef.current.getBoundingClientRect();
              setProfilePos({ bottom: window.innerHeight - rect.bottom, left: rect.right + 16 });
              setProfileOpen(o => !o);
            }}
            style={{ display: "flex", border: "none", background: "none", padding: 0, cursor: "pointer", borderRadius: "var(--radius-full)" }}
          >
            <Avt src="https://i.pravatar.cc/80?img=68" fallback="JW" />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <div style={{ position: "fixed", bottom: profilePos.bottom, left: profilePos.left, zIndex: 100 }}>
                <ProfileNavDesktop theme={theme} setTheme={setTheme} />
              </div>
            )}
          </AnimatePresence>
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
              {activeNav === "message" ? (
                <MessagePanel onClose={handleClose} />
              ) : activeNav === "signature" ? (
                <SignaturePanel onClose={handleClose} />
              ) : activeNav === "translate" ? (
                <TranslatePanel onClose={handleClose} />
              ) : activeNav === "envelope" ? (
                <EnvelopePanel onClose={handleClose} />
              ) : (
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
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
