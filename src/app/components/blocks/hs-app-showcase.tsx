import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { safeHref, backgroundImage } from "../ui/hs-url";

import stepIcons from "../../../assets/showcase/step-icons.webp";
import appStoreBadge from "../../../assets/showcase/appstore-badge.svg?url";
import phoneStill from "../../../assets/showcase/phone.webp";
import tabletStill from "../../../assets/showcase/tablet.webp";
import phoneClip from "../../../assets/showcase/phone.webm";
import digitalClip from "../../../assets/showcase/digital-3d.webm";

/* ═══════════════════════════════════════════════════════════════════════════
   APP SHOWCASE — the marketing site's three-up device row.

   Three panels: the iOS app, how a card gets made, and digital cards. Each is
   drawn on a fixed 384 × 644 canvas and scaled to whatever column it lands in,
   which is how the tilted step cards keep their exact angles and overlaps at
   any width. `useFitScale` below measures the column and drives that scale.

   Motion is CSS gated on a data-shown flag rather than the shared reveal
   cascade, because these do not just land — the cards float on afterwards, and
   the cascade cleans its inline transforms off once it has finished.

   Both clips ship with the package — VP9 WebM with an alpha channel, about
   9.9 MB together — because the devices moving IS the block. They are emitted
   as files, never inlined: see the assetsInlineLimit note in vite.config.ts.
   An alpha WebP still of each ships too, used as the poster while the clip
   loads, and as the whole fallback in Safari, which has never supported alpha
   WebM. Point `ios.video` / `digital.video` elsewhere to host your own, and
   note that a clip WITHOUT alpha still gets the Safari still rather than
   playing there — the fallback is keyed on the browser, not on the file.
   ═══════════════════════════════════════════════════════════════════════════ */

/** The canvas every panel is authored on. */
const FIT_W = 384;
const FIT_H = 644;
/** Past this the panels stop growing, so they never dwarf the page. */
const FIT_MAX = 1.15;

/**
 * Scale each panel's fixed canvas to its column.
 *
 * This cannot be done in CSS: a `scale()` needs a unitless number, and CSS has
 * no way to divide a length by a length to produce one — `100cqw / 384px` is
 * not computable. So the column is measured instead, and the scale, the
 * centring offset and the resulting height are written back as properties.
 */
function useFitScale(rootRef: React.RefObject<HTMLDivElement | null>, deps: React.DependencyList) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const fit = () => {
      for (const cell of Array.from(root.querySelectorAll<HTMLElement>(".hs-fx__cell"))) {
        /* Clear first: the height we set last time would otherwise feed back
           into the measurement and the panel would creep. */
        cell.style.height = "";
        const w = cell.clientWidth;
        if (!w) continue;
        const s = Math.min(w / FIT_W, FIT_MAX);
        const box = cell.querySelector<HTMLElement>(".hs-fx__fit");
        if (box) {
          box.style.setProperty("--fx-s", s.toFixed(5));
          box.style.setProperty("--fx-x", ((w - FIT_W * s) / 2).toFixed(2) + "px");
        }
        cell.style.height = Math.round(FIT_H * s) + "px";
      }
    };

    fit();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", fit);
      return () => window.removeEventListener("resize", fit);
    }
    const ro = new ResizeObserver(fit);
    ro.observe(root);
    for (const cell of Array.from(root.querySelectorAll(".hs-fx__cell"))) ro.observe(cell);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, ...deps]);
}

/* ── Content model ─────────────────────────────────────────────────────────
   Every default is exported, so a consumer can take the approved set, change
   one field, or replace it wholesale without forking the component. */

export interface AppShowcaseVideo {
  src: string;
  /** Shown instead of `src` where alpha WebM is unsupported — Safari. */
  fallbackSrc?: string;
  poster?: string;
}

export interface AppShowcaseIosPanel {
  heading?: React.ReactNode;
  desc?: React.ReactNode;
  /** The App Store button. `false` removes it. */
  badge?: { href?: string; src?: string; alt?: string } | false;
  /**
   * Still shown when no `video` is given — the packaged phone by default.
   * `false` leaves the panel with just its copy.
   */
  image?: string | false;
  /** The phone clip. Supplied, it replaces `image`. */
  video?: AppShowcaseVideo;
}

