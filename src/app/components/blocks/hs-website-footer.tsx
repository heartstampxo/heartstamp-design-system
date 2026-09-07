import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { safeHref } from "../ui/hs-url";

import emblem from "../../../assets/footer/emblem.svg?url";
import wordmark from "../../../assets/footer/wordmark.svg?url";
import visa from "../../../assets/payment_logos/visa.svg?url";
import amex from "../../../assets/payment_logos/amex.svg?url";
import googlePay from "../../../assets/footer/google-pay.svg?url";
import applePay from "../../../assets/footer/apple-pay.svg?url";

/* ═══════════════════════════════════════════════════════════════════════════
   WEBSITE FOOTER — the marketing site's footer.

   Link columns, the oversized masked lockup, payment marks, the app button
   and social links, on the brand's dark ground. Distinct from the packaged
   `Footer`, which is the compact two-layout one; this is the tall marketing
   version the homepage runs.

   It is drawn to sit UNDER the CtaBand: a −32px top margin pulls it up so the
   two read as one closing surface rather than two dark bands with a seam.
   That is why they are documented together as one section.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FooterColumn {
  title: React.ReactNode;
  /** One link per line. Strings keep the site's newline form; nodes for real links. */
  links: React.ReactNode;
}

export interface FooterPayment {
  src: string;
  alt: string;
  /** Marks drawn in white need flattening onto the light chip. */
  filter?: string;
}

export const WEBSITE_FOOTER_COLUMNS: FooterColumn[] = [
  { title: "My HeartStamp", links: "Create Account\nSign In\nAddress Book\nReminders\nOrder History" },
  { title: "Need Some Help?", links: "Contact Us\nWhere is My Order?\nDelivery Information\nFAQs" },
  { title: "About Us", links: "Our Story\nBlog\nPress Enquiries\nCareers\nSustainability" },
  { title: "The Small Details", links: "Privacy Notice\nResponsible Disclosure\nSite Map\nTerms & Conditions\nPromotional Terms & Conditions\nUser Generated Content\nCookies\nAccessibility" },
];

export const WEBSITE_FOOTER_PAYMENTS: FooterPayment[] = [
  { src: visa, alt: "Visa" },
  { src: amex, alt: "American Express" },
  { src: googlePay, alt: "Google Pay" },
  { src: applePay, alt: "Apple Pay", filter: "brightness(0)" },
];

