import React, { useId, useState } from "react";
import { Btn } from "./btn";
import defaultAvatar from "../../../assets/Mascots/Social-Ready Expressions/Small Smile.png";
import { FONT_BODY, FONT_HEADING } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Coaching Tips
   Onboarding coach marks: a floating card that introduces one
   thing at a time, stepped through with Skip / Next.

   ·  CoachTipCard — the presentational card (one tip)
   ·  CoachTips    — sequence controller over an array of tips

   Non-modal by design: no backdrop, no focus trap. The card is
   labelled by its title and announces step changes politely.
═══════════════════════════════════════════════════════ */

/* ── Figma geometry with no matching token ──────────────────────── */
const CARD_RADIUS  = 18;              // sits between --radius-3xl (14) and --radius-button (25)
const CARD_PADDING = "13px 15px 12px";
const AVATAR_SIZE  = 44;
const TITLE_SIZE   = 16;              // no --font-size-* token at 16px
const TITLE_WEIGHT = 600;             // same weight as --font-weight-label-sb-15

// Lifted overlay shadow — deliberately heavier than any --shadow-* token so the
// card reads as floating above the UI it is explaining.
const CARD_SHADOW = "0px 24px 64px rgba(0, 0, 0, 0.30)";

// Body copy sits between --color-text-primary (#242423) and
// --color-text-secondary (#6e6d6a). No token matches — raw value from the spec.
const BODY_COLOR = "#5A5A57";

/* ── Static styles (hoisted — no per-render allocation) ─────────── */

const cardStyle: React.CSSProperties = {
  boxSizing: "border-box",
  width: "100%",
  padding: CARD_PADDING,
  background: "var(--color-bg-main, #ffffff)",
  borderRadius: CARD_RADIUS,
  boxShadow: CARD_SHADOW,
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-3, 12px)",        // content ↔ actions
};

const topRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-start",
  gap: "var(--space-4, 16px)",        // avatar column ↔ text column
};

const avatarColStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "var(--space-2, 8px)",         // avatar ↔ counter pill
  flexShrink: 0,
};

const avatarImgStyle: React.CSSProperties = {
  width: AVATAR_SIZE,
  height: AVATAR_SIZE,
  objectFit: "contain",
};

const pillStyle: React.CSSProperties = {
  padding: "3px var(--space-2-5, 10px)",
  borderRadius: "var(--radius-full, 999px)",
  background: "var(--color-element-subtle, rgba(36, 36, 35, 0.10))",
  color: "var(--color-text-secondary, #6e6d6a)",
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-label-12-bd, 12px)",
  fontWeight: "var(--font-weight-label-12-bd, 700)" as React.CSSProperties["fontWeight"],
  whiteSpace: "nowrap",
};

const textColStyle: React.CSSProperties = {
  flex: "1 1 0",
  minWidth: 0,                        // lets long unbroken words wrap instead of overflowing
  display: "flex",
  flexDirection: "column",
  gap: "var(--space-1-5, 6px)",        // title ↔ body
};

const titleStyle: React.CSSProperties = {
  color: "var(--color-text-primary, #242423)",
  fontFamily: FONT_HEADING,
  fontSize: TITLE_SIZE,
  fontWeight: TITLE_WEIGHT,
};

const bodyStyle: React.CSSProperties = {
  color: BODY_COLOR,
  fontFamily: FONT_BODY,
  fontSize: "var(--font-size-body-13, 13px)",
  fontWeight: "var(--font-weight-body-13, 400)" as React.CSSProperties["fontWeight"],
  lineHeight: "18.85px",
};

const actionRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "var(--space-2, 8px)",         // Skip ↔ Next
};

// Figma's 36px button carries a 15px label, while Btn's `sm` size (also 36px
// tall) uses --font-size-btn-sm (12px). Override to the 15px button token.
const actionStyle: React.CSSProperties = {
  fontSize: "var(--font-size-btn-lg, 15px)",
  lineHeight: "20px",
};

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export interface CoachTipItem {
  id: string;
  title: string;
  body: React.ReactNode;
  /** Per-tip avatar. Falls back to the sequence-level `avatarSrc`. */
  avatarSrc?: string;
}

