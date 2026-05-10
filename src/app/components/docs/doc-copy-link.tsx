import React, { useState } from "react";
import { Link, Check } from "lucide-react";

/* ── shared ───────────────────────────────────────────────── */

const BTN_BASE: React.CSSProperties = {
  display: "flex", alignItems: "center", gap: "var(--space-1)",
  border: "none", cursor: "pointer",
  fontSize: "var(--font-size-body-13)",
  padding: "var(--space-1) var(--space-2)",
  borderRadius: "var(--radius-sm)",
  transition: "color .15s, background .15s",
};

function useCopyLink(getUrl: () => string) {
  const [copied, setCopied] = useState(false);
  const [hovered, setHovered] = useState(false);

  function copy() {
    const url = getUrl();
    const confirm = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };
    navigator.clipboard
      ? navigator.clipboard.writeText(url).then(confirm).catch(() => fallback(url, confirm))
      : fallback(url, confirm);
  }

  return { copied, hovered, setHovered, copy };
}

function CopyBtn({
  title,
  label,
  copiedLabel,
  getUrl,
}: {
  title: string;
  label: string;
  copiedLabel: string;
  getUrl: () => string;
}) {
  const { copied, hovered, setHovered, copy } = useCopyLink(getUrl);

  return (
    <button
      onClick={copy}
      title={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        ...BTN_BASE,
        fontWeight: (copied
          ? "var(--font-weight-label-sb-15)"
          : "var(--font-weight-normal)") as React.CSSProperties["fontWeight"],
        background: (copied || hovered) ? "var(--color-state-hover)" : "transparent",
        color: copied ? "var(--color-text-primary)" : "var(--muted-fg)",
      }}
    >
      {copied ? <Check size={13} /> : <Link size={13} />}
      <span>{copied ? copiedLabel : label}</span>
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

/* ── exports ──────────────────────────────────────────────── */

export function CopyLinkButton() {
  return (
    <CopyBtn
      title="Copy page link"
      label="Copy link"
      copiedLabel="Link copied!"
      getUrl={() => window.location.href}
    />
  );
}

export function CopySectionLinkButton({ sectionId }: { sectionId: string }) {
  return (
    <CopyBtn
      title="Copy section link"
      label="Copy link"
      copiedLabel="Copied!"
      getUrl={() => {
        const currentPage = window.location.hash.slice(1).split("/")[0] || "intro";
        return `${window.location.origin}/#${currentPage}/${sectionId}`;
      }}
    />
  );
}