const FOOTER_CSS = `
.hs-wfoot {
  container-type: inline-size;
  align-self: stretch;
  width: 100%;
  /* No pull by default. On the marketing page the footer carries -32px, but
     that cancels a gap the homepage's own layout introduces — composed
     directly against CtaBand it instead slides over the band's bottom border
     and swallows the separator between the two. Opt in with the tuck prop when you
     are reproducing that layout and have the gap to cancel. */
  margin-top: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* The lockup is a WATERMARK, not a logo: it sits a hair off the ground and
     fades into it. The far stop is the ground itself, so the mark dissolves;
     the near stops are one small step away from it, derived rather than
     literal so they track whichever ground the theme hands us. Getting these
     the wrong way round turns a deboss into a bright slab across the footer. */
  /* The emblem is DEBOSSED, the wordmark sits a shade the other way, and both
     fade into the ground. The two themes use genuinely different deltas
     against very different grounds — −11 and +20 on the dark ground, −17 and
     −10 on the light one — so one derived mix cannot serve both; these are the
     site's own values. Only the far stop is derived, because that one must
     always equal the ground or the mark stops dissolving.
     A theme driven by a class rather than the OS setting should set these
     three properties itself. */
  --hs-wfoot-mark-a: rgb(25, 25, 25);
  --hs-wfoot-mark-a2: rgb(56, 56, 56);
  --hs-wfoot-mark-b: var(--color-brand-secondary);
  --hs-wfoot-chip: #ffffff;
}
@media (prefers-color-scheme: dark) {
  .hs-wfoot {
    --hs-wfoot-mark-a: #e4e3e1;
    --hs-wfoot-mark-a2: #ebeae8;
  }
}
.hs-wfoot__top {
  align-self: stretch;
  box-sizing: border-box;
  background: var(--color-brand-secondary);
  padding: 56px 0 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
}
.hs-wfoot__inner {
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
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.hs-wfoot__row {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.hs-wfoot__about { width: 253px; flex: none; display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start; }
/* The link columns sit ON the grid, not at an arbitrary width: eight of the
   twelve on the 1200px track, seven once it widens to 1400px. Both are derived
   from the tokens, so a change to the gutter or the column count carries here
   rather than needing this recomputed by hand.
     column  = (track - 11 gutters) / 12
     N spans = N columns + (N-1) gutters                                     */
.hs-wfoot__cols {
  --wf-gutter: var(--grid-gutter, 24px);
  --wf-col: calc((100% - 11 * var(--wf-gutter)) / 12);
  width: calc(8 * var(--wf-col) + 7 * var(--wf-gutter));
  flex: none;
  display: flex;
  flex-direction: row;
  /* The gutter, so the four lists land on grid columns two apart. */
  gap: var(--wf-gutter);
  justify-content: flex-end;
  align-items: flex-start;
}
@media (min-width: 2000px) {
  .hs-wfoot__cols { width: calc(7 * var(--wf-col) + 6 * var(--wf-gutter)); }
}
.hs-wfoot__col { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start; }
.hs-wfoot__ct {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-h4);
  line-height: 100%;
  color: var(--color-text-on-secondary);
}
.hs-wfoot__cl {
  align-self: stretch;
  white-space: pre-line;
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: 16px;
  line-height: 2.2;
  color: var(--color-text-on-secondary);
  opacity: 0.7;
}
.hs-wfoot__about .hs-wfoot__ct { font-weight: 600; }
/* The About copy is set apart from the link lists: heavier, and on a normal
   reading line rather than the 2.2 the link columns use to space out links. */
.hs-wfoot__about .hs-wfoot__cl { font-weight: 400; line-height: 1.5; }

/* The oversized lockup. Both halves are a gradient masked by the artwork, so
   the mark takes the theme's own tones rather than shipping two colourways. */
/* Everything here is a percentage of the 1199x306 the mark was drawn at, so
   it scales to whatever width it is given instead of overflowing and being
   clipped on one side. */
.hs-wfoot__mark { position: relative; align-self: stretch; overflow: hidden; margin-top: -30px; }
.hs-wfoot__mark > div { position: relative; width: 100%; max-width: 1199px; margin: 0 auto; aspect-ratio: 1199 / 306; }
.hs-wfoot__emblem {
  position: absolute; left: 0; top: 0; width: 25.521%; height: 100%;
  background: linear-gradient(180deg, var(--hs-wfoot-mark-a) 0%, var(--hs-wfoot-mark-b) 86.44%);
  -webkit-mask: url("${emblem}") center / contain no-repeat;
  mask: url("${emblem}") center / contain no-repeat;
}
.hs-wfoot__wordmark {
  position: absolute; left: 4.254%; top: 15.359%; width: 95.746%; height: 73.856%;
  background: linear-gradient(180deg, var(--hs-wfoot-mark-a2) 0%, var(--hs-wfoot-mark-b) 68.81%);
  -webkit-mask: url("${wordmark}") center / contain no-repeat;
  mask: url("${wordmark}") center / contain no-repeat;
}

.hs-wfoot__bar {
  align-self: stretch;
  box-sizing: border-box;
  background: var(--color-brand-secondary);
  border-top: 1px solid var(--color-brand-secondary-hover);
  padding: var(--space-4) 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}
.hs-wfoot__barin {
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
  box-sizing: border-box;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.hs-wfoot__left { display: flex; flex-direction: row; gap: var(--space-16); align-items: flex-start; }
.hs-wfoot__grp { display: flex; flex-direction: column; gap: var(--space-4); align-items: flex-start; }
.hs-wfoot__gt {
  font-family: var(--font-family-heading);
  font-weight: 400;
  font-size: 16px;
  line-height: 100%;
  color: var(--color-text-on-secondary);
  white-space: nowrap;
}
.hs-wfoot__pays { display: flex; flex-direction: row; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
/* Card-scheme marks are licensed on a white plate, so the chip does not flip
   with the theme — hence no dark override on --hs-wfoot-chip, and a hairline
   pinned to the light value of --color-element-subtle rather than the token,
   which would go light-on-white in dark mode. */
.hs-wfoot__chip {
  height: 32px;
  box-sizing: border-box;
  border-radius: var(--radius-full);
  background: var(--hs-wfoot-chip);
  box-shadow: inset 0 0 0 1px rgba(36, 36, 35, 0.10);
  padding: var(--space-2) 11px;
  display: flex;
  align-items: center;
}
.hs-wfoot__chip img { height: 16px; width: auto; display: block; }
/* Black plate, white glyph — Apple's badge guidelines, fixed in both themes.
   See the note on .hs-fx__badge in hs-app-showcase. */
.hs-wfoot__app {
  width: 135px; height: 40px; box-sizing: border-box;
  border-radius: var(--radius-sm);
  background: #000000;
  box-shadow: inset 0 0 0 1px var(--color-brand-secondary-hover);
  display: flex; flex-direction: row; gap: var(--space-2);
  padding: 0 var(--space-2-5); align-items: center;
  color: #ffffff; text-decoration: none;
  transition: opacity 150ms ease;
}
.hs-wfoot__app:hover { opacity: 0.88; }
.hs-wfoot__socials { display: flex; flex-direction: row; gap: var(--space-2); align-items: center; flex-wrap: wrap; }
.hs-wfoot__soc {
  width: 32px; height: 32px;
  border-radius: var(--radius-full);
  box-shadow: inset 0 0 0 1px var(--color-brand-secondary-hover);
  display: flex; align-items: center; justify-content: center;
  color: var(--color-text-on-secondary);
  transition: background 150ms ease;
}
.hs-wfoot__soc:hover { background: var(--color-brand-secondary-hover); }

@keyframes hs-hero-up { from { opacity: 0; transform: translateY(48px); } to { opacity: 1; transform: translateY(0); } }
.hs-wfoot:not([data-shown]) .hs-wfoot__row,
.hs-wfoot:not([data-shown]) .hs-wfoot__mark,
.hs-wfoot:not([data-shown]) .hs-wfoot__barin { opacity: 0; }
.hs-wfoot[data-shown] .hs-wfoot__row,
.hs-wfoot[data-shown] .hs-wfoot__mark,
.hs-wfoot[data-shown] .hs-wfoot__barin {
  animation: hs-hero-up 0.65s cubic-bezier(0.22, 1.18, 0.36, 1) both;
}
.hs-wfoot[data-shown] .hs-wfoot__row { animation-delay: 0.15s; }
.hs-wfoot[data-shown] .hs-wfoot__mark { animation-delay: 0.32s; }
.hs-wfoot[data-shown] .hs-wfoot__barin { animation-delay: 0.49s; }

@container (max-width: 900px) {
  .hs-wfoot__row, .hs-wfoot__barin, .hs-wfoot__left { flex-direction: column; align-items: stretch; gap: var(--space-6); }
  .hs-wfoot__about, .hs-wfoot__cols { width: 100%; }
  .hs-wfoot__cols { flex-wrap: wrap; justify-content: flex-start; }
  .hs-wfoot__col { flex: 1 1 45%; }
  /* The lockup is drawn at a fixed 1199px; scaled down it just becomes a
     smear, so it goes rather than shrinking. */
  .hs-wfoot__mark { display: none; }
  .hs-wfoot__top { padding-top: var(--space-10); }
}
@media (prefers-reduced-motion: reduce) {
  .hs-wfoot[data-shown] .hs-wfoot__row,
  .hs-wfoot[data-shown] .hs-wfoot__mark,
  .hs-wfoot[data-shown] .hs-wfoot__barin { animation: none; }
  .hs-wfoot:not([data-shown]) .hs-wfoot__row,
  .hs-wfoot:not([data-shown]) .hs-wfoot__mark,
  .hs-wfoot:not([data-shown]) .hs-wfoot__barin { opacity: 1; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-wfoot > * {
    --font-size-h1: var(--font-size-h1-sm, 34px);
    --line-height-h1: var(--line-height-h1-sm, 1.15);
    --font-size-h2: var(--font-size-h2-sm, 28px);
    --line-height-h2: var(--line-height-h2-sm, 1.2);
    --font-size-h3: var(--font-size-h3-sm, 24px);
    --line-height-h3: var(--line-height-h3-sm, 1.25);
    --font-size-h4: var(--font-size-h4-sm, 18px);
    --font-size-h5: var(--font-size-h5-sm, 16px);
    --font-size-subheadline: var(--font-size-subheadline-sm, 20px);
    --font-size-subheadline-md: var(--font-size-subheadline-sm, 20px);
  }
}
`;

