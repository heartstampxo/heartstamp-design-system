import React, { useId, useState } from "react";
import { Link2, Smile, X } from "lucide-react";
import { Btn } from "./btn";
import { EmojiPicker } from "./hs-emoji-picker";
import { PopoverNotch } from "./hs-popover-notch";
import {
  CONTROL_CLASS, CONTROL_FILLED, ControlStyles, FONT_BODY, FONT_EMOJI, FORM_PANEL_PAD_X,
  FORM_PANEL_WIDTH, PLACEHOLDER_CLASS, PlaceholderStyle, SUBTLE_BORDER,
  formPanelShell, panelCtaStyle, panelCtaWrapStyle, panelDescStyle,
  panelHeaderStyle, panelTitleStyle, pillFieldStyle, roundIconBtnStyle,
} from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Link Button Editor
   Popover opened by the formatting toolbar's "Link Btn" control.
   Builds a link that floats on the card: label, destination, and an
   icon — either the default link glyph or an emoji.

   Distinct from LinkEditor, which turns selected text into a
   hyperlink. This one produces a standalone, draggable element.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const STACK_GAP     = 9;    // off-scale, between --space-2 (8) and --space-2-5 (10)
const LABEL_SIZE    = 12;
const ROW_GAP       = 9;    // off-scale
const PREVIEW       = 46;
const PREVIEW_RADIUS = 13;  // off-scale, between --radius-2xl (12) and --radius-3xl (14)
const CHOICE_GAP    = 7;    // off-scale
const LINK_BTN_H    = 40;
const VALUE_SIZE    = 14;
const CHIP_SIZE     = 13;
const PREVIEW_EMOJI = 24;

// Default link glyph colour. A deliberate accent for the card element, not a
// system state — no --color-* token carries it.
const LINK_GLYPH_COLOR = "#0A84FF";

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = formPanelShell(STACK_GAP);

/* Sentence-case labels at 12/600 in text-primary — note this panel does not use
   the uppercase 11/700 field labels the small link editor carries. */
const labelStyle: React.CSSProperties = {
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: LABEL_SIZE,
  fontWeight: 600,
};

const fieldGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1-5, 6px)",
};

const iconRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: ROW_GAP,
};

const previewStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  width: PREVIEW,
  height: PREVIEW,
  borderRadius: PREVIEW_RADIUS,
  background: "var(--color-bg-main, #ffffff)",
  border: SUBTLE_BORDER,
};

const chooseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: CHOICE_GAP,
  flex: "1 1 0",
  minWidth: 0,
  height: 46,
  padding: "0 var(--space-1-5, 6px)",
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-full, 999px)",
  border: SUBTLE_BORDER,
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: VALUE_SIZE,
  fontWeight: 600,
  cursor: "pointer",
  whiteSpace: "nowrap",
};

/* Design shows a 40px pill on the --states-hover fill; Btn's `sm` is 36px, so
   height and label size are lifted to match. */
const linkChipStyle: React.CSSProperties = {
  height: LINK_BTN_H,
  padding: "0 var(--space-4, 16px)",
  borderRadius: "var(--radius-button, 25px)",
  fontSize: CHIP_SIZE,
  flexShrink: 0,
};

/* The emoji picker layers over the panel interior rather than extending past its
   bottom edge — aligned to the content column so it reads as part of the panel,
   and stacked above the fields it covers. */
const emojiLayerStyle: React.CSSProperties = {
  position: "absolute",
  left: FORM_PANEL_PAD_X,
  right: FORM_PANEL_PAD_X,
  top: "var(--space-4, 16px)",
  zIndex: 5,
};

/* Shorter body than the standalone picker so the whole layer stays inside the
   panel instead of overflowing it. */
const EMOJI_LAYER_MAX_H = 240;

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

/** The icon the card link carries — the default glyph, or an emoji. */
export type LinkBtnIcon = { kind: "link" } | { kind: "emoji"; char: string };

export interface LinkBtnValue {
  text: string;
  url: string;
  icon: LinkBtnIcon;
}

