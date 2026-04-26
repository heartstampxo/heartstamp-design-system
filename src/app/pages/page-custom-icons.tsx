import React, { useState } from "react";
import { DocPage, DocSection } from "../components/docs/doc-page";

import HCP01 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-01.svg?raw";
import HCP02 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-02.svg?raw";
import HCP03 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-03.svg?raw";
import HCP04 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-04.svg?raw";
import HCP05 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-05.svg?raw";
import HCP06 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-06.svg?raw";
import HCP07 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-07.svg?raw";
import HCP08 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-08.svg?raw";
import HCP09 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-09.svg?raw";
import HCP10 from "../../assets/Custom_Icons/Heart-Credit-Icons/HeartStamp-Primary-10.svg?raw";

import HCS01 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-01.svg?raw";
import HCS02 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-02.svg?raw";
import HCS03 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-03.svg?raw";
import HCS04 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-04.svg?raw";
import HCS05 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-05.svg?raw";
import HCS06 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-06.svg?raw";
import HCS07 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-07.svg?raw";
import HCS08 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-08.svg?raw";
import HCS09 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-09.svg?raw";
import HCS10 from "../../assets/Custom_Icons/Heart Secondary/HeartStamp-Secondary-10.svg?raw";

const PRIMARY_ICONS = [
  { name: "HeartStamp-Primary-01", raw: HCP01 },
  { name: "HeartStamp-Primary-02", raw: HCP02 },
  { name: "HeartStamp-Primary-03", raw: HCP03 },
  { name: "HeartStamp-Primary-04", raw: HCP04 },
  { name: "HeartStamp-Primary-05", raw: HCP05 },
  { name: "HeartStamp-Primary-06", raw: HCP06 },
  { name: "HeartStamp-Primary-07", raw: HCP07 },
  { name: "HeartStamp-Primary-08", raw: HCP08 },
  { name: "HeartStamp-Primary-09", raw: HCP09 },
  { name: "HeartStamp-Primary-10", raw: HCP10 },
];

const SECONDARY_ICONS = [
  { name: "HeartStamp-Secondary-01", raw: HCS01 },
  { name: "HeartStamp-Secondary-02", raw: HCS02 },
  { name: "HeartStamp-Secondary-03", raw: HCS03 },
  { name: "HeartStamp-Secondary-04", raw: HCS04 },
  { name: "HeartStamp-Secondary-05", raw: HCS05 },
  { name: "HeartStamp-Secondary-06", raw: HCS06 },
  { name: "HeartStamp-Secondary-07", raw: HCS07 },
  { name: "HeartStamp-Secondary-08", raw: HCS08 },
  { name: "HeartStamp-Secondary-09", raw: HCS09 },
  { name: "HeartStamp-Secondary-10", raw: HCS10 },
];

const SECONDARY_CARD_BG       = "#242423";
const SECONDARY_CARD_BG_HOVER = "#3a3a38";

export function PageCustomIcons() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyIcon = async (name: string, folder: string) => {
    const text = `import ${name} from "@/assets/Custom_Icons/${folder}/${name}.svg?raw";`;
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

  const IconCard = ({ name, raw, folder, darkCard = false }: {
    name: string; raw: string; folder: string; darkCard?: boolean;
  }) => {
    const isCopied  = copied === name;
    const cardBg    = darkCard ? SECONDARY_CARD_BG : "var(--bg)";
    const hoverBg   = darkCard ? SECONDARY_CARD_BG_HOVER : "var(--muted)";
    const labelColor = isCopied
      ? "var(--color-brand-primary)"
      : darkCard ? "rgba(255,255,255,0.45)" : "var(--muted-fg)";

    return (
      <div
        onClick={() => copyIcon(name, folder)}
        title={`${name} — click to copy import`}
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: "var(--space-1-5)",
          padding: "var(--space-3) var(--space-1-5)",
          height: 80,
          borderRadius: "var(--radius-lg)",
          border: `1px solid ${isCopied ? "var(--color-brand-primary)" : "var(--border)"}`,
          background: isCopied ? "var(--color-brand-primary-dim)" : cardBg,
          cursor: "pointer",
          transition: "background 0.15s, border-color 0.15s",
          userSelect: "none",
        }}
        onMouseEnter={e => {
          if (isCopied) return;
          (e.currentTarget as HTMLElement).style.background = hoverBg;
          (e.currentTarget as HTMLElement).style.borderColor = "var(--color-brand-primary)";
        }}
        onMouseLeave={e => {
          if (isCopied) return;
          (e.currentTarget as HTMLElement).style.background = cardBg;
          (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
        }}
      >
        <div
          style={{ width: "var(--space-5)", height: "var(--space-5)", flexShrink: 0 }}
          dangerouslySetInnerHTML={{ __html: raw }}
        />
        <span style={{
          fontSize: "var(--font-size-label-12)",
          lineHeight: 1.3, textAlign: "center",
          wordBreak: "break-all",
          color: labelColor,
        }}>
          {isCopied ? "Copied!" : name.replace("HeartStamp-", "").replace("-", " #")}
        </span>
      </div>
    );
  };

  const IconGrid = ({ icons, folder, darkCard = false }: {
    icons: typeof PRIMARY_ICONS; folder: string; darkCard?: boolean;
  }) => (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))",
      gap: "var(--space-3)",
    }}>
      {icons.map(({ name, raw }) => (
        <IconCard key={name} name={name} raw={raw} folder={folder} darkCard={darkCard} />
      ))}
    </div>
  );

  const total = PRIMARY_ICONS.length + SECONDARY_ICONS.length;

  return (
    <DocPage
      title="Custom Icons"
      subtitle={`HeartStamp heart-stamp icons · ${total} total · Click any icon to copy its import · Colors driven by design tokens`}
    >
      <DocSection
        title="Primary"
        desc="Filled heart · brand color fill · white number"
      >
        <IconGrid icons={PRIMARY_ICONS} folder="Heart-Credit-Icons" />
      </DocSection>

      <DocSection
        title="Secondary"
        desc="White heart · brand color number — displayed on dark background for contrast"
      >
        <IconGrid icons={SECONDARY_ICONS} folder="Heart Secondary" darkCard />
      </DocSection>
    </DocPage>
  );
}
