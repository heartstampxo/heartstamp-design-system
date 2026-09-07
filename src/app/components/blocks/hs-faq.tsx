import * as React from "react";
import { useInjectedStyle, cssMin } from "../ui/hs-style-inject";
import { useRevealCascade } from "../ui/hs-reveal";

/* ═══════════════════════════════════════════════════════════════════════════
   FAQ — the marketing site's question list, and the accordion inside it.

   Two exports, because they are wanted separately:

   · FaqAccordion — the Q/A list on its own. A row is a question, a plus that
     turns into a minus, and an answer that grows open. Drop it anywhere.
   · FaqBlock — the whole page section: labelled groups, rules between them,
     the site's scroll-in cascade, and one answer open across the lot.

   The open/close is a grid-template-rows transition from 0fr to 1fr rather
   than a height animation, so the answer animates to its own natural height
   without anyone measuring it, and reflows if the text wraps differently.
   ═══════════════════════════════════════════════════════════════════════════ */

export interface FaqItem {
  q: React.ReactNode;
  a: React.ReactNode;
}

export interface FaqGroup {
  /** Left-hand label for the group. Omit for an unlabelled list. */
  label?: React.ReactNode;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    label: "General",
    items: [
      { q: "What is Heartstamp?", a: "Heartstamp is a creative platform that helps you create and personalize beautiful digital cards for birthdays, celebrations, thank-yous, invitations, and special moments." },
      { q: "What can I create with Heartstamp?", a: "Printed cards we post for you, animated digital cards you send by link, and invitations — all built around the occasion you pick." },
      { q: "What is Stampy Chat?", a: "Stampy is our fox assistant. Tell it who the card is for and what you want to say, and it drafts the cover art and the message with you." },
    ],
  },
  {
    label: "Printed Cards",
    items: [
      { q: "Do I need design skills to use Heartstamp?", a: "No. Pick an illustration style and Stampy handles the layout, art and typesetting. You can adjust anything you like afterwards." },
      { q: "How does AI card creation work?", a: "You describe the moment, we generate cover art in your chosen style using Heart credits. Every new account starts with 200." },
      { q: "Can I customize my card after creating it?", a: "Yes. Swap the art style, rewrite the message, change the handwriting, or regenerate the cover until it feels right." },
    ],
  },
  {
    label: "Digital Cards",
    items: [
      { q: "Is Heartstamp available on mobile?", a: "Yes. The studio works in any mobile browser, and there is an iOS app for creating and sending on the go." },
      { q: "Can AI create the message for my card too?", a: "It can. Tell Stampy the tone and a few details and it drafts the message — you always get the final edit." },
      { q: "Is my card design private?", a: "Your cards and messages are yours. Nothing you create is shared publicly or shown to other people." },
    ],
  },
  {
    label: "Orders & Credits",
    items: [
      { q: "How do Heart credits work?", a: "Credits pay for art generation. New accounts start with 200, and referring a friend earns you more." },
      { q: "When will my card arrive?", a: "Printed cards leave us the next working day. We can post straight to your recipient or send it to you first." },
      { q: "Can I get a refund?", a: "If a printed card arrives damaged or wrong, tell us and we will reprint and repost it at no cost." },
    ],
  },
];

