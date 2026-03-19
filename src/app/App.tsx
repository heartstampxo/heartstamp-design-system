import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import svgPaths from "../imports/svg-lnhmzo4612";
import { Btn } from "./components/ui/btn";
import { Stepper as StepperComp, HorizontalSwapStepper, type StepDef } from "./components/ui/stepper";
import { TopNavDesktop, TopNavMobile } from "./components/ui/hs-nav";
import { HSLogo, HSEmblem, HSLockup, getSvgString, useIsDark } from "./components/ui/hs-logo";
import { ProfileNavDesktop, ProfileNavMobile } from "./components/ui/profile-nav";
import { Inp } from "./components/ui/hs-inp";
import { Lbl } from "./components/ui/hs-lbl";
import { Tarea } from "./components/ui/hs-tarea";
import { Bdg } from "./components/ui/hs-bdg";
import { Avt } from "./components/ui/hs-avt";
import { Sep } from "./components/ui/hs-sep";
import { Swt } from "./components/ui/hs-swt";
import { Cbx } from "./components/ui/hs-cbx";
import { Rdo } from "./components/ui/hs-rdo";
import { Sel } from "./components/ui/hs-sel";
import { Sldr } from "./components/ui/hs-sldr";
import { Prg } from "./components/ui/hs-prg";
import { Skl } from "./components/ui/hs-skl";
import { Alrt } from "./components/ui/hs-alrt";
import { Crd, CrdHeader, CrdBody, CrdFooter, CrdTitle, CrdDesc } from "./components/ui/hs-crd";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/tabs";
import { Acc } from "./components/ui/hs-acc";
import { Tip } from "./components/ui/hs-tip";
import { Dlg } from "./components/ui/hs-dlg";
import { Sht } from "./components/ui/hs-sht";
import { DdMenu } from "./components/ui/hs-dd-menu";
import { Ppvr } from "./components/ui/hs-ppvr";
import { HvrCard } from "./components/ui/hs-hvr-card";
import { Tbl } from "./components/ui/hs-tbl";
import { Brd } from "./components/ui/hs-brd";
import { Pgn } from "./components/ui/hs-pgn";
import { Cmd } from "./components/ui/hs-cmd";
import { Tgl } from "./components/ui/hs-tgl";
import { CalMini } from "./components/ui/hs-cal";
import { Collapsible } from "./components/ui/hs-collapsible";
import { ScrollBox } from "./components/ui/hs-scroll-box";
import { CtxMenu } from "./components/ui/hs-ctx-menu";
import {
  DARK_THEME, LIGHT_THEME,
  LIGHT_TOKENS, DARK_TOKENS, TOKEN_VARIABLE_NAMES, GROUP_DESCRIPTIONS,
} from "./theme";
import {
  Moon, Sun, Menu, X, Github, Eye,
  ChevronLeft, ChevronRight, ChevronDown, Monitor, Copy, Check,
  ExternalLink, Info, AlertTriangle, CheckCircle2, XCircle,
  Mail, ArrowRight, Loader2, Package, Palette, Zap, BookOpen,
  User, Bell, Settings, LogOut, Search, Plus, Trash2, Edit,
  Star, Home, FileText, MoreHorizontal, AlertCircle,
  Calendar, ChevronsLeft, ChevronsRight, Upload, RefreshCw,
  AppWindow, Code2, Download, CreditCard, MapPin, History, Shield, Lock,
  Contrast, AtSign, CalendarDays, CalendarCheck, Wallet,
} from "lucide-react";
import * as LucideIcons from "lucide-react";
import { NAV, ALL_ITEMS } from "./nav-config";
import { CodeBlock, InstallBlock } from "./components/docs/doc-code-block";
import { Preview } from "./components/docs/doc-preview";
import { PropsTable } from "./components/docs/doc-props-table";
import { DocPage, DocSection } from "./components/docs/doc-page";
import { Callout } from "./components/docs/doc-callout";
import { Sidebar } from "./components/docs/doc-sidebar";
import { PlaceholderPage } from "./components/docs/doc-placeholder";

/* NAV CONFIG & ALL_ITEMS → imported from ./nav-config */

const LABEL_COLORS: Record<string, { bg: string; color: string }> = {
  new:        { bg: "rgba(16,185,129,.13)", color: "#10b981" },
  beta:       { bg: "rgba(245,158,11,.13)",  color: "#f59e0b" },
  deprecated: { bg: "rgba(239,68,68,.13)",   color: "#ef4444" },
};

/* ═══════════════════════════════════════════════════════════
   DOC COMPONENTS → ./components/docs/
   UI PRIMITIVES  → ./components/ui/
═══════════════════════════════════════════════════════════ */


/* ═══════════════════════════════════════════════════════════
   COMPONENT PREVIEW
═══════════════════════════════════════════════════════════ */

/* PREVIEW_DARK_VARS → imported from ./theme */


function _DEAD_Preview({ title, code, filename, children, height = 160 }: any) {
  const [tab, setTab] = useState("preview");
  const [vp, setVp] = useState("full");
  const [dark, setDark] = useState(false);
  const vpW = ([] as any[]).find(v => v.id === vp)?.w || "100%";

  /* ── render-prop support: children can be (vp: string) => ReactNode ── */
  const renderedChildren = typeof children === "function" ? children(vp) : children;
  const tabS = (a: string) => ({
    display: "inline-flex", alignItems: "center", gap: 5, padding: "4px 10px",
    borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: "pointer", border: "none",
    background: tab === a ? "var(--bg)" : "transparent", color: tab === a ? "var(--fg)" : "var(--muted-fg)",
    boxShadow: tab === a ? "0 1px 3px rgba(0,0,0,.12)" : "none", transition: "all .12s"
  });
  return <div style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 20 }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "6px 10px", background: "var(--muted)", borderBottom: "1px solid var(--border)",
      borderRadius: "12px 12px 0 0"
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
        {([] as any[]).map(v => (
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
        ...(dark ? ({} as any) : {}),
        background: dark ? "#09090b" : "var(--bg)", padding: 16, minHeight: height,
        display: "flex", alignItems: "center", justifyContent: "center", position: "relative", transition: "background .2s",
        borderRadius: "0 0 12px 12px", overflow: "visible"
      } as React.CSSProperties}>
        <div style={{
          maxWidth: vpW, width: "100%", transition: "max-width .3s",
          border: vp !== "full" && vp !== "desktop" ? "1px dashed var(--border)" : "none", borderRadius: 8
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
            gap: 10, padding: "16px", minHeight: height
          }}>
            {renderedChildren}
          </div>
        </div>
      </div>
      : null}
  </div>;
}
/* ═══════════════════════════════════════════════════════════
   ALL COMPONENT PAGES
═══════════════════════════════════════════════════════════ */
function PageButton() {
  const [loading, setLoading] = useState(false);
  return <DocPage title="Button" subtitle="Triggers an action or event — submit a form, open a dialog, or navigate." sourceSlug="button">
    <DocSection title="Variants">
      <Preview title="All variants" code={`{/* Primary */}\n<Button size="sm" variant="default">Button</Button>\n<Button variant="default">Button</Button>\n<Button size="lg" variant="default">Button</Button>\n\n{/* Secondary */}\n<Button size="sm" variant="secondary">Button</Button>\n<Button variant="secondary">Button</Button>\n<Button size="lg" variant="secondary">Button</Button>\n\n{/* Outline */}\n<Button size="sm" variant="outline">Button</Button>\n<Button variant="outline">Button</Button>\n<Button size="lg" variant="outline">Button</Button>\n\n{/* Link */}\n<Button size="sm" variant="link">Button</Button>\n<Button variant="link">Button</Button>\n<Button size="lg" variant="link">Button</Button>\n\n{/* Icon only */}\n<Button size="icon" variant="default"><Plus size={14} /></Button>\n<Button size="icon" variant="secondary"><Search size={14} /></Button>\n<Button size="icon" variant="outline"><Star size={14} /></Button>`} filename="button-variants.tsx">
        {(() => {
          const labelStyle: React.CSSProperties = {
            width: 90, flexShrink: 0, fontSize: 11, fontFamily: "monospace",
            color: "var(--muted-fg)", letterSpacing: ".01em"
          };
          const row = (label: string, children: React.ReactNode) => (
            <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
              <span style={labelStyle}>{label}</span>
              {children}
            </div>
          );
          return (
            <div style={{ display: "flex", flexDirection: "column", gap: 14, width: "100%", padding: "4px 0" }}>
              {row("Primary", <>
                <Btn size="sm" variant="default">Button</Btn>
                <Btn variant="default">Button</Btn>
                <Btn size="lg" variant="default">Button</Btn>
              </>)}
              {row("Secondary", <>
                <Btn size="sm" variant="secondary">Button</Btn>
                <Btn variant="secondary">Button</Btn>
                <Btn size="lg" variant="secondary">Button</Btn>
              </>)}
              {row("Outline", <>
                <Btn size="sm" variant="outline">Button</Btn>
                <Btn variant="outline">Button</Btn>
                <Btn size="lg" variant="outline">Button</Btn>
              </>)}
              {row("Link", <>
                <Btn size="sm" variant="link">Button</Btn>
                <Btn variant="link">Button</Btn>
                <Btn size="lg" variant="link">Button</Btn>
              </>)}
              {row("Icon only", <>
                <Btn size="icon" variant="default"><IcoLink name="Plus"><Plus size={16} /></IcoLink></Btn>
                <Btn size="icon" variant="secondary"><IcoLink name="Search"><Search size={16} /></IcoLink></Btn>
                <Btn size="icon" variant="outline"><IcoLink name="Star"><Star size={16} /></IcoLink></Btn>
              </>)}
            </div>
          );
        })()}
      </Preview>
    </DocSection>
    <DocSection title="Sizes">
      <Preview title="All sizes" code={`// Padding & font-size are fully token-driven:\n// --btn-padding-lg / --btn-padding-default / --btn-padding-sm / --btn-padding-icon\n// --font-size-btn-lg / --font-size-btn / --font-size-btn-sm\n<Button size="lg">Large</Button>\n<Button size="default">Default</Button>\n<Button size="sm">Small</Button>\n<Button size="icon"><ChevronRight size={14} /></Button>`} filename="button-sizes.tsx">
        <Btn size="lg">Large</Btn><Btn>Default</Btn><Btn size="sm">Small</Btn>
        <Btn size="icon"><ChevronRight size={16} /></Btn>
      </Preview>
    </DocSection>
    <DocSection title="With Icons">
      {React.createElement(() => {
        const [iconSize, setIconSize] = useState<"sm"|"default"|"lg">("default");
        const sizeAttr = iconSize === "default" ? "" : ` size="${iconSize}"`;
        const code = `// Each variant supports a labeled + icon-only form.\n// The size tab controls padding/font across all variants.\n\n<Button${sizeAttr}><Plus size={14} /> Create</Button>\n<Button${sizeAttr} size="icon"><Plus size={14} /></Button>\n\n<Button variant="secondary"${sizeAttr}><Upload size={14} /> Export</Button>\n<Button variant="secondary"${sizeAttr} size="icon"><Upload size={14} /></Button>\n\n<Button variant="outline"${sizeAttr}><ArrowRight size={14} /> Learn more</Button>\n<Button variant="outline"${sizeAttr} size="icon"><ArrowRight size={14} /></Button>\n\n<Button variant="ghost"${sizeAttr}><Star size={14} /> Favourite</Button>\n<Button variant="ghost"${sizeAttr} size="icon"><Star size={14} /></Button>`;
        const labelStyle: React.CSSProperties = {
          width: 90, flexShrink: 0, fontSize: 11, fontFamily: "monospace",
          color: "var(--muted-fg)", letterSpacing: ".01em"
        };
        const iconOnlySize = ({ sm: "icon-sm", default: "icon", lg: "icon-lg" } as const)[iconSize];
        const rows: { label: string; variant: "default"|"secondary"|"outline"|"ghost"; icon: React.ReactNode; text: string }[] = [
          { label: "Primary",   variant: "default",   icon: <Plus size={16} />,      text: "Create"    },
          { label: "Secondary", variant: "secondary", icon: <Upload size={16} />,     text: "Export"    },
          { label: "Outline",   variant: "outline",   icon: <ArrowRight size={16} />, text: "Learn more"},
          { label: "Ghost",     variant: "ghost",     icon: <Star size={16} />,       text: "Favourite" },
        ];
        const sizes: ("sm"|"default"|"lg")[] = ["sm", "default", "lg"];
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tabs value={iconSize} onValueChange={(v) => setIconSize(v as typeof iconSize)}>
                <TabsList>
                  {sizes.map(s => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
                </TabsList>
              </Tabs>
            </div>
            <Preview title="Icon buttons" code={code}>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", padding: "4px 0" }}>
                {rows.map(({ label, variant, icon, text }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={labelStyle}>{label}</span>
                    <Btn variant={variant} size={iconSize}>{icon}{text}</Btn>
                    <Btn variant={variant} size={iconOnlySize}>{icon}</Btn>
                  </div>
                ))}
              </div>
            </Preview>
          </>
        );
      })}
    </DocSection>
    {false && <DocSection title="__x">
      <span />
      <Preview title="Loading" code={`<Button disabled>\n  <Loader2 size={14} style={{ marginRight: 6, animation: "spin 1s linear infinite" }} />\n  Please wait\n</Button>`}>
        <Btn disabled={loading} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000); }}>
          {loading && <Loader2 size={16} style={{ marginRight: 6, animation: "spin 1s linear infinite" }} />}
          {loading ? "Please wait…" : "Click to simulate load"}
        </Btn>
      </Preview>
    </DocSection>}
    <DocSection title="Loading State">
      {React.createElement(() => {
        const [loadSize, setLoadSize] = useState<"sm"|"default"|"lg">("default");
        const [loadingLocal, setLoadingLocal] = useState(false);
        const sizes: ("sm"|"default"|"lg")[] = ["sm", "default", "lg"];
        const sizeStr = loadSize === "default" ? "" : ` size="${loadSize}"`;
        const code = [`<Button${sizeStr} disabled>`, `  <Loader2 size={14} style={{ marginRight: 6, animation: "spin 1s linear infinite" }} />`, `  Please wait`, `</Button>`].join("\n");
        return (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Tabs value={loadSize} onValueChange={(v) => setLoadSize(v as typeof loadSize)}>
                <TabsList>
                  {sizes.map(s => <TabsTrigger key={s} value={s}>{s}</TabsTrigger>)}
                </TabsList>
              </Tabs>
            </div>
            <Preview title="Loading" code={code}>
              <Btn size={loadSize} disabled={loadingLocal} onClick={() => { setLoadingLocal(true); setTimeout(() => setLoadingLocal(false), 2000); }}>
                {loadingLocal && <IcoLink name="Loader2"><Loader2 size={16} style={{ marginRight: 6, animation: "spin 1s linear infinite" }} /></IcoLink>}
                {loadingLocal ? "Please wait…" : "Click to simulate load"}
              </Btn>
            </Preview>
          </>
        );
      })}
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "variant", type: '"default"|"secondary"|"ghost"|"secondary-ghost"|"outline"|"link"|"destructive"', def: '"default"', desc: 'Visual style of the button. Colors sourced from --accent, --secondary, --accent-subtle, --secondary-subtle, and --border tokens.' },
        { name: "size", type: '"default"|"sm"|"lg"|"icon"', def: '"default"', desc: "Size variant — maps to --btn-padding-* and --font-size-btn-* token vars." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables interaction and reduces opacity to 0.5." },
        { name: "onClick", type: "() => void", def: "—", desc: "Click handler passed directly to the underlying <button> element." },
        { name: "style", type: "React.CSSProperties", def: "—", desc: "Inline style overrides applied after all variant and hover styles." },
        { name: "children", type: "React.ReactNode", def: "—", desc: "Button label or content, including optional icons." },
      ]} />
    </DocSection>
    <DocSection title="Design Tokens" desc="All visual properties of the Button are driven by CSS token variables. Override these in your theme to restyle every button variant at once.">
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "var(--muted)", padding: "8px 16px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.6fr", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
          <span>Token</span><span>Value</span><span>Category</span><span>Usage</span>
        </div>
        {[
          { token: "--radius-button",     value: "25px",       cat: "Radius",      usage: "Border radius on all button variants" },
          { token: "--btn-padding-sm",    value: "8px 12px",   cat: "Spacing",     usage: "Padding for size=\"sm\"" },
          { token: "--btn-padding-default", value: "10px 16px", cat: "Spacing",     usage: "Padding for size=\"default\"" },
          { token: "--btn-padding-lg",    value: "12px 20px",  cat: "Spacing",     usage: "Padding for size=\"lg\"" },
          { token: "--btn-padding-icon",  value: "8px",        cat: "Spacing",     usage: "Padding for size=\"icon\"" },
          { token: "--btn-gap",           value: "6px",        cat: "Spacing",     usage: "Gap between icon and label content" },
          { token: "--font-size-btn-sm",  value: "12px",       cat: "Typography",  usage: "Font size for size=\"sm\"" },
          { token: "--font-size-btn",     value: "13px",       cat: "Typography",  usage: "Font size for size=\"default\"" },
          { token: "--font-size-btn-lg",  value: "15px",       cat: "Typography",  usage: "Font size for size=\"lg\"" },
          { token: "--font-weight-btn",   value: "500",        cat: "Typography",  usage: "Font weight across all variants" },
          { token: "--accent",            value: "var(--accent)", cat: "Color",    usage: "Background — default (primary filled)" },
          { token: "--accent-hover",      value: "var(--accent-hover)", cat: "Color", usage: "Hover background — default variant" },
          { token: "--text-on-primary",   value: "var(--text-on-primary)", cat: "Color", usage: "Text color — default & destructive variants" },
          { token: "--secondary",         value: "var(--secondary)", cat: "Color", usage: "Background — secondary filled variant" },
          { token: "--secondary-hover",   value: "var(--secondary-hover)", cat: "Color", usage: "Hover background — secondary variant" },
          { token: "--text-on-secondary", value: "var(--text-on-secondary)", cat: "Color", usage: "Text color — secondary variant" },
          { token: "--accent-subtle",     value: "var(--accent-subtle)", cat: "Color", usage: "Background — ghost variant (rest & hover base)" },
          { token: "--secondary-subtle",  value: "var(--secondary-subtle)", cat: "Color", usage: "Background — secondary-ghost variant" },
          { token: "--border",            value: "var(--border)", cat: "Color",    usage: "Border color — outline variant" },
          { token: "--state-hover",       value: "var(--state-hover)", cat: "Color", usage: "Hover background — outline & secondary-ghost" },
        ].map((row, i) => (
          <div key={row.token} style={{ padding: "10px 16px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.6fr", gap: 12, alignItems: "center", borderBottom: i < 19 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "var(--bg)" : "var(--muted)" }}>
            <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--accent)" }}>{row.token}</code>
            <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--fg)", background: "var(--color-element-disabled)", padding: "2px 6px", borderRadius: 4 }}>{row.value}</code>
            <span style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>{row.cat}</span>
            <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>{row.usage}</span>
          </div>
        ))}
      </div>
    </DocSection>
  </DocPage>;
}

