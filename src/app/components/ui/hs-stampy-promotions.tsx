import React, { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ThumbsDown, ThumbsUp, Heart, ChevronRight } from "lucide-react";
import { HSEmblem } from "./hs-logo";
import { Prg } from "./hs-prg";

/* ═══════════════════════════════════════════════════════
   Types
═══════════════════════════════════════════════════════ */

export type PromoSwipeDirection = "like" | "dislike" | "super";

export interface PromoCard {
  id: string;
  imageSrc: string;
  title: string;
}

export interface StampyPromotionsProps {
  cards?: PromoCard[];
  swipesUntilReward?: number;
  creditsEarned?: number;
  autoAdvanceSec?: number;
  onSwipe?: (card: PromoCard, dir: PromoSwipeDirection) => void;
  onClose?: () => void;
  renderInput?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

/* ═══════════════════════════════════════════════════════
   Demo Cards
═══════════════════════════════════════════════════════ */

const DEMO_CARDS: PromoCard[] = [
  { id: "1",  imageSrc: "", title: "Father's Day"    },
  { id: "2",  imageSrc: "", title: "Birthday"        },
  { id: "3",  imageSrc: "", title: "Anniversary"     },
  { id: "4",  imageSrc: "", title: "Thank You"       },
  { id: "5",  imageSrc: "", title: "Get Well Soon"   },
  { id: "6",  imageSrc: "", title: "Graduation"      },
  { id: "7",  imageSrc: "", title: "Valentine's Day" },
  { id: "8",  imageSrc: "", title: "Mother's Day"    },
  { id: "9",  imageSrc: "", title: "Thinking of You" },
  { id: "10", imageSrc: "", title: "Just Because"    },
];

// Decorative placeholder gradients for cards with no image.
// Colors are creative content, not UI tokens.
// Exception: index 8 references the brand primary via token.
const CARD_BG = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f5576c 0%, #f093fb 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)",
  "linear-gradient(135deg, var(--color-brand-primary, #be1d2c) 0%, #f5576c 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
];

// Decorative confetti colours — creative content, not UI tokens.
// First entry references brand primary via token.
const CONFETTI_PALETTE = [
  "var(--color-brand-primary, #be1d2c)",
  "#ff6b9d", "#ffd700", "#ff6b35", "#a8d8ea", "#c4b5fd", "#86efac",
];

// Figma card overlay: white 20% + black 30% layered.
// Fixed visual specification — not a configurable token.
const CARD_OVERLAY =
  "linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.2) 100%), " +
  "linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.3) 100%)";

// Swipe-hint overlay RGB channels — enables dynamic alpha in rgba().
// Corresponding full-colour tokens are in tokens.css:
//   --color-brand-primary-rgb, --color-state-success-rgb, --color-state-dislike-rgb
const HINT_SUPER_RGB   = "var(--color-brand-primary-rgb, 190, 29, 44)";
const HINT_LIKE_RGB    = "var(--color-state-success-rgb, 34, 197, 94)";
const HINT_DISLIKE_RGB = "var(--color-state-dislike-rgb, 239, 68, 68)";

// Figma-derived card geometry — layout constants, not design tokens.
const CARD_W      = 193;
const CARD_H      = 301;
const CARD_SLOT_L = 32;   // left offset shared by both card slots
const CARD_SLOT_T = 15;   // top offset shared by both card slots
const STAGE_W     = 228;  // card stage container width
const STAGE_H     = 340;  // card stage container height

// Back-card visual offset from front-card (computed from Figma).
const ENTER_X   = -17;
const ENTER_Y   = 5;
const ENTER_ROT = -10.56;

// Animation easing / distance constants.
const FLY_DISTANCE_X = 620;
const FLY_DISTANCE_Y = 660;

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

/* ═══════════════════════════════════════════════════════
   Floating Heart  (super-like particle)
═══════════════════════════════════════════════════════ */

interface FloatHeartProps {
  id: number;
  dx: number;
  sz: number;
  dy: number;
  dur: number;
  onDone: (id: number) => void;
}

