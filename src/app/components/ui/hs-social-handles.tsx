import React, { useId, useState } from "react";
import { ChevronDown, Globe, X } from "lucide-react";
import { Btn } from "./btn";
import { DdMenu } from "./hs-dd-menu";
import { PopoverNotch } from "./hs-popover-notch";
import {
  FORM_PANEL_WIDTH, PLACEHOLDER_CLASS, PlaceholderStyle, SUBTLE_BORDER,
  FONT_BODY, formPanelShell, panelCtaStyle, panelCtaWrapStyle, panelDescStyle,
  panelHeaderStyle, panelTitleStyle, pillFieldStyle, roundIconBtnStyle,
} from "./hs-popover-kit";
import {
  SOCIAL_PLATFORMS,
  detectSocialPlatform,
  findSocialPlatform,
  normaliseSocialHandle,
  type SocialPlatform,
} from "./hs-social-icons";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Social Handles
   Popover opened by the formatting toolbar's "Handles" control.
   Lists the handles already added, each removable, then a row to add
   another: pick a platform, type a handle or paste a link, press Add.
   "Add to cover" commits the list.

   A pasted link identifies its own platform, so the picker is only
   needed for bare handles.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const STACK_GAP    = 13;   // off-scale, between --space-3 (12) and --space-3-5 (14)
const BADGE        = 38;   // platform badge on a filled row
const ROW_GAP      = 11;   // off-scale
const ADD_ROW_H    = 46;
const ADD_ROW_GAP  = 9;    // off-scale
const VALUE_SIZE   = 14;   // no --font-size-* token at 14px
const ADD_SIZE     = 13;

// Panel shadow, tinted with the text-primary hue (36,36,35). No token matches.

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = formPanelShell(STACK_GAP);

const handleRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ROW_GAP,
  padding: "7px 10px 7px 7px",
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-full, 999px)",
  border: SUBTLE_BORDER,
};

const badgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: BADGE,
  height: BADGE,
  borderRadius: "var(--radius-full, 999px)",
  background: "var(--color-bg-muted, #faf6f0)",
  color: "var(--color-text-primary, #242423)",
};

const valueStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: VALUE_SIZE,
  fontWeight: 500,
};

const addRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ADD_ROW_GAP,
  paddingTop: "var(--space-1, 4px)",
};

const pickerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "var(--space-1-5, 6px)",
  height: ADD_ROW_H,
  padding: "0 10px 0 13px",
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-full, 999px)",
  border: SUBTLE_BORDER,
  color: "var(--color-text-primary, #242423)",
  cursor: "pointer",
  flexShrink: 0,
};

/* Design shows a 46px tall pill with a --states-hover fill; Btn's `sm` is 36px
   with --radius-button, so height and label size are lifted to match. */
const addBtnStyle: React.CSSProperties = {
  height: ADD_ROW_H,
  padding: "0 var(--space-4, 16px)",
  borderRadius: "var(--radius-button, 25px)",
  fontSize: ADD_SIZE,
  flexShrink: 0,
};

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export interface SocialHandle {
  /** Platform id from SOCIAL_PLATFORMS, or undefined for a plain link. */
  platformId?: string;
  /** What the user typed — a bare handle or a full link. */
  value: string;
}

