import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (p: string) => readFileSync(join(root, p), 'utf8');
const pkg = () => JSON.parse(read('package.json'));

/** The stylesheets shipped to consumers — everything copied to dist/css. */
const publishedStylesheets = () =>
  readdirSync(join(root, 'src/css')).filter((f) => f.endsWith('.css'));

describe('CSS package contract', () => {
  it('keeps the docs stylesheet entry wired to fonts, Tailwind, and theme styles', () => {
    // src/styles/index.css is the dev/docs entry — never published. Asserted
    // separately from the package surface below, which is what consumers get.
    const css = read('src/styles/index.css');

    expect(css).toContain("@import './fonts.css';");
    expect(css).toContain("@import './tailwind.css';");
    expect(css).toContain("@import './theme.css';");
  });

  /* ── Published surface ─────────────────────────────────────────────
     `exports` has no "./*" wildcard, so it is an exhaustive allowlist: a
     stylesheet can sit in dist/css and still be unreachable. grid.css shipped
     that way — present in the tarball, blocked by the map, and documented as
     importable. `npm pack --dry-run` in CI lists tarball contents but never
     resolves a subpath, so it passes regardless. These assertions are what
     actually pin the contract.
  ──────────────────────────────────────────────────────────────────── */

  it('exports every stylesheet it ships', () => {
    const { exports: map } = pkg();
    const missing = publishedStylesheets().filter((f) => !(`./${f}` in map));

    expect(missing).toEqual([]);
  });

  it('points each stylesheet export at its built file', () => {
    const { exports: map } = pkg();
    const wrong: string[] = [];

    for (const f of publishedStylesheets()) {
      const target = map[`./${f}`];
      if (target !== `./dist/css/${f}`) wrong.push(`./${f} → ${target}`);
    }

    expect(wrong).toEqual([]);
  });

  it('keeps the pre-existing stylesheet exports pointed where they always were', () => {
    // Regression pin: these two are relied on by consumers today, so a later
    // edit must not quietly repoint or drop them.
    const { exports: map } = pkg();

    expect(map['./tokens.css']).toBe('./dist/css/tokens.css');
    expect(map['./btn.css']).toBe('./dist/css/btn.css');
  });

  it('copies the whole css directory, so a new stylesheet needs no build change', () => {
    // The export map is the only gate; if this script ever starts filtering,
    // the assertions above stop being sufficient.
    expect(read('scripts/copy-dist-css.mjs')).toContain("cpSync('src/css', 'dist/css'");
  });
});

/* These two components ship their own sheet and are mounted by consumers who
   may have no CSS reset at all. The docs app does have one (Tailwind's preflight
   zeroes button background, padding and margin), so anything the reset below
   forgets renders correctly here and wrongly there. WebsiteNavV2 shipped without
   background/padding/margin for exactly that reason: every mega-menu filter and
   item drew the UA's ButtonFace grey behind it and sat 6px right of its column
   heading, on a page with no preflight. */
describe('injected component sheets stand alone without a CSS reset', () => {
  const SHEETS = [
    ['src/app/components/ui/hs-website-nav-v2.tsx', '.hs-nav-v2'],
    ['src/app/components/ui/hs-notifications.tsx', '.hs-notif'],
  ] as const;

  it('zeroes the UA button background, padding and margin', () => {
    for (const [file, scope] of SHEETS) {
      const src = read(file);
      const start = src.indexOf(`:where(${scope} button) {`);
      expect(start, `${file}: no bare-button reset for ${scope}`).toBeGreaterThan(-1);
      const reset = src.slice(start, src.indexOf('}', start));

      for (const decl of [/background:\s*none/, /padding:\s*0/, /margin:\s*0/]) {
        expect(reset, `${file}: reset is missing ${decl.source}`).toMatch(decl);
      }
    }
  });

  it('keeps the reset at zero specificity so styled buttons still win', () => {
    // :where() is what lets .hs-nav-v2__pill and friends set a background
    // without !important or a source-order dependency.
    for (const [file, scope] of SHEETS) {
      expect(read(file)).toContain(`:where(${scope} button) {`);
    }
  });
});

