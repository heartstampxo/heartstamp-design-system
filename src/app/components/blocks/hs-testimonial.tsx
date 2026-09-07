import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";

/* ═══════════════════════════════════════════════════════════════════════════
   TESTIMONIAL — a customer quote over three counting statistics.

   Two pieces of motion, both from the marketing page and both gated on the
   block coming into view: the whole band rises once, and the figures count up
   from zero. The counters run on their own observer at a higher threshold, so
   the numbers do not finish before the band has finished arriving.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface TestimonialStat {
  /** The figure counted up to. */
  value: number;
  /** Appended once counting finishes and while it runs — "k+", "%", "h". */
  suffix?: string;
  label: React.ReactNode;
}

export const TESTIMONIAL_STATS: TestimonialStat[] = [
  { value: 12, suffix: "k+", label: "Cards posted" },
  { value: 100, suffix: "%", label: "One-of-a-kind" },
  { value: 24, suffix: "h", label: "Print to postbox" },
];

const QUOTE_CSS = `
.hs-quote {
  container-type: inline-size;
  width: 100%;
  background: var(--color-bg-main);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: 1;
}
.hs-quote[data-rise] { animation: hs-hero-up 0.75s cubic-bezier(0.22, 1.18, 0.36, 1) 0.05s both; }
@keyframes hs-hero-up { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }

.hs-quote__inner {
  /* The design system grid track. Its contract: --grid-max-width is the OUTER
     width and --grid-margin is subtracted from inside it, so content lands at
     1168px on the 1200px tier and lines up with .hs-page-grid — and the wide
     tier follows automatically, because tokens.css restates --grid-max-width
     as 1400px at >= 2000px. Retune one block with --hs-track-max /
     --hs-track-margin rather than redefining the grid tokens, which would
     retune every consumer in the subtree and, if pinned to a number, sever
     the wide tier. */
  width: min(var(--hs-track-max, var(--grid-max-width, 1200px)), 100%);
  margin-inline: auto;
  padding-inline: var(--hs-track-margin, var(--grid-margin, 16px));
  /* Block padding lives here, not on the root: the root establishes the
     inline-size container, and a @container query cannot style the element
     that establishes it — the narrow-tier padding below never applied while
     it targeted the root. */
  padding-block: 88px 64px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  align-items: center;
}
.hs-quote__head {
  width: 956px;
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}
.hs-quote__q {
  margin: 0;
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h2);
  line-height: 1.2;
  letter-spacing: -0.03em;
  text-align: center;
  color: var(--color-text-primary);
}
/* The emphasised clause inside the quote. */
.hs-quote__q em { font-style: normal; color: var(--color-brand-primary); }
.hs-quote__by {
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: var(--font-size-h4);
  line-height: 28px;
  color: var(--color-text-secondary);
  text-align: center;
}
.hs-quote__stats {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  gap: var(--space-16);
  justify-content: center;
  align-items: flex-start;
}
.hs-quote__stat {
  width: 122px;
  display: flex;
  flex-direction: column;
  gap: 13px;
  align-items: center;
}
.hs-quote__n {
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: 60px;
  line-height: 55px;
  text-align: center;
  color: var(--color-text-primary);
  white-space: nowrap;
  /* The figure changes every frame while counting; without this the row
     twitches as the glyphs change width. */
  font-variant-numeric: tabular-nums;
}
.hs-quote__l {
  font-family: var(--font-family-body);
  font-weight: 600;
  font-size: 16px;
  line-height: 100%;
  text-align: center;
  color: var(--color-text-secondary);
  white-space: nowrap;
}
@container (max-width: 900px) {

  .hs-quote__stats { gap: var(--space-5); }
  .hs-quote__n { font-family: var(--font-family-body); font-weight: 600; font-size: var(--font-size-h3, 24px); line-height: 28px; }
  .hs-quote__inner { padding-block: 56px 40px; gap: var(--space-8); }
}
@media (prefers-reduced-motion: reduce) {
  .hs-quote[data-rise] { animation: none; }
}
`;

const QUOTE_CSS_MIN = cssMin(QUOTE_CSS);

/** Count from zero to each stat, once, when the row is properly on screen. */
function useCountUp(ref: React.RefObject<HTMLElement | null>, run: boolean, deps: React.DependencyList) {
  const [p, setP] = React.useState(run ? 0 : 1);
  React.useEffect(() => {
    if (!run) { setP(1); return; }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") { setP(1); return; }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }

    let raf = 0;
    const DUR = 1600;
    /* Cubic ease-out: quick off the mark, settles onto the final figure. */
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const io = new IntersectionObserver(
      es => {
        if (!es[0].isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const step = (now: number) => {
          const t = Math.min(1, (now - start) / DUR);
          setP(ease(t));
          if (t < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      /* 0.6 — the row has to be properly in view, not just clipping the edge,
         or the count is over before it is read. */
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, run, ...deps]);
  return p;
}

export interface TestimonialProps {
  /** The quote. Wrap the emphasised clause in `<em>` for the brand colour. */
  quote?: React.ReactNode | false;
  /** Who said it. `false` removes the line. */
  attribution?: React.ReactNode | false;
  /** The counting figures. `false` removes the row. */
  stats?: TestimonialStat[] | false;
  /** Rise the band in and count the figures up. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A customer quote over three counting statistics.
 *
 * Bare it is the approved quote and figures. The band rises once on scroll and
 * the numbers count up from zero; both are dropped under reduced motion, where
 * the figures render at their final value rather than stuck at zero.
 */
export function Testimonial({
  quote = (
    <>
      My nan kept it on the mantelpiece for a month. She thought <em>I’d drawn it myself.</em>
    </>
  ),
  attribution = "Priya, sent a get-well card to grandma",
  stats = TESTIMONIAL_STATS,
  reveal = true,
  className,
  style,
}: TestimonialProps) {
  useInjectedStyle("hs-quote", QUOTE_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const statsRef = React.useRef<HTMLDivElement>(null);
  const [risen, setRisen] = React.useState(!reveal);
  const p = useCountUp(statsRef, reveal, [stats]);

  React.useEffect(() => {
    if (!reveal) { setRisen(true); return; }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setRisen(true); return; }
    const io = new IntersectionObserver(
      es => { if (es[0].isIntersecting) { setRisen(true); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  return (
    <div
      ref={rootRef}
      className={["hs-quote", className].filter(Boolean).join(" ")}
      style={style}
      {...(risen ? { "data-rise": "" } : {})}
    >
      <div className="hs-quote__inner">
        {(quote !== false || attribution !== false) && (
          <div className="hs-quote__head">
            {quote !== false && <p className="hs-quote__q">{quote}</p>}
            {attribution !== false && <span className="hs-quote__by">{attribution}</span>}
          </div>
        )}
        {stats !== false && stats.length > 0 && (
          <div className="hs-quote__stats" ref={statsRef}>
            {stats.map((s, i) => (
              <div className="hs-quote__stat" key={i}>
                <span className="hs-quote__n">
                  {Math.round(p * s.value)}
                  {s.suffix ?? ""}
                </span>
                <span className="hs-quote__l">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