function PageInput() {
  const [v, setV] = useState("");
  const [ve, setVe] = useState("invalid@");
  return <DocPage title="Input" subtitle="Displays a form input field for text entry." sourceSlug="input">
    <DocSection title="Default">
      <Preview title="Default input" code={`<Input placeholder="Email" />`}>
        <div style={{ width: 280 }}><Inp placeholder="Email" value={v} onChange={(e: any) => setV(e.target.value)} /></div>
      </Preview>
    </DocSection>
    <DocSection title="Filled">
      <Preview title="Filled input" code={`<Input placeholder="Email" value="user@example.com" />`}>
        <div style={{ width: 280 }}><Inp placeholder="Email" value="user@example.com" onChange={() => {}} /></div>
      </Preview>
    </DocSection>
    <DocSection title="Focus">
      <Preview title="Focus state" code={`// Focus state — border transitions to var(--secondary) on focus\n<Input placeholder="Click to focus" />`}>
        <div style={{ width: 280 }}><Inp placeholder="Click to focus" value="" onChange={() => {}} /></div>
      </Preview>
    </DocSection>
    <DocSection title="Error">
      <Preview title="Error state" code={`<Input placeholder="Email" error />\n<p style={{ color: "var(--state-error)", fontSize: 13, marginTop: 6 }}>Please enter a valid email address.</p>`}>
        <div style={{ width: 280 }}>
          <Inp placeholder="Email" value={ve} onChange={(e: any) => setVe(e.target.value)} error />
          <p style={{ color: "var(--state-error)", fontSize: 13, marginTop: 6, marginBottom: 0 }}>Please enter a valid email address.</p>
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Disabled">
      <Preview title="Disabled state" code={`<Input disabled placeholder="Disabled input" />`}>
        <div style={{ width: 280 }}><Inp placeholder="Disabled input" disabled /></div>
      </Preview>
    </DocSection>
    <DocSection title="With Label">
      <Preview title="Labelled input" code={`<div style={{ display: "flex", flexDirection: "column", gap: 6 }}>\n  <Label htmlFor="email">Email</Label>\n  <Input id="email" type="email" placeholder="m@example.com" />\n</div>`}>
        <div style={{ width: 280 }}>
          <Lbl>Email</Lbl><Inp id="email" type="email" placeholder="m@example.com" />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Types">
      <Preview title="Input types" code={`<Input type="text" placeholder="Text" />\n<Input type="password" placeholder="Password" />\n<Input type="number" placeholder="Number" />`}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, width: 280 }}>
          <Inp placeholder="Text" /><Inp type="password" placeholder="Password" /><Inp type="number" placeholder="Number" />
        </div>
      </Preview>
    </DocSection>
    <DocSection title="Complete Form" desc="A real-world form combining Input, Select, Textarea, and Button components — all wired to design tokens.">
      <Preview title="Feedback form" height={520} code={`function FeedbackForm() {\n  const [name, setName] = useState("");\n  const [category, setCategory] = useState("");\n\n  return (\n    <div style={{\n      background: "var(--bg-input)", borderRadius: 16,\n      border: "1px solid var(--border)", width: 420,\n      display: "flex", flexDirection: "column",\n      overflow: "hidden", position: "relative"\n    }}>\n\n      {/* Close button */}\n      <button style={{\n        position: "absolute", top: 16, right: 16,\n        background: "none", border: "none", cursor: "pointer",\n        opacity: 0.5, color: "var(--fg)", padding: 4\n      }}>\n        <X size={14} style={{ display: "block" }} />\n      </button>\n\n      {/* Fields */}\n      <div style={{ display: "flex", flexDirection: "column",\n        gap: 20, padding: "24px 24px 0" }}>\n        <div>\n          <Label>Name</Label>\n          <Input placeholder="Your Name"\n            value={name} onChange={e => setName(e.target.value)} />\n        </div>\n        <div>\n          <Label>Category</Label>\n          <Select\n            options={[\n              { value: "design",  label: "Design Request" },\n              { value: "bug",     label: "Bug Report" },\n              { value: "feature", label: "Feature Request" },\n            ]}\n            placeholder="Design Request"\n            value={category}\n            onChange={setCategory}\n          />\n        </div>\n        <div>\n          <Label>Tell us more</Label>\n          <Textarea placeholder="Enter address" rows={4} />\n        </div>\n      </div>\n\n      {/* Action bar */}\n      <div style={{\n        display: "flex", gap: 24, padding: "14px 24px",\n        borderTop: "1px solid var(--border)", marginTop: 32\n      }}>\n        <Button variant="outline" style={{ flex: 1 }}>Cancel</Button>\n        <Button style={{ flex: 1 }}>Submit Feedback</Button>\n      </div>\n    </div>\n  );\n}`}>
        {(() => {
          const [name, setName] = useState("");
          const [category, setCategory] = useState("");
          return (
            <div style={{
              background: "var(--bg-input)", borderRadius: 16,
              border: "1px solid var(--border)", width: 420,
              display: "flex", flexDirection: "column", overflow: "hidden",
              position: "relative", boxShadow: "0 2px 16px rgba(0,0,0,0.06)"
            }}>
              {/* Close × */}
              <button style={{
                position: "absolute", top: "var(--space-4)", right: "var(--space-4)", background: "none",
                border: "none", cursor: "pointer", opacity: 0.5,
                color: "var(--fg)", padding: "var(--space-1)", display: "flex",
                alignItems: "center", justifyContent: "center", borderRadius: 4
              }}>
                <IcoLink name="X"><X size={14} style={{ display: "block" }} /></IcoLink>
              </button>

              {/* Fields */}
              <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)", padding: "var(--space-6) var(--space-6) 0" }}>
                <div>
                  <Lbl>Name</Lbl>
                  <Inp placeholder="Your Name" value={name} onChange={(e: any) => setName(e.target.value)} />
                </div>
                <div>
                  <Lbl>Category</Lbl>
                  <Sel
                    options={[
                      { value: "design",  label: "Design Request" },
                      { value: "bug",     label: "Bug Report" },
                      { value: "feature", label: "Feature Request" },
                    ]}
                    placeholder="Design Request"
                    value={category}
                    onChange={setCategory}
                  />
                </div>
                <div>
                  <Lbl>Tell us more</Lbl>
                  <Tarea placeholder="Enter address" rows={4} />
                </div>
              </div>

              {/* Action bar */}
              <div style={{
                display: "flex", gap: "var(--space-6)", alignItems: "center",
                padding: "var(--space-3-5) var(--space-6)", borderTop: "1px solid var(--border)", marginTop: "var(--space-8)"
              }}>
                <Btn variant="outline" style={{ flex: 1 }}>Cancel</Btn>
                <Btn style={{ flex: 1 }}>Submit Feedback</Btn>
              </div>
            </div>
          );
        })()}
      </Preview>
    </DocSection>
    <DocSection title="Props">
      <PropsTable props={[
        { name: "type", type: "string", def: '"text"', desc: 'HTML input type attribute (e.g. "text", "email", "password", "number").' },
        { name: "placeholder", type: "string", desc: "Placeholder text shown when empty. Renders in #6e6d6a." },
        { name: "value", type: "string", desc: "Controlled value of the input." },
        { name: "onChange", type: "React.ChangeEventHandler<HTMLInputElement>", desc: "Change event handler for controlled inputs." },
        { name: "disabled", type: "boolean", def: "false", desc: "Disables the input and reduces opacity to 0.5." },
        { name: "error", type: "boolean", def: "false", desc: "Shows error state — border changes to var(--state-error). Combine with an error message below the input." },
        { name: "id", type: "string", desc: "HTML id attribute, used to associate with a <Label> via htmlFor." },
        { name: "style", type: "React.CSSProperties", def: "—", desc: "Inline style overrides applied after all base styles." },
      ]} />
    </DocSection>
    <DocSection title="Design Tokens" desc="All visual properties of the Input are driven by CSS token variables. Override these in your theme to restyle every input state at once.">
      <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "var(--muted)", padding: "8px 16px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.6fr", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
          <span>Token</span><span>Value</span><span>Category</span><span>Usage</span>
        </div>
        {[
          { token: "--radius-input",         value: "32px",                 cat: "Radius",      usage: "Border radius of the input field" },
          { token: "--inp-padding",           value: "10px 12px",            cat: "Spacing",     usage: "Inner padding of the input" },
          { token: "--font-size-inp",         value: "15px",                 cat: "Typography",  usage: "Font size of input text" },
          { token: "--inp-opacity-disabled",  value: "0.5",                  cat: "State",       usage: "Opacity when the input is disabled" },
          { token: "--bg-input",              value: "var(--bg-input)",      cat: "Color",       usage: "Background fill of the input" },
          { token: "--fg",                    value: "var(--fg)",            cat: "Color",       usage: "Text color of the entered value" },
          { token: "--muted-fg",              value: "var(--muted-fg)",      cat: "Color",       usage: "Placeholder text color" },
          { token: "--border",                value: "var(--border)",        cat: "Color",       usage: "Default border — rest state" },
          { token: "--secondary",             value: "var(--secondary)",     cat: "Color",       usage: "Border color — focus state" },
          { token: "--state-error",           value: "var(--state-error)",   cat: "Color",       usage: "Border color — error state" },
        ].map((row, i) => (
          <div key={row.token} style={{ padding: "10px 16px", display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr 1.6fr", gap: 12, alignItems: "center", borderBottom: i < 9 ? "1px solid var(--border)" : "none", background: i % 2 === 0 ? "var(--bg)" : "var(--muted)" }}>
            <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--accent)" }}>{row.token}</code>
            <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--fg)", background: "var(--color-element-disabled)", padding: "2px 6px", borderRadius: 4 }}>{row.value}</code>
            <span style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>{row.cat}</span>
            <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>{row.usage}</span>
          </div>
        ))}
      </div>
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
  const [a, setA] = useState(false); const [b, setB] = useState(true);
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
  const [smA, setSmA] = useState(false);
  const [smB, setSmB] = useState(true);
  const [lgA, setLgA] = useState(false);
  const [lgB, setLgB] = useState(true);
  return (
    <DocPage title="Switch" subtitle="A control that allows the user to toggle between checked and unchecked states. Available in sm (40×24) and lg (58×32) sizes." sourceSlug="switch">

      {/* sm variant */}
      <DocSection title="Small — 40×24" desc="Default size. Use for dense UIs, settings lists, and inline controls.">
        <Preview title="Switch · sm" code={
`<Switch size="sm" checked={false} onCheckedChange={setChecked} label="Airplane Mode" />
<Switch size="sm" checked={true}  onCheckedChange={setChecked} label="Dark Mode" />`
        }>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <Swt size="sm" checked={smA} onChange={setSmA} label="Airplane Mode" />
            <Swt size="sm" checked={smB} onChange={setSmB} label="Dark Mode" />
          </div>
        </Preview>
      </DocSection>

      {/* lg variant */}
      <DocSection title="Large — 58×32" desc="Prominent size. Use for primary feature toggles, onboarding, and accessibility-first contexts.">
        <Preview title="Switch · lg" code={
`<Switch size="lg" checked={false} onCheckedChange={setChecked} label="Notifications" />
<Switch size="lg" checked={true}  onCheckedChange={setChecked} label="Location Access" />`
        }>
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
            <Swt size="lg" checked={lgA} onChange={setLgA} label="Notifications" />
            <Swt size="lg" checked={lgB} onChange={setLgB} label="Location Access" />
          </div>
        </Preview>
      </DocSection>

      {/* Disabled */}
      <DocSection title="Disabled" desc="Non-interactive state. Track and thumb render at reduced opacity with a muted palette — cursor switches to not-allowed.">
        <Preview title="Disabled" code={
`{/* sm disabled */}
<Switch size="sm" checked={false} disabled label="Disabled off" />
<Switch size="sm" checked={true}  disabled label="Disabled on"  />
{/* lg disabled */}
<Switch size="lg" checked={false} disabled label="Disabled off" />
<Switch size="lg" checked={true}  disabled label="Disabled on"  />`
        }>
          <div style={{ display: "flex", gap: "var(--space-8)", flexWrap: "wrap" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "var(--space-1)" }}>sm</div>
              <Swt size="sm" checked={false} onChange={() => {}} label="Disabled off" disabled />
              <Swt size="sm" checked={true}  onChange={() => {}} label="Disabled on"  disabled />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".06em", marginBottom: "var(--space-1)" }}>lg</div>
              <Swt size="lg" checked={false} onChange={() => {}} label="Disabled off" disabled />
              <Swt size="lg" checked={true}  onChange={() => {}} label="Disabled on"  disabled />
            </div>
          </div>
        </Preview>
      </DocSection>

      {/* Props */}
      <DocSection title="Props">
        <PropsTable props={[
          { name: "size",            type: '"sm" | "lg"',                    def: '"sm"',  desc: "sm = 40×24 px · lg = 58×32 px." },
          { name: "checked",         type: "boolean",                        def: "",      desc: "Controlled checked state." },
          { name: "defaultChecked",  type: "boolean",                        def: "false", desc: "Initial state (uncontrolled)." },
          { name: "disabled",        type: "boolean",                        def: "false", desc: "Disables interaction; applies muted track + thumb palette." },
          { name: "onCheckedChange", type: "(checked: boolean) => void",     def: "",      desc: "Callback fired on toggle." },
          { name: "label",           type: "string",                         def: "",      desc: "Optional text label rendered beside the track." },
        ]} />
      </DocSection>
    </DocPage>
  );
}

function PageSlider() {
  const [v, setV] = useState(33);
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
          <Sldr value={Math.round(v / 10) * 10} onChange={(val: number) => setV(Math.round(val / 10) * 10)} />
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
        <Bdg><IcoLink name="Star"><Star size={10} style={{ marginRight: 4 }} /></IcoLink>Featured</Bdg>
        <Bdg variant="secondary"><IcoLink name="Bell"><Bell size={10} style={{ marginRight: 4 }} /></IcoLink>3 New</Bdg>
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
        <Crd style={{ width: "100%", maxWidth: 340, overflow: "visible" }}>
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
            <IcoLink name="Bell"><Bell size={18} style={{ color: "var(--accent)", marginTop: 2 }} /></IcoLink>
            <div>
              <CrdTitle>Push Notifications</CrdTitle>
              <CrdDesc>Send notifications to device.</CrdDesc>
            </div>
            <Swt checked={true} onChange={() => { }} />
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
        { name: "scrollHideDelay", type: "number", def: "600", desc: "Duration in ms before scrollbar hides." },
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
  const [toasts, setToasts] = useState<any[]>([]);
  const add = (type: string) => {
    const id = Date.now();
    const msgs: any = {
      default: { title: "Notification", desc: "Your message has been sent.", icon: <IcoLink name="Bell"><Bell size={14} /></IcoLink> },
      success: { title: "Success!", desc: "Component installed successfully.", icon: <CheckCircle2 size={14} style={{ color: "#22c55e" }} /> },
      error: { title: "Something went wrong", desc: "Please try again later.", icon: <XCircle size={14} style={{ color: "#ef4444" }} /> },
      warning: { title: "Warning", desc: "Free tier limit approaching.", icon: <AlertTriangle size={14} style={{ color: "#f59e0b" }} /> }
    };
    const m = msgs[type];
    setToasts(t => [...t, { id, ...m, type }]);
    setTimeout(() => setToasts(t => t.filter((x: any) => x.id !== id)), 3500);
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
            {toasts.map((t: any) => (
              <div key={t.id} style={{
                background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 10,
                padding: "12px 16px", boxShadow: "0 8px 24px rgba(0,0,0,.15)",
                animation: "slideIn .25s ease", display: "flex", alignItems: "flex-start", gap: 10, pointerEvents: "all"
              }}>
                {t.icon}
                <div><div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{t.title}</div>
                  <div style={{ fontSize: 12, color: "var(--muted-fg)", marginTop: 2 }}>{t.desc}</div></div>
                <button onClick={() => setToasts(ts => ts.filter((x: any) => x.id !== t.id))} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "var(--muted-fg)", padding: 2 }}><IcoLink name="X"><X size={12} /></IcoLink></button>
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
          <IcoLink name="Trash2"><Trash2 size={16} style={{ marginRight: 6 }} /></IcoLink>Delete Account
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
          <Tip label="Add to library"><Btn variant="outline" size="icon"><IcoLink name="Plus"><Plus size={16} /></IcoLink></Btn></Tip>
          <Tip label="Delete item"><Btn variant="outline" size="icon"><IcoLink name="Trash2"><Trash2 size={16} /></IcoLink></Btn></Tip>
          <Tip label="Edit profile"><Btn variant="outline" size="icon"><IcoLink name="Edit"><Edit size={16} /></IcoLink></Btn></Tip>
          <Tip label="Open settings"><Btn variant="ghost" size="icon"><IcoLink name="Settings"><Settings size={16} /></IcoLink></Btn></Tip>
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
        <DdMenu trigger={<Btn variant="outline">My Account<ChevronDown size={16} style={{ marginLeft: 6 }} /></Btn>} items={items} />
      </Preview>
    </DocSection>
    <DocSection title="With Icons">
      <Preview title="Icon dropdown" code={`<DropdownMenu>\n  <DropdownMenuTrigger asChild>\n    <Button variant="ghost" size="icon"><MoreHorizontal /></Button>\n  </DropdownMenuTrigger>\n</DropdownMenu>`}>
        <DdMenu trigger={<Btn variant="ghost" size="icon"><MoreHorizontal size={16} /></Btn>}
          items={[{ label: "Edit", icon: <IcoLink name="Edit"><Edit size={13} /></IcoLink> }, { label: "Duplicate", icon: <RefreshCw size={13} /> }, { separator: true }, { label: "Delete", icon: <IcoLink name="Trash2"><Trash2 size={13} /></IcoLink>, destructive: true }]} />
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
          { label: "Inspect", icon: <IcoLink name="Search"><Search size={13} /></IcoLink> }]}>
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
        { name: "filter", type: "(value: string, search: string) => number", desc: "Custom filter function." },
        { name: "shouldFilter", type: "boolean", def: "true", desc: "Whether to filter items based on the search value." },
        { name: "loop", type: "boolean", def: "false", desc: "Whether keyboard navigation loops." },
      ]} />
    </DocSection>
  </DocPage>;
}