function FloatHeart({ id, dx, sz, dy, dur, onDone }: FloatHeartProps) {
  // Random values computed once on mount via ref — stable across re-renders.
  const ex           = useRef(dx + (Math.random() - 0.5) * 70).current;
  const initRotate   = useRef(Math.random() * 30 - 15).current;
  const finalRotate  = useRef(Math.random() * 60 - 30).current;

  return (
    <motion.div
      initial={{ opacity: 1, y: 0, x: dx, scale: 0.4, rotate: initRotate }}
      animate={{ opacity: 0, y: -dy, x: ex, scale: 1.1, rotate: finalRotate }}
      transition={{ duration: dur, ease: "easeOut" }}
      onAnimationComplete={() => onDone(id)}
      style={{ position: "absolute", bottom: 80, left: "50%", pointerEvents: "none", zIndex: 20 }}
    >
      <Heart
        size={sz}
        fill="var(--color-brand-primary, #be1d2c)"
        color="var(--color-brand-primary, #be1d2c)"
      />
    </motion.div>
  );
}

function HeartBurst({ trigger }: { trigger: number }) {
  const hidRef = useRef(0);
  const [hearts, setHearts] = useState<FloatHeartProps[]>([]);

  useEffect(() => {
    if (!trigger) return;
    setHearts(p => [
      ...p,
      ...Array.from({ length: 14 }, () => ({
        id:  ++hidRef.current,
        dx:  (Math.random() - 0.5) * 110,
        sz:  14 + Math.random() * 14,
        dy:  150 + Math.random() * 90,
        dur: 1 + Math.random() * 0.5,
        onDone: () => {},  // overridden below
      })),
    ]);
  }, [trigger]);

  const remove = useCallback((id: number) => setHearts(p => p.filter(h => h.id !== id)), []);

  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 20 }}>
      <AnimatePresence>
        {hearts.map(h => <FloatHeart key={h.id} {...h} onDone={remove} />)}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Reward Confetti
═══════════════════════════════════════════════════════ */

function RewardConfetti({ active }: { active: boolean }) {
  const particles = useRef(
    Array.from({ length: 32 }, (_, i) => ({
      id:     i,
      x:      Math.random() * 100,
      color:  CONFETTI_PALETTE[i % CONFETTI_PALETTE.length],
      size:   5 + Math.random() * 5,
      delay:  i * 0.025,
      dur:    1.4 + Math.random() * 0.7,
      drift:  (Math.random() - 0.5) * 90,
      spin:   Math.random() > 0.5 ? 360 : -360,
      circle: Math.random() > 0.5,
    }))
  ).current;

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          key="conf"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 5 }}
        >
          {particles.map(p => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, y: -10, x: `${p.x}%`, rotate: 0 }}
              animate={{ opacity: 0, y: "110%", x: `calc(${p.x}% + ${p.drift}px)`, rotate: p.spin }}
              transition={{ duration: p.dur, delay: p.delay, ease: "easeIn" }}
              style={{
                position: "absolute", top: 0,
                width: p.size, height: p.size,
                borderRadius: p.circle ? "50%" : "var(--radius-xs, 4px)",
                background: p.color,
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ═══════════════════════════════════════════════════════
   Card Image
═══════════════════════════════════════════════════════ */

function CardImage({ src, idx, withOverlay }: { src: string; idx: number; withOverlay?: boolean }) {
  const topRadius = "var(--radius-lg, 8px) var(--radius-lg, 8px) 0 0";
  return (
    <>
      {src ? (
        <img
          src={src}
          alt=""
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            borderRadius: topRadius,
            pointerEvents: "none",
          }}
        />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: CARD_BG[idx % CARD_BG.length], borderRadius: topRadius }} />
      )}
      {withOverlay && (
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            backgroundImage: CARD_OVERLAY,
            borderRadius: topRadius,
            pointerEvents: "none",
          }}
        />
      )}
    </>
  );
}

/* ═══════════════════════════════════════════════════════
   Card Footer
═══════════════════════════════════════════════════════ */

