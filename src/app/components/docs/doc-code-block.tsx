import React, { useState } from "react";
import { Copy, Check } from "lucide-react";

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
    // Highlight JSX component tags: <Foo or </Foo
    // We first HTML-escape the raw "<" so the browser doesn't mis-parse
    // "<<span>" as a malformed tag when using dangerouslySetInnerHTML.
    let out = line
      // escape literal "<" that haven't been escaped yet
      .replace(/</g, "&lt;")
      // now match both &lt; and the already-escaped form, plus optional /
      .replace(/(&lt;)(\/?)([A-Z][A-Za-z]*)/g, (_, lt, sl, tag) =>
        `${lt}${sl}<span style="color:#7dd3fc">${tag}</span>`
      );

    // highlight keywords
    out = out.replace(
      /\b(import|from|const|let|return|export|default|async|await|function|true|false|null)\b/g,
      '<span style="color:#c084fc">$1</span>'
    );
    // highlight strings
    out = out.replace(
      /(["`'])([^"`'\n]*)\1/g,
      '<span style="color:#86efac">$1$2$1</span>'
    );
    // highlight common prop names
    out = out.replace(
      /\b(variant|size|disabled|className|onClick|asChild|value|onChange|checked|placeholder)=/g,
      '<span style="color:#fda4af">$1</span>='
    );
    // highlight comments
    out = out.replace(
      /\/\/.*/g,
      '<span style="color:#6b7280;font-style:italic">$&</span>'
    );
    return out;
  };

  return (
    <div style={{ background: "#0d1117", borderRadius: 0, position: "relative", overflow: "hidden" }}>
      {filename && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderBottom: "1px solid #21262d" }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#ff5f56" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#27c840" }} />
          <span style={{ marginLeft: 8, fontSize: 11, color: "#8b949e", fontFamily: "monospace" }}>{filename}</span>
        </div>
      )}
      <button
        onClick={copy}
        style={{
          position: "absolute", top: filename ? 38 : 8, right: 10,
          background: "rgba(255,255,255,.06)", border: "1px solid #30363d", borderRadius: 6,
          padding: "4px 8px", cursor: "pointer",
          color: copied ? "#27c840" : "#8b949e",
          display: "flex", alignItems: "center", gap: 4, fontSize: 11,
        }}
      >
        {copied ? <Check size={12} /> : <Copy size={12} />}
        {copied ? "Copied!" : "Copy"}
      </button>
      <pre style={{ margin: 0, padding: 16, overflowX: "auto", fontSize: 12.5, lineHeight: 1.7, fontFamily: "monospace" }}>
        {code.split("\n").map((line: string, i: number) => (
          <div key={i} style={{ display: "flex" }}>
            <span style={{ minWidth: 28, color: "#484f58", userSelect: "none", textAlign: "right", marginRight: 16 }}>
              {i + 1}
            </span>
            <span
              style={{ color: "#e6edf3" }}
              dangerouslySetInnerHTML={{ __html: hi(line) || " " }}
            />
          </div>
        ))}
      </pre>
    </div>
  );
}
