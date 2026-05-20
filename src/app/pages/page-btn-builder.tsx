import React, { useState } from "react";
import * as LucideIcons from "lucide-react";
import { Btn } from "../components/ui/btn";
import { Swt } from "../components/ui/hs-swt";
import { CodeBlock } from "../components/docs/doc-code-block";

/* ─────────────────────────────────────────────────────────────────
   BtnBuilder — interactive Button playground for the docs site.

   Left panel  : variant / size / icon / state controls
   Right panel : live preview canvas  +  generated code block

   Token usage: all colours / surfaces reference --color-* semantic
   tokens from tokens.css — never raw hex or legacy aliases.
───────────────────────────────────────────────────────────────── */

type BVariant = "default" | "secondary" | "outline" | "primary-ghost" | "secondary-ghost" | "link" | "destructive";
type BSize    = "sm" | "default" | "lg" | "xl";
type IPos     = "none" | "left" | "right" | "only";

const ICON_ONLY_SIZE_MAP: Record<BSize, string> = {
  sm: "icon-sm", default: "icon", lg: "icon-lg", xl: "icon-xl",
};

const PRESET_ICONS: { name: string; label: string }[] = [
  { name: "Plus",       label: "Plus"   },
  { name: "ArrowRight", label: "Arrow"  },
  { name: "Star",       label: "Star"   },
  { name: "Download",   label: "Dwnld"  },
  { name: "Search",     label: "Search" },
  { name: "Trash2",     label: "Trash"  },
];

// Accepts plain names ("HeartHandshake") or full import statements
function extractIconName(raw: string): string {
  const brace = raw.match(/\{\s*([^},]+)/);
  return brace ? brace[1].trim() : raw.trim();
}

// Double-cast needed: LucideIcons module type doesn't index by string
const LU = LucideIcons as unknown as Record<
  string,
  React.ComponentType<{ size?: number; style?: React.CSSProperties }>
>;

// ── Shared inline style constants ────────────────────────────────
const SEL: React.CSSProperties = {
  width: "100%", padding: "8px 10px", fontSize: 13, lineHeight: 1.4,
  fontFamily: "var(--font-family-body, 'DM Sans', system-ui, sans-serif)",
  border: "1px solid var(--color-element-subtle)", borderRadius: 8,
  background: "var(--color-bg-input)", color: "var(--color-text-primary)",
  cursor: "pointer", outline: "none",
};

const FIELD: React.CSSProperties = { display: "flex", flexDirection: "column", gap: 6 };

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12, fontWeight: 500, color: "var(--color-text-secondary)",
  fontFamily: "var(--font-family-body, 'DM Sans', system-ui, sans-serif)",
};

