import React from "react";
import { motion } from "motion/react";
import { HSHeartIcon, HSSymbolOutlineIcon } from "./hs-logo";
import { Sep } from "./hs-sep";
import { Btn } from "./btn";
import { EASE, AnimatedCount } from "./hs-motion-utils";

function formatCount(n: number): string {
  if (n >= 1000) return `${n / 1000}k`;
  return String(n);
}

export interface WalletCreditItem {
  /** CSS colour or var() for the heart icon fill. e.g. `"var(--color-brand-primary)"`, `"#C4890A"` */
  heartFill: string;
  /** Numeric credit balance. Values ≥ 1000 are formatted as `Xk`. */
  count: number;
  /** Credit type label shown below the count. e.g. `"HeartStamp Credits"` */
  label: string;
  /** Secondary line below the label. e.g. `"Renew in 28 days"` */
  subtitle: string;
  /** Small pill badge. e.g. `"Plus"`, `"Lifetime"`, `"Promotional"` */
  badge: string;
}

export interface WalletVoucherItem {
  /** Voucher type label. e.g. `"Physical Cards"` */
  label: string;
  /** Voucher count, zero-padded to two digits in the UI. */
  count: number;
}

/** Displays a user's credit balances, a usage report link, and card voucher counts. */
export interface WalletCardProps {
  /** Credit rows to display. Defaults to HeartStamp, Gold, and Silver credits. */
  credits?: WalletCreditItem[];
  /** Section header above the voucher list. Defaults to `"Card Vouchers"`. */
  voucherLabel?: string;
  /** Voucher rows to display. Defaults to Physical Cards and Digital 3D Card. */
  vouchers?: WalletVoucherItem[];
  /** Called when the user taps "View Usage Report". */
  onViewUsageReport?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_CREDITS: WalletCreditItem[] = [
  {
    heartFill: "var(--color-brand-primary)",
    count: 200,
    label: "HeartStamp Credits",
    subtitle: "Renew in 28 days",
    badge: "Plus",
  },
  {
    heartFill: "#C4890A",
    count: 123,
    label: "Gold Credits",
    subtitle: "Never expire",
    badge: "Lifetime",
  },
  {
    heartFill: "#9B9996",
    count: 1000,
    label: "Silver Credits",
    subtitle: "Expiring in 150 days",
    badge: "Promotional",
  },
];

const DEFAULT_VOUCHERS: WalletVoucherItem[] = [
  { label: "Physical Cards", count: 3 },
  { label: "Digital 3D Card", count: 1 },
];

export function WalletCard({
  credits = DEFAULT_CREDITS,
  voucherLabel = "Card Vouchers",
  vouchers = DEFAULT_VOUCHERS,
  onViewUsageReport,
  style,
  className,
}: WalletCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        background: "var(--color-bg-main)",
        border: "1px solid var(--color-element-subtle)",
        borderRadius: "var(--radius-3xl)",
        overflow: "hidden",
        ...style,
      }}
      className={className}
    >
      {/* Credit rows */}
      {credits.map((credit, i) => {
        const rowDelay = 0.1 + i * 0.08;
        return (
          <React.Fragment key={credit.label}>
            {i > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: EASE, delay: rowDelay - 0.04 }}
                style={{ paddingLeft: "var(--space-6)", paddingRight: "var(--space-6)" }}
              >
                <Sep />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: rowDelay }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "var(--space-2)",
                paddingTop: "var(--space-6)",
                paddingBottom: "var(--space-6)",
                paddingLeft: "var(--space-6)",
                paddingRight: "var(--space-6)",
              }}
            >
              {/* Heart icon — spring bounce */}
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 380, damping: 14, delay: rowDelay + 0.08 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
              >
                <HSHeartIcon heartFill={credit.heartFill} size={32} />
              </motion.div>

              {/* Content: count + text + badge in a row */}
              <div
                style={{
                  flex: "1 0 0",
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  height: "42px",
                  minWidth: 0,
                }}
              >
                {/* Count */}
                <h3
                  style={{
                    margin: 0,
                    flexShrink: 0,
                    fontSize: "var(--font-size-h3)",
                    fontWeight: "var(--font-weight-h3)" as React.CSSProperties["fontWeight"],
                    letterSpacing: "var(--letter-spacing-h3)",
                    lineHeight: "42px",
                    color: "var(--color-text-primary)",
                    whiteSpace: "nowrap",
                  }}
                >
                  <AnimatedCount value={credit.count} delay={rowDelay + 0.1} format={formatCount} />
                </h3>

                {/* Label + subtitle stacked */}
                <div
                  style={{
                    flex: "1 0 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px",
                    alignItems: "flex-start",
                    justifyContent: "center",
                    minWidth: 0,
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--font-size-label-15)",
                      fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
                      color: "var(--color-text-primary)",
                      lineHeight: "20px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {credit.label}
                  </span>
                  <span
                    style={{
                      fontSize: "var(--font-size-body-13)",
                      fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
                      color: "var(--color-text-secondary)",
                      lineHeight: "normal",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {credit.subtitle}
                  </span>
                </div>

                {/* Badge */}
                <div
                  style={{
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "var(--space-6)",
                    paddingLeft: "var(--space-2)",
                    paddingRight: "var(--space-2)",
                    paddingTop: "var(--space-1)",
                    paddingBottom: "var(--space-1)",
                    background: "var(--color-bg-muted)",
                    borderRadius: "var(--radius-button)",
                  }}
                >
                  <span
                    style={{
                      fontSize: "var(--font-size-label-12)",
                      fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
                      color: "var(--color-text-primary)",
                      lineHeight: "18px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {credit.badge}
                  </span>
                </div>
              </div>
            </motion.div>
          </React.Fragment>
        );
      })}

      {/* View Usage Report */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.1 + credits.length * 0.08 + 0.08 }}
        style={{
          paddingTop: "var(--space-2)",
          paddingBottom: "var(--space-6)",
          paddingLeft: "var(--space-6)",
          paddingRight: "var(--space-6)",
        }}
      >
        <Btn variant="outline" size="xl" onClick={onViewUsageReport}>
          View Usage Report
        </Btn>
      </motion.div>

      <Sep />

      {/* Card Vouchers */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.1 + credits.length * 0.08 + 0.16 }}
        style={{
          padding: "var(--space-8) var(--space-6)",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-5)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "var(--font-size-body-13)",
            fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
            textTransform: "uppercase",
            letterSpacing: "0.06em",
            color: "var(--color-text-secondary)",
          }}
        >
          {voucherLabel}
        </p>
        {vouchers.map((voucher, i) => (
          <React.Fragment key={voucher.label}>
            {i > 0 && <Sep />}
            <div
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
            >
              <span
                style={{
                  fontSize: "var(--font-size-label-sb-15)",
                  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
                  color: "var(--color-text-primary)",
                }}
              >
                {voucher.label}
              </span>
              <span
                style={{
                  fontSize: "var(--font-size-label-sb-15)",
                  fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
                  color: "var(--color-text-primary)",
                  fontVariantNumeric: "tabular-nums",
                  minWidth: "2ch",
                  textAlign: "right",
                }}
              >
                {String(voucher.count).padStart(2, "0")}
              </span>
            </div>
          </React.Fragment>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ─── WalletPromoCard ──────────────────────────────────────── */

/** Promotional upsell card for wallet credit packages. */
export interface WalletPromoCardProps {
  /** Card heading. Defaults to `"Supercards"`. */
  title?: string;
  /** Body copy below the title. */
  description?: string;
  /** Bullet list of included features. */
  features?: string[];
  /** Price string shown in the CTA row. e.g. `"$11.99"` */
  price?: string;
  /** Label above the price. Defaults to `"Starting from"`. */
  priceLabel?: string;
  /** Corner badge text. Pass an empty string to hide. Defaults to `"Recommended"`. */
  badge?: string;
  /** Called when the user taps "Buy Now". */
  onBuyNow?: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const DEFAULT_FEATURES = [
  "1,000 heart credits — 5x our standard card",
  "1 premium physical card, mailed for you",
  "Every HeartStamp creative tool, unlocked",
];

export function WalletPromoCard({
  title       = "Supercards",
  description = "Same card. 5x the credits. With 1,000 heart credits per Supercard, you have room to design original artwork, rewrite messages a dozen ways, and personalize every detail with AI.",
  features    = DEFAULT_FEATURES,
  price       = "$11.99",
  priceLabel  = "Starting from",
  badge       = "Recommended",
  onBuyNow,
  style,
  className,
}: WalletPromoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: EASE }}
      style={{
        position: "relative",
        background: "var(--color-bg-main)",
        border: "1px solid var(--color-element-subtle)",
        borderRadius: "var(--radius-3xl)",
        padding: "var(--space-6)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-12)",
        ...style,
      }}
      className={className}
    >
      {/* Badge — top-right corner */}
      {badge && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35, ease: EASE, delay: 0.3 }}
          style={{
            position: "absolute",
            top: -1,
            right: -1,
            height: "var(--space-7)",
            paddingLeft: "var(--space-2)",
            paddingRight: "var(--space-3)",
            paddingTop: "var(--space-1)",
            paddingBottom: "var(--space-1)",
            background: "var(--color-state-hover)",
            borderTopRightRadius: "var(--radius-3xl)",
            borderBottomLeftRadius: "var(--radius-lg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span
            style={{
              fontSize: "var(--font-size-body-13)",
              fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            {badge}
          </span>
        </motion.div>
      )}

      {/* Card container — icon + content */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: EASE, delay: 0.08 }}
        style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}
      >
        {/* HS symbol icon */}
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 380, damping: 14, delay: 0.16 }}
          style={{ width: "var(--space-6)", height: "var(--space-6)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-text-primary)" }}
        >
          <HSSymbolOutlineIcon size={24} />
        </motion.div>

        {/* Text content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-h5)",
              fontWeight: "var(--font-weight-h2)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary)",
              lineHeight: "24px",
            }}
          >
            {title}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-body-15)",
              fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-secondary)",
              lineHeight: "20px",
            }}
          >
            {description}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-label-sb-15)",
              fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary)",
            }}
          >
            What's Included
          </p>
          <ul
            style={{
              margin: 0,
              paddingLeft: "var(--space-4)",
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-0)",
            }}
          >
            {features.map((feat) => (
              <li
                key={feat}
                style={{
                  fontSize: "var(--font-size-body-15)",
                  fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
                  color: "var(--color-text-secondary)",
                  lineHeight: "normal",
                }}
              >
                {feat}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Price + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.2 }}
        style={{ display: "flex", alignItems: "center", gap: "var(--space-10)" }}
      >
        <div style={{ flex: "1 0 0", display: "flex", flexDirection: "column", gap: "var(--space-1-5)", minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-label-15)",
              fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-secondary)",
              lineHeight: "20px",
            }}
          >
            {priceLabel}
          </p>
          <p
            style={{
              margin: 0,
              fontSize: "var(--font-size-label-15)",
              fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary)",
              lineHeight: "20px",
            }}
          >
            {price}
          </p>
        </div>
        <Btn variant="default" onClick={onBuyNow}>
          Buy Now
        </Btn>
      </motion.div>
    </motion.div>
  );
}
