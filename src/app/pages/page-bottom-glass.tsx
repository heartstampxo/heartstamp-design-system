import React from "react";
import { RotateCcw } from "lucide-react";
import { DocPage, DocSection } from "../components/docs/doc-page";
import { Preview } from "../components/docs/doc-preview";
import { PropsTable } from "../components/docs/doc-props-table";
import { Callout } from "../components/docs/doc-callout";
import { Acc } from "../components/ui/hs-acc";
import { BottomGlass } from "../components/ui/hs-bottom-glass";
/* Docs only. It is the backdrop the demo blurs, not part of the component —
   which is why it does not appear in the usage sample beside it. */
import backdrop from "../../assets/docs/glass-backdrop.webp";

interface Knobs {
  height: number;
  blurScale: number;
  saturation: number;
  rampOver: number;
  manual: boolean;
  strength: number;
}

/* 180px is the top of the default clamp, so leaving the slider there is the
   same picture as not passing height at all — and the sample omits it. */
const DEFAULTS: Knobs = { height: 180, blurScale: 1, saturation: 95, rampOver: 460, manual: false, strength: 1 };

/**
 * The usage sample, written from whatever the controls are set to. Only what
 * differs from the defaults is emitted, so what you copy is the smallest thing
 * that reproduces what you are looking at.
 */
function buildUsage(k: Knobs): string {
  const props: string[] = [];
  if (k.height !== DEFAULTS.height) props.push(`  height={${k.height}}`);
  if (k.blurScale !== DEFAULTS.blurScale) props.push(`  blurScale={${k.blurScale}}`);
  if (k.saturation !== DEFAULTS.saturation) props.push(`  saturation="${k.saturation}%"`);
  if (k.rampOver !== DEFAULTS.rampOver) props.push(`  rampOver={${k.rampOver}}`);
  if (k.manual) props.push(`  strength={${k.strength}}          // fixed, no scroll listener`);

  const head = [
    'import { BottomGlass } from "@heartstampxo/design-system";',
    "",
    "// Render once, near the root. It is fixed and pointer-events: none,",
    "// so it never intercepts a click.",
    "",
  ];
  const tail = [
    "",
    "// Optional, and unrelated to the sliders:",
    "//   fadeNear=\"#site-footer\"   dissolve as a surface with its own treatment arrives",
    "//   scrollRoot={appShellRef}  when the page scrolls in a container, not the window",
    "//   zIndex={8700}",
  ];

  return [
    ...head,
    props.length ? "<BottomGlass\n" + props.join("\n") + "\n/>" : "<BottomGlass />",
    ...tail,
  ].join("\n");
}

function Slider({
  label, value, min, max, step, onChange, format,
}: {
  label: string; value: number; min: number; max: number; step: number;
  onChange: (v: number) => void; format?: (v: number) => string;
}) {
  return (
    <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: 12, color: "var(--muted-fg)", whiteSpace: "nowrap" }}>
      <span style={{ minWidth: 74 }}>{label}</span>
      <input type="range" min={min} max={max} step={step} value={value}
             onChange={e => onChange(+e.target.value)} style={{ width: 118 }} />
      <code style={{ minWidth: 52 }}>{format ? format(value) : value}</code>
    </label>
  );
}

/* Scroll it, and tune it. The strip reads the inner scroller through
   `scrollRoot`, so this is the real path a page takes rather than a simulated
   value — and every slider is a prop you can pass.

   Two boxes, and the nesting matters. The OUTER one is the containing block:
   it carries the transform, and it does not scroll. A transformed ancestor is
   what a position:fixed child resolves against, so the strip pins to the
   bottom of this frame. The INNER one is the scroller. Put the transform on
   the scroller itself and the strip pins to the bottom of the CONTENT instead
   — it scrolls away with the page and only shows up at the very end.

   A real page needs none of this: the strip is fixed to the viewport, the
   document scrolls under it, and that is that. */