const FAQ_CSS = `
.hs-faq {
  container-type: inline-size;
  width: 100%;
  box-sizing: border-box;
  background: var(--color-bg-main);
  /* No side padding here: the inner track carries the grid margin, and
     doubling them left this block 48px narrower than every other. */
  display: flex;
  flex-direction: column;
  gap: var(--space-10);
  align-items: center;
}
.hs-faq__inner {
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
  padding-block: 68px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: flex-start;
}
.hs-faq__group {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: flex-start;
}
.hs-faq__rule {
  align-self: stretch;
  height: 1px;
  /* The site uses its own ink triplet here; this is the design system's
     equivalent, and unlike the literal it follows the theme. */
  background: var(--color-element-subtle);
}
.hs-faq__row {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
}
.hs-faq__label {
  flex: none;
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h4);
  line-height: 100%;
  white-space: nowrap;
  color: var(--color-text-primary);
}
/* On its own the accordion fills whatever it is given. The 872px / 72% below
   is the BLOCK's row measurement — the list sharing a row with a group label —
   not a property of the list itself. Leaving it on the base class capped a
   standalone accordion at 72% of its container, which is not a design anyone
   asked for. */
.hs-faq__list {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
  align-items: flex-start;
}
.hs-faq__row .hs-faq__list { width: 872px; max-width: 72%; flex: none; }
/* Unlabelled groups give the list the whole row. */
.hs-faq__row[data-unlabelled] .hs-faq__list { width: 100%; max-width: 100%; flex: 1; }

.hs-faq__item {
  align-self: stretch;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
  /* A button reset: these are real buttons so the list is keyboard operable,
     which the canvas version's div-with-onClick was not. */
  width: 100%;
  border: 0;
  background: none;
  padding: 0;
  text-align: left;
  font: inherit;
  color: inherit;
}
.hs-faq__q {
  align-self: stretch;
  display: flex;
  flex-direction: row;
  gap: var(--space-6);
  justify-content: space-between;
  align-items: flex-start;
}
.hs-faq__qtext {
  font-family: var(--font-family-heading);
  font-weight: 600;
  font-size: var(--font-size-h4);
  line-height: 130%;
  color: var(--color-text-primary);
}
.hs-faq__sign {
  position: relative;
  width: 24px;
  height: 24px;
  flex: none;
  margin-top: 1px;
}
.hs-faq__sign i {
  position: absolute;
  border-radius: 1px;
  background: var(--color-text-primary);
  display: block;
}
.hs-faq__sign i:first-child { left: 3px; top: 11.5px; width: 18px; height: 1.6px; }
/* The upright stroke collapses and turns, so a plus becomes a minus. */
.hs-faq__sign i:last-child {
  left: 11.2px;
  top: 3px;
  width: 1.6px;
  height: 18px;
  transition: transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
  transform: scaleY(1) rotate(0deg);
}
.hs-faq__item[aria-expanded="true"] .hs-faq__sign i:last-child { transform: scaleY(0) rotate(90deg); }

/* 0fr → 1fr: the answer animates to whatever height it actually needs. */
.hs-faq__ans {
  align-self: stretch;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 380ms cubic-bezier(0.22, 1, 0.36, 1);
}
.hs-faq__item[aria-expanded="true"] .hs-faq__ans { grid-template-rows: 1fr; }
.hs-faq__ansinner {
  overflow: hidden;
  min-height: 0;
  opacity: 0;
  transition: opacity 260ms ease;
}
.hs-faq__item[aria-expanded="true"] .hs-faq__ansinner { opacity: 1; }
.hs-faq__atext {
  padding-top: var(--space-4);
  padding-right: var(--space-12);
  font-family: var(--font-family-heading);
  font-weight: 300;
  font-size: 16px;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

@container (max-width: 900px) {
  .hs-faq__inner { padding-block: 48px; }
  /* The label sits above its questions rather than beside them. */
  .hs-faq__row { flex-direction: column; gap: var(--space-4); }
  .hs-faq__row .hs-faq__list { width: 100%; max-width: 100%; }
  .hs-faq__atext { padding-right: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .hs-faq__ans, .hs-faq__ansinner, .hs-faq__sign i:last-child { transition: none; }
}
`;

const FAQ_CSS_MIN = cssMin(FAQ_CSS);

/* ── The accordion on its own ─────────────────────────────────────────────── */

