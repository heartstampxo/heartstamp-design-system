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