function CardFooter({ title, isBack }: { title: string; isBack?: boolean }) {
  return (
    <div style={{
      borderTop: "1px solid var(--color-element-subtle, rgba(36,36,35,0.1))",
      display: "flex", alignItems: "center",
      gap: "var(--space-6, 24px)",
      padding: isBack
        ? "var(--space-2-5, 10px) var(--space-3, 12px)"
        : "var(--space-2-5, 10px) var(--space-4, 16px)",
      backgroundColor: "var(--color-bg-main, #ffffff)",
      flexShrink: 0, width: "100%", overflow: "hidden",
    }}>
      <span style={{
        flex: 1, minWidth: 0,
        fontSize: "var(--font-size-body-13-bd, 13px)",
        fontWeight: "var(--font-weight-body-13-bd, 700)" as React.CSSProperties["fontWeight"],
        color: "var(--color-text-primary, #242423)",
        lineHeight: 1,
        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
      }}>
        {title}
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: "var(--space-1-5, 6px)", flexShrink: 0 }}>
        <span style={{
          fontSize: "var(--font-size-body-13-bd, 13px)",
          fontWeight: "var(--font-weight-body-13-bd, 700)" as React.CSSProperties["fontWeight"],
          color: "var(--color-brand-primary, #be1d2c)",
          lineHeight: 1, whiteSpace: "nowrap",
        }}>
          Inside
        </span>
        <ChevronRight size={14} color="var(--color-brand-primary, #be1d2c)" />
      </span>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Swipe Direction Hint Overlay
   progress: -1..1  (like / dislike)
   superProgress: 0..1
═══════════════════════════════════════════════════════ */