export interface SocialHandlesProps {
  /** Handles already on the card. Controlled when `onChange` is supplied. */
  handles?: SocialHandle[];
  /** Initial handles when uncontrolled. */
  defaultHandles?: SocialHandle[];
  /** Fired whenever a handle is added or removed. */
  onChange?: (handles: SocialHandle[]) => void;
  /** Fired by the primary action with the current list. */
  onApply?: (handles: SocialHandle[]) => void;
  /** Fired by the header close button and on Escape. */
  onClose?: () => void;
  platforms?: SocialPlatform[];
  title?: string;
  description?: string;
  inputPlaceholder?: string;
  addLabel?: string;
  applyLabel?: string;
  width?: number | string;
  /** Show the notch on the top edge. */
  arrow?: boolean;
  /** Distance in px from the left edge to the notch centre. Omit to centre it. */
  arrowOffset?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   SocialHandles
═══════════════════════════════════════════════════════ */

export function SocialHandles({
  handles,
  defaultHandles = [],
  onChange,
  onApply,
  onClose,
  platforms = SOCIAL_PLATFORMS,
  title = "Your social handles",
  description = "Add the accounts you want on your card. Leave the rest blank, only the ones you fill in will show.",
  inputPlaceholder = "@handle or full link",
  addLabel = "Add",
  applyLabel = "Add to cover",
  width = FORM_PANEL_WIDTH,
  arrow = true,
  arrowOffset,
  ariaLabel = "Your social handles",
  style,
  className,
}: SocialHandlesProps) {
  const uid = useId();
  const inputId = `${uid}-handle`;

  const [internal, setInternal] = useState<SocialHandle[]>(defaultHandles);
  const list = handles ?? internal;

  const [draft, setDraft] = useState("");
  // The picker always carries a real platform so it can show a brand mark; the
  // Figma placeholder glyph would read as a broken icon.
  const [pickedId, setPickedId] = useState<string | undefined>(() => platforms[0]?.id);

  // A pasted link names its own platform, so it wins over the picker.
  const detected = detectSocialPlatform(draft);
  const activeId = detected?.id ?? pickedId;
  const active = findSocialPlatform(activeId);
  const canAdd = draft.trim().length > 0;

  const commit = (next: SocialHandle[]) => {
    if (handles === undefined) setInternal(next);
    onChange?.(next);
  };

  const add = () => {
    if (!canAdd) return;
    commit([...list, { platformId: activeId, value: draft.trim() }]);
    setDraft("");
    setPickedId(platforms[0]?.id);
  };

  const remove = (index: number) => commit(list.filter((_, i) => i !== index));

  const ActiveIcon = active?.Icon;

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className={className}
      style={{ ...shellStyle, width, ...style }}
      onKeyDown={(e) => {
        if (e.key === "Escape" && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {arrow && <PopoverNotch offset={arrowOffset} />}
      <PlaceholderStyle />

      {/* ── Header ────────────────────────────────────────── */}
      <div style={panelHeaderStyle}>
        <h2 style={panelTitleStyle}>{title}</h2>
        {onClose && (
          <button type="button" aria-label="Close" style={roundIconBtnStyle} onClick={onClose}>
            <X size={16} strokeWidth={1.33} />
          </button>
        )}
      </div>

      <p style={panelDescStyle}>{description}</p>

      {/* ── Handles already added ─────────────────────────── */}
      {list.map((handle, index) => {
        const platform = findSocialPlatform(handle.platformId);
        const Icon = platform?.Icon;
        return (
          <div key={`${handle.platformId ?? "link"}-${handle.value}-${index}`} style={handleRowStyle}>
            {/* Globe stands in for a link on no recognised platform */}
            <span style={badgeStyle}>
              {Icon ? <Icon size={19} /> : <Globe size={19} strokeWidth={1.58} />}
            </span>
            <span style={valueStyle}>{handle.value}</span>
            <button
              type="button"
              aria-label={`Remove ${platform ? `${platform.name} ` : ""}${handle.value}`}
              style={roundIconBtnStyle}
              onClick={() => remove(index)}
            >
              <X size={15} strokeWidth={1.25} style={{ color: "var(--color-text-secondary, #6e6d6a)" }} />
            </button>
          </div>
        );
      })}

      {/* ── Add a handle ──────────────────────────────────── */}
      <div style={addRowStyle}>
        <DdMenu
          fixed
          trigger={
            <button
              type="button"
              style={pickerStyle}
              aria-label={active ? `Platform: ${active.name}` : "Choose a platform"}
            >
              {ActiveIcon ? <ActiveIcon size={17} /> : <Globe size={17} strokeWidth={1.42} />}
              <ChevronDown size={15} strokeWidth={1.25} style={{ color: "var(--color-text-secondary, #6e6d6a)" }} />
            </button>
          }
          items={platforms.map((p) => ({
            label: p.name,
            icon: <p.Icon size={16} />,
            onClick: () => setPickedId(p.id),
          }))}
        />

        <input
          id={inputId}
          type="text"
          className={PLACEHOLDER_CLASS}
          style={pillFieldStyle}
          value={draft}
          placeholder={inputPlaceholder}
          aria-label={inputPlaceholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />

        <Btn
          variant="secondary-ghost"
          size="sm"
          style={addBtnStyle}
          disabled={!canAdd}
          disabledTooltip="Enter a handle or link first"
          onClick={add}
        >
          {addLabel}
        </Btn>
      </div>

      {/* ── Commit ────────────────────────────────────────── */}
      <div style={panelCtaWrapStyle}>
        <Btn variant="default" size="sm" style={panelCtaStyle} onClick={() => onApply?.(list)}>
          {applyLabel}
        </Btn>
      </div>
    </div>
  );
}

/**
 * Resolves a handle to an absolute URL.
 *
 * A pasted link is returned as-is, except that a missing scheme is filled in —
 * "instagram.com/easiblu" would otherwise resolve as a path relative to the
 * current page when used as an href. A bare handle is expanded through its
 * platform, and yields undefined when no platform is known.
 */
export function socialHandleUrl(handle: SocialHandle): string | undefined {
  const raw = handle.value.trim();
  const bare = normaliseSocialHandle(raw);
  if (!bare) return undefined;

  const isLink = raw.includes(".") && !raw.startsWith("@");
  if (isLink) return /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;

  return findSocialPlatform(handle.platformId)?.toUrl(bare);
}
