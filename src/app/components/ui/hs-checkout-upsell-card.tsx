import React, { useCallback, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import stampyImg from "../../../assets/stampy/stampy-right-mascot.png";
import { Btn } from "./btn";
import { HSEmblem } from "./hs-logo";
import { Sep } from "./hs-sep";

/*
  hs-checkout-upsell-card — Promotional upsell card shown at checkout

  CheckoutUpsellCard
  · Red brand card with left text + CTA, right white order panel, Stampy mascot
  · Quantity stepper (controlled min/max) in the right panel
  · Primary CTA calls onAdd with current quantity; dismiss calls onDismiss
*/

/* ─── Private: quantity stepper ─────────────────────────────── */

function QuantityStepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const divider = (
    <div aria-hidden="true" style={{
      width: 1, flexShrink: 0, alignSelf: "stretch",
      background: "var(--color-element-subtle)",
    }} />
  );

  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      height:       36,
      width:        "100%",
      borderRadius: "var(--radius-full)",
      border:       "1px solid var(--color-element-subtle)",
      background:   "var(--color-bg-main)",
      overflow:     "hidden",
    }}>
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        style={{
          width:      36,
          height:     "100%",
          flexShrink: 0,
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border:     "none",
          cursor:     value <= min ? "default" : "pointer",
          opacity:    value <= min ? 0.35 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        <svg width="12" height="2" viewBox="0 0 12 2" fill="none" aria-hidden="true">
          <path d="M1 1h10" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>

      {divider}

      <span style={{
        flex:       1,
        textAlign:  "center",
        fontSize:   "var(--font-size-label-15)",
        fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
        color:      "var(--color-text-primary)",
        userSelect: "none",
      }}>
        {value}
      </span>

      {divider}

      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        style={{
          width:      36,
          height:     "100%",
          flexShrink: 0,
          display:    "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "transparent",
          border:     "none",
          cursor:     value >= max ? "default" : "pointer",
          opacity:    value >= max ? 0.35 : 1,
          transition: "opacity 0.15s ease",
        }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M6 1v10M1 6h10" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}


/* ══════════════════════════════════════════════════════════════
   CheckoutUpsellCard
══════════════════════════════════════════════════════════════ */

export interface CheckoutUpsellCardProps {
  /** Small pill label above the description. */
  badge?: string;
  /** Rich promotional description. Supports ReactNode for inline bold/emphasis. */
  description?: React.ReactNode;
  /** Primary CTA label. Pass a function to vary the label with the current quantity. */
  ctaLabel?: string | ((qty: number) => string);
  /** Called with the chosen quantity when the user clicks the CTA. */
  onAdd?: (quantity: number) => void;
  /** Dismiss button label. Defaults to `"No, thanks"`. */
  dismissLabel?: string;
  /** Called when the user clicks the dismiss button. */
  onDismiss?: () => void;
  /** Right panel heading. */
  orderTitle?: string;
  /** Right panel sub-label (e.g. quantity constraint hint). */
  orderSubtitle?: string;
  /** Minimum selectable quantity. Defaults to `1`. */
  minQty?: number;
  /** Maximum selectable quantity. Defaults to `3`. */
  maxQty?: number;
  /** Starting quantity. Defaults to `1`. */
  defaultQty?: number;
  /** Text before the emblem + "Credits" in the summary row. Pass a function to vary with quantity. */
  orderSummaryText?: string | ((qty: number) => string);
  /** Text after the emblem in the summary row. Defaults to `"Credits"`. */
  orderCreditsText?: string;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_DESCRIPTION: React.ReactNode = (
  <>
    The HeartStamp Supercard includes{" "}
    <strong>1,000 heart credits</strong>{" "}
    (5x the standard) and full access to all AI design tools. This premium
    package lets you fully personalize your artwork and messages, with{" "}
    <strong>one physical card mailed for you.</strong>
  </>
);

export function CheckoutUpsellCard({
  badge             = "Special Deal!",
  description       = DEFAULT_DESCRIPTION,
  ctaLabel          = (qty) => `Add ${qty} Supercard +$${qty * 3}`,
  onAdd,
  dismissLabel      = "No, thanks",
  onDismiss,
  orderTitle        = "Add Supercard to your order",
  orderSubtitle     = "Max 3 (matches eligible card in cart)",
  minQty            = 1,
  maxQty            = 3,
  defaultQty        = 1,
  orderSummaryText  = (qty: number) => `Card + ${(qty * 1000).toLocaleString()}`,
  orderCreditsText  = "Credits",
  style,
  className,
}: CheckoutUpsellCardProps) {
  const [qty, setQty] = useState(defaultQty);
  const [isMobile, setIsMobile] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const roRef   = useRef<ResizeObserver | null>(null);

  // Ref callback — attaches a ResizeObserver the moment the card mounts.
  // Responds to the card's own rendered width (not the viewport), so it
  // works correctly inside resized preview panels.
  const setCardRef = useCallback((el: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    roRef.current?.disconnect();
    if (!el) return;
    roRef.current = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < 560);
    });
    roRef.current.observe(el);
  }, []);
  const cta     = typeof ctaLabel         === "function" ? ctaLabel(qty)         : ctaLabel;
  const summary = typeof orderSummaryText  === "function" ? orderSummaryText(qty)  : orderSummaryText;

  const rawY = useMotionValue(0);
  const springY = useSpring(rawY, { stiffness: 40, damping: 18, mass: 1.2 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relY = (e.clientY - rect.top) / rect.height; // 0→1 top→bottom
    rawY.set((relY - 0.5) * 20);                       // ±10px range
  }, [rawY]);

  return (
    <div
      ref={setCardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => rawY.set(0)}
      style={{
        position:      "relative",
        display:       "flex",
        flexDirection: isMobile ? "column" : "row",
        alignItems:    isMobile ? "stretch" : "flex-start",
        gap:           isMobile ? "var(--space-4)" : "calc(var(--space-12) + var(--space-2))",
        padding:       "var(--space-5)",
        borderRadius:  "var(--radius-3xl)",
        background:    "var(--color-brand-primary-pressed)",
        overflow:      "hidden",
        ...style,
      }}
      className={className}
    >
      {/* ── Left column ────────────────────────────────────── */}
      <div style={{
        flex:          1,
        display:       "flex",
        flexDirection: "column",
        gap:           "var(--space-6)",
        minWidth:      0,
      }}>
        {/* Text content */}
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "var(--space-3)",
        }}>
          {badge && (
            <p style={{
              margin:     0,
              fontSize:   "var(--font-size-label-sb-15)",
              fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-on-primary)",
              lineHeight: 1,
            }}>
              {badge}
            </p>
          )}
          <p style={{
            margin:     0,
            fontSize:   "var(--font-size-body-15)",
            fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-on-primary)",
            lineHeight: "var(--space-5)",
          }}>
            {description}
          </p>
        </div>

        {/* CTA + dismiss */}
        <div style={{
          display:    "flex",
          alignItems: "center",
          gap:        "var(--space-4)",
          flexWrap:   "wrap",
        }}>
          <Btn variant="secondary" onClick={() => onAdd?.(qty)}>
            {cta}
          </Btn>

          <Btn
            variant="secondary-ghost"
            onClick={() => onDismiss?.()}
            style={{ color: "var(--color-text-on-primary)" }}
          >
            {dismissLabel}
          </Btn>
        </div>
      </div>

      {/* ── Right panel ────────────────────────────────────── */}
      <div style={{
        position:      "relative",
        zIndex:        1,
        flexShrink:    isMobile ? 1 : 0,
        alignSelf:     isMobile ? "stretch" : "center",
        width:         isMobile ? "100%" : 250,
        display:       "flex",
        flexDirection: "column",
        gap:           "var(--space-4)",
        padding:       "var(--space-5) var(--space-5) var(--space-4)",
        borderRadius:  "var(--radius-lg)",
        background:    "var(--color-bg-main)",
      }}>
        {/* Order section */}
        <div style={{
          display:       "flex",
          flexDirection: "column",
          gap:           "var(--space-2)",
        }}>
          {/* Order text */}
          <div style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "var(--space-1)",
            textAlign:     isMobile ? "center" : undefined,
          }}>
            <p style={{
              margin:     0,
              fontSize:   "var(--font-size-label-sb-15)",
              fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-primary)",
              lineHeight: 1.3,
            }}>
              {orderTitle}
            </p>
            <p style={{
              margin:     0,
              fontSize:   "var(--font-size-label-12)",
              fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-secondary)",
              lineHeight: 1.5,
            }}>
              {orderSubtitle}
            </p>
          </div>

          <QuantityStepper
            value={qty}
            min={minQty}
            max={maxQty}
            onChange={setQty}
          />
        </div>

        <Sep orientation="horizontal" />

        {/* Order summary */}
        <div style={{
          display:         "flex",
          alignItems:      "center",
          justifyContent:  isMobile ? "center" : undefined,
          gap:             "var(--space-1)",
          flexWrap:        "wrap",
        }}>
          <span style={{
            fontSize:   "var(--font-size-body-13)",
            fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            whiteSpace: "nowrap",
          }}>
            You get:
          </span>
          <span style={{
            fontSize:   "var(--font-size-body-13)",
            fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            whiteSpace: "nowrap",
          }}>
            {summary}
          </span>
          <HSEmblem color="brand" height={16} />
          <span style={{
            fontSize:   "var(--font-size-body-13)",
            fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            whiteSpace: "nowrap",
          }}>
            {orderCreditsText}
          </span>
        </div>
      </div>

      {/* ── Stampy mascot (desktop only) ───────────────────── */}
      {!isMobile && <motion.img
        src={stampyImg}
        alt=""
        aria-hidden="true"
        style={{
          position:   "absolute",
          right:      247,
          top:        "50%",
          y:          springY,
          translateY: "-50%",
          width:      98,
          height:     133,
          objectFit:  "contain",
          zIndex:     2,
          pointerEvents: "none",
          userSelect: "none",
        }}
      />}
    </div>
  );
}
