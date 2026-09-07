import * as React from "react";
import { useInjectedStyle, cssMin } from "./hs-style-inject";
import { Swt } from "./hs-swt";

/* ═══════════════════════════════════════════════════════════════════════════
   PRIVACY BANNER — the cookie consent card.

   A small card at the foot of the page rather than a full-width bar, so it
   never covers the content someone is reading. It holds back until the reader
   has actually got into the page, expands in place to show the per-category
   toggles, and animates out on a choice instead of vanishing.

   Consent is NOT persisted here: what to store, and under which regime, is the
   consumer's decision. `onChoice` hands you the answer; feed it back through
   `open` on the next visit.
   ═══════════════════════════════════════════════════════════════════════════ */

export type PrivacyChoice = "all" | "none" | "custom";

export interface PrivacyCategory {
  id: string;
  label: React.ReactNode;
  /** Always on and not switchable — the strictly necessary set. */
  required?: boolean;
  /** Starting state for the switchable ones. */
  defaultOn?: boolean;
}

/**
 * The narrow-screen carousel copy. The mobile bar shows one short line at a
 * time instead of the card's heading-plus-paragraph, so this is a separate
 * string set, not a truncation of `title` / `children`.
 */
export const PRIVACY_LINES: React.ReactNode[] = [
  "We value your privacy",
  "Cookies help us make better cards",
  "You choose what we remember",
];

export const PRIVACY_CATEGORIES: PrivacyCategory[] = [
  { id: "necessary", label: "Necessary", required: true },
  { id: "functional", label: "Functional" },
  { id: "marketing", label: "Marketing" },
];