export interface CoachTipCardProps {
  title: string;
  body: React.ReactNode;
  /** Image for the 44×44 slot. Ignored when `avatar` is supplied. */
  avatarSrc?: string;
  /** Replaces the 44×44 slot (e.g. an icon). Pass `null` to drop it entirely. */
  avatar?: React.ReactNode;
  /** Pill text under the avatar, e.g. "Tip 2/7". Omit to hide the pill. */
  counter?: string;
  onSkip?: () => void;
  onNext?: () => void;
  skipLabel?: string;
  nextLabel?: string;
  /** Hides Skip — for flows the user must finish. Also disables Escape-to-skip. */
  hideSkip?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

export interface CoachTipsProps {
  tips: CoachTipItem[];
  /** Controlled step index. Out-of-range renders nothing. Omit for internal state. */
  step?: number;
  /** Initial step when uncontrolled. */
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  /** Skip pressed (or Escape) — the user opted out before the end. */
  onSkip?: () => void;
  /** Next pressed on the final tip. */
  onComplete?: () => void;
  /** Default avatar for every tip without its own `avatarSrc`. */
  avatarSrc?: string;
  avatar?: React.ReactNode;
  skipLabel?: string;
  nextLabel?: string;
  /** Label for the primary action on the final tip. */
  doneLabel?: string;
  /** Show the "Tip n/total" pill. Default true. */
  showCounter?: boolean;
  hideSkip?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   CoachTipCard — one tip
═══════════════════════════════════════════════════════ */

export function CoachTipCard({
  title,
  body,
  avatarSrc = defaultAvatar,
  avatar,
  counter,
  onSkip,
  onNext,
  skipLabel = "Skip",
  nextLabel = "Next",
  hideSkip = false,
  style,
  className,
}: CoachTipCardProps) {
  const uid = useId();
  const titleId = `${uid}-title`;
  const bodyId = `${uid}-body`;
  const counterId = `${uid}-counter`;

  return (
    <div
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={counter ? `${counterId} ${bodyId}` : bodyId}
      className={className}
      style={style ? { ...cardStyle, ...style } : cardStyle}
      onKeyDown={(e) => {
        if (e.key === "Escape" && !hideSkip && onSkip) {
          e.stopPropagation();
          onSkip();
        }
      }}
    >
      {/* ── Avatar + counter | title + body ───────────────── */}
      {/* aria-live so advancing the sequence announces the new tip */}
      <div style={topRowStyle} aria-live="polite">
        <div style={avatarColStyle}>
          {avatar !== undefined ? avatar : <img src={avatarSrc} alt="" style={avatarImgStyle} />}
          {counter && <div id={counterId} style={pillStyle}>{counter}</div>}
        </div>

        <div style={textColStyle}>
          <div id={titleId} style={titleStyle}>{title}</div>
          <div id={bodyId} style={bodyStyle}>{body}</div>
        </div>
      </div>

      {/* ── Actions ───────────────────────────────────────── */}
      <div style={actionRowStyle}>
        {!hideSkip && (
          <Btn variant="secondary-ghost" size="sm" style={actionStyle} onClick={onSkip}>
            {skipLabel}
          </Btn>
        )}
        <Btn variant="default" size="sm" style={actionStyle} onClick={onNext}>
          {nextLabel}
        </Btn>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CoachTips — sequence controller
═══════════════════════════════════════════════════════ */

export function CoachTips({
  tips,
  step,
  defaultStep = 0,
  onStepChange,
  onSkip,
  onComplete,
  avatarSrc,
  avatar,
  nextLabel = "Next",
  doneLabel = "Done",
  showCounter = true,
  ...rest
}: CoachTipsProps) {
  const [internalStep, setInternalStep] = useState(defaultStep);
  const current = step ?? internalStep;
  const tip = tips[current];

  if (!tip) return null;

  const isLast = current === tips.length - 1;

  const handleNext = () => {
    if (isLast) return onComplete?.();
    if (step === undefined) setInternalStep(current + 1);
    onStepChange?.(current + 1);
  };

  return (
    <CoachTipCard
      {...rest}
      title={tip.title}
      body={tip.body}
      avatarSrc={tip.avatarSrc ?? avatarSrc}
      avatar={avatar}
      counter={showCounter ? `Tip ${current + 1}/${tips.length}` : undefined}
      nextLabel={isLast ? doneLabel : nextLabel}
      onSkip={onSkip}
      onNext={handleNext}
    />
  );
}