export interface AppShowcaseStep {
  title: React.ReactNode;
  desc: React.ReactNode;
  /** Icon URL, drawn to fit the 64px box. */
  icon?: string;
  /** Crop geometry, for art that is a slice of a larger sheet. Wins over icon. */
  art?: React.CSSProperties;
}

export interface AppShowcaseStepsPanel {
  heading?: React.ReactNode;
  desc?: React.ReactNode;
  /** Up to three; the tilts and overlaps are authored for exactly three. */
  steps?: AppShowcaseStep[];
}

export interface AppShowcaseDigitalPanel {
  heading?: React.ReactNode;
  desc?: React.ReactNode;
  cta?: { label: React.ReactNode; href?: string; onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void } | false;
  /** Still shown when no `video` is given — the packaged tablet by default. */
  image?: string | false;
  /** The tablet clip. Supplied, it replaces `image`. */
  video?: AppShowcaseVideo;
  /** The floating prompt bar over the tablet. `false` removes it. */
  prompt?: { text: React.ReactNode } | false;
}

export const APP_SHOWCASE_STEPS: AppShowcaseStep[] = [
  {
    title: "Share the moment.",
    desc: "Who it’s for, what happened, the inside joke only you two get.",
    art: { left: "5.335px", top: "5.333px", width: "48px", height: "48px", background: `url("${stepIcons}") 2.332% 44.560% / 331.035% 230.112% no-repeat` },
  },
  {
    title: "Stampy design in minute",
    desc: "Stampy drafts artwork and a message made just for them.",
    art: { left: "7.998px", top: "5.334px", width: "42.218px", height: "48px", background: `url("${stepIcons}") 50.131% 41.267% / 396.899% 232.727% no-repeat` },
  },
  {
    title: "We print and send it.",
    desc: "Thick 350gsm paper, a real stamp, and first-class post straight.",
    art: { left: "5.331px", top: "5.334px", width: "48px", height: "48px", background: `url("${stepIcons}") 97.927% 48.700% / 323.368% 229.083% no-repeat` },
  },
];

export const APP_SHOWCASE_IOS: AppShowcaseIosPanel = {
  heading: "Meet HeartStamp on IOS",
  desc: "Send a card from the couch, the queue, or the car. No desk, no laptop, no waiting.",
  badge: { href: "#" },
  image: phoneStill,
  video: { src: phoneClip, poster: phoneStill },
};

export const APP_SHOWCASE_STEPS_PANEL: AppShowcaseStepsPanel = {
  heading: "Tell us the moment. We’ll handle the rest",
  desc: (
    <>
      Meet the <u>world's first AI-powered</u> greeting card platform. Our Stampy designs a
      one-of-a-kind card for your moment, we print it on thick 350gsm paper and post it within 24
      hours.
    </>
  ),
  steps: APP_SHOWCASE_STEPS,
};

export const APP_SHOWCASE_DIGITAL: AppShowcaseDigitalPanel = {
  heading: "A digital card unlike anything you’ve seen",
  desc: "500+ animated backgrounds, effects, and stamps that sparkle, shimmer, and snow. Realistic, fun to edit, all yours. Send by link or QR, no printing, no waiting.",
  cta: { label: "Get started for free", href: "#" },
  image: tabletStill,
  video: { src: digitalClip, poster: tabletStill },
  prompt: { text: "Make me a digital graduation card for my daughter." },
};

/** The App Store badge that ships with the package. */
export const APP_SHOWCASE_BADGE = appStoreBadge;

