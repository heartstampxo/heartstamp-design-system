import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Sidebar } from '../app/components/docs/doc-sidebar';
import { ANALYTICS_URL, NAV } from '../app/nav-config';

describe('docs sidebar', () => {
  it('lists Analytics right below Changelog in Getting Started', () => {
    const ids = NAV[0].items.map((i) => i.id);
    expect(NAV[0].title).toBe('Getting Started');
    expect(ids.indexOf('analytics')).toBe(ids.indexOf('changelog') + 1);
    expect(ANALYTICS_URL).toMatch(/^https:\/\//);
  });

  it('opens an href item in a new tab instead of switching the docs page', () => {
    const open = vi.spyOn(window, 'open').mockReturnValue(null);
    const onSelect = vi.fn();
    render(<Sidebar active="intro" onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Analytics'));
    expect(open).toHaveBeenCalledWith(ANALYTICS_URL, '_blank', 'noopener,noreferrer');
    expect(onSelect).not.toHaveBeenCalled();

    // A normal item still switches the page
    fireEvent.click(screen.getByText('Changelog'));
    expect(onSelect).toHaveBeenCalledWith('changelog');
    open.mockRestore();
  });
});
