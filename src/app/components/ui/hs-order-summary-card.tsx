import React, { useCallback, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Ppvr } from "./hs-ppvr";
import { Sep } from "./hs-sep";

/*
  hs-order-summary-card — Checkout order summary panel

  OrderSummaryCard
  · Optional top dropdown: labelled pill trigger that expands a card-item list
  · Shipping section: heading + price, address lines, shipping method — each with optional Change action
  · Order breakdown section: section label, line items, subtotal, taxes, total (H5 size)
*/

/* ─── Private: bordered section card ────────────────────────── */

function SectionCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      gap:           "var(--space-4)",
      padding:       "var(--space-4)",
      borderRadius:  "var(--radius-3xl)",
      border:        "1px solid var(--color-element-subtle)",
      width:         "100%",
      boxSizing:     "border-box",
    }}>
      {children}
    </div>
  );
}

/* ─── Private: card items dropdown ──────────────────────────── */

export interface CardItem {
  /** Small type label (e.g. `"Printed"`). */
  type?: string;
  /** Card name (e.g. `"Anniversary Card"`). */
  name: string;
  /** Quantity label (e.g. `"5 Cards"`). */
  quantity: string;
  /** Price string (e.g. `"$3.45x5"`). */
  price: string;
  /** Optional thumbnail image URL. Falls back to a gray card placeholder. */
  thumbnail?: string;
}

function CardThumbnail({ src }: { src?: string }) {
  return (
    <div style={{
      width:          40,
      height:         40,
      flexShrink:     0,
      display:        "flex",
      alignItems:     "center",
      justifyContent: "center",
      overflow:       "hidden",
    }}>
      {src
        ? <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        : <div style={{
            width:        26,
            height:       37,
            borderRadius: 2,
            background:   "var(--color-text-secondary)",
            opacity:      0.35,
          }} />
      }
    </div>
  );
}

function CardItemRow({ item }: { item: CardItem }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display:      "flex",
        alignItems:   "center",
        gap:          6,
        background:   hovered ? "var(--color-state-hover)" : "transparent",
        transition:   "background 0.12s ease",
        margin:       "0 calc(var(--space-3) * -1)",
        padding:      "var(--space-2) var(--space-3)",
      }}
    >
      <CardThumbnail src={item.thumbnail} />
      <div style={{
        flex:       1,
        minWidth:   0,
        display:    "flex",
        alignItems: "center",
        gap:        "var(--space-3)",
        overflow:   "hidden",
        whiteSpace: "nowrap",
      }}>
        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
          {item.type && (
            <span style={{
              fontSize:   "var(--font-size-label-12)",
              fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-secondary)",
              lineHeight: "18px",
            }}>
              {item.type}
            </span>
          )}
          <span style={{
            fontSize:     "var(--font-size-label-sb-15)",
            fontWeight:   "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            color:        "var(--color-text-primary)",
            lineHeight:   "normal",
            overflow:     "hidden",
            textOverflow: "ellipsis",
          }}>
            {item.name}
          </span>
        </div>
        <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", gap: 2, textAlign: "right" }}>
          <span style={{
            fontSize:   "var(--font-size-label-12)",
            fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-secondary)",
            lineHeight: "18px",
          }}>
            {item.quantity}
          </span>
          <span style={{
            fontSize:   "var(--font-size-body-15)",
            fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            lineHeight: "var(--space-5)",
          }}>
            {item.price}
          </span>
        </div>
      </div>
    </div>
  );
}

function CardItemsDropdown({
  sectionLabel,
  summaryText,
  items,
}: {
  sectionLabel: string;
  summaryText: string;
  items: CardItem[];
}) {
  const [hovered,  setHovered]  = useState(false);
  const [pressed,  setPressed]  = useState(false);
  const [focused,  setFocused]  = useState(false);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", width: "100%" }}>
      <span style={{
        fontSize:   "var(--font-size-label-sb-15)",
        fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
        color:      "var(--color-text-primary)",
        lineHeight: "normal",
      }}>
        {sectionLabel}
      </span>

      <Ppvr
        style={{ width: "100%" }}
        contentStyle={{
          left:          0,
          right:         0,
          top:           "calc(100% + var(--space-2))",
          zIndex:        10,
          display:       "flex",
          flexDirection: "column",
          gap:           "var(--space-2)",
          padding:       "var(--space-3)",
          borderRadius:  "var(--radius-xl)",
          border:        "1px solid var(--color-element-subtle)",
          background:    "var(--color-bg-menus)",
          boxShadow:     "0px 4px 12px rgba(0,0,0,0.12)",
          minWidth:      "unset",
        }}
        trigger={
          <button
            type="button"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => { setHovered(false); setPressed(false); }}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              display:      "flex",
              alignItems:   "center",
              gap:          "var(--space-2)",
              width:        "100%",
              padding:      "var(--space-3)",
              borderRadius: "var(--radius-full)",
              border:       "1px solid var(--color-element-subtle)",
              background:   pressed
                ? "var(--color-state-pressed)"
                : hovered
                ? "var(--color-state-hover)"
                : "var(--color-bg-main)",
              cursor:       "pointer",
              textAlign:    "left",
              outline:      focused ? "2px solid var(--color-ring)" : "none",
              outlineOffset: 2,
              transition:   "background 0.12s ease",
            }}
          >
            <span style={{
              flex:         1,
              minWidth:     0,
              overflow:     "hidden",
              textOverflow: "ellipsis",
              whiteSpace:   "nowrap",
              fontSize:     "var(--font-size-body-15)",
              fontWeight:   "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
              color:        "var(--color-text-secondary)",
              lineHeight:   "var(--space-5)",
            }}>
              {summaryText}
            </span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" style={{ flexShrink: 0 }}>
              <path d="M4 6l4 4 4-4" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        }
      >
        {items.map((item, i) => (
          <React.Fragment key={i}>
            {i > 0 && <Sep orientation="horizontal" />}
            <CardItemRow item={item} />
          </React.Fragment>
        ))}
      </Ppvr>
    </div>
  );
}