function SwipeHint({ progress, superProgress }: { progress: number; superProgress: number }) {
  const isSuper   = superProgress > 0.25;
  const isLike    = !isSuper && progress > 0.25;
  const isDislike = !isSuper && progress < -0.25;
  if (!isLike && !isDislike && !isSuper) return null;

  const alpha = Math.min(1, isSuper ? superProgress : Math.abs(progress));

  const bg = isSuper
    ? `rgba(${HINT_SUPER_RGB}, ${alpha * 0.15})`
    : isLike
      ? `rgba(${HINT_LIKE_RGB}, ${alpha * 0.15})`
      : `rgba(${HINT_DISLIKE_RGB}, ${alpha * 0.15})`;

  return (
    <div style={{
      position: "absolute", inset: 0,
      borderRadius: "var(--radius-lg, 8px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      background: bg,
      zIndex: 3, pointerEvents: "none",
    }}>
      {isSuper && (
        <Heart
          size={52}
          fill="var(--color-brand-primary, #be1d2c)"
          color="var(--color-brand-primary, #be1d2c)"
          style={{ opacity: alpha }}
        />
      )}
      {isLike && (
        <ThumbsUp
          size={52}
          color="var(--color-state-success, #22c55e)"
          style={{ opacity: alpha }}
        />
      )}
      {isDislike && (
        <ThumbsDown
          size={52}
          color="var(--color-state-dislike, #ef4444)"
          style={{ opacity: alpha }}
        />
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   CardSlot — unified front / back card
   Two permanent instances ("slot-a", "slot-b") ping-pong roles on
   each swipe so no component ever remounts mid-animation.

   Both slots share the same base CSS position (CARD_SLOT_L, CARD_SLOT_T).
   Visual position is controlled entirely via CSS transform:
     Front:  translate(0px, 0px) rotate(0deg)
     Back:   translate(ENTER_X px, ENTER_Y px) rotate(ENTER_ROT deg)

   Swipe flow (one full cycle):
     1. Front slot: flyOut() — immediate CSS fly animation, then signals
        parent via onSwipeCommit() so the back slot can start rising.
     2. Back slot: shouldRise=true → CSS transition back→front (450 ms).
     3. onRiseComplete() fires → parent increments swipeCount → roles swap.
     4. Old front slot (now back role): snaps to back position off-screen.
     5. Old back slot (now front role): interactivity enabled.
═══════════════════════════════════════════════════════ */

interface CardSlotProps {
  card:           PromoCard;
  cardIdx:        number;
  isFront:        boolean;
  shouldRise:     boolean;
  autoSwipe:      PromoSwipeDirection | null;
  onSwipeCommit:  (dir: PromoSwipeDirection) => void;
  onRiseComplete: () => void;
}

const getEventPos = (e: MouseEvent | TouchEvent) =>
  "touches" in e
    ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
    : { x: e.clientX, y: e.clientY };

function CardSlot({
  card, cardIdx, isFront, shouldRise, autoSwipe, onSwipeCommit, onRiseComplete,
}: CardSlotProps) {
  const cardRef     = useRef<HTMLDivElement>(null);
  const startRef    = useRef<{ x: number; y: number } | null>(null);
  const progressRef = useRef(0);
  const superRef    = useRef(0);
  const busyRef     = useRef(false);
  const enteredRef  = useRef(false);
  const prevIsFront = useRef(isFront);
  // Stable ref wrappers so effects never capture stale callbacks.
  const onRiseRef   = useRef(onRiseComplete);
  const onCommitRef = useRef(onSwipeCommit);
  onRiseRef.current   = onRiseComplete;
  onCommitRef.current = onSwipeCommit;

  const [isInteracting, setIsInteracting] = useState(false);
  const [progress,      setProgress]      = useState(0);
  const [superProgress, setSuperProgress] = useState(0);

  /* ── Set initial position on mount ─────────────────────────── */
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "none";
    if (isFront) {
      el.style.transform = "translate(0px, 0px) rotate(0deg)";
      enteredRef.current = true;
    } else {
      el.style.transform = `translate(${ENTER_X}px, ${ENTER_Y}px) rotate(${ENTER_ROT}deg)`;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // mount only — reads isFront from first render

  /* ── Handle role changes ────────────────────────────────────── */
  useEffect(() => {
    const wasFront = prevIsFront.current;
    prevIsFront.current = isFront;

    if (!isFront && wasFront) {
      // front → back: just flew off-screen; snap to back position instantly.
      const el = cardRef.current;
      if (!el) return;
      el.style.transition = "none";
      el.style.transform  = `translate(${ENTER_X}px, ${ENTER_Y}px) rotate(${ENTER_ROT}deg)`;
      busyRef.current     = false;
      enteredRef.current  = false;
      progressRef.current = 0;
      superRef.current    = 0;
      setProgress(0);
      setSuperProgress(0);
      setIsInteracting(false);
    }

    if (isFront && !wasFront) {
      // back → front: rise animation just completed; enable interactivity.
      enteredRef.current = true;
      busyRef.current    = false;
    }
  }, [isFront]);

  /* ── Rise animation (back → front) ─────────────────────────── */
  useEffect(() => {
    if (!shouldRise) return;
    const el = cardRef.current;
    if (!el) return;
    el.style.transition = "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transform  = "translate(0px, 0px) rotate(0deg)";
    const onEnd = () => onRiseRef.current();
    el.addEventListener("transitionend", onEnd, { once: true });
    return () => el.removeEventListener("transitionend", onEnd);
  }, [shouldRise]);

  /* ── Fly out ────────────────────────────────────────────────── */
  const flyOut = useCallback((dir: PromoSwipeDirection) => {
    const el = cardRef.current;
    if (!el || busyRef.current) return;
    busyRef.current    = true;
    enteredRef.current = false;
    el.style.transition = "transform 0.35s cubic-bezier(0.4, 0, 0.6, 1)";
    if (dir === "like") {
      el.style.transform = `translate(${FLY_DISTANCE_X}px, -30px) rotate(20deg)`;
    } else if (dir === "dislike") {
      el.style.transform = `translate(-${FLY_DISTANCE_X}px, -30px) rotate(-20deg)`;
    } else {
      el.style.transform = `translate(0px, -${FLY_DISTANCE_Y}px)`;
    }
    // Signal immediately — back slot starts rising in parallel with fly-out.
    onCommitRef.current(dir);
  }, []);

  /* ── Auto-swipe ─────────────────────────────────────────────── */
  useEffect(() => {
    if (!autoSwipe || !isFront) return;
    if (enteredRef.current) { flyOut(autoSwipe); return; }
    let rafId: number;
    const poll = () => {
      if (enteredRef.current) flyOut(autoSwipe);
      else rafId = requestAnimationFrame(poll);
    };
    rafId = requestAnimationFrame(poll);
    return () => cancelAnimationFrame(rafId);
  }, [autoSwipe, isFront, flyOut]);

  /* ── Pointer handlers ───────────────────────────────────────── */
  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (!enteredRef.current || busyRef.current) return;
    const pos = "touches" in e
      ? { x: e.touches[0].clientX, y: e.touches[0].clientY }
      : { x: e.clientX, y: e.clientY };
    startRef.current = pos;
    setIsInteracting(true);
    if (cardRef.current) cardRef.current.style.transition = "none";
  }, []);

  const handleMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!startRef.current || !cardRef.current || busyRef.current) return;
    if ("touches" in e) e.preventDefault();
    const { x, y } = getEventPos(e);
    const rawDx = x - startRef.current.x;
    const rawDy = y - startRef.current.y;
    const dx    = rawDx * 0.8;
    const dy    = rawDy * 0.5;
    const isUp  = rawDy < -40 && Math.abs(rawDy) > Math.abs(rawDx);
    const deg   = isUp ? 0 : (dx / 600) * -30;
    cardRef.current.style.transform = `translate(${dx}px, ${dy}px) rotate(${deg}deg)`;
    const p  = isUp ? 0 : clamp(dx / 100, -1, 1);
    const sp = isUp ? clamp(Math.abs(rawDy) / 80, 0, 1) : 0;
    progressRef.current = p;
    superRef.current    = sp;
    setProgress(p);
    setSuperProgress(sp);
  }, []);

  const handleEnd = useCallback(() => {
    if (!startRef.current || !cardRef.current) return;
    startRef.current = null;
    setIsInteracting(false);
    const el = cardRef.current;
    const t  = el.style.transform;
    const dx = parseFloat(t.match(/translate\((-?[\d.]+)px/)?.[1] ?? "0");
    const dy = parseFloat(t.match(/translate\([^,]+,\s*(-?[\d.]+)px\)/)?.[1] ?? "0");
    const isUp = dy < -40 && Math.abs(dy) > Math.abs(dx);
    const p  = progressRef.current;
    const sp = superRef.current;
    if (isUp && sp >= 0.8)  flyOut("super");
    else if (p >= 1)        flyOut("like");
    else if (p <= -1)       flyOut("dislike");
    else {
      el.style.transition = "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)";
      el.style.transform  = "translate(0px, 0px) rotate(0deg)";
      progressRef.current = 0;
      superRef.current    = 0;
      setProgress(0);
      setSuperProgress(0);
    }
  }, [flyOut]);

  useEffect(() => {
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("touchmove", handleMove, { passive: false });
    window.addEventListener("mouseup",   handleEnd);
    window.addEventListener("touchend",  handleEnd);
    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("touchmove", handleMove);
      window.removeEventListener("mouseup",   handleEnd);
      window.removeEventListener("touchend",  handleEnd);
    };
  }, [handleMove, handleEnd]);

  const isStaticBack = !isFront && !shouldRise;

  return (
    <div
      ref={cardRef}
      onMouseDown={isFront ? handleStart : undefined}
      onTouchStart={isFront ? handleStart : undefined}
      style={{
        position: "absolute",
        left: CARD_SLOT_L, top: CARD_SLOT_T,
        width: CARD_W, height: CARD_H,
        zIndex: isFront ? 2 : 1,
        borderRadius: "var(--radius-lg, 8px)",
        backgroundColor: "var(--color-bg-main, #ffffff)",
        border: "1px solid var(--color-element-subtle, rgba(36,36,35,0.1))",
        display: "flex", flexDirection: "column",
        overflow: "hidden",
        cursor: isFront ? (isInteracting ? "grabbing" : "grab") : "default",
        touchAction: isFront ? "none" : "auto",
        userSelect: "none",
        willChange: "transform",
        // --shadow-card-back is defined in tokens.css.
        // filter is used (not box-shadow) per Figma spec to render behind rotated card.
        filter: isStaticBack ? "var(--shadow-card-back, drop-shadow(24px 12px 10px rgba(0,0,0,0.15)))" : "none",
        pointerEvents: isFront ? "auto" : "none",
      }}
    >
      <div style={{ flex: 1, position: "relative" }}>
        <CardImage src={card.imageSrc} idx={cardIdx} withOverlay={isFront && !!card.imageSrc} />
        {isFront && <SwipeHint progress={progress} superProgress={superProgress} />}
      </div>
      <CardFooter title={card.title} isBack={!isFront} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Action Buttons
   Figma layout: space-between, horizontal padding 112px each side.
   112px is a Figma layout constant (not a spacing token).
═══════════════════════════════════════════════════════ */

interface ActionButtonsProps {
  onDislike: () => void;
  onLike:    () => void;
  onSuper:   () => void;
  disabled?: boolean;
}

function ActionButtons({ onDislike, onLike, onSuper, disabled }: ActionButtonsProps) {
  const btn = (bg: string, label: string, click: () => void, children: React.ReactNode) => (
    <motion.button
      type="button"
      aria-label={label}
      onClick={disabled ? undefined : click}
      whileHover={disabled ? {} : { scale: 1.1 }}
      whileTap={disabled ? {} : { scale: 0.92 }}
      style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--btn-padding-icon-sm, 10px)",
        borderRadius: "var(--radius-full, 999px)",
        background: bg,
        border: "none",
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.4 : 1,
        flexShrink: 0,
        transition: "opacity 0.2s",
      }}
    >
      {children}
    </motion.button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2, 8px)", alignItems: "center", width: "100%" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", padding: "0 112px", width: "100%" }}>
        {btn("var(--color-brand-secondary-dim, rgba(36,36,35,0.06))", "Dislike", onDislike,
          <ThumbsDown size={24} color="var(--color-text-primary, #242423)" />)}
        {btn("var(--color-brand-primary, #be1d2c)", "Super like", onSuper,
          <Heart
            size={24}
            fill="var(--color-text-on-primary, #ffffff)"
            color="var(--color-text-on-primary, #ffffff)"
          />)}
        {btn("var(--color-brand-primary-dim, rgba(190,29,44,0.08))", "Like", onLike,
          <ThumbsUp size={24} color="var(--color-brand-primary, #be1d2c)" />)}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   Reward Screen