describe('WebsiteNavV2 mega panel rides the nav grid track', () => {
  /** The declarations of one CSS rule out of the component's injected sheet. */
  const block = (src: string, selector: string) => {
    const start = src.indexOf(`${selector} {`);
    expect(start, `${selector} not found`).toBeGreaterThan(-1);
    return src.slice(start, src.indexOf('}', start));
  };

  it('gives the panel the same track and inset as the rows above it', () => {
    const src = read('src/app/components/ui/hs-website-nav-v2.tsx');
    const row = block(src, '.hs-nav-v2__row');
    const mega = block(src, '.hs-nav-v2__megagrid');

    const TRACK = 'width: min(var(--nav-track-max, var(--grid-max-width, 1200px)), 100%)';
    expect(row).toContain(TRACK);
    expect(mega).toContain(TRACK);

    // The inset is what drifted: the panel shipped with none, so its rail and
    // promo tile sat ~16px outside the track the nav rows align to.
    const INSET = 'var(--nav-track-margin, var(--grid-margin, 16px))';
    expect(row).toContain(INSET);
    expect(mega).toContain(INSET);

    // The rail hairline offsets from the same inset, or it parts from the rail.
    expect(block(src, '.hs-nav-v2__megarule'))
      .toContain(`calc(${INSET} + var(--mega-rail-w))`);
  });

  it('leaves the track overridable, and still tiered when nobody overrides it', () => {
    const src = read('src/app/components/ui/hs-website-nav-v2.tsx');

    // --grid-max-width is restated as 1400px at >= 2000px in tokens.css, and the
    // nav inherits that only for as long as it keeps reading the token. Pinning
    // a number here (or in a consumer's --nav-track-max) is what severs the wide
    // tier, which is how the bar ended up 200px narrow against a 1400px page.
    for (const rule of ['.hs-nav-v2__row', '.hs-nav-v2__megagrid', '.hs-nav-v2__megarule']) {
      expect(block(src, rule), `${rule} left the grid tokens`)
        .toMatch(/var\(--nav-track-(max|margin), var\(--grid-(max-width, 1200px|margin, 16px)\)\)/);
    }

    // Both properties must stay UNSET on .hs-nav-v2. The nav is a descendant of
    // whatever scope a consumer overrides on, so a default declared here would
    // win over the inherited value and the override would silently do nothing.
    const root = src.slice(src.indexOf('\n.hs-nav-v2 {'), src.indexOf('.hs-nav-v2--static'));
    expect(root.replace(/\/\*[^]*?\*\//g, ''))
      .not.toMatch(/--nav-track-(max|margin)\s*:/);
  });
});

describe('cssMin keeps selectors intact while minifying', () => {
  it('preserves the space in a descendant pseudo selector', async () => {
    const { cssMin } = await import('../app/components/ui/hs-style-inject');

    // Stripping both sides of the colon turned this into ".root:focus-visible",
    // moving the focus ring off every child and onto the root.
    expect(cssMin('.root :focus-visible { outline: 2px solid red; }'))
      .toBe('.root :focus-visible{outline:2px solid red;}');
  });

  it('still strips declaration whitespace and comments', () => {
    return import('../app/components/ui/hs-style-inject').then(({ cssMin }) => {
      expect(cssMin('/* note */ .a { color: red; margin: 0 auto; }'))
        .toBe('.a{color:red;margin:0 auto;}');
      // calc needs its operator spaces; only comma spacing goes.
      expect(cssMin('.a { left: calc(var(--x, 4px) + var(--y)); }'))
        .toBe('.a{left:calc(var(--x,4px) + var(--y));}');
    });
  });
});
