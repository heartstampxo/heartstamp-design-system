import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ChecklistOverflowMenu, OverflowMenu, TemplateOverflowMenu } from '../index';

/**
 * After "Show more" the new options arrived below the fold of a six-row list
 * (or on a page of the concepts menu nobody was looking at), the spinner
 * stopped, and a customer took it that nothing had happened. These cover the
 * menus bringing the new batch into view once it lands, and not moving at any
 * other time.
 */

const ROW_H = 36;
let scrollTo: ReturnType<typeof vi.fn>;
let reduceMotion = false;

beforeEach(() => {
  scrollTo = vi.fn();
  // jsdom implements neither.
  HTMLElement.prototype.scrollTo = scrollTo as unknown as typeof HTMLElement.prototype.scrollTo;
  window.matchMedia = ((query: string) => ({
    matches: reduceMotion && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  })) as unknown as typeof window.matchMedia;
});

afterEach(() => {
  reduceMotion = false;
  vi.restoreAllMocks();
});

const noop = () => {};
const options = (n: number) => Array.from({ length: n }, (_, i) => ({ num: String(i + 1), label: `Option ${i + 1}` }));
const items = (n: number) => Array.from({ length: n }, (_, i) => ({ id: `i${i}`, label: `Item ${i + 1}` }));

const overflow = (n: number, busy = false) => (
  <OverflowMenu
    pages={[{ question: 'What occasion is this for?', options: options(n) }]}
    onClose={noop}
    onComplete={noop}
    onShowMore={noop}
    isLoadingShowMore={busy}
  />
);

const checklist = (n: number, busy = false) => (
  <ChecklistOverflowMenu
    pages={[{ question: 'Pick some tones', items: items(n) }]}
    onClose={noop}
    onShowMore={noop}
    isLoadingShowMore={busy}
  />
);

describe.each([
  ['OverflowMenu', overflow],
  ['ChecklistOverflowMenu', checklist],
] as const)('%s reveals a show-more batch', (_name, menu) => {
  it('does not scroll on first render', () => {
    render(menu(6));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('scrolls the first new row to the top when the list grows', () => {
    const { rerender } = render(menu(6));
    rerender(menu(12));
    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith({ top: 6 * ROW_H, behavior: 'smooth' });
  });

  // The real sequence: the button sets busy, the items land, then busy clears,
  // possibly in separate renders. The growth must still register afterwards.
  it('waits for the request to finish, then scrolls from the pre-request count', () => {
    const { rerender } = render(menu(6));
    rerender(menu(6, true));
    rerender(menu(12, true));
    expect(scrollTo).not.toHaveBeenCalled();
    rerender(menu(12, false));
    expect(scrollTo).toHaveBeenCalledWith({ top: 6 * ROW_H, behavior: 'smooth' });
  });

  it('does not scroll when a show-more brings nothing new', () => {
    const { rerender } = render(menu(6));
    rerender(menu(6, true));
    rerender(menu(6, false));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('does not scroll when the list shrinks', () => {
    const { rerender } = render(menu(12));
    rerender(menu(6));
    expect(scrollTo).not.toHaveBeenCalled();
  });

  it('jumps rather than glides under reduced motion', () => {
    reduceMotion = true;
    const { rerender } = render(menu(6));
    rerender(menu(12));
    expect(scrollTo).toHaveBeenCalledWith({ top: 6 * ROW_H, behavior: 'auto' });
  });
});

describe('TemplateOverflowMenu turns to the first new card', () => {
  const cards = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      num: String(i + 1),
      title: `Concept ${i + 1}`,
      front: `Front ${i + 1}`,
      insideBody: `Inside ${i + 1}`,
      giftMessage: '',
    }));
  const menu = (n: number, busy = false) => (
    <TemplateOverflowMenu header="Pick a concept" cards={cards(n)} onClose={noop} onComplete={noop} onShowMore={noop} isLoadingShowMore={busy} />
  );

  it('stays on page one at first', () => {
    render(menu(4));
    expect(screen.getByText(/Front: Front 1\b/)).toBeTruthy();
    expect(screen.queryByText(/Front: Front 5\b/)).toBeNull();
  });

  // The page state turns at once (the counter proves it); the cards follow when
  // AnimatePresence's exit animation finishes, hence findByText.
  it('shows the first new card once the batch lands', async () => {
    const { rerender } = render(menu(4));
    rerender(menu(4, true));
    rerender(menu(8, true));
    expect(screen.getByText('1 of 4')).toBeTruthy();
    rerender(menu(8, false));
    expect(screen.getByText('3 of 4')).toBeTruthy();
    expect(await screen.findByText(/Front: Front 5\b/)).toBeTruthy();
  });

  // Odd count: the first new card shares a page with the last old one.
  it('lands on the shared page when the old count is odd', async () => {
    const { rerender } = render(menu(3));
    rerender(menu(7));
    expect(screen.getByText('2 of 4')).toBeTruthy();
    expect(await screen.findByText(/Front: Front 3\b/)).toBeTruthy();
    expect(screen.getByText(/Front: Front 4\b/)).toBeTruthy();
  });
});