═══════════════════════════════════════════════════════ */

interface RewardScreenProps {
  creditsEarned: number;
  onClose?:      () => void;
  renderInput?:  React.ReactNode;
}

function RewardScreen({ creditsEarned, onClose, renderInput }: RewardScreenProps) {
  const [confetti, setConfetti] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setConfetti(false), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-4, 16px)", width: "100%" }}
    >
      <div style={{
        position: "relative",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: "var(--space-6, 24px)",
        background: "var(--color-brand-secondary-dim, rgba(36,36,35,0.06))",
        borderRadius: "var(--radius-2xl, 12px)",
        padding: "var(--space-3, 12px)",
        // 372px is the Figma-specified minimum height for this panel.
        minHeight: 372,
        overflow: "hidden",
      }}>
        <RewardConfetti active={confetti} />

        <div style={{
          position: "relative", zIndex: 10,
          display: "flex", flexDirection: "column",
          alignItems: "center",
          gap: "var(--space-6, 24px)",
          padding: "var(--space-4, 16px) var(--space-10, 40px)",
          width: "100%",
          // 405px is the Figma-specified max-width for the reward content.
          maxWidth: 405,
        }}>
          <HSEmblem color="brand" height={49} />

          <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2, 8px)", alignItems: "center", textAlign: "center", width: "100%" }}>
            <p style={{
              margin: 0,
              fontFamily: "var(--font-family-heading, 'Stack Sans Text', serif)",
              fontSize: "var(--font-size-h5, 18px)",
              fontWeight: "var(--font-weight-h5, 400)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary, #242423)",
              // No --line-height-h5 token yet; raw value preserved from Figma spec.
              lineHeight: "28px",
            }}>
              You're All Caught Up!
            </p>
            <p style={{
              margin: 0,
              fontSize: "var(--font-size-body-15, 15px)",
              fontWeight: "var(--font-weight-body-15, 400)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-secondary, #6e6d6a)",
              // No --line-height-body token yet; raw value preserved from Figma spec.
              lineHeight: "20px",
            }}>
              You've officially earned{" "}
              <strong style={{
                color: "var(--color-text-primary, #242423)",
                fontWeight: "var(--font-weight-label-sb-15, 600)" as React.CSSProperties["fontWeight"],
              }}>
                {creditsEarned} Heart Credits
              </strong>
              {" "}to spend on your next masterpiece.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            style={{
              background: "var(--color-text-primary, #242423)",
              color: "var(--color-text-on-primary, #ffffff)",
              border: "none",
              borderRadius: "var(--radius-full, 999px)",
              height: "var(--space-8, 32px)",
              padding: "var(--btn-padding-default, 0px 16px)",
              fontSize: "var(--font-size-label-15, 15px)",
              fontWeight: "var(--font-weight-label-15, 500)" as React.CSSProperties["fontWeight"],
              cursor: "pointer",
              display: "flex", alignItems: "center",
            }}
          >
            Close
          </motion.button>
        </div>
      </div>

      {renderInput && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          {renderInput}
        </motion.div>
      )}
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════
   StampyPromotions  (main export)