const BANNER_CSS = `
.hs-ckbar {
  position: fixed;
  z-index: var(--hs-ckbar-z, 9400);
  left: 20px;
  right: 20px;
  bottom: 20px;
  width: 420px;
  max-width: 430px;
  /* A card, not a bar: pinned left so it never spans the reading column. */
  margin: 0 auto 0 0;
  box-sizing: border-box;
  padding: var(--space-5);
  border-radius: 28px;
  background: var(--color-bg-editor);
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 320ms ease, transform 420ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ckbar[data-in] { opacity: 1; transform: translateY(0); }
.hs-ckbar__h {
  margin: 0 0 var(--space-2);
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: 16px;
  line-height: 22px;
  color: var(--color-text-primary);
}
.hs-ckbar__p {
  margin: 0 0 18px;
  font-family: var(--font-family-heading);
  font-size: 14px;
  line-height: 150%;
  color: var(--color-text-secondary);
  text-wrap: pretty;
}
.hs-ckbar__cats { display: flex; flex-direction: column; gap: var(--space-4); margin: 0 0 18px; }
.hs-ckbar__rule { height: 0; border-top: 1px solid var(--color-element-subtle); }
.hs-ckbar__row { display: flex; flex-direction: row; flex-wrap: wrap; align-items: center; gap: var(--space-4); }
.hs-ckbar__cat { display: flex; flex-direction: row; align-items: center; gap: var(--space-2); }
.hs-ckbar__cat span {
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.5;
  color: var(--color-text-secondary);
  white-space: nowrap;
}
.hs-ckbar__actions { display: flex; flex-wrap: wrap; gap: var(--space-2-5); }
.hs-ckbar__btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 var(--space-3-5);
  border: 1px solid transparent;
  border-radius: var(--radius-full);
  background: transparent;
  cursor: pointer;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: 14px;
  line-height: 1;
  color: var(--color-text-primary);
  transition: background 150ms ease;
}
.hs-ckbar__btn:hover { background: color-mix(in srgb, var(--color-text-primary) 12%, transparent); }
.hs-ckbar__btn--primary {
  background: var(--color-brand-primary);
  color: var(--color-text-on-primary);
  border-color: transparent;
}
.hs-ckbar__btn--primary:hover { background: var(--color-brand-primary-hover); }
.hs-ckbar__btn--primary:active { background: var(--color-brand-primary-pressed); }

/* ── Mobile: a top-pinned pill, not the card ─────────────────────────────────
   Below 768px the site does not reflow the card, it swaps in a different
   component: one line of copy at a time on a carousel, the category toggles
   folded behind "More", and the whole thing pinned to the TOP — the foot of a
   phone screen is already taken by the thumb and the browser chrome.
   Both trees render; the media query at the end picks one. */
.hs-ckbar-m {
  position: fixed;
  z-index: var(--hs-ckbar-z, 9400);
  left: 20px;
  right: 20px;
  /* The site measures its own nav and sits 8px under it. There is no nav to
     measure in here, so it is a property: set it to your header height + 8. */
  top: var(--hs-ckbar-top, 72px);
  box-sizing: border-box;
  /* Off by default — the media query below is what turns it on, so the bar
     never appears on desktop even if a consumer overrides the breakpoint. */
  display: none;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-1-5);
  padding: var(--space-2) var(--space-2) var(--space-2) var(--space-3-5);
  border-radius: var(--radius-full);
  background: var(--color-bg-editor);
  opacity: 0;
  /* Enters downward, because it lives at the top. */
  transform: translateY(-24px);
  transition: opacity 300ms ease,
              transform 300ms cubic-bezier(0.22, 1, 0.36, 1),
              top 300ms cubic-bezier(0.22, 1, 0.36, 1),
              border-radius 200ms ease,
              padding 200ms ease;
}
.hs-ckbar-m[data-in] { opacity: 1; transform: translateY(0); }
/* Expanded it stops being a pill and squares off to hold the toggle row,
   taking a little more width and tightening the padding around it. */
.hs-ckbar-m[data-wide] {
  left: 12px;
  right: 12px;
  border-radius: 24px;
  padding-left: var(--space-2);
  padding-right: var(--space-1);
}
.hs-ckbar-m__main {
  flex: 1 0 100%;
  min-width: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  gap: var(--space-1-5);
}
/* One line wide, the rest clipped — this is the carousel window. */
.hs-ckbar-m__vp { flex: 1 1 auto; min-width: 0; overflow: hidden; }
.hs-ckbar-m__track {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  transition: transform 520ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-ckbar-m__line {
  flex: 0 0 100%;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: 14px;
  line-height: 18px;
  color: var(--color-text-primary);
}
.hs-ckbar-m__btn {
  flex: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 36px;
  padding: 0 var(--space-3-5);
  border: 1px solid transparent;
  border-radius: var(--radius-button);
  background: var(--color-state-hover);
  font-family: var(--font-family-body);
  font-weight: 500;
  font-size: var(--font-size-body-13);
  line-height: 1;
  color: var(--color-text-primary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 150ms ease-in-out;
}
.hs-ckbar-m__btn--primary {
  background: var(--color-brand-primary);
  border-color: var(--color-brand-primary);
  color: var(--color-text-on-primary);
}
.hs-ckbar-m__btn--primary:hover { background: var(--color-brand-primary-hover); }
.hs-ckbar-m__btn--primary:active { background: var(--color-brand-primary-pressed); }
/* The toggles scroll sideways rather than wrap: three of them do not fit a
   narrow phone, and a wrapped row would grow the bar over the content. */
.hs-ckbar-m__cats {
  flex: 1 0 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-0-5);
  margin: var(--space-0-5) 0 0;
  padding: var(--space-2) 0 0;
  border-top: 1px solid var(--color-element-subtle);
  overflow-x: auto;
  scrollbar-width: none;
}
.hs-ckbar-m__cats::-webkit-scrollbar { display: none; }
.hs-ckbar-m__cat {
  flex: none;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: var(--space-0-5);
}
.hs-ckbar-m__cat span {
  font-family: var(--font-family-body);
  font-weight: var(--font-weight-body-13-bd, 700);
  font-size: var(--font-size-body-13-bd, 13px);
  line-height: 1.5;
  color: var(--color-text-secondary);
  white-space: nowrap;
}

/* The swap. 767px is the site's own breakpoint for it. */
@media (max-width: 767px) {
  .hs-ckbar { display: none; }
  .hs-ckbar-m { display: flex; }
}
/* The variant prop pins one of the two regardless of viewport — for a consumer who
   wants the compact bar on desktop, and for previewing either in a frame,
   where a viewport media query can never fire. An attribute selector outranks
   the bare class above; a media query adds no specificity of its own. */
.hs-ckbar[data-variant="card"]      { display: block; }
.hs-ckbar[data-variant="compact"]   { display: none; }
.hs-ckbar-m[data-variant="card"]    { display: none; }
.hs-ckbar-m[data-variant="compact"] { display: flex; }
@media (prefers-reduced-motion: reduce) {
  .hs-ckbar { transition: none; }
  .hs-ckbar-m { transition: none; }
  .hs-ckbar-m__track { transition: none; }
}
`;

const BANNER_CSS_MIN = cssMin(BANNER_CSS);

