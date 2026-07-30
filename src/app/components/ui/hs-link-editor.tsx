import React, { useId, useState } from "react";
import { Btn } from "./btn";
import { PopoverNotch } from "./hs-popover-notch";
import {
  FONT_BODY, SUBTLE_BORDER, PLACEHOLDER_CLASS, PlaceholderStyle, panelShell,
} from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Link Editor
   Popover opened by the formatting toolbar's link control. Two fields
   — the text the reader sees and the destination — plus an apply
   action. Submits on Enter, closes on Escape.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const DEFAULT_WIDTH = 264;   // 240 field + 12 padding either side
const FIELD_H       = 38;
const FIELD_PAD_X   = 13;    // off the --space-* scale (between 12 and 14)
const STACK_GAP     = 9;     // off-scale, between --space-2 (8) and --space-2-5 (10)
const LABEL_SIZE    = 11;    // no --font-size-* token at 11px
const LABEL_TRACKING = 0.55;
const FIELD_SIZE    = 14;    // no --font-size-* token at 14px
const APPLY_SIZE    = 13;
const SHELL_RADIUS  = 16;    // between --radius-3xl (14) and --radius-input (32)

// Panel shadow — shallower than the emoji picker's since this panel is smaller.
// No --shadow-* token matches.
const SHELL_SHADOW = "0px 8px 24px rgba(0, 0, 0, 0.15)";

/* ── Static styles ──────────────────────────────────────────────── */

const shellStyle: React.CSSProperties = {
  ...panelShell(SHELL_RADIUS, SHELL_SHADOW),
  alignItems: "stretch",
  gap: STACK_GAP,
  padding: "var(--space-3, 12px)",
};

const labelStyle: React.CSSProperties = {
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: LABEL_SIZE,
  fontWeight: "var(--font-weight-label-12-bd, 700)" as React.CSSProperties["fontWeight"],
  textTransform: "uppercase",
  letterSpacing: LABEL_TRACKING,
};

const fieldStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  height: FIELD_H,
  padding: `0 ${FIELD_PAD_X}px`,
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: "var(--radius-xl, 10px)",
  border: SUBTLE_BORDER,
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_BODY,
  fontSize: FIELD_SIZE,
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
};

/* Design shows a 38px pill; Btn's `sm` size is 36px with --radius-button (25px),
   so height, radius and label size are lifted to match. */
const applyStyle: React.CSSProperties = {
  width: "100%",
  height: FIELD_H,
  borderRadius: "var(--radius-full, 999px)",
  fontSize: APPLY_SIZE,
  fontWeight: 600,
};

/* Field labels sit tight above their input, overriding the shell's 9px gap. */
const fieldGroupStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: STACK_GAP,
};

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export interface LinkEditorValue {
  text: string;
  url: string;
}

export interface LinkEditorProps {
  /** Prefill the visible text — pass the current selection, or an existing link's label. */
  defaultText?: string;
  /** Prefill the destination — pass the existing href when editing a link. */
  defaultUrl?: string;
  /** Fired on submit (apply button or Enter) with the trimmed values. */
  onApply?: (value: LinkEditorValue) => void;
  /** Fired on every keystroke in either field. */
  onChange?: (value: LinkEditorValue) => void;
  /** Fired on Escape. */
  onClose?: () => void;
  textLabel?: string;
  urlLabel?: string;
  textPlaceholder?: string;
  urlPlaceholder?: string;
  applyLabel?: string;
  width?: number | string;
  /** Focus the text field on mount. */
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
   LinkEditor
═══════════════════════════════════════════════════════ */

export function LinkEditor({
  defaultText = "",
  defaultUrl = "",
  onApply,
  onChange,
  onClose,
  textLabel = "Link text",
  urlLabel = "Link URL",
  textPlaceholder = "Text to show",
  urlPlaceholder = "https://…",
  applyLabel = "Apply link",
  width = DEFAULT_WIDTH,
  autoFocus = false,
  arrow = true,
  arrowOffset,
  ariaLabel = "Edit link",
  style,
  className,
}: LinkEditorProps) {
  const uid = useId();
  const textId = `${uid}-text`;
  const urlId = `${uid}-url`;

  const [text, setText] = useState(defaultText);
  const [url, setUrl] = useState(defaultUrl);

  // A link with no destination is not applicable; the text is optional because
  // the host can fall back to showing the URL itself.
  const canApply = url.trim().length > 0;

  const update = (next: Partial<LinkEditorValue>) => {
    const value = { text, url, ...next };
    setText(value.text);
    setUrl(value.url);
    onChange?.(value);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canApply) return;
    onApply?.({ text: text.trim(), url: url.trim() });
  };

  return (
    <form
      role="dialog"
      aria-label={ariaLabel}
      className={className}
      style={{ ...shellStyle, width, ...style }}
      onSubmit={submit}
      onKeyDown={(e) => {
        if (e.key === "Escape" && onClose) {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {arrow && <PopoverNotch offset={arrowOffset} />}
      <PlaceholderStyle />

      <div style={fieldGroupStyle}>
        <label htmlFor={textId} style={labelStyle}>{textLabel}</label>
        <input
          id={textId}
          type="text"
          className={PLACEHOLDER_CLASS}
          style={fieldStyle}
          value={text}
          placeholder={textPlaceholder}
          autoFocus={autoFocus}
          onChange={(e) => update({ text: e.target.value })}
        />
      </div>

      <div style={fieldGroupStyle}>
        <label htmlFor={urlId} style={labelStyle}>{urlLabel}</label>
        <input
          id={urlId}
          type="url"
          className={PLACEHOLDER_CLASS}
          style={fieldStyle}
          value={url}
          placeholder={urlPlaceholder}
          onChange={(e) => update({ url: e.target.value })}
        />
      </div>

      <Btn
        type="submit"
        variant="default"
        size="sm"
        style={applyStyle}
        disabled={!canApply}
        disabledTooltip="Add a URL first"
      >
        {applyLabel}
      </Btn>
    </form>
  );
}