═══════════════════════════════════════════════════════ */

export function StampyPromotions({
  cards,
  swipesUntilReward = 15,
  creditsEarned     = 20,
  autoAdvanceSec    = 8,
  onSwipe,
  onClose,
  renderInput,
  style,
  className,
}: StampyPromotionsProps) {
  const allCards = (cards && cards.length > 0) ? cards : DEMO_CARDS;
  const n        = allCards.length;

  // swipeCount drives which slot is front (even = slot-a, odd = slot-b).
  const [swipeCount,      setSwipeCount]      = useState(0);
  const [swipes,          setSwipes]          = useState(0);
  const [phase,           setPhase]           = useState<"swipe" | "reward">("swipe");
  const [progress,        setProgress]        = useState(0);
  const [autoSwipe,       setAutoSwipe]       = useState<PromoSwipeDirection | null>(null);
  const [superTrigger,    setSuperTrigger]    = useState(0);
  const [swipeInProgress, setSwipeInProgress] = useState(false);
  const pendingDirRef = useRef<PromoSwipeDirection | null>(null);

  const rafRef     = useRef<number | null>(null);
  const timerRef   = useRef<number | null>(null);
  const versionRef = useRef(0);

  /* ── Progress bar timer — resets after each completed swipe ─── */
  useEffect(() => {
    if (phase !== "swipe") return;
    const ver = ++versionRef.current;
    timerRef.current = null;
    setProgress(0);
    setAutoSwipe(null);
    const duration = autoAdvanceSec * 1000;
    let fired = false;
    const tick = (now: number) => {
      if (ver !== versionRef.current) return;
      if (!timerRef.current) timerRef.current = now;
      const p = Math.min((now - timerRef.current) / duration, 1);
      setProgress(p);
      if (p >= 1 && !fired) { fired = true; setAutoSwipe("like"); return; }
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [swipeCount, phase, autoAdvanceSec]);

  /* ── Slot assignments ───────────────────────────────────────── */
  // Even swipeCount → slot-a is front, slot-b is back. Odd → reversed.
  const frontIsA = swipeCount % 2 === 0;
  const idxA     = (frontIsA ? swipeCount       : swipeCount + 1) % n;
  const idxB     = (frontIsA ? swipeCount + 1   : swipeCount    ) % n;
  const cardA    = allCards[idxA];
  const cardB    = allCards[idxB];

  /* ── Front slot commits a swipe → start rise on back slot ──── */
  const handleSwipeCommit = useCallback((dir: PromoSwipeDirection) => {
    pendingDirRef.current = dir;
    setSwipeInProgress(true);
    setAutoSwipe(null);
  }, []);

  /* ── Back slot rise completes → advance state ───────────────── */
  const handleRiseComplete = useCallback(() => {
    const dir = pendingDirRef.current ?? "like";
    pendingDirRef.current = null;
    if (dir === "super") setSuperTrigger(t => t + 1);
    const card = allCards[swipeCount % n];
    onSwipe?.(card, dir);
    const next = swipes + 1;
    setSwipes(next);
    if (next >= swipesUntilReward) {
      setPhase("reward");
      setSwipeInProgress(false);
    } else {
      setSwipeCount(c => c + 1);
      setSwipeInProgress(false);
    }
  }, [allCards, swipeCount, n, swipes, swipesUntilReward, onSwipe]);

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", ...style }} className={className}>
      <AnimatePresence mode="wait">
        {phase === "swipe" ? (
          <motion.div
            key="swipe"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              position: "relative",
              background: "var(--color-brand-secondary-dim, rgba(36,36,35,0.06))",
              borderRadius: "var(--radius-2xl, 12px)",
              padding: "var(--space-3, 12px)",
              display: "flex", flexDirection: "column",
              gap: "var(--space-2, 8px)",
              alignItems: "center",
              width: "100%",
              overflow: "hidden",
            }}
          >
            <HeartBurst trigger={superTrigger} />
            <Prg value={progress * 100} style={{ flexShrink: 0, width: "100%" }} />

            <p style={{
              margin: 0,
              fontSize: "var(--font-size-label-15, 15px)",
              fontWeight: "var(--font-weight-label-15, 500)" as React.CSSProperties["fontWeight"],
              color: "var(--color-text-primary, #242423)",
              textAlign: "center",
              // No --line-height-body token yet; raw value preserved from Figma spec.
              lineHeight: "20px",
            }}>
              While that's loading, swipe through some cards so I can get a feel for what you like.
            </p>

            <div style={{ position: "relative", width: STAGE_W, height: STAGE_H, flexShrink: 0 }}>
              {/* Slot B rendered first in DOM (lower zIndex = visually behind). */}
              <CardSlot
                key="slot-b"
                card={cardB}
                cardIdx={idxB}
                isFront={!frontIsA}
                shouldRise={swipeInProgress && frontIsA}
                autoSwipe={!frontIsA ? autoSwipe : null}
                onSwipeCommit={handleSwipeCommit}
                onRiseComplete={handleRiseComplete}
              />
              <CardSlot
                key="slot-a"
                card={cardA}
                cardIdx={idxA}
                isFront={frontIsA}
                shouldRise={swipeInProgress && !frontIsA}
                autoSwipe={frontIsA ? autoSwipe : null}
                onSwipeCommit={handleSwipeCommit}
                onRiseComplete={handleRiseComplete}
              />
            </div>

            {/* Spacer between card stage and action buttons. */}
            <div style={{ height: "var(--space-2, 8px)" }} />
            <ActionButtons
              onDislike={() => { if (!autoSwipe && !swipeInProgress) setAutoSwipe("dislike"); }}
              onLike={   () => { if (!autoSwipe && !swipeInProgress) setAutoSwipe("like");    }}
              onSuper={  () => { if (!autoSwipe && !swipeInProgress) setAutoSwipe("super");   }}
              disabled={!!autoSwipe || swipeInProgress}
            />
          </motion.div>
        ) : (
          <motion.div key="reward" style={{ width: "100%" }}>
            <RewardScreen creditsEarned={creditsEarned} onClose={onClose} renderInput={renderInput} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
