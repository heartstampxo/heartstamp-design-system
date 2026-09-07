import * as React from "react";
import { useInjectedStyle, cssMin } from "./hs-style-inject";

/* ═══════════════════════════════════════════════════════════════════════════
   BOTTOM GLASS — the progressive blur pinned to the foot of the viewport.

   Not one blurred pane. Six of them, each starting lower than the last and
   each blurring harder, every one masked so it fades in from nothing at its
   own top edge. Stacked, the blur ramps smoothly from clear to heavy down the
   strip rather than showing the hard line a single backdrop-filter leaves.

   The whole thing is scaled by --hs-g, a 0-to-1 scalar driven from scroll, so
   the glass is absent at the top of a page and full strength once you are
   into it. A veil rides the same scalar to keep contrast under it.
   ═══════════════════════════════════════════════════════════════════════════ */

/** top offset (px) and blur multiplier (px at full strength) per layer. */
const LAYERS: Array<[number, number]> = [
  [0, 2.6],
  [27, 5.1],
  [53, 9.9],
  [80, 19.2],
  [107, 37.5],
  [133, 72],
];

const GLASS_CSS = `
.hs-glass {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: var(--hs-glass-h, clamp(100px, calc(20vh - 60px), 180px));
  z-index: var(--hs-glass-z, 8700);
  pointer-events: none;
  --hs-g: 0;
  /* Tunables. The blur scale multiplies every layer at once, so the ramp keeps
     its shape rather than flattening as it is turned up. */
  --hs-glass-blur: 1;
  --hs-glass-sat: 95%;
  --hs-glass-veil: 255, 255, 255;
}
@media (prefers-color-scheme: dark) {
  .hs-glass { --hs-glass-veil: 8, 8, 8; }
}
.hs-glass__layer {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  /* Each layer fades in over its first 100px, so no layer shows an edge. */
  -webkit-mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100px);
  mask-image: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 100px);
}
.hs-glass__veil {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: linear-gradient(
    180deg,
    rgba(var(--hs-glass-veil), 0) 0%,
    rgba(var(--hs-glass-veil), 0.06) 55%,
    rgba(var(--hs-glass-veil), 0.22) 100%
  );
}
/* Nothing to reveal when the page is not scrolling under it. */
@media (prefers-reduced-motion: reduce) {
  .hs-glass { transition: none; }
}
`;

const GLASS_CSS_MIN = cssMin(GLASS_CSS);

/* One expression, used for both the standard and -webkit- properties. */
const filter = (blur: number) =>
  `blur(calc(var(--hs-g, 0) * var(--hs-glass-blur, 1) * ${blur}px)) saturate(calc(100% + var(--hs-g, 0) * var(--hs-glass-sat, 95%)))`;

export interface BottomGlassProps {
  /**
   * Scroll distance, in px, over which the glass reaches full strength.
   * @default 460
   */
  rampOver?: number;
  /**
   * A selector, or an element, whose approach dissolves the glass — the site
   * uses its footer, so the strip does not blur a surface that has its own.
   */
  fadeNear?: string | React.RefObject<HTMLElement | null>;
  /**
   * Height of the strip. Note the layers start at fixed offsets down to 133px,
   * so a strip much shorter than that simply clips the heaviest ones — which
   * is what the default clamp already does on a short viewport.
   * @default clamp(100px, calc(20vh - 60px), 180px)
   */
  height?: string | number;
  /**
   * Multiplies every layer's blur at once, so the ramp keeps its shape rather
   * than flattening as it is turned up. @default 1
   */
  blurScale?: number;
  /**
   * Extra saturation at full strength, on top of 100%. The site lifts colour
   * behind the glass so it does not go flat under the blur. @default "95%"
   */
  saturation?: string;
  /** Stacking order. @default 8700 */
  zIndex?: number;
  /**
   * The element whose scrolling drives it. Omit for the window, which is the
   * usual case; pass one when the page scrolls inside a container instead —
   * an app shell, a modal, a docs preview.
   */
  scrollRoot?: string | React.RefObject<HTMLElement | null>;
  /** Drive it yourself: 0 to 1, bypassing the scroll listener. */
  strength?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A progressive-blur glass strip pinned to the foot of the viewport, ramping
 * in as the page scrolls.
 *
 * Render it once, near the root — it is `position: fixed` and
 * `pointer-events: none`, so it never intercepts a click.
 */
export function BottomGlass({
  rampOver = 460,
  fadeNear,
  scrollRoot,
  height,
  blurScale,
  saturation,
  zIndex,
  strength,
  className,
  style,
}: BottomGlassProps) {
  useInjectedStyle("hs-glass", GLASS_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const veilRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const root = rootRef.current, veil = veilRef.current;
    if (!root) return;

    /* Controlled: skip the listener entirely. */
    if (strength !== undefined) {
      const t = Math.max(0, Math.min(1, strength));
      root.style.setProperty("--hs-g", t.toFixed(3));
      if (veil) veil.style.opacity = t.toFixed(3);
      return;
    }

    let raf = 0;
    const el = (v: typeof fadeNear | typeof scrollRoot): HTMLElement | null => {
      if (!v) return null;
      return typeof v === "string" ? document.querySelector<HTMLElement>(v) : v.current;
    };
    /* The scroller and the viewport it defines. Without a scrollRoot both are
       the window, which is what a page normally wants. */
    const scroller = el(scrollRoot);
    const target: EventTarget = scroller ?? window;

    const read = () => {
      raf = 0;
      const y = scroller
        ? scroller.scrollTop
        : window.scrollY || document.documentElement.scrollTop || 0;
      let t = Math.max(0, Math.min(1, y / rampOver));
      /* Ease in and out, so it neither snaps on at the top nor creeps. */
      t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

      const near = el(fadeNear);
      if (near) {
        const vh = (scroller ? scroller.clientHeight : window.innerHeight) || 800;
        const band = Math.min(200, vh * 0.26);
        /* Start dissolving well before it reaches the band, or the glass
           visibly switches off against the surface arriving under it. */
          /* Relative to the scroller's own box, not the page, or a container
           scroll measures the fade against the wrong edge. */
        const top = scroller
          ? near.getBoundingClientRect().top - scroller.getBoundingClientRect().top
          : near.getBoundingClientRect().top;
        const fade = Math.max(0, Math.min(1, (top - (vh - band)) / 220));
        t = Math.min(t, fade);
      }

      root.style.setProperty("--hs-g", t.toFixed(3));
      if (veil) veil.style.opacity = t.toFixed(3);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(read); };

    read();
    target.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      target.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [rampOver, fadeNear, scrollRoot, strength]);

  return (
    <div
      ref={rootRef}
      className={["hs-glass", className].filter(Boolean).join(" ")}
      style={{
        ...(zIndex !== undefined ? ({ "--hs-glass-z": zIndex } as React.CSSProperties) : null),
        ...(height !== undefined ? ({ "--hs-glass-h": typeof height === "number" ? height + "px" : height } as React.CSSProperties) : null),
        ...(blurScale !== undefined ? ({ "--hs-glass-blur": blurScale } as React.CSSProperties) : null),
        ...(saturation !== undefined ? ({ "--hs-glass-sat": saturation } as React.CSSProperties) : null),
        ...style,
      }}
      aria-hidden="true"
    >
      {LAYERS.map(([top, blur], i) => (
        <div
          className="hs-glass__layer"
          key={i}
          style={{
            top,
            backdropFilter: filter(blur),
            WebkitBackdropFilter: filter(blur),
          }}
        />
      ))}
      <div className="hs-glass__veil" ref={veilRef} />
    </div>
  );
}