export function BtnBuilder() {
  const [variant,    setVariant]    = useState<BVariant>("default");
  const [size,       setSize]       = useState<BSize>("default");
  const [iconName,   setIconName]   = useState<string>("none");
  const [iconPos,    setIconPos]    = useState<IPos>("none");
  const [loading,    setLoading]    = useState(false);
  const [disabled,   setDisabled]   = useState(false);
  const [customIcon, setCustomIcon] = useState("");

  // ── Derived values ────────────────────────────────────────────
  const actualSize      = iconPos === "only" ? ICON_ONLY_SIZE_MAP[size] : size;
  const iconOnlyLoading = iconPos === "only" && loading;
  const hasIcon         = iconName !== "none" && iconPos !== "none" && !iconOnlyLoading;
  const IconComp        = iconName !== "none"
    ? (LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{ size?: number }>)
    : null;

  const customTrimmed   = customIcon.trim();
  const customExtracted = customTrimmed ? extractIconName(customTrimmed) : "";
  const customResolved  = customExtracted
    ? (Object.keys(LucideIcons) as string[]).find(
        k => k[0] >= "A" && k[0] <= "Z" && k.toLowerCase() === customExtracted.toLowerCase()
      ) ?? null
    : null;

  // ── Code generation ───────────────────────────────────────────
  const propsArr: string[] = [];
  if (variant !== "default")    propsArr.push(`variant="${variant}"`);
  if (actualSize !== "default") propsArr.push(`size="${actualSize}"`);
  if (loading)  propsArr.push("loading");
  if (disabled) propsArr.push("disabled");
  const propsStr = propsArr.length ? " " + propsArr.join(" ") : "";

  const iconEl = iconName !== "none" ? `<${iconName} size={16} />` : "";
  const innerStr =
    iconPos === "left"  ? `  ${iconEl} Button` :
    iconPos === "right" ? `  Button ${iconEl}` :
                          `  ${iconEl}`;

  const code = iconOnlyLoading
    ? `<Btn${propsStr} />`
    : !hasIcon
    ? `<Btn${propsStr}>Button</Btn>`
    : `<Btn${propsStr}>\n${innerStr}\n</Btn>`;

  // ── Switch row helper ─────────────────────────────────────────
  const swtRow = (
    label: string,
    checked: boolean,
    onChange: (v: boolean) => void,
    isDisabled?: boolean,
  ) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: 32 }}>
      <span style={{ fontSize: 13, color: "var(--color-text-primary)", fontFamily: "var(--font-family-body, 'DM Sans', system-ui, sans-serif)" }}>
        {label}
      </span>
      <Swt checked={checked} onChange={onChange} disabled={isDisabled} />
    </div>
  );

  return (
    <div style={{ display: "flex", border: "1px solid var(--color-element-subtle)", borderRadius: 12, overflow: "hidden" }}>

      {/* ── Left: controls ──────────────────────────────────── */}
      <div style={{
        width: 220, flexShrink: 0,
        borderRight: "1px solid var(--color-element-subtle)",
        padding: "20px 16px",
        display: "flex", flexDirection: "column", gap: 14,
        background: "var(--color-bg-main)",
      }}>

        {/* Variant */}
        <div style={FIELD}>
          <span style={LABEL_STYLE}>Variant</span>
          <select style={SEL} value={variant} onChange={e => setVariant(e.target.value as BVariant)}>
            <option value="default">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="outline">Outline</option>
            <option value="primary-ghost">Primary Ghost</option>
            <option value="secondary-ghost">Secondary Ghost</option>
            <option value="link">Link</option>
            <option value="destructive">Destructive</option>
          </select>
        </div>

        {/* Size */}
        <div style={FIELD}>
          <span style={LABEL_STYLE}>Size</span>
          <select style={SEL} value={size} onChange={e => setSize(e.target.value as BSize)}>
            <option value="sm">sm — 36px</option>
            <option value="default">default — 40px</option>
            <option value="lg">lg — 44px</option>
            <option value="xl">xl — 48px</option>
          </select>
        </div>

        {/* Icon picker */}
        <div style={FIELD}>
          <span style={LABEL_STYLE}>Icon</span>

          {/* None + preset grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 4 }}>
            {(() => {
              const active = iconName === "none";
              return (
                <button
                  onClick={() => { setIconName("none"); setIconPos("none"); setCustomIcon(""); }}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    padding: "8px 2px", borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${active ? "var(--color-brand-primary)" : "var(--color-element-subtle)"}`,
                    background: active ? "var(--color-brand-primary-dim)" : "transparent",
                  }}
                >
                  <span style={{ fontSize: 10, fontWeight: active ? 600 : 400, color: active ? "var(--color-brand-primary)" : "var(--color-text-secondary)" }}>
                    None
                  </span>
                </button>
              );
            })()}

            {PRESET_ICONS.map(({ name, label }) => {
              const C = LU[name];
              const active = iconName === name;
              return (
                <button
                  key={name}
                  title={name}
                  onClick={() => { setIconName(name); setCustomIcon(""); if (iconPos === "none") setIconPos("left"); }}
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    justifyContent: "center", gap: 3, padding: "6px 2px",
                    borderRadius: 6, cursor: "pointer",
                    border: `1px solid ${active ? "var(--color-brand-primary)" : "var(--color-element-subtle)"}`,
                    background: active ? "var(--color-brand-primary-dim)" : "transparent",
                  }}
                >
                  <C size={14} style={{ color: active ? "var(--color-brand-primary)" : "var(--color-text-primary)" }} />
                  <span style={{ fontSize: 7, color: "var(--color-text-secondary)", lineHeight: 1.2 }}>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Custom icon input — accepts name or import statement */}
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Paste icon name (e.g. HeartHandshake)"
              value={customIcon}
              onChange={e => {
                const val = e.target.value;
                setCustomIcon(val);
                const name = extractIconName(val);
                const found = name
                  ? (Object.keys(LucideIcons) as string[]).find(
                      k => k[0] >= "A" && k[0] <= "Z" && k.toLowerCase() === name.toLowerCase()
                    ) ?? null
                  : null;
                if (found) { setIconName(found); if (iconPos === "none") setIconPos("left"); }
              }}
              style={{
                ...SEL,
                paddingRight: customTrimmed ? 32 : 10,
                borderColor: customExtracted && !customResolved
                  ? "var(--color-state-error)"
                  : "var(--color-element-subtle)",
              }}
            />
            {customResolved && (() => {
              const C = LU[customResolved];
              return (
                <div style={{
                  position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
                  color: "var(--color-brand-primary)", display: "flex", pointerEvents: "none",
                }}>
                  <C size={14} />
                </div>
              );
            })()}
          </div>
        </div>

        {/* Position — shown only when an icon is selected */}
        {iconName !== "none" && (
          <div style={FIELD}>
            <span style={LABEL_STYLE}>Position</span>
            <select
              style={SEL}
              value={iconPos === "none" ? "left" : iconPos}
              onChange={e => setIconPos(e.target.value as IPos)}
            >
              <option value="left">Left</option>
              <option value="right">Right</option>
              <option value="only">Icon Only</option>
            </select>
          </div>
        )}

        <div style={{ height: 1, background: "var(--color-element-subtle)", margin: "2px 0" }} />

        {/* State toggles */}
        {swtRow("Icon Only", iconPos === "only", v => {
          if (v) {
            setIconPos("only");
            if (iconName === "none") setIconName("Plus");
          } else {
            setIconPos(iconName !== "none" ? "left" : "none");
          }
        })}
        {swtRow("Loading", loading, v => {
          setLoading(v);
          if (v) setDisabled(false);
        })}
        {swtRow("Disabled", disabled, v => {
          setDisabled(v);
          if (v) setLoading(false);
        })}
      </div>

      {/* ── Right: preview + code ────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Live preview canvas */}
        <div style={{
          flex: 1, minHeight: 160,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "var(--color-bg-muted)",
          borderBottom: "1px solid var(--color-element-subtle)",
        }}>
          <Btn
            variant={variant}
            size={actualSize as any}
            loading={loading}
            disabled={disabled}
          >
            {hasIcon && iconPos === "left"  && IconComp && <IconComp size={16} />}
            {iconPos !== "only" && "Button"}
            {hasIcon && iconPos === "right" && IconComp && <IconComp size={16} />}
            {hasIcon && iconPos === "only"  && IconComp && <IconComp size={16} />}
          </Btn>
        </div>

        {/* Copy-ready code output */}
        <CodeBlock code={code} filename="example.tsx" />
      </div>
    </div>
  );
}
