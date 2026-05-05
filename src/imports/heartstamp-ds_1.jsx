import { useState, useRef, useEffect } from "react";
import {
  Moon, Sun, Menu, X, Github, Eye, Code2,
  Smartphone, Tablet, Monitor, Maximize2, Copy, Check,
  ChevronDown, ChevronRight, ChevronLeft, ChevronUp,
  ExternalLink, Info, AlertTriangle, CheckCircle2, XCircle,
  Mail, ArrowRight, Loader2, Package, Palette, Zap, BookOpen,
  User, Bell, Settings, LogOut, Search, Plus, Trash2, Edit,
  Star, Heart, Home, FileText, MoreHorizontal, AlertCircle,
  Calendar, Clock, ChevronsLeft, ChevronsRight, Upload, Link,
  Minus, GripVertical, SlidersHorizontal, ToggleLeft, Filter, RefreshCw
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   THEME & HELPERS
═══════════════════════════════════════════════════════════ */
const c = (...args) => args.filter(Boolean).join(" ");
const LABEL_COLORS = {
  new: { bg: "rgba(16,185,129,.13)", color: "#10b981" },
  beta: { bg: "rgba(245,158,11,.13)", color: "#f59e0b" },
  deprecated: { bg: "rgba(239,68,68,.13)", color: "#ef4444" },
};
const VIEWPORTS = [
  { id: "mobile", w: "390px", Icon: Smartphone },
  { id: "tablet", w: "768px", Icon: Tablet },
  { id: "desktop", w: "100%", Icon: Monitor },
  { id: "full", w: "100%", Icon: Maximize2 },
];

/* ═══════════════════════════════════════════════════════════
   NAV CONFIG  – all 33 Shadcn components
═══════════════════════════════════════════════════════════ */
const NAV = [
  {
    title: "Getting Started", items: [
      { title: "Introduction", id: "intro" },
      { title: "Installation", id: "install" },
      { title: "Theming", id: "theming" },
    ]
  },
  {
    title: "Layout", items: [
      { title: "Separator", id: "separator" },
      { title: "Scroll Area", id: "scroll-area" },
      { title: "Aspect Ratio", id: "aspect-ratio" },
    ]
  },
  {
    title: "Inputs", items: [
      { title: "Button", id: "button" },
      { title: "Input", id: "input" },
      { title: "Textarea", id: "textarea" },
      { title: "Label", id: "label" },
      { title: "Select", id: "select" },
      { title: "Checkbox", id: "checkbox" },
      { title: "Radio Group", id: "radio-group" },
      { title: "Switch", id: "switch" },
      { title: "Slider", id: "slider" },
      { title: "Toggle", id: "toggle" },
      { title: "Toggle Group", id: "toggle-group" },
    ]
  },
  {
    title: "Display", items: [
      { title: "Badge", id: "badge", label: "new" },
      { title: "Avatar", id: "avatar" },
      { title: "Card", id: "card" },
      { title: "Table", id: "table" },
      { title: "Skeleton", id: "skeleton" },
      { title: "Progress", id: "progress" },
      { title: "Calendar", id: "calendar", label: "new" },
    ]
  },
  {
    title: "Navigation", items: [
      { title: "Tabs", id: "tabs" },
      { title: "Breadcrumb", id: "breadcrumb" },
      { title: "Pagination", id: "pagination" },
      { title: "Navigation Menu", id: "nav-menu" },
    ]
  },
  {
    title: "Feedback", items: [
      { title: "Alert", id: "alert" },
      { title: "Toast", id: "toast", label: "beta" },
      { title: "Alert Dialog", id: "alert-dialog" },
    ]
  },
  {
    title: "Overlays", items: [
      { title: "Dialog", id: "dialog" },
      { title: "Sheet", id: "sheet" },
      { title: "Tooltip", id: "tooltip" },
      { title: "Popover", id: "popover" },
      { title: "Dropdown Menu", id: "dropdown" },
      { title: "Context Menu", id: "context-menu" },
      { title: "Hover Card", id: "hover-card" },
      { title: "Command", id: "command", label: "new" },
    ]
  },
  {
    title: "Disclosure", items: [
      { title: "Accordion", id: "accordion" },
      { title: "Collapsible", id: "collapsible" },
    ]
  },
];

const ALL_ITEMS = NAV.flatMap(g => g.items);

/* ═══════════════════════════════════════════════════════════
   MINI SHADCN-STYLE COMPONENT PRIMITIVES
═══════════════════════════════════════════════════════════ */

// Button
function Btn({ variant = "default", size = "default", disabled, children, onClick, style, asChild }) {
  const base = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
    fontFamily: "inherit", fontWeight: 500, borderRadius: 7, border: "1px solid transparent",
    cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
    transition: "all .15s ease", whiteSpace: "nowrap",
    fontSize: size === "sm" ? 12 : size === "lg" ? 15 : 13,
    padding: size === "sm" ? "5px 12px" : size === "lg" ? "10px 20px" : size === "icon" ? "7px" : "7px 16px"
  };
  const vmap = {
    default: { background: "var(--accent)", color: "#fff", borderColor: "var(--accent)" },
    secondary: { background: "var(--muted)", color: "var(--fg)", borderColor: "var(--border)" },
    outline: { background: "transparent", color: "var(--fg)", borderColor: "var(--border)" },
    ghost: { background: "transparent", color: "var(--fg)", borderColor: "transparent" },
    link: { background: "transparent", color: "var(--accent)", borderColor: "transparent", textDecoration: "underline", padding: 0 },
    destructive: { background: "#ef4444", color: "#fff", borderColor: "#ef4444" },
  };
  return <button disabled={disabled} onClick={onClick} style={{ ...base, ...vmap[variant], ...style }}>{children}</button>;
}

// Input
function Inp({ placeholder, value, onChange, type = "text", disabled, style }) {
  return <input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled}
    style={{
      width: "100%", padding: "8px 12px", borderRadius: 7, border: "1px solid var(--border)",
      background: "var(--bg)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit",
      outline: "none", opacity: disabled ? 0.5 : 1, ...style
    }} />;
}

// Label
function Lbl({ children, style }) {
  return <label style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", display: "block", marginBottom: 4, ...style }}>{children}</label>;
}

// Textarea
function Tarea({ placeholder, rows = 3, disabled }) {
  const [v, setV] = useState("");
  return <textarea rows={rows} placeholder={placeholder} value={v} onChange={e => setV(e.target.value)} disabled={disabled}
    style={{
      width: "100%", padding: "8px 12px", borderRadius: 7, border: "1px solid var(--border)",
      background: "var(--bg)", color: "var(--fg)", fontSize: 13, fontFamily: "inherit",
      outline: "none", resize: "vertical", opacity: disabled ? 0.5 : 1
    }} />;
}

// Badge
function Bdg({ variant = "default", children, style }) {
  const vmap = {
    default: { background: "var(--accent)", color: "#fff" },
    secondary: { background: "var(--muted)", color: "var(--muted-fg)" },
    outline: { background: "transparent", color: "var(--fg)", border: "1px solid var(--border)" },
    destructive: { background: "#ef4444", color: "#fff" },
    success: { background: "#22c55e", color: "#fff" },
    warning: { background: "#f59e0b", color: "#fff" },
  };
  return <span style={{
    display: "inline-flex", alignItems: "center", padding: "2px 9px", borderRadius: 999,
    fontSize: 11, fontWeight: 600, ...vmap[variant], ...style
  }}>{children}</span>;
}

// Avatar
function Avt({ src, fallback = "AB", size = 40 }) {
  const [err, setErr] = useState(false);
  return <div style={{
    width: size, height: size, borderRadius: "50%", overflow: "hidden",
    background: "var(--muted)", display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.35, fontWeight: 700, color: "var(--muted-fg)", border: "2px solid var(--border)", flexShrink: 0
  }}>
    {src && !err ? <img src={src} onError={() => setErr(true)} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
      : fallback}
  </div>;
}

// Separator
function Sep({ orientation = "horizontal", style }) {
  return <div style={{
    [orientation === "horizontal" ? "height" : "width"]: 1,
    [orientation === "horizontal" ? "width" : "height"]: "100%",
    background: "var(--border)", ...style
  }} />;
}

// Switch
function Swt({ checked, onChange, label, disabled }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 10, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    onClick={() => !disabled && onChange(!checked)}>
    <div style={{
      position: "relative", width: 44, height: 24, borderRadius: 999,
      background: checked ? "var(--accent)" : "var(--muted)", border: "1px solid var(--border)",
      transition: "background .2s"
    }}>
      <div style={{
        position: "absolute", top: 2, left: checked ? 20 : 2, width: 18, height: 18,
        borderRadius: "50%", background: "#fff", transition: "left .2s",
        boxShadow: "0 1px 3px rgba(0,0,0,.2)"
      }} />
    </div>
    {label && <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>}
  </div>;
}

// Checkbox
function Cbx({ checked, onChange, label, disabled }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1 }}
    onClick={() => !disabled && onChange(!checked)}>
    <div style={{
      width: 16, height: 16, borderRadius: 4, border: `2px solid ${checked ? "var(--accent)" : "var(--border)"}`,
      background: checked ? "var(--accent)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center",
      transition: "all .15s", flexShrink: 0
    }}>
      {checked && <Check size={10} color="#fff" strokeWidth={3} />}
    </div>
    {label && <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>}
  </div>;
}

// Radio
function Rdo({ checked, onChange, label }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={onChange}>
    <div style={{
      width: 16, height: 16, borderRadius: "50%", border: `2px solid ${checked ? "var(--accent)" : "var(--border)"}`,
      display: "flex", alignItems: "center", justifyContent: "center", transition: "all .15s"
    }}>
      {checked && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />}
    </div>
    {label && <span style={{ fontSize: 13, color: "var(--fg)" }}>{label}</span>}
  </div>;
}

// Select dropdown
function Sel({ options = [], value, onChange, placeholder = "Select…", style }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const selected = options.find(o => o.value === value);
  return <div ref={ref} style={{ position: "relative", ...style }}>
    <button onClick={() => setOpen(o => !o)} style={{
      width: "100%", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "8px 12px", borderRadius: 7, border: "1px solid var(--border)",
      background: "var(--bg)", color: selected ? "var(--fg)" : "var(--muted-fg)", fontSize: 13,
      fontFamily: "inherit", cursor: "pointer"
    }}>
      <span>{selected?.label || placeholder}</span>
      <ChevronDown size={14} style={{ transition: ".2s", transform: open ? "rotate(180deg)" : "none" }} />
    </button>
    {open && <div style={{
      position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, zIndex: 100,
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 8,
      boxShadow: "0 8px 24px rgba(0,0,0,.15)", overflow: "hidden"
    }}>
      {options.map(o => <div key={o.value} onClick={() => { onChange(o.value); setOpen(false); }}
        style={{
          padding: "8px 12px", fontSize: 13, cursor: "pointer", color: "var(--fg)",
          background: o.value === value ? "var(--muted)" : "transparent",
          display: "flex", alignItems: "center", justifyContent: "space-between"
        }}>
        {o.label}
        {o.value === value && <Check size={13} style={{ color: "var(--accent)" }} />}
      </div>)}
    </div>}
  </div>;
}

// Slider
function Sldr({ value, onChange, min = 0, max = 100 }) {
  return <div style={{ width: "100%", padding: "8px 0", position: "relative" }}>
    <div style={{ height: 4, borderRadius: 99, background: "var(--muted)", position: "relative" }}>
      <div style={{
        position: "absolute", left: 0, top: 0, height: "100%", borderRadius: 99,
        background: "var(--accent)", width: `${((value - min) / (max - min)) * 100}%`
      }} />
    </div>
    <input type="range" min={min} max={max} value={value} onChange={e => onChange(Number(e.target.value))}
      style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer", width: "100%", margin: 0 }} />
  </div>;
}

// Progress
function Prg({ value, style }) {
  return <div style={{ height: 8, borderRadius: 99, background: "var(--muted)", overflow: "hidden", ...style }}>
    <div style={{
      height: "100%", borderRadius: 99, background: "var(--accent)",
      width: `${value}%`, transition: "width .3s"
    }} />
  </div>;
}

// Skeleton
function Skl({ style }) {
  return <div style={{
    borderRadius: 6, background: "var(--muted)",
    backgroundImage: "linear-gradient(90deg,var(--muted) 25%,var(--border) 50%,var(--muted) 75%)",
    backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", ...style
  }} />;
}

// Alert
function Alrt({ variant = "default", title, children }) {
  const vmap = {
    default: { border: "var(--border)", bg: "var(--muted)", color: "var(--fg)", Icon: Info },
    destructive: { border: "#ef444460", bg: "#ef444410", color: "#ef4444", Icon: XCircle },
    success: { border: "#22c55e60", bg: "#22c55e10", color: "#22c55e", Icon: CheckCircle2 },
    warning: { border: "#f59e0b60", bg: "#f59e0b10", color: "#f59e0b", Icon: AlertTriangle },
  };
  const v = vmap[variant];
  return <div style={{
    display: "flex", gap: 12, padding: "12px 16px", borderRadius: 8,
    border: `1px solid ${v.border}`, background: v.bg
  }}>
    <v.Icon size={16} style={{ color: v.color, marginTop: 1, flexShrink: 0 }} />
    <div>
      {title && <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 2, color: "var(--fg)" }}>{title}</div>}
      <div style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.5 }}>{children}</div>
    </div>
  </div>;
}

// Card
function Crd({ children, style }) {
  return <div style={{
    border: "1px solid var(--border)", borderRadius: 12, background: "var(--bg)",
    overflow: "hidden", ...style
  }}>{children}</div>;
}
function CrdHeader({ children }) {
  return <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>{children}</div>;
}
function CrdBody({ children }) {
  return <div style={{ padding: "16px 20px" }}>{children}</div>;
}
function CrdFooter({ children }) {
  return <div style={{ padding: "12px 20px", borderTop: "1px solid var(--border)", background: "var(--muted)" }}>{children}</div>;
}
function CrdTitle({ children }) {
  return <div style={{ fontWeight: 700, fontSize: 15, color: "var(--fg)", marginBottom: 2 }}>{children}</div>;
}
function CrdDesc({ children }) {
  return <div style={{ fontSize: 12.5, color: "var(--muted-fg)" }}>{children}</div>;
}

// Tabs
function TabsRoot({ tabs, defaultTab }) {
  const [active, setActive] = useState(defaultTab || tabs[0]?.id);
  return <div>
    <div style={{ display: "flex", gap: 0, borderBottom: "1px solid var(--border)", marginBottom: 16 }}>
      {tabs.map(t => <button key={t.id} onClick={() => setActive(t.id)} style={{
        padding: "8px 16px", fontSize: 13, fontWeight: active === t.id ? 600 : 400, cursor: "pointer",
        border: "none", background: "transparent", color: active === t.id ? "var(--fg)" : "var(--muted-fg)",
        borderBottom: `2px solid ${active === t.id ? "var(--accent)" : "transparent"}`,
        marginBottom: -1, transition: "all .15s"
      }}>
        {t.label}
      </button>)}
    </div>
    {tabs.find(t => t.id === active)?.content}
  </div>;
}