export interface FaqAccordionProps {
  items: FaqItem[];
  /** Controlled open row. `null` closes them all. */
  openIndex?: number | null;
  /** Uncontrolled starting row. `null` starts closed. @default 0 */
  defaultOpenIndex?: number | null;
  /** Fires with the row clicked and whether it is now open. */
  onToggle?: (index: number, open: boolean) => void;
  /** Let the open row be closed by clicking it again. @default true */
  collapsible?: boolean;
  /**
   * Tag the list as a reveal stagger group, so a surrounding block's cascade
   * animates the questions in one after another. Needs a `useRevealCascade`
   * above it; on its own it does nothing. @default false
   */
  revealStagger?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The FAQ question list: one answer open at a time, a plus that turns into a
 * minus, and an answer that grows to its own height.
 *
 * Rows are real `<button>`s, so the list is keyboard operable and screen
 * readers get `aria-expanded` and `aria-controls`.
 */
export function FaqAccordion({
  items,
  openIndex,
  defaultOpenIndex = 0,
  onToggle,
  collapsible = true,
  revealStagger = false,
  className,
  style,
}: FaqAccordionProps) {
  useInjectedStyle("hs-faq", FAQ_CSS_MIN);
  const [inner, setInner] = React.useState<number | null>(defaultOpenIndex);
  const controlled = openIndex !== undefined;
  const open = controlled ? openIndex : inner;
  const uid = React.useId();

  const toggle = (i: number) => {
    const next = open === i && collapsible ? null : i;
    if (!controlled) setInner(next);
    onToggle?.(i, next === i);
  };

  return (
    <div
      className={["hs-faq__list", className].filter(Boolean).join(" ")}
      style={style}
      {...(revealStagger ? { "data-reveal-stagger": "" } : {})}
    >
      {items.map((it, i) => (
        <button
          type="button"
          className="hs-faq__item"
          key={i}
          aria-expanded={open === i}
          aria-controls={`${uid}-${i}`}
          onClick={() => toggle(i)}
        >
          <span className="hs-faq__q">
            <span className="hs-faq__qtext">{it.q}</span>
            <span className="hs-faq__sign" aria-hidden="true">
              <i />
              <i />
            </span>
          </span>
          <span className="hs-faq__ans" id={`${uid}-${i}`} role="region">
            <span className="hs-faq__ansinner">
              <span className="hs-faq__atext">{it.a}</span>
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}

/* ── The whole page section ───────────────────────────────────────────────── */

export interface FaqBlockProps {
  /** The labelled groups. @default FAQ_GROUPS */
  groups?: FaqGroup[];
  /**
   * One answer open across every group, the way the marketing page behaves.
   * With `false` each group keeps its own open row. @default true
   */
  singleOpen?: boolean;
  /**
   * Which row starts open, as `[group, item]`. `null` starts closed.
   * @default [0, 0]
   */
  defaultOpen?: [number, number] | null;
  /** Rules between groups. @default true */
  dividers?: boolean;
  /** Scroll-in cascade. Ignored under reduced motion. @default true */
  reveal?: boolean;
  /** Section padding, as a CSS shorthand. */
  padding?: string;
  /** Fires with the group and item indices, and whether it is now open. */
  onToggle?: (group: number, item: number, open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * The marketing site's FAQ section: labelled groups, a rule between each, and
 * one answer open across the whole list.
 *
 * Bare — `<FaqBlock />` — it is the approved set of questions. Pass `groups`
 * to put your own in, or use `FaqAccordion` directly for a list with no
 * section chrome around it.
 */
export function FaqBlock({
  groups = FAQ_GROUPS,
  singleOpen = true,
  defaultOpen = [0, 0],
  dividers = true,
  reveal = true,
  padding,
  onToggle,
  className,
  style,
}: FaqBlockProps) {
  useInjectedStyle("hs-faq", FAQ_CSS_MIN);
  const rootRef = React.useRef<HTMLDivElement>(null);
  useRevealCascade(rootRef, reveal, [groups, dividers]);

  /* One key for the whole block, so opening an answer in one group closes
     whatever was open in another — as on the site. */
  const [openKey, setOpenKey] = React.useState<string | null>(
    defaultOpen ? `${defaultOpen[0]}-${defaultOpen[1]}` : null,
  );

  return (
    <div
      ref={rootRef}
      className={["hs-faq", className].filter(Boolean).join(" ")}
      style={padding ? { padding, ...style } : style}
    >
      <div className="hs-faq__inner">
        {groups.map((g, gi) => (
          <div className="hs-faq__group" key={gi}>
            {dividers && gi > 0 && <div className="hs-faq__rule" data-reveal />}
            <div className="hs-faq__row" {...(g.label == null ? { "data-unlabelled": "" } : {})}>
              {g.label != null && (
                <span className="hs-faq__label" data-reveal>
                  {g.label}
                </span>
              )}
                <FaqAccordion
                  items={g.items}
                  revealStagger={reveal}
                  {...(singleOpen
                    ? {
                        openIndex: openKey?.startsWith(`${gi}-`)
                          ? Number(openKey.slice(String(gi).length + 1))
                          : null,
                      }
                    : { defaultOpenIndex: defaultOpen && defaultOpen[0] === gi ? defaultOpen[1] : null })}
                  onToggle={(i, isOpen) => {
                    if (singleOpen) setOpenKey(isOpen ? `${gi}-${i}` : null);
                    onToggle?.(gi, i, isOpen);
                  }}
                />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
