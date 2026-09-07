import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { cssMin } from '../app/components/ui/hs-style-inject';

const BLOCKS = join(process.cwd(), 'src/app/components/blocks');
const TOKENS = readFileSync(join(process.cwd(), 'src/css/tokens.css'), 'utf8');

/* The headline scale drops below 768px. That has to happen on two axes, and
   the second one is easy to forget: a media query reports the window, so it
   cannot see a block rendered at phone width inside a desktop page — which is
   exactly what the docs preview does, since it sets a width on a plain
   wrapper rather than an iframe. */
describe('responsive type scale', () => {
  it('names the small scale once in tokens.css', () => {
    for (const t of [
      '--font-size-h1-sm', '--font-size-h2-sm', '--font-size-h3-sm',
      '--font-size-h4-sm', '--font-size-h5-sm', '--font-size-subheadline-sm',
      '--line-height-h1-sm', '--line-height-h2-sm', '--line-height-h3-sm',
    ]) {
      expect(TOKENS).toContain(t);
    }
  });

  it('carries hs-website\'s numbers', () => {
    expect(TOKENS).toMatch(/--font-size-h1-sm:\s*34px/);
    expect(TOKENS).toMatch(/--font-size-h2-sm:\s*28px/);
    expect(TOKENS).toMatch(/--font-size-h3-sm:\s*24px/);
  });

  /* The page-level half: a real phone gets it from the viewport. */
  it('applies the scale at a 767px viewport', () => {
    const q = TOKENS.slice(TOKENS.indexOf('@media (max-width: 767px)'));
    expect(q).toContain('--font-size-h2: var(--font-size-h2-sm)');
  });

  /* The block-level half: every block that establishes a container applies
     the same tokens from it, so a narrow column or a preview is right too. */
  const blocks = readdirSync(BLOCKS).filter(f => f.endsWith('.tsx'));

  it.each(blocks)('%s applies the scale by container when it owns one', file => {
    const src = readFileSync(join(BLOCKS, file), 'utf8');
    if (!src.includes('container-type: inline-size')) return; // presets have no CSS
    expect(src).toContain('@container (max-width: 767px)');
    expect(src).toContain('--font-size-h2: var(--font-size-h2-sm');
  });

  /* An element cannot be matched by the container it establishes, so the
     tokens must land on descendants. */
  it.each(blocks)('%s sets the tokens below its container root', file => {
    const src = readFileSync(join(BLOCKS, file), 'utf8');
    if (!src.includes('@container (max-width: 767px)')) return;
    const rule = src.slice(src.indexOf('@container (max-width: 767px)'));
    expect(rule).toMatch(/@container \(max-width: 767px\) \{\s*\.[a-z0-9_-]+ > \*/);
  });

  /* cssMin strips whitespace around > and , — both appear in these rules, and
     a past bug in it silently moved a whole rule onto the wrong element. */
  it('survives minification', () => {
    const out = cssMin(`
      @container (max-width: 767px) {
        .hs-xpromo > * { --font-size-h2: var(--font-size-h2-sm, 28px); }
      }
    `);
    expect(out).toContain('@container (max-width:767px)');
    expect(out).toContain('.hs-xpromo>*');
    expect(out).toContain('var(--font-size-h2-sm,28px)');
    /* The child combinator must survive as a combinator, not be swallowed. */
    expect(out).not.toContain('.hs-xpromo*');
  });
});