// Accordion
function Acc({ items }) {
  const [open, setOpen] = useState(null);
  return <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
    {items.map((item, i) => <div key={i} style={{ borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none" }}>
      <button onClick={() => setOpen(open === i ? null : i)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer",
        color: "var(--fg)", fontSize: 14, fontWeight: 500, textAlign: "left"
      }}>
        {item.title}
        <ChevronDown size={16} style={{
          transition: ".2s", transform: open === i ? "rotate(180deg)" : "none",
          color: "var(--muted-fg)", flexShrink: 0
        }} />
      </button>
      {open === i && <div style={{ padding: "0 16px 14px", fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>{item.content}</div>}
    </div>)}
  </div>;
}

// Tooltip wrapper
function Tip({ label, children }) {
  const [show, setShow] = useState(false);
  return <div style={{ position: "relative", display: "inline-flex" }}
    onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
    {children}
    {show && <div style={{
      position: "absolute", bottom: "calc(100% + 6px)", left: "50%", transform: "translateX(-50%)",
      background: "var(--fg)", color: "var(--bg)", fontSize: 11, fontWeight: 500, padding: "4px 8px",
      borderRadius: 6, whiteSpace: "nowrap", pointerEvents: "none", zIndex: 999,
      boxShadow: "0 4px 12px rgba(0,0,0,.2)"
    }}>{label}</div>}
  </div>;
}

// Dialog
function Dlg({ open, onClose, title, children, footer }) {
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.6)", backdropFilter: "blur(4px)" }} />
    <div style={{
      position: "relative", background: "var(--bg)", borderRadius: 14, border: "1px solid var(--border)",
      padding: 24, width: "min(440px,90%)", boxShadow: "0 24px 64px rgba(0,0,0,.3)", zIndex: 1
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
        <button onClick={onClose} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--muted-fg)", padding: 4, borderRadius: 6
        }}><X size={16} /></button>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.6, marginBottom: 20 }}>{children}</div>
      {footer && <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>{footer}</div>}
    </div>
  </div>;
}

// Sheet
function Sht({ open, onClose, side = "right", title, children }) {
  const pos = {
    right: { right: 0, top: 0, bottom: 0, width: 320 }, left: { left: 0, top: 0, bottom: 0, width: 320 },
    bottom: { bottom: 0, left: 0, right: 0, height: 360 }, top: { top: 0, left: 0, right: 0, height: 360 }
  };
  if (!open) return null;
  return <div style={{ position: "fixed", inset: 0, zIndex: 999 }}>
    <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,.5)", backdropFilter: "blur(4px)" }} />
    <div style={{
      position: "absolute", ...pos[side], background: "var(--bg)", borderLeft: side === "right" ? "1px solid var(--border)" : "none",
      borderRight: side === "left" ? "1px solid var(--border)" : "none",
      borderTop: side === "bottom" ? "1px solid var(--border)" : "none", padding: 24, zIndex: 1,
      display: "flex", flexDirection: "column", gap: 16
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 4 }}><X size={16} /></button>
      </div>
      <div style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>{children}</div>
    </div>
  </div>;
}

// Dropdown Menu
function DdMenu({ trigger, items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
    <div onClick={() => setOpen(o => !o)}>{trigger}</div>
    {open && <div style={{
      position: "absolute", top: "calc(100% + 4px)", left: 0, zIndex: 100,
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
      boxShadow: "0 8px 24px rgba(0,0,0,.15)", minWidth: 180, overflow: "hidden", padding: "4px 0"
    }}>
      {items.map((item, i) => item.separator
        ? <div key={i} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
        : <button key={i} onClick={() => { item.onClick?.(); setOpen(false); }} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px",
          background: "none", border: "none", cursor: item.disabled ? "not-allowed" : "pointer",
          fontSize: 13, color: item.destructive ? "#ef4444" : item.disabled ? "var(--muted-fg)" : "var(--fg)",
          textAlign: "left", opacity: item.disabled ? 0.5 : 1
        }}>
          {item.icon && <span style={{ color: "var(--muted-fg)" }}>{item.icon}</span>}
          {item.label}
          {item.shortcut && <span style={{ marginLeft: "auto", fontSize: 11, color: "var(--muted-fg)" }}>{item.shortcut}</span>}
        </button>
      )}
    </div>}
  </div>;
}

// Popover
function Ppvr({ trigger, children, title }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  return <div ref={ref} style={{ position: "relative", display: "inline-block" }}>
    <div onClick={() => setOpen(o => !o)}>{trigger}</div>
    {open && <div style={{
      position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 100,
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,.15)", padding: 16, minWidth: 220
    }}>
      {title && <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--fg)" }}>{title}</div>}
      {children}
    </div>}
  </div>;
}

// Hover Card
function HvrCard({ trigger, children }) {
  const [show, setShow] = useState(false);
  return <div style={{ position: "relative", display: "inline-block" }}
    onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
    {trigger}
    {show && <div style={{
      position: "absolute", top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)",
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
      boxShadow: "0 8px 32px rgba(0,0,0,.15)", padding: 16, minWidth: 260, zIndex: 100
    }}>
      {children}
    </div>}
  </div>;
}

// Table
function Tbl({ columns, rows }) {
  return <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
      <thead>
        <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
          {columns.map(c => <th key={c.key} style={{
            padding: "10px 14px", textAlign: "left",
            fontWeight: 600, color: "var(--muted-fg)", fontSize: 11.5, textTransform: "uppercase", letterSpacing: ".04em"
          }}>{c.label}</th>)}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => <tr key={i} style={{
          borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
          background: i % 2 === 0 ? "var(--bg)" : "var(--muted)"
        }}>
          {columns.map(c => <td key={c.key} style={{ padding: "10px 14px", color: "var(--fg)" }}>{row[c.key]}</td>)}
        </tr>)}
      </tbody>
    </table>
  </div>;
}

// Breadcrumb
function Brd({ items }) {
  return <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, flexWrap: "wrap" }}>
    {items.map((item, i) => <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {i > 0 && <ChevronRight size={13} style={{ color: "var(--muted-fg)" }} />}
      {i < items.length - 1
        ? <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--muted-fg)", textDecoration: "none" }}>{item}</a>
        : <span style={{ color: "var(--fg)", fontWeight: 500 }}>{item}</span>}
    </span>)}
  </nav>;
}

// Pagination
function Pgn({ total = 10, current = 1, onChange }) {
  return <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
    <button onClick={() => onChange(Math.max(1, current - 1))} disabled={current === 1}
      style={{
        padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent",
        cursor: current === 1 ? "not-allowed" : "pointer", color: "var(--muted-fg)", opacity: current === 1 ? 0.4 : 1
      }}>
      <ChevronLeft size={14} />
    </button>
    {Array.from({ length: Math.min(5, total) }, (_, i) => i + Math.max(1, current - 2)).filter(n => n <= total).map(n => (
      <button key={n} onClick={() => onChange(n)} style={{
        width: 32, height: 32, borderRadius: 6,
        border: `1px solid ${n === current ? "var(--accent)" : "var(--border)"}`,
        background: n === current ? "var(--accent)" : "transparent",
        color: n === current ? "#fff" : "var(--fg)", cursor: "pointer", fontSize: 13, fontWeight: n === current ? 600 : 400
      }}>{n}</button>
    ))}
    <button onClick={() => onChange(Math.min(total, current + 1))} disabled={current === total}
      style={{
        padding: "6px 10px", borderRadius: 6, border: "1px solid var(--border)", background: "transparent",
        cursor: current === total ? "not-allowed" : "pointer", color: "var(--muted-fg)", opacity: current === total ? 0.4 : 1
      }}>
      <ChevronRight size={14} />
    </button>
  </div>;
}

// Command palette
function Cmd({ placeholder = "Type a command…" }) {
  const [q, setQ] = useState("");
  const cmds = [
    { group: "Navigation", items: [{ icon: <Home size={14} />, label: "Go to Dashboard" }, { icon: <FileText size={14} />, label: "Open Documentation" }] },
    { group: "Actions", items: [{ icon: <Plus size={14} />, label: "Create New Component" }, { icon: <Upload size={14} />, label: "Import Component" }, { icon: <Trash2 size={14} />, label: "Delete Selected", destructive: true }] },
    { group: "Settings", items: [{ icon: <Settings size={14} />, label: "Preferences" }, { icon: <Bell size={14} />, label: "Notifications" }] },
  ];
  const filtered = cmds.map(g => ({ ...g, items: g.items.filter(i => i.label.toLowerCase().includes(q.toLowerCase())) })).filter(g => g.items.length > 0);
  return <div style={{ background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", width: "100%", maxWidth: 400 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderBottom: "1px solid var(--border)" }}>
      <Search size={15} style={{ color: "var(--muted-fg)", flexShrink: 0 }} />
      <input value={q} onChange={e => setQ(e.target.value)} placeholder={placeholder}
        style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "var(--fg)", fontFamily: "inherit" }} />
    </div>
    <div style={{ maxHeight: 280, overflowY: "auto", padding: "4px 0" }}>
      {filtered.length === 0 ? <div style={{ padding: "24px", textAlign: "center", fontSize: 13, color: "var(--muted-fg)" }}>No results found.</div>
        : filtered.map(g => <div key={g.group}>
          <div style={{ padding: "6px 14px 2px", fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em" }}>{g.group}</div>
          {g.items.map((item, i) => <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10, padding: "8px 14px", cursor: "pointer", fontSize: 13,
            color: item.destructive ? "#ef4444" : "var(--fg)"
          }}
            onMouseEnter={e => e.currentTarget.style.background = "var(--muted)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
            <span style={{ color: item.destructive ? "#ef4444" : "var(--muted-fg)" }}>{item.icon}</span>
            {item.label}
          </div>)}
        </div>)}
    </div>
  </div>;
}

// Toggle
function Tgl({ pressed, onToggle, children }) {
  return <button onClick={onToggle} style={{
    padding: "7px 14px", borderRadius: 7, border: "1px solid var(--border)", fontFamily: "inherit",
    fontSize: 13, fontWeight: 500, cursor: "pointer", transition: "all .15s",
    background: pressed ? "var(--fg)" : "transparent",
    color: pressed ? "var(--bg)" : "var(--fg)"
  }}>
    {children}
  </button>;
}

// Calendar mini
function CalMini() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [sel, setSel] = useState(now.getDate());
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));
  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };
  return <div style={{
    display: "inline-block", background: "var(--bg)", border: "1px solid var(--border)",
    borderRadius: 12, padding: 16, userSelect: "none", minWidth: 240
  }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
      <button onClick={prev} style={{
        background: "none", border: "1px solid var(--border)", borderRadius: 6,
        cursor: "pointer", padding: "3px 7px", color: "var(--fg)"
      }}><ChevronLeft size={13} /></button>
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{months[month]} {year}</span>
      <button onClick={next} style={{
        background: "none", border: "1px solid var(--border)", borderRadius: 6,
        cursor: "pointer", padding: "3px 7px", color: "var(--fg)"
      }}><ChevronRight size={13} /></button>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
      {days.map(d => <div key={d} style={{
        textAlign: "center", fontSize: 11, fontWeight: 600,
        color: "var(--muted-fg)", padding: "4px 0"
      }}>{d}</div>)}
      {cells.map((d, i) => <div key={i} onClick={() => d && setSel(d)}
        style={{
          textAlign: "center", fontSize: 12, padding: "5px 0", borderRadius: 6, cursor: d ? "pointer" : "default",
          background: d === sel && month === now.getMonth() ? "var(--accent)" : "transparent",
          color: d === sel && month === now.getMonth() ? "#fff" : d ? "var(--fg)" : "transparent",
          fontWeight: d === sel ? "700" : "400"
        }}>{d}</div>)}
    </div>
  </div>;
}

