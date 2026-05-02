import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('CSS package contract', () => {
  it('keeps the public stylesheet entry wired to fonts, Tailwind, and theme styles', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/index.css'), 'utf8');

    expect(css).toContain("@import './fonts.css';");
    expect(css).toContain("@import './tailwind.css';");
    expect(css).toContain("@import './theme.css';");
  });
});