const FOOTER_CSS_MIN = cssMin(FOOTER_CSS);

/* Straight from the site. Two are filled brand marks at their own sizes; the
   other three are stroked 24x24 line icons, so each carries its own mode. */
const SOCIALS: Record<string, { w: number; h: number; box: string; stroke?: boolean; shapes: React.ReactNode }> = {
  Facebook: { w: 7, h: 16, box: "0 0 7 16", shapes: (
    <path d="M 4.313 3.425 C 4.313 2.781 4.835 2.55 5.419 2.55 C 6.002 2.55 6.626 2.75 6.626 2.75 L 7 0.3 C 7 0.3 6.206 0 4.313 0 C 3.151 0 2.477 0.487 1.984 1.206 C 1.519 1.887 1.502 2.981 1.502 3.688 L 1.502 5.294 L 0 5.294 L 0 7.688 L 1.502 7.688 L 1.502 16 L 4.313 16 L 4.313 7.688 L 6.541 7.688 L 6.705 5.294 L 4.313 5.294 L 4.313 3.425 Z" />
  ) },
  X: { w: 16, h: 14, box: "0 0 16.005 14", shapes: (
    <path d="M 12.645 0 L 15.099 0 L 9.712 5.941 L 16.005 14 L 11.067 14 L 7.2 9.103 L 2.773 14 L 0.32 14 L 6.027 7.646 L 0 0 L 5.061 0 L 8.555 4.474 L 12.645 0 Z M 11.787 12.605 L 13.147 12.605 L 4.347 1.343 L 2.885 1.343 L 11.787 12.605 Z" />
  ) },
  Instagram: { w: 16, h: 16, box: "0 0 24 24", stroke: true, shapes: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ) },
  Pinterest: { w: 16, h: 16, box: "0 0 24 24", stroke: true, shapes: (
    <>
      <path d="M12 2a10 10 0 0 0-3.16 19.5" />
      <path d="M9 21c1-3 2-6 2-6" />
      <path d="M8.5 13.5A4 4 0 1 1 16 11c0 3-2 5-4 5" />
    </>
  ) },
  YouTube: { w: 16, h: 16, box: "0 0 24 24", stroke: true, shapes: (
    <>
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <path d="m10 15 5-3-5-3z" />
    </>
  ) },
};