// Collapsible
function Collapsible({ trigger, children }) {
  const [open, setOpen] = useState(false);
  return <div style={{ border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
    <button onClick={() => setOpen(o => !o)} style={{
      width: "100%", display: "flex", alignItems: "center",
      justifyContent: "space-between", padding: "12px 16px", background: "var(--muted)", border: "none",
      cursor: "pointer", color: "var(--fg)", fontSize: 13, fontWeight: 500, textAlign: "left"
    }}>
      {trigger}
      <ChevronDown size={15} style={{ transition: ".2s", transform: open ? "rotate(180deg)" : "none", color: "var(--muted-fg)" }} />
    </button>
    {open && <div style={{ padding: 16, fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.7 }}>{children}</div>}
  </div>;
}

// Scroll area
function ScrollBox({ children, height = 160 }) {
  return <div style={{
    height, overflowY: "auto", border: "1px solid var(--border)", borderRadius: 8, padding: 12,
    scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent"
  }}>{children}</div>;
}

// Context menu
function CtxMenu({ children, items }) {
  const [pos, setPos] = useState(null);
  const ref = useRef();
  useEffect(() => {
    const h = () => setPos(null);
    document.addEventListener("click", h); return () => document.removeEventListener("click", h);
  }, []);
  return <div ref={ref} onContextMenu={e => { e.preventDefault(); setPos({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }); }}>
    {children}
    {pos && <div style={{
      position: "absolute", left: pos.x, top: pos.y, zIndex: 200,
      background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
      boxShadow: "0 8px 24px rgba(0,0,0,.15)", minWidth: 160, overflow: "hidden", padding: "4px 0"
    }}>
      {items.map((item, i) => item.separator
        ? <div key={i} style={{ height: 1, background: "var(--border)", margin: "4px 0" }} />
        : <button key={i} onClick={() => { item.onClick?.(); setPos(null); }} style={{
          width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "7px 12px",
          background: "none", border: "none", cursor: "pointer", fontSize: 12.5,
          color: item.destructive ? "#ef4444" : "var(--fg)", textAlign: "left"
        }}>
          {item.icon && <span style={{ color: "var(--muted-fg)" }}>{item.icon}</span>}
          {item.label}
        </button>)}
    </div>}
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   CODE BLOCK
═══════════════════════════════════════════════════════════ */
function CodeBlock({ code, filename, language = "tsx" }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(code).catch(() => { }); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  const hi = (line) => line
    .replace(/(&lt;|<)(\/?)([A-Z][A-Za-z]*)/g, (_, lt, sl, tag) => `${lt}${sl}<span style="color:#7dd3fc">${tag}</span>`)
    .replace(/\b(import|from|const|let|return|export|default|async|await|function|true|false|null)\b/g, '<span style="color:#c084fc">$1</span>')
    .replace(/(["'`])([^"'`\n]*)\1/g, '<span style="color:#86efac">$1$2$1</span>')
    .replace(/\b(variant|size|disabled|className|onClick|asChild|value|onChange|checked|placeholder)=/g, '<span style="color:#fda4af">$1</span>=')
    .replace(/\/\/.*/g, '<span style="color:#6b7280;font-style:italic">$&</span>');
  return <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, overflow: "hidden", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
    <div style={{ display: "flex", alignItems: "center", borderBottom: "1px solid #27272a", padding: "0 8px 0 16px", minHeight: 40 }}>
      {filename && <span style={{ fontSize: 12, color: "#71717a", fontFamily: "inherit", flex: 1 }}>{filename}</span>}
      <button onClick={copy} style={{
        marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
        background: "transparent", border: "1px solid #3f3f46", borderRadius: 5,
        padding: "4px 10px", cursor: "pointer", color: copied ? "#a1a1aa" : "#71717a",
        fontSize: 11, fontFamily: "inherit", transition: "all .15s", margin: "6px 0",
      }}>
        {copied ? <Check size={11} /> : <Copy size={11} />}{copied ? "Copied!" : "Copy"}
      </button>
    </div>
    <pre style={{ margin: 0, padding: "16px 20px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, fontFamily: "inherit" }}>
      {code.split("\n").map((line, i) => (
        <div key={i} style={{ display: "flex" }}>
          <span style={{ minWidth: 28, color: "#3f3f46", userSelect: "none", textAlign: "right", marginRight: 20, flexShrink: 0 }}>{i + 1}</span>
          <span style={{ color: "#e4e4e7" }} dangerouslySetInnerHTML={{ __html: hi(line) || " " }} />
        </div>
      ))}
    </pre>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENT PREVIEW
═══════════════════════════════════════════════════════════ */
function Preview({ title, code, filename, children, height = 160 }) {
  const [tab, setTab] = useState("preview");
  const [vp, setVp] = useState("full");
  const [dark, setDark] = useState(false);
  const vpW = VIEWPORTS.find(v => v.id === vp)?.w || "100%";
  const tabS = (a) => ({
    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
    borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
    background: tab === a ? "var(--bg)" : "transparent", color: tab === a ? "var(--fg)" : "var(--muted-fg)",
    boxShadow: tab === a ? "0 1px 3px rgba(0,0,0,.12)" : "none", transition: "all .12s"
  });
  return <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", marginBottom: 20 }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "6px 10px", background: "var(--muted)", borderBottom: "1px solid var(--border)"
    }}>
      <span style={{ fontSize: 11, color: "var(--muted-fg)", fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{title}</span>
      <div style={{ display: "flex", gap: 2 }}>
        {["preview", "code"].map(t => (
          <button key={t} style={tabS(t)} onClick={() => setTab(t)}>
            {t === "preview" ? <Eye size={11} /> : <Code2 size={11} />}{t === "preview" ? "Preview" : "Code"}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
        {VIEWPORTS.map(v => (
          <button key={v.id} onClick={() => setVp(v.id)} title={v.w}
            style={{
              width: 24, height: 24, borderRadius: 5, border: "none", cursor: "pointer",
              background: vp === v.id ? "var(--bg)" : "transparent", color: vp === v.id ? "var(--fg)" : "var(--muted-fg)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: vp === v.id ? "0 1px 3px rgba(0,0,0,.12)" : "none"
            }}>
            <v.Icon size={11} />
          </button>
        ))}
        <div style={{ width: 1, height: 14, background: "var(--border)", margin: "0 3px" }} />
        <button onClick={() => setDark(d => !d)} title="Toggle preview bg"
          style={{
            width: 24, height: 24, borderRadius: 5, border: "none", cursor: "pointer",
            background: dark ? "#18181b" : "transparent", color: dark ? "#a1a1aa" : "var(--muted-fg)",
            display: "inline-flex", alignItems: "center", justifyContent: "center"
          }}>
          {dark ? <Moon size={11} /> : <Sun size={11} />}
        </button>
      </div>
    </div>
    {tab === "preview"
      ? <div style={{
        background: dark ? "#09090b" : "var(--bg)", padding: 16, minHeight: height,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background .2s"
      }}>
        <div style={{
          maxWidth: vpW, width: "100%", transition: "max-width .3s",
          border: vp !== "full" && vp !== "desktop" ? "1px dashed var(--border)" : "none", borderRadius: 8
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
            gap: 10, padding: "16px", minHeight: height
          }}>
            {children}
          </div>
        </div>
      </div>
      : <CodeBlock code={code} filename={filename} />}
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   PROPS TABLE
═══════════════════════════════════════════════════════════ */
function PropsTable({ props }) {
  return <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
      <thead>
        <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
          {["Prop", "Type", "Default", "Description"].map(h => (
            <th key={h} style={{
              padding: "8px 14px", textAlign: "left", fontWeight: 600,
              color: "var(--muted-fg)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".04em"
            }}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {props.map((p, i) => (
          <tr key={p.name} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--muted)", borderBottom: "1px solid var(--border)" }}>
            <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
              <code style={{ fontFamily: "monospace", fontWeight: 700, color: "#a78bfa", fontSize: 12 }}>{p.name}</code>
              {p.required && <span style={{ color: "#ef4444", marginLeft: 2 }}>*</span>}
            </td>
            <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
              <code style={{ fontFamily: "monospace", color: "#38bdf8", fontSize: 11, wordBreak: "break-word" }}>{p.type}</code>
            </td>
            <td style={{ padding: "8px 14px", verticalAlign: "top" }}>
              <code style={{ fontFamily: "monospace", color: "var(--muted-fg)", fontSize: 11 }}>{p.def || "—"}</code>
            </td>
            <td style={{ padding: "8px 14px", verticalAlign: "top", color: "var(--muted-fg)", lineHeight: 1.5 }}>{p.desc}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   DOC HELPERS
═══════════════════════════════════════════════════════════ */
function DocPage({ title, subtitle, sourceSlug, children }) {
  return <div>
    <div style={{ marginBottom: 28 }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "var(--fg)", letterSpacing: "-.02em" }}>{title}</h1>
        {sourceSlug && <a href={`https://ui.shadcn.com/docs/components/${sourceSlug}`} target="_blank" rel="noreferrer"
          style={{ fontSize: 11.5, color: "var(--muted-fg)", textDecoration: "underline", marginTop: 6, whiteSpace: "nowrap", flexShrink: 0 }}>
          Shadcn docs ↗</a>}
      </div>
      {subtitle && <p style={{ margin: "0 0 16px", fontSize: 14, color: "var(--muted-fg)", lineHeight: 1.7, maxWidth: 540 }}>{subtitle}</p>}
      <div style={{ height: 1, background: "var(--border)" }} />
    </div>
    {children}
  </div>;
}
function DocSection({ title, desc, children }) {
  return <section style={{ marginBottom: 28 }}>
    <h2 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "var(--fg)" }}>{title}</h2>
    {desc && <p style={{ margin: "0 0 12px", fontSize: 13, color: "var(--muted-fg)" }}>{desc}</p>}
    {children}
  </section>;
}
function Callout({ variant = "info", children }) {
  const map = {
    info: { bg: "rgba(56,189,248,.08)", border: "rgba(56,189,248,.3)", color: "#38bdf8", Icon: Info },
    warning: { bg: "rgba(245,158,11,.08)", border: "rgba(245,158,11,.3)", color: "#f59e0b", Icon: AlertTriangle },
    success: { bg: "rgba(52,211,153,.08)", border: "rgba(52,211,153,.3)", color: "#34d399", Icon: CheckCircle2 },
    danger: { bg: "rgba(239,68,68,.08)", border: "rgba(239,68,68,.3)", color: "#ef4444", Icon: XCircle },
  }[variant];
  return <div style={{
    display: "flex", gap: 10, padding: "10px 14px", borderRadius: 8,
    border: `1px solid ${map.border}`, background: map.bg, fontSize: 13, marginBottom: 16
  }}>
    <map.Icon size={15} style={{ color: map.color, marginTop: 1, flexShrink: 0 }} />
    <span style={{ lineHeight: 1.6, color: "var(--fg)" }}>{children}</span>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   ALL COMPONENT PAGES
═══════════════════════════════════════════════════════════ */
function PageButton() {
  const [loading, setLoading] = useState(false);
  return <DocPage title="Button" subtitle="Triggers an action or event — submit a form, open a dialog, or navigate." sourceSlug="button">
    <DocSection title="Variants">
      <Preview title="All variants" code={`<Button variant="default">Default</Button>\n<Button variant="secondary">Secondary</Button>\n<Button variant="outline">Outline</Button>\n<Button variant="ghost">Ghost</Button>\n<Button variant="link">Link</Button>\n<Button variant="destructive">Destructive</Button>`} filename="button-variants.tsx">
        {["default", "secondary", "outline", "ghost", "link", "destructive"].map(v => (
          <Btn key={v} variant={v}>{v.charAt(0).toUpperCase() + v.slice(1)}</Btn>
        ))}
      </Preview>
    </DocSection>
    <DocSection title="Sizes">
      <Preview title="All sizes" code={`<Button size="lg">Large</Button>\n<Button size="default">Default</Button>\n<Button size="sm">Small</Button>\n<Button size="icon"><ChevronRight /></Button>`} filename="button-sizes.tsx">
        <Btn size="lg">Large</Btn><Btn>Default</Btn><Btn size="sm">Small</Btn>
        <Btn size="icon"><ChevronRight size={14} /></Btn>
      </Preview>
    </DocSection>
    <DocSection title="With Icons">
      <Preview title="Icon buttons" code={`<Button><Mail className="mr-2 h-4 w-4" />Login with Email</Button>\n<Button variant="outline">Learn more<ArrowRight className="ml-2 h-4 w-4" /></Button>`}>
        <Btn><Mail size={14} style={{ marginRight: 6 }} />Login with Email</Btn>
        <Btn variant="outline">Learn more<ArrowRight size={14} style={{ marginLeft: 6 }} /></Btn>
      </Preview>
    </DocSection>
    <DocSection title="Loading State">
      <Callout variant="info">Always set <code style={{ fontFamily: "monospace", fontSize: 11 }}>disabled</code> while loading to prevent duplicate submissions.</Callout>
      <Preview title="Loading" code={`<Button disabled>\n  <Loader2 className="mr-2 h-4 w-4 animate-spin" />\n  Please wait\n</Button>`}>
        <Btn disabled={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
          {loading && <Loader2 size={14} style={{ marginRight: 6, animation: "spin 1s linear infinite" }} />}
          {loading ? "Please wait…" : "Click to simulate load"}
        </Btn>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "variant", type: '"default"|"destructive"|"outline"|"secondary"|"ghost"|"link"', def: '"default"', desc: "Visual style of the button." },
        { name: "size", type: '"default"|"sm"|"lg"|"icon"', def: '"default"', desc: "Size variant." },
        { name: "asChild", type: "boolean", def: "false", desc: "Merge props onto child element instead of rendering a <button>." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables interaction and adds aria-disabled." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageInput() {
  const [v, setV] = useState("");
  return <DocPage title="Input" subtitle="Displays a form input field for text entry." sourceSlug="input">
    <DocSection title="Default">
      <Preview title="Text input" code={`<Input type="text" placeholder="Email" />`}>
        <div style={{ width: 260 }}><Inp placeholder="Email" value={v} onChange={e => setV(e.target.value)} /></div>
      </Preview>
    </DocSection>
    <DocSection title="With Label">
      <Preview title="Labelled input" code={`<div className="grid gap-1.5">\n  <Label htmlFor="email">Email</Label>\n  <Input id="email" type="email" placeholder="m@example.com" />\n</div>`}>
        <div style={{ width: 260 }}>
          <Lbl>Email</Lbl><Inp type="email" placeholder="m@example.com" />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Disabled">
      <Preview title="Disabled" code={`<Input disabled placeholder="Disabled input" />`}>
        <div style={{ width: 260 }}><Inp placeholder="Disabled input" disabled /></div>
      </Preview>
    </DocSection>
    <DocSection title="Types">
      <Preview title="Input types" code={`<Input type="text" placeholder="Text" />\n<Input type="password" placeholder="Password" />\n<Input type="number" placeholder="Number" />`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 260 }}>
          <Inp placeholder="Text" /><Inp type="password" placeholder="Password" /><Inp type="number" placeholder="Number" />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "type", type: "string", def: '"text"', desc: "HTML input type attribute." },
        { name: "placeholder", type: "string", desc: "Placeholder text shown when empty." },
        { name: "value", type: "string", desc: "Controlled value." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the input." },
        { name: "onChange", type: "React.ChangeEventHandler", desc: "Change event handler." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageTextarea() {
  return <DocPage title="Textarea" subtitle="Displays a multi-line text input field." sourceSlug="textarea">
    <DocSection title="Default">
      <Preview title="Textarea" code={`<Textarea placeholder="Type your message here." />`}>
        <div style={{ width: 280 }}><Tarea placeholder="Type your message here." /></div>
      </Preview>
    </DocSection>
    <DocSection title="With Label">
      <Preview title="Labelled textarea" code={`<div className="grid gap-1.5">\n  <Label htmlFor="message">Your Message</Label>\n  <Textarea id="message" placeholder="Type your message here." />\n</div>`}>
        <div style={{ width: 280 }}><Lbl>Your Message</Lbl><Tarea placeholder="Type your message here." /></div>
      </Preview>
    </DocSection>
    <DocSection title="Disabled">
      <Preview title="Disabled" code={`<Textarea disabled placeholder="Disabled textarea" />`}>
        <div style={{ width: 280 }}><Tarea placeholder="Disabled textarea" disabled /></div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "placeholder", type: "string", desc: "Placeholder text." },
        { name: "rows", type: "number", def: "3", desc: "Number of visible text lines." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the textarea." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageLabel() {
  return <DocPage title="Label" subtitle="Renders an accessible label for a form control." sourceSlug="label">
    <DocSection title="Default">
      <Preview title="Label + Input" code={`<div className="grid gap-1.5">\n  <Label htmlFor="name">Full Name</Label>\n  <Input id="name" placeholder="Your name" />\n</div>`}>
        <div style={{ width: 260 }}><Lbl>Full Name</Lbl><Inp placeholder="Your name" /></div>
      </Preview>
    </DocSection>
    <DocSection title="With Checkbox">
      <Preview title="Label + Checkbox" code={`<div className="flex items-center gap-2">\n  <Checkbox id="terms" />\n  <Label htmlFor="terms">Accept terms and conditions</Label>\n</div>`}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Cbx checked={false} onChange={() => { }} />
          <Lbl style={{ marginBottom: 0 }}>Accept terms and conditions</Lbl>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "htmlFor", type: "string", desc: "ID of the associated form element." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
        { name: "children", type: "ReactNode", required: true, desc: "Label text content." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSelect() {
  const [v, setV] = useState("");
  const opts = [{ value: "apple", label: "Apple" }, { value: "banana", label: "Banana" }, { value: "blueberry", label: "Blueberry" }, { value: "grapes", label: "Grapes" }, { value: "pineapple", label: "Pineapple" }];
  return <DocPage title="Select" subtitle="Displays a list of options for the user to pick from." sourceSlug="select">
    <DocSection title="Default">
      <Preview title="Select" code={`<Select>\n  <SelectTrigger>\n    <SelectValue placeholder="Select a fruit" />\n  </SelectTrigger>\n  <SelectContent>\n    <SelectItem value="apple">Apple</SelectItem>\n    <SelectItem value="banana">Banana</SelectItem>\n    <SelectItem value="blueberry">Blueberry</SelectItem>\n  </SelectContent>\n</Select>`}>
        <div style={{ width: 200 }}><Sel options={opts} value={v} onChange={setV} placeholder="Select a fruit" /></div>
      </Preview>
    </DocSection>
    <DocSection title="With Label">
      <Preview title="Labelled select" code={`<div className="grid gap-1.5">\n  <Label>Favourite fruit</Label>\n  <Select>\n    <SelectTrigger>\n      <SelectValue placeholder="Pick one…" />\n    </SelectTrigger>\n  </Select>\n</div>`}>
        <div style={{ width: 200 }}><Lbl>Favourite fruit</Lbl><Sel options={opts} value={v} onChange={setV} placeholder="Pick one…" /></div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "string", desc: "Controlled selected value." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback when selection changes." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the select." },
        { name: "placeholder", type: "string", desc: "Placeholder shown when nothing is selected." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageCheckbox() {
  const [a, setA] = useState(false); const [b, setB] = useState(true); const [c_, setC] = useState(false);
  return <DocPage title="Checkbox" subtitle="A control that allows the user to toggle between checked and unchecked states." sourceSlug="checkbox">
    <DocSection title="Default">
      <Preview title="Checkbox" code={`<div className="flex items-center space-x-2">\n  <Checkbox id="terms" />\n  <Label htmlFor="terms">Accept terms</Label>\n</div>`}>
        <Cbx checked={a} onChange={setA} label="Accept terms and conditions" />
      </Preview>
    </DocSection>
    <DocSection title="Checked by Default">
      <Preview title="Pre-checked" code={`<Checkbox defaultChecked />`}>
        <Cbx checked={b} onChange={setB} label="Receive newsletter" />
      </Preview>
    </DocSection>
    <DocSection title="Disabled">
      <Preview title="Disabled" code={`<Checkbox disabled />`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <Cbx checked={false} onChange={() => { }} label="Disabled unchecked" disabled />
          <Cbx checked={true} onChange={() => { }} label="Disabled checked" disabled />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "checked", type: "boolean", desc: "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", def: "false", desc: "Initial checked state (uncontrolled)." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the checkbox." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "Callback on state change." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageRadioGroup() {
  const [v, setV] = useState("option1");
  const opts = [{ v: "option1", l: "Default" }, { v: "option2", l: "Comfortable" }, { v: "option3", l: "Compact" }];
  return <DocPage title="Radio Group" subtitle="A set of checkable buttons — only one can be checked at a time." sourceSlug="radio-group">
    <DocSection title="Default">
      <Preview title="Radio Group" code={`<RadioGroup defaultValue="option1">\n  <RadioGroupItem value="option1" id="r1" /><Label htmlFor="r1">Default</Label>\n  <RadioGroupItem value="option2" id="r2" /><Label htmlFor="r2">Comfortable</Label>\n  <RadioGroupItem value="option3" id="r3" /><Label htmlFor="r3">Compact</Label>\n</RadioGroup>`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {opts.map(o => <Rdo key={o.v} checked={v === o.v} onChange={() => setV(o.v)} label={o.l} />)}
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "string", desc: "Controlled selected value." },
        { name: "defaultValue", type: "string", desc: "Initial value (uncontrolled)." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback when selection changes." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables all radio items in the group." },
        { name: "orientation", type: '"horizontal"|"vertical"', def: '"vertical"', desc: "Orientation of the group." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSwitch() {
  const [a, setA] = useState(false); const [b, setB] = useState(true);
  return <DocPage title="Switch" subtitle="A control that allows the user to toggle between on and off states." sourceSlug="switch">
    <DocSection title="Default">
      <Preview title="Switch" code={`<Switch />`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Swt checked={a} onChange={setA} label="Airplane Mode" />
          <Swt checked={b} onChange={setB} label="Dark Mode" />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Disabled">
      <Preview title="Disabled" code={`<Switch disabled />`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Swt checked={false} onChange={() => { }} label="Disabled off" disabled />
          <Swt checked={true} onChange={() => { }} label="Disabled on" disabled />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "checked", type: "boolean", desc: "Controlled checked state." },
        { name: "defaultChecked", type: "boolean", def: "false", desc: "Initial state (uncontrolled)." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the switch." },
        { name: "onCheckedChange", type: "(checked: boolean) => void", desc: "Callback on toggle." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSlider() {
  const [v, setV] = useState(33); const [r, setR] = useState([20, 80]);
  return <DocPage title="Slider" subtitle="An input where the user selects a value from within a given range." sourceSlug="slider">
    <DocSection title="Default">
      <Preview title="Slider" code={`<Slider defaultValue={[33]} max={100} step={1} />`}>
        <div style={{ width: 280 }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: "var(--muted-fg)" }}>Value: {v}</div>
          <Sldr value={v} onChange={setV} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="With Steps">
      <Preview title="Step slider" code={`<Slider defaultValue={[50]} max={100} step={10} />`}>
        <div style={{ width: 280 }}>
          <div style={{ marginBottom: 8, fontSize: 12, color: "var(--muted-fg)" }}>Value: {v} (step: 10)</div>
          <Sldr value={Math.round(v / 10) * 10} onChange={v => setV(Math.round(v / 10) * 10)} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "number[]", desc: "Controlled value(s)." },
        { name: "defaultValue", type: "number[]", desc: "Initial value(s) (uncontrolled)." },
        { name: "min", type: "number", def: "0", desc: "Minimum value." },
        { name: "max", type: "number", def: "100", desc: "Maximum value." },
        { name: "step", type: "number", def: "1", desc: "Increment step." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the slider." },
        { name: "onValueChange", type: "(value: number[]) => void", desc: "Callback on change." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageToggle() {
  const [p, setP] = useState(false); const [bold, setBold] = useState(false); const [ital, setItal] = useState(true); const [under, setUnder] = useState(false);
  return <DocPage title="Toggle" subtitle="A two-state button that can be either on or off." sourceSlug="toggle">
    <DocSection title="Default">
      <Preview title="Toggle" code={`<Toggle>Toggle</Toggle>`}>
        <Tgl pressed={p} onToggle={() => setP(v => !v)}>Toggle</Tgl>
      </Preview>
    </DocSection>
    <DocSection title="Text Formatting">
      <Preview title="Formatting group" code={`<Toggle aria-label="Bold"><Bold /></Toggle>\n<Toggle aria-label="Italic"><Italic /></Toggle>\n<Toggle aria-label="Underline"><Underline /></Toggle>`}>
        <div style={{ display: "flex", gap: 4 }}>
          <Tgl pressed={bold} onToggle={() => setBold(v => !v)}><span style={{ fontWeight: 700, fontSize: 13 }}>B</span></Tgl>
          <Tgl pressed={ital} onToggle={() => setItal(v => !v)}><span style={{ fontStyle: "italic", fontSize: 13 }}>I</span></Tgl>
          <Tgl pressed={under} onToggle={() => setUnder(v => !v)}><span style={{ textDecoration: "underline", fontSize: 13 }}>U</span></Tgl>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "pressed", type: "boolean", desc: "Controlled pressed state." },
        { name: "defaultPressed", type: "boolean", def: "false", desc: "Initial state (uncontrolled)." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the toggle." },
        { name: "onPressedChange", type: "(pressed: boolean) => void", desc: "Callback on state change." },
        { name: "variant", type: '"default"|"outline"', def: '"default"', desc: "Visual style." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageToggleGroup() {
  const [v, setV] = useState("center");
  return <DocPage title="Toggle Group" subtitle="A set of two-state buttons that can be toggled on or off." sourceSlug="toggle-group">
    <DocSection title="Single Selection">
      <Preview title="Alignment group" code={`<ToggleGroup type="single" defaultValue="center">\n  <ToggleGroupItem value="left">Left</ToggleGroupItem>\n  <ToggleGroupItem value="center">Center</ToggleGroupItem>\n  <ToggleGroupItem value="right">Right</ToggleGroupItem>\n</ToggleGroup>`}>
        <div style={{ display: "flex", gap: 2, border: "1px solid var(--border)", borderRadius: 8, padding: 3 }}>
          {["left", "center", "right"].map(a => (
            <button key={a} onClick={() => setV(a)} style={{
              padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: 500, background: v === a ? "var(--fg)" : "transparent", color: v === a ? "var(--bg)" : "var(--muted-fg)",
              transition: "all .15s", textTransform: "capitalize"
            }}>{a}</button>
          ))}
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "type", type: '"single"|"multiple"', required: true, desc: 'Whether one or multiple items can be pressed at a time.' },
        { name: "value", type: "string | string[]", desc: "Controlled value(s)." },
        { name: "defaultValue", type: "string | string[]", desc: "Initial value(s) (uncontrolled)." },
        { name: "onValueChange", type: "(value: string | string[]) => void", desc: "Callback on change." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables all items." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageBadge() {
  return <DocPage title="Badge" subtitle="Displays a small status descriptor for UI elements." sourceSlug="badge">
    <DocSection title="Variants">
      <Preview title="All variants" code={`<Badge variant="default">Default</Badge>\n<Badge variant="secondary">Secondary</Badge>\n<Badge variant="outline">Outline</Badge>\n<Badge variant="destructive">Destructive</Badge>`}>
        <Bdg>Default</Bdg><Bdg variant="secondary">Secondary</Bdg>
        <Bdg variant="outline">Outline</Bdg><Bdg variant="destructive">Destructive</Bdg>
        <Bdg variant="success">Success</Bdg><Bdg variant="warning">Warning</Bdg>
      </Preview>
    </DocSection>
    <DocSection title="With Icons">
      <Preview title="Badge + icon" code={`<Badge><Star className="mr-1 h-3 w-3" />Featured</Badge>`}>
        <Bdg><Star size={10} style={{ marginRight: 4 }} />Featured</Bdg>
        <Bdg variant="secondary"><Bell size={10} style={{ marginRight: 4 }} />3 New</Bdg>
        <Bdg variant="destructive"><AlertCircle size={10} style={{ marginRight: 4 }} />Error</Bdg>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "variant", type: '"default"|"secondary"|"outline"|"destructive"', def: '"default"', desc: "Visual style." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
        { name: "children", type: "ReactNode", required: true, desc: "Badge content." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageAvatar() {
  return <DocPage title="Avatar" subtitle="An image element with a fallback for representing the user." sourceSlug="avatar">
    <DocSection title="Default">
      <Preview title="Avatar with image" code={`<Avatar>\n  <AvatarImage src="https://github.com/shadcn.png" />\n  <AvatarFallback>CN</AvatarFallback>\n</Avatar>`}>
        <Avt src="https://github.com/shadcn.png" fallback="CN" />
      </Preview>
    </DocSection>
    <DocSection title="Fallback">
      <Preview title="Avatar fallback" code={`<Avatar>\n  <AvatarFallback>JD</AvatarFallback>\n</Avatar>`}>
        <Avt fallback="JD" /><Avt fallback="AB" /><Avt fallback="XY" />
      </Preview>
    </DocSection>
    <DocSection title="Sizes">
      <Preview title="Avatar sizes" code={`<Avatar className="h-8 w-8" />\n<Avatar />\n<Avatar className="h-16 w-16" />`}>
        <Avt size={32} fallback="SM" /><Avt size={40} fallback="MD" /><Avt size={56} fallback="LG" /><Avt size={72} fallback="XL" />
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "src", type: "string", desc: "URL for the avatar image." },
        { name: "fallback", type: "string", required: true, desc: "Text shown when image fails to load." },
        { name: "size", type: "number", def: "40", desc: "Width and height in pixels." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageCard() {
  return <DocPage title="Card" subtitle="Displays a card with header, content, and footer." sourceSlug="card">
    <DocSection title="Default">
      <Preview title="Basic card" code={`<Card>\n  <CardHeader>\n    <CardTitle>Card Title</CardTitle>\n    <CardDescription>Card description goes here.</CardDescription>\n  </CardHeader>\n  <CardContent><p>Card content</p></CardContent>\n  <CardFooter><Button>Action</Button></CardFooter>\n</Card>`} height={220}>
        <Crd style={{ width: "100%", maxWidth: 340 }}>
          <CrdHeader><CrdTitle>Create project</CrdTitle><CrdDesc>Deploy your new project in one-click.</CrdDesc></CrdHeader>
          <CrdBody>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div><Lbl>Name</Lbl><Inp placeholder="Project name" /></div>
              <div><Lbl>Framework</Lbl><Sel options={[{ value: "next", label: "Next.js" }, { value: "vite", label: "Vite" }, { value: "remix", label: "Remix" }]} placeholder="Select framework" value="" onChange={() => { }} /></div>
            </div>
          </CrdBody>
          <CrdFooter><div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}><Btn variant="outline">Cancel</Btn><Btn>Deploy</Btn></div></CrdFooter>
        </Crd>
      </Preview>
    </DocSection>
    <DocSection title="Simple">
      <Preview title="Simple card" code={`<Card className="p-4"><CardTitle>Notifications</CardTitle></Card>`} height={140}>
        <Crd style={{ width: "100%", maxWidth: 340, padding: 16 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <Bell size={18} style={{ color: "var(--accent)", marginTop: 2 }} />
            <div>
              <CrdTitle>Push Notifications</CrdTitle>
              <CrdDesc>Send notifications to device.</CrdDesc>
            </div>
            <Swt checked={true} onChange={() => { }} style={{ marginLeft: "auto" }} />
          </div>
        </Crd>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "className", type: "string", desc: "Additional Tailwind classes applied to the card root." },
        { name: "children", type: "ReactNode", required: true, desc: "Card content — use CardHeader, CardContent, CardFooter." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSeparator() {
  return <DocPage title="Separator" subtitle="Visually or semantically separates content." sourceSlug="separator">
    <DocSection title="Horizontal">
      <Preview title="Horizontal" code={`<Separator />`}>
        <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: 12 }}>
          <p style={{ fontSize: 13, color: "var(--fg)" }}>HeartStamp DS</p>
          <Sep />
          <p style={{ fontSize: 12, color: "var(--muted-fg)" }}>Components · Design Tokens · Theming</p>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Vertical">
      <Preview title="Vertical" code={`<Separator orientation="vertical" />`}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, height: 40 }}>
          <span style={{ fontSize: 13, color: "var(--fg)" }}>Blog</span>
          <Sep orientation="vertical" style={{ height: "100%" }} />
          <span style={{ fontSize: 13, color: "var(--fg)" }}>Docs</span>
          <Sep orientation="vertical" style={{ height: "100%" }} />
          <span style={{ fontSize: 13, color: "var(--fg)" }}>Source</span>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "orientation", type: '"horizontal"|"vertical"', def: '"horizontal"', desc: "Orientation of the separator." },
        { name: "decorative", type: "boolean", def: "true", desc: "When true, separator is purely visual (no role='separator')." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageScrollArea() {
  const tags = Array.from({ length: 30 }, (_, i) => `Tag ${i + 1}`);
  return <DocPage title="Scroll Area" subtitle="Augments native scroll functionality for custom, cross-browser styling." sourceSlug="scroll-area">
    <DocSection title="Vertical">
      <Preview title="Vertical scroll" code={`<ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">\n  {items.map(tag => <div key={tag}>{tag}</div>)}\n</ScrollArea>`}>
        <ScrollBox height={180}>
          {tags.map(t => <div key={t} style={{ padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--muted-fg)" }}>{t}</div>)}
        </ScrollBox>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
        { name: "type", type: '"auto"|"always"|"scroll"|"hover"', def: '"hover"', desc: "Controls when the scrollbar is visible." },
        { name: "scrollHideDelay", type: "number", def: "600", desc: "Duration in ms before scrollbar hides (when type is 'scroll' or 'hover')." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageAspectRatio() {
  return <DocPage title="Aspect Ratio" subtitle="Displays content within a desired ratio." sourceSlug="aspect-ratio">
    <DocSection title="16/9">
      <Preview title="16:9 ratio" code={`<AspectRatio ratio={16 / 9}>\n  <img src="..." alt="..." className="rounded-md object-cover" />\n</AspectRatio>`} height={200}>
        <div style={{ width: "100%", maxWidth: 400 }}>
          <div style={{
            aspectRatio: "16/9", background: "var(--muted)", borderRadius: 10, overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--border)"
          }}>
            <div style={{ textAlign: "center", color: "var(--muted-fg)" }}>
              <Monitor size={32} style={{ marginBottom: 8, opacity: .4 }} />
              <div style={{ fontSize: 12 }}>16 / 9</div>
            </div>
          </div>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "ratio", type: "number", def: "1", desc: "The aspect ratio (width / height). E.g. 16/9, 4/3, 1." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageAlert() {
  return <DocPage title="Alert" subtitle="Displays a callout for user attention." sourceSlug="alert">
    <DocSection title="Variants">
      <Preview title="All variants" code={`<Alert>\n  <Terminal className="h-4 w-4" />\n  <AlertTitle>Heads up!</AlertTitle>\n  <AlertDescription>You can add components using the CLI.</AlertDescription>\n</Alert>\n\n<Alert variant="destructive">\n  <AlertCircle className="h-4 w-4" />\n  <AlertTitle>Error</AlertTitle>\n  <AlertDescription>Your session has expired.</AlertDescription>\n</Alert>`} height={220}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 440 }}>
          <Alrt variant="default" title="Heads up!">You can add components to your app using the CLI.</Alrt>
          <Alrt variant="success" title="Success">Component installed successfully.</Alrt>
          <Alrt variant="warning" title="Warning">Your free tier limit is almost reached.</Alrt>
          <Alrt variant="destructive" title="Error">Your session has expired. Please log in again.</Alrt>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "variant", type: '"default"|"destructive"|"success"|"warning"', def: '"default"', desc: "Visual style of the alert." },
        { name: "title", type: "string", desc: "Alert heading text." },
        { name: "children", type: "ReactNode", desc: "Alert body/description content." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageToast() {
  const [toasts, setToasts] = useState([]);
  const add = (type) => {
    const id = Date.now();
    const msgs = {
      default: { title: "Notification", desc: "Your message has been sent.", icon: <Bell size={14} /> },
      success: { title: "Success!", desc: "Component installed successfully.", icon: <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> },
      error: { title: "Something went wrong", desc: "Please try again later.", icon: <XCircle size={14} style={{ color: "#ef4444" }} /> },
      warning: { title: "Warning", desc: "Free tier limit approaching.", icon: <AlertTriangle size={14} style={{ color: "#f59e0b" }} /> }
    };
    const m = msgs[type];
    setToasts(t => [...t, { id, ...m, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return <DocPage title="Toast" subtitle="A succinct message that is displayed temporarily." sourceSlug="toast">
    <DocSection title="Live Demo">
      <Callout variant="info">Click a button to trigger a toast notification.</Callout>
      <Preview title="Toast demo" code={`import { useToast } from "@/hooks/use-toast";\n\nconst { toast } = useToast();\n\ntoast({\n  title: "Scheduled: Catch up",\n  description: "Friday, February 10, 2023 at 5:57 PM",\n});\n\n// With variant:\ntoast({ variant: "destructive", title: "Error", description: "Something went wrong." });`} height={140}>
        <div style={{ position: "relative", zIndex: 0 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
            {[["default", "Default"], ["success", "Success"], ["error", "Destructive"], ["warning", "Warning"]].map(([t, l]) => (
              <Btn key={t} variant="outline" onClick={() => add(t)}>{l}</Btn>
            ))}
          </div>
          <div style={{ position: "fixed", bottom: 20, right: 20, display: "flex", flexDirection: "column", gap: 8, zIndex: 999, maxWidth: 320, pointerEvents: "none" }}>
            {toasts.map(t => (
              <div key={t.id} style={{
                background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                animation: "slideIn .25s ease", display: "flex", alignItems: "flex-start", gap: 10, pointerEvents: "all"
              }}>
                {t.icon}
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-fg)", marginTop: 2 }}>{t.desc}</div></div>
                <button onClick={() => setToasts(ts => ts.filter(x => x.id !== t.id))} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 2 }}><X size={12} /></button>
              </div>
            ))}
          </div>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "title", type: "string", desc: "Toast heading." },
        { name: "description", type: "string", desc: "Toast body text." },
        { name: "variant", type: '"default"|"destructive"', def: '"default"', desc: "Visual style." },
        { name: "duration", type: "number", def: "5000", desc: "Auto-dismiss delay in milliseconds." },
        { name: "action", type: "ToastActionElement", desc: "Optional action button rendered inside the toast." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageAlertDialog() {
  const [open, setOpen] = useState(false);
  return <DocPage title="Alert Dialog" subtitle="A modal dialog that interrupts the user with important content and expects a response." sourceSlug="alert-dialog">
    <DocSection title="Default">
      <Preview title="Alert Dialog" code={`<AlertDialog>\n  <AlertDialogTrigger asChild>\n    <Button variant="outline">Delete account</Button>\n  </AlertDialogTrigger>\n  <AlertDialogContent>\n    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>\n    <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>\n    <AlertDialogCancel>Cancel</AlertDialogCancel>\n    <AlertDialogAction>Continue</AlertDialogAction>\n  </AlertDialogContent>\n</AlertDialog>`} height={120}>
        <Btn variant="destructive" onClick={() => setOpen(true)}>
          <Trash2 size={14} style={{ marginRight: 6 }} />Delete Account
        </Btn>
        <Dlg open={open} onClose={() => setOpen(false)} title="Are you absolutely sure?"
          footer={<><Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn variant="destructive" onClick={() => setOpen(false)}>Yes, delete account</Btn></>}>
          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
        </Dlg>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "defaultOpen", type: "boolean", def: "false", desc: "Initial open state (uncontrolled)." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageDialog() {
  const [open, setOpen] = useState(false);
  return <DocPage title="Dialog" subtitle="A window overlaid on either the primary window, rendering the content underneath inert." sourceSlug="dialog">
    <DocSection title="Default">
      <Preview title="Dialog" code={`<Dialog>\n  <DialogTrigger asChild><Button>Edit Profile</Button></DialogTrigger>\n  <DialogContent>\n    <DialogHeader>\n      <DialogTitle>Edit profile</DialogTitle>\n      <DialogDescription>Make changes to your profile here.</DialogDescription>\n    </DialogHeader>\n    <DialogFooter><Button type="submit">Save changes</Button></DialogFooter>\n  </DialogContent>\n</Dialog>`} height={120}>
        <Btn onClick={() => setOpen(true)}>Edit Profile</Btn>
        <Dlg open={open} onClose={() => setOpen(false)} title="Edit Profile"
          footer={<><Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn><Btn onClick={() => setOpen(false)}>Save changes</Btn></>}>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <div><Lbl>Name</Lbl><Inp placeholder="Your name" /></div>
            <div><Lbl>Username</Lbl><Inp placeholder="@username" /></div>
          </div>
        </Dlg>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "modal", type: "boolean", def: "true", desc: "When false, interaction with elements outside the dialog is permitted." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSheet() {
  const [side, setSide] = useState("right");
  const [open, setOpen] = useState(false);
  return <DocPage title="Sheet" subtitle="Extends the Dialog component to display content that complements the main content of the screen." sourceSlug="sheet">
    <DocSection title="Sides">
      <Preview title="Sheet sides" code={`<Sheet>\n  <SheetTrigger asChild><Button variant="outline">Open Right</Button></SheetTrigger>\n  <SheetContent side="right">\n    <SheetHeader><SheetTitle>Edit profile</SheetTitle></SheetHeader>\n  </SheetContent>\n</Sheet>`} height={120}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
          {["top", "right", "bottom", "left"].map(s => (
            <Btn key={s} variant="outline" onClick={() => { setSide(s); setOpen(true); }}>
              Open {s.charAt(0).toUpperCase() + s.slice(1)}
            </Btn>
          ))}
        </div>
        <Sht open={open} onClose={() => setOpen(false)} side={side} title={`${side.charAt(0).toUpperCase() + side.slice(1)} Sheet`}>
          <p>This sheet slides in from the {side}. Use it for navigation drawers, filters, or forms that don't need a full dialog.</p>
          <div style={{ marginTop: 16 }}><Lbl>Name</Lbl><Inp placeholder="Your name" /></div>
          <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
            <Btn onClick={() => setOpen(false)}>Save</Btn>
            <Btn variant="outline" onClick={() => setOpen(false)}>Cancel</Btn>
          </div>
        </Sht>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "side", type: '"top"|"right"|"bottom"|"left"', def: '"right"', desc: "The edge of the screen where the sheet slides in from." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageTooltip() {
  return <DocPage title="Tooltip" subtitle="A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it." sourceSlug="tooltip">
    <DocSection title="Default">
      <Preview title="Tooltip" code={`<TooltipProvider>\n  <Tooltip>\n    <TooltipTrigger asChild>\n      <Button variant="outline" size="icon"><Plus /></Button>\n    </TooltipTrigger>\n    <TooltipContent><p>Add to library</p></TooltipContent>\n  </Tooltip>\n</TooltipProvider>`}>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Tip label="Add to library"><Btn variant="outline" size="icon"><Plus size={14} /></Btn></Tip>
          <Tip label="Delete item"><Btn variant="outline" size="icon"><Trash2 size={14} /></Btn></Tip>
          <Tip label="Edit profile"><Btn variant="outline" size="icon"><Edit size={14} /></Btn></Tip>
          <Tip label="Open settings"><Btn variant="ghost" size="icon"><Settings size={14} /></Btn></Tip>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="With Text Trigger">
      <Preview title="Text tooltip" code={`<Tooltip><TooltipTrigger>Hover me</TooltipTrigger>\n  <TooltipContent><p>This is a tooltip</p></TooltipContent>\n</Tooltip>`}>
        <Tip label="This shows a helpful hint">
          <span style={{ borderBottom: "1px dashed var(--muted-fg)", cursor: "help", fontSize: 13, color: "var(--muted-fg)" }}>Hover over me</span>
        </Tip>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "delayDuration", type: "number", def: "700", desc: "Duration in ms before tooltip appears." },
        { name: "skipDelayDuration", type: "number", def: "300", desc: "Duration in ms before re-open without delay." },
        { name: "disableHoverableContent", type: "boolean", def: "false", desc: "Prevents tooltip staying open when hovering its content." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PagePopover() {
  return <DocPage title="Popover" subtitle="Displays rich content in a portal, triggered by a button." sourceSlug="popover">
    <DocSection title="Default">
      <Preview title="Popover" code={`<Popover>\n  <PopoverTrigger asChild>\n    <Button variant="outline">Open popover</Button>\n  </PopoverTrigger>\n  <PopoverContent className="w-80">\n    <div className="grid gap-4">\n      <Label>Width</Label>\n      <Input defaultValue="100%" />\n    </div>\n  </PopoverContent>\n</Popover>`} height={160}>
        <Ppvr trigger={<Btn variant="outline">Open dimensions</Btn>} title="Dimensions">
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <div><Lbl>Width</Lbl><Inp placeholder="100%" /></div>
            <div><Lbl>Max. width</Lbl><Inp placeholder="300px" /></div>
            <div><Lbl>Height</Lbl><Inp placeholder="25px" /></div>
          </div>
        </Ppvr>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "defaultOpen", type: "boolean", def: "false", desc: "Initial open state (uncontrolled)." },
        { name: "modal", type: "boolean", def: "false", desc: "When true, interaction outside is disabled and screen readers see content as modal." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageDropdown() {
  const items = [
    { label: "Profile", icon: <User size={13} /> },
    { label: "Settings", icon: <Settings size={13} /> },
    { label: "Notifications", icon: <Bell size={13} />, shortcut: "⌘N" },
    { separator: true },
    { label: "Log out", icon: <LogOut size={13} />, destructive: true },
  ];
  return <DocPage title="Dropdown Menu" subtitle="Displays a menu to the user — such as a set of actions or functions — triggered by a button." sourceSlug="dropdown-menu">
    <DocSection title="Default">
      <Preview title="Dropdown" code={`<DropdownMenu>\n  <DropdownMenuTrigger asChild><Button variant="outline">Open</Button></DropdownMenuTrigger>\n  <DropdownMenuContent>\n    <DropdownMenuLabel>My Account</DropdownMenuLabel>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Profile</DropdownMenuItem>\n    <DropdownMenuItem>Settings</DropdownMenuItem>\n    <DropdownMenuSeparator />\n    <DropdownMenuItem>Log out</DropdownMenuItem>\n  </DropdownMenuContent>\n</DropdownMenu>`}>
        <DdMenu trigger={<Btn variant="outline">My Account<ChevronDown size={13} style={{ marginLeft: 6 }} /></Btn>} items={items} />
      </Preview>
    </DocSection>
    <DocSection title="With Icons">
      <Preview title="Icon dropdown" code={`<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>\n  </DropdownMenuTrigger>\n</DropdownMenu>`}>
        <DdMenu trigger={<Btn variant="ghost" size="icon"><MoreHorizontal size={14} /></Btn>}
          items={[{ label: "Edit", icon: <Edit size={13} /> }, { label: "Duplicate", icon: <RefreshCw size={13} /> }, { separator: true }, { label: "Delete", icon: <Trash2 size={13} />, destructive: true }]} />
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "modal", type: "boolean", def: "true", desc: "When true, interaction outside the dropdown is disabled." },
        { name: "dir", type: '"ltr"|"rtl"', def: '"ltr"', desc: "Reading direction." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageContextMenu() {
  return <DocPage title="Context Menu" subtitle="Displays a menu located at the pointer, triggered by a right-click or long-press." sourceSlug="context-menu">
    <DocSection title="Default">
      <Callout variant="info">Right-click (or long-press on mobile) within the dashed area to trigger the context menu.</Callout>
      <Preview title="Context menu" code={`<ContextMenu>\n  <ContextMenuTrigger>Right click</ContextMenuTrigger>\n  <ContextMenuContent>\n    <ContextMenuItem>Cut<ContextMenuShortcut>⌘X</ContextMenuShortcut></ContextMenuItem>\n    <ContextMenuItem>Copy<ContextMenuShortcut>⌘C</ContextMenuShortcut></ContextMenuItem>\n    <ContextMenuItem>Paste<ContextMenuShortcut>⌘V</ContextMenuShortcut></ContextMenuItem>\n  </ContextMenuContent>\n</ContextMenu>`}>
        <CtxMenu items={[
          { label: "Back", icon: <ChevronLeft size={13} /> }, { label: "Forward", icon: <ChevronRight size={13} /> }, { separator: true },
          { label: "Save as…", icon: <FileText size={13} /> }, { label: "Copy", icon: <Copy size={13} /> }, { separator: true },
          { label: "Inspect", icon: <Search size={13} /> }]}>
          <div style={{
            width: 300, height: 100, border: "2px dashed var(--border)", borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, color: "var(--muted-fg)", userSelect: "none", cursor: "context-menu"
          }}>
            Right-click here
          </div>
        </CtxMenu>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "modal", type: "boolean", def: "true", desc: "When true, interaction outside is disabled." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageHoverCard() {
  return <DocPage title="Hover Card" subtitle="For sighted users to preview content available behind a link." sourceSlug="hover-card">
    <DocSection title="Default">
      <Preview title="Hover card" code={`<HoverCard>\n  <HoverCardTrigger asChild>\n    <Button variant="link">@nextjs</Button>\n  </HoverCardTrigger>\n  <HoverCardContent>\n    <div className="flex gap-4">\n      <Avatar />\n      <div><h4>@nextjs</h4><p>The React framework.</p></div>\n    </div>\n  </HoverCardContent>\n</HoverCard>`}>
        <HvrCard trigger={<Btn variant="link">@shadcn</Btn>}>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
            <Avt src="https://github.com/shadcn.png" fallback="SC" size={44} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: "var(--fg)", marginBottom: 2 }}>@shadcn</div>
              <div style={{ fontSize: 12, color: "var(--muted-fg)", lineHeight: 1.5 }}>Creator of shadcn/ui. Building design systems.</div>
              <div style={{ fontSize: 11, color: "var(--muted-fg)", marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={11} />Joined April 2023</div>
            </div>
          </div>
        </HvrCard>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "openDelay", type: "number", def: "700", desc: "Duration in ms before card opens on hover." },
        { name: "closeDelay", type: "number", def: "300", desc: "Duration in ms before card closes after hover ends." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageCommand() {
  return <DocPage title="Command" subtitle="Fast, composable command menu for React." sourceSlug="command">
    <DocSection title="Default">
      <Preview title="Command palette" code={`<Command>\n  <CommandInput placeholder="Type a command or search…" />\n  <CommandList>\n    <CommandEmpty>No results found.</CommandEmpty>\n    <CommandGroup heading="Suggestions">\n      <CommandItem>Calendar</CommandItem>\n      <CommandItem>Search Emoji</CommandItem>\n    </CommandGroup>\n  </CommandList>\n</Command>`} height={320}>
        <Cmd />
      </Preview>
    </DocSection>
    <DocSection title="As Dialog">
      <Callout variant="info">In production, wrap in <code style={{ fontFamily: "monospace", fontSize: 11 }}>CommandDialog</code> and bind to a keyboard shortcut like <code style={{ fontFamily: "monospace", fontSize: 11 }}>⌘K</code>.</Callout>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "string", desc: "Controlled selected value." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback when selection changes." },
        { name: "filter", type: "(value: string, search: string) => number", desc: "Custom filter function. Return 0 to hide, 1 to show." },
        { name: "shouldFilter", type: "boolean", def: "true", desc: "Whether to filter items based on the search value." },
        { name: "loop", type: "boolean", def: "false", desc: "Whether keyboard navigation loops around." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageTabs() {
  return <DocPage title="Tabs" subtitle="A set of layered sections of content that are displayed one at a time." sourceSlug="tabs">
    <DocSection title="Default">
      <Preview title="Tabs" code={`<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n  </TabsList>\n  <TabsContent value="account">Account content.</TabsContent>\n  <TabsContent value="password">Password content.</TabsContent>\n</Tabs>`} height={200}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <TabsRoot tabs={[
            { id: "account", label: "Account", content: <Crd><CrdHeader><CrdTitle>Account</CrdTitle><CrdDesc>Make changes to your account here.</CrdDesc></CrdHeader><CrdBody><Lbl>Name</Lbl><Inp placeholder="Your name" /></CrdBody><CrdFooter><div style={{ display: "flex", justifyContent: "flex-end" }}><Btn>Save</Btn></div></CrdFooter></Crd> },
            { id: "password", label: "Password", content: <Crd><CrdHeader><CrdTitle>Password</CrdTitle><CrdDesc>Change your password here.</CrdDesc></CrdHeader><CrdBody><Lbl>Current</Lbl><Inp type="password" placeholder="••••••" /></CrdBody><CrdFooter><div style={{ display: "flex", justifyContent: "flex-end" }}><Btn>Update</Btn></div></CrdFooter></Crd> },
            { id: "notifs", label: "Notifications", content: <Crd><CrdBody><div style={{ display: "flex", flexDirection: "column", gap: 12 }}><Swt checked={true} onChange={() => { }} label="Email notifications" /><Swt checked={false} onChange={() => { }} label="Push notifications" /></div></CrdBody></Crd> },
          ]} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "defaultValue", type: "string", desc: "Initial active tab (uncontrolled)." },
        { name: "value", type: "string", desc: "Controlled active tab." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback when tab changes." },
        { name: "orientation", type: '"horizontal"|"vertical"', def: '"horizontal"', desc: "Orientation of the tabs." },
        { name: "activationMode", type: '"automatic"|"manual"', def: '"automatic"', desc: "Whether tab is activated on focus or on explicit click." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageAccordion() {
  return <DocPage title="Accordion" subtitle="A vertically stacked set of interactive headings that each reveal a section of content." sourceSlug="accordion">
    <DocSection title="Default">
      <Preview title="Accordion" code={`<Accordion type="single" collapsible>\n  <AccordionItem value="item-1">\n    <AccordionTrigger>Is it accessible?</AccordionTrigger>\n    <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>\n  </AccordionItem>\n</Accordion>`} height={220}>
        <div style={{ width: "100%", maxWidth: 440 }}>
          <Acc items={[
            { title: "Is it accessible?", content: "Yes. It adheres to the WAI-ARIA design pattern and is fully keyboard navigable." },
            { title: "Is it styled?", content: "Yes. It comes with default styles that matches the other components' aesthetics." },
            { title: "Is it animated?", content: "Yes. It's animated by default, but you can disable it as desired using the reduceMotion prop." },
            { title: "Can I use it in production?", content: "Absolutely. All components are production-ready and actively maintained." },
          ]} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "type", type: '"single"|"multiple"', required: true, desc: "Whether one or multiple items can be open at the same time." },
        { name: "collapsible", type: "boolean", def: "false", desc: "When type='single', allows closing content when clicking the trigger of an open item." },
        { name: "value", type: "string | string[]", desc: "Controlled open item(s)." },
        { name: "defaultValue", type: "string | string[]", desc: "Initial open item(s) (uncontrolled)." },
        { name: "onValueChange", type: "(value: string | string[]) => void", desc: "Callback when open item(s) change." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageCollapsible() {
  return <DocPage title="Collapsible" subtitle="An interactive component which expands/collapses a panel." sourceSlug="collapsible">
    <DocSection title="Default">
      <Preview title="Collapsible" code={`<Collapsible>\n  <CollapsibleTrigger>Can I use this in my project?</CollapsibleTrigger>\n  <CollapsibleContent>Yes. Free to use for personal and commercial projects.</CollapsibleContent>\n</Collapsible>`} height={160}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <Collapsible trigger="@peduarte starred 3 repositories">
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {["@radix-ui/primitives", "@radix-ui/colors", "@stitches/react"].map(r => (
                <div key={r} style={{ padding: "6px 0", borderBottom: "1px solid var(--border)", fontSize: 13, color: "var(--muted-fg)", fontFamily: "monospace" }}>{r}</div>
              ))}
            </div>
          </Collapsible>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "open", type: "boolean", desc: "Controlled open state." },
        { name: "defaultOpen", type: "boolean", def: "false", desc: "Initial open state (uncontrolled)." },
        { name: "onOpenChange", type: "(open: boolean) => void", desc: "Callback when open state changes." },
        { name: "disabled", type: "boolean", def: "false", desc: "When true, prevents user from changing the open state." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageTable() {
  const columns = [{ key: "invoice", label: "Invoice" }, { key: "status", label: "Status" }, { key: "method", label: "Method" }, { key: "amount", label: "Amount" }];
  const rows = [
    { invoice: "INV-001", status: <Bdg variant="success">Paid</Bdg>, method: "Credit Card", amount: "$250.00" },
    { invoice: "INV-002", status: <Bdg variant="warning">Pending</Bdg>, method: "PayPal", amount: "$150.00" },
    { invoice: "INV-003", status: <Bdg variant="destructive">Unpaid</Bdg>, method: "Bank Transfer", amount: "$350.00" },
    { invoice: "INV-004", status: <Bdg variant="success">Paid</Bdg>, method: "Credit Card", amount: "$450.00" },
    { invoice: "INV-005", status: <Bdg variant="secondary">Refunded</Bdg>, method: "Stripe", amount: "$550.00" },
  ];
  return <DocPage title="Table" subtitle="A responsive table component." sourceSlug="table">
    <DocSection title="Default">
      <Preview title="Table" code={`<Table>\n  <TableHeader>\n    <TableRow>\n      <TableHead>Invoice</TableHead>\n      <TableHead>Status</TableHead>\n      <TableHead>Method</TableHead>\n      <TableHead>Amount</TableHead>\n    </TableRow>\n  </TableHeader>\n  <TableBody>{rows.map(...)}</TableBody>\n</Table>`} height={240}>
        <div style={{ width: "100%", maxWidth: 520 }}><Tbl columns={columns} rows={rows} /></div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "className", type: "string", desc: "Additional Tailwind classes on the table root." },
        { name: "children", type: "ReactNode", required: true, desc: "TableHeader, TableBody, and TableFooter elements." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageSkeleton() {
  return <DocPage title="Skeleton" subtitle="Use to show a placeholder while content is loading." sourceSlug="skeleton">
    <DocSection title="Default">
      <Preview title="Skeleton" code={`<Skeleton className="w-[100px] h-[20px] rounded-full" />`} height={100}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
          <Skl style={{ height: 16, width: "80%" }} />
          <Skl style={{ height: 12, width: "60%" }} />
          <Skl style={{ height: 12, width: "70%" }} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Card Skeleton">
      <Preview title="Card loading state" code={`<div className="flex items-center space-x-4">\n  <Skeleton className="h-12 w-12 rounded-full" />\n  <div className="space-y-2">\n    <Skeleton className="h-4 w-[250px]" />\n    <Skeleton className="h-4 w-[200px]" />\n  </div>\n</div>`}>
        <div style={{ display: "flex", gap: 12, alignItems: "center", width: 280 }}>
          <Skl style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0 }} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
            <Skl style={{ height: 14, width: "75%" }} />
            <Skl style={{ height: 11, width: "55%" }} />
          </div>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "className", type: "string", desc: "Additional Tailwind classes — use for width, height, and border-radius." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageProgress() {
  const [v, setV] = useState(60);
  useEffect(() => {
    const t = setInterval(() => setV(x => x >= 100 ? 0 : x + 1), 80);
    return () => clearInterval(t);
  }, []);
  return <DocPage title="Progress" subtitle="Displays an indicator showing the completion progress of a task." sourceSlug="progress">
    <DocSection title="Default">
      <Preview title="Progress" code={`<Progress value={60} />`}>
        <div style={{ width: 280, display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--muted-fg)", marginBottom: 6 }}>
              <span>Progress</span><span>{v}%</span>
            </div>
            <Prg value={v} />
          </div>
          <Prg value={33} />
          <Prg value={75} />
          <Prg value={100} />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "number | null", desc: "Controlled progress value between 0–100. null shows indeterminate state." },
        { name: "max", type: "number", def: "100", desc: "Maximum value." },
        { name: "getValueLabel", type: "(value: number, max: number) => string", desc: "Accessible label function." },
        { name: "className", type: "string", desc: "Additional Tailwind classes." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageCalendar() {
  return <DocPage title="Calendar" subtitle="A date field component that allows users to enter and edit date." sourceSlug="calendar">
    <DocSection title="Default">
      <Preview title="Calendar" code={`import { Calendar } from "@/components/ui/calendar";\n\nexport function CalendarDemo() {\n  const [date, setDate] = React.useState<Date | undefined>(new Date());\n  return (\n    <Calendar\n      mode="single"\n      selected={date}\n      onSelect={setDate}\n      className="rounded-md border"\n    />\n  );\n}`} height={280}>
        <CalMini />
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "mode", type: '"single"|"multiple"|"range"', required: true, desc: "Selection mode." },
        { name: "selected", type: "Date | Date[] | DateRange", desc: "Controlled selected date(s)." },
        { name: "onSelect", type: "(date: Date | undefined) => void", desc: "Callback when selection changes." },
        { name: "disabled", type: "Matcher | Matcher[]", desc: "Dates that should be disabled." },
        { name: "fromDate", type: "Date", desc: "Earliest selectable date." },
        { name: "toDate", type: "Date", desc: "Latest selectable date." },
        { name: "showOutsideDays", type: "boolean", def: "true", desc: "Show days from adjacent months." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageBreadcrumb() {
  return <DocPage title="Breadcrumb" subtitle="Displays the path to the current resource using a hierarchy of links." sourceSlug="breadcrumb">
    <DocSection title="Default">
      <Preview title="Breadcrumb" code={`<Breadcrumb>\n  <BreadcrumbList>\n    <BreadcrumbItem><BreadcrumbLink href="/">Home</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbLink href="/components">Components</BreadcrumbLink></BreadcrumbItem>\n    <BreadcrumbSeparator />\n    <BreadcrumbItem><BreadcrumbPage>Breadcrumb</BreadcrumbPage></BreadcrumbItem>\n  </BreadcrumbList>\n</Breadcrumb>`}>
        <Brd items={["Home", "Components", "Breadcrumb"]} />
      </Preview>
    </DocSection>
    <DocSection title="Custom Separator">
      <Preview title="Custom separator" code={`<BreadcrumbSeparator><Slash /></BreadcrumbSeparator>`}>
        <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
          {["Home", "Docs", "Components", "Breadcrumb"].map((item, i, arr) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              {i > 0 && <span style={{ color: "var(--muted-fg)" }}>/</span>}
              {i < arr.length - 1 ? <a href="#" onClick={e => e.preventDefault()} style={{ color: "var(--muted-fg)", textDecoration: "none" }}>{item}</a>
                : <span style={{ color: "var(--fg)", fontWeight: 500 }}>{item}</span>}
            </span>
          ))}
        </nav>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "separator", type: "ReactNode", def: "<ChevronRight />", desc: "Custom separator element between breadcrumb items." },
        { name: "className", type: "string", desc: "Additional Tailwind classes on the breadcrumb root." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PagePagination() {
  const [page, setPage] = useState(1);
  return <DocPage title="Pagination" subtitle="Pagination with page navigation, next and previous links." sourceSlug="pagination">
    <DocSection title="Default">
      <Preview title="Pagination" code={`<Pagination>\n  <PaginationContent>\n    <PaginationItem><PaginationPrevious href="#" /></PaginationItem>\n    <PaginationItem><PaginationLink href="#">1</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationLink href="#" isActive>2</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationLink href="#">3</PaginationLink></PaginationItem>\n    <PaginationItem><PaginationEllipsis /></PaginationItem>\n    <PaginationItem><PaginationNext href="#" /></PaginationItem>\n  </PaginationContent>\n</Pagination>`}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <Pgn total={10} current={page} onChange={setPage} />
          <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>Page {page} of 10</span>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "page", type: "number", desc: "Current page (controlled)." },
        { name: "pageCount", type: "number", required: true, desc: "Total number of pages." },
        { name: "onPageChange", type: "(page: number) => void", desc: "Callback when page changes." },
        { name: "siblingCount", type: "number", def: "1", desc: "Number of pages shown on each side of the current page." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageNavMenu() {
  const [active, setActive] = useState(null);
  const items = [
    { label: "Getting Started", children: ["Introduction", "Installation", "Typography"] },
    { label: "Components", children: ["Alert", "Button", "Card", "Dialog", "Dropdown"] },
    { label: "Documentation" },
  ];
  return <DocPage title="Navigation Menu" subtitle="A collection of links for navigating websites." sourceSlug="navigation-menu">
    <DocSection title="Default">
      <Preview title="Navigation Menu" code={`<NavigationMenu>\n  <NavigationMenuList>\n    <NavigationMenuItem>\n      <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>\n      <NavigationMenuContent>...</NavigationMenuContent>\n    </NavigationMenuItem>\n    <NavigationMenuItem>\n      <NavigationMenuLink href="/docs">Documentation</NavigationMenuLink>\n    </NavigationMenuItem>\n  </NavigationMenuList>\n</NavigationMenu>`} height={160}>
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 2, background: "var(--muted)", padding: 4, borderRadius: 8, border: "1px solid var(--border)" }}>
            {items.map(item => (
              <div key={item.label} style={{ position: "relative" }}>
                <button onClick={() => setActive(active === item.label ? null : item.label)} style={{
                  padding: "6px 12px", borderRadius: 6, border: "none", background: active === item.label ? "var(--bg)" : "transparent",
                  color: active === item.label ? "var(--fg)" : "var(--muted-fg)", cursor: "pointer", fontSize: 13, fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 4
                }}>
                  {item.label}{item.children && <ChevronDown size={12} style={{ transition: ".2s", transform: active === item.label ? "rotate(180deg)" : "none" }} />}
                </button>
                {active === item.label && item.children && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, background: "var(--bg)", border: "1px solid var(--border)",
                    borderRadius: 8, boxShadow: "0 8px 24px rgba(0,0,0,.12)", padding: "4px 0", minWidth: 160, zIndex: 50
                  }}>
                    {item.children.map(c => <a key={c} href="#" onClick={e => { e.preventDefault(); setActive(null); }}
                      style={{ display: "block", padding: "7px 14px", fontSize: 13, color: "var(--fg)", textDecoration: "none" }}>{c}</a>)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "value", type: "string", desc: "Controlled open menu item." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback when active item changes." },
        { name: "delayDuration", type: "number", def: "200", desc: "Duration in ms before submenu opens on hover." },
        { name: "skipDelayDuration", type: "number", def: "300", desc: "How long to skip the delay when moving between menus." },
        { name: "orientation", type: '"horizontal"|"vertical"', def: '"horizontal"', desc: "Orientation of the navigation." },
      ]} />
    </DocSection>
  </DocPage>;
}

/* ═══════════════════════════════════════════════════════════
   INTRO + PLACEHOLDER PAGES
═══════════════════════════════════════════════════════════ */
function PageIntro() {
  const features = [
    { Icon: Package, title: "Component Library", desc: "Every primitive documented with live previews, code snippets, and interactive examples." },
    { Icon: Palette, title: "Design Tokens", desc: "Colors, typography, spacing — all CSS variables for consistent theming." },
    { Icon: Zap, title: "Accessible by Default", desc: "Built on Radix UI primitives. WAI-ARIA patterns out of the box." },
    { Icon: BookOpen, title: "Full Documentation", desc: "Props tables, usage guidelines, and variant examples for every component." },
  ];
  const componentCount = NAV.flatMap(g => g.items).filter(i => !["intro", "install", "theming"].includes(i.id)).length;
  return <div>
    <div style={{ marginBottom: 40 }}>
      <span style={{
        display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
        background: "var(--muted)", color: "var(--muted-fg)", border: "1px solid var(--border)", marginBottom: 16,
        textTransform: "uppercase", letterSpacing: ".06em"
      }}>Internal Design System</span>
      <h1 style={{ margin: "0 0 12px", fontSize: 34, fontWeight: 900, color: "var(--fg)", letterSpacing: "-.03em", lineHeight: 1.1 }}>HeartStamp DS</h1>
      <p style={{ margin: "0 0 24px", fontSize: 14, color: "var(--muted-fg)", lineHeight: 1.7, maxWidth: 520 }}>
        A curated set of <strong style={{ color: "var(--fg)" }}>{componentCount} accessible, reusable components</strong> built on top of Shadcn UI and Radix UI primitives — documented and tested right here.
      </p>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        <Btn>Browse Components<ArrowRight size={13} style={{ marginLeft: 6 }} /></Btn>
        <Btn variant="outline">Shadcn UI ↗</Btn>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: 12, marginBottom: 36 }}>
      {features.map(({ Icon, title, desc }) => (
        <div key={title} style={{ padding: 18, border: "1px solid var(--border)", borderRadius: 12, background: "var(--muted)" }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: "var(--bg)", display: "flex", alignItems: "center",
            justifyContent: "center", marginBottom: 10, border: "1px solid var(--border)"
          }}>
            <Icon size={16} style={{ color: "var(--muted-fg)" }} />
          </div>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 6, color: "var(--fg)" }}>{title}</div>
          <div style={{ fontSize: 12.5, color: "var(--muted-fg)", lineHeight: 1.6 }}>{desc}</div>
        </div>
      ))}
    </div>
    <div style={{ marginBottom: 12, fontSize: 11, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em" }}>All {componentCount} components</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {NAV.flatMap(g => g.items).filter(i => !["intro", "install", "theming"].includes(i.id)).map(item => (
        <span key={item.id} style={{
          padding: "3px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12,
          fontFamily: "monospace", color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: 5
        }}>
          {item.title}
          {item.label && <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 999,
            background: LABEL_COLORS[item.label].bg, color: LABEL_COLORS[item.label].color, textTransform: "uppercase"
          }}>{item.label}</span>}
        </span>
      ))}
    </div>
  </div>;
}

function PlaceholderPage({ id }) {
  const item = ALL_ITEMS.find(i => i.id === id);
  return <div style={{
    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
    minHeight: 300, gap: 12, color: "var(--muted-fg)"
  }}>
    <div style={{ fontSize: 36, opacity: .15 }}>📄</div>
    <div style={{ fontSize: 18, fontWeight: 700, color: "var(--fg)" }}>{item?.title || id}</div>
    <div style={{ fontSize: 13 }}>Documentation coming soon.</div>
    <Btn variant="outline" style={{ marginTop: 8 }}>Request docs</Btn>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   PAGE ROUTER
═══════════════════════════════════════════════════════════ */
const PAGES = {
  intro: PageIntro,
  button: PageButton,
  input: PageInput,
  textarea: PageTextarea,
  label: PageLabel,
  select: PageSelect,
  checkbox: PageCheckbox,
  "radio-group": PageRadioGroup,
  switch: PageSwitch,
  slider: PageSlider,
  toggle: PageToggle,
  "toggle-group": PageToggleGroup,
  badge: PageBadge,
  avatar: PageAvatar,
  card: PageCard,
  separator: PageSeparator,
  "scroll-area": PageScrollArea,
  "aspect-ratio": PageAspectRatio,
  alert: PageAlert,
  toast: PageToast,
  "alert-dialog": PageAlertDialog,
  dialog: PageDialog,
  sheet: PageSheet,
  tooltip: PageTooltip,
  popover: PagePopover,
  dropdown: PageDropdown,
  "context-menu": PageContextMenu,
  "hover-card": PageHoverCard,
  command: PageCommand,
  tabs: PageTabs,
  accordion: PageAccordion,
  collapsible: PageCollapsible,
  table: PageTable,
  skeleton: PageSkeleton,
  progress: PageProgress,
  calendar: PageCalendar,
  breadcrumb: PageBreadcrumb,
  pagination: PagePagination,
  "nav-menu": PageNavMenu,
};

/* ═══════════════════════════════════════════════════════════
   SIDEBAR
═══════════════════════════════════════════════════════════ */
function Sidebar({ active, onSelect, onClose }) {
  const [openG, setOpenG] = useState(NAV.reduce((a, g, i) => ({ ...a, [g.title]: i < 3 }), {}));
  const [search, setSearch] = useState("");
  const toggle = t => setOpenG(g => ({ ...g, [t]: !g[t] }));
  const filtered = search.trim()
    ? [{ title: "Results", items: ALL_ITEMS.filter(i => i.title.toLowerCase().includes(search.toLowerCase())) }]
    : NAV;
  return <nav style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
    <div style={{ padding: "10px 10px 6px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 7,
        border: "1px solid var(--border)", background: "var(--muted)"
      }}>
        <Search size={12} style={{ color: "var(--muted-fg)", flexShrink: 0 }} />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search components…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 12, color: "var(--fg)", fontFamily: "inherit" }} />
        {search && <button onClick={() => setSearch("")} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 0, display: "flex" }}><X size={11} /></button>}
      </div>
    </div>
    <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px" }}>
      {filtered.map(group => (
        <div key={group.title} style={{ marginBottom: 2 }}>
          {!search && <button onClick={() => toggle(group.title)} style={{
            width: "100%", display: "flex",
            alignItems: "center", justifyContent: "space-between", padding: "5px 10px",
            background: "none", border: "none", cursor: "pointer", fontSize: 10.5, fontWeight: 700,
            color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em"
          }}>
            {group.title}
            {openG[group.title] ? <ChevronDown size={10} /> : <ChevronRight size={10} />}
          </button>}
          {(search || openG[group.title]) && <div style={{ marginTop: 1 }}>
            {group.items.map(item => (
              <button key={item.id} onClick={() => { onSelect(item.id); onClose?.(); }} style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "6px 10px", borderRadius: 7, border: "none", cursor: "pointer", fontSize: 12.5,
                fontWeight: active === item.id ? 600 : 400, textAlign: "left", transition: "all .12s",
                background: active === item.id ? "var(--accent-subtle)" : "transparent",
                color: active === item.id ? "var(--accent)" : "var(--muted-fg)"
              }}>
                {item.title}
                {item.label && <span style={{
                  fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 999,
                  background: LABEL_COLORS[item.label].bg, color: LABEL_COLORS[item.label].color,
                  textTransform: "uppercase", letterSpacing: ".04em"
                }}>{item.label}</span>}
              </button>
            ))}
          </div>}
        </div>
      ))}
    </div>
    <div style={{ padding: "10px 14px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--muted-fg)" }}>
      HeartStamp DS · v1.0.0
    </div>
  </nav>;
}

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("intro");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const theme = dark ? {
    "--bg": "#09090b", "--fg": "#fafafa", "--muted": "#18181b", "--muted-fg": "#71717a",
    "--border": "#27272a", "--accent": "#6366f1", "--accent-subtle": "rgba(99,102,241,.12)",
  } : {
    "--bg": "#ffffff", "--fg": "#09090b", "--muted": "#f4f4f5", "--muted-fg": "#71717a",
    "--border": "#e4e4e7", "--accent": "#6366f1", "--accent-subtle": "rgba(99,102,241,.1)",
  };

  const PageComp = PAGES[page] || PlaceholderPage;

  return (
    <div style={{ ...theme, fontFamily: "'DM Sans',system-ui,sans-serif", background: "var(--bg)", color: "var(--fg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}
        button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        input:focus{outline:none;border-color:var(--accent)!important;box-shadow:0 0 0 2px var(--accent-subtle)}
      `}</style>

      {/* TOPBAR */}
      <header style={{
        height: 52, display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
        borderBottom: "1px solid var(--border)", background: dark ? "rgba(9,9,11,.85)" : "rgba(255,255,255,.85)",
        backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50, flexShrink: 0
      }}>
        <button onClick={() => setSidebarOpen(o => !o)} style={{
          background: "none", border: "none", cursor: "pointer",
          color: "var(--fg)", padding: 4, borderRadius: 6, display: "flex"
        }}>
          {sidebarOpen ? <X size={17} /> : <Menu size={17} />}
        </button>

        {/* SVG Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <svg width="136" height="18" viewBox="0 0 203 28" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#hds-clip)">
              <path d="M22.1595 3.1948C20.8678 1.73163 19.2691 1 17.3646 1C15.4425 1 13.6914 1.92386 12.1093 3.77044L12 3.88916L11.8907 3.77044C10.3086 1.92386 8.55753 1 6.63541 1C4.7309 1 3.13223 1.73163 1.84046 3.1948C0.613861 4.60968 0 6.2827 0 8.21166C0 11.0743 0.847941 13.9447 2.54262 16.8228C4.17332 19.6207 6.22359 21.832 8.69445 23.4566C9.03338 23.6807 9.5501 23.9784 10.2446 24.3486C11.0836 24.7825 11.8057 25 12 25C12.1943 25 12.9164 24.7825 13.7554 24.3486C14.4499 23.9784 14.9666 23.6807 15.3055 23.4566C17.7764 21.832 19.8267 19.6207 21.4574 16.8228C23.1521 13.9447 24 11.0743 24 8.21166C24 6.2827 23.3861 4.60968 22.1595 3.1948Z" fill="#BE1D2C" />
              <path d="M16.5975 6.77065H14.9413C14.8868 6.77065 14.8426 6.81464 14.8426 6.86893V11.6433C14.8426 11.6705 14.8315 11.695 14.8136 11.7128C14.7854 11.741 14.7504 11.7416 14.7438 11.7416C13.6055 12.2216 12.5929 12.2962 12.0002 12.2962C10.7868 12.2962 9.83905 11.9839 9.28835 11.7547C9.2889 11.7541 9.29008 11.7528 9.28999 11.7528C9.25177 11.7354 9.21508 11.7173 9.17776 11.6996C9.16608 11.6834 9.15781 11.6647 9.15781 11.6433V6.76037H9.15587C9.11623 4.7656 7.20389 4.53856 6.05287 4.83376C4.63981 5.19618 3.46149 7.03323 4.21569 8.97442L4.21569 8.97442C4.40668 9.52369 4.79153 10.4061 5.56777 11.2793C6.15976 11.9452 6.78911 12.3916 7.30407 12.6855V18.9682C7.30407 19.0225 7.3483 19.0665 7.40286 19.0665H9.05902C9.11358 19.0665 9.15781 19.0225 9.15781 18.9682V13.6843C9.15781 13.6571 9.1689 13.6326 9.18676 13.6148C9.21503 13.5867 9.24999 13.586 9.25661 13.586C9.7926 13.8171 10.7064 14.1311 11.8778 14.1517C13.1793 14.1747 14.1894 13.8248 14.7438 13.586C14.7984 13.586 14.8426 13.63 14.8426 13.6843V18.9682C14.8426 19.0225 14.8868 19.0665 14.9414 19.0665H16.5976C16.6521 19.0665 16.6964 19.0225 16.6964 18.9682V6.86893C16.6964 6.81464 16.6521 6.77065 16.5976 6.77065H16.5975ZM7.02522 10.1152C6.19901 9.21836 5.7899 8.30484 5.58918 7.74724C5.41181 7.19779 5.711 6.96618 5.93962 6.94798C6.21257 6.92649 6.29106 7.11843 6.45151 7.64985C6.46358 7.64677C6.41594 7.3585 6.39242 6.85113 6.67677 6.6749C6.85323 6.56555 7.06815 6.5654 7.19389 6.70835C7.21772 6.73545 7.30399 6.82068 7.30399 7.01467V10.4007C7.19773 10.2978 7.10449 10.2013 7.02521 10.1152L7.02522 10.1152Z" fill="white" />
            </g>
            <path d="M33.75 22V4.5H39.65C41.5 4.5 43.0667 4.88333 44.35 5.65C45.6333 6.4 46.6083 7.43333 47.275 8.75C47.9417 10.05 48.275 11.5417 48.275 13.225C48.275 14.925 47.9417 16.4333 47.275 17.75C46.6083 19.0667 45.6333 20.1083 44.35 20.875C43.0667 21.625 41.5 22 39.65 22H33.75ZM36.475 19.575H39.65C40.9833 19.575 42.075 19.2917 42.925 18.725C43.775 18.1417 44.4 17.375 44.8 16.425C45.2167 15.4583 45.425 14.3917 45.425 13.225C45.425 12.075 45.2167 11.025 44.8 10.075C44.4 9.10833 43.775 8.34167 42.925 7.775C42.075 7.20833 40.9833 6.925 39.65 6.925H36.475V19.575ZM56.6566 22.4C55.2066 22.4 53.9483 22.0917 52.8816 21.475C51.815 20.8417 50.9816 19.9667 50.3816 18.85C49.7983 17.7333 49.5066 16.4583 49.5066 15.025C49.5066 13.575 49.7983 12.2917 50.3816 11.175C50.9816 10.0583 51.815 9.18333 52.8816 8.55C53.9483 7.91667 55.2066 7.6 56.6566 7.6C57.6066 7.6 58.4983 7.78333 59.3316 8.15C60.165 8.51667 60.8816 9.05833 61.4816 9.775C62.0816 10.4917 62.5233 11.3667 62.8066 12.4C63.09 13.4167 63.165 14.5833 63.0316 15.9H51.0316V13.65H61.5316L60.4066 14.425C60.4566 13.625 60.34 12.9 60.0566 12.25C59.7733 11.5833 59.3483 11.05 58.7816 10.65C58.215 10.25 57.5066 10.05 56.6566 10.05C55.6733 10.05 54.8566 10.2667 54.2066 10.7C53.5566 11.1333 53.065 11.725 52.7316 12.475C52.415 13.225 52.2566 14.075 52.2566 15.025C52.2566 15.9583 52.415 16.8 52.7316 17.55C53.065 18.3 53.5566 18.8917 54.2066 19.325C54.8566 19.7417 55.6733 19.95 56.6566 19.95C57.64 19.95 58.415 19.725 58.9816 19.275C59.565 18.8083 59.965 18.2417 60.1816 17.575H63.0316C62.815 18.5417 62.415 19.3833 61.8316 20.1C61.265 20.8167 60.54 21.3833 59.6566 21.8C58.79 22.2 57.79 22.4 56.6566 22.4ZM67.1723 17.575C67.2556 18.425 67.6139 19.0583 68.2473 19.475C68.8973 19.8917 69.6723 20.1 70.5723 20.1C71.4723 20.1 72.1889 19.9333 72.7223 19.6C73.2723 19.2667 73.5473 18.7417 73.5473 18.025C73.5473 17.5917 73.3806 17.2667 73.0473 17.05C72.7306 16.8167 72.3056 16.6333 71.7723 16.5C71.2556 16.3667 70.6806 16.25 70.0473 16.15C69.4306 16.05 68.8056 15.925 68.1723 15.775C67.5389 15.625 66.9556 15.4083 66.4223 15.125C65.9056 14.825 65.4889 14.425 65.1723 13.925C64.8556 13.425 64.6973 12.775 64.6973 11.975C64.6973 11.225 65.2306 10.5167 65.3973 9.85C65.8639 9.16667 66.5223 8.625 67.3723 8.225C68.2389 7.80833 69.2389 7.6 70.3723 7.6C71.3889 7.6 72.3223 7.80833 73.1723 8.225C74.0223 8.625 74.6973 9.18333 75.1973 9.9C75.7139 10.6167 75.9723 11.45 75.9723 12.4H73.4223C73.3556 11.55 73.0223 10.925 72.4223 10.525C71.8389 10.1083 71.1223 9.9 70.2723 9.9C69.3056 9.9 68.5723 10.1 68.0723 10.5C67.5889 10.8833 67.3473 11.375 67.3473 11.975C67.3473 12.4417 67.5056 12.8 67.8223 13.05C68.1556 13.3 68.5806 13.4917 69.0973 13.625C69.6306 13.7583 70.2139 13.875 70.8473 13.975C71.4806 14.075 72.1056 14.2 72.7223 14.35C73.3556 14.5 73.9306 14.7167 74.4473 15C74.9806 15.2667 75.4056 15.6417 75.7223 16.125C76.0389 16.6083 76.1973 17.2417 76.1973 18.025C76.1973 18.9083 75.9639 19.6833 75.4973 20.35C75.0306 21 74.3639 21.5083 73.4973 21.875C72.6473 22.225 71.6306 22.4 70.4473 22.4C69.3473 22.4 68.3556 22.1917 67.4723 21.775C66.5889 21.3417 65.8806 20.7667 65.3473 20.05C64.8306 19.3167 64.5556 18.4917 64.5223 17.575H67.1723ZM78.1145 8H80.8145V22H78.1145V8ZM77.9645 3.25H80.9645V6.325H77.9645V3.25ZM88.915 21.9C87.6317 21.9 86.515 21.6083 85.565 21.025C84.6317 20.4417 83.9067 19.6167 83.39 18.55C82.8734 17.4667 82.615 16.2083 82.615 14.775C82.615 13.325 82.8734 12.0667 83.39 11C83.9067 9.91667 84.6317 9.08333 85.565 8.5C86.515 7.9 87.6317 7.6 88.915 7.6C90.6317 7.6 91.9317 8.11667 92.815 9.15C93.6984 10.1667 94.24 11.575 94.44 13.375L94.39 16.225C94.29 17.3417 94.04 18.325 93.64 19.175C93.24 20.025 92.6567 20.6917 91.89 21.175C91.1234 21.6583 90.1317 21.9 88.915 21.9ZM89.265 19.45C90.665 19.45 91.7067 19.025 92.39 18.175C93.0734 17.325 93.415 16.1917 93.415 14.775C93.415 13.3417 93.0734 12.2 92.39 11.35C91.7067 10.4833 90.665 10.05 89.265 10.05C88.065 10.05 87.115 10.4667 86.415 11.3C85.715 12.1167 85.365 13.275 85.365 14.775C85.365 16.2583 85.715 17.4083 86.415 18.225C87.115 19.0417 88.065 19.45 89.265 19.45ZM93.415 21.25V8H96.09V21.25H93.415ZM98.351 8H101.026V10.3C101.226 9.83333 101.518 9.4 101.901 9C102.284 8.58333 102.784 8.25 103.401 8C104.018 7.73333 104.768 7.6 105.651 7.6C106.551 7.6 107.351 7.78333 108.051 8.15C108.768 8.51667 109.326 9.125 109.726 9.975C110.143 10.8083 110.351 11.9417 110.351 13.375V22H107.676V13.7C107.676 12.9333 107.601 12.275 107.451 11.725C107.301 11.1583 107.026 10.725 106.626 10.425C106.226 10.1083 105.668 9.95 104.951 9.95C104.284 9.95 103.651 10.1417 103.051 10.525C102.451 10.9083 101.959 11.475 101.576 12.225C101.209 12.975 101.026 13.9083 101.026 15.025V22H98.351V8ZM120.046 16.425C120.113 17.1417 120.338 17.7583 120.721 18.275C121.121 18.7917 121.638 19.1833 122.271 19.45C122.921 19.7167 123.654 19.85 124.471 19.85C125.638 19.85 126.579 19.6333 127.296 19.2C128.029 18.75 128.396 18.1083 128.396 17.275C128.396 16.7083 128.196 16.2667 127.796 15.95C127.396 15.6333 126.863 15.3833 126.196 15.2C125.546 15.0167 124.829 14.85 124.046 14.7C123.263 14.5333 122.471 14.35 121.671 14.15C120.888 13.9333 120.163 13.6417 119.496 13.275C118.846 12.8917 118.321 12.3833 117.921 11.75C117.521 11.1 117.321 10.2667 117.321 9.25C117.321 8.28333 117.604 7.41667 118.171 6.65C118.754 5.86667 119.563 5.25 120.596 4.8C121.629 4.33333 122.838 4.1 124.221 4.1C125.488 4.1 126.629 4.35833 127.646 4.875C128.679 5.375 129.496 6.075 130.096 6.975C130.696 7.85833 130.996 8.88333 130.996 10.05H128.071C128.004 8.96667 127.646 8.13333 126.996 7.55C126.363 6.95 125.396 6.65 124.096 6.65C122.796 6.65 121.813 6.89167 121.146 7.375C120.496 7.84167 120.171 8.46667 120.171 9.25C120.171 9.86667 120.371 10.35 120.771 10.7C121.171 11.0333 121.696 11.3 122.346 11.5C123.013 11.6833 123.738 11.85 124.521 12C125.321 12.1333 126.113 12.3083 126.896 12.525C127.679 12.725 128.396 13.0083 129.046 13.375C129.713 13.725 130.246 14.2167 130.646 14.85C131.063 15.4667 131.271 16.275 131.271 17.275C131.271 18.9083 130.654 20.175 129.421 21.075C128.204 21.9583 126.504 22.4 124.321 22.4C122.971 22.4 121.754 22.1417 120.671 21.625C119.604 21.0917 118.754 20.375 118.121 19.475C117.504 18.575 117.171 17.5583 117.121 16.425H120.046ZM133.499 27V24.7H135.124C135.724 24.7 136.183 24.575 136.499 24.325C136.816 24.0917 137.066 23.7667 137.249 23.35C137.449 22.95 137.633 22.4833 137.799 21.95L142.074 8H144.974L140.474 22C140.208 22.8667 139.924 23.6083 139.624 24.225C139.341 24.8583 139.008 25.375 138.624 25.775C138.258 26.1917 137.791 26.5 137.224 26.7C136.674 26.9 135.983 27 135.149 27H133.499ZM136.724 22L132.224 8H135.124L139.274 22H136.724ZM148.136 17.575C148.219 18.425 148.578 19.0583 149.211 19.475C149.861 19.8917 150.636 20.1 151.536 20.1C152.436 20.1 153.153 19.9333 153.686 19.6C154.236 19.2667 154.511 18.7417 154.511 18.025C154.511 17.5917 154.344 17.2667 154.011 17.05C153.694 16.8167 153.269 16.6333 152.736 16.5C152.219 16.3667 151.644 16.25 151.011 16.15C150.394 16.05 149.769 15.925 149.136 15.775C148.503 15.625 147.919 15.4083 147.386 15.125C146.869 14.825 146.453 14.425 146.136 13.925C145.819 13.425 145.661 12.775 145.661 11.975C145.661 11.225 145.894 10.5167 146.361 9.85C146.828 9.16667 147.486 8.625 148.336 8.225C149.203 7.80833 150.203 7.6 151.336 7.6C152.353 7.6 153.286 7.80833 154.136 8.225C154.986 8.625 155.661 9.18333 156.161 9.9C156.678 10.6167 156.936 11.45 156.936 12.4H154.386C154.319 11.55 153.986 10.925 153.386 10.525C152.803 10.1083 152.086 9.9 151.236 9.9C150.269 9.9 149.536 10.1 149.036 10.5C148.553 10.8833 148.311 11.375 148.311 11.975C148.311 12.4417 148.469 12.8 148.786 13.05C149.119 13.3 149.544 13.4917 150.061 13.625C150.594 13.7583 151.178 13.875 151.811 13.975C152.444 14.075 153.069 14.2 153.686 14.35C154.319 14.5 154.894 14.7167 155.411 15C155.944 15.2667 156.369 15.6417 156.686 16.125C157.003 16.6083 157.161 17.2417 157.161 18.025C157.161 18.9083 156.928 19.6833 156.461 20.35C155.994 21 155.328 21.5083 154.461 21.875C153.611 22.225 152.594 22.4 151.411 22.4C150.311 22.4 149.319 22.1917 148.436 21.775C147.553 21.3417 146.844 20.7667 146.311 20.05C145.794 19.3167 145.519 18.4917 145.486 17.575H148.136ZM158.034 8H165.409V10.3H158.034V8ZM160.134 4.5H162.809V18.2C162.809 18.7167 162.934 19.1 163.184 19.35C163.434 19.5833 163.8 19.7 164.284 19.7H165.809V22H164.259C162.892 22 161.859 21.6667 161.159 21C160.475 20.3167 160.134 19.3833 160.134 18.2V4.5ZM173.61 22.4C172.16 22.4 170.901 22.0917 169.835 21.475C168.768 20.8417 167.935 19.9667 167.335 18.85C166.751 17.7333 166.46 16.4583 166.46 15.025C166.46 13.575 166.751 12.2917 167.335 11.175C167.935 10.0583 168.768 9.18333 169.835 8.55C170.901 7.91667 172.16 7.6 173.61 7.6C174.56 7.6 175.451 7.78333 176.285 8.15C177.118 8.51667 177.835 9.05833 178.435 9.775C179.035 10.4917 179.476 11.3667 179.76 12.4C180.043 13.4167 180.118 14.5833 179.985 15.9H167.985V13.65H178.485L177.36 14.425C177.41 13.625 177.293 12.9 177.01 12.25C176.726 11.5833 176.301 11.05 175.735 10.65C175.168 10.25 174.46 10.05 173.61 10.05C172.626 10.05 171.81 10.2667 171.16 10.7C170.51 11.1333 170.018 11.725 169.685 12.475C169.368 13.225 169.21 14.075 169.21 15.025C169.21 15.9583 169.368 16.8 169.685 17.55C170.018 18.3 170.51 18.8917 171.16 19.325C171.81 19.7417 172.626 19.95 173.61 19.95C174.593 19.95 175.368 19.725 175.935 19.275C176.518 18.8083 176.918 18.2417 177.135 17.575H179.985C179.768 18.5417 179.368 19.3833 178.785 20.1C178.218 20.8167 177.493 21.3833 176.61 21.8C175.743 22.2 174.743 22.4 173.61 22.4ZM181.781 8H184.456V22H181.781V8ZM184.456 15.025L184.056 12.275C184.056 11.8417 184.131 11.3583 184.281 10.825C184.431 10.2917 184.672 9.78333 185.006 9.3C185.356 8.8 185.814 8.39167 186.381 8.075C186.964 7.75833 187.697 7.6 188.581 7.6C189.447 7.6 190.206 7.78333 190.856 8.15C191.506 8.51667 192.006 9.125 192.356 9.975C192.722 10.8083 192.906 11.9417 192.906 13.375V22H190.231V13.7C190.231 12.9333 190.172 12.275 190.056 11.725C189.956 11.1583 189.739 10.725 189.406 10.425C189.072 10.1083 188.564 9.95 187.881 9.95C187.297 9.95 186.747 10.1417 186.231 10.525C185.714 10.9083 185.289 11.475 184.956 12.225C184.622 12.975 184.456 13.9083 184.456 15.025ZM192.906 15.025L192.231 12.275C192.231 11.8417 192.314 11.3583 192.481 10.825C192.664 10.2917 192.939 9.78333 193.306 9.3C193.689 8.8 194.181 8.39167 194.781 8.075C195.397 7.75833 196.147 7.6 197.031 7.6C197.897 7.6 198.656 7.78333 199.306 8.15C199.956 8.51667 200.456 9.125 200.806 9.975C201.172 10.8083 201.356 11.9417 201.356 13.375V22H198.681V13.7C198.681 12.9333 198.622 12.275 198.506 11.725C198.406 11.1583 198.189 10.725 197.856 10.425C197.522 10.1083 197.014 9.95 196.331 9.95C195.747 9.95 195.197 10.1417 194.681 10.525C194.164 10.9083 193.739 11.475 193.406 12.225C193.072 12.975 192.906 13.9083 192.906 15.025Z" fill={dark ? "#fafafa" : "#242423"} />
            <defs><clipPath id="hds-clip"><rect width="24" height="24" fill="white" transform="translate(0 1)" /></clipPath></defs>
          </svg>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 999, background: "var(--muted)",
            color: "var(--muted-fg)", border: "1px solid var(--border)", fontWeight: 600
          }}>v1.0</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <a href="https://github.com" target="_blank" rel="noreferrer" style={{ color: "var(--muted-fg)", display: "flex", padding: 6, borderRadius: 6 }}><Github size={15} /></a>
          <a href="https://ui.shadcn.com" target="_blank" rel="noreferrer" style={{ color: "var(--muted-fg)", fontSize: 12, display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 6, border: "1px solid var(--border)", textDecoration: "none" }}>
            <ExternalLink size={10} />Shadcn
          </a>
          <button onClick={() => setDark(d => !d)} style={{
            width: 32, height: 32, borderRadius: 8, border: "1px solid var(--border)",
            background: "var(--muted)", cursor: "pointer", color: "var(--fg)", display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </button>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Mobile overlay */}
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)}
          style={{ position: "fixed", inset: 0, top: 52, background: "rgba(0,0,0,.5)", zIndex: 40, backdropFilter: "blur(4px)" }} />}

        {/* SIDEBAR */}
        <aside style={{
          width: 220, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--bg)",
          display: "flex", flexDirection: "column",
          ...(typeof window !== "undefined" && window.innerWidth < 768
            ? {
              position: "fixed", top: 52, bottom: 0, left: sidebarOpen ? 0 : -260, zIndex: 50, transition: "left .2s ease",
              boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.2)" : "none"
            }
            : {})
        }}>
          <Sidebar active={page} onSelect={p => { setPage(p); setSidebarOpen(false); }} onClose={() => setSidebarOpen(false)} />
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <PageComp id={page} />
          </div>
        </main>
      </div>
    </div>
  );
}
