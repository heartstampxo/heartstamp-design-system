import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

/* ─── shadcn-style tabbed install block ─────────────────────── */
type PkgMgr = "npm" | "pnpm" | "yarn";

export function InstallBlock({
  commands,
  label,
}: {
  /** Map of package-manager → command string */
  commands: Record<PkgMgr, string>;
  /** Optional small label above the block */
  label?: string;
}) {
  const [pkg, setPkg] = useState<PkgMgr>("npm");
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try { await navigator.clipboard.writeText(commands[pkg]); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = commands[pkg];
      Object.assign(ta.style, { position: "fixed", opacity: "0" });
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const managers: PkgMgr[] = ["npm", "pnpm", "yarn"];

  return (
    <div>
      {label && (
        <p style={{ margin: "0 0 8px", fontSize: 13, color: "var(--muted-fg)" }}>{label}</p>
      )}
      <div style={{
        background: "#09090b",
        border: "1px solid #27272a",
        borderRadius: 8,
        overflow: "hidden",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
      }}>
        {/* ── Tab bar ── */}
        <div style={{
          display: "flex",
          alignItems: "center",
          borderBottom: "1px solid #27272a",
          padding: "0 4px",
          position: "relative",
        }}>
          {managers.map((m) => {
            const active = pkg === m;
            return (
              <button
                key={m}
                onClick={() => setPkg(m)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "10px 14px",
                  fontSize: 12,
                  fontWeight: active ? 600 : 400,
                  color: active ? "#fafafa" : "#71717a",
                  position: "relative",
                  transition: "color .15s",
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  borderBottom: active ? "2px solid #fafafa" : "2px solid transparent",
                  marginBottom: -1,
                }}
              >
                {m}
              </button>
            );
          })}

          {/* Copy button — pinned right */}
          <button
            onClick={copy}
            style={{
              marginLeft: "auto",
              marginRight: 8,
              display: "flex",
              alignItems: "center",
              gap: 5,
              background: copied ? "rgba(255,255,255,.08)" : "transparent",
              border: "1px solid #3f3f46",
              borderRadius: 5,
              padding: "4px 10px",
              cursor: "pointer",
              color: copied ? "#a1a1aa" : "#71717a",
              fontSize: 11,
              fontFamily: "inherit",
              transition: "all .15s",
            }}
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>

        {/* ── Code area ── */}
        <pre style={{
          margin: 0,
          padding: "16px 20px",
          overflowX: "auto",
          fontSize: 13,
          lineHeight: 1.7,
          color: "#e4e4e7",
          whiteSpace: "pre",
        }}>
          {commands[pkg]}
        </pre>
      </div>
    </div>
  );
}

export function CodeBlock({ code, filename }: { code: string; filename?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const hi = (line: string) => {
    // Apply a regex only to plain-text nodes — never inside an HTML tag's
    // attributes. This prevents later passes from matching e.g. style="color:#…"
    // that were injected by an earlier pass.
    type Rep = string | ((m: string, ...a: string[]) => string);
    const onText = (html: string, regex: RegExp, rep: Rep) =>
      html.replace(/(<[^>]*>)|([^<]+)/g, (match, tag, text) => {
        if (tag)  return tag;
        if (text) return typeof rep === "function"
          ? text.replace(regex, rep)
          : text.replace(regex, rep);
        return match;
      });

    // Step 1 — escape literal "<" in source code
    let out = line.replace(/</g, "&lt;");

    // Step 2 — whole-line comments (run before any <span> insertion)
    const wholeComment = out.match(/^(\s*)(\/\/.*)$/);
    if (wholeComment) {
      return `${wholeComment[1]}<span style="color:#6b7280;font-style:italic">${wholeComment[2]}</span>`;
    }

    // Step 3 — strings  (single / double / backtick)
    out = onText(out, /(["`'])([^"`'\n]*)\1/g,
      (_, q, body) => `<span style="color:#86efac">${q}${body}${q}</span>`
    );

    // Step 4 — keywords  (text nodes only → won't touch span style attrs)
    out = onText(
      out,
      /\b(import|from|const|let|return|export|default|async|await|function|true|false|null)\b/g,
      '<span style="color:#c084fc">$1</span>'
    );

    // Step 5 — JSX component tags  (&lt;Foo or &lt;/Foo)
    out = onText(out, /(&lt;)(\/?)([A-Z][A-Za-z]*)/g,
      (_, lt, sl, tag) => `${lt}${sl}<span style="color:#7dd3fc">${tag}</span>`
    );

    // Step 6 — common JSX prop names
    out = onText(
      out,
      /\b(variant|size|disabled|className|onClick|asChild|value|onChange|checked|placeholder)=/g,
      '<span style="color:#fda4af">$1</span>='
    );

    // Step 7 — inline trailing comments  (e.g. code  // note)
    out = onText(out, /\/\/.*/g,
      (m) => `<span style="color:#6b7280;font-style:italic">${m}</span>`
    );

    return out;
  };

  return (
    <div style={{
      background: "#09090b",
      border: "1px solid #27272a",
      borderRadius: 8,
      overflow: "hidden",
      fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    }}>
      {/* ── Header bar — filename + copy button ── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        borderBottom: "1px solid #27272a",
        padding: "0 4px 0 16px",
        minHeight: 40,
      }}>
        {filename && (
          <span style={{ fontSize: 12, color: "#71717a", fontFamily: "inherit", flex: 1 }}>
            {filename}
          </span>
        )}
        <button
          onClick={copy}
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
            gap: 5,
            background: copied ? "rgba(255,255,255,.08)" : "transparent",
            border: "1px solid #3f3f46",
            borderRadius: 5,
            padding: "4px 10px",
            cursor: "pointer",
            color: copied ? "#a1a1aa" : "#71717a",
            fontSize: 11,
            fontFamily: "inherit",
            transition: "all .15s",
            margin: "6px 8px",
          }}
        >
          {copied ? <Check size={11} /> : <Copy size={11} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>

      {/* ── Code area ── */}
      <pre style={{ margin: 0, padding: "16px 20px", overflowX: "auto", fontSize: 13, lineHeight: 1.7, fontFamily: "inherit" }}>
        {code.split("\n").map((line: string, i: number) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ minWidth: 28, color: "#3f3f46", userSelect: "none", textAlign: "right", marginRight: 20, flexShrink: 0 }}>
              {i + 1}
            </span>
            <span
              style={{ color: "#e4e4e7" }}
              dangerouslySetInnerHTML={{ __html: hi(line) || " " }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}
