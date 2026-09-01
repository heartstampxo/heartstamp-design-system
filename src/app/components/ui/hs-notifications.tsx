// ═══════════════════════════════════════════════════════════════════════════
// Notification — bell trigger + notification panel.
//
// Direct port of the approved standalone ("HeartStamp Notifications",
// Claude design), which is itself token-based.
//
//   Trigger: 36px icon circle with an unread dot (brand primary).
//   Panel:   pop-in dropdown, header with "Mark all as read", scrolling
//            list of rows that stagger in at 45ms intervals. Each row has
//            an icon, title · time, one-line preview, a kebab menu
//            (mark as unread / archive), an optional "Show more" link and
//            an optional delivery-progress strip.
//   Touch (or viewports under 768px): drag a row right to mark it read,
//   left to archive — the coloured action panes are revealed, not slid in.
//
// State is uncontrolled: `items` seeds the list, the component owns
// read/archive state after that, and every action also fires its callback.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from "react";
import {
  Bell, Check, Archive, Mail, MoreHorizontal,
  Ticket, Package, ShieldCheck, Wallet, PartyPopper, Image as ImageIcon, Heart,
} from "lucide-react";
import { cssMin, useInjectedStyle } from "./hs-style-inject";

/* ── Data ──────────────────────────────────────────────────────────────── */

export interface NotificationProgress {
  /** Total steps in the strip. */
  total: number;
  /** Steps filled with the brand color. */
  done: number;
  /** Trailing label, e.g. "Delivered · 4/4". */
  label: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  /** Short relative time, e.g. "1m", "1d". */
  time: string;
  preview: string;
  icon?: React.ReactNode;
  unread?: boolean;
  /** Render the underlined "Show more" link. */
  showMore?: boolean;
  progress?: NotificationProgress;
}

const STROKE = { strokeWidth: "var(--lucide-stroke-width, 2)" } as React.CSSProperties;

/** Demo set from the standalone — replaced by real data via `items`. */
export const NOTIFICATION_DEMO_ITEMS: NotificationItem[] = [
  { id: "promo",    title: "You've got 25% off!",             time: "1m", preview: "Use code SAVE25 on your next purch…",       icon: <Ticket size={20} strokeWidth={1.7} />,      showMore: true },
  { id: "order",    title: "Order successfully delivered",    time: "1d", preview: "Your order HS–1042 has been placed and…",   icon: <Package size={20} strokeWidth={1.7} />,     showMore: true, progress: { total: 4, done: 4, label: "Delivered · 4/4" } },
  { id: "security", title: "Security update",                 time: "1d", preview: "Your password was changed successfully.",   icon: <ShieldCheck size={20} strokeWidth={1.7} />, showMore: true },
  { id: "credits",  title: "Earn 15 heart credits for free",  time: "1d", preview: "Add two contacts and earn free credits for…", icon: <Wallet size={20} strokeWidth={1.7} />,    showMore: true, unread: true },
  { id: "occasion", title: "Mom's birthday is coming soon.",  time: "1d", preview: "Mom's birthday is in 5 days. Want to send…", icon: <PartyPopper size={20} strokeWidth={1.7} />, showMore: true },
  { id: "designs",  title: "New seasonal designs are live",   time: "1d", preview: "Fresh card styles just dropped. Take a look.", icon: <ImageIcon size={20} strokeWidth={1.7} />, showMore: true },
  { id: "earned",   title: "You earned 20 heart credits",     time: "1d", preview: "You've officially earned 20 Heart Credits t…", icon: <Heart size={20} strokeWidth={1.7} />,    showMore: true },
];

/* ── Styles — ported verbatim from the standalone (token-based) ────────── */

