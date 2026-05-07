import React from "react";
import { motion } from "motion/react";
import { Sep } from "./hs-sep";
import { EASE, AnimatedCount } from "./hs-motion-utils";

/* ── Types ─────────────────────────────────────────────────── */

export interface ContentCardStep {
  /** Step description text. */
  text: string;
}

export interface ContentCardMetric {
  /** Numeric value, animated on mount. */
  value: number;
  /** Label below the number. e.g. "Signed up" */
  label: string;
}

/** Explains the referral programme and shows the user's referral stats. */
export interface ContentCardProps {
  /** "How it works" section title. */
  howItWorksTitle?: string;
  /** Numbered step list. */
  steps?: ContentCardStep[];
  /** "Your referrals" section title. */
  referralsSectionTitle?: string;
  /** Metric boxes. */
  metrics?: ContentCardMetric[];
  style?: React.CSSProperties;
  className?: string;
}

/* ── Defaults ──────────────────────────────────────────────── */

const DEFAULT_STEPS: ContentCardStep[] = [
  { text: "Share your unique referral link with your friends and family" },
  { text: "They sign up and get 200 Heart credits to start" },
  { text: "When they place their first order, you earn 200 Heart credits + a free digital 3D card/invite (coming soon)" },
];

const DEFAULT_METRICS: ContentCardMetric[] = [
  { value: 3,   label: "Signed up"     },
  { value: 1,   label: "Converted"     },
  { value: 200, label: "Credits earned" },
];

/* ── Component ─────────────────────────────────────────────── */

export function ContentCard({
  howItWorksTitle      = "How it works",
  steps                = DEFAULT_STEPS,
  referralsSectionTitle = "Your referrals",
  metrics              = DEFAULT_METRICS,
  style,
  className,
}: ContentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        background: "var(--color-bg-main)",
        border: "1px solid var(--color-element-subtle)",
        borderRadius: "var(--radius-3xl)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-5)",
        ...style,
      }}
      className={className}
    >
      {/* ── How it works ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-4)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-size-label-sb-15)",
            fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            lineHeight: "24px",
            color: "var(--color-text-primary)",
          }}
        >
          {howItWorksTitle}
        </p>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "var(--space-3)",
          }}
        >
          {steps.map((step, i) => (
            <motion.div
              key={step.text}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, ease: EASE, delay: 0.14 + i * 0.07 }}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "var(--space-2)",
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  flexShrink: 0,
                  width: 17,
                  height: 17,
                  marginTop: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "var(--color-brand-secondary-dim)",
                  borderRadius: "var(--radius-full)",
                }}
              >
                <span
                  style={{
                    fontSize: "var(--font-size-body-13)",
                    fontWeight: "var(--font-weight-h1)" as React.CSSProperties["fontWeight"],
                    lineHeight: 1,
                    color: "var(--color-text-primary)",
                  }}
                >
                  {i + 1}
                </span>
              </div>

              {/* Step text */}
              <p
                style={{
                  margin: 0,
                  flex: "1 0 0",
                  fontSize: "var(--font-size-body-15)",
                  fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
                  lineHeight: "20px",
                  color: "var(--color-text-secondary)",
                  minWidth: 0,
                }}
              >
                {step.text}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Separator ──────────────────────────────────────── */}
      <Sep />

      {/* ── Your referrals ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.35 }}
        style={{
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
            lineHeight: "24px",
            color: "var(--color-text-primary)",
          }}
        >
          {referralsSectionTitle}
        </p>

        {/* Metric boxes */}
        <div
          style={{
            display: "flex",
            gap: "var(--space-3)",
          }}
        >
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.42 + i * 0.07 }}
              style={{
                flex: "1 0 0",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "var(--space-2)",
                padding: "var(--space-3)",
                border: "1px solid var(--color-element-subtle)",
                borderRadius: "var(--radius-lg)",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-family-heading)",
                  fontSize: "var(--font-size-h3)",
                  fontWeight: "var(--font-weight-h3)" as React.CSSProperties["fontWeight"],
                  letterSpacing: 0,
                  lineHeight: "42px",
                  color: "var(--color-text-primary)",
                }}
              >
                <AnimatedCount value={metric.value} delay={0.42 + i * 0.07} />
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-label-15)",
                  fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
                  lineHeight: "20px",
                  color: "var(--color-text-primary)",
                  whiteSpace: "nowrap",
                }}
              >
                {metric.label}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