export interface LinkBtnEditorProps {
  defaultText?: string;
  defaultUrl?: string;
  /** Prefill the icon — pass an emoji to open in emoji mode. */
  defaultIcon?: LinkBtnIcon;
  /** Fired on submit with the trimmed values and chosen icon. */
  onApply?: (value: LinkBtnValue) => void;
  /** Fired on every field or icon change. */
  onChange?: (value: LinkBtnValue) => void;
  /** Fired by the header close button and on Escape. */
  onClose?: () => void;
  title?: string;
  description?: string;
  textLabel?: string;
  urlLabel?: string;
  iconLabel?: string;
  textPlaceholder?: string;
  urlPlaceholder?: string;
  chooseEmojiLabel?: string;
  linkIconLabel?: string;
  applyLabel?: string;
  width?: number | string;
  autoFocus?: boolean;
  /** Show the notch on the top edge. */
  arrow?: boolean;
  /** Distance in px from the left edge to the notch centre. Omit to centre it. */
  arrowOffset?: number;
  ariaLabel?: string;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   LinkBtnEditor
═══════════════════════════════════════════════════════ */

export function LinkBtnEditor({
  defaultText = "",
  defaultUrl = "",
  defaultIcon = { kind: "link" },
  onApply,
  onChange,
  onClose,
  title = "Add a link",
  description = "This link floats on your card — drag it anywhere on the white area after adding.",
  textLabel = "Link text",
  urlLabel = "Link URL",
  iconLabel = "Icon",
  textPlaceholder = "e.g. Our website",
  urlPlaceholder = "https://…",
  chooseEmojiLabel = "Choose emoji",
  linkIconLabel = "Link icon",
  applyLabel = "Add link",
  width = FORM_PANEL_WIDTH,
  autoFocus = false,
  arrow = true,
  arrowOffset,
  ariaLabel = "Add a link",
  style,
  className,
}: LinkBtnEditorProps) {
  const uid = useId();
  const textId = `${uid}-text`;
  const urlId = `${uid}-url`;

  const [text, setText] = useState(defaultText);
  const [url, setUrl] = useState(defaultUrl);
  const [icon, setIcon] = useState<LinkBtnIcon>(defaultIcon);
  const [emojiOpen, setEmojiOpen] = useState(false);

  // A link with no destination is not applicable; the label is optional because
  // the icon alone can carry it.
  const canApply = url.trim().length > 0;

  const report = (next: Partial<LinkBtnValue>) => {
    const value: LinkBtnValue = { text, url, icon, ...next };
    if (next.text !== undefined) setText(next.text);
    if (next.url !== undefined) setUrl(next.url);
    if (next.icon !== undefined) setIcon(next.icon);
    onChange?.(value);
  };

  const submit = () => {
    if (!canApply) return;
    onApply?.({ text: text.trim(), url: url.trim(), icon });
  };

  /* Enter is wired per field rather than via a <form>: the emoji picker nested
     below carries its own search input, and implicit form submission would fire
     from it. */
  const submitOnEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div
      role="dialog"
      aria-label={ariaLabel}
      className={className}
      style={{ ...shellStyle, width, ...style }}
      onKeyDown={(e) => {
        if (e.key !== "Escape") return;
        // Escape closes the emoji layer first, the panel second
        if (emojiOpen) {
          e.stopPropagation();
          setEmojiOpen(false);
        } else if (onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {arrow && <PopoverNotch offset={arrowOffset} />}
      <PlaceholderStyle />
      <ControlStyles />

      {/* ── Header ────────────────────────────────────────── */}
      <div style={panelHeaderStyle}>
        <h2 style={panelTitleStyle}>{title}</h2>
        {onClose && (
          <button type="button" aria-label="Close" className={`${CONTROL_CLASS} ${CONTROL_FILLED}`} style={roundIconBtnStyle} onClick={onClose}>
            <X size={16} strokeWidth={1.33} />
          </button>
        )}
      </div>

      <p style={panelDescStyle}>{description}</p>

      {/* ── Fields ────────────────────────────────────────── */}
      <div style={fieldGroupStyle}>
        <label htmlFor={textId} style={labelStyle}>{textLabel}</label>
        <input
          id={textId}
          type="text"
          className={PLACEHOLDER_CLASS}
          style={pillFieldStyle}
          value={text}
          placeholder={textPlaceholder}
          autoFocus={autoFocus}
          onChange={(e) => report({ text: e.target.value })}
          onKeyDown={submitOnEnter}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor={urlId} style={labelStyle}>{urlLabel}</label>
        <input
          id={urlId}
          type="url"
          className={PLACEHOLDER_CLASS}
          style={pillFieldStyle}
          value={url}
          placeholder={urlPlaceholder}
          onChange={(e) => report({ url: e.target.value })}
          onKeyDown={submitOnEnter}
        />
      </div>

      {/* ── Icon ──────────────────────────────────────────── */}
      <span style={labelStyle}>{iconLabel}</span>

      <div style={iconRowStyle}>
        <span style={previewStyle} aria-hidden="true">
          {icon.kind === "emoji" ? (
            <span style={{ fontFamily: FONT_EMOJI, fontSize: PREVIEW_EMOJI, lineHeight: 1 }}>{icon.char}</span>
          ) : (
            <Link2 size={20} strokeWidth={1.83} style={{ color: LINK_GLYPH_COLOR }} />
          )}
        </span>

        <button
          type="button"
          className={`${CONTROL_CLASS} ${CONTROL_FILLED}`}
          style={chooseStyle}
          aria-expanded={emojiOpen}
          aria-haspopup="dialog"
          onClick={() => setEmojiOpen((o) => !o)}
        >
          <Smile size={18} strokeWidth={1.5} />
          {chooseEmojiLabel}
        </button>

        <Btn
          variant="secondary-ghost"
          size="sm"
          style={linkChipStyle}
          aria-pressed={icon.kind === "link"}
          onClick={() => { setEmojiOpen(false); report({ icon: { kind: "link" } }); }}
        >
          {linkIconLabel}
        </Btn>
      </div>

      {/* ── Commit ────────────────────────────────────────── */}
      <div style={panelCtaWrapStyle}>
        <Btn
          variant="default"
          size="sm"
          style={panelCtaStyle}
          disabled={!canApply}
          disabledTooltip="Add a URL first"
          onClick={submit}
        >
          {applyLabel}
        </Btn>
      </div>

      {emojiOpen && (
        <div style={emojiLayerStyle}>
          <EmojiPicker
            arrow={false}
            width="100%"
            maxHeight={EMOJI_LAYER_MAX_H}
            autoFocusSearch
            onSelect={(char) => {
              report({ icon: { kind: "emoji", char } });
              setEmojiOpen(false);
            }}
            onClose={() => setEmojiOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