function GlassDemo({ k, set }: { k: Knobs; set: (patch: Partial<Knobs>) => void }) {
  const scroller = React.useRef<HTMLDivElement>(null);
  const footer = React.useRef<HTMLDivElement>(null);
  const [g, setG] = React.useState(0);
  const dirty = (Object.keys(DEFAULTS) as Array<keyof Knobs>).some(key => k[key] !== DEFAULTS[key]);

  /* Mirror the strip's own reading, purely so the number is visible. */
  React.useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const read = () => {
      const t = Math.max(0, Math.min(1, el.scrollTop / k.rampOver));
      setG(t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    };
    read();
    el.addEventListener("scroll", read, { passive: true });
    return () => el.removeEventListener("scroll", read);
  }, [k.rampOver]);

  return (
    <div style={{ width: "100%", display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      <div style={{
        display: "flex", flexWrap: "wrap", alignItems: "center", gap: "var(--space-3) var(--space-5)",
        padding: "var(--space-3)", border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)", background: "var(--muted)",
      }}>
        <Slider label="height" value={k.height} min={60} max={320} step={4} onChange={v => set({ height: v })} format={v => v + "px"} />
        <Slider label="blur" value={k.blurScale} min={0} max={3} step={0.05} onChange={v => set({ blurScale: v })} format={v => v.toFixed(2) + "x"} />
        <Slider label="saturation" value={k.saturation} min={0} max={300} step={5} onChange={v => set({ saturation: v })} format={v => "+" + v + "%"} />
        <Slider label="rampOver" value={k.rampOver} min={100} max={1200} step={20} onChange={v => set({ rampOver: v })} format={v => v + "px"} />
        <label style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", fontSize: 12, color: "var(--muted-fg)" }}>
          <input type="checkbox" checked={k.manual} onChange={e => set({ manual: e.target.checked })} />
          drive strength by hand
        </label>
        {k.manual
          ? <Slider label="strength" value={k.strength} min={0} max={1} step={0.01} onChange={v => set({ strength: v })} format={v => v.toFixed(2)} />
          : <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>from scroll <code>{g.toFixed(2)}</code></span>}

        <button
          type="button"
          onClick={() => set(DEFAULTS)}
          disabled={!dirty}
          title={dirty ? "Restore every control to its default" : "Already at the defaults"}
          style={{
            marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 6,
            fontSize: 11.5, padding: "5px 11px", borderRadius: "var(--radius-full)",
            border: "1px solid var(--border)", background: "var(--color-bg-main)",
            color: dirty ? "var(--fg)" : "var(--muted-fg)",
            cursor: dirty ? "pointer" : "default", opacity: dirty ? 1 : 0.55,
            whiteSpace: "nowrap",
          }}
        >
          <RotateCcw size={12} aria-hidden="true" /> Reset
        </button>
      </div>

      {/* Containing block: transformed, and deliberately NOT the scroller. */}
      <div
        style={{
          position: "relative",
          transform: "translateZ(0)",
          width: "100%",
          height: 380,
          overflow: "hidden",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-xl)",
        }}
      >
        <div ref={scroller} style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
          {/* Tall enough that the ramp reaches full strength and holds there a
              moment before the footer dissolves it. */}
          {[0, 1, 2, 3, 4, 5].map(n => (
            <img
              key={n}
              src={backdrop}
              alt=""
              style={{ width: "100%", height: 300, objectFit: "cover", objectPosition: `50% ${n * 20}%`, display: "block" }}
            />
          ))}
          <div
            ref={footer}
            style={{
              padding: "48px var(--space-6) 64px",
              background: "var(--color-brand-secondary)",
              color: "var(--color-text-on-secondary)",
              fontFamily: "var(--font-family-heading)",
              fontSize: 14,
            }}
          >
            Keep scrolling — the strip dissolves as this footer arrives, so it never
            blurs a surface with its own treatment.
          </div>
        </div>

        <BottomGlass
          scrollRoot={scroller}
          fadeNear={footer}
          rampOver={k.rampOver}
          height={k.height}
          blurScale={k.blurScale}
          saturation={k.saturation + "%"}
          {...(k.manual ? { strength: k.strength } : {})}
          zIndex={2}
        />
      </div>
    </div>
  );
}