function PageTabs() {
  return <DocPage title="Tabs" subtitle="A set of layered sections of content that are displayed one at a time." sourceSlug="tabs">

    {/* ── Default ─────────────────────────────────────────────── */}
    <DocSection title="Default">
      <Preview title="Tabs" code={`<Tabs defaultValue="account">\n  <TabsList>\n    <TabsTrigger value="account">Account</TabsTrigger>\n    <TabsTrigger value="password">Password</TabsTrigger>\n    <TabsTrigger value="notifications">Notifications</TabsTrigger>\n  </TabsList>\n</Tabs>`} height={100}>
        <Tabs defaultValue="account">
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview>
    </DocSection>

    {/* ── With Icons ───────────────────────────────────────────── */}
    <DocSection title="With Icons">
      <Preview title="Tabs — with icons" code={`<Tabs defaultValue="preview">\n  <TabsList>\n    <TabsTrigger value="preview">\n      <AppWindow size={14} style={{ display: "inline-block" }} />\n      Preview\n    </TabsTrigger>\n    <TabsTrigger value="code">\n      <Code2 size={14} style={{ display: "inline-block" }} />\n      Code\n    </TabsTrigger>\n  </TabsList>\n</Tabs>`} height={100}>
        <Tabs defaultValue="preview">
          <TabsList>
            <TabsTrigger value="preview">
              <AppWindow size={14} style={{ display: "inline-block" }} />
              Preview
            </TabsTrigger>
            <TabsTrigger value="code">
              <Code2 size={14} style={{ display: "inline-block" }} />
              Code
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview>
    </DocSection>

    {/* ── Disabled ─────────────────────────────────────────────── */}
    <DocSection title="Disabled">
      <Preview title="Tabs — disabled trigger" code={`<Tabs defaultValue="active">\n  <TabsList>\n    <TabsTrigger value="active">Active</TabsTrigger>\n    <TabsTrigger value="locked" disabled>Locked</TabsTrigger>\n    <TabsTrigger value="other">Other</TabsTrigger>\n  </TabsList>\n</Tabs>`} height={100}>
        <Tabs defaultValue="active">
          <TabsList>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="locked" disabled>Locked</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>
        </Tabs>
      </Preview>
    </DocSection>

    {/* ── Props ────────────────────────────────────────────────── */}
    <DocSection title="Props">
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", marginBottom: "var(--space-2)" }}>Tabs</div>
      <PropsTable props={[
        { name: "defaultValue", type: "string", desc: "Initial active tab (uncontrolled)." },
        { name: "value", type: "string", desc: "Controlled active tab value." },
        { name: "onValueChange", type: "(value: string) => void", desc: "Callback fired when the active tab changes." },
        { name: "orientation", type: '"horizontal" | "vertical"', def: '"horizontal"', desc: "Orientation of the tabs component." },
        { name: "activationMode", type: '"automatic" | "manual"', def: '"automatic"', desc: "Whether a tab is activated on focus or requires an explicit click." },
      ]} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", margin: "var(--space-5) 0 var(--space-2)" }}>TabsList</div>
      <PropsTable props={[
        { name: "style", type: "React.CSSProperties", desc: "Inline styles merged onto the list container." },
        { name: "children", type: "ReactNode", desc: "Should contain one or more TabsTrigger elements." },
      ]} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", margin: "var(--space-5) 0 var(--space-2)" }}>TabsTrigger</div>
      <PropsTable props={[
        { name: "value", type: "string", required: true, desc: "Unique value matching the TabsContent it controls." },
        { name: "disabled", type: "boolean", def: "false", desc: "Prevents the user from interacting with this tab." },
        { name: "style", type: "React.CSSProperties", desc: "Inline styles merged onto the trigger button." },
      ]} />
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)", margin: "var(--space-5) 0 var(--space-2)" }}>TabsContent</div>
      <PropsTable props={[
        { name: "value", type: "string", required: true, desc: "Matches the TabsTrigger value this panel belongs to." },
        { name: "forceMount", type: "boolean", desc: "Keep the content mounted in the DOM even when inactive." },
        { name: "style", type: "React.CSSProperties", desc: "Inline styles merged onto the content panel." },
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
  const [active, setActive] = useState<string | null>(null);
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
                  padding: "6px 12px", borderRadius: 6, border: "none", background: active === item.label ? "var(--state-hover)" : "transparent",
                  color: active === item.label ? "var(--fg)" : "var(--muted-fg)", cursor: "pointer", fontSize: 13, fontWeight: 500,
                  display: "flex", alignItems: "center", gap: 4
                }}>
                  {item.label}{(item as any).children && <ChevronDown size={12} style={{ transition: ".2s", transform: active === item.label ? "rotate(180deg)" : "none" }} />}
                </button>
                {active === item.label && (item as any).children && (
                  <div style={{
                    position: "absolute", top: "calc(100% + 4px)", left: 0, background: "var(--bg-menus)", border: "1px solid var(--border)",
                    borderRadius: 12, boxShadow: "0 8px 24px rgba(0,0,0,.12)", padding: "4px 0", minWidth: 160, zIndex: 50
                  }}>
                    {(item as any).children.map((c: string) => <a key={c} href="#" onClick={e => { e.preventDefault(); setActive(null); }}
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
   STEPPER PAGE
   StepperComp, HorizontalSwapStepper and StepDef are imported
   from ./components/ui/stepper  (HeartStamp DS component).
═══════════════════════════════════════════════════════════ */
const STEPPER_STEPS: StepDef[] = [
  { id: "recipients", label: "Recipients", icon: "recipients" },
  { id: "message",    label: "Message",    icon: "message"    },
  { id: "gifts",      label: "Gifts",      icon: "gifts"      },
  { id: "envelope",   label: "Envelope",   icon: "envelope"   },
  { id: "review",     label: "Review",     icon: "review"     },
];



function PageStepper() {
  const [mobileStep, setMobileStep]   = useState(0);
  const [desktopStep, setDesktopStep] = useState(0);
  const [swapStep,    setSwapStep]    = useState(0);

  /* ── code snippets ── */
  const desktopCode =
`const steps = [
  { id: "recipients", label: "Recipients", icon: "recipients" },
  { id: "message",    label: "Message",    icon: "message"    },
  { id: "gifts",      label: "Gifts",      icon: "gifts"      },
  { id: "envelope",   label: "Envelope",   icon: "envelope"   },
  { id: "review",     label: "Review",     icon: "review"     },
];

<Stepper
  steps={steps}
  activeStep={currentStep}
  onStepChange={setCurrentStep}
  variant="desktop"
/>`;

  const mobileCode =
`const steps = [
  { id: "recipients", label: "Recipients", icon: "recipients" },
  { id: "message",    label: "Message",    icon: "message"    },
  { id: "gifts",      label: "Gifts",      icon: "gifts"      },
  { id: "envelope",   label: "Envelope",   icon: "envelope"   },
  { id: "review",     label: "Review",     icon: "review"     },
];

<Stepper
  steps={steps}
  activeStep={currentStep}
  onStepChange={setCurrentStep}
  variant="mobile"
/>`;

  const responsiveCode =
`{/* Switches automatically based on viewport */}
{isMobile
  ? <HorizontalSwapStepper
      steps={steps}
      activeStep={currentStep}
      onStepChange={setCurrentStep}
    />
  : <Stepper
      steps={steps}
      activeStep={currentStep}
      onStepChange={setCurrentStep}
      variant="desktop"
    />
}`;

  return (
    <DocPage
      title="Stepper"
      subtitle="A multi-step progress indicator. Mobile variant uses icon-circle buttons; desktop uses labelled pill buttons. Switch the viewport in the toolbar below to see the responsive HorizontalSwap layout."
      sourceSlug="stepper"
    >

      {/* ── Responsive / HorizontalSwap preview (render-prop) ── */}
      <DocSection
        title="Responsive"
        desc="Tap the mobile viewport icon (☰) in the Preview toolbar to see the horizontally-swipeable HorizontalSwap layout. Desktop and tablet viewports render the labelled-pill variant."
      >
        <Preview title="Stepper · responsive" code={responsiveCode} height={280}>
          {(vp: string) =>
            vp === "mobile"
              ? <HorizontalSwapStepper
                  steps={STEPPER_STEPS}
                  activeStep={swapStep}
                  onStepChange={setSwapStep}
                />
              : <div style={{ width: "100%", padding: "0 var(--space-4)" }}>
                  <StepperComp
                    steps={STEPPER_STEPS}
                    activeStep={swapStep}
                    onStepChange={setSwapStep}
                    variant="desktop"
                  />
                </div>
          }
        </Preview>
      </DocSection>

      {/* ── Mobile variant ── */}
      <DocSection
        title="Mobile"
        desc="Labelled pill buttons connected by hairlines. Active step uses the primary filled Btn with icon + label; inactive steps use the outline Btn with muted icon + label."
      >
        <Preview title="Stepper · desktop" code={desktopCode} height={100}>
          <div style={{ width: "100%", overflowX: "auto", padding: "var(--space-3) var(--space-4)" }}>
            <StepperComp
              steps={STEPPER_STEPS}
              activeStep={desktopStep}
              onStepChange={setDesktopStep}
              variant="desktop"
            />
          </div>
        </Preview>
      </DocSection>

      {/* ── Desktop variant ── */}
      <DocSection
        title="Desktop"
        desc="Icon-only 32×32 circular indicators connected by hairlines. Active step uses the primary filled Btn; inactive steps use the outline Btn. Labels sit below each indicator."
      >
        <Preview title="Stepper · mobile" code={mobileCode} height={120}>
          <div style={{ width: "100%", maxWidth: 480, margin: "0 auto", padding: "0 var(--space-4)" }}>
            <StepperComp
              steps={STEPPER_STEPS}
              activeStep={mobileStep}
              onStepChange={setMobileStep}
              variant="mobile"
            />
          </div>
        </Preview>
      </DocSection>

      {/* Props */}
      <DocSection title="Props">
        <PropsTable props={[
          { name: "steps",        type: "StepDef[]",               def: "",           desc: "Array of step objects: { id: string; label: string; icon: string }." },
          { name: "activeStep",   type: "number",                  def: "0",          desc: "Zero-based index of the currently active step." },
          { name: "onStepChange", type: "(index: number) => void", def: "",           desc: "Callback fired when a step indicator is clicked." },
          { name: "variant",      type: '"mobile" | "desktop"',    def: '"mobile"',   desc: "mobile = icon-circle indicators · desktop = labelled pill buttons." },
        ]} />
      </DocSection>

      {/* StepDef shape */}
      <DocSection title="StepDef Shape">
        <PropsTable props={[
          { name: "id",    type: "string", def: "", desc: "Unique identifier for the step (used as React key)." },
          { name: "label", type: "string", def: "", desc: "Display label shown below (mobile) or inside (desktop) the indicator." },
          { name: "icon",  type: '"recipients" | "message" | "gifts" | "envelope" | "review"', def: "", desc: "Icon slot mapped to the HeartStamp Figma icon set." },
        ]} />
      </DocSection>
    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOP NAV PAGE
═══════════════════════════════════════════════════════════ */
function PageTopNav() {
  const desktopCode =
`import { TopNavDesktop } from "@/components/ui/hs-nav";

<TopNavDesktop />`;

  const mobileCode =
`import { TopNavMobile } from "@/components/ui/hs-nav";

// Tap the hamburger (≡) to open the slide-out drawer
<TopNavMobile />`;

  return (
    <DocPage
      title="Top Nav"
      subtitle="Website navigation bar. Desktop shows the logo, search, and auth actions. Mobile shows a centered logo with a slide-out drawer triggered by the hamburger."
      sourceSlug="hs-nav"
    >
      <DocSection
        title="Desktop"
        desc="Full-width bar with logo on the left, pill search in the center, and Log in / Sign up buttons on the right."
      >
        <Preview title="Top Nav · desktop" code={desktopCode} height={100}>
          <div style={{ width: "100%" }}>
            <TopNavDesktop />
          </div>
        </Preview>
      </DocSection>

      <DocSection
        title="Mobile"
        desc="Compact bar with the logo centred between two icon buttons. Tap the left hamburger to open the slide-out navigation drawer."
      >
        <Preview title="Top Nav · mobile" code={mobileCode} height={480}>
          <div style={{ display: "flex", justifyContent: "center", width: "100%", padding: "var(--space-4) 0" }}>
            <TopNavMobile />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={[
          { name: "—", type: "—", desc: "TopNavDesktop and TopNavMobile take no props. State is self-contained." },
        ]} />
      </DocSection>
    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   TOKEN PAGES
   LIGHT_TOKENS / DARK_TOKENS / TOKEN_VARIABLE_NAMES /
   GROUP_DESCRIPTIONS → all imported from ./theme
═══════════════════════════════════════════════════════════ */



function TokenColorSwatch({ name, value, variable, mode }: { name: string; value: string; variable: string; mode: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async (text: string) => {
    try { await navigator.clipboard.writeText(text); } catch { }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };
  const isLight = (hex: string) => {
    const c = hex.replace("#", "");
    if (c.length !== 6) return true;
    const r = parseInt(c.slice(0, 2), 16);
    const g = parseInt(c.slice(2, 4), 16);
    const b = parseInt(c.slice(4, 6), 16);
    return (r * 299 + g * 587 + b * 114) / 1000 > 128;
  };
  const bg = mode === "dark" ? "#1a1a1a" : "#f0ede8";
  const isLightColor = value.startsWith("rgba") || isLight(value);
  const labelColor = isLightColor ? "#242423" : "#ffffff";
  return (
    <div style={{
      border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12, overflow: "hidden",
      background: "var(--bg)", transition: "box-shadow 0.15s ease"
    }}>
      {/* Swatch */}
      <div style={{
        height: 80, background: bg, display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative"
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 10, background: value,
          border: value === "#ffffff" || value === "rgba(255, 255, 255, 0.0325)" ? "1px solid var(--border)" : "none",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
        }} />
      </div>
      {/* Info */}
      <div style={{ padding: "10px 12px 12px" }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", marginBottom: 3, lineHeight: 1.3 }}>{name}</div>
        <div style={{
          fontSize: 10.5, fontFamily: "monospace", color: "var(--muted-fg)",
          marginBottom: 8, wordBreak: "break-all", lineHeight: 1.5
        }}>{value}</div>
        <div style={{
          fontSize: 10, fontFamily: "monospace", color: "#be1d2c",
          marginBottom: 10, wordBreak: "break-all", lineHeight: 1.4, opacity: 0.85
        }}>{variable}</div>
        <button onClick={() => copy(value)} style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
          padding: "5px 0", borderRadius: 6, border: "1px solid rgba(36,36,35,0.1)",
          background: "transparent", cursor: "pointer", fontSize: 11, fontWeight: 500,
          color: copied ? "#22c55e" : "var(--muted-fg)", fontFamily: "inherit",
          transition: "all 0.15s ease"
        }}>
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy value"}
        </button>
      </div>
    </div>
  );
}

function PageTokensColor() {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const tokens = mode === "light" ? LIGHT_TOKENS : DARK_TOKENS;
  const groups = Object.keys(tokens);
  return (
    <DocPage title="Color Tokens" subtitle="The complete color system for HeartStamp DS — two full palettes (Light & Dark) connected to every component, text, and surface in the product.">
      {/* Mode toggle */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 32, padding: "12px 16px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--muted)" }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--fg)", marginRight: 4 }}>Mode:</span>
        <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)} style={{ display: "contents" }}>
          <TabsList>
            <TabsTrigger value="light">☀️ Light</TabsTrigger>
            <TabsTrigger value="dark">🌙 Dark</TabsTrigger>
          </TabsList>
        </Tabs>
        <span style={{ marginLeft: "auto", fontSize: 11.5, color: "var(--muted-fg)" }}>
          {Object.values(tokens).reduce((a, g) => a + Object.keys(g).length, 0)} tokens
        </span>
      </div>

      {groups.map(group => (
        <section key={group} style={{ marginBottom: 40 }}>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
              <div style={{ width: 3, height: 18, borderRadius: 99, background: "#be1d2c" }} />
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg)" }}>{group}</h2>
              <span style={{
                fontSize: 10.5, fontWeight: 600, padding: "2px 8px", borderRadius: 999,
                background: "rgba(190,29,44,0.08)", color: "#be1d2c"
              }}>{Object.keys(tokens[group]).length} tokens</span>
            </div>
            <p style={{ margin: "0 0 0 13px", fontSize: 12.5, color: "var(--muted-fg)", lineHeight: 1.6 }}>
              {GROUP_DESCRIPTIONS[group]}
            </p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
            gap: 12
          }}>
            {Object.entries(tokens[group]).map(([name, value]) => (
              <TokenColorSwatch
                key={name}
                name={name}
                value={value}
                variable={TOKEN_VARIABLE_NAMES[group]?.[name] ?? `--color-${group.toLowerCase()}-${name.toLowerCase().replace(/ /g, "-")}`}
                mode={mode}
              />
            ))}
          </div>
          <div style={{ height: 1, background: "var(--border)", marginTop: 36 }} />
        </section>
      ))}

      {/* CSS Variables reference */}
      <section style={{ marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 3, height: 18, borderRadius: 99, background: "#be1d2c" }} />
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg)" }}>CSS Variable Reference</h2>
        </div>
        <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, overflow: "hidden", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          <div style={{ padding: "0 16px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", minHeight: 40 }}>
            <span style={{ fontSize: 12, color: "#71717a" }}>tokens.css</span>
          </div>
          <pre style={{ margin: 0, padding: 20, fontSize: 11.5, lineHeight: 1.9, fontFamily: "inherit", overflowX: "auto" }}>
            <span style={{ color: "#c084fc" }}>:root</span>
            <span style={{ color: "#e6edf3" }}>{" {"}</span>
            {"\n"}
            {Object.entries(TOKEN_VARIABLE_NAMES).map(([group, vars]) =>
              ["  /* " + group + " */\n", ...Object.entries(vars).map(([name, variable]) =>
                `  ${variable}: ${LIGHT_TOKENS[group]?.[name] ?? ""};\n`
              )].join("")
            ).join("")
              .split("\n").filter(l => l.trim()).map((line, i) => (
                <span key={i} style={{ display: "block" }}>
                  {line.startsWith("  /*")
                    ? <span style={{ color: "#6b7280", fontStyle: "italic" }}>{line}</span>
                    : <>
                      <span style={{ color: "#fda4af" }}>{line.split(":")[0]}</span>
                      <span style={{ color: "#e6edf3" }}>:</span>
                      <span style={{ color: "#86efac" }}>{line.split(":").slice(1).join(":").replace(";", "")}</span>
                      <span style={{ color: "#e6edf3" }}>;</span>
                    </>
                  }
                </span>
              ))
            }
            <span style={{ color: "#e6edf3" }}>{"}"}</span>
          </pre>
        </div>
      </section>

      {/* JSON Token Source */}
      <JsonTokenSection lightTokens={LIGHT_TOKENS} darkTokens={DARK_TOKENS} />
    </DocPage>
  );
}

function JsonTokenSection({ lightTokens, darkTokens }: { lightTokens: Record<string, Record<string, string>>; darkTokens: Record<string, Record<string, string>> }) {
  const [jsonMode, setJsonMode] = useState<"light" | "dark">("light");
  const [copied, setCopied] = useState(false);
  const tokens = jsonMode === "light" ? lightTokens : darkTokens;

  const buildJson = (t: Record<string, Record<string, string>>) => {
    const obj: Record<string, Record<string, { $type: string; $value: string }>> = {};
    Object.entries(t).forEach(([group, values]) => {
      obj[group] = {};
      Object.entries(values).forEach(([name, value]) => {
        obj[group][name] = { $type: "color", $value: value };
      });
    });
    return JSON.stringify(obj, null, 2);
  };

  const jsonStr = buildJson(tokens);

  const copy = async () => {
    try { await navigator.clipboard.writeText(jsonStr); } catch { }
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  const renderLine = (line: string, i: number) => {
    const keyMatch = line.match(/^(\s*)("[\w\s/$-]+")(\s*:\s*)(.*)$/);
    if (keyMatch) {
      const [, indent, key, colon, rest] = keyMatch;
      const isGroupKey = indent.length <= 2 && rest.trim() === "{";
      const isMetaKey = key === '"$type"' || key === '"$value"';
      const keyColor = isGroupKey ? "#79c0ff" : isMetaKey ? "#fda4af" : "#a5d6ff";
      let valueEl: React.ReactNode = <span style={{ color: "#e6edf3" }}>{rest}</span>;
      const valMatch = rest.match(/^"(.*)"(,?)$/);
      if (valMatch) {
        const [, val, comma] = valMatch;
        const isHex = val.startsWith("#");
        const isRgba = val.startsWith("rgba");
        const isType = val === "color";
        const valColor = isHex || isRgba ? "#86efac" : isType ? "#ffa657" : "#e6edf3";
        valueEl = <><span style={{ color: valColor }}>"{val}"</span><span style={{ color: "#e6edf3" }}>{comma}</span></>;
      }
      return (
        <span key={i} style={{ display: "block" }}>
          <span style={{ color: "#e6edf3" }}>{indent}</span>
          <span style={{ color: keyColor }}>{key}</span>
          <span style={{ color: "#e6edf3" }}>{colon}</span>
          {valueEl}
        </span>
      );
    }
    return <span key={i} style={{ display: "block", color: "#e6edf3" }}>{line}</span>;
  };

  return (
    <section style={{ marginBottom: 8, marginTop: 32 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
        <div style={{ width: 3, height: 18, borderRadius: 99, background: "#be1d2c" }} />
        <h2 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--fg)" }}>JSON Token Source</h2>
        <span style={{ fontSize: 11, color: "var(--muted-fg)", marginLeft: 4 }}>
          — mirrors the <code style={{ fontFamily: "monospace", fontSize: 11, color: "#be1d2c" }}>color-tokens.json</code> file exactly
        </span>
      </div>

      <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, overflow: "hidden", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
        <div style={{ padding: "0 8px 0 16px", borderBottom: "1px solid #27272a", display: "flex", alignItems: "center", gap: 6, minHeight: 40 }}>
          <span style={{ fontSize: 12, color: "#71717a", flex: 1 }}>
            color-tokens.json <span style={{ opacity: 0.5 }}>({jsonMode} mode)</span>
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {(["light", "dark"] as const).map(m => (
              <button key={m} onClick={() => setJsonMode(m)} style={{
                padding: "3px 12px", borderRadius: 20, border: "1px solid",
                borderColor: jsonMode === m ? "#3f3f46" : "transparent",
                cursor: "pointer", fontSize: 11, fontWeight: 500, fontFamily: "inherit",
                background: jsonMode === m ? "#18181b" : "transparent",
                color: jsonMode === m ? "#e4e4e7" : "#71717a",
                transition: "all 0.15s ease"
              }}>{m === "light" ? "☀️ Light" : "🌙 Dark"}</button>
            ))}
          </div>
          <button onClick={copy} style={{
            display: "flex", alignItems: "center", gap: 5, padding: "4px 10px",
            borderRadius: 5, border: "1px solid #3f3f46", background: "transparent",
            color: copied ? "#a1a1aa" : "#71717a", fontSize: 11, fontFamily: "inherit",
            cursor: "pointer", transition: "all .15s", margin: "6px 8px 6px 0",
          }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy JSON"}
          </button>
        </div>
        <pre style={{ margin: 0, padding: "20px 24px", fontSize: 11.5, lineHeight: 1.9, fontFamily: "inherit", overflowX: "auto", maxHeight: 520, overflowY: "auto" }}>
          {jsonStr.split("\n").map((line, i) => renderLine(line, i))}
        </pre>
      </div>

      {/* Flat reference table */}
      <div style={{ marginTop: 20, border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
        <div style={{ background: "var(--muted)", padding: "8px 16px", display: "grid", gridTemplateColumns: "1.2fr 0.6fr 1.2fr 1.2fr", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
          <span>Group / Name</span>
          <span>$type</span>
          <span>$value</span>
          <span>CSS Variable</span>
        </div>
        {Object.entries(tokens).flatMap(([group, values]) =>
          Object.entries(values).map(([name, value], idx) => (
            <div key={`${group}-${name}`} style={{
              padding: "10px 16px", display: "grid", gridTemplateColumns: "1.2fr 0.6fr 1.2fr 1.2fr", gap: 12, alignItems: "center",
              borderBottom: "1px solid var(--border)", background: idx % 2 === 0 ? "var(--bg)" : "var(--muted)"
            }}>
              <div>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".05em" }}>{group} / </span>
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{name}</span>
              </div>
              <code style={{ fontSize: 11, fontFamily: "monospace", color: "#ffa657" }}>"color"</code>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 14, height: 14, borderRadius: 4, background: value, border: "1px solid rgba(0,0,0,0.1)", flexShrink: 0 }} />
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--fg)", wordBreak: "break-all" }}>{value}</code>
              </div>
              <code style={{ fontSize: 10.5, fontFamily: "monospace", color: "#be1d2c", wordBreak: "break-all" }}>
                {TOKEN_VARIABLE_NAMES[group]?.[name] ?? "—"}
              </code>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

/* ─── Shared token reference table (TOKEN / VALUE / CATEGORY / USAGE) ─── */
type TokenRow = { token: string; value: string; category: string; usage: string };
function TokenTable({ rows }: { rows: TokenRow[] }) {
  const cols = "200px 200px 130px 1fr";
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
      <div style={{
        display: "grid", gridTemplateColumns: cols,
        background: "var(--muted)", borderBottom: "1px solid var(--border)",
        padding: "10px 20px",
      }}>
        {["TOKEN", "VALUE", "CATEGORY", "USAGE"].map(h => (
          <span key={h} style={{ fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" as const, letterSpacing: ".06em" }}>{h}</span>
        ))}
      </div>
      {rows.map((r, i) => (
        <div key={r.token + i} style={{
          display: "grid", gridTemplateColumns: cols,
          padding: "13px 20px", alignItems: "center",
          background: i % 2 === 0 ? "var(--bg)" : "var(--muted)",
          borderBottom: i < rows.length - 1 ? "1px solid var(--border)" : "none",
        }}>
          <code style={{ fontSize: 12, fontFamily: "monospace", color: "#be1d2c", paddingRight: 12 }}>{r.token}</code>
          <div style={{ paddingRight: 12 }}>
            <code style={{
              fontSize: 11.5, fontFamily: "monospace", color: "var(--fg)",
              background: "var(--color-element-disabled)", padding: "3px 8px",
              borderRadius: 5, display: "inline-block", lineHeight: 1.6,
              whiteSpace: "pre-wrap" as const, wordBreak: "break-all" as const,
            }}>{r.value}</code>
          </div>
          <span style={{ fontSize: 13, color: "var(--fg)", paddingRight: 12 }}>{r.category}</span>
          <span style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.5 }}>{r.usage}</span>
        </div>
      ))}
    </div>
  );
}

function PageTokensTypography() {
  const headingStyles = [
    { name: "H1",          sToken: "--font-size-h1",          wToken: "--font-weight-h1",          lsToken: "--letter-spacing-h1",          size: 56, weight: 700, ls: "0em",      figmaWeight: "Bold" },
    { name: "H2",          sToken: "--font-size-h2",          wToken: "--font-weight-h2",          lsToken: "--letter-spacing-h2",          size: 40, weight: 600, ls: "0em",      figmaWeight: "SemiBold" },
    { name: "H3",          sToken: "--font-size-h3",          wToken: "--font-weight-h3",          lsToken: "--letter-spacing-h3",          size: 36, weight: 400, ls: "-0.04em",  figmaWeight: "Regular" },
    { name: "H4",          sToken: "--font-size-h4",          wToken: "--font-weight-h4",          lsToken: "--letter-spacing-h4",          size: 20, weight: 400, ls: "-0.02em",  figmaWeight: "Regular" },
    { name: "H5",          sToken: "--font-size-h5",          wToken: "--font-weight-h5",          lsToken: "--letter-spacing-h5",          size: 18, weight: 400, ls: "0em",      figmaWeight: "Regular" },
    { name: "Subheadline", sToken: "--font-size-subheadline", wToken: "--font-weight-subheadline", lsToken: "--letter-spacing-subheadline", size: 24, weight: 300, ls: "0em",      figmaWeight: "Light" },
  ];
  const bodyStyles = [
    { name: "Body · 15",     sToken: "--font-size-body-15",     wToken: "--font-weight-body-15",     size: 15, weight: 400, figmaWeight: "Regular",  usage: "Paragraphs, descriptions" },
    { name: "Label · 15",    sToken: "--font-size-label-15",    wToken: "--font-weight-label-15",    size: 15, weight: 500, figmaWeight: "Medium",   usage: "Form labels, nav items" },
    { name: "Label SB · 15", sToken: "--font-size-label-sb-15", wToken: "--font-weight-label-sb-15", size: 15, weight: 600, figmaWeight: "SemiBold", usage: "Strong labels, section titles" },
    { name: "Label · 12",    sToken: "--font-size-label-12",    wToken: "--font-weight-label-12",    size: 12, weight: 500, figmaWeight: "Medium",   usage: "Captions, badges, metadata" },
    { name: "Body · 13",     sToken: "--font-size-body-13",     wToken: "--font-weight-body-13",     size: 13, weight: 400, figmaWeight: "Regular",  usage: "Secondary body, helper text" },
  ];
  const headingFF = { fontFamily: "var(--font-family-heading)" };
  const bodyFF    = { fontFamily: "var(--font-family-body)" };
  const monoFF    = { fontFamily: "var(--font-family-mono)" };
  return (
    <DocPage title="Typography Tokens" subtitle="Font families and text styles — sourced directly from the HeartStamp Figma library (textStyles.json).">

      {/* Live Example */}
      <DocSection title="Live Example">
        <p style={{ ...bodyFF, fontSize: "var(--font-size-body-13)", fontWeight: "var(--font-weight-body-13)" as any, color: "var(--muted-fg)", margin: "0 0 12px" }}>
          We do not ship any typography styles by default. This page is an example of how you can use token variables to style your text.
        </p>
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "36px 40px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: 0 }}>

          {/* H1 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <h1 style={{ ...headingFF, flex: 1, fontSize: "var(--font-size-h1)", fontWeight: "var(--font-weight-h1)" as any, letterSpacing: "var(--letter-spacing-h1)", color: "var(--fg)", lineHeight: 1.05, margin: 0 }}>
              Taxing Laughter: The Joke Tax Chronicles
            </h1>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>H1 · --font-size-h1 · 56px · Bold</span>
          </div>

          {/* Subheadline */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 28 }}>
            <p style={{ ...headingFF, flex: 1, fontSize: "var(--font-size-subheadline)", fontWeight: "var(--font-weight-subheadline)" as any, letterSpacing: "var(--letter-spacing-subheadline)", color: "var(--muted-fg)", lineHeight: 1.45, margin: 0 }}>
              Once upon a time, in a far-off land, there was a very lazy king who spent all day lounging on his throne. One day, his advisors came to him with a problem: the kingdom was running out of money.
            </p>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Subheadline · 24px · Light</span>
          </div>

          <div style={{ height: 1, background: "var(--border)", margin: "0 0 24px" }} />

          {/* H3 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <h3 style={{ ...headingFF, flex: 1, fontSize: "var(--font-size-h3)", fontWeight: "var(--font-weight-h3)" as any, letterSpacing: "var(--letter-spacing-h3)", color: "var(--fg)", lineHeight: 1.15, margin: 0 }}>
              The King's Plan
            </h3>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>H3 · --font-size-h3 · 36px · Regular · -0.04em</span>
          </div>

          {/* Body 15 with link */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            <p style={{ ...bodyFF, flex: 1, fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, color: "var(--fg)", lineHeight: 1.65, margin: 0 }}>
              The king thought long and hard, and finally came up with{" "}
              <span style={{ textDecoration: "underline", fontWeight: "var(--font-weight-label-15)" as any }}>a brilliant plan</span>: he would tax the jokes in the kingdom.
            </p>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Body · 15 · --font-size-body-15 · 400</span>
          </div>

          {/* Blockquote */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
            <blockquote style={{ flex: 1, borderLeft: "3px solid var(--border)", paddingLeft: 16, margin: 0 }}>
              <p style={{ ...bodyFF, fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, fontStyle: "italic", color: "var(--muted-fg)", lineHeight: 1.65, margin: 0 }}>
                "After all," he said, "everyone enjoys a good joke, so it's only fair that they should pay for the privilege."
              </p>
            </blockquote>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Body · 15 · italic · left-border</span>
          </div>

          {/* H4 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <h4 style={{ ...headingFF, flex: 1, fontSize: "var(--font-size-h4)", fontWeight: "var(--font-weight-h4)" as any, letterSpacing: "var(--letter-spacing-h4)", color: "var(--fg)", lineHeight: 1.3, margin: 0 }}>
              The Joke Tax
            </h4>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>H4 · --font-size-h4 · 20px · Regular · -0.02em</span>
          </div>

          <p style={{ ...bodyFF, fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, color: "var(--fg)", lineHeight: 1.65, margin: "0 0 12px" }}>
            The king's subjects were not amused. They grumbled and complained, but the king was firm:
          </p>

          {/* List — Label 15 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            <ul style={{ flex: 1, margin: 0, paddingLeft: 20, display: "flex", flexDirection: "column", gap: 6 }}>
              {[
                { item: "1st level of puns", detail: ": 5 gold coins" },
                { item: "2nd level of jokes", detail: ": 10 gold coins" },
                { item: "3rd level of one-liners", detail: ": 20 gold coins" },
              ].map(({ item, detail }) => (
                <li key={item} style={{ ...bodyFF, fontSize: "var(--font-size-label-15)", fontWeight: "var(--font-weight-label-15)" as any, color: "var(--fg)", lineHeight: 1.6 }}>
                  {item}<span style={{ fontWeight: "var(--font-weight-body-15)" as any }}>{detail}</span>
                </li>
              ))}
            </ul>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Label · 15 · --font-weight-label-15 · 500</span>
          </div>

          <p style={{ ...bodyFF, fontSize: "var(--font-size-body-15)", fontWeight: "var(--font-weight-body-15)" as any, color: "var(--fg)", lineHeight: 1.65, margin: "0 0 24px" }}>
            As a result, people stopped telling jokes, and the kingdom fell into a gloom. But there was one person who refused to let the king's foolishness get him down: a court jester named Jokester.
          </p>

          {/* H5 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
            <h5 style={{ ...headingFF, flex: 1, fontSize: "var(--font-size-h5)", fontWeight: "var(--font-weight-h5)" as any, letterSpacing: "var(--letter-spacing-h5)", color: "var(--fg)", lineHeight: 1.35, margin: 0 }}>
              Jokester's Revolt
            </h5>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>H5 · --font-size-h5 · 18px · Regular · 0em</span>
          </div>

          {/* Label SB 15 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            <p style={{ ...bodyFF, flex: 1, fontSize: "var(--font-size-label-sb-15)", fontWeight: "var(--font-weight-label-sb-15)" as any, color: "var(--fg)", lineHeight: 1.65, margin: 0 }}>
              Jokester began sneaking into the castle in the middle of the night and leaving jokes all over the place: under the king's pillow, in his soup, even in the royal toilet.
            </p>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Label SB · 15 · --font-weight-label-sb-15 · 600</span>
          </div>

          {/* Body 13 */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: 24 }}>
            <p style={{ ...bodyFF, flex: 1, fontSize: "var(--font-size-body-13)", fontWeight: "var(--font-weight-body-13)" as any, color: "var(--muted-fg)", lineHeight: 1.65, margin: 0 }}>
              The king was furious, but he couldn't seem to stop Jokester. And so, in the end, the joke tax was repealed, and the kingdom lived happily ever after — at least until the next royal decree.
            </p>
            <span style={{ flexShrink: 0, alignSelf: "flex-start", fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap", marginTop: 3 }}>Body · 13 · --font-size-body-13 · 400</span>
          </div>

          {/* Label 12 — tag row */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
            <div style={{ flex: 1, display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              {["HeartStamp DS", "Typography", "Figma Library", "textStyles.json"].map(tag => (
                <span key={tag} style={{ ...bodyFF, fontSize: "var(--font-size-label-12)", fontWeight: "var(--font-weight-label-12)" as any, color: "var(--muted-fg)", background: "var(--muted)", padding: "3px 10px", borderRadius: 99, border: "1px solid var(--border)" }}>
                  {tag}
                </span>
              ))}
            </div>
            <span style={{ flexShrink: 0, fontSize: 9.5, fontFamily: "monospace", background: "rgba(190,29,44,0.08)", color: "#be1d2c", padding: "2px 7px", borderRadius: 99, letterSpacing: ".02em", whiteSpace: "nowrap" }}>Label · 12 · --font-size-label-12 · 500</span>
          </div>

        </div>
      </DocSection>

      {/* Font Families */}
      <DocSection title="Font Families">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Heading */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...headingFF, fontSize: 36, fontWeight: 700, color: "var(--fg)", marginBottom: 8, lineHeight: 1.1 }}>Aa Bb Cc Dd Ee 0–9</div>
                <div style={{ ...headingFF, fontSize: 15, fontWeight: 300, color: "var(--muted-fg)", marginBottom: 6 }}>The quick brown fox jumps over the lazy dog.</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>Headings — H1 through H5, Subheadline</div>
              </div>
              <div style={{ flexShrink: 0, minWidth: 210 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Stack Sans Text</div>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "#be1d2c", display: "block", marginBottom: 4 }}>--font-family-heading</code>
                <div style={{ fontSize: 10.5, color: "var(--muted-fg)", fontFamily: "monospace", lineHeight: 1.6 }}>'Stack Sans Text', 'Instrument Sans',<br/>system-ui, sans-serif</div>
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 8px", borderRadius: 99, background: "rgba(190,29,44,0.08)", color: "#be1d2c" }}>Licensed · Figma Library</div>
              </div>
            </div>
          </div>
          {/* Body */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...bodyFF, fontSize: 36, fontWeight: 500, color: "var(--fg)", marginBottom: 8, lineHeight: 1.1 }}>Aa Bb Cc Dd Ee 0–9</div>
                <div style={{ ...bodyFF, fontSize: 15, fontWeight: 400, color: "var(--muted-fg)", marginBottom: 6 }}>The quick brown fox jumps over the lazy dog.</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>Body, Labels, UI — inputs, buttons, captions</div>
              </div>
              <div style={{ flexShrink: 0, minWidth: 210 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>DM Sans</div>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "#be1d2c", display: "block", marginBottom: 4 }}>--font-family-body</code>
                <div style={{ fontSize: 10.5, color: "var(--muted-fg)", fontFamily: "monospace", lineHeight: 1.6 }}>'DM Sans', system-ui, sans-serif</div>
                <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, padding: "2px 8px", borderRadius: 99, background: "rgba(16,185,129,0.1)", color: "#10b981" }}>Google Fonts · Open Source</div>
              </div>
            </div>
          </div>
          {/* Mono */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: "24px 28px", background: "var(--bg)" }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <div style={{ ...monoFF, fontSize: 30, fontWeight: 400, color: "var(--fg)", marginBottom: 8, lineHeight: 1.1 }}>{"Aa 01 <> == => !=="}</div>
                <div style={{ ...monoFF, fontSize: 13, color: "var(--muted-fg)", marginBottom: 6 }}>{'const ds = "HeartStamp";'}</div>
                <div style={{ fontSize: 11.5, color: "var(--muted-fg)" }}>Code blocks, token values, keyboard shortcuts</div>
              </div>
              <div style={{ flexShrink: 0, minWidth: 210 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--fg)", marginBottom: 6 }}>Monospace</div>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "#be1d2c", display: "block", marginBottom: 4 }}>--font-family-mono</code>
                <div style={{ fontSize: 10.5, color: "var(--muted-fg)", fontFamily: "monospace", lineHeight: 1.6 }}>ui-monospace, 'Cascadia Code',<br/>monospace</div>
              </div>
            </div>
          </div>
        </div>
      </DocSection>

      {/* Heading Text Styles */}
      <DocSection title="Heading Text Styles" desc="Stack Sans Text — sourced from HeartStamp Figma Library · textStyles.json">
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "var(--muted)", padding: "10px 20px", display: "grid", gridTemplateColumns: "110px 1fr 64px 90px 80px", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" as const, letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
            <span>Style</span><span>Preview</span><span>Size</span><span>Weight</span><span>Tracking</span>
          </div>
          {headingStyles.map((s, i) => (
            <div key={s.name} style={{
              padding: "18px 20px", display: "grid", gridTemplateColumns: "110px 1fr 64px 90px 80px", gap: 12, alignItems: "center",
              borderBottom: i < headingStyles.length - 1 ? "1px solid var(--border)" : "none",
              background: i % 2 === 0 ? "var(--bg)" : "var(--muted)"
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{s.name}</div>
                <code style={{ fontSize: 10, fontFamily: "monospace", color: "#be1d2c" }}>{s.sToken}</code>
              </div>
              <div style={{ overflow: "hidden" }}>
                <span style={{ ...headingFF, fontSize: Math.min(s.size, 36), fontWeight: s.weight, letterSpacing: s.ls, color: "var(--fg)", lineHeight: 1.1, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>HeartStamp</span>
              </div>
              <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--fg)" }}>{s.size}px</div>
              <div style={{ fontSize: 11, color: "var(--muted-fg)", lineHeight: 1.5 }}>{s.figmaWeight}<br/><span style={{ fontFamily: "monospace", color: "#be1d2c", fontSize: 10 }}>{s.weight}</span></div>
              <div style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted-fg)" }}>{s.ls}</div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* Body Text Styles */}
      <DocSection title="Body & Label Text Styles" desc="DM Sans — sourced from HeartStamp Figma Library · textStyles.json">
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "var(--muted)", padding: "10px 20px", display: "grid", gridTemplateColumns: "150px 1fr 64px 90px 1fr", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase" as const, letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
            <span>Style</span><span>Preview</span><span>Size</span><span>Weight</span><span>Usage</span>
          </div>
          {bodyStyles.map((s, i) => (
            <div key={s.name} style={{
              padding: "14px 20px", display: "grid", gridTemplateColumns: "150px 1fr 64px 90px 1fr", gap: 12, alignItems: "center",
              borderBottom: i < bodyStyles.length - 1 ? "1px solid var(--border)" : "none",
              background: i % 2 === 0 ? "var(--bg)" : "var(--muted)"
            }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: "var(--fg)", marginBottom: 3 }}>{s.name}</div>
                <code style={{ fontSize: 10, fontFamily: "monospace", color: "#be1d2c" }}>{s.sToken}</code>
              </div>
              <div>
                <span style={{ ...bodyFF, fontSize: s.size, fontWeight: s.weight, color: "var(--fg)" }}>The quick brown fox</span>
              </div>
              <div style={{ fontSize: 12, fontFamily: "monospace", color: "var(--fg)" }}>{s.size}px</div>
              <div style={{ fontSize: 11, color: "var(--muted-fg)", lineHeight: 1.5 }}>{s.figmaWeight}<br/><span style={{ fontFamily: "monospace", color: "#be1d2c", fontSize: 10 }}>{s.weight}</span></div>
              <div style={{ fontSize: 11, color: "var(--muted-fg)", lineHeight: 1.5 }}>{s.usage}</div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* All Typography Tokens reference table */}
      <DocSection title="All Typography Tokens">
        <TokenTable rows={[
          { token: "--font-family-heading",        value: "'Stack Sans Text', 'Instrument Sans', system-ui", category: "Font Family", usage: "H1–H5, Subheadline" },
          { token: "--font-family-body",           value: "'DM Sans', system-ui, sans-serif",                category: "Font Family", usage: "Body, Label, Button, Input" },
          { token: "--font-family-mono",           value: "ui-monospace, 'Cascadia Code', monospace",        category: "Font Family", usage: "Code blocks, token values" },
          { token: "--font-size-h1",               value: "56px",    category: "Heading Size",   usage: "H1 — Bold display heading" },
          { token: "--font-weight-h1",             value: "700",     category: "Heading Weight", usage: "H1 — Bold (Figma)" },
          { token: "--letter-spacing-h1",          value: "0em",     category: "Tracking",       usage: "H1 — Figma: 0%" },
          { token: "--font-size-h2",               value: "40px",    category: "Heading Size",   usage: "H2 — SemiBold section heading" },
          { token: "--font-weight-h2",             value: "600",     category: "Heading Weight", usage: "H2 — SemiBold (Figma)" },
          { token: "--letter-spacing-h2",          value: "0em",     category: "Tracking",       usage: "H2 — Figma: 0%" },
          { token: "--font-size-h3",               value: "36px",    category: "Heading Size",   usage: "H3 — Regular with tight tracking" },
          { token: "--font-weight-h3",             value: "400",     category: "Heading Weight", usage: "H3 — Regular (Figma)" },
          { token: "--letter-spacing-h3",          value: "-0.04em", category: "Tracking",       usage: "H3 — Figma: -4%" },
          { token: "--font-size-h4",               value: "20px",    category: "Heading Size",   usage: "H4 — Subsection label" },
          { token: "--font-weight-h4",             value: "400",     category: "Heading Weight", usage: "H4 — Regular (Figma)" },
          { token: "--letter-spacing-h4",          value: "-0.02em", category: "Tracking",       usage: "H4 — Figma: -2%" },
          { token: "--font-size-h5",               value: "18px",    category: "Heading Size",   usage: "H5 — Card titles, minor headings" },
          { token: "--font-weight-h5",             value: "400",     category: "Heading Weight", usage: "H5 — Regular (Figma)" },
          { token: "--letter-spacing-h5",          value: "0em",     category: "Tracking",       usage: "H5 — Figma: 0%" },
          { token: "--font-size-subheadline",      value: "24px",    category: "Heading Size",   usage: "Subheadline — Light intro text" },
          { token: "--font-weight-subheadline",    value: "300",     category: "Heading Weight", usage: "Subheadline — Light (Figma)" },
          { token: "--letter-spacing-subheadline", value: "0em",     category: "Tracking",       usage: "Subheadline — Figma: 0%" },
          { token: "--font-size-body-15",          value: "15px",    category: "Body Size",      usage: "Body · 15 — Default body copy" },
          { token: "--font-weight-body-15",        value: "400",     category: "Body Weight",    usage: "Body · 15 — Regular (Figma)" },
          { token: "--font-size-label-15",         value: "15px",    category: "Label Size",     usage: "Label · 15 — Form labels, nav" },
          { token: "--font-weight-label-15",       value: "500",     category: "Label Weight",   usage: "Label · 15 — Medium (Figma)" },
          { token: "--font-size-label-sb-15",      value: "15px",    category: "Label Size",     usage: "Label SB · 15 — Strong labels" },
          { token: "--font-weight-label-sb-15",    value: "600",     category: "Label Weight",   usage: "Label SB · 15 — SemiBold (Figma)" },
          { token: "--font-size-label-12",         value: "12px",    category: "Label Size",     usage: "Label · 12 — Captions, badges" },
          { token: "--font-weight-label-12",       value: "500",     category: "Label Weight",   usage: "Label · 12 — Medium (Figma)" },
          { token: "--font-size-body-13",          value: "13px",    category: "Body Size",      usage: "Body · 13 — Secondary body text" },
          { token: "--font-weight-body-13",        value: "400",     category: "Body Weight",    usage: "Body · 13 — Regular (Figma)" },
        ]} />
      </DocSection>
    </DocPage>
  );
}

function PageTokensSpacing() {
  const scale = [
    { name: "0", variable: "--space-0", value: "0px", px: 0 },
    { name: "1", variable: "--space-1", value: "4px", px: 4 },
    { name: "2", variable: "--space-2", value: "8px", px: 8 },
    { name: "3", variable: "--space-3", value: "12px", px: 12 },
    { name: "4", variable: "--space-4", value: "16px", px: 16 },
    { name: "5", variable: "--space-5", value: "20px", px: 20 },
    { name: "6", variable: "--space-6", value: "24px", px: 24 },
    { name: "7", variable: "--space-7", value: "28px", px: 28 },
    { name: "8", variable: "--space-8", value: "32px", px: 32 },
    { name: "10", variable: "--space-10", value: "40px", px: 40 },
    { name: "12", variable: "--space-12", value: "48px", px: 48 },
    { name: "16", variable: "--space-16", value: "64px", px: 64 },
    { name: "20", variable: "--space-20", value: "80px", px: 80 },
    { name: "24", variable: "--space-24", value: "96px", px: 96 },
  ];
  const componentSpacing = [
    { component: "Button (sm)", value: "8px 12px", variable: "--btn-padding-sm", desc: "Small button padding" },
    { component: "Button (default)", value: "10px 16px", variable: "--btn-padding-default", desc: "Default button padding" },
    { component: "Button (lg)", value: "12px 20px", variable: "--btn-padding-lg", desc: "Large button padding" },
    { component: "Input", value: "10px 12px", variable: "--input-padding", desc: "Input field padding" },
    { component: "Card body", value: "16px 20px", variable: "--card-padding", desc: "Card section padding" },
    { component: "Dialog", value: "24px", variable: "--dialog-padding", desc: "Dialog/modal padding" },
    { component: "Popover", value: "16px", variable: "--popover-padding", desc: "Popover content padding" },
    { component: "Badge", value: "2px 9px", variable: "--badge-padding", desc: "Badge pill padding" },
    { component: "Tooltip", value: "4px 8px", variable: "--tooltip-padding", desc: "Tooltip content padding" },
    { component: "Sidebar item", value: "6px 10px", variable: "--sidebar-item-padding", desc: "Nav item padding" },
  ];
  return (
    <DocPage title="Spacing Tokens" subtitle="A 4px-base spacing scale used consistently across every layout gap, padding, and margin in the system.">
      <DocSection title="Base Scale" desc="Built on a 4px grid. All spacing values are multiples of 4px for perfect pixel alignment.">
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {scale.map((s, i) => (
            <div key={s.name} style={{
              display: "flex", alignItems: "center", gap: 14, padding: "8px 14px",
              borderRadius: 8, background: i % 2 === 0 ? "var(--muted)" : "transparent",
              border: "1px solid transparent"
            }}>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted-fg)", width: 24, flexShrink: 0, textAlign: "right" }}>{s.name}</span>
              <code style={{ fontSize: 11, fontFamily: "monospace", color: "#be1d2c", width: 140, flexShrink: 0 }}>{s.variable}</code>
              <div style={{
                height: 16, width: Math.max(s.px, 1), background: s.px === 0 ? "transparent" : "#242423",
                borderRadius: 2, flexShrink: 0, border: s.px === 0 ? "1px dashed var(--border)" : "none",
                minWidth: s.px === 0 ? 16 : 0
              }} />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--fg)", fontFamily: "monospace", marginLeft: 4 }}>{s.value}</span>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Component Spacing" desc="Specific padding and gap values applied to individual components — use these variables for pixel-perfect fidelity.">
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <div style={{ background: "var(--muted)", padding: "8px 16px", display: "grid", gridTemplateColumns: "1fr 100px 1fr 1fr", gap: 12, fontSize: 10.5, fontWeight: 700, color: "var(--muted-fg)", textTransform: "uppercase", letterSpacing: ".04em", borderBottom: "1px solid var(--border)" }}>
            <span>Component</span><span>Value</span><span>Variable</span><span>Description</span>
          </div>
          {componentSpacing.map((item, i) => (
            <div key={item.component} style={{
              padding: "12px 16px", display: "grid", gridTemplateColumns: "1fr 100px 1fr 1fr", gap: 12, alignItems: "center",
              borderBottom: i < componentSpacing.length - 1 ? "1px solid var(--border)" : "none",
              background: i % 2 === 0 ? "var(--bg)" : "var(--muted)"
            }}>
              <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)" }}>{item.component}</span>
              <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--fg)", background: "var(--color-element-disabled)", padding: "2px 6px", borderRadius: 4 }}>{item.value}</code>
              <code style={{ fontSize: 10.5, fontFamily: "monospace", color: "#be1d2c" }}>{item.variable}</code>
              <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </DocSection>

      {/* All Spacing Tokens reference table */}
      <DocSection title="All Spacing Tokens">
        <TokenTable rows={[
          { token: "--space-0",              value: "0px",       category: "Scale",     usage: "Reset / no spacing" },
          { token: "--space-1",              value: "4px",       category: "Scale",     usage: "Micro gaps, icon nudges" },
          { token: "--space-2",              value: "8px",       category: "Scale",     usage: "Tight inline gaps" },
          { token: "--space-3",              value: "12px",      category: "Scale",     usage: "Small element padding" },
          { token: "--space-4",              value: "16px",      category: "Scale",     usage: "Default card padding, section gap" },
          { token: "--space-5",              value: "20px",      category: "Scale",     usage: "Medium layout gap" },
          { token: "--space-6",              value: "24px",      category: "Scale",     usage: "Dialog / modal padding" },
          { token: "--space-7",              value: "28px",      category: "Scale",     usage: "Larger section spacing" },
          { token: "--space-8",              value: "32px",      category: "Scale",     usage: "Page-level vertical rhythm" },
          { token: "--space-10",             value: "40px",      category: "Scale",     usage: "Hero section spacing" },
          { token: "--space-12",             value: "48px",      category: "Scale",     usage: "Large layout sections" },
          { token: "--space-16",             value: "64px",      category: "Scale",     usage: "Full-page vertical spacing" },
          { token: "--space-20",             value: "80px",      category: "Scale",     usage: "Extra-large page gaps" },
          { token: "--space-24",             value: "96px",      category: "Scale",     usage: "Maximum layout breathing room" },
          { token: "--btn-padding-sm",       value: "8px 12px",  category: "Component", usage: "Padding for size=\"sm\" button" },
          { token: "--btn-padding-default",  value: "10px 16px",  category: "Component", usage: "Padding for size=\"default\" button" },
          { token: "--btn-padding-lg",       value: "12px 20px", category: "Component", usage: "Padding for size=\"lg\" button" },
          { token: "--btn-padding-icon",     value: "8px",       category: "Component", usage: "Padding for size=\"icon\" button" },
          { token: "--btn-gap",              value: "6px",       category: "Component", usage: "Gap between icon and label in buttons" },
          { token: "--input-padding",        value: "10px 12px", category: "Component", usage: "Input field padding" },
          { token: "--card-padding",         value: "16px 20px", category: "Component", usage: "Card section padding" },
          { token: "--dialog-padding",       value: "24px",      category: "Component", usage: "Dialog / modal padding" },
          { token: "--popover-padding",      value: "16px",      category: "Component", usage: "Popover content padding" },
          { token: "--badge-padding",        value: "2px 9px",   category: "Component", usage: "Badge pill padding" },
          { token: "--tooltip-padding",      value: "4px 8px",   category: "Component", usage: "Tooltip content padding" },
          { token: "--sidebar-item-padding", value: "6px 10px",  category: "Component", usage: "Sidebar nav item padding" },
        ]} />
      </DocSection>
    </DocPage>
  );
}

function PageTokensRadius() {
  const radii = [
    { name: "none", variable: "--radius-none", value: "0px", px: 0, usage: "Flush edges, table cells, full-bleed" },
    { name: "xs", variable: "--radius-xs", value: "4px", px: 4, usage: "Tiny chips, tight UI elements" },
    { name: "sm", variable: "--radius-sm", value: "6px", px: 6, usage: "Badges, labels, small tag chips" },
    { name: "md", variable: "--radius-md", value: "7px", px: 7, usage: "Toggles, select dropdowns" },
    { name: "lg", variable: "--radius-lg", value: "8px", px: 8, usage: "Small cards, accordions, collapsibles" },
    { name: "xl", variable: "--radius-xl", value: "10px", px: 10, usage: "Dropdowns, popovers, context menus, tables" },
    { name: "2xl", variable: "--radius-2xl", value: "12px", px: 12, usage: "Cards, calendar, command palette" },
    { name: "3xl", variable: "--radius-3xl", value: "14px", px: 14, usage: "Dialogs, modals" },
    { name: "button", variable: "--radius-button", value: "25px", px: 25, usage: "All button variants" },
    { name: "input", variable: "--radius-input", value: "32px", px: 32, usage: "Input fields, search bars" },
    { name: "full", variable: "--radius-full", value: "999px", px: 999, usage: "Pills, badges, avatars, fully round" },
  ];
  return (
    <DocPage title="Radius Tokens" subtitle="Border radius values applied across every component surface for consistent rounding.">
      <DocSection title="Border Radius">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
          {radii.map(r => (
            <div key={r.name} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "16px", background: "var(--bg)", display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 64 }}>
                <div style={{
                  width: 52, height: 52, background: "#242423",
                  borderRadius: Math.min(r.px, 26),
                  opacity: 0.85
                }} />
              </div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "var(--fg)", marginBottom: 3 }}>{r.name}</div>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "#be1d2c", display: "block", marginBottom: 4 }}>{r.variable}</code>
                <div style={{ fontSize: 12, fontFamily: "monospace", fontWeight: 700, color: "#242423", marginBottom: 6 }}>{r.value}</div>
                <div style={{ fontSize: 10.5, color: "var(--muted-fg)", lineHeight: 1.5 }}>{r.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* All Radius Tokens reference table */}
      <DocSection title="All Radius Tokens">
        <TokenTable rows={[
          { token: "--radius-none",   value: "0px",   category: "Radius", usage: "Flush edges, table cells, full-bleed" },
          { token: "--radius-xs",     value: "4px",   category: "Radius", usage: "Tiny chips, tight UI elements" },
          { token: "--radius-sm",     value: "6px",   category: "Radius", usage: "Badges, labels, small tag chips" },
          { token: "--radius-md",     value: "7px",   category: "Radius", usage: "Toggles, select dropdowns" },
          { token: "--radius-lg",     value: "8px",   category: "Radius", usage: "Small cards, accordions, collapsibles" },
          { token: "--radius-xl",     value: "10px",  category: "Radius", usage: "Dropdowns, popovers, context menus, tables" },
          { token: "--radius-2xl",    value: "12px",  category: "Radius", usage: "Cards, calendar, command palette" },
          { token: "--radius-3xl",    value: "14px",  category: "Radius", usage: "Dialogs, modals" },
          { token: "--radius-button", value: "25px",  category: "Radius", usage: "All button variants" },
          { token: "--radius-input",  value: "32px",  category: "Radius", usage: "Input fields, search bars" },
          { token: "--radius-full",   value: "999px", category: "Radius", usage: "Pills, badges, avatars, fully round" },
        ]} />
      </DocSection>
    </DocPage>
  );
}

function PageTokensShadow() {
  const shadows = [
    { name: "xs", variable: "--shadow-xs", value: "0 1px 3px rgba(0,0,0,0.12)", usage: "Active tab, selected toggle, pressed card" },
    { name: "sm", variable: "--shadow-sm", value: "0 1px 3px rgba(0,0,0,0.20)", usage: "Switch thumb, inline avatars" },
    { name: "md", variable: "--shadow-md", value: "0 4px 12px rgba(0,0,0,0.20)", usage: "Tooltips, small floating elements" },
    { name: "lg", variable: "--shadow-lg", value: "0 8px 24px rgba(0,0,0,0.15)", usage: "Dropdowns, popovers, toast notifications" },
    { name: "xl", variable: "--shadow-xl", value: "0 8px 32px rgba(0,0,0,0.15)", usage: "Hover cards, command palette" },
    { name: "2xl", variable: "--shadow-2xl", value: "0 24px 64px rgba(0,0,0,0.30)", usage: "Dialogs, modals, full-screen overlays" },
  ];
  return (
    <DocPage title="Shadow Tokens" subtitle="Box shadow values used across floating surfaces, interactive states, and depth layers.">
      <DocSection title="Box Shadow">
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {shadows.map(s => (
            <div key={s.name} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: "18px 20px", background: "var(--bg)", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{
                width: 64, height: 48, background: "var(--bg)", borderRadius: 8,
                border: "1px solid var(--border)",
                boxShadow: s.value,
                flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ fontSize: 9, color: "var(--muted-fg)", fontFamily: "monospace" }}>{s.name}</span>
              </div>
              <div style={{ flex: 1, minWidth: 140 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--fg)" }}>{s.name}</span>
                  <code style={{ fontSize: 10.5, fontFamily: "monospace", color: "#be1d2c" }}>{s.variable}</code>
                </div>
                <code style={{ fontSize: 11, fontFamily: "monospace", color: "var(--muted-fg)", display: "block", marginBottom: 4 }}>{s.value}</code>
                <div style={{ fontSize: 12, color: "var(--muted-fg)" }}>{s.usage}</div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      {/* All Shadow Tokens reference table */}
      <DocSection title="All Shadow Tokens">
        <TokenTable rows={[
          { token: "--shadow-xs",  value: "0 1px 3px rgba(0,0,0,0.12)",   category: "Shadow", usage: "Active tab, selected toggle, pressed card" },
          { token: "--shadow-sm",  value: "0 1px 3px rgba(0,0,0,0.20)",   category: "Shadow", usage: "Switch thumb, inline avatars" },
          { token: "--shadow-md",  value: "0 4px 12px rgba(0,0,0,0.20)",  category: "Shadow", usage: "Tooltips, small floating elements" },
          { token: "--shadow-lg",  value: "0 8px 24px rgba(0,0,0,0.15)",  category: "Shadow", usage: "Dropdowns, popovers, toast notifications" },
          { token: "--shadow-xl",  value: "0 8px 32px rgba(0,0,0,0.15)",  category: "Shadow", usage: "Hover cards, command palette" },
          { token: "--shadow-2xl", value: "0 24px 64px rgba(0,0,0,0.30)", category: "Shadow", usage: "Dialogs, modals, full-screen overlays" },
        ]} />
      </DocSection>
    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   INTRO + PLACEHOLDER PAGES
════��══════════════════════════════════════════════════════ */
function PageIntro() {
  const { goToPage } = React.useContext(AppNavContext);
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
        <Btn variant="default" onClick={() => goToPage("accordion")}><ArrowRight size={16} style={{ marginRight: 6 }} />Browse Components</Btn>
        <Btn variant="outline" style={{ borderRadius: "999px" }} onClick={() => window.open("https://github.com/mdheartstamp/heartstamp-design-system", "_blank")}><Github size={15} style={{ marginRight: 6 }} />GitHub Repo</Btn>
      </div>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(210px,1fr))", gap: "var(--space-3)", marginBottom: "var(--space-9)" }}>
      {features.map(({ Icon, title, desc }) => (
        <div key={title} style={{
          padding: "var(--space-5)",
          border: "1px solid var(--color-element-subtle)",
          borderRadius: "var(--radius-xl)",
          background: "var(--color-surface-secondary)",
        }}>
          <div style={{
            width: 32, height: 32,
            borderRadius: "var(--radius-md)",
            background: "var(--bg)",
            display: "flex", alignItems: "center", justifyContent: "center",
            marginBottom: "var(--space-3)",
            border: "1px solid var(--color-element-subtle)",
          }}>
            <Icon size={16} style={{ color: "var(--color-text-secondary)" }} />
          </div>
          <div style={{ fontWeight: "var(--font-weight-bold)" as any, fontSize: "var(--font-size-body-14)", marginBottom: "var(--space-2)", color: "var(--color-text-primary)" }}>{title}</div>
          <div style={{ fontSize: "var(--font-size-body-13)", color: "var(--color-text-secondary)", lineHeight: 1.6 }}>{desc}</div>
        </div>
      ))}
    </div>
    <div style={{ marginBottom: 12, marginTop: 36, fontSize: "var(--font-size-label-sb-15)", fontWeight: "var(--font-weight-label-sb-15)" as any, color: "var(--color-text-primary)", textTransform: "capitalize", letterSpacing: "normal" }}>All {componentCount} components</div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
      {NAV.flatMap(g => g.items).filter(i => !["intro", "install", "theming"].includes(i.id)).map(item => (
        <span key={item.id} style={{
          padding: "3px 10px", border: "1px solid var(--border)", borderRadius: 6, fontSize: 12,
          fontFamily: "monospace", color: "var(--muted-fg)", display: "flex", alignItems: "center", gap: 5
        }}>
          {item.title}
          {(item as any).label && <span style={{
            fontSize: 9, fontWeight: 700, padding: "1px 4px", borderRadius: 999,
            background: LABEL_COLORS[(item as any).label].bg, color: LABEL_COLORS[(item as any).label].color, textTransform: "uppercase"
          }}>{(item as any).label}</span>}
        </span>
      ))}
    </div>
  </div>;
}

/* ═══════════════════════════════════════════════════════════
   INSTALLATION PAGE
═══════════════════════════════════════════════════════════ */
function PageInstallation() {
  const installPkg = {
    npm:  "npm install @heartstamp/design-system",
    pnpm: "pnpm add @heartstamp/design-system",
    yarn: "yarn add @heartstamp/design-system",
  };

  const peerInstall = {
    npm:  "npm install react react-dom",
    pnpm: "pnpm add react react-dom",
    yarn: "yarn add react react-dom",
  };

  const importCss = `// main.tsx — add this once at your app entry point
import '@heartstamp/design-system/design-system.css'`;

  const firstComponentCode = `import { Btn, Bdg } from '@heartstamp/design-system'

export default function App() {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
      <Btn variant="default">Get started</Btn>
      <Btn variant="outline">Learn more</Btn>
      <Bdg variant="default">New</Bdg>
    </div>
  )
}`;

  const stepNumStyle: React.CSSProperties = {
    width: 24, height: 24, borderRadius: "50%",
    background: "var(--accent)", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 12, fontWeight: 700, flexShrink: 0,
  };

  const stepRowStyle: React.CSSProperties = {
    display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 32,
  };

  const prereqs = [
    { label: "Node.js",   req: "≥ 18.0", note: "LTS recommended" },
    { label: "react",     req: "≥ 18.0", note: "peer dependency" },
    { label: "react-dom", req: "≥ 18.0", note: "peer dependency" },
  ];

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ marginBottom: 36 }}>
        <span style={{
          display: "inline-block", fontSize: 11, fontWeight: 700, padding: "3px 10px",
          borderRadius: 999, background: "var(--muted)", color: "var(--muted-fg)",
          border: "1px solid var(--border)", marginBottom: 16,
          textTransform: "uppercase", letterSpacing: ".06em",
        }}>Getting Started</span>
        <h1 style={{ margin: "0 0 10px", fontSize: 34, fontWeight: 900, color: "var(--fg)", letterSpacing: "-.03em", lineHeight: 1.1 }}>
          Installation
        </h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--muted-fg)", lineHeight: 1.7, maxWidth: 560 }}>
          Add <code style={{ fontFamily: "monospace", background: "var(--muted)", padding: "1px 6px", borderRadius: 4 }}>@heartstamp/design-system</code> to your React project in three steps. The stylesheet ships bundled — no extra tooling required.
        </p>
      </div>

      <div style={{ height: 1, background: "var(--border)", marginBottom: 36 }} />

      {/* ── Step 1 — Prerequisites ── */}
      <div style={stepRowStyle}>
        <div style={stepNumStyle}>1</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Prerequisites</div>
          <div style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 16, lineHeight: 1.6 }}>
            Make sure your project satisfies these peer dependencies before installing.
          </div>

          {/* Prereq table */}
          <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                  {["Dependency", "Version", "Notes"].map(h => (
                    <th key={h} style={{ padding: "8px 14px", textAlign: "left", fontWeight: 600, color: "var(--muted-fg)", fontSize: 11, textTransform: "uppercase", letterSpacing: ".05em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {prereqs.map((r, i) => (
                  <tr key={r.label} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--muted)", borderBottom: i < prereqs.length - 1 ? "1px solid var(--border)" : "none" }}>
                    <td style={{ padding: "9px 14px", fontWeight: 600, color: "var(--fg)", fontFamily: "monospace" }}>{r.label}</td>
                    <td style={{ padding: "9px 14px", color: "var(--accent)", fontFamily: "monospace", fontWeight: 600 }}>{r.req}</td>
                    <td style={{ padding: "9px 14px", color: "var(--muted-fg)" }}>{r.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Peer deps — shadcn-style install block */}
          <InstallBlock
            label="Don't have React yet? Install peer deps first:"
            commands={peerInstall}
          />
        </div>
      </div>

      {/* ── Step 2 — Install the package ── */}
      <div style={stepRowStyle}>
        <div style={stepNumStyle}>2</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Install the Package</div>
          <div style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 16, lineHeight: 1.6 }}>
            Install <code style={{ fontFamily: "monospace", background: "var(--muted)", padding: "1px 5px", borderRadius: 4 }}>@heartstamp/design-system</code> from the npm registry:
          </div>

          <InstallBlock commands={installPkg} />

          <div style={{ marginTop: 16 }}>
            <CodeBlock code={importCss} filename="main.tsx" />
          </div>

          <div style={{ marginTop: 12 }}>
            <Callout variant="warning">
              The CSS import must be added <strong>once</strong> at the root of your app (e.g. <code style={{ fontFamily: "monospace" }}>main.tsx</code>). Skipping it will cause components to render unstyled.
            </Callout>
          </div>
        </div>
      </div>

      {/* ── Step 3 — Use components ── */}
      <div style={stepRowStyle}>
        <div style={stepNumStyle}>3</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--fg)", marginBottom: 4 }}>Use Components</div>
          <div style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 16, lineHeight: 1.6 }}>
            Import any component from <code style={{ fontFamily: "monospace", background: "var(--muted)", padding: "1px 5px", borderRadius: 4 }}>@heartstamp/design-system</code>. Tree-shaking is fully supported — only what you import is bundled.
          </div>

          <Preview title="Button & Badge" code={firstComponentCode} filename="App.tsx" height={68}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <Btn variant="default">Get started</Btn>
              <Btn variant="outline">Learn more</Btn>
              <Bdg variant="default">New</Bdg>
            </div>
          </Preview>

          <div style={{ marginTop: 12 }}>
            <Callout variant="info">
              All components are exported from the package root — no deep path imports needed.
            </Callout>
          </div>
        </div>
      </div>

      <div style={{ height: 1, background: "var(--border)", margin: "8px 0 32px" }} />

      {/* ── Troubleshooting ── */}
      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 800, color: "var(--fg)", letterSpacing: "-.02em", marginBottom: 4 }}>Troubleshooting</div>
        <div style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 20, lineHeight: 1.6 }}>Common issues and how to fix them.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <Callout variant="danger">
            <strong>Components render without styles</strong><br />
            You're missing the CSS import. Add <code style={{ fontFamily: "monospace" }}>import '@heartstamp/design-system/design-system.css'</code> to your app entry point.
          </Callout>
          <Callout variant="warning">
            <strong>React peer dependency not found</strong><br />
            <code style={{ fontFamily: "monospace" }}>react</code> and <code style={{ fontFamily: "monospace" }}>react-dom</code> must be installed in your own project. Run <code style={{ fontFamily: "monospace" }}>npm install react react-dom</code>.
          </Callout>
          <Callout variant="warning">
            <strong>Module not found: @heartstamp/design-system</strong><br />
            Ensure the package is published or linked locally. For local dev: <code style={{ fontFamily: "monospace" }}>npm install ../path-to-design-system</code>.
          </Callout>
          <Callout variant="info">
            <strong>Node.js version</strong><br />
            Node.js ≥ 18 is required. Run <code style={{ fontFamily: "monospace" }}>node -v</code> to verify. Use <a href="https://github.com/nvm-sh/nvm" style={{ color: "var(--accent)" }}>nvm</a> to manage multiple versions.
          </Callout>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   APP NAV CONTEXT — shared navigation for icon cross-linking
═══════════════════════════════════════════════════════════ */
interface AppNav { goToIcon: (name: string) => void; iconSearch: string; goToPage: (id: string) => void; }
const AppNavContext = React.createContext<AppNav>({ goToIcon: () => {}, iconSearch: "", goToPage: () => {} });

/* ── IcoLink — wraps any icon in a hover tooltip that links to
   the Icons page pre-searched for that icon name ─────────── */
function IcoLink({ name, children }: { name: string; children: React.ReactNode }) {
  const { goToIcon } = React.useContext(AppNavContext);
  const [show, setShow] = useState(false);
  return (
    <span
      style={{ position: "relative", display: "inline-flex" }}
      onMouseEnter={(e) => { if (!(e.currentTarget as HTMLElement).closest("button")) setShow(true); }}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <span style={{
          position: "absolute", bottom: "calc(100% + 6px)", left: "50%",
          transform: "translateX(-50%)",
          background: "var(--fg)", color: "var(--bg)",
          borderRadius: 6, padding: "4px 8px",
          fontSize: 11, fontWeight: 500,
          whiteSpace: "nowrap", zIndex: 100,
          display: "flex", alignItems: "center", gap: 6,
          pointerEvents: "none",
        }}>
          {name}
          <button
            onMouseDown={(e) => { e.preventDefault(); goToIcon(name); }}
            style={{
              fontSize: 10, color: "var(--color-brand-primary)",
              background: "none", border: "none", cursor: "pointer",
              padding: 0, pointerEvents: "all",
            }}
          >
            ↗ Icons
          </button>
        </span>
      )}
    </span>
  );
}

/* ═══════════════════════════════════════════════════════════
   ICONS PAGE
═══════════════════════════════════════════════════════════ */
function PageIcons() {
  const { iconSearch: initialSearch } = React.useContext(AppNavContext);
  const [query, setQuery] = useState(initialSearch);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => { if (initialSearch) setQuery(initialSearch); }, [initialSearch]);

  const allIcons = useMemo(() =>
    (Object.entries(LucideIcons) as [string, any][])
      .filter(([name, val]) =>
        /^[A-Z]/.test(name) &&
        typeof val === "object" && val !== null &&
        typeof val.displayName === "string"   // actual icon components always have displayName
      )
      .sort(([a], [b]) => a.localeCompare(b)) as [string, React.FC<{ size?: number }>][],
    []
  );

  const filtered = useMemo(() =>
    query.trim()
      ? allIcons.filter(([name]) => name.toLowerCase().includes(query.toLowerCase()))
      : allIcons,
    [query, allIcons]
  );

  const copyIcon = async (name: string) => {
    const text = `import { ${name} } from "lucide-react";`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(name);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: "var(--font-size-h1)", fontWeight: "var(--font-weight-heading)", color: "var(--fg)", margin: 0 }}>
          Icons
        </h1>
        <p style={{ color: "var(--muted-fg)", marginTop: 6, fontSize: 14 }}>
          Lucide icon pack · {filtered.length.toLocaleString()} of {allIcons.length.toLocaleString()} icons
          · Click any icon to copy its import
        </p>
      </div>

      {/* Search + Figma link */}
      <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: 20 }}>
        <div style={{ flex: 1, position: "relative" }}>
          <Search size={13} style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted-fg)", pointerEvents: "none", zIndex: 1,
          }} />
          <Inp
            placeholder="Search icons…"
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            style={{ paddingLeft: 32 }}
          />
        </div>
        <Btn variant="outline" size="lg" onClick={() => window.open("https://www.figma.com/community/plugin/1233659525460777155/lucide-icons", "_blank")}>
          <svg width="14" height="14" viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
            <path d="M19 28.5C19 25.9804 20.0009 23.5641 21.7825 21.7825C23.5641 20.0009 25.9804 19 28.5 19C31.0196 19 33.4359 20.0009 35.2175 21.7825C36.9991 23.5641 38 25.9804 38 28.5C38 31.0196 36.9991 33.4359 35.2175 35.2175C33.4359 36.9991 31.0196 38 28.5 38C25.9804 38 23.5641 36.9991 21.7825 35.2175C20.0009 33.4359 19 31.0196 19 28.5Z" fill="#1ABCFE"/>
            <path d="M0 47.5C0 44.9804 1.00089 42.5641 2.78249 40.7825C4.56408 39.0009 6.98044 38 9.5 38H19V47.5C19 50.0196 17.9991 52.4359 16.2175 54.2175C14.4359 55.9991 12.0196 57 9.5 57C6.98044 57 4.56408 55.9991 2.78249 54.2175C1.00089 52.4359 0 50.0196 0 47.5Z" fill="#0ACF83"/>
            <path d="M19 0V19H28.5C31.0196 19 33.4359 17.9991 35.2175 16.2175C36.9991 14.4359 38 12.0196 38 9.5C38 6.98044 36.9991 4.56408 35.2175 2.78249C33.4359 1.00089 31.0196 0 28.5 0H19Z" fill="#FF7262"/>
            <path d="M0 9.5C0 12.0196 1.00089 14.4359 2.78249 16.2175C4.56408 17.9991 6.98044 19 9.5 19H19V0H9.5C6.98044 0 4.56408 1.00089 2.78249 2.78249C1.00089 4.56408 0 6.98044 0 9.5Z" fill="#F24E1E"/>
            <path d="M0 28.5C0 31.0196 1.00089 33.4359 2.78249 35.2175C4.56408 36.9991 6.98044 38 9.5 38H19V19H9.5C6.98044 19 4.56408 20.0009 2.78249 21.7825C1.00089 23.5641 0 25.9804 0 28.5Z" fill="#A259FF"/>
          </svg>
          Figma Icons
        </Btn>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <p style={{ color: "var(--muted-fg)", fontSize: 14 }}>No icons match "{query}".</p>
      )}

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
        gap: 12,
      }}>
        {filtered.map(([name, Icon]) => {
          const isCopied = copied === name;
          return (
            <div
              key={name}
              onClick={() => copyIcon(name)}
              title={`${name} — click to copy import`}
              style={{
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                gap: 6, padding: "12px 6px",
                height: 80,
                borderRadius: 8,
                border: `1px solid ${isCopied ? "var(--color-brand-primary)" : "var(--border)"}`,
                background: isCopied ? "var(--color-brand-primary-dim)" : "var(--bg)",
                color: isCopied ? "var(--color-brand-primary)" : "var(--fg)",
                cursor: "pointer",
                transition: "background 0.15s, border-color 0.15s, color 0.15s",
                userSelect: "none",
              }}
              onMouseEnter={e => {
                if (!isCopied) {
                  (e.currentTarget as HTMLElement).style.background = "var(--muted)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-primary)";
                }
              }}
              onMouseLeave={e => {
                if (!isCopied) {
                  (e.currentTarget as HTMLElement).style.background = "var(--bg)";
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                }
              }}
            >
              <Icon size={20} />
              <span style={{
                fontSize: 10, lineHeight: 1.3, textAlign: "center",
                wordBreak: "break-all",
                color: isCopied ? "var(--color-brand-primary)" : "var(--muted-fg)",
              }}>
                {isCopied ? "Copied!" : name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   LOGOS PAGE
═══════════════════════════════════════════════════════════ */
function PageLogos() {
  type LogoVariant = { color: "brand" | "brand-dark" | "dark" | "light"; bg: string; inv: boolean; label: string };

  const EMBLEM_VARIANTS: LogoVariant[] = [
    { color: "brand", bg: "#FFFFFF", inv: false, label: "Brand Color" },
    { color: "dark",  bg: "#FFFFFF", inv: false, label: "Dark Color"  },
    { color: "light", bg: "#242423", inv: true,  label: "Light Color" },
  ];
  const LOCKUP_VARIANTS: LogoVariant[] = [
    { color: "brand",      bg: "#FFFFFF",                          inv: false, label: "Brand Color"           },
    { color: "light",      bg: "#FAF6F0",                          inv: false, label: "Dark Color"            },
    { color: "dark",       bg: "#F1F1F1",                          inv: false, label: "Brand Color · Dark BG" },
    { color: "brand-dark", bg: "#242423",                          inv: true,  label: "Light Color"           },
  ];

  // ── Download helpers ───────────────────────────────────────
  function triggerDownload(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  }
  function dlSvg(type: "emblem" | "lockup", color: "brand" | "brand-dark" | "dark" | "light") {
    const svg = getSvgString(type, color);
    triggerDownload(URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" })), `heartstamp-${type}-${color}.svg`);
  }
  async function dlPng(type: "emblem" | "lockup", color: "brand" | "brand-dark" | "dark" | "light") {
    const svg = getSvgString(type, color);
    const scale = 4;
    const [vw, vh] = type === "emblem" ? (color === "dark" ? [239, 241] : [240, 241]) : [456, 114];
    const img = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
    await new Promise<void>(r => { img.onload = () => r(); img.src = url; });
    URL.revokeObjectURL(url);
    const canvas = document.createElement("canvas");
    canvas.width = vw * scale; canvas.height = vh * scale;
    canvas.getContext("2d")!.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(b => { if (b) triggerDownload(URL.createObjectURL(b), `heartstamp-${type}-${color}.png`); }, "image/png");
  }
  async function dlAll() {
    const { zipSync, strToU8 } = await import("fflate");
    const files: Record<string, Uint8Array> = {};
    for (const { color } of EMBLEM_VARIANTS) {
      files[`emblem-${color}.svg`] = strToU8(getSvgString("emblem", color));
    }
    for (const { color } of LOCKUP_VARIANTS) {
      files[`lockup-${color}.svg`] = strToU8(getSvgString("lockup", color));
    }
    triggerDownload(URL.createObjectURL(new Blob([zipSync(files)], { type: "application/zip" })), "heartstamp-logos.zip");
  }

  // ── Pill download button ───────────────────────────────────
  function FilePill({ label, onClick, inv }: { label: string; onClick: () => void; inv?: boolean }) {
    const [hover, setHover] = React.useState(false);
    return (
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 4,
          padding: "5px 11px", borderRadius: 999, cursor: "pointer",
          fontSize: 12, fontWeight: 500, lineHeight: 1,
          border: `1px solid ${inv ? "rgba(255,255,255,0.22)" : "var(--border)"}`,
          background: hover
            ? (inv ? "rgba(255,255,255,0.12)" : "var(--color-element-subtle)")
            : (inv ? "rgba(255,255,255,0.06)" : "transparent"),
          color: inv ? "rgba(255,255,255,0.75)" : "var(--muted-fg)",
          transition: "background 0.12s",
          outline: "none",
        }}
      >
        <Download size={11} style={{ opacity: 0.7 }} />{label}
      </button>
    );
  }

  // ── Unified card ───────────────────────────────────────────
  function LogoCard({ type, variants, renderLogo, logoHeight }: {
    type: "emblem" | "lockup";
    variants: LogoVariant[];
    renderLogo: (v: LogoVariant) => React.ReactNode;
    logoHeight: number;
  }) {
    return (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${variants.length}, 1fr)`, borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
        {variants.map(({ color, bg, inv, label }, i) => (
          <div key={color} style={{
            background: bg,
            borderRight: i < variants.length - 1 ? "1px solid var(--border)" : undefined,
            padding: "40px 24px 20px",
            display: "flex", flexDirection: "column",
            minHeight: logoHeight + 120,
          }}>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {renderLogo({ color, bg, inv, label })}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, gap: 8 }}>
              <span style={{ fontSize: 12, color: inv ? "rgba(255,255,255,0.45)" : "var(--muted-fg)" }}>{label}</span>
              <div style={{ display: "flex", gap: 5 }}>
                <FilePill label="SVG" onClick={() => dlSvg(type, color)} inv={inv} />
                <FilePill label="PNG" onClick={() => dlPng(type, color)} inv={inv} />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  const embedCode = `import { HSLogo, HSEmblem, HSLockup } from "@/components/ui/hs-logo";

// Unified component
<HSLogo type="emblem" color="brand" height={64} />
<HSLogo type="lockup" color="brand" height={40} />

// Convenience aliases
<HSEmblem color="dark" height={48} />
<HSLockup color="light" height={36} />`;

  return (
    <DocPage title="Branding" subtitle="HeartStamp brand mark. Two types — emblem (icon only) and lockup (icon + wordmark) — each in three colour variants.">

      <DocSection
        title="Emblem"
        desc="Square icon mark: heart silhouette with H letterform and mini stamp detail."
        action={<Btn size="sm" variant="outline" onClick={dlAll}><Download size={16} />Download All</Btn>}
      >
        <LogoCard
          type="emblem"
          variants={EMBLEM_VARIANTS}
          logoHeight={80}
          renderLogo={({ color }) => <HSEmblem color={color} height={80} />}
        />
      </DocSection>

      <DocSection title="Lockup" desc="Horizontal combination of the heart icon and the HeartStamp wordmark.">
        <div style={{ borderRadius: 12, border: "1px solid var(--border)", overflow: "hidden" }}>
          {LOCKUP_VARIANTS.map(({ color, bg, inv, label }, i) => (
            <div key={color} style={{
              background: bg,
              borderBottom: i < LOCKUP_VARIANTS.length - 1 ? "1px solid var(--border)" : undefined,
              padding: "28px 32px",
              display: "flex", alignItems: "center", gap: 16,
            }}>
              <div style={{ flex: 1 }}>
                <HSLockup color={color} height={40} />
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span style={{ fontSize: 12, color: inv ? "rgba(255,255,255,0.45)" : "var(--muted-fg)" }}>{label}</span>
                <div style={{ display: "flex", gap: 5 }}>
                  <FilePill label="SVG" onClick={() => dlSvg("lockup", color)} inv={inv} />
                  <FilePill label="PNG" onClick={() => dlPng("lockup", color)} inv={inv} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </DocSection>

      <DocSection title="Usage">
        <Preview title="Logo · usage" code={embedCode} height={120}>
          <div style={{ display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap", padding: "0 var(--space-4)" }}>
            <HSEmblem color="brand" height={56} />
            <HSLockup color="brand" height={40} />
            <HSLockup color="dark"  height={40} />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={[
          { name: "type",   type: '"emblem" | "lockup"', def: '"lockup"', desc: "Emblem is icon-only; lockup combines icon and wordmark." },
          { name: "color",  type: '"brand" | "brand-dark" | "dark" | "light"', def: '"brand"', desc: "Brand: pink heart, dark text (light bg). Brand-dark: pink heart, white text (dark bg). Dark: charcoal. Light: white." },
          { name: "height", type: "number", def: "—", desc: "Height in px. Width scales proportionally." },
        ]} />
      </DocSection>
    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   THEMING PAGE
═══════════════════════════════════════════════════════════ */
function PageTheming() {
  /* ── Playground state ───────────────────────────────────── */
  const DFLT_PRIMARY   = "#be1d2c";
  const DFLT_SECONDARY = "#242423";
  const [primary,    setPrimary]   = useState(DFLT_PRIMARY);
  const [secondary,  setSecondary] = useState(DFLT_SECONDARY);
  const [demoMode,   setDemoMode]  = useState<"light" | "dark">("light");
  const [tokenMode,  setTokenMode] = useState<"light" | "dark">("light");
  const [copied,     setCopied]    = useState(false);

  /* ── Color utilities ────────────────────────────────────── */
  const hexToRgb = (hex: string): [number, number, number] | null => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16), parseInt(m[2], 16), parseInt(m[3], 16)] : null;
  };
  const toRgba = (hex: string, a: number) => {
    const rgb = hexToRgb(hex);
    return rgb ? `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${a})` : hex;
  };
  const adj = (hex: string, f: number) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    const [r, g, b] = rgb.map(v => Math.min(255, Math.max(0, Math.round(v * f))));
    return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
  };
  const lum = (hex: string) => {
    const rgb = hexToRgb(hex);
    return rgb ? (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255 : 0.5;
  };

  /* ── Live CSS-var overrides ─────────────────────────────── */
  const base = demoMode === "light" ? LIGHT_THEME : DARK_THEME;
  const liveVars: Record<string, string> = {
    ...base,
    "--accent":                        primary,
    "--accent-hover":                  adj(primary,  1.13),
    "--accent-pressed":                adj(primary,  0.87),
    "--accent-subtle":                 toRgba(primary, demoMode === "light" ? 0.08 : 0.12),
    "--secondary":                     secondary,
    "--secondary-hover":               adj(secondary, demoMode === "light" ? 1.22 : 1.13),
    "--secondary-pressed":             adj(secondary, demoMode === "light" ? 0.75 : 0.88),
    "--secondary-subtle":              toRgba(secondary, demoMode === "light" ? 0.10 : 0.13),
    "--link":                          primary,
    "--state-error":                   primary,
    "--heart":                         toRgba(primary, 0.45),
    "--text-on-primary":               lum(primary)   > 0.55 ? "#242423" : "#ffffff",
    "--text-on-secondary":             lum(secondary) > 0.55 ? "#242423" : "#ffffff",
    "--btn-secondary-ghost-hover-bg":  toRgba(secondary, 0.12),
    "--btn-secondary-ghost-hover-bdr": toRgba(secondary, 0.15),
  };

  /* ── Generated CSS snippet ──────────────────────────────── */
  const cssSnippet = [
    `:root {`,
    `  /* Brand Primary */`,
    `  --accent:         ${primary};`,
    `  --accent-hover:   ${adj(primary, 1.13)};`,
    `  --accent-pressed: ${adj(primary, 0.87)};`,
    `  --accent-subtle:  ${toRgba(primary, 0.08)};`,
    ``,
    `  /* Brand Secondary */`,
    `  --secondary:         ${secondary};`,
    `  --secondary-hover:   ${adj(secondary, 1.22)};`,
    `  --secondary-pressed: ${adj(secondary, 0.75)};`,
    `  --secondary-subtle:  ${toRgba(secondary, 0.10)};`,
    ``,
    `  /* Derived */`,
    `  --link:        ${primary};`,
    `  --state-error: ${primary};`,
    `  --heart:       ${toRgba(primary, 0.45)};`,
    `}`,
  ].join("\n");

  const copySnippet = async () => {
    try { await navigator.clipboard.writeText(cssSnippet); } catch {}
    setCopied(true); setTimeout(() => setCopied(false), 1800);
  };

  /* ── Full color-var metadata for reference table ────────── */
  const COLOR_VAR_META: { v: string; desc: string }[] = [
    { v: "--bg",                     desc: "Page / card background surface" },
    { v: "--fg",                     desc: "Primary foreground text & icons" },
    { v: "--muted",                  desc: "Muted fill — secondary surfaces, headers" },
    { v: "--muted-fg",               desc: "Secondary text rendered on muted surfaces" },
    { v: "--border",                 desc: "Default border & divider stroke" },
    { v: "--accent",                 desc: "Brand primary — buttons, links, focus rings" },
    { v: "--accent-subtle",          desc: "Tinted accent background — badges, alerts, tags" },
    { v: "--accent-hover",           desc: "Accent hover state (slightly lighter)" },
    { v: "--accent-pressed",         desc: "Accent pressed / active state (slightly darker)" },
    { v: "--secondary",              desc: "Brand secondary — inverse of page color" },
    { v: "--secondary-subtle",       desc: "Tinted secondary background" },
    { v: "--secondary-hover",        desc: "Secondary hover state" },
    { v: "--secondary-pressed",      desc: "Secondary pressed state" },
    { v: "--text-on-primary",        desc: "Text rendered on --accent colored surfaces" },
    { v: "--text-on-secondary",      desc: "Text rendered on --secondary colored surfaces" },
    { v: "--text-disabled",          desc: "Disabled & placeholder text" },
    { v: "--bg-input",               desc: "Input field background" },
    { v: "--bg-menus",               desc: "Dropdown, popover & menu surface" },
    { v: "--bg-editor",              desc: "Code editor / inspector panel surface" },
    { v: "--state-hover",            desc: "Generic hover overlay applied on any surface" },
    { v: "--state-pressed",          desc: "Generic pressed / active overlay" },
    { v: "--state-error",            desc: "Error / destructive indicator color" },
    { v: "--link",                   desc: "Hyperlink foreground color" },
    { v: "--heart",                  desc: "Brand heart lockup accent (decorative)" },
    { v: "--color-element-disabled", desc: "Disabled element fill / wash" },
    { v: "--btn-secondary-ghost-hover-bg",  desc: "Ghost button hover background (secondary)" },
    { v: "--btn-secondary-ghost-hover-bdr", desc: "Ghost button hover border (secondary)" },
  ];

  /* ── Shared token table data ────────────────────────────── */
  const SHARED_SECTIONS: { group: string; rows: string[][] }[] = [
    {
      group: "Border Radius", rows: [
        ["--radius-none",   "0px",   "No radius — sharp corners"],
        ["--radius-xs",     "4px",   "Tiny — status dots, indicators"],
        ["--radius-sm",     "6px",   "Small — chips, compact UI"],
        ["--radius-md",     "7px",   "Medium — most surfaces & containers"],
        ["--radius-lg",     "8px",   "Large — cards, panels"],
        ["--radius-xl",     "10px",  "Extra large"],
        ["--radius-2xl",    "12px",  "2XL — modals, sheets"],
        ["--radius-3xl",    "14px",  "3XL"],
        ["--radius-button", "25px",  "All Btn variants — enforced 25px pill curve"],
        ["--radius-input",  "32px",  "All Inp fields — fully soft 32px curve"],
        ["--radius-full",   "999px", "Pills & avatar circles"],
      ]
    },
    {
      group: "Box Shadow", rows: [
        ["--shadow-xs",  "0 1px 3px rgba(0,0,0,.12)",   "Hairline — subtlest elevation"],
        ["--shadow-sm",  "0 1px 3px rgba(0,0,0,.20)",   "Small — buttons, inputs on rest"],
        ["--shadow-md",  "0 4px 12px rgba(0,0,0,.20)",  "Medium — cards, dropdowns"],
        ["--shadow-lg",  "0 8px 24px rgba(0,0,0,.15)",  "Large — modals, sheets"],
        ["--shadow-xl",  "0 8px 32px rgba(0,0,0,.15)",  "XL — popovers"],
        ["--shadow-2xl", "0 24px 64px rgba(0,0,0,.30)", "2XL — full-screen overlays"],
      ]
    },
    {
      group: "Button Sizing", rows: [
        ["--btn-padding-sm",      "8px 12px",  "Padding for size=\"sm\""],
        ["--btn-padding-default", "10px 16px",  "Padding for default size"],
        ["--btn-padding-lg",      "12px 20px", "Padding for size=\"lg\""],
        ["--btn-padding-icon",    "8px",        "Icon-only square button"],
        ["--btn-gap",             "6px",        "Gap between icon and label text"],
        ["--font-size-btn-sm",    "12px",       "Label font size — small"],
        ["--font-size-btn",       "13px",       "Label font size — default"],
        ["--font-size-btn-lg",    "15px",       "Label font size — large"],
        ["--font-weight-btn",     "500",        "Label font weight — all sizes"],
      ]
    },
    {
      group: "Typography Scale", rows: [
        ["--font-family-heading",  "'Stack Sans Text', 'Instrument Sans', system-ui", "Heading typeface"],
        ["--font-family-body",     "'DM Sans', system-ui",                            "Body & UI typeface"],
        ["--font-family-mono",     "ui-monospace, 'Cascadia Code'",                   "Code / monospace typeface"],
        ["--font-size-h1",         "56px",  "H1 — hero headings"],
        ["--font-size-h2",         "40px",  "H2 — section headings"],
        ["--font-size-h3",         "36px",  "H3"],
        ["--font-size-h4",         "20px",  "H4"],
        ["--font-size-h5",         "18px",  "H5"],
        ["--font-size-subheadline","24px",  "Subheadline / lead text"],
        ["--font-size-body-15",    "15px",  "Body text"],
        ["--font-size-label-15",   "15px",  "Label — medium weight"],
        ["--font-size-label-12",   "12px",  "Label — small / caption"],
        ["--font-size-body-13",    "13px",  "Dense body / secondary text"],
      ]
    },
    {
      group: "Input", rows: [
        ["--inp-padding",          "10px 12px", "Internal padding of every input field"],
        ["--font-size-inp",        "15px",      "Text size inside inputs"],
        ["--inp-opacity-disabled", "0.5",       "Opacity when input is disabled"],
      ]
    },
  ];

  /* ── Sub-helpers ────────────────────────────────────────── */
  const isColorVal = (v: string) => v.startsWith("#") || v.startsWith("rgba");
  const Swatch = ({ color, dark }: { color: string; dark?: boolean }) => (
    <div style={{ width: 14, height: 14, borderRadius: 3, background: color, border: `1px solid rgba(${dark ? "255,255,255" : "0,0,0"},.14)`, flexShrink: 0 }} />
  );
  const TH = ({ children }: { children: React.ReactNode }) => (
    <th style={{ padding: "8px 14px", textAlign: "left" as const, fontWeight: 600, color: "var(--muted-fg)", fontSize: 10.5, textTransform: "uppercase" as const, letterSpacing: ".04em" }}>{children}</th>
  );
  const SectionBar = () => (
    <div style={{ width: 3, height: 16, borderRadius: 99, background: "#be1d2c", marginRight: 8, flexShrink: 0 }} />
  );
  const ModePill = ({ current, onChange }: { current: "light" | "dark"; onChange: (v: "light" | "dark") => void }) => (
    <Tabs value={current} onValueChange={(v) => onChange(v as "light" | "dark")}>
      <TabsList>
        <TabsTrigger value="light">☀️ Light</TabsTrigger>
        <TabsTrigger value="dark">🌙 Dark</TabsTrigger>
      </TabsList>
    </Tabs>
  );

  /* ════════════════════════════════════════════════════════ */
  return (
    <DocPage
      title="Theming"
      subtitle="HeartStamp DS uses a two-layer CSS variable system — mode-specific color tokens and shared structural tokens — giving you full control over every visual aspect without touching component source files."
    >

      {/* ══ 1. Architecture ═══════════════════════════════════ */}
      <DocSection title="Token Architecture" desc="How design decisions flow from brand primitives through to every rendered component.">
        <Callout variant="info">
          HeartStamp uses <strong>two independent token layers</strong>: (1) <code style={{ fontFamily: "monospace", fontSize: 12 }}>LIGHT_THEME</code> / <code style={{ fontFamily: "monospace", fontSize: 12 }}>DARK_THEME</code> — mode-aware color variables injected on the app root at runtime, and (2) <code style={{ fontFamily: "monospace", fontSize: 12 }}>SHARED_TOKENS</code> — structural values (radius, shadow, spacing, typography) that are identical in both modes and merged into each theme map.
        </Callout>

        {/* Architecture flow diagram */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, padding: "28px 0 20px" }}>
          <div style={{ display: "flex", gap: 12 }}>
            {[{ hex: "#BE1D2C", label: "Brand Primary" }, { hex: "#242423", label: "Brand Secondary" }].map(({ hex, label }) => (
              <div key={hex} style={{
                padding: "10px 20px", borderRadius: 10, border: "2px solid #be1d2c",
                background: "rgba(190,29,44,0.06)", textAlign: "center" as const, minWidth: 130,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: hex, margin: "0 auto 6px", border: "1px solid rgba(0,0,0,.1)" }} />
                <div style={{ fontWeight: 800, fontSize: 12.5, color: "#be1d2c", fontFamily: "monospace" }}>{hex}</div>
                <div style={{ fontSize: 11, color: "var(--muted-fg)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: "var(--muted-fg)", lineHeight: 1 }}>↓</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" as const, justifyContent: "center" }}>
            {[
              { label: "LIGHT_THEME",   sub: "22 color vars",                    badge: "light", badgeColor: "#f59e0b" },
              { label: "DARK_THEME",    sub: "22 color vars",                    badge: "dark",  badgeColor: "#818cf8" },
              { label: "SHARED_TOKENS", sub: "Radius · Shadow · Type · Btn · Inp", badge: "both",  badgeColor: "#34d399" },
            ].map(({ label, sub, badge, badgeColor }) => (
              <div key={label} style={{
                padding: "10px 16px", borderRadius: 10, border: "1px solid var(--border)",
                background: "var(--bg)", textAlign: "center" as const, minWidth: 120,
              }}>
                <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--fg)", marginBottom: 4, fontFamily: "monospace" }}>{label}</div>
                <div style={{ fontSize: 11, color: "var(--muted-fg)", marginBottom: 6 }}>{sub}</div>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: `${badgeColor}22`, color: badgeColor, textTransform: "uppercase" as const }}>{badge}</span>
              </div>
            ))}
          </div>
          <div style={{ fontSize: 18, color: "var(--muted-fg)", lineHeight: 1 }}>↓</div>
          <div style={{
            padding: "10px 28px", borderRadius: 10, border: "1px solid var(--border)",
            background: "var(--bg)", textAlign: "center" as const,
          }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: "var(--fg)", marginBottom: 3 }}>CSS Variables injected on <code style={{ fontFamily: "monospace", fontSize: 12, color: "#a78bfa" }}>#root</code></div>
            <div style={{ fontSize: 11, color: "var(--muted-fg)" }}>inline <code style={{ fontFamily: "monospace", fontSize: 11 }}>style</code> object applied at runtime — no class toggle, no build step</div>
          </div>
          <div style={{ fontSize: 18, color: "var(--muted-fg)", lineHeight: 1 }}>↓</div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const, justifyContent: "center", maxWidth: 540 }}>
            {["Btn","Inp","Lbl","Bdg","Avt","Alrt","Crd","Sel","Swt","Cbx","Rdo","Sldr","Prg","Skl","Tbl","Acc","Dlg","Tip","Cmd","…"].map(c => (
              <div key={c} style={{
                padding: "4px 10px", borderRadius: 6, border: "1px solid var(--border)",
                fontSize: 11, fontFamily: "monospace", color: "var(--muted-fg)", background: "var(--bg)",
              }}>{c}</div>
            ))}
          </div>
        </div>

        {/* Two-layer description cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {[
            {
              title: "Layer 1 — Color Tokens", badge: "Mode-aware", badgeColor: "#38bdf8",
              items: [
                "22 CSS variables per mode (light & dark)",
                "Injected as inline style on #root at runtime",
                "Switched instantly — no class toggling required",
                "Covers: brand, surfaces, text, interactive states",
                "Defined in theme.ts → LIGHT_THEME / DARK_THEME",
              ],
            },
            {
              title: "Layer 2 — Structural Tokens", badge: "Mode-invariant", badgeColor: "#34d399",
              items: [
                "Radius scale: --radius-none → --radius-full",
                "Shadow scale: --shadow-xs → --shadow-2xl",
                "Button sizing: padding, gap, font-size/weight",
                "Typography: font-family, font-size, font-weight",
                "Defined in theme.ts → SHARED_TOKENS (merged into both)",
              ],
            },
          ].map(({ title, badge, badgeColor, items }) => (
            <div key={title} style={{ padding: 16, borderRadius: 10, border: "1px solid var(--border)", background: "var(--bg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <span style={{ fontWeight: 700, fontSize: 13, color: "var(--fg)" }}>{title}</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, padding: "2px 7px", borderRadius: 999, background: `${badgeColor}22`, color: badgeColor, textTransform: "uppercase" as const }}>{badge}</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {items.map((item, i) => (
                  <li key={i} style={{ fontSize: 12, color: "var(--muted-fg)", marginBottom: 4, lineHeight: 1.5 }}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ══ 2. Color Token Groups ═══════════════════════════════ */}
      <DocSection title="Color Token Groups" desc="All 5 semantic color groups — token name, CSS variable, resolved value, and swatch. Toggle between modes to compare.">
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20, padding: "10px 14px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--muted)", width: "fit-content" }}>
          <span style={{ fontSize: 12.5, fontWeight: 500, color: "var(--fg)" }}>Showing:</span>
          <ModePill current={tokenMode} onChange={setTokenMode} />
        </div>
        {Object.keys(LIGHT_TOKENS).map(group => {
          const tokens = tokenMode === "light" ? LIGHT_TOKENS : DARK_TOKENS;
          const isDark  = tokenMode === "dark";
          return (
            <div key={group} style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <SectionBar />
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--fg)", marginRight: 10 }}>{group}</span>
                <span style={{ fontSize: 11.5, color: "var(--muted-fg)", lineHeight: 1.4 }}>{GROUP_DESCRIPTIONS[group]}</span>
              </div>
              <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12.5 }}>
                  <thead>
                    <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                      <TH>Token Name</TH><TH>CSS Variable</TH><TH>Value</TH><TH>Swatch</TH>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(tokens[group]).map(([name, value], i) => (
                      <tr key={name} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "8px 14px" }}>
                          <code style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 600, color: "var(--fg)" }}>{name}</code>
                        </td>
                        <td style={{ padding: "8px 14px" }}>
                          <code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>
                            {TOKEN_VARIABLE_NAMES[group]?.[name] ?? `--${group.toLowerCase()}-${name.toLowerCase().replace(/ /g, "-")}`}
                          </code>
                        </td>
                        <td style={{ padding: "8px 14px" }}>
                          <code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--fg)" }}>{value}</code>
                        </td>
                        <td style={{ padding: "8px 14px" }}>
                          {isColorVal(value) && <Swatch color={value} dark={isDark} />}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </DocSection>

      {/* ══ 3. Shared Tokens ════════════════════════════════════ */}
      <DocSection title="Shared Tokens" desc="Mode-invariant structural tokens — identical in both light and dark themes, merged via SHARED_TOKENS.">
        <Callout variant="success">
          Shared tokens describe <em>geometry and scale</em>, not color — so they never need a light/dark variant. Radius, shadow, button sizing, typography, and input geometry all live here.
        </Callout>
        {SHARED_SECTIONS.map(({ group, rows }) => (
          <div key={group} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
              <SectionBar />
              <span style={{ fontWeight: 700, fontSize: 13, color: "var(--fg)" }}>{group}</span>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead>
                  <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                    <TH>CSS Variable</TH><TH>Value</TH><TH>Usage</TH>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([cssVar, value, usage], i) => (
                    <tr key={cssVar} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                      <td style={{ padding: "7px 14px" }}><code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--accent)" }}>{cssVar}</code></td>
                      <td style={{ padding: "7px 14px" }}><code style={{ fontFamily: "monospace", fontSize: 11, color: "var(--fg)" }}>{value}</code></td>
                      <td style={{ padding: "7px 14px", color: "var(--muted-fg)", fontSize: 12, lineHeight: 1.4 }}>{usage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </DocSection>

      {/* ══ 4. Live Theme Playground ════════════════════════════ */}
      <DocSection title="Live Theme Playground" desc="Pick brand colors and watch them cascade across every HeartStamp component in real time. Copy the generated CSS to apply globally.">
        <Callout variant="warning">
          Changes here are local to this demo. Copy the generated CSS snippet below and paste it into your root stylesheet, or update the values in <code style={{ fontFamily: "monospace", fontSize: 12 }}>theme.ts</code> directly.
        </Callout>

        {/* Live Preview — single browser-chrome frame */}
        <div style={{ border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12, overflow: "hidden", marginBottom: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.07)" }}>

          {/* Title bar: mac dots + path + LIVE badge */}
          <div style={{
            background: "rgba(36,36,35,0.07)", borderBottom: "1px solid rgba(36,36,35,0.1)",
            padding: "0 14px", height: 33, display: "flex", alignItems: "center",
          }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#ff5f56", marginRight: 6, flexShrink: 0 }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#febc2e", marginRight: 6, flexShrink: 0 }} />
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#27c840", marginRight: 12, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: "#6e6d6a", fontFamily: "monospace", flex: 1 }}>
              live-preview · {primary.toUpperCase()} / {secondary.toUpperCase()} · {demoMode}
            </span>
            <span style={{ fontSize: 10, color: "#27c840", fontWeight: 600, letterSpacing: ".03em" }}>● LIVE</span>
          </div>

          {/* Controls row: brand swatches + preview toggle — inside the frame */}
          <div style={{
            background: "var(--bg)", borderBottom: "1px solid rgba(36,36,35,0.06)",
            padding: "24px 32px", display: "flex", alignItems: "center",
            justifyContent: "space-between", flexWrap: "wrap" as const, gap: 16,
          }}>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
              {[
                { color: DFLT_PRIMARY,   label: "Brand Primary",   token: "--accent" },
                { color: DFLT_SECONDARY, label: "Brand Secondary", token: "--secondary" },
              ].map(({ color, label, token }) => (
                <div key={token} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: color, flexShrink: 0, border: "1px solid rgba(36,36,35,0.1)", marginTop: 2 }} />
                  <div>
                    <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6e6d6a", textTransform: "uppercase" as const, letterSpacing: ".05em", marginBottom: 3 }}>{label}</div>
                    <code style={{ fontFamily: "monospace", fontSize: 12, color: "var(--fg)", fontWeight: 700, display: "block", lineHeight: 1.4 }}>{color.toUpperCase()}</code>
                    <code style={{ fontFamily: "monospace", fontSize: 10, color: "#a78bfa", lineHeight: 1.4 }}>{token}</code>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 11, color: "#6e6d6a", fontWeight: 500, marginRight: 2 }}>Preview:</span>
              <Tabs value={demoMode} onValueChange={(v) => setDemoMode(v as typeof demoMode)} style={{ display: "contents" }}>
                <TabsList>
                  <TabsTrigger value="light">☀️ Light</TabsTrigger>
                  <TabsTrigger value="dark">🌙 Dark</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          {/* Component preview area */}
          <div style={{ ...(liveVars as React.CSSProperties), background: "var(--bg)", padding: "24px 32px 32px", transition: "background 0.25s" }}>
            <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 20, alignItems: "flex-start" }}>

              {/* Sign-in form card */}
              <div style={{
                background: "var(--bg)", border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12,
                width: 330, minWidth: 260, flexShrink: 0, boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                padding: "21px 21px 28px",
              }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--fg)", marginBottom: 6 }}>Sign in</div>
                <div style={{ fontSize: 12.5, color: "var(--muted-fg)", marginBottom: 20 }}>Enter your credentials to continue.</div>
                <div style={{ marginBottom: 12 }}>
                  <Lbl style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Email</Lbl>
                  <Inp placeholder="you@example.com" style={{ width: "100%", boxSizing: "border-box" as const }} />
                </div>
                <div style={{ marginBottom: 20 }}>
                  <Lbl style={{ display: "block", marginBottom: 4, fontSize: 13 }}>Password</Lbl>
                  <Inp type="password" placeholder="••••••••" style={{ width: "100%", boxSizing: "border-box" as const }} />
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn variant="default" style={{ flex: 1 }}>Sign in</Btn>
                  <Btn variant="outline">Cancel</Btn>
                </div>
              </div>

              {/* Right column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 16, flex: 1, minWidth: 260 }}>
                <div style={{ background: "var(--bg)", border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12, padding: "17px 17px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6e6d6a", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 12 }}>Buttons</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 8 }}>
                    <Btn variant="default" size="sm">Primary</Btn>
                    <Btn variant="secondary" size="sm">Secondary</Btn>
                    <Btn variant="outline" size="sm">Outline</Btn>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
                    <Btn variant="default" size="sm" disabled>Disabled</Btn>
                    <Btn variant="link" size="sm">Link style</Btn>
                  </div>
                </div>
                <div style={{ background: "var(--bg)", border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12, padding: "17px 17px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6e6d6a", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 12 }}>Badges</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const, marginBottom: 14 }}>
                    <Bdg variant="default">Default</Bdg>
                    <Bdg variant="secondary">Secondary</Bdg>
                    <Bdg variant="outline">Outline</Bdg>
                  </div>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6e6d6a", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 10 }}>Controls</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <Swt defaultChecked />
                    <Cbx defaultChecked id="th-cbx-demo" />
                    <Lbl htmlFor="th-cbx-demo" style={{ fontSize: 13 }}>Enable feature</Lbl>
                  </div>
                </div>
                <div style={{ background: "var(--bg)", border: "1px solid rgba(36,36,35,0.1)", borderRadius: 12, padding: "17px 17px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" }}>
                  <div style={{ fontSize: 10.5, fontWeight: 700, color: "#6e6d6a", textTransform: "uppercase" as const, letterSpacing: ".06em", marginBottom: 10 }}>Alert</div>
                  <Alrt variant="default" title="Theme applied">Brand colors are cascading live.</Alrt>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Generated CSS snippet */}
        <div style={{ background: "#09090b", border: "1px solid #27272a", borderRadius: 8, overflow: "hidden", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace" }}>
          <div style={{
            padding: "0 8px 0 16px", borderBottom: "1px solid #27272a",
            display: "flex", alignItems: "center", minHeight: 40,
          }}>
            <span style={{ fontSize: 12, color: "#71717a", flex: 1, fontFamily: "inherit" }}>
              theme-override.css <span style={{ opacity: 0.5 }}>— generated from your selection above</span>
            </span>
            <button onClick={copySnippet} style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "transparent", border: "1px solid #3f3f46", borderRadius: 5,
              padding: "4px 10px", cursor: "pointer", color: copied ? "#a1a1aa" : "#71717a",
              fontSize: 11, fontFamily: "inherit", transition: "all .15s", margin: "6px 8px 6px 0",
            }}>
              {copied ? <Check size={11} /> : <Copy size={11} />} {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <div style={{ padding: "16px 20px", overflowX: "auto" }}>
            <pre style={{ margin: 0, fontSize: 12.5, lineHeight: 1.85, fontFamily: "inherit" }}>
              {cssSnippet.split("\n").map((line, i) => {
                if (line.trim() === "") return <span key={i} style={{ display: "block" }}>&nbsp;</span>;
                if (line.includes("/*")) return <span key={i} style={{ display: "block", color: "#6b7280", fontStyle: "italic" }}>{line}</span>;
                if (line === ":root {" || line === "}") return <span key={i} style={{ display: "block", color: "#c084fc" }}>{line}</span>;
                const ci = line.indexOf(":");
                if (ci === -1) return <span key={i} style={{ display: "block", color: "#e6edf3" }}>{line}</span>;
                const varPart = line.slice(0, ci);
                const valPart = line.slice(ci + 1).replace(";", "").trim();
                return (
                  <span key={i} style={{ display: "block" }}>
                    <span style={{ color: "#fda4af" }}>{varPart}</span>
                    <span style={{ color: "#e6edf3" }}>: </span>
                    <span style={{ color: valPart.startsWith("#") || valPart.startsWith("rgba") ? "#86efac" : "#e6edf3" }}>{valPart}</span>
                    <span style={{ color: "#e6edf3" }}>;</span>
                  </span>
                );
              })}
            </pre>
          </div>
        </div>
      </DocSection>

      {/* ══ 5. Applying the Theme ═══════════════════════════════ */}
      <DocSection title="Applying the Theme in Code" desc="How HeartStamp injects CSS variables at runtime — no Tailwind dark-mode class, no build-time step.">
        <Callout variant="info">
          HeartStamp does <strong>not</strong> use a <code style={{ fontFamily: "monospace", fontSize: 12 }}>.dark</code> class or Tailwind dark variants. Every CSS variable is written directly to the root element's <code style={{ fontFamily: "monospace", fontSize: 12 }}>style</code> attribute, guaranteeing they are always in scope with no selector specificity conflicts.
        </Callout>
        <CodeBlock filename="App.tsx (simplified)" code={`import { DARK_THEME, LIGHT_THEME } from "./theme";

function App() {
  const [dark, setDark] = useState(false);
  const theme = dark ? DARK_THEME : LIGHT_THEME;

  // Write every token as a CSS variable onto #root
  useEffect(() => {
    Object.entries(theme).forEach(([key, value]) => {
      document.getElementById("root")!.style.setProperty(key, value);
    });
  }, [theme]);

  return (
    // Also pass as inline style so SSR / first-paint is correct
    <div id="root" style={theme as React.CSSProperties}>
      <YourApp />
    </div>
  );
}`} />
        <div style={{ marginTop: 16 }}>
          <div style={{ fontWeight: 700, fontSize: 13, color: "var(--fg)", marginBottom: 8 }}>Alternative: Pure CSS file override</div>
          <p style={{ fontSize: 13, color: "var(--muted-fg)", marginBottom: 10, lineHeight: 1.6 }}>
            For non-React or static projects, paste overrides into a CSS file after the base token import. You only need to redeclare the variables you want to change — everything else inherits from the base.
          </p>
          <CodeBlock filename="globals.css" code={`/* Import HeartStamp base tokens */
@import "./heartstamp-tokens.css";

:root {
  /* ── Brand Primary ── */
  --accent:         #2563eb;
  --accent-hover:   #1d4ed8;
  --accent-pressed: #1e40af;
  --accent-subtle:  rgba(37, 99, 235, 0.08);

  /* ── Brand Secondary ── */
  --secondary:         #0f172a;
  --secondary-hover:   #1e293b;
  --secondary-pressed: #020617;
  --secondary-subtle:  rgba(15, 23, 42, 0.10);

  /* ── Derived ── */
  --link:        #2563eb;
  --state-error: #dc2626;
}

/* Optional: dark mode via media query */
@media (prefers-color-scheme: dark) {
  :root {
    --accent: #3b82f6;
    --accent-hover: #60a5fa;
  }
}`} />
        </div>
      </DocSection>

      {/* ���═ 6. Consuming Tokens ═════════════════════════════════ */}
      <DocSection title="Consuming Tokens in Components" desc="Correct patterns for referencing HeartStamp CSS variables inside your own custom components.">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(52,211,153,0.3)" }}>
            <div style={{ padding: "8px 14px", background: "rgba(52,211,153,0.08)", borderBottom: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
              <CheckCircle2 size={14} style={{ color: "#34d399" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#34d399" }}>Do — use CSS variables</span>
            </div>
            <CodeBlock code={`// ✅ Every color pulled from theme tokens
<div style={{
  background: "var(--accent)",
  color: "var(--text-on-primary)",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius-md)",
  boxShadow: "var(--shadow-sm)",
  padding: "var(--space-4) var(--space-5)",
}}>
  My Component
</div>

// ✅ Hover state from token
const [hov, setHov] = useState(false);
<div style={{
  background: hov ? "var(--state-hover)" : "transparent",
}} onMouseEnter={() => setHov(true)}
   onMouseLeave={() => setHov(false)} />`} />
          </div>
          <div style={{ borderRadius: 10, overflow: "hidden", border: "1px solid rgba(239,68,68,0.3)" }}>
            <div style={{ padding: "8px 14px", background: "rgba(239,68,68,0.08)", borderBottom: "1px solid rgba(239,68,68,0.2)", display: "flex", alignItems: "center", gap: 6 }}>
              <XCircle size={14} style={{ color: "#ef4444" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "#ef4444" }}>Don't — hardcode values</span>
            </div>
            <CodeBlock code={`// ❌ Hardcoded values ignore all theme changes
<div style={{
  background: "#be1d2c",   // invisible in dark mode
  color: "#ffffff",        // skips --text-on-primary
  border: "1px solid rgba(36,36,35,0.1)",
  borderRadius: "8px",     // use var(--radius-md)
  padding: "16px 20px",    // use var(--space-*)
}}>
  My Component
</div>

// ❌ Tailwind brand classes bypass the token system
<div className="bg-red-700 text-white
                rounded-lg shadow-md p-4">
  My Component
</div>`} />
          </div>
        </div>

        <div style={{ fontWeight: 700, fontSize: 13, color: "var(--fg)", marginBottom: 10 }}>Available token namespaces</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(215px, 1fr))", gap: 8 }}>
          {[
            { prefix: "var(--accent)",      full: "--accent / --accent-hover / --accent-pressed / --accent-subtle",       desc: "Brand primary — buttons, links, focus rings" },
            { prefix: "var(--secondary)",   full: "--secondary / --secondary-hover / --secondary-pressed / --secondary-subtle", desc: "Brand secondary — contrast actions" },
            { prefix: "var(--bg)",          full: "--bg / --bg-input / --bg-menus / --bg-editor",                         desc: "Surface backgrounds at each depth layer" },
            { prefix: "var(--fg)",          full: "--fg / --muted-fg / --text-disabled",                                  desc: "Text hierarchy: primary, secondary, disabled" },
            { prefix: "var(--border)",      full: "--border",                                                             desc: "Default stroke for outlines & dividers" },
            { prefix: "var(--state-*)",     full: "--state-hover / --state-pressed / --state-error",                     desc: "Overlay tints for interactive states" },
            { prefix: "var(--radius-*)",    full: "--radius-none → --radius-full (11 steps)",                            desc: "Border radius scale — prefer over raw px" },
            { prefix: "var(--shadow-*)",    full: "--shadow-xs → --shadow-2xl (6 steps)",                                desc: "Elevation shadow scale" },
            { prefix: "var(--space-*)",     full: "--space-1 → --space-12 (10 steps, 4px base)",                         desc: "Spacing — padding, gap, margin" },
            { prefix: "var(--text-on-*)",   full: "--text-on-primary / --text-on-secondary",                             desc: "Guaranteed readable text on colored surfaces" },
            { prefix: "var(--font-size-*)", full: "--font-size-h1 → --font-size-body-13",                                desc: "Typography scale — headings & body" },
            { prefix: "var(--heart)",       full: "--heart",                                                             desc: "Brand heart lockup accent — decorative" },
          ].map(({ prefix, full, desc }) => (
            <div key={prefix} style={{ padding: "10px 12px", borderRadius: 8, border: "1px solid var(--border)", background: "var(--bg)" }}>
              <code style={{ fontFamily: "monospace", fontSize: 11, color: "#be1d2c", display: "block", marginBottom: 2 }}>{prefix}</code>
              <div style={{ fontSize: 10, color: "var(--muted-fg)", fontFamily: "monospace", marginBottom: 5, lineHeight: 1.4, opacity: 0.85 }}>{full}</div>
              <span style={{ fontSize: 11.5, color: "var(--muted-fg)", lineHeight: 1.4 }}>{desc}</span>
            </div>
          ))}
        </div>
      </DocSection>

      {/* ══ 7. Full Token Reference ═════════════════════════════ */}
      <DocSection title="Full Color Variable Reference" desc="Every CSS variable used internally by HeartStamp components — with light value, dark value, swatch, and semantic description.">
        <div style={{ border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                <TH>CSS Variable</TH><TH>Description</TH><TH>Light</TH><TH>Dark</TH>
              </tr>
            </thead>
            <tbody>
              {COLOR_VAR_META.map(({ v, desc }, i) => {
                const lightVal = (LIGHT_THEME as any)[v] ?? "—";
                const darkVal  = (DARK_THEME as any)[v]  ?? "—";
                return (
                  <tr key={v} style={{ background: i % 2 === 0 ? "var(--bg)" : "var(--muted)", borderBottom: "1px solid var(--border)" }}>
                    <td style={{ padding: "8px 14px", whiteSpace: "nowrap" as const }}>
                      <code style={{ fontFamily: "monospace", fontSize: 11, color: "#be1d2c" }}>{v}</code>
                    </td>
                    <td style={{ padding: "8px 14px", color: "var(--muted-fg)", fontSize: 12, lineHeight: 1.4 }}>{desc}</td>
                    <td style={{ padding: "8px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isColorVal(lightVal) && <Swatch color={lightVal} />}
                        <code style={{ fontFamily: "monospace", fontSize: 10.5, color: "var(--fg)" }}>{lightVal}</code>
                      </div>
                    </td>
                    <td style={{ padding: "8px 14px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        {isColorVal(darkVal) && <Swatch color={darkVal} dark />}
                        <code style={{ fontFamily: "monospace", fontSize: 10.5, color: "#c084fc" }}>{darkVal}</code>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </DocSection>

    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   PROFILE NAV PAGE
═══════════════════════════════════════════════════════════ */
/* ── Profile Nav helpers moved to components/ui/profile-nav.tsx ── */

function PageProfileNav() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");

  const desktopCode =
`import { motion } from "motion/react";
import { ProfileNav } from "@/components/ui/profile-nav";

<ProfileNav
  user={{ name: "Jason Williams", email: "jasonwilliams@gmail.com" }}
  onThemeChange={(t) => applyTheme(t)}
  onSignOut={() => signOut()}
/>`;

  const mobileCode =
`import { ProfileNavMobile } from "@/components/ui/profile-nav";

<ProfileNavMobile
  user={{ name: "Jason Williams", email: "jasonwilliams@gmail.com" }}
/>`;

  return (
    <DocPage
      title="Profile Nav"
      subtitle="User profile dropdown with navigation links, theme switcher, and sign-out. Adapts to desktop (compact dropdown) and mobile (full-screen drawer)."
    >
      <DocSection title="Desktop" desc="Compact dropdown card anchored to the user avatar in the top nav.">
        <Preview title="Profile Nav · desktop" code={desktopCode} height={440}>
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-4) 0" }}>
            <ProfileNavDesktop theme={theme} setTheme={setTheme} />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Mobile" desc="Full-height drawer with logo bar, user info, and all nav links.">
        <Preview title="Profile Nav · mobile" code={mobileCode} height={660}>
          <div style={{ display: "flex", justifyContent: "center", padding: "var(--space-4) 0" }}>
            <ProfileNavMobile theme={theme} setTheme={setTheme} />
          </div>
        </Preview>
      </DocSection>

      <DocSection title="Props">
        <PropsTable props={[
          { name: "user.name",       type: "string",   desc: "Display name shown in the header." },
          { name: "user.email",      type: "string",   desc: "Email address shown below the name." },
          { name: "user.avatar",     type: "string",   desc: "Optional avatar image URL. Falls back to initials." },
          { name: "onThemeChange",   type: "(theme: 'light' | 'dark' | 'system') => void", desc: "Called when the user selects a theme." },
          { name: "onSignOut",       type: "() => void", desc: "Called when Sign out is clicked." },
        ]} />
      </DocSection>
    </DocPage>
  );
}

/* ═══════════════════════════════════════════════════════════
   PAGE ROUTER
═══════════════════════════════════════════════════════════ */
const PAGES: Record<string, any> = {
  intro: PageIntro,
  install: PageInstallation,
  icons: PageIcons,
  logos: PageLogos,
  theming: PageTheming,
  "tokens-color": PageTokensColor,
  "tokens-typography": PageTokensTypography,
  "tokens-spacing": PageTokensSpacing,
  "tokens-radius": PageTokensRadius,
  "tokens-shadow": PageTokensShadow,
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
  stepper: PageStepper,
  "top-nav": PageTopNav,
  "profile-nav": PageProfileNav,
};

/* ═══════════════════════════════════════════════════════════
   ROOT APP
═══════════════════════════════════════════════════════════ */
export default function App() {
  const [dark, setDark] = useState(false);
  const [page, setPage] = useState("intro");
  const [windowWidth, setWindowWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  const [sidebarOpen, setSidebarOpen] = useState(windowWidth >= 768);
  const [iconSearch, setIconSearch] = useState("");

  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const isMobile = windowWidth < 768;

  const theme = dark ? DARK_THEME : LIGHT_THEME;

  const PageComp = PAGES[page] || PlaceholderPage;
  const goToIcon = (name: string) => { setPage("icons"); setIconSearch(name); };
  const goToPage = (id: string) => { setPage(id); };

  return (
    <AppNavContext.Provider value={{ goToIcon, iconSearch, goToPage }}>
    <div style={{ ...theme, fontFamily: "var(--font-family-body)", background: "var(--bg)", color: "var(--fg)", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap');
        *{box-sizing:border-box;}
        ::-webkit-scrollbar{width:5px;height:5px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:var(--border);border-radius:99px}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}
        @keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:none;opacity:1}}
        button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        input:focus,textarea:focus{outline:none}
        input::placeholder,textarea::placeholder{color:var(--muted-fg);opacity:1}
      `}</style>

      {/* TOPBAR */}
      <header style={{
        height: 52, display: "flex", alignItems: "center", gap: 12, padding: "0 16px",
        borderBottom: "1px solid var(--border)", background: dark ? "rgba(20,20,20,.92)" : "rgba(255,255,255,.92)",
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
            <g clipPath="url(#clip0_435_257377)">
              <path d="M22.1595 3.1948C20.8678 1.73163 19.2691 1 17.3646 1C15.4425 1 13.6914 1.92386 12.1093 3.77044L12 3.88916L11.8907 3.77044C10.3086 1.92386 8.55753 1 6.63541 1C4.7309 1 3.13223 1.73163 1.84046 3.1948C0.613861 4.60968 0 6.2827 0 8.21166C0 11.0743 0.847941 13.9447 2.54262 16.8228C4.17332 19.6207 6.22359 21.832 8.69445 23.4566C9.03338 23.6807 9.5501 23.9784 10.2446 24.3486C11.0836 24.7825 11.8057 25 12 25C12.1943 25 12.9164 24.7825 13.7554 24.3486C14.4499 23.9784 14.9666 23.6807 15.3055 23.4566C17.7764 21.832 19.8267 19.6207 21.4574 16.8228C23.1521 13.9447 24 11.0743 24 8.21166C24 6.2827 23.3861 4.60968 22.1595 3.1948Z" fill="#BE1D2C" />
              <path d="M16.5975 6.77065H14.9413C14.8868 6.77065 14.8426 6.81464 14.8426 6.86893V11.6433C14.8426 11.6705 14.8315 11.695 14.8136 11.7128C14.7854 11.741 14.7504 11.7416 14.7438 11.7416C13.6055 12.2216 12.5929 12.2962 12.0002 12.2962C10.7868 12.2962 9.83905 11.9839 9.28835 11.7547C9.2889 11.7541 9.29008 11.7528 9.28999 11.7528C9.25177 11.7354 9.21508 11.7173 9.17776 11.6996C9.16608 11.6834 9.15781 11.6647 9.15781 11.6433V6.76037H9.15587C9.11623 4.7656 7.20389 4.53856 6.05287 4.83376C4.63981 5.19618 3.46149 7.03323 4.21569 8.97442C4.21572 8.97442 4.21572 8.9744 4.21572 8.97439L4.21569 8.97442C4.40668 9.52369 4.79153 10.4061 5.56777 11.2793C6.15976 11.9452 6.78911 12.3916 7.30407 12.6855V18.9682C7.30407 19.0225 7.3483 19.0665 7.40286 19.0665H9.05902C9.11358 19.0665 9.15781 19.0225 9.15781 18.9682V13.6843C9.15781 13.6571 9.1689 13.6326 9.18676 13.6148C9.21503 13.5867 9.24999 13.586 9.25661 13.586C9.7926 13.8171 10.7064 14.1311 11.8778 14.1517C13.1793 14.1747 14.1894 13.8248 14.7438 13.586C14.7984 13.586 14.8426 13.63 14.8426 13.6843V18.9682C14.8426 19.0225 14.8868 19.0665 14.9414 19.0665H16.5976C16.6521 19.0665 16.6964 19.0225 16.6964 18.9682V6.86893C16.6964 6.81464 16.6521 6.77065 16.5976 6.77065H16.5975ZM7.02522 10.1152C6.19901 9.21836 5.7899 8.30484 5.58918 7.74724C5.41181 7.19779 5.711 6.96618 5.93962 6.94798C6.21257 6.92649 6.29106 7.11843 6.45151 7.64985C6.45372 7.65715 6.4648 7.6543 6.46358 7.64677C6.41594 7.3585 6.39242 6.85113 6.67677 6.6749C6.85323 6.56555 7.06815 6.5654 7.19389 6.70835C7.21772 6.73545 7.30399 6.82068 7.30399 7.01467C7.30399 7.01471 7.30403 7.01476 7.30403 7.0148V10.4007C7.19773 10.2978 7.10449 10.2013 7.02521 10.1152L7.02522 10.1152Z" fill="white" />
            </g>
            <path d="M33.75 22V4.5H39.65C41.5 4.5 43.0667 4.88333 44.35 5.65C45.6333 6.4 46.6083 7.43333 47.275 8.75C47.9417 10.05 48.275 11.5417 48.275 13.225C48.275 14.925 47.9417 16.4333 47.275 17.75C46.6083 19.0667 45.6333 20.1083 44.35 20.875C43.0667 21.625 41.5 22 39.65 22H33.75ZM36.475 19.575H39.65C40.9833 19.575 42.075 19.2917 42.925 18.725C43.775 18.1417 44.4 17.375 44.8 16.425C45.2167 15.4583 45.425 14.3917 45.425 13.225C45.425 12.075 45.2167 11.025 44.8 10.075C44.4 9.10833 43.775 8.34167 42.925 7.775C42.075 7.20833 40.9833 6.925 39.65 6.925H36.475V19.575ZM56.6566 22.4C55.2066 22.4 53.9483 22.0917 52.8816 21.475C51.815 20.8417 50.9816 19.9667 50.3816 18.85C49.7983 17.7333 49.5066 16.4583 49.5066 15.025C49.5066 13.575 49.7983 12.2917 50.3816 11.175C50.9816 10.0583 51.815 9.18333 52.8816 8.55C53.9483 7.91667 55.2066 7.6 56.6566 7.6C57.6066 7.6 58.4983 7.78333 59.3316 8.15C60.165 8.51667 60.8816 9.05833 61.4816 9.775C62.0816 10.4917 62.5233 11.3667 62.8066 12.4C63.09 13.4167 63.165 14.5833 63.0316 15.9H51.0316V13.65H61.5316L60.4066 14.425C60.4566 13.625 60.34 12.9 60.0566 12.25C59.7733 11.5833 59.3483 11.05 58.7816 10.65C58.215 10.25 57.5066 10.05 56.6566 10.05C55.6733 10.05 54.8566 10.2667 54.2066 10.7C53.5566 11.1333 53.065 11.725 52.7316 12.475C52.415 13.225 52.2566 14.075 52.2566 15.025C52.2566 15.9583 52.415 16.8 52.7316 17.55C53.065 18.3 53.5566 18.8917 54.2066 19.325C54.8566 19.7417 55.6733 19.95 56.6566 19.95C57.64 19.95 58.415 19.725 58.9816 19.275C59.565 18.8083 59.965 18.2417 60.1816 17.575H63.0316C62.815 18.5417 62.415 19.3833 61.8316 20.1C61.265 20.8167 60.54 21.3833 59.6566 21.8C58.79 22.2 57.79 22.4 56.6566 22.4ZM67.1723 17.575C67.2556 18.425 67.6139 19.0583 68.2473 19.475C68.8973 19.8917 69.6723 20.1 70.5723 20.1C71.4723 20.1 72.1889 19.9333 72.7223 19.6C73.2723 19.2667 73.5473 18.7417 73.5473 18.025C73.5473 17.5917 73.3806 17.2667 73.0473 17.05C72.7306 16.8167 72.3056 16.6333 71.7723 16.5C71.2556 16.3667 70.6806 16.25 70.0473 16.15C69.4306 16.05 68.8056 15.925 68.1723 15.775C67.5389 15.625 66.9556 15.4083 66.4223 15.125C65.9056 14.825 65.4889 14.425 65.1723 13.925C64.8556 13.425 64.6973 12.775 64.6973 11.975C64.6973 11.225 64.9306 10.5167 65.3973 9.85C65.8639 9.16667 66.5223 8.625 67.3723 8.225C68.2389 7.80833 69.2389 7.6 70.3723 7.6C71.3889 7.6 72.3223 7.80833 73.1723 8.225C74.0223 8.625 74.6973 9.18333 75.1973 9.9C75.7139 10.6167 75.9723 11.45 75.9723 12.4H73.4223C73.3556 11.55 73.0223 10.925 72.4223 10.525C71.8389 10.1083 71.1223 9.9 70.2723 9.9C69.3056 9.9 68.5723 10.1 68.0723 10.5C67.5889 10.8833 67.3473 11.375 67.3473 11.975C67.3473 12.4417 67.5056 12.8 67.8223 13.05C68.1556 13.3 68.5806 13.4917 69.0973 13.625C69.6306 13.7583 70.2139 13.875 70.8473 13.975C71.4806 14.075 72.1056 14.2 72.7223 14.35C73.3556 14.5 73.9306 14.7167 74.4473 15C74.9806 15.2667 75.4056 15.6417 75.7223 16.125C76.0389 16.6083 76.1973 17.2417 76.1973 18.025C76.1973 18.9083 75.9639 19.6833 75.4973 20.35C75.0306 21 74.3639 21.5083 73.4973 21.875C72.6473 22.225 71.6306 22.4 70.4473 22.4C69.3473 22.4 68.3556 22.1917 67.4723 21.775C66.5889 21.3417 65.8806 20.7667 65.3473 20.05C64.8306 19.3167 64.5556 18.4917 64.5223 17.575H67.1723ZM78.1145 8H80.8145V22H78.1145V8ZM77.9645 3.25H80.9645V6.325H77.9645V3.25ZM88.915 21.9C87.6317 21.9 86.515 21.6083 85.565 21.025C84.6317 20.4417 83.9067 19.6167 83.39 18.55C82.8734 17.4667 82.615 16.2083 82.615 14.775C82.615 13.325 82.8734 12.0667 83.39 11C83.9067 9.91667 84.6317 9.08333 85.565 8.5C86.515 7.9 87.6317 7.6 88.915 7.6C90.6317 7.6 91.9317 8.11667 92.815 9.15C93.6984 10.1667 94.24 11.575 94.44 13.375L94.39 16.225C94.29 17.3417 94.04 18.325 93.64 19.175C93.24 20.025 92.6567 20.6917 91.89 21.175C91.1234 21.6583 90.1317 21.9 88.915 21.9ZM89.89 27.4C88.4067 27.4 87.2067 27.1667 86.29 26.7C85.39 26.2333 84.7067 25.625 84.24 24.875C83.7734 24.1417 83.4734 23.3833 83.34 22.6H86.115C86.2817 23.4167 86.69 24.0083 87.34 24.375C87.99 24.7583 88.84 24.95 89.89 24.95C90.6067 24.95 91.2234 24.825 91.74 24.575C92.2734 24.325 92.6817 23.925 92.965 23.375C93.265 22.8417 93.415 22.1333 93.415 21.25H96.09C96.09 22.5667 95.8234 23.6833 95.29 24.6C94.7567 25.5167 94.0234 26.2083 93.09 26.675C92.1734 27.1583 91.1067 27.4 89.89 27.4ZM89.265 19.45C90.665 19.45 91.7067 19.025 92.39 18.175C93.0734 17.325 93.415 16.1917 93.415 14.775C93.415 13.3417 93.0734 12.2 92.39 11.35C91.7067 10.4833 90.665 10.05 89.265 10.05C88.065 10.05 87.115 10.4667 86.415 11.3C85.715 12.1167 85.365 13.275 85.365 14.775C85.365 16.2583 85.715 17.4083 86.415 18.225C87.115 19.0417 88.065 19.45 89.265 19.45ZM93.415 21.25V8H96.09V21.25H93.415ZM98.351 8H101.026V10.3C101.226 9.83333 101.518 9.4 101.901 9C102.284 8.58333 102.784 8.25 103.401 8C104.018 7.73333 104.768 7.6 105.651 7.6C106.551 7.6 107.351 7.78333 108.051 8.15C108.768 8.51667 109.326 9.125 109.726 9.975C110.143 10.8083 110.351 11.9417 110.351 13.375V22H107.676V13.7C107.676 12.9333 107.601 12.275 107.451 11.725C107.301 11.1583 107.026 10.725 106.626 10.425C106.226 10.1083 105.668 9.95 104.951 9.95C104.284 9.95 103.651 10.1417 103.051 10.525C102.451 10.9083 101.959 11.475 101.576 12.225C101.209 12.975 101.026 13.9083 101.026 15.025V22H98.351V8ZM120.046 16.425C120.113 17.1417 120.338 17.7583 120.721 18.275C121.121 18.7917 121.638 19.1833 122.271 19.45C122.921 19.7167 123.654 19.85 124.471 19.85C125.638 19.85 126.579 19.6333 127.296 19.2C128.029 18.75 128.396 18.1083 128.396 17.275C128.396 16.7083 128.196 16.2667 127.796 15.95C127.396 15.6333 126.863 15.3833 126.196 15.2C125.546 15.0167 124.829 14.85 124.046 14.7C123.263 14.5333 122.471 14.35 121.671 14.15C120.888 13.9333 120.163 13.6417 119.496 13.275C118.846 12.8917 118.321 12.3833 117.921 11.75C117.521 11.1 117.321 10.2667 117.321 9.25C117.321 8.28333 117.604 7.41667 118.171 6.65C118.754 5.86667 119.563 5.25 120.596 4.8C121.629 4.33333 122.838 4.1 124.221 4.1C125.488 4.1 126.629 4.35833 127.646 4.875C128.679 5.375 129.496 6.075 130.096 6.975C130.696 7.85833 130.996 8.88333 130.996 10.05H128.071C128.004 8.96667 127.646 8.13333 126.996 7.55C126.363 6.95 125.396 6.65 124.096 6.65C122.796 6.65 121.813 6.89167 121.146 7.375C120.496 7.84167 120.171 8.46667 120.171 9.25C120.171 9.86667 120.371 10.35 120.771 10.7C121.171 11.0333 121.696 11.3 122.346 11.5C123.013 11.6833 123.738 11.85 124.521 12C125.321 12.1333 126.113 12.3083 126.896 12.525C127.679 12.725 128.396 13.0083 129.046 13.375C129.713 13.725 130.246 14.2167 130.646 14.85C131.063 15.4667 131.271 16.275 131.271 17.275C131.271 18.9083 130.654 20.175 129.421 21.075C128.204 21.9583 126.504 22.4 124.321 22.4C122.971 22.4 121.754 22.1417 120.671 21.625C119.604 21.0917 118.754 20.375 118.121 19.475C117.504 18.575 117.171 17.5583 117.121 16.425H120.046ZM133.499 27V24.7H135.124C135.724 24.7 136.183 24.575 136.499 24.325C136.816 24.0917 137.066 23.7667 137.249 23.35C137.449 22.95 137.633 22.4833 137.799 21.95L142.074 8H144.974L140.474 22C140.208 22.8667 139.924 23.6083 139.624 24.225C139.341 24.8583 139.008 25.375 138.624 25.775C138.258 26.1917 137.791 26.5 137.224 26.7C136.674 26.9 135.983 27 135.149 27H133.499ZM136.724 22L132.224 8H135.124L139.274 22H136.724ZM148.136 17.575C148.219 18.425 148.578 19.0583 149.211 19.475C149.861 19.8917 150.636 20.1 151.536 20.1C152.436 20.1 153.153 19.9333 153.686 19.6C154.236 19.2667 154.511 18.7417 154.511 18.025C154.511 17.5917 154.344 17.2667 154.011 17.05C153.694 16.8167 153.269 16.6333 152.736 16.5C152.219 16.3667 151.644 16.25 151.011 16.15C150.394 16.05 149.769 15.925 149.136 15.775C148.503 15.625 147.919 15.4083 147.386 15.125C146.869 14.825 146.453 14.425 146.136 13.925C145.819 13.425 145.661 12.775 145.661 11.975C145.661 11.225 145.894 10.5167 146.361 9.85C146.828 9.16667 147.486 8.625 148.336 8.225C149.203 7.80833 150.203 7.6 151.336 7.6C152.353 7.6 153.286 7.80833 154.136 8.225C154.986 8.625 155.661 9.18333 156.161 9.9C156.678 10.6167 156.936 11.45 156.936 12.4H154.386C154.319 11.55 153.986 10.925 153.386 10.525C152.803 10.1083 152.086 9.9 151.236 9.9C150.269 9.9 149.536 10.1 149.036 10.5C148.553 10.8833 148.311 11.375 148.311 11.975C148.311 12.4417 148.469 12.8 148.786 13.05C149.119 13.3 149.544 13.4917 150.061 13.625C150.594 13.7583 151.178 13.875 151.811 13.975C152.444 14.075 153.069 14.2 153.686 14.35C154.319 14.5 154.894 14.7167 155.411 15C155.944 15.2667 156.369 15.6417 156.686 16.125C157.003 16.6083 157.161 17.2417 157.161 18.025C157.161 18.9083 156.928 19.6833 156.461 20.35C155.994 21 155.328 21.5083 154.461 21.875C153.611 22.225 152.594 22.4 151.411 22.4C150.311 22.4 149.319 22.1917 148.436 21.775C147.553 21.3417 146.844 20.7667 146.311 20.05C145.794 19.3167 145.519 18.4917 145.486 17.575H148.136ZM158.034 8H165.409V10.3H158.034V8ZM160.134 4.5H162.809V18.2C162.809 18.7167 162.934 19.1 163.184 19.35C163.434 19.5833 163.8 19.7 164.284 19.7H165.809V22H164.259C162.892 22 161.859 21.6667 161.159 21C160.475 20.3167 160.134 19.3833 160.134 18.2V4.5ZM173.61 22.4C172.16 22.4 170.901 22.0917 169.835 21.475C168.768 20.8417 167.935 19.9667 167.335 18.85C166.751 17.7333 166.46 16.4583 166.46 15.025C166.46 13.575 166.751 12.2917 167.335 11.175C167.935 10.0583 168.768 9.18333 169.835 8.55C170.901 7.91667 172.16 7.6 173.61 7.6C174.56 7.6 175.451 7.78333 176.285 8.15C177.118 8.51667 177.835 9.05833 178.435 9.775C179.035 10.4917 179.476 11.3667 179.76 12.4C180.043 13.4167 180.118 14.5833 179.985 15.9H167.985V13.65H178.485L177.36 14.425C177.41 13.625 177.293 12.9 177.01 12.25C176.726 11.5833 176.301 11.05 175.735 10.65C175.168 10.25 174.46 10.05 173.61 10.05C172.626 10.05 171.81 10.2667 171.16 10.7C170.51 11.1333 170.018 11.725 169.685 12.475C169.368 13.225 169.21 14.075 169.21 15.025C169.21 15.9583 169.368 16.8 169.685 17.55C170.018 18.3 170.51 18.8917 171.16 19.325C171.81 19.7417 172.626 19.95 173.61 19.95C174.593 19.95 175.368 19.725 175.935 19.275C176.518 18.8083 176.918 18.2417 177.135 17.575H179.985C179.768 18.5417 179.368 19.3833 178.785 20.1C178.218 20.8167 177.493 21.3833 176.61 21.8C175.743 22.2 174.743 22.4 173.61 22.4ZM181.781 8H184.456V22H181.781V8ZM184.456 15.025L184.056 12.275C184.056 11.8417 184.131 11.3583 184.281 10.825C184.431 10.2917 184.672 9.78333 185.006 9.3C185.356 8.8 185.814 8.39167 186.381 8.075C186.964 7.75833 187.697 7.6 188.581 7.6C189.447 7.6 190.206 7.78333 190.856 8.15C191.506 8.51667 192.006 9.125 192.356 9.975C192.722 10.8083 192.906 11.9417 192.906 13.375V22H190.231V13.7C190.231 12.9333 190.172 12.275 190.056 11.725C189.956 11.1583 189.739 10.725 189.406 10.425C189.072 10.1083 188.564 9.95 187.881 9.95C187.297 9.95 186.747 10.1417 186.231 10.525C185.714 10.9083 185.289 11.475 184.956 12.225C184.622 12.975 184.456 13.9083 184.456 15.025ZM192.906 15.025L192.231 12.275C192.231 11.8417 192.314 11.3583 192.481 10.825C192.664 10.2917 192.939 9.78333 193.306 9.3C193.689 8.8 194.181 8.39167 194.781 8.075C195.397 7.75833 196.147 7.6 197.031 7.6C197.897 7.6 198.656 7.78333 199.306 8.15C199.956 8.51667 200.456 9.125 200.806 9.975C201.172 10.8083 201.356 11.9417 201.356 13.375V22H198.681V13.7C198.681 12.9333 198.622 12.275 198.506 11.725C198.406 11.1583 198.189 10.725 197.856 10.425C197.522 10.1083 197.014 9.95 196.331 9.95C195.747 9.95 195.197 10.1417 194.681 10.525C194.164 10.9083 193.739 11.475 193.406 12.225C193.072 12.975 192.906 13.9083 192.906 15.025Z" fill={dark ? "#fafafa" : "#242423"} />
            <defs><clipPath id="clip0_435_257377"><rect width="24" height="24" fill="white" transform="translate(0 1)" /></clipPath></defs>
          </svg>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 999, background: "var(--muted)",
            color: "var(--muted-fg)", border: "1px solid var(--border)", fontWeight: 600
          }}>v1.0</span>
        </div>

        <div style={{ flex: 1 }} />

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)" }}>
          <Btn variant="outline" size="sm" onClick={() => window.open("https://github.com/mdheartstamp/heartstamp-design-system", "_blank")}>
            <Github size={14} />GitHub
          </Btn>
          <Btn variant="outline" size="sm" onClick={() => window.open("https://ui.shadcn.com", "_blank")}>
            <ExternalLink size={12} />Shadcn
          </Btn>
          <Btn variant="outline" size="icon" onClick={() => setDark(d => !d)}>
            {dark ? <Sun size={14} /> : <Moon size={14} />}
          </Btn>
        </div>
      </header>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Mobile overlay */}
        {isMobile && sidebarOpen && (
          <div onClick={() => setSidebarOpen(false)} style={{
            position: "fixed", inset: 0, top: 52, background: "rgba(0,0,0,.45)",
            zIndex: 40, backdropFilter: "blur(4px)"
          }} />
        )}

        {/* SIDEBAR — desktop: collapse width; mobile: slide over content */}
        <aside style={{
          flexShrink: 0, background: "var(--bg)", display: "flex", flexDirection: "column",
          ...(isMobile
            ? {
                position: "fixed", top: 52, bottom: 0, width: 240,
                left: sidebarOpen ? 0 : -240, zIndex: 50,
                borderRight: "1px solid var(--border)",
                boxShadow: sidebarOpen ? "4px 0 24px rgba(0,0,0,.18)" : "none",
                transition: "left .22s cubic-bezier(.4,0,.2,1)",
              }
            : {
                width: sidebarOpen ? 220 : 0,
                overflow: "hidden",
                borderRight: sidebarOpen ? "1px solid var(--border)" : "none",
                transition: "width .22s cubic-bezier(.4,0,.2,1)",
              }
          )
        }}>
          <div style={{ width: isMobile ? 240 : 220, flexShrink: 0, height: "100%", display: "flex", flexDirection: "column" }}>
            <Sidebar active={page} onSelect={(p: string) => setPage(p)} onClose={() => setSidebarOpen(false)} />
          </div>
        </aside>

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto", padding: "28px 24px" }}>
          <div style={{ maxWidth: 820, margin: "0 auto" }}>
            <PageComp id={page} />
          </div>
        </main>
      </div>
    </div>
    </AppNavContext.Provider>
  );
}