/* ─── Private: label + price row ─────────────────────────────── */

function LineRow({
  label,
  value,
  size = "body",
}: {
  label: React.ReactNode;
  value: string;
  size?: "body" | "h5";
}) {
  const isH5 = size === "h5";
  const sharedStyle: React.CSSProperties = {
    fontSize:   isH5 ? "var(--font-size-h5)" : "var(--font-size-body-15)",
    fontWeight: isH5
      ? ("var(--font-weight-h5)" as React.CSSProperties["fontWeight"])
      : ("var(--font-weight-body-15)" as React.CSSProperties["fontWeight"]),
    color:      "var(--color-text-primary)",
    lineHeight: isH5 ? "var(--space-7)" : "var(--space-5)",
  };

  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--space-4)", width: "100%" }}>
      <span style={{ flex: 1, minWidth: 0, ...sharedStyle }}>{label}</span>
      <span style={{ flexShrink: 0, whiteSpace: "nowrap", ...sharedStyle }}>{value}</span>
    </div>
  );
}

/* ─── Animation constants (module-level — not re-created per render) ─── */

const springBounce = { type: "spring", stiffness: 380, damping: 20, mass: 0.9 } as const;
const quickFade    = { duration: 0.1,  ease: "easeIn" }                          as const;

/* ── Change link button ──────────────────────────────────────── */

const changeBtnStyle: React.CSSProperties = {
  flexShrink: 0,
  background: "none",
  border:     "none",
  padding:    0,
  cursor:     "pointer",
  fontSize:   "var(--font-size-body-15)",
  fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
  color:      "var(--color-brand-primary)",
  lineHeight: "var(--space-5)",
  whiteSpace: "nowrap",
};

/* ─── Private: hide-details nav-link button ──────────────────── */

function HideDetailsBtn({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background:   hovered ? "var(--color-state-hover)" : "none",
        border:       "none",
        cursor:       "pointer",
        fontSize:     "var(--font-size-body-13)",
        color:        hovered ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        padding:      "var(--space-1) var(--space-2)",
        borderRadius: "var(--radius-md)",
        fontFamily:   "inherit",
        transition:   "background 0.12s ease, color 0.12s ease",
      }}
    >
      Hide details
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════
   OrderSummaryCard
══════════════════════════════════════════════════════════════ */

export interface OrderSummaryCardProps {
  /**
   * Summary columns shown in the mobile collapsed bar (e.g. Cards, Shipping, Subtotal, Taxes).
   * Each item has a `label` (label-12, secondary) and `value` (body-15, primary).
   * When omitted the collapsed bar is hidden and the full card always renders.
   */
  mobileSummary?: Array<{ label: string; value: string }>;
  /** Label above the card-items trigger (e.g. `"Cards"`). Shown only when `cardItems` is provided. */
  cardSectionLabel?: string;
  /** Pill trigger summary text (e.g. `"$3.45x30 cards printing (6 different cards)"`). */
  cardSummaryText?: string;
  /** When provided, renders an expandable card-items dropdown at the top of the panel. */
  cardItems?: CardItem[];
  /** Shipping section heading. Defaults to `"Shipping Address"`. */
  shippingTitle?: string;
  /** Price shown beside the shipping heading (e.g. `"$3.50"`). */
  shippingPrice?: string;
  /** Address lines rendered top-to-bottom (name, street, city/state/zip). */
  addressLines?: string[];
  /** Shipping method name (e.g. `"Economy shipping (untracked)"`). */
  shippingMethod?: string;
  /** Estimated delivery window (e.g. `"Mon 2/1 – 2/5"`). */
  shippingEstimate?: string;
  /** Called when the user clicks "Change" beside the address. Hidden when omitted. */
  onChangeAddress?: () => void;
  /** Called when the user clicks "Change" beside the shipping method. Hidden when omitted. */
  onChangeShipping?: () => void;
  /** Label above the order line items (e.g. `"CURRENT"`). */
  sectionLabel?: string;
  /** Line items above the subtotal separator. */
  lineItems?: Array<{ label: string; price: string }>;
  /** Subtotal string (e.g. `"$13.44"`). */
  subtotal?: string;
  /** Taxes string (e.g. `"$0.00"`). */
  taxes?: string;
  /** Total shown at H5 size (e.g. `"$13.44"`). */
  total?: string;
  style?: React.CSSProperties;
  className?: string;
}