const NOTIF_CSS = `
:where(.hs-notif button, .hs-notif a) { font: inherit; color: inherit; text-decoration: none; }
:where(.hs-notif button) { appearance: none; border: 0; background: none; padding: 0; margin: 0; cursor: pointer; }
.hs-notif :focus-visible { outline: 2px solid var(--color-brand-primary); outline-offset: 2px; }

.hs-notif {
  /* Panel-specific measurements from the spec (no global tokens here). */
  --notif-w: 400px;
  --notif-max-h: 620px;
  --notif-row-pad: 20px 24px;
  --notif-m-top: 46px; /* phone: sheet starts below the compact header */
  --notif-z: 50;
  position: relative; flex: none;
  font-family: var(--font-family-body);
  color: var(--color-text-primary);
}

/* ── Trigger ──────────────────────────────────────────────── */
.hs-notif__trigger {
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--color-brand-secondary-dim);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 150ms ease;
}
.hs-notif__trigger:hover { background: var(--color-element-subtle); }
.hs-notif__trigger[aria-expanded="true"] { background: var(--color-state-pressed); }
.hs-notif__dot {
  position: absolute;
  right: 3px;
  top: 2px;
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-brand-primary);
  box-shadow: 0 0 0 2px var(--color-bg-main);
  pointer-events: none;
}
.hs-notif__trigger[data-unread="false"] .hs-notif__dot { display: none; }

/* ── Panel ────────────────────────────────────────────────── */
.hs-notif__panel {
  position: absolute;
  right: 0;
  top: 48px;
  z-index: var(--notif-z);
  width: var(--notif-w);
  max-height: var(--notif-max-h);
  background: var(--color-bg-main);
  border-radius: var(--radius-3xl);
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.16); /* spec elevation, between --shadow-lg and --shadow-2xl */
  overflow: hidden;
  display: flex;
  flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
  transform-origin: top right;
  animation: hs-notif-pop-in 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hs-notif__panel[hidden] { display: none; }

.hs-notif__head {
  flex: none;
  box-sizing: border-box;
  padding: var(--space-5) var(--space-6);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}
.hs-notif__title {
  font-family: var(--font-family-heading);
  font-weight: var(--font-weight-medium, 500);
  font-size: var(--font-size-label-15);
  line-height: var(--line-height-label-15, 20px);
}
.hs-notif__markall {
  font-weight: var(--font-weight-semibold, 600);
  font-size: var(--font-size-body-13);
  line-height: var(--line-height-label-12, 18px);
  color: var(--color-brand-primary);
  transition: opacity 150ms ease;
}
.hs-notif__markall:hover { opacity: 0.8; }

.hs-notif__list { flex: 1; min-height: 0; overflow-y: auto; }

/* ── Row ──────────────────────────────────────────────────── */
/* .hs-notif__swipe is the clipping shell that holds the two
   action panes; .hs-notif__row is the layer that translates. */
.hs-notif__swipe { position: relative; z-index: 1; }
.hs-notif__swipe.is-clipped { overflow: hidden; }
.hs-notif__swipe.is-archived { display: none; }
/* A row with an open kebab menu must sit above its siblings. */
.hs-notif__swipe:has(.hs-notif__menu:not([hidden])) { z-index: 40; overflow: visible; }

.hs-notif__pane {
  box-sizing: border-box;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 0;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
  color: var(--color-text-on-primary, #ffffff);
}
/* Spec uses a darker green than --color-state-success (#22c55e) so the
   white glyph keeps contrast on the revealed pane. Deliberate exception. */
.hs-notif__pane--read { left: 0; background: #198f4a; }
.hs-notif__pane--archive { right: 0; background: var(--color-brand-primary); }
.hs-notif__pane svg { flex: 0 0 auto; }

.hs-notif__row {
  position: relative;
  z-index: 1;
  box-sizing: border-box;
  padding: var(--notif-row-pad);
  border-top: 1px solid rgba(36, 36, 35, 0.08); /* spec hairline, one step lighter than --border */
  background: var(--color-bg-main);
  display: flex;
  flex-direction: row;
  gap: var(--space-4);
  align-items: flex-start;
  cursor: pointer;
  opacity: 0;
  animation: hs-notif-pop-item 0.42s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hs-notif__row:hover { background: #fbfbfa; } /* spec wash, no token at this tint */

/* Unread: warm-gray wash plus the 3px brand rule on the leading edge */
.hs-notif__row[data-unread] { padding-left: 21px; background: var(--color-bg-editor); }
.hs-notif__row[data-unread]:hover { background: #f0f0ef; } /* spec wash */
.hs-notif__row[data-unread]::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background: var(--color-brand-primary);
}

/* Stagger: 60ms in, 45ms per row after */
.hs-notif__row { animation-delay: 0.060s; }
.hs-notif__swipe:nth-child(2) .hs-notif__row { animation-delay: 0.105s; }
.hs-notif__swipe:nth-child(3) .hs-notif__row { animation-delay: 0.150s; }
.hs-notif__swipe:nth-child(4) .hs-notif__row { animation-delay: 0.195s; }
.hs-notif__swipe:nth-child(5) .hs-notif__row { animation-delay: 0.240s; }
.hs-notif__swipe:nth-child(6) .hs-notif__row { animation-delay: 0.285s; }
.hs-notif__swipe:nth-child(7) .hs-notif__row { animation-delay: 0.330s; }

.hs-notif__icon {
  width: 44px;
  height: 44px;
  flex: none;
  border-radius: var(--radius-full);
  background: var(--color-brand-secondary-dim);
  display: flex;
  align-items: center;
  justify-content: center;
}
.hs-notif__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-1); }
.hs-notif__line { display: flex; flex-direction: row; gap: var(--space-3); align-items: baseline; }
.hs-notif__name {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: var(--font-weight-medium, 500);
  font-size: var(--font-size-h6, 16px);
  line-height: 22px; /* spec */
}
.hs-notif__time { flex: none; font-size: var(--font-size-body-13); line-height: var(--line-height-label-12, 18px); color: var(--color-text-secondary); }

.hs-notif__sub { display: flex; flex-direction: row; gap: var(--space-3); align-items: center; }
.hs-notif__preview {
  flex: 0 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: var(--font-size-body-15);
  line-height: 21px; /* spec */
  color: var(--color-text-secondary);
}
.hs-notif__more {
  align-self: flex-start;
  font-size: var(--font-size-body-15);
  line-height: var(--line-height-body-15, 20px);
  color: var(--color-text-secondary);
  text-decoration: underline;
}

/* ── Kebab + its menu ─────────────────────────────────────── */
.hs-notif__kebabwrap { position: relative; flex: none; margin-left: auto; }
.hs-notif__kebab {
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition: color 150ms ease;
}
.hs-notif__kebab:hover { color: var(--color-text-primary); }
.hs-notif__menu {
  position: absolute;
  right: 0;
  top: 26px;
  z-index: 20;
  width: 167px;
  box-sizing: border-box;
  border-radius: var(--radius-2xl);
  background: var(--color-bg-main);
  box-shadow: inset 0 0 0 1px var(--color-element-subtle), var(--shadow-md);
  overflow: hidden;
  padding: var(--space-1) 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-0-5, 2px);
  align-items: stretch;
  transform-origin: top right;
  animation: hs-notif-pop-in 0.3s cubic-bezier(0.22, 1, 0.36, 1) both;
}
.hs-notif__menu[hidden] { display: none; }
.hs-notif__menuitem {
  height: 40px;
  box-sizing: border-box;
  padding: var(--space-2-5) var(--space-4);
  display: flex;
  flex-direction: row;
  gap: var(--space-2-5);
  align-items: center;
  font-weight: var(--font-weight-medium, 500);
  font-size: var(--font-size-body-15);
  line-height: var(--line-height-body-15, 20px);
  text-align: left;
  transition: background 150ms ease;
  white-space: nowrap;
}
.hs-notif__menuitem:hover { background: var(--color-state-hover); }

/* ── Delivery progress ────────────────────────────────────── */
.hs-notif__progress {
  margin-top: var(--space-2-5);
  display: flex;
  flex-direction: row;
  gap: var(--space-1-5, 6px);
  align-items: center;
}
.hs-notif__step { flex: 1; height: 6px; border-radius: var(--radius-full); background: var(--color-brand-primary); }
.hs-notif__step[data-done="false"] { background: var(--color-element-subtle); }
.hs-notif__steplabel {
  flex: none;
  margin-left: var(--space-1-5, 6px);
  font-size: var(--font-size-body-13);
  line-height: var(--line-height-label-12, 18px);
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* ── Keyframes ────────────────────────────────────────────── */
@keyframes hs-notif-pop-in {
  0%   { opacity: 0; transform: translateY(-8px) scale(0.96); }
  60%  { opacity: 1; transform: translateY(0) scale(1.008); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes hs-notif-pop-item {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: none; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-notif__panel, .hs-notif__menu, .hs-notif__row { animation: none; opacity: 1; }
}

/* ═══════════════════════════════════════════════════════════
   Phone (≤767px) — the panel stops being a dropdown and
   becomes a full-height sheet under the header.
   The same rules are mirrored on .hs-notif[data-mobile] so the
   phone layout can be forced at any viewport width (design
   review, device frames, docs).
═══════════════════════════════════════════════════════════ */
@media (max-width: 767px) {
 .hs-notif__panel {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--notif-m-top);
  bottom: 0;
  width: 100vw;
  max-width: 100vw;
  height: auto;
  max-height: none;
  border-radius: 0;
  box-shadow: none;
 }
 .hs-notif__head { padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-brand-secondary-dim); }
 .hs-notif__title { font-family: var(--font-family-body); font-weight: var(--font-weight-semibold, 600); font-size: var(--font-size-label-sb-15); line-height: 100%; }
 .hs-notif__markall { font-weight: var(--font-weight-bold, 700); font-size: var(--font-size-body-13); line-height: 100%; }
 .hs-notif__row { padding: var(--space-4) var(--space-5); gap: var(--space-4); align-items: center; }
 .hs-notif__row[data-unread] { padding-left: 17px; }
 .hs-notif__icon { width: 40px; height: 40px; }
 .hs-notif__name { font-weight: var(--font-weight-medium, 500); font-size: var(--font-size-label-15); line-height: var(--line-height-label-15, 20px); }
 .hs-notif__more { font-size: var(--font-size-body-15); line-height: var(--line-height-body-15, 20px); }
 .hs-notif__list { overflow-x: clip; overflow-clip-margin: 200px; }
 .hs-notif__swipe { overflow: visible; }
 .hs-notif__swipe.is-clipped { overflow: hidden; }
 .hs-notif__row { overflow: visible; touch-action: pan-y; will-change: transform; }
 .hs-notif__swipe:has(.hs-notif__menu:not([hidden])) { z-index: 30; overflow: visible; }
}

.hs-notif[data-mobile] .hs-notif__panel {
  position: fixed;
  left: 0;
  right: 0;
  top: var(--notif-m-top);
  bottom: 0;
  width: 100vw;
  max-width: 100vw;
  height: auto;
  max-height: none;
  border-radius: 0;
  box-shadow: none;
}
.hs-notif[data-mobile] .hs-notif__head { padding: var(--space-3) var(--space-5); border-bottom: 1px solid var(--color-brand-secondary-dim); }
.hs-notif[data-mobile] .hs-notif__title { font-family: var(--font-family-body); font-weight: var(--font-weight-semibold, 600); font-size: var(--font-size-label-sb-15); line-height: 100%; }
.hs-notif[data-mobile] .hs-notif__markall { font-weight: var(--font-weight-bold, 700); font-size: var(--font-size-body-13); line-height: 100%; }
.hs-notif[data-mobile] .hs-notif__row { padding: var(--space-4) var(--space-5); gap: var(--space-4); align-items: center; }
.hs-notif[data-mobile] .hs-notif__row[data-unread] { padding-left: 17px; }
.hs-notif[data-mobile] .hs-notif__icon { width: 40px; height: 40px; }
.hs-notif[data-mobile] .hs-notif__name { font-weight: var(--font-weight-medium, 500); font-size: var(--font-size-label-15); line-height: var(--line-height-label-15, 20px); }
.hs-notif[data-mobile] .hs-notif__more { font-size: var(--font-size-body-15); line-height: var(--line-height-body-15, 20px); }
.hs-notif[data-mobile] .hs-notif__list { overflow-x: clip; overflow-clip-margin: 200px; }
.hs-notif[data-mobile] .hs-notif__swipe { overflow: visible; }
.hs-notif[data-mobile] .hs-notif__swipe.is-clipped { overflow: hidden; }
.hs-notif[data-mobile] .hs-notif__row { overflow: visible; touch-action: pan-y; will-change: transform; }
.hs-notif[data-mobile] .hs-notif__swipe:has(.hs-notif__menu:not([hidden])) { z-index: 30; overflow: visible; }
`;

