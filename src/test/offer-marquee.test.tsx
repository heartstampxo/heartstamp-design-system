import { render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChristmasPromo, PromoBand } from '../index';

/* jsdom has no layout and no ResizeObserver, and the offer bar decides what to
   do by measuring both. Stubbing them is what makes the decision testable:
   `wide` is how much room the bar has, `line` how much the offer needs. */
function layout({ wide, line }: { wide: number; line: number }) {
  vi.stubGlobal('ResizeObserver', class {
    constructor(private cb: () => void) {}
    observe() { this.cb(); }
    disconnect() {}
  });
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('hs-xpromo__cta-vp') ? wide : 0;
    },
  });
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get(this: HTMLElement) {
      return this.classList.contains('hs-xpromo__cta-text') ? line : 0;
    },
  });
}

function reducedMotion(on: boolean) {
  vi.stubGlobal('matchMedia', (q: string) => ({
    matches: on && q.includes('reduce'),
    media: q, onchange: null,
    addListener() {}, removeListener() {},
    addEventListener() {}, removeEventListener() {}, dispatchEvent: () => false,
  }));
}

beforeEach(() => reducedMotion(false));
afterEach(() => {
  vi.unstubAllGlobals();
  for (const p of ['clientWidth', 'scrollWidth']) {
    Object.defineProperty(HTMLElement.prototype, p, { configurable: true, value: 0 });
  }
});

const bar = (c: HTMLElement) => c.querySelector('.hs-xpromo__cta') as HTMLElement;

describe('offer bar: a line that does not fit', () => {
  it('leaves a line that fits alone', () => {
    layout({ wide: 900, line: 400 });
    const { container } = render(<ChristmasPromo />);

    expect(bar(container)).not.toHaveAttribute('data-marquee');
    expect(bar(container)).not.toHaveAttribute('data-wrap');
    /* No repeat, so the offer is in the document once. */
    expect(container.querySelectorAll('.hs-xpromo__cta-text')).toHaveLength(1);
  });

  it('scrolls a line that is too wide', () => {
    layout({ wide: 320, line: 900 });
    const { container } = render(<ChristmasPromo />);

    expect(bar(container)).toHaveAttribute('data-marquee');
    /* The repeat is what closes the loop. */
    expect(container.querySelectorAll('.hs-xpromo__cta-text')).toHaveLength(2);
  });

  /* Travel is one copy plus the gap, and the duration follows from it, so a
     longer offer takes longer rather than scrolling faster. */
  it('derives travel and duration from the measured line', () => {
    layout({ wide: 320, line: 900 });
    const { container } = render(<ChristmasPromo />);
    const el = bar(container);

    expect(el.style.getPropertyValue('--xpromo-marquee-dist')).toBe('948px');
    expect(el.style.getPropertyValue('--xpromo-marquee-dur')).toBe('15.80s');
  });

  it('keeps a longer offer at the same speed, not the same duration', () => {
    layout({ wide: 320, line: 1800 });
    const { container } = render(<ChristmasPromo />);
    const dur = parseFloat(bar(container).style.getPropertyValue('--xpromo-marquee-dur'));

    /* 1848px at 60px/s. Twice the line, near enough twice the time. */
    expect(dur).toBeCloseTo(30.8, 1);
  });

  /* The repeat would otherwise be announced as a second, identical offer. */
  it('hides the repeat from assistive technology', () => {
    layout({ wide: 320, line: 900 });
    const { container } = render(<ChristmasPromo />);
    const copies = container.querySelectorAll('.hs-xpromo__cta-text');

    expect(copies[0]).not.toHaveAttribute('aria-hidden');
    expect(copies[1]).toHaveAttribute('aria-hidden', 'true');
  });

  /* Nothing may move, so the line has to wrap — a clipped offer is worse
     than a taller bar. */
  it('wraps instead of scrolling under reduced motion', () => {
    reducedMotion(true);
    layout({ wide: 320, line: 900 });
    const { container } = render(<ChristmasPromo />);

    expect(bar(container)).toHaveAttribute('data-wrap');
    expect(bar(container)).not.toHaveAttribute('data-marquee');
    expect(container.querySelectorAll('.hs-xpromo__cta-text')).toHaveLength(1);
  });

  it('never scrolls when the banner opts out', () => {
    layout({ wide: 320, line: 900 });
    const { container } = render(
      <PromoBand banner={{ label: 'A very long offer indeed', marquee: false }} />,
    );

    expect(bar(container)).not.toHaveAttribute('data-marquee');
  });

  it('keeps the chevron outside the scrolling window', () => {
    layout({ wide: 320, line: 900 });
    const { container } = render(<ChristmasPromo />);

    expect(bar(container).querySelector('.hs-xpromo__cta-vp svg')).toBeNull();
    expect(bar(container).querySelector(':scope > svg')).not.toBeNull();
  });
});