export function PageBottomGlass() {
  const [k, setK] = React.useState<Knobs>(DEFAULTS);
  const set = (patch: Partial<Knobs>) => setK(s => ({ ...s, ...patch }));

  return (
    <DocPage
      title="Bottom Glass"
      subtitle="A progressive-blur strip pinned to the foot of the viewport, ramping in as the page scrolls — six stacked layers rather than one pane, so the blur graduates instead of showing an edge."
    >
      <DocSection
        title="Bottom Glass"
        desc="Scroll inside the frame to see it ramp, and use the controls to tune it. The Code tab rewrites itself as you go, emitting only what differs from the defaults — so what you copy is what you changed."
      >
        <Preview title="BottomGlass" code={buildUsage(k)} height={520} contentAlign="start">
          <GlassDemo k={k} set={set} />
        </Preview>

        <Acc
          multiple
          defaultOpen={[0]}
          items={[
            {
              title: "Props",
              content: (
                <PropsTable props={[
                  { name: "rampOver",   type: "number", def: "460", desc: "Scroll distance in px over which the glass reaches full strength." },
                  { name: "fadeNear",   type: "string | RefObject", desc: "A selector or element whose approach dissolves the glass — the site passes its footer, so the strip never blurs a surface that has its own treatment." },
                  { name: "scrollRoot", type: "string | RefObject", desc: "The element whose scrolling drives it. Omit for the window; pass one when the page scrolls inside a container — an app shell, a modal, a docs preview." },
                  { name: "height",     type: "string | number", def: "clamp(100px, 20vh - 60px, 180px)", desc: "Height of the strip. The layers start at fixed offsets down to 133px, so a much shorter strip simply clips the heaviest ones." },
                  { name: "blurScale",  type: "number", def: "1", desc: "Multiplies every layer's blur at once, so the ramp keeps its shape rather than flattening as it is turned up." },
                  { name: "saturation", type: "string", def: '"95%"', desc: "Extra saturation at full strength, on top of 100%. Lifts colour behind the glass so it does not go flat under the blur." },
                  { name: "strength",   type: "number", desc: "Drive it yourself, 0 to 1. Bypasses the scroll listener entirely." },
                  { name: "zIndex",     type: "number", def: "8700", desc: "Stacking order." },
                  { name: "className",  type: "string", desc: "Extra class on the strip." },
                  { name: "style",      type: "React.CSSProperties", desc: "Inline style on the strip." },
                ]} />
              ),
            },
            {
              title: "How the blur graduates",
              content: (
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
                  <Callout variant="info">
                    A single <code>backdrop-filter</code> gives a hard line where it starts. This
                    is <strong>six layers</strong>, each beginning lower than the last — 0, 27,
                    53, 80, 107, 133px — and each blurring harder: 2.6, 5.1, 9.9, 19.2, 37.5 and
                    72px at full strength. Every layer is masked to fade in over its own first
                    100px, so no layer shows an edge and the stack ramps smoothly from clear to
                    heavy down the strip.
                  </Callout>
                  <Callout variant="info">
                    All six scale off one custom property, <code>--hs-g</code>, so the whole strip
                    is a single number between 0 and 1. Scroll drives it through a cubic
                    ease-in-out, which stops it snapping on at the top of a page or creeping in
                    over the first few pixels. A veil rides the same number to hold contrast for
                    anything sitting over it.
                  </Callout>
                </div>
              ),
            },
            {
              title: "Placement",
              content: (
                <Callout variant="warning">
                  Render it <strong>once, near the root</strong>. It is <code>position: fixed</code>{" "}
                  and <code>pointer-events: none</code>, so it never intercepts a click — but a
                  transformed ancestor becomes the containing block for fixed children. Put the
                  transform on the element that <em>scrolls</em> and the strip pins to the bottom
                  of the content instead, scrolling away with it. The demo above keeps them
                  separate: a transformed frame that does not scroll, with the scroller nested
                  inside it.
                </Callout>
              ),
            },
          ]}
        />
      </DocSection>
    </DocPage>
  );
}
