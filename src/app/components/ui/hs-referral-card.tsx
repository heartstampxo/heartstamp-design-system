import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import hsCoinImg from "../../../assets/hs-coin.png";
import { EASE } from "./hs-motion-utils";

const SPRING = { stiffness: 120, damping: 18, mass: 0.8 };

export interface ReferralCardProps {
  /** Card heading. Defaults to "Share the love". */
  title?: string;
  /** Body copy below the title. */
  description?: string;
  /** The user's unique referral code, shown as `hsxo.ai/r/{code}`. */
  referralCode?: string;
  /** Called after the referral link is copied to the clipboard. */
  onCopyLink?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

export function ReferralCard({
  title        = "Share the love",
  description  = "Invite a friend or family member into the hyperpersonalization movement. When they complete their first purchase, you'll receive 200 Heart credits plus a digital 3D card or invite voucher.",
  referralCode = "YOUR_CODE",
  onCopyLink,
  style,
  className,
}: ReferralCardProps) {
  const [copied, setCopied] = useState(false);
  const referralUrl = `hsxo.ai/r/${referralCode}`;
  const inputRef    = useRef<HTMLInputElement>(null);

  /* ── Parallax motion values ──────────────────────────────── */
  const rawX = useMotionValue(0); // -0.5 … 0.5 (normalised)
  const rawY = useMotionValue(0);
  const x    = useSpring(rawX, SPRING);
  const y    = useSpring(rawY, SPRING);

  /* Coin 1 — foreground (sharp, large) → most movement */
  const c1x = useTransform(x, v => v * 22);
  const c1y = useTransform(y, v => v * 22);

  /* Coin 2 — mid-ground (slight blur) → medium movement */
  const c2x = useTransform(x, v => v * 12);
  const c2y = useTransform(y, v => v * 12);

  /* Coin 3 — background (heavy blur) → least movement */
  const c3x = useTransform(x, v => v * 6);
  const c3y = useTransform(y, v => v * 6);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - rect.left)  / rect.width  - 0.5);
    rawY.set((e.clientY - rect.top)   / rect.height - 0.5);
  }

  function handleMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  async function handleCopy() {
    const value = inputRef.current?.value ?? referralUrl;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(value);
      } else {
        inputRef.current?.select();
        document.execCommand("copy");
      }
    } catch { /* silent fail */ }
    setCopied(true);
    onCopyLink?.();
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        background: "var(--color-brand-primary-pressed)",
        borderRadius: "var(--radius-3xl)",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {/* ── Hero ─────────────────────────────────────────────── */}
      <div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "var(--space-8)",
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        {/* Text block */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.1 }}
          style={{
            position: "relative",
            zIndex: 1,
            flexShrink: 0,
            width: 223,
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3-5)",
            color: "var(--color-text-on-primary)",
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: "var(--font-family-heading)",
              fontSize: "var(--font-size-subheadline)",
              fontWeight: "var(--font-weight-h3)" as React.CSSProperties["fontWeight"],
              lineHeight: "28px",
              letterSpacing: "var(--letter-spacing-h4)",
              whiteSpace: "nowrap",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-body-15)",
              fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
              lineHeight: "20px",
            }}
          >
            {description}
          </p>
        </motion.div>

        {/* Coin 1 — foreground, large, sharpest */}
        <motion.img
          src={hsCoinImg}
          alt=""
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 304,
            height: 307,
            left: 250,
            top: -53,
            objectFit: "cover",
            pointerEvents: "none",
            x: c1x,
            y: c1y,
          }}
        />

        {/* Coin 2 — mid-ground, rotated, soft blur */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 249,
            height: 250,
            left: 199,
            top: 90,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            x: c2x,
            y: c2y,
          }}
        >
          <div style={{ transform: "rotate(45.69deg)" }}>
            <img
              src={hsCoinImg}
              alt=""
              style={{ width: 176, height: 177, objectFit: "cover", filter: "blur(1.5px)" }}
            />
          </div>
        </motion.div>

        {/* Coin 3 — background, small, heavily blurred */}
        <motion.div
          aria-hidden="true"
          style={{
            position: "absolute",
            width: 117,
            height: 118,
            left: 382,
            top: -25,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            x: c3x,
            y: c3y,
          }}
        >
          <div style={{ transform: "rotate(1.15deg)" }}>
            <img
              src={hsCoinImg}
              alt=""
              style={{ width: 115, height: 116, objectFit: "cover", filter: "blur(4px)" }}
            />
          </div>
        </motion.div>
      </div>

      {/* ── Separator ────────────────────────────────────────── */}
      <div style={{ height: 1, background: "rgba(255,255,255,0.2)" }} />

      {/* ── Referral link ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.28 }}
        style={{
          padding: "var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-2)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-size-label-sb-15)",
            fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            lineHeight: "normal",
            color: "var(--color-text-on-primary)",
          }}
        >
          Your referral link
        </p>

        {/* Link row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "var(--radius-button)",
            paddingLeft: "var(--space-4)",
            paddingRight: "var(--space-4)",
            paddingTop: "var(--space-3)",
            paddingBottom: "var(--space-3)",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          <input
            ref={inputRef}
            readOnly
            value={referralUrl}
            style={{
              all: "unset",
              flex: "1 0 0",
              fontSize: "var(--font-size-body-15)",
              fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
              lineHeight: "20px",
              color: "var(--color-text-on-primary)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              minWidth: 0,
              cursor: "default",
            }}
          />
          <button
            onClick={handleCopy}
            style={{
              all: "unset",
              flexShrink: 0,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "var(--space-5)",
              paddingLeft: "var(--space-1)",
              paddingRight: "var(--space-1)",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "var(--radius-sm)",
              fontSize: "var(--font-size-label-12)",
              fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-on-primary)",
              whiteSpace: "nowrap",
              transition: "opacity 150ms ease",
            }}
          >
            {copied ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