const FX_CSS = `
.hs-fx {
  container-type: inline-size;
  width: 100%;
  box-sizing: border-box;
}
.hs-fx__row {
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
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-6);
}
/* The panel ground. The site keeps this a flat neutral in both themes rather
   than the page surface, so the devices always sit on a card. */
.hs-fx__cell {
  position: relative;
  width: 100%;
  overflow: hidden;
  aspect-ratio: 384 / 644;
  background: var(--hs-fx-panel, var(--color-brand-secondary-dim));
  border-radius: var(--radius-lg, 12px);
}
/* Fixed canvas, scaled to the column by useFitScale. */
.hs-fx__fit {
  position: absolute;
  left: 0;
  top: 0;
  width: 384px;
  height: 644px;
  transform-origin: 0 0;
  transform: translateX(var(--fx-x, 0px)) scale(var(--fx-s, 1));
  backface-visibility: hidden;
}
/* The iOS panel is a flow column; the other two place children absolutely. */
.hs-fx__fit--flow {
  box-sizing: border-box;
  padding: var(--space-12) 23px 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  justify-content: center;
  align-items: center;
}

.hs-fx__copy {
  align-self: stretch;
  flex: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  align-items: center;
}
.hs-fx__h {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-subheadline);
  line-height: 1.2;
  text-align: center;
  color: var(--color-text-primary);
}
.hs-fx__p {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.5;
  text-align: center;
  color: var(--color-text-secondary);
}
.hs-fx__p u { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }

/* Apple's badge guidelines fix the plate at black in every context, so this
   one stays a literal on purpose — a theme-tracking token here would put the
   white Apple logo on a light plate in light mode. Same for the hover lift. */
.hs-fx__badge {
  width: 176px;
  height: 52px;
  flex: none;
  display: block;
  border-radius: var(--radius-lg);
  background: #000000;
  transition: background 150ms ease;
}
.hs-fx__badge:hover { background: #1c1c1c; }
.hs-fx__badge img { width: 176px; height: 52px; display: block; }

/* The clips carry their own baked-in ground, so on a dark page they read as a
   bright plate. The marketing site's answer is not to remove it — it cannot,
   the pixels are opaque — but to take the glare off every image and video in
   dark mode. Same treatment here, exposed so a consumer whose theme is a
   manual toggle rather than the OS setting can drive it. */
.hs-fx__phone, .hs-fx__tablet { filter: var(--hs-fx-media-dim, none); }
@media (prefers-color-scheme: dark) {
  .hs-fx { --hs-fx-media-dim: brightness(0.9) saturate(0.96); }
}

.hs-fx__phone {
  width: 84.375%;
  height: 405px;
  flex: none;
  margin-top: auto;
  object-fit: cover;
  object-position: center top;
  display: block;
  background: transparent;
}

/* ── Steps panel ─────────────────────────────────────────────────────────── */
.hs-fx__head {
  position: absolute;
  left: 5.2083%;
  top: 31px;
  width: 89.5833%;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: center;
}
/* Each card is placed, tilted and sized exactly as drawn; the wrappers exist
   so the entry rise and the endless float can run on separate transforms
   without either cancelling the tilt. */
.hs-fx__step { position: absolute; transform-origin: 0 0; z-index: 1; width: 89.5833%; height: 120px; }
.hs-fx__step--1 { left: 7.4016%; top: 212px; transform: rotate(3.556deg); }
.hs-fx__step--2 { left: 5.2083%; top: 353.383px; transform: rotate(-3.727deg); }
.hs-fx__step--3 { left: 7.1208%; top: 453.758px; transform: rotate(6.373deg); }
.hs-fx__rise, .hs-fx__float { width: 100%; height: 100%; }
.hs-fx__card {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 16px;
  background: var(--hs-fx-card, color-mix(in srgb, var(--color-bg-main) 70%, transparent));
  box-shadow: inset 0 0 0 1px var(--hs-fx-card-line, color-mix(in srgb, var(--color-text-primary) 20%, transparent));
  display: flex;
  flex-direction: row;
  gap: var(--space-3);
  padding: var(--space-6) var(--space-4);
  align-items: flex-start;
  cursor: default;
  transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 300ms ease, background-color 300ms ease;
}
.hs-fx__step--1 .hs-fx__card:hover { transform: translateY(-6px) rotate(-1.2deg); }
.hs-fx__step--2 .hs-fx__card:hover { transform: translateY(-6px) rotate(1.2deg); }
.hs-fx__step--3 .hs-fx__card:hover { transform: translateY(-6px) rotate(-1.4deg); }
.hs-fx__card:hover {
  background: var(--hs-fx-card-hover, color-mix(in srgb, var(--color-bg-main) 95%, transparent));
  box-shadow: inset 0 0 0 1px var(--hs-fx-card-line-hover, color-mix(in srgb, var(--color-text-primary) 26%, transparent)), 0 16px 32px color-mix(in srgb, var(--color-text-primary) 13%, transparent);
}
.hs-fx__icon { position: relative; width: 64px; height: 64px; flex: none; }
.hs-fx__icon > span { position: absolute; display: block; }
.hs-fx__icon > span[data-plain] { inset: 8px; background-position: center; background-repeat: no-repeat; background-size: contain; }
.hs-fx__ctext { display: flex; flex-direction: column; gap: var(--space-2); align-items: flex-start; flex: 1; min-width: 0; }
.hs-fx__ctitle {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 500;
  font-size: var(--font-size-h5);
  line-height: 1.2;
  color: var(--color-text-primary);
}
.hs-fx__cdesc {
  align-self: stretch;
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: var(--font-size-body-13);
  line-height: 1.5;
  color: var(--color-text-secondary);
}
/* The soft shadows the cards throw onto the panel. */
.hs-fx__blur { position: absolute; transform-origin: 0 0; z-index: 0; }
.hs-fx__blur--2 { left: 17.0919%; top: 351.227px; transform: rotate(-6.6deg); width: 74.9294%; height: 90.473px; }
.hs-fx__blur--3 { left: 82.2917%; top: 576px; transform: rotate(-169.66deg); width: 75%; height: 144px; }
.hs-fx__blur > div > div {
  width: 100%;
  height: 100%;
  border-radius: var(--radius-2xl);
  background: color-mix(in srgb, var(--color-text-primary) 10%, transparent);
  filter: blur(12px);
  will-change: filter, transform;
}

/* ── Digital panel ───────────────────────────────────────────────────────── */
.hs-fx__wash {
  position: absolute;
  left: 5.2083%;
  top: -28px;
  width: 89.5833%;
  height: 380px;
  border-radius: 0 0 20px 20px;
  /* Starts fully transparent, NOT at the panel colour. The panel token is
     translucent, so painting it again here stacked two washes of ink and the
     gradient read as a grey card sitting on the panel — 12 units too dark
     where the original blends away to nothing. Only the far end adds ink. */
  background: linear-gradient(
    146.144deg,
    transparent 41.21%,
    var(--hs-fx-wash, color-mix(in srgb, var(--color-text-primary) 7.5%, transparent)) 99.07%
  );
}
.hs-fx__tablet {
  /* No ground of its own, so an alpha clip composites onto the panel. */
  background: transparent;
  position: absolute;
  left: 0;
  top: 14px;
  width: 97.1354%;
  height: 210px;
  object-fit: cover;
  object-position: 100% 100%;
  display: block;
}
.hs-fx__dcopy {
  position: absolute;
  left: 5.2083%;
  top: 383px;
  width: 89.5833%;
  box-sizing: border-box;
  padding: 0 var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  align-items: flex-start;
}
.hs-fx__dcopy .hs-fx__p { font-size: var(--font-size-body-15); white-space: pre-line; }
.hs-fx__cta {
  align-self: center;
  margin-top: var(--space-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 var(--space-6);
  border-radius: var(--radius-button);
  background: var(--hs-fx-cta, var(--color-brand-secondary));
  font-family: var(--font-family-body);
  font-weight: 600;
  font-size: var(--font-size-body-15);
  line-height: 1;
  color: var(--color-text-on-secondary);
  text-decoration: none;
  border: 0;
  cursor: pointer;
  transition: background 150ms ease;
}
.hs-fx__cta:hover { background: var(--hs-fx-cta-hover, var(--color-brand-secondary-hover)); }
/* The float wrapper has to carry the full height through, or the box below it
   sizes to its content (83px instead of 102px) and space-between pulls the
   button row 19px up into the text. */
.hs-fx__prompt > div { width: 100%; height: 100%; }
.hs-fx__prompt { position: absolute; left: 6.4026%; top: 238.389px; transform: rotate(-4.588deg); transform-origin: 0 0; width: 87.119%; height: 102px; }
.hs-fx__promptbox {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: var(--radius-2xl);
  background: var(--color-bg-main);
  box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--color-text-primary) 35%, transparent);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
}
.hs-fx__promptrow {
  align-self: stretch;
  height: 20px;
  box-sizing: border-box;
  padding: 0 var(--space-1-5);
  margin-top: 7px;
  display: flex;
  flex-direction: row;
  gap: var(--space-2-5);
  align-items: center;
}
.hs-fx__prompttext {
  flex: 1;
  font-family: var(--font-family-body);
  font-weight: 400;
  font-size: var(--font-size-body-15);
  line-height: 20px;
  color: var(--color-text-secondary);
}
.hs-fx__promptbar { align-self: stretch; height: 32px; display: flex; flex-direction: row; justify-content: space-between; align-items: flex-end; }
.hs-fx__pbtn { width: 32px; height: 32px; border-radius: var(--radius-full); background: var(--color-state-hover); display: flex; align-items: center; justify-content: center; flex: none; }
.hs-fx__pgroup { display: flex; flex-direction: row; gap: var(--space-1); align-items: center; flex: none; }

/* ── Motion ──────────────────────────────────────────────────────────────── */
@keyframes hs-fx-rise { from { opacity: 0; transform: translateY(72px); } to { opacity: 1; transform: translateY(0); } }
@keyframes hs-fx-float { 0%, 100% { transform: translateY(-5px) rotate(-0.35deg); } 50% { transform: translateY(6px) rotate(0.35deg); } }
@keyframes hs-fx-float2 { 0%, 100% { transform: translateY(5px) rotate(0.4deg); } 50% { transform: translateY(-6px) rotate(-0.3deg); } }

/* Columns rise together, then the step cards land one after another, then the
   float loops take over. Everything waits for the row to be on screen. */
.hs-fx[data-shown] .hs-fx__cell { animation: hs-fx-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.hs-fx[data-shown] .hs-fx__cell:nth-child(1) { animation-delay: 0ms; }
.hs-fx[data-shown] .hs-fx__cell:nth-child(2) { animation-delay: 110ms; }
.hs-fx[data-shown] .hs-fx__cell:nth-child(3) { animation-delay: 220ms; }
.hs-fx:not([data-shown]) .hs-fx__cell { opacity: 0; }

.hs-fx[data-shown] .hs-fx__rise { animation: hs-fx-rise 900ms cubic-bezier(0.22, 1, 0.36, 1) both; }
.hs-fx[data-shown] .hs-fx__step--1 .hs-fx__rise, .hs-fx[data-shown] .hs-fx__blur--1 .hs-fx__rise { animation-delay: 420ms; }
.hs-fx[data-shown] .hs-fx__step--2 .hs-fx__rise, .hs-fx[data-shown] .hs-fx__blur--2 .hs-fx__rise { animation-delay: 560ms; }
.hs-fx[data-shown] .hs-fx__step--3 .hs-fx__rise, .hs-fx[data-shown] .hs-fx__blur--3 .hs-fx__rise { animation-delay: 700ms; }
.hs-fx:not([data-shown]) .hs-fx__rise { opacity: 0; }

.hs-fx[data-shown] .hs-fx__step--1 .hs-fx__float, .hs-fx[data-shown] .hs-fx__blur--1 .hs-fx__float { animation: hs-fx-float 6.2s ease-in-out 1.45s infinite; }
.hs-fx[data-shown] .hs-fx__step--2 .hs-fx__float, .hs-fx[data-shown] .hs-fx__blur--2 .hs-fx__float { animation: hs-fx-float2 7.4s ease-in-out 1.6s infinite; }
.hs-fx[data-shown] .hs-fx__step--3 .hs-fx__float, .hs-fx[data-shown] .hs-fx__blur--3 .hs-fx__float { animation: hs-fx-float 6.8s ease-in-out 1.75s infinite; }
.hs-fx[data-shown] .hs-fx__prompt > div { animation: hs-fx-float 7.6s ease-in-out infinite; }

@container (max-width: 1040px) {
  .hs-fx__row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .hs-fx__row > *:nth-child(3) { grid-column: 1 / -1; justify-self: center; width: 100%; max-width: 460px; }
}
@container (max-width: 720px) {
  .hs-fx__row { grid-template-columns: minmax(0, 1fr); justify-items: center; }
  .hs-fx__row > * { width: 100%; max-width: 440px; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-fx .hs-fx__cell, .hs-fx .hs-fx__rise, .hs-fx .hs-fx__float, .hs-fx .hs-fx__prompt > div { animation: none !important; opacity: 1 !important; }
  .hs-fx__card { transition: none; }
}

/* ── Type scale below 768px of the BLOCK's width ───────────────────────────
   tokens.css drops the headline sizes at a 767px viewport, which is right for
   a page but blind to a block that is phone-width inside a desktop one — the
   docs preview, or a narrow page column. The same -sm tokens are applied here
   from the block's own container so the type matches the layout that is
   actually being drawn. The tokens are set on the children rather than on the
   root, because an element cannot be matched by the container it establishes. */
@container (max-width: 767px) {
  .hs-fx > * {
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

const FX_CSS_MIN = cssMin(FX_CSS);

/* Safari has never shipped alpha WebM, so the phone clip needs a flat
   fallback there. Checked once, lazily, and never on the server. */
function useAlphaVideoOk() {
  return React.useMemo(() => {
    if (typeof navigator === "undefined") return true;
    const ua = navigator.userAgent;
    return !(/Safari/.test(ua) && !/Chrome|Chromium|Android/.test(ua));
  }, []);
}

/* Lifted from the handoff verbatim, elements and all — an earlier pass
   funnelled these through a paths-only helper, which forced the microphone's
   rounded rect to be approximated and it read wrong at size. */
const STROKE = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "var(--color-text-primary)",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const SparkleIcon = () => (
  <svg style={{ flex: "none" }} width="16" height="16" {...STROKE}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
  </svg>
);

const ImageIcon = () => (
  <svg width="16" height="16" {...STROKE}>
    <path d="M16 5h6" />
    <path d="M19 2v6" />
    <path d="M21 11.5V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7.5" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    <circle cx="9" cy="9" r="2" />
  </svg>
);

const MicIcon = () => (
  <svg width="16" height="16" {...STROKE}>
    <path d="M12 19v3" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <rect x="9" y="2" width="6" height="13" rx="3" />
  </svg>
);

const SendIcon = () => (
  <svg width="18" height="18" {...STROKE}>
    <path d="m5 12 7-7 7 7" />
    <path d="M12 19V5" />
  </svg>
);

export interface AppShowcaseProps {
  /** The iOS panel. `false` removes the column. */
  ios?: AppShowcaseIosPanel | false;
  /** The how-it-works panel. `false` removes the column. */
  steps?: AppShowcaseStepsPanel | false;
  /** The digital-cards panel. `false` removes the column. */
  digital?: AppShowcaseDigitalPanel | false;
  /** Panel ground. Follows the theme unless you pin it. @default var(--color-brand-secondary-dim) */
  panelBackground?: string;
  /** Rise the columns and step cards in on scroll, then float. @default true */
  reveal?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The marketing site's three-up device row: the iOS app, how a card gets
 * made, and digital cards.
 *
 * Each panel is drawn on a fixed 384 × 644 canvas and scaled to its column,
 * which is what keeps the tilted step cards in register at any width. Pass
 * `false` to any panel to drop that column; the grid re-flows to what is left.
 *
 * The video clips are bundled and wired into the exported defaults, so
 * `<AppShowcase />` moves on its own. Point `ios.video` / `digital.video` at
 * your own URLs to host them yourself; both panels also render without a clip
 * at all, falling back to the packaged stills.
 */
export function AppShowcase({
  ios = APP_SHOWCASE_IOS,
  steps = APP_SHOWCASE_STEPS_PANEL,
  digital = APP_SHOWCASE_DIGITAL,
  panelBackground,
  reveal = true,
  className,
  style,
}: AppShowcaseProps) {
  useInjectedStyle("hs-fx", FX_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  const alphaOk = useAlphaVideoOk();
  const [shown, setShown] = React.useState(!reveal);

  useFitScale(rootRef, [ios, steps, digital]);

  React.useEffect(() => {
    if (!reveal) { setShown(true); return; }
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setShown(true); return; }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) { setShown(true); return; }
    const io = new IntersectionObserver(
      es => { if (es[0].isIntersecting) { setShown(true); io.disconnect(); } },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reveal]);

  const stepList = steps === false ? [] : steps.steps ?? APP_SHOWCASE_STEPS;

  return (
    <div
      ref={rootRef}
      className={["hs-fx", className].filter(Boolean).join(" ")}
      style={{ ...(panelBackground ? ({ "--hs-fx-panel": panelBackground } as React.CSSProperties) : null), ...style }}
      {...(shown ? { "data-shown": "" } : {})}
    >
      <div className="hs-fx__row">
        {/* ── iOS ─────────────────────────────────────────────────────── */}
        {ios !== false && (
          <div className="hs-fx__cell">
            <div className="hs-fx__fit hs-fx__fit--flow">
              <div className="hs-fx__copy">
                <div style={{ alignSelf: "stretch", display: "flex", flexDirection: "column", gap: "var(--space-4)", justifyContent: "center", alignItems: "center" }}>
                  {ios.heading != null && <span className="hs-fx__h">{ios.heading}</span>}
                  {ios.desc != null && <span className="hs-fx__p">{ios.desc}</span>}
                </div>
                {ios.badge !== false && ios.badge != null && (
                  <a className="hs-fx__badge" href={safeHref(ios.badge.href)} aria-label={ios.badge.alt ?? "Download on the App Store"}>
                    <img src={ios.badge.src ?? APP_SHOWCASE_BADGE} alt={ios.badge.alt ?? "Download on the App Store"} />
                  </a>
                )}
              </div>
              {(!ios.video || (!alphaOk && !ios.video.fallbackSrc)) && ios.image !== false && ios.image && (
                <img className="hs-fx__phone" src={ios.image} alt="" />
              )}
              {ios.video && (alphaOk || ios.video.fallbackSrc) && (
                <video
                  className="hs-fx__phone"
                  key={alphaOk ? "alpha" : "flat"}
                  src={alphaOk ? ios.video.src : (ios.video.fallbackSrc as string)}
                  poster={ios.video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              )}
            </div>
          </div>
        )}

        {/* ── Steps ───────────────────────────────────────────────────── */}
        {steps !== false && (
          <div className="hs-fx__cell">
            <div className="hs-fx__fit">
              {(steps.heading != null || steps.desc != null) && (
                <div className="hs-fx__head">
                  {steps.heading != null && <span className="hs-fx__h">{steps.heading}</span>}
                  {steps.desc != null && <span className="hs-fx__p">{steps.desc}</span>}
                </div>
              )}
              {stepList.slice(0, 3).map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && (
                    <div className={`hs-fx__blur hs-fx__blur--${i + 1}`} aria-hidden="true">
                      <div className="hs-fx__rise"><div className="hs-fx__float" /></div>
                    </div>
                  )}
                  <div className={`hs-fx__step hs-fx__step--${i + 1}`}>
                    <div className="hs-fx__rise">
                      <div className="hs-fx__float">
                        <div className="hs-fx__card">
                          <div className="hs-fx__icon" aria-hidden="true">
                            <span
                              {...(s.art ? {} : { "data-plain": "" })}
                              style={s.art ?? backgroundImage(s.icon)}
                            />
                          </div>
                          <div className="hs-fx__ctext">
                            <span className="hs-fx__ctitle">{s.title}</span>
                            <span className="hs-fx__cdesc">{s.desc}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* ── Digital ─────────────────────────────────────────────────── */}
        {digital !== false && (
          <div className="hs-fx__cell">
            <div className="hs-fx__fit">
              <div className="hs-fx__wash" aria-hidden="true" />
              {(!digital.video || (!alphaOk && !digital.video.fallbackSrc)) && digital.image !== false && digital.image && (
                <img className="hs-fx__tablet" src={digital.image} alt="" />
              )}
              {digital.video && (alphaOk || digital.video.fallbackSrc) && (
                <video
                  className="hs-fx__tablet"
                  src={alphaOk ? digital.video.src : (digital.video.fallbackSrc as string)}
                  poster={digital.video.poster}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="auto"
                />
              )}
              {digital.prompt !== false && digital.prompt != null && (
                <div className="hs-fx__prompt" aria-hidden="true">
                  <div>
                    <div className="hs-fx__promptbox">
                      <div className="hs-fx__promptrow">
                        <SparkleIcon />
                        <span className="hs-fx__prompttext">{digital.prompt.text}</span>
                      </div>
                      <div className="hs-fx__promptbar">
                        <div className="hs-fx__pbtn">
                          <ImageIcon />
                        </div>
                        <div className="hs-fx__pgroup">
                          <div className="hs-fx__pbtn">
                            <MicIcon />
                          </div>
                          <div className="hs-fx__pbtn" style={{ borderRadius: 20 }}>
                            <SendIcon />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="hs-fx__dcopy">
                {digital.heading != null && <span className="hs-fx__h">{digital.heading}</span>}
                {digital.desc != null && <span className="hs-fx__p">{digital.desc}</span>}
                {digital.cta !== false && digital.cta != null && (
                  <a className="hs-fx__cta" href={safeHref(digital.cta.href)} onClick={digital.cta.onClick}>
                    {digital.cta.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