export interface PrivacyBannerProps {
  /** Heading. */
  title?: React.ReactNode;
  /** The explanatory line. */
  children?: React.ReactNode;
  /** The switchable categories. */
  categories?: PrivacyCategory[];
  /**
   * Show it. Left undefined the banner decides for itself, appearing once the
   * reader has scrolled past a viewport; pass a boolean to drive it yourself.
   */
  open?: boolean;
  /**
   * Fires with the choice and the category states. Nothing is persisted for
   * you — storing consent, and for how long, is a legal decision, not a
   * component's. Feed the result back through `open` next visit.
   */
  onChoice?: (choice: PrivacyChoice, categories: Record<string, boolean>) => void;
  /** Scroll distance before it appears, when uncontrolled. @default one viewport */
  appearAfter?: number;
  /**
   * Narrow-screen carousel lines, shown one at a time below 768px in place of
   * the card's title and paragraph. Pass a single-item array to hold one line.
   * @default PRIVACY_LINES
   */
  lines?: React.ReactNode[];
  /**
   * How long each carousel line holds, in ms. Cycling stops while the
   * categories are open. @default 3600
   */
  lineInterval?: number;
  /**
   * Distance from the top of the viewport for the narrow-screen bar — it sits
   * under your header, so this should be the header's height plus a little.
   * Sets --hs-ckbar-top. @default 72
   */
  topOffset?: number | string;
  /**
   * Which of the two layouts to show. "auto" lets the viewport decide — the
   * card above 768px, the compact top bar below. Pin it to "card" or
   * "compact" to override, which is also the only way to preview the compact
   * bar inside a frame, since the swap is a viewport media query.
   * @default "auto"
   */
  variant?: "auto" | "card" | "compact";
  /** Stacking order. @default 9400 */
  zIndex?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The cookie consent card: a small pinned card that expands in place to show
 * per-category toggles.
 *
 * Uncontrolled it appears once the reader has scrolled past a viewport, so it
 * does not greet them before they have seen anything. Pass `open` to drive it
 * from your own consent state.
 */
export function PrivacyBanner({
  title = "We value your privacy",
  children = "We use cookies to enhance your browsing experience and analyze traffic. By clicking “Accept All”, you consent to our cookie use.",
  categories = PRIVACY_CATEGORIES,
  open,
  onChoice,
  appearAfter,
  lines = PRIVACY_LINES,
  lineInterval = 3600,
  topOffset,
  variant = "auto",
  zIndex,
  className,
  style,
}: PrivacyBannerProps) {
  useInjectedStyle("hs-ckbar", BANNER_CSS_MIN);
  const controlled = open !== undefined;
  const [mounted, setMounted] = React.useState(controlled ? open : false);
  const [shown, setShown] = React.useState(false);
  const [custom, setCustom] = React.useState(false);
  const [on, setOn] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map(c => [c.id, c.required ? true : !!c.defaultOn])),
  );
  const [line, setLine] = React.useState(0);
  const done = React.useRef(false);

  /* The carousel. It holds still while the categories are open, so the line
     someone is reading does not move out from under a toggle they are aiming
     at, and it never runs when there is nothing to cycle. */
  React.useEffect(() => {
    if (!mounted || custom || lines.length < 2) return;
    const t = window.setInterval(() => setLine(i => (i + 1) % lines.length), lineInterval);
    return () => window.clearInterval(t);
  }, [mounted, custom, lines.length, lineInterval]);

  /* Opening the categories returns to the first line, so the collapsed bar
     does not come back mid-cycle on a line that no longer has room. */
  React.useEffect(() => { if (custom) setLine(0); }, [custom]);

  /* Mount, then flip the flag a frame later — the transition needs the closed
     state to have been rendered or the card simply appears. */
  React.useEffect(() => {
    if (!mounted) { setShown(false); return; }
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setShown(true)));
    return () => cancelAnimationFrame(raf);
  }, [mounted]);

  React.useEffect(() => { if (controlled) setMounted(!!open); }, [controlled, open]);

  React.useEffect(() => {
    if (controlled || done.current) return;
    const trigger = () => {
      if (done.current) return;
      const y = window.scrollY || document.documentElement.scrollTop || 0;
      if (y < (appearAfter ?? (window.innerHeight || 800))) return;
      done.current = true;
      setMounted(true);
      window.removeEventListener("scroll", trigger);
    };
    window.addEventListener("scroll", trigger, { passive: true });
    trigger();
    return () => window.removeEventListener("scroll", trigger);
  }, [controlled, appearAfter]);

  if (!mounted) return null;

  const close = (choice: PrivacyChoice) => {
    done.current = true;
    setShown(false);
    const answer =
      choice === "all"
        ? Object.fromEntries(categories.map(c => [c.id, true]))
        : choice === "none"
          ? Object.fromEntries(categories.map(c => [c.id, !!c.required]))
          : on;
    onChoice?.(choice, answer);
    /* Let the exit play out before it leaves the tree. */
    window.setTimeout(() => { if (!controlled) setMounted(false); }, 420);
  };

  /* Both trees carry the same overrides; the media query decides which one is
     displayed. Rendering both is how the site does it, and it keeps the swap
     a pure CSS decision — no viewport measuring, so no flash of the wrong one
     on first paint and nothing to get wrong during hydration. */
  const vars = {
    ...(zIndex !== undefined ? ({ "--hs-ckbar-z": zIndex } as React.CSSProperties) : null),
    ...(topOffset !== undefined
      ? ({ "--hs-ckbar-top": typeof topOffset === "number" ? `${topOffset}px` : topOffset } as React.CSSProperties)
      : null),
    ...style,
  };
  const pin = variant === "auto" ? null : { "data-variant": variant };

  const toggle = (c: PrivacyCategory) => (
    <Swt
      size="sm"
      checked={c.required ? true : !!on[c.id]}
      disabled={c.required}
      onChange={(v: boolean) => setOn(s => ({ ...s, [c.id]: v }))}
    />
  );

  const mobile = (
    <div
      className={["hs-ckbar-m", className].filter(Boolean).join(" ")}
      style={vars}
      role="dialog"
      aria-label="Cookie preferences"
      {...(shown ? { "data-in": "" } : {})}
      {...(custom ? { "data-wide": "" } : {})}
      {...pin}
    >
      <div className="hs-ckbar-m__main">
        {/* aria-live so the rotation is announced; the track is transform-only
            so every line stays in the accessibility tree either way. */}
        <div className="hs-ckbar-m__vp" aria-live="polite" aria-atomic="true">
          <div className="hs-ckbar-m__track" style={{ transform: `translateX(${-100 * line}%)` }}>
            {lines.map((l, i) => (
              <span className="hs-ckbar-m__line" key={i} {...(i === line ? null : { "aria-hidden": "true" })}>{l}</span>
            ))}
          </div>
        </div>
        {!custom && (
          <button type="button" className="hs-ckbar-m__btn" onClick={() => setCustom(true)}>More</button>
        )}
        {custom && (
          <button type="button" className="hs-ckbar-m__btn" onClick={() => close("custom")}>Save</button>
        )}
        <button type="button" className="hs-ckbar-m__btn hs-ckbar-m__btn--primary" onClick={() => close("all")}>Accept</button>
      </div>

      {custom && categories.length > 0 && (
        <div className="hs-ckbar-m__cats">
          {categories.map(c => (
            <label className="hs-ckbar-m__cat" key={c.id}>
              <span>{c.label}</span>
              {toggle(c)}
            </label>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <>
    <div
      className={["hs-ckbar", className].filter(Boolean).join(" ")}
      style={vars}
      role="dialog"
      aria-label="Cookie preferences"
      {...(shown ? { "data-in": "" } : {})}
      {...pin}
    >
      <h3 className="hs-ckbar__h">{title}</h3>
      <p className="hs-ckbar__p">{children}</p>

      {custom && categories.length > 0 && (
        <div className="hs-ckbar__cats">
          <div className="hs-ckbar__rule" />
          <div className="hs-ckbar__row">
            {categories.map(c => (
              <label className="hs-ckbar__cat" key={c.id}>
                <span>{c.label}</span>
                {toggle(c)}
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="hs-ckbar__actions">
        {!custom && (
          <button type="button" className="hs-ckbar__btn" onClick={() => setCustom(true)}>Customize</button>
        )}
        {custom && (
          <button type="button" className="hs-ckbar__btn" onClick={() => close("custom")}>Save choices</button>
        )}
        <button type="button" className="hs-ckbar__btn" onClick={() => close("none")}>Reject All</button>
        <button type="button" className="hs-ckbar__btn hs-ckbar__btn--primary" onClick={() => close("all")}>Accept All</button>
      </div>
    </div>
    {mobile}
    </>
  );
}