const NOTIF_CSS_MIN = cssMin(NOTIF_CSS);

/* Swipe geometry from the spec. */
const SWIPE_MAX = 104;
const SWIPE_COMMIT = 56;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

/* ── Row (also exported for standalone use, e.g. docs state gallery) ───── */

export interface NotificationRowProps {
  item: NotificationItem;
  unread?: boolean;
  menuOpen?: boolean;
  /** Internal: skip the scoping wrapper and style tag (the panel provides them). */
  bare?: boolean;
  onClick?: () => void;
  onShowMore?: () => void;
  onKebabToggle?: () => void;
  onMarkUnread?: () => void;
  onArchive?: () => void;
}

export function NotificationRow({
  item, unread = false, menuOpen = false, bare = false,
  onClick, onShowMore, onKebabToggle, onMarkUnread, onArchive,
}: NotificationRowProps) {
  useInjectedStyle("hs-notif", NOTIF_CSS_MIN);
  const row = (
      <div
        className="hs-notif__row"
        {...(unread ? { "data-unread": "" } : {})}
        onClick={onClick}
      >
        <div className="hs-notif__icon">{item.icon ?? <Bell size={20} strokeWidth={1.7} />}</div>
        <div className="hs-notif__body">
          <div className="hs-notif__line">
            <span className="hs-notif__name">{item.title}</span>
            <span className="hs-notif__time">{item.time}</span>
          </div>
          <div className="hs-notif__sub">
            <span className="hs-notif__preview">{item.preview}</span>
            <div className="hs-notif__kebabwrap">
              <button
                type="button"
                className="hs-notif__kebab"
                aria-label="More options"
                aria-expanded={menuOpen}
                onClick={e => { e.stopPropagation(); onKebabToggle?.(); }}
              >
                <MoreHorizontal size={16} aria-hidden />
              </button>
              <div className="hs-notif__menu" hidden={!menuOpen}>
                <button
                  type="button"
                  className="hs-notif__menuitem"
                  onClick={e => { e.stopPropagation(); onMarkUnread?.(); }}
                >
                  <Mail size={16} strokeWidth={1.5} style={{ flex: "none" }} aria-hidden />
                  Mark as unread
                </button>
                <button
                  type="button"
                  className="hs-notif__menuitem"
                  onClick={e => { e.stopPropagation(); onArchive?.(); }}
                >
                  <Archive size={16} strokeWidth={1.5} style={{ flex: "none" }} aria-hidden />
                  Archive
                </button>
              </div>
            </div>
          </div>
          {item.showMore && (
            <span
              className="hs-notif__more"
              onClick={e => { e.stopPropagation(); onShowMore?.(); }}
            >
              Show more
            </span>
          )}
          {item.progress && (
            <div className="hs-notif__progress">
              {Array.from({ length: item.progress.total }, (_, i) => (
                <div key={i} className="hs-notif__step" data-done={i < item.progress!.done ? "true" : "false"} />
              ))}
              <span className="hs-notif__steplabel">{item.progress.label}</span>
            </div>
          )}
        </div>
      </div>
  );

  if (bare) return row;
  return <div className="hs-notif">{row}</div>;
}