export interface WebsiteFooterProps {
  /** The "About" column beside the link columns. `false` removes it. */
  about?: { title: React.ReactNode; body: React.ReactNode } | false;
  /** The link columns. */
  columns?: FooterColumn[];
  /** The oversized masked lockup. `false` removes it. */
  mark?: boolean;
  /** Payment marks. `false` removes the group. */
  payments?: FooterPayment[] | false;
  /** The App Store button. `false` removes it. */
  appStore?: { href?: string } | false;
  /** Social links. `false` removes the group. */
  socials?: { label: string; href?: string }[] | false;
  /**
   * Pull up 32px, as the marketing page does. That −32px cancels a gap the
   * homepage's layout introduces; without such a gap it covers the band's
   * bottom border and the separator between the two disappears.
   * @default false
   */
  tuck?: boolean;
  /** Stagger the columns, lockup and bottom bar in on scroll. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The marketing site's footer: link columns, the oversized masked lockup,
 * payment marks, the app button and socials, on the brand's dark ground.
 *
 * Sits directly under `CtaBand`, where that band's bottom border becomes the
 * separator between the two. `tuck` pulls it up 32px for the marketing page's
 * own layout, which covers that border — leave it off unless you need it.
 */
export function WebsiteFooter({
  about = {
    title: "About HeartStamp",
    body: "HeartStamp helps you make personalized greeting cards built around real emotional moments: modern, emotionally literate, design-led.\n\nLas Vegas, NV, US",
  },
  columns = WEBSITE_FOOTER_COLUMNS,
  mark = true,
  payments = WEBSITE_FOOTER_PAYMENTS,
  appStore = { href: "#" },
  socials = [{ label: "Facebook" }, { label: "X" }, { label: "Instagram" }, { label: "Pinterest" }, { label: "YouTube" }],
  tuck = false,
  reveal = true,
  className,
  style,
}: WebsiteFooterProps) {
  useInjectedStyle("hs-wfoot", FOOTER_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(!reveal);

  React.useEffect(() => {
    if (!reveal) { setShown(true); return; }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    const io = new IntersectionObserver(
      es => { if (es[0].isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  return (
    <div
      ref={rootRef}
      className={["hs-wfoot", className].filter(Boolean).join(" ")}
      style={{ ...(tuck ? { marginTop: -32 } : null), ...style }}
      {...(shown ? { "data-shown": "" } : {})}
    >
      <div className="hs-wfoot__top">
        <div className="hs-wfoot__inner">
          <div className="hs-wfoot__row">
            {about !== false && (
              <div className="hs-wfoot__about">
                <span className="hs-wfoot__ct">{about.title}</span>
                <span className="hs-wfoot__cl">{about.body}</span>
              </div>
            )}
            {columns.length > 0 && (
              <div className="hs-wfoot__cols">
                {columns.map((c, i) => (
                  <div className="hs-wfoot__col" key={i}>
                    <span className="hs-wfoot__ct">{c.title}</span>
                    <span className="hs-wfoot__cl">{c.links}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          {mark && (
            <div className="hs-wfoot__mark" role="img" aria-label="HeartStamp">
              <div>
                <div className="hs-wfoot__emblem" />
                <div className="hs-wfoot__wordmark" />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="hs-wfoot__bar">
        <div className="hs-wfoot__barin">
          <div className="hs-wfoot__left">
            {payments !== false && payments.length > 0 && (
              <div className="hs-wfoot__grp">
                <span className="hs-wfoot__gt">Payment Methods</span>
                <div className="hs-wfoot__pays">
                  {payments.map((p, i) => (
                    <div className="hs-wfoot__chip" key={i}>
                      <img src={p.src} alt={p.alt} style={p.filter ? { filter: p.filter } : undefined} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {appStore !== false && (
              <div className="hs-wfoot__grp">
                <span className="hs-wfoot__gt">Our Apps</span>
                <a className="hs-wfoot__app" href={safeHref(appStore.href)}>
                  <svg style={{ flex: "none", marginTop: -2 }} width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.05 12.536c-.026-2.606 2.128-3.854 2.225-3.917-1.211-1.771-3.096-2.014-3.767-2.042-1.604-.163-3.131.944-3.945.944-.813 0-2.069-.92-3.4-.895-1.75.026-3.362 1.017-4.262 2.583-1.816 3.15-.464 7.816 1.306 10.373.865 1.252 1.897 2.657 3.252 2.607 1.305-.052 1.797-.844 3.375-.844 1.578 0 2.021.844 3.401.818 1.404-.026 2.293-1.274 3.152-2.531.993-1.452 1.402-2.858 1.426-2.93-.031-.014-2.736-1.05-2.763-4.166zM14.44 4.9c.72-.87 1.204-2.08 1.072-3.285-1.036.042-2.29.69-3.033 1.559-.667.77-1.25 2.001-1.093 3.182 1.155.09 2.334-.587 3.054-1.456z" />
                  </svg>
                  <span style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontFamily: "var(--font-family-body)", fontSize: 8, lineHeight: "10px", letterSpacing: "0.02em" }}>Download on the</span>
                    <span style={{ fontFamily: "var(--font-family-body)", fontWeight: 500, fontSize: "var(--font-size-body-15)", lineHeight: "18px" }}>App Store</span>
                  </span>
                </a>
              </div>
            )}
          </div>
          {socials !== false && socials.length > 0 && (
            <div className="hs-wfoot__grp">
              <span className="hs-wfoot__gt">Keep in Touch</span>
              <div className="hs-wfoot__socials">
                {socials.map((s, i) => {
                  const art = SOCIALS[s.label];
                  return (
                    <a className="hs-wfoot__soc" key={i} href={safeHref(s.href)} aria-label={s.label}>
                      {art ? (
                        <svg
                          width={art.w}
                          height={art.h}
                          viewBox={art.box}
                          {...(art.stroke
                            ? { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const }
                            : { fill: "currentColor" })}
                          aria-hidden="true"
                        >
                          {art.shapes}
                        </svg>
                      ) : (
                        <span style={{ fontSize: 11 }}>{s.label.slice(0, 1)}</span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
