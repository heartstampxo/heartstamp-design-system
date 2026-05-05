import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  Bdg,
  Btn,
  Crd,
  CrdBody,
  CrdDesc,
  CrdFooter,
  CrdHeader,
  CrdTitle,
  HSEmblem,
  HSLockup,
  HSLogo,
  Inp,
  TopNavDesktop,
  TopNavMobile,
} from '../index';

describe('core component smoke tests', () => {
  it('renders Btn content', () => {
    render(<Btn>Save</Btn>);

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('renders Inp with a label', () => {
    render(<Inp id="email" label="Email" placeholder="name@example.com" />);

    expect(screen.getByLabelText('Email')).toHaveAttribute('placeholder', 'name@example.com');
  });

  it('renders card sections', () => {
    render(
      <Crd>
        <CrdHeader>
          <CrdTitle>Campaign</CrdTitle>
          <CrdDesc>Campaign details</CrdDesc>
        </CrdHeader>
        <CrdBody>Body</CrdBody>
        <CrdFooter>Footer</CrdFooter>
      </Crd>,
    );

    expect(screen.getByText('Campaign')).toBeInTheDocument();
    expect(screen.getByText('Campaign details')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('renders Bdg content', () => {
    render(<Bdg>Live</Bdg>);

    expect(screen.getByText('Live')).toBeInTheDocument();
  });

  it('renders logo variants', () => {
    const { container } = render(
      <div>
        <HSLogo type="emblem" height={24} />
        <HSEmblem height={24} />
        <HSLockup height={24} />
      </div>,
    );

    expect(container.querySelectorAll('svg, img')).toHaveLength(3);
  });

  it('renders desktop and mobile navs', () => {
    render(
      <div>
        <TopNavDesktop />
        <TopNavMobile />
      </div>,
    );

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Log in' })).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });
});

describe('component behavior and style contracts', () => {
  it('applies Btn variant, size, custom class, and disabled styles', () => {
    render(
      <Btn variant="secondary" size="lg" className="custom-btn" disabled>
        Donate
      </Btn>,
    );

    const button = screen.getByRole('button', { name: 'Donate' });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('custom-btn');
    expect(button.className).toContain('bg-[var(--color-brand-secondary)]');
    expect(button.className).toContain('h-[44px]');
    expect(button).toHaveStyle({ color: 'var(--color-text-disabled)' });
  });

  it('applies Bdg variant styles', () => {
    render(<Bdg variant="outline">Draft</Bdg>);

    const badge = screen.getByText('Draft');

    expect(badge).toHaveStyle({
      background: 'transparent',
      color: 'var(--fg)',
    });
    expect(badge.getAttribute('style')).toContain('border: 1px solid var(--border)');
  });

  it('updates Inp value and renders keyboard hint', () => {
    let value = '';

    render(
      <Inp
        label="Search campaigns"
        id="campaign-search"
        value={value}
        onChange={(event) => {
          value = event.target.value;
        }}
        kbd={['Meta', 'K']}
      />,
    );

    fireEvent.change(screen.getByLabelText('Search campaigns'), { target: { value: 'stamp' } });

    expect(value).toBe('stamp');
    expect(screen.getByText('Meta')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });

  it('applies card container style overrides', () => {
    render(<Crd style={{ background: 'rgb(1, 2, 3)' }}>Styled card</Crd>);

    expect(screen.getByText('Styled card')).toHaveStyle({ background: 'rgb(1, 2, 3)' });
  });
});