/* ── Component ─────────────────────────────────────────────────────────── */

export interface NotificationProps {
  /** Rows to render. Defaults to the demo set from the spec. */
  items?: NotificationItem[];
  /** Render the panel open on mount. */
  defaultOpen?: boolean;
  /** Force the phone presentation (full-height sheet) at any viewport width.
      Under 768px it applies automatically via the media query. */
  mobile?: boolean;
  title?: string;
  markAllLabel?: string;
  onItemClick?: (item: NotificationItem) => void;
  onShowMore?: (item: NotificationItem) => void;
  onArchive?: (item: NotificationItem) => void;
  onMarkAllRead?: () => void;
}

export function Notification({
  items = NOTIFICATION_DEMO_ITEMS,
  defaultOpen = false,
  mobile = false,
  title = "Notifications",
  markAllLabel = "Mark all as read",
  onItemClick, onShowMore, onArchive, onMarkAllRead,
}: NotificationProps) {
  useInjectedStyle("hs-notif", NOTIF_CSS_MIN);
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  const [menuFor, setMenuFor] = useState<string | null>(null);
  const [unreadIds, setUnreadIds] = useState<Set<string>>(
    () => new Set(items.filter(i => i.unread).map(i => i.id)),
  );
  const [archivedIds, setArchivedIds] = useState<Set<string>>(new Set());
  /* Panel remount key re-runs the staggered entrance on every open. */
  const [openCount, setOpenCount] = useState(0);
  /* Swipe shells by item id, for the archive slide-out. */
  const shellRefs = useRef(new Map<string, HTMLElement>());

  const hasUnread = unreadIds.size > 0;

  /* Outside click + Escape close the panel (and any open menu). */
  useEffect(() => {
    if (!open && !menuFor) return;
    const onDoc = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false); setMenuFor(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOpen(false); setMenuFor(null); }
    };
    document.addEventListener("click", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, menuFor]);

  const toggleOpen = () => {
    setOpen(o => {
      if (!o) setOpenCount(c => c + 1);
      else setMenuFor(null);
      return !o;
    });
  };

  const markAll = () => {
    setUnreadIds(new Set());
    onMarkAllRead?.();
  };

  const archive = (item: NotificationItem, shell: HTMLElement | null) => {
    onArchive?.(item);
    const row = shell?.querySelector<HTMLElement>(".hs-notif__row");
    const pane = shell?.querySelector<HTMLElement>(".hs-notif__pane--archive");
    if (row && shell) {
      row.style.transition = `transform 0.26s ${EASE}, opacity 0.26s ease`;
      row.style.transform = "translateX(-100%)";
      row.style.opacity = "0";
      if (pane) {
        pane.style.transition = `width 0.26s ${EASE}`;
        pane.style.width = `${row.offsetWidth || 400}px`;
      }
      setTimeout(() => setArchivedIds(s => new Set(s).add(item.id)), 260);
    } else {
      setArchivedIds(s => new Set(s).add(item.id));
    }
  };

  /* ── Swipe (touch or narrow viewports): right = read, left = archive ── */
  const drag = useRef<{ shell: HTMLElement; row: HTMLElement; item: NotificationItem; x0: number; y0: number; dx: number; axis: "x" | "y" | null } | null>(null);

  const isTouchLike = () =>
    mobile ||
    (typeof window !== "undefined" && window.matchMedia &&
      window.matchMedia("(hover: none), (max-width: 767px)").matches);

  const setPanes = (shell: HTMLElement, dx: number, transition = "none") => {
    const read = shell.querySelector<HTMLElement>(".hs-notif__pane--read");
    const arch = shell.querySelector<HTMLElement>(".hs-notif__pane--archive");
    [read, arch].forEach(el => { if (el) el.style.transition = transition; });
    if (read) read.style.width = dx > 0 ? `${dx}px` : "0px";
    if (arch) arch.style.width = dx < 0 ? `${-dx}px` : "0px";
  };

  const dragStart = (item: NotificationItem) => (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isTouchLike()) return;
    const shell = e.currentTarget;
    const row = shell.querySelector<HTMLElement>(".hs-notif__row");
    if (!row) return;
    shell.classList.add("is-clipped");
    row.style.transition = "none";
    drag.current = { shell, row, item, x0: e.clientX, y0: e.clientY, dx: 0, axis: null };
  };

  const dragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const mx = e.clientX - d.x0, my = e.clientY - d.y0;
    if (d.axis === null) {
      if (Math.abs(mx) < 8 && Math.abs(my) < 8) return;
      d.axis = Math.abs(mx) > Math.abs(my) ? "x" : "y";
      if (d.axis === "y") { /* let the list scroll */
        d.shell.classList.remove("is-clipped");
        d.row.style.transition = "transform 0.2s ease";
        d.row.style.transform = "translateX(0)";
        setPanes(d.shell, 0, "width 0.2s ease");
        drag.current = null;
        return;
      }
      d.row.setPointerCapture?.(e.pointerId);
    }
    if (d.axis !== "x") return;
    e.preventDefault();
    d.dx = Math.max(-SWIPE_MAX, Math.min(SWIPE_MAX, mx));
    d.row.style.transform = `translateX(${d.dx}px)`;
    setPanes(d.shell, d.dx);
  };

  const dragEnd = () => {
    const d = drag.current;
    if (!d) return;
    drag.current = null;
    d.row.style.transition = `transform 0.26s ${EASE}, opacity 0.26s ease`;
    if (d.dx > SWIPE_COMMIT) {          /* mark read */
      d.row.style.transform = "translateX(0)";
      setPanes(d.shell, 0, `width 0.26s ${EASE}`);
      setUnreadIds(s => { const n = new Set(s); n.delete(d.item.id); return n; });
    } else if (d.dx < -SWIPE_COMMIT) {  /* archive */
      archive(d.item, d.shell);
      return;
    } else {                            /* snap back */
      d.row.style.transform = "translateX(0)";
      setPanes(d.shell, 0, `width 0.26s ${EASE}`);
    }
    const shell = d.shell;
    setTimeout(() => shell.classList.remove("is-clipped"), 280);
  };

  const visible = items.filter(i => !archivedIds.has(i.id));

  return (
    <div className="hs-notif" ref={rootRef} {...(mobile ? { "data-mobile": "" } : {})}>

      <button
        type="button"
        className="hs-notif__trigger"
        aria-label={title}
        aria-expanded={open}
        data-unread={hasUnread ? "true" : "false"}
        onClick={e => { e.stopPropagation(); toggleOpen(); }}
      >
        <Bell size={18} style={STROKE} aria-hidden />
        <span className="hs-notif__dot" aria-hidden="true" />
      </button>

      {open && (
        <div className="hs-notif__panel" role="dialog" aria-label={title} key={openCount}>
          <div className="hs-notif__head">
            <span className="hs-notif__title">{title}</span>
            <button type="button" className="hs-notif__markall" onClick={e => { e.stopPropagation(); markAll(); }}>
              {markAllLabel}
            </button>
          </div>

          <div className="hs-notif__list">
            {visible.map(item => {
              const unread = unreadIds.has(item.id);
              return (
                <div
                  key={item.id}
                  className="hs-notif__swipe"
                  ref={el => {
                    if (el) shellRefs.current.set(item.id, el);
                    else shellRefs.current.delete(item.id);
                  }}
                  onPointerDown={dragStart(item)}
                  onPointerMove={dragMove}
                  onPointerUp={dragEnd}
                  onPointerCancel={dragEnd}
                >
                  <div className="hs-notif__pane hs-notif__pane--read" aria-hidden="true">
                    <Check size={20} style={STROKE} />
                  </div>
                  <div className="hs-notif__pane hs-notif__pane--archive" aria-hidden="true">
                    <Archive size={20} style={STROKE} />
                  </div>

                  <NotificationRow
                    bare
                    item={item}
                    unread={unread}
                    menuOpen={menuFor === item.id}
                    onClick={() => onItemClick?.(item)}
                    onShowMore={() => onShowMore?.(item)}
                    onKebabToggle={() => setMenuFor(m => (m === item.id ? null : item.id))}
                    onMarkUnread={() => {
                      setUnreadIds(s => new Set(s).add(item.id));
                      setMenuFor(null);
                    }}
                    onArchive={() => {
                      setMenuFor(null);
                      archive(item, shellRefs.current.get(item.id) ?? null);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
