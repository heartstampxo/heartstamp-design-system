import React, { useState } from "react";
import { Link, Check } from "lucide-react";

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);

  function copyLink() {
    const url = window.location.href;
    const confirm = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(confirm).catch(() => fallback(url, confirm));
    } else {
      fallback(url, confirm);
    }
  }

  return (
    <button
      onClick={copyLink}
      title="Copy page link"
      style={{
        display: "flex", alignItems: "center", gap: "var(--space-1)",
        border: "none", cursor: "pointer",
        fontSize: "var(--font-size-body-13)",
        fontWeight: copied ? "var(--font-weight-label-sb-15)" as any : "var(--font-weight-normal)" as any,
        padding: "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-sm)",
        transition: "color .15s, background .15s",
        background: copied ? "var(--color-state-hover)" : "none",
        color: copied ? "var(--color-text-primary)" : "var(--muted-fg)",
      }}
      onMouseEnter={e => { if (!copied) e.currentTarget.style.background = "var(--color-state-hover)"; }}
      onMouseLeave={e => { if (!copied) e.currentTarget.style.background = "none"; }}
    >
      {copied ? <Check size={13} /> : <Link size={13} />}
      <span>{copied ? "Link copied!" : "Copy link"}</span>
    </button>
  );
}

function fallback(url: string, confirm: () => void) {
  const ta = document.createElement("textarea");
  ta.value = url;
  document.body.appendChild(ta);
  ta.select();
  document.execCommand("copy");
  document.body.removeChild(ta);
  confirm();
}