export function OrderSummaryCard({
  mobileSummary,
  cardSectionLabel = "Cards",
  cardSummaryText  = "",
  cardItems,
  shippingTitle    = "Shipping Address",
  shippingPrice,
  addressLines     = ["Jane Smith", "123 Main Street", "San Francisco, CA 94102-1234"],
  shippingMethod   = "Economy shipping (untracked)",
  shippingEstimate = "Mon 2/1 – 2/5",
  onChangeAddress,
  onChangeShipping,
  sectionLabel     = "CURRENT",
  lineItems        = [
    { label: "1x Cards",      price: "$6.99" },
    { label: "1x Super Card", price: "$3.00" },
    { label: "Shipping",      price: "$3.45" },
  ],
  subtotal = "$13.44",
  taxes    = "$0.00",
  total    = "$13.44",
  style,
  className,
}: OrderSummaryCardProps) {
  const [isMobile,      setIsMobile]      = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const roRef   = useRef<ResizeObserver | null>(null);

  const setRootRef = useCallback((el: HTMLDivElement | null) => {
    (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    roRef.current?.disconnect();
    if (!el) return;
    roRef.current = new ResizeObserver(([entry]) => {
      setIsMobile(entry.contentRect.width < 480);
    });
    roRef.current.observe(el);
  }, []);

  const showCollapsed = isMobile && !!mobileSummary;

  return (
    <motion.div
      ref={setRootRef as React.Ref<HTMLDivElement>}
      layout
      transition={springBounce}
      style={{
        display:       "flex",
        flexDirection: "column",
        alignItems:    "flex-start",
        gap:           "var(--space-4)",
        width:         "100%",
        ...style,
      }}
      className={className}
    >
      <AnimatePresence mode="wait">

      {/* ── Mobile collapsed summary bar ──────────────────────── */}
      {showCollapsed && !mobileExpanded && (
        <motion.button
          key="collapsed"
          initial={{ opacity: 0, y: -14 }}
          animate={{ opacity: 1, y: 0, transition: springBounce }}
          exit={{ opacity: 0, y: -8, transition: quickFade }}
          type="button"
          onClick={() => setMobileExpanded(v => !v)}
          style={{
            display:       "flex",
            flexDirection: "column",
            gap:           "var(--space-3)",
            padding:       "var(--space-4)",
            borderRadius:  "var(--radius-3xl)",
            border:        "1px solid var(--color-element-subtle)",
            background:    "var(--color-bg-main)",
            cursor:        "pointer",
            width:         "100%",
            textAlign:     "left",
          }}
        >
          {/* Summary columns */}
          <div style={{ display: "flex", justifyContent: "space-between", gap: "var(--space-4)", whiteSpace: "nowrap" }}>
            {mobileSummary!.map((col, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                <span style={{
                  fontSize:   "var(--font-size-label-12)",
                  fontWeight: "var(--font-weight-label-12)" as React.CSSProperties["fontWeight"],
                  color:      "var(--color-text-secondary)",
                  lineHeight: "18px",
                }}>
                  {col.label}
                </span>
                <span style={{
                  fontSize:   "var(--font-size-body-15)",
                  fontWeight: "var(--font-weight-body-15)" as React.CSSProperties["fontWeight"],
                  color:      "var(--color-text-primary)",
                  lineHeight: "var(--space-5)",
                }}>
                  {col.value}
                </span>
              </div>
            ))}
          </div>

          <Sep orientation="horizontal" />

          {/* Total row + chevron */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--space-4)" }}>
            <span style={{
              fontSize:   "var(--font-size-label-15)",
              fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-primary)",
              lineHeight: "var(--space-5)",
            }}>
              Total
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
              <span style={{
                fontSize:   "var(--font-size-label-15)",
                fontWeight: "var(--font-weight-label-15)" as React.CSSProperties["fontWeight"],
                color:      "var(--color-text-primary)",
                lineHeight: "var(--space-5)",
                whiteSpace: "nowrap",
              }}>
                {total}
              </span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"
                style={{ flexShrink: 0, transition: "transform 0.2s ease", transform: mobileExpanded ? "rotate(180deg)" : "rotate(0deg)" }}
              >
                <path d="M4 6l4 4 4-4" stroke="var(--color-text-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </motion.button>
      )}

      {/* ── Full content (always on desktop, toggle on mobile) ── */}
      {(!showCollapsed || mobileExpanded) && (
        <motion.div
          key="expanded"
          initial={showCollapsed ? { opacity: 0, y: -16 } : false}
          animate={{ opacity: 1, y: 0, transition: springBounce }}
          exit={{ opacity: 0, y: -10, transition: quickFade }}
          style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", width: "100%" }}
        >
          {/* ── Card items dropdown (optional) ─────────────────── */}
          {cardItems && (
            <CardItemsDropdown
              sectionLabel={cardSectionLabel}
              summaryText={cardSummaryText}
              items={cardItems}
            />
          )}

          {/* ── Shipping section ──────────────────────────────── */}
      <SectionCard>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>

          {/* Heading row */}
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            gap:            "var(--space-4)",
          }}>
            <span style={{
              fontSize:   "var(--font-size-label-sb-15)",
              fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
              color:      "var(--color-text-primary)",
              lineHeight: 1,
            }}>
              {shippingTitle}
            </span>
            {shippingPrice && (
              <span style={{
                flexShrink: 0,
                whiteSpace: "nowrap",
                fontSize:   "var(--font-size-label-sb-15)",
                fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
                color:      "var(--color-text-primary)",
                lineHeight: 1,
              }}>
                {shippingPrice}
              </span>
            )}
          </div>

          {/* Address + shipping method */}
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>

            {/* Address row */}
            <div style={{
              display:        "flex",
              alignItems:     "flex-start",
              justifyContent: "space-between",
              gap:            "var(--space-1)",
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {addressLines.map((line, i) => (
                  <span key={i} style={{
                    fontSize:   "var(--font-size-body-13)",
                    fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
                    color:      "var(--color-text-secondary)",
                    lineHeight: "normal",
                  }}>
                    {line}
                  </span>
                ))}
              </div>
              {onChangeAddress && (
                <button type="button" onClick={onChangeAddress} style={changeBtnStyle}>
                  Change
                </button>
              )}
            </div>

            {/* Shipping method row */}
            <div style={{
              display:        "flex",
              alignItems:     "flex-start",
              justifyContent: "space-between",
              gap:            "var(--space-1)",
            }}>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {shippingMethod && (
                  <span style={{
                    fontSize:   "var(--font-size-body-13)",
                    fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
                    color:      "var(--color-text-secondary)",
                    lineHeight: "normal",
                    whiteSpace: "nowrap",
                  }}>
                    {shippingMethod}
                  </span>
                )}
                {shippingEstimate && (
                  <span style={{
                    fontSize:   "var(--font-size-body-13)",
                    fontWeight: "var(--font-weight-body-13)" as React.CSSProperties["fontWeight"],
                    color:      "var(--color-text-secondary)",
                    lineHeight: "normal",
                    whiteSpace: "nowrap",
                  }}>
                    {shippingEstimate}
                  </span>
                )}
              </div>
              {onChangeShipping && (
                <button type="button" onClick={onChangeShipping} style={changeBtnStyle}>
                  Change
                </button>
              )}
            </div>

          </div>
        </div>
      </SectionCard>

      {/* ── Order breakdown ───────────────────────────────────── */}
      <SectionCard>
        {sectionLabel && (
          <p style={{
            margin:     0,
            fontSize:   "var(--font-size-label-sb-15)",
            fontWeight: "var(--font-weight-label-sb-15)" as React.CSSProperties["fontWeight"],
            color:      "var(--color-text-primary)",
            lineHeight: "normal",
            width:      "100%",
          }}>
            {sectionLabel}
          </p>
        )}

        {lineItems.map((item, i) => (
          <LineRow key={i} label={item.label} value={item.price} />
        ))}

        <Sep orientation="horizontal" />

        <LineRow label="Subtotal" value={subtotal} />
        <LineRow label="Taxes" value={taxes} />

        <Sep orientation="horizontal" />

        <LineRow label="Total" value={total} size="h5" />
      </SectionCard>

          {/* ── Hide details (mobile expanded only) ────────────── */}
          {showCollapsed && mobileExpanded && (
            <div style={{ display: "flex", justifyContent: "center" }}>
              <HideDetailsBtn onClick={() => setMobileExpanded(false)} />
            </div>
          )}
        </motion.div>
      )}
      </AnimatePresence>
    </motion.div>
  );
}
