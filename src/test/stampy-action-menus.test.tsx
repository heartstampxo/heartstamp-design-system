import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ActionChecklistOverflowMenu, ActionOverflowMenu, ActionOverflowMenuList } from '../index';

/**
 * The action menus carried a single call to action until a turn needed two side
 * by side (Preview alongside Prepare for Cart, once a card has been generated).
 * These cover the optional secondary action and, just as importantly, that a
 * caller which passes neither prop still gets exactly the one button it always
 * had — every existing consumer goes through this header.
 */

const config = {
  title: 'Ready to generate',
  subtitle: 'Your concept is ready',
  generateButtonLabel: 'Prepare for Cart',
  adjustHeader: 'Want to make changes?',
  adjustItems: [{ num: '1', label: 'Soften the palette' }],
  adjustOptions: ['Soften the palette']
};

const items = [{ id: 'a', label: 'Soften the palette' }];

const noop = () => {};

type MenuProps = {
  onClose: () => void;
  onGenerate: () => void;
  onSecondary?: () => void;
  secondaryButtonLabel?: string;
  generateButtonLabel?: string;
};

const renderers = {
  ActionOverflowMenu: (props: MenuProps) => render(<ActionOverflowMenu config={config} {...props} />),
  ActionOverflowMenuList: (props: MenuProps) =>
    render(<ActionOverflowMenuList config={config} onComplete={noop} {...props} />),
  ActionChecklistOverflowMenu: (props: MenuProps) =>
    render(<ActionChecklistOverflowMenu config={config} items={items} {...props} />)
} as const;

const names = Object.keys(renderers) as (keyof typeof renderers)[];

afterEach(() => vi.clearAllMocks());

describe.each(names)('%s secondary action', (name) => {
  const mount = renderers[name];

  it('renders only the primary action when no secondary is given', () => {
    mount({ onClose: vi.fn(), onGenerate: vi.fn() });
    expect(screen.getByText('Prepare for Cart')).toBeTruthy();
    expect(screen.queryByText('Preview')).toBeNull();
  });

  it('renders both actions when label and handler are given', () => {
    mount({ onClose: vi.fn(), onGenerate: vi.fn(), onSecondary: vi.fn(), secondaryButtonLabel: 'Preview' });
    expect(screen.getByText('Preview')).toBeTruthy();
    expect(screen.getByText('Prepare for Cart')).toBeTruthy();
  });

  it('places the secondary action before the primary one', () => {
    const { container } = mount({
      onClose: vi.fn(),
      onGenerate: vi.fn(),
      onSecondary: vi.fn(),
      secondaryButtonLabel: 'Preview'
    });
    const labels = [...container.querySelectorAll('button')]
      .map((b) => b.textContent?.trim())
      .filter((t): t is string => t === 'Preview' || t === 'Prepare for Cart');
    expect(labels).toEqual(['Preview', 'Prepare for Cart']);
  });

  it('routes each click to its own handler', () => {
    const onGenerate = vi.fn();
    const onSecondary = vi.fn();
    mount({ onClose: vi.fn(), onGenerate, onSecondary, secondaryButtonLabel: 'Preview' });

    fireEvent.click(screen.getByText('Preview'));
    expect(onSecondary).toHaveBeenCalledTimes(1);
    expect(onGenerate).not.toHaveBeenCalled();

    fireEvent.click(screen.getByText('Prepare for Cart'));
    expect(onGenerate).toHaveBeenCalledTimes(1);
    expect(onSecondary).toHaveBeenCalledTimes(1);
  });

  // Half a pair renders nothing rather than a button that cannot act, or one
  // with no name. Both halves are required together.
  it('ignores a label with no handler', () => {
    mount({ onClose: vi.fn(), onGenerate: vi.fn(), secondaryButtonLabel: 'Preview' });
    expect(screen.queryByText('Preview')).toBeNull();
  });

  it('ignores a handler with no label', () => {
    mount({ onClose: vi.fn(), onGenerate: vi.fn(), onSecondary: vi.fn() });
    const buttons = [...document.querySelectorAll('button')].filter((b) => b.textContent?.trim() === '');
    // The close button is the only unlabelled one; no empty secondary appeared.
    expect(buttons.length).toBeLessThanOrEqual(1);
  });

  it('still lets generateButtonLabel override the config label', () => {
    mount({
      onClose: vi.fn(),
      onGenerate: vi.fn(),
      generateButtonLabel: 'Update Card Style',
      onSecondary: vi.fn(),
      secondaryButtonLabel: 'Preview'
    });
    expect(screen.getByText('Update Card Style')).toBeTruthy();
    expect(screen.queryByText('Prepare for Cart')).toBeNull();
    expect(screen.getByText('Preview')).toBeTruthy();
  });
});
