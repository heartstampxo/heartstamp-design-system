import React, { useState, useMemo } from "react";
import { Eye, Code2, Moon, Sun, Smartphone, Tablet, Monitor, Maximize2 } from "lucide-react";
import { PREVIEW_DARK_VARS } from "../../theme";
import { CodeBlock } from "./doc-code-block";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

const VIEWPORTS = [
  { id: "mobile", w: "390px", Icon: Smartphone },
  { id: "tablet", w: "768px", Icon: Tablet },
  { id: "desktop", w: "100%", Icon: Monitor },
  { id: "full", w: "100%", Icon: Maximize2 },
];

interface PreviewProps {
  title: string;
  code?: string;
  filename?: string;
  children: React.ReactNode | ((vp: string) => React.ReactNode);
  height?: number;
  /** Remove all padding so content stretches edge-to-edge inside the preview */
  fullWidth?: boolean;
}

/**
 * Rewrite every `from '@/components/ui/xxx'` (or double-quoted) import
 * to `from '@heartstamp/design-system'`, then merge any duplicate import
 * lines into a single consolidated import statement.
 */
function normalizeImports(code: string | undefined): string {
  if (!code) return "";
  // Step 1 — swap local paths to the npm package
  const swapped = code.replace(
    /from\s+(['"])@\/components\/ui\/[^'"]+\1/g,
    "from '@heartstamp/design-system'"
  );

  // Step 2 — merge multiple `import { … } from '@heartstamp/design-system'` lines
  const lines = swapped.split("\n");
  const PKG = "@heartstamp/design-system";
  const hsLines: number[] = [];

  lines.forEach((line, i) => {
    if (line.includes(`from '${PKG}'`) || line.includes(`from "${PKG}"`)) {
      hsLines.push(i);
    }
  });

  if (hsLines.length <= 1) return swapped;

  // Collect all named specifiers from every hs import line
  const specifiers: string[] = [];
  hsLines.forEach(i => {
    const m = lines[i].match(/import\s+\{([^}]+)\}/);
    if (m) specifiers.push(...m[1].split(",").map(s => s.trim()).filter(Boolean));
  });

  // Remove duplicate specifier names
  const unique = [...new Set(specifiers)];
  const merged = `import { ${unique.join(", ")} } from '${PKG}'`;

  // Replace the first hs-import line with the merged one; delete the rest
  const firstIdx = hsLines[0];
  const result = lines.filter((_, i) => !hsLines.includes(i) || i === firstIdx);
  result[result.indexOf(lines[firstIdx])] = merged;
  return result.join("\n");
}

export function Preview({ title, code, filename, children, height = 160, fullWidth = false }: PreviewProps) {
  const [tab, setTab] = useState("preview");
  const [vp, setVp] = useState("full");
  const [dark, setDark] = useState(false);
  const vpW = VIEWPORTS.find(v => v.id === vp)?.w || "100%";
  const normalizedCode = useMemo(() => normalizeImports(code), [code]);

  /* render-prop support: children can be (vp: string) => ReactNode */
  const renderedChildren = typeof children === "function" ? children(vp) : children;


  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, marginBottom: 20 }}>
      {/* toolbar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "var(--space-1-5) 10px", background: "var(--muted)", borderBottom: "1px solid var(--border)",
        borderRadius: "12px 12px 0 0",
      }}>
        <span style={{ fontSize: 11, color: "var(--muted-fg)", fontWeight: 500, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {title}
        </span>
        <Tabs value={tab} onValueChange={setTab} style={{ display: "contents" }}>
          <TabsList>
            <TabsTrigger value="preview"><Eye size={11} /> Preview</TabsTrigger>
            <TabsTrigger value="code"><Code2 size={11} /> Code</TabsTrigger>
          </TabsList>
        </Tabs>
        <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
          {VIEWPORTS.map(v => (
            <button key={v.id} onClick={() => setVp(v.id)} title={v.w} style={{
              width: 24, height: 24, borderRadius: 5, border: "none", cursor: "pointer",
              background: vp === v.id ? "var(--bg)" : "transparent",
              color: vp === v.id ? "var(--fg)" : "var(--muted-fg)",
              display: "inline-flex", alignItems: "center", justifyContent: "center",
              boxShadow: vp === v.id ? "0 1px 3px rgba(0,0,0,.12)" : "none",
            }}>
              <v.Icon size={11} />
            </button>
          ))}
          <div style={{ width: 1, height: 14, background: "var(--border)", margin: "0 3px" }} />
          <button onClick={() => setDark(d => !d)} title="Toggle preview bg" style={{
            width: 24, height: 24, borderRadius: 5, border: "none", cursor: "pointer",
            background: dark ? "#18181b" : "transparent",
            color: dark ? "#a1a1aa" : "var(--muted-fg)",
            display: "inline-flex", alignItems: "center", justifyContent: "center",
          }}>
            {dark ? <Moon size={11} /> : <Sun size={11} />}
          </button>
        </div>
      </div>

      {/* body */}
      {tab === "preview"
        ? (
          <div style={{
            ...(dark ? PREVIEW_DARK_VARS : {}) as React.CSSProperties,
            background: dark ? "#09090b" : "var(--bg)", padding: fullWidth ? 0 : 16, minHeight: height,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative", transition: "background .2s",
            borderRadius: "0 0 12px 12px", overflow: "visible",
          }}>
            <div style={{
              maxWidth: vpW, width: "100%", transition: "max-width .3s",
              border: vp !== "full" && vp !== "desktop" ? "1px dashed var(--border)" : "none", borderRadius: 8,
              overflow: "visible",
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap",
                gap: fullWidth ? 0 : 10, padding: fullWidth ? 0 : "16px", minHeight: height, overflow: "visible",
              }}>
                {renderedChildren}
              </div>
            </div>
          </div>
        )
        : <CodeBlock code={normalizedCode} filename={filename} />}
    </div>
  );
}