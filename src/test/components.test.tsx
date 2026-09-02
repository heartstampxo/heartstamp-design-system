import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  Alrt,
  AlrtStrong,
  Bdg,
  Btn,
  CoachTipCard,
  CoachTips,
  Crd,
  CrdBody,
  CrdDesc,
  CrdFooter,
  CrdHeader,
  CrdTitle,
  DdMenu,
  EMOJI_CATEGORIES,
  EmojiPicker,
  FONT_OPTIONS,
  FmtToolbar,
  FontPicker,
  GridInspector,
  GridOverlay,
  gridBreakpointFor,
  HSEmblem,
  LinkBtnEditor,
  LinkEditor,
  SOCIAL_PLATFORMS,
  SocialHandles,
  detectSocialPlatform,
  socialHandleUrl,
  HSLockup,
  HSLogo,
  Inp,
  StampyAlrt,
  TopNavDesktop,
  TopNavMobile,
  WebsiteNavV2,
  type CoachTipItem,
  type NotificationItem,
} from '../index';

const TIPS: CoachTipItem[] = [
  { id: 'one', title: 'First tip', body: 'First body' },
  { id: 'two', title: 'Second tip', body: 'Second body' },
];

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
    expect(button.className).toContain('hs-btn--secondary');
    expect(button.className).toContain('hs-btn--size-lg');
    expect(button).toHaveStyle({ color: 'var(--color-text-on-secondary)' });
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

describe('CoachTipCard', () => {
  it('renders the tip, counter pill, and both actions', () => {
    render(<CoachTipCard counter="Tip 2/7" title="Leave the hassle to us" body="We handle the rest." />);

    expect(screen.getByText('Leave the hassle to us')).toBeInTheDocument();
    expect(screen.getByText('We handle the rest.')).toBeInTheDocument();
    expect(screen.getByText('Tip 2/7')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next' })).toBeInTheDocument();
  });

  it('names the dialog by its title and describes it by counter + body', () => {
    render(<CoachTipCard counter="Tip 1/2" title="Named tip" body="Described body" />);

    const dialog = screen.getByRole('dialog', { name: 'Named tip' });
    const describedBy = dialog.getAttribute('aria-describedby')?.split(' ') ?? [];

    expect(describedBy).toHaveLength(2);
    expect(describedBy.map((id) => document.getElementById(id)?.textContent)).toEqual([
      'Tip 1/2',
      'Described body',
    ]);
  });

  it('omits the counter pill when no counter is given', () => {
    render(<CoachTipCard title="No counter" body="Body" />);

    expect(screen.getByRole('dialog').getAttribute('aria-describedby')).not.toContain(' ');
  });

  it('hides Skip and ignores Escape when hideSkip is set', () => {
    let skipped = false;
    render(<CoachTipCard hideSkip title="Required" body="Body" onSkip={() => { skipped = true; }} />);

    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(skipped).toBe(false);
  });

  it('skips on Escape when Skip is available', () => {
    let skipped = false;
    render(<CoachTipCard title="Dismissable" body="Body" onSkip={() => { skipped = true; }} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(skipped).toBe(true);
  });

  it('drops the avatar when avatar is explicitly null', () => {
    const { container } = render(<CoachTipCard avatar={null} title="No avatar" body="Body" />);

    expect(container.querySelector('img')).toBeNull();
  });
});

describe('CoachTips', () => {
  it('advances through the sequence and updates the counter', () => {
    render(<CoachTips tips={TIPS} />);

    expect(screen.getByText('First tip')).toBeInTheDocument();
    expect(screen.getByText('Tip 1/2')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Second tip')).toBeInTheDocument();
    expect(screen.getByText('Tip 2/2')).toBeInTheDocument();
  });

  it('shows Done on the last tip and fires onComplete', () => {
    let completed = false;
    render(<CoachTips tips={TIPS} defaultStep={1} onComplete={() => { completed = true; }} />);

    fireEvent.click(screen.getByRole('button', { name: 'Done' }));
    expect(completed).toBe(true);
  });

  it('does not advance its own state when step is controlled', () => {
    const seen: number[] = [];
    render(<CoachTips tips={TIPS} step={0} onStepChange={(next) => seen.push(next)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(seen).toEqual([1]);
    expect(screen.getByText('First tip')).toBeInTheDocument();
  });

  it('renders nothing for an out-of-range step or an empty list', () => {
    const { container: outOfRange } = render(<CoachTips tips={TIPS} step={5} />);
    expect(outOfRange).toBeEmptyDOMElement();

    const { container: empty } = render(<CoachTips tips={[]} />);
    expect(empty).toBeEmptyDOMElement();
  });

  it('hides the counter when showCounter is false', () => {
    render(<CoachTips tips={TIPS} showCounter={false} />);

    expect(screen.queryByText('Tip 1/2')).not.toBeInTheDocument();
  });
});

describe('StampyAlrt', () => {
  it('renders as a status region with title and body', () => {
    render(
      <StampyAlrt title="So good!">
        Suds is applied, <AlrtStrong>tap Continue to cover</AlrtStrong> below to start writing.
      </StampyAlrt>,
    );

    const alert = screen.getByRole('status');
    expect(alert).toHaveTextContent('So good!');
    expect(alert).toHaveTextContent('Suds is applied, tap Continue to cover below to start writing.');
  });

  it('emphasises AlrtStrong with text-primary at the semibold token', () => {
    render(<StampyAlrt title="Title"><AlrtStrong>emphasised</AlrtStrong></StampyAlrt>);

    expect(screen.getByText('emphasised')).toHaveStyle({ fontWeight: 'var(--font-weight-semibold, 600)' });
  });

  it('renders the mascot slot by default and drops it when icon is null', () => {
    const { container: withIcon } = render(<StampyAlrt title="With icon" />);
    expect(withIcon.querySelector('img')).not.toBeNull();

    const { container: withoutIcon } = render(<StampyAlrt icon={null} title="No icon" />);
    expect(withoutIcon.querySelector('img')).toBeNull();
  });

  it('omits the body block when no children are given', () => {
    render(<StampyAlrt title="Saved to your drafts" />);

    expect(screen.getByRole('status')).toHaveTextContent('Saved to your drafts');
  });
});

describe('FmtToolbar', () => {
  it('renders the default configuration as a labelled toolbar', () => {
    render(<FmtToolbar />);

    const toolbar = screen.getByRole('toolbar', { name: 'Text formatting' });
    expect(toolbar).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Handles' })).toBeInTheDocument();
    expect(screen.getByText('Kalam')).toBeInTheDocument();
  });

  it('reports the pressed id through onAction', () => {
    const pressed: string[] = [];
    render(<FmtToolbar onAction={(id) => pressed.push(id)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Italic' }));
    fireEvent.click(screen.getByRole('button', { name: 'Align right' }));
    fireEvent.click(screen.getByRole('button', { name: 'Insert emoji' }));

    expect(pressed).toEqual(['italic', 'align-right', 'emoji']);
  });

  it('hands back the button it fired from so popovers can anchor to it', () => {
    let trigger: HTMLButtonElement | undefined;
    render(<FmtToolbar onAction={(_id, el) => { trigger = el; }} />);

    const emoji = screen.getByRole('button', { name: 'Insert emoji' });
    fireEvent.click(emoji);

    expect(trigger).toBe(emoji);
  });

  it('carries the link and emoji controls in the group before the pills', () => {
    render(<FmtToolbar />);

    expect(screen.getByRole('button', { name: 'Insert link' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Insert emoji' })).toBeInTheDocument();
  });

  it('marks active toggles with aria-pressed and leaves action pills unset', () => {
    render(<FmtToolbar active={['bold', 'handles']} />);

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Handles' })).not.toHaveAttribute('aria-pressed');
  });

  it('exposes exactly one tab stop and moves focus with arrow keys', () => {
    render(<FmtToolbar />);

    const toolbar = screen.getByRole('toolbar');
    const buttons = Array.from(toolbar.querySelectorAll('button'));
    expect(buttons.filter((b) => b.tabIndex === 0)).toHaveLength(1);

    buttons[0].focus();
    fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[1]);

    fireEvent.keyDown(toolbar, { key: 'End' });
    expect(document.activeElement).toBe(buttons[buttons.length - 1]);

    fireEvent.keyDown(toolbar, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(buttons[0]);
  });

  it('overrides every font item with fontValue', () => {
    render(<FmtToolbar fontValue="Instrument Serif" />);

    expect(screen.getByText('Instrument Serif')).toBeInTheDocument();
    expect(screen.queryByText('Kalam')).not.toBeInTheDocument();
  });

  it('renders a divider between each group but not before the first', () => {
    render(<FmtToolbar />);

    // Default config has 5 groups → 4 dividers
    expect(screen.getAllByRole('separator')).toHaveLength(4);
  });
});

describe('EmojiPicker', () => {
  it('renders every category heading and a nav button per category', () => {
    render(<EmojiPicker />);

    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument();
    for (const cat of EMOJI_CATEGORIES) {
      expect(screen.getByText(cat.label)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: `Jump to ${cat.label}` })).toBeInTheDocument();
    }
  });

  it('reports the character and its entry on select', () => {
    const picked: Array<[string, string]> = [];
    render(<EmojiPicker onSelect={(char, entry) => picked.push([char, entry.name])} />);

    fireEvent.click(screen.getByRole('button', { name: 'Thumbs up' }));

    expect(picked).toEqual([['👍', 'Thumbs up']]);
  });

  it('filters by name and by keyword', () => {
    render(<EmojiPicker />);
    const search = screen.getByRole('searchbox', { name: 'Search emoji' });

    // "rocket" matches by name
    fireEvent.change(search, { target: { value: 'rocket' } });
    expect(screen.getByRole('button', { name: 'Rocket' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Thumbs up' })).not.toBeInTheDocument();

    // "lol" only exists as a keyword on the laughing faces
    fireEvent.change(search, { target: { value: 'lol' } });
    expect(screen.getByRole('button', { name: 'Face with tears of joy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Rocket' })).not.toBeInTheDocument();
  });

  it('drops category headings that have no matches', () => {
    render(<EmojiPicker />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search emoji' }), {
      target: { value: 'rocket' },
    });

    expect(screen.getByText('Symbols')).toBeInTheDocument();
    expect(screen.queryByText('Hearts')).not.toBeInTheDocument();
    // The nav row always shows every category, so its buttons survive
    expect(screen.getByRole('button', { name: 'Jump to Hearts' })).toBeInTheDocument();
  });

  it('shows an empty state when nothing matches', () => {
    render(<EmojiPicker />);
    fireEvent.change(screen.getByRole('searchbox', { name: 'Search emoji' }), {
      target: { value: 'zzzzz' },
    });

    expect(screen.getByText(/No emoji match/)).toBeInTheDocument();
  });

  it('keeps one tab stop in the grid and moves focus by row with ArrowDown', () => {
    render(<EmojiPicker columns={5} />);

    const cells = Array.from(document.querySelectorAll<HTMLButtonElement>('button[data-emoji-index]'));
    expect(cells.filter((c) => c.tabIndex === 0)).toHaveLength(1);

    cells[0].focus();
    fireEvent.keyDown(cells[0], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(cells[5]);

    fireEvent.keyDown(cells[5], { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(cells[4]);
  });

  it('fires onClose on Escape', () => {
    let closed = false;
    render(<EmojiPicker onClose={() => { closed = true; }} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('centres the notch by default, offsets it on request, and can drop it', () => {
    const { container: centred } = render(<EmojiPicker />);
    expect(centred.querySelector<HTMLElement>('[aria-hidden="true"]')).toHaveStyle({ left: '50%' });

    const { container: offset } = render(<EmojiPicker arrowOffset={40} />);
    // Offset is the notch centre, so the box is placed half its width earlier
    expect(offset.querySelector<HTMLElement>('[aria-hidden="true"]')).toHaveStyle({ left: '34px' });

    const { container: none } = render(<EmojiPicker arrow={false} />);
    expect(none.querySelectorAll('[aria-hidden="true"]')).toHaveLength(0);
  });
});

describe('LinkEditor', () => {
  it('renders both labelled fields and the apply action', () => {
    render(<LinkEditor />);

    expect(screen.getByRole('dialog', { name: 'Edit link' })).toBeInTheDocument();
    expect(screen.getByLabelText('Link text')).toHaveAttribute('placeholder', 'Text to show');
    expect(screen.getByLabelText('Link URL')).toHaveAttribute('placeholder', 'https://…');
    expect(screen.getByRole('button', { name: 'Apply link' })).toBeInTheDocument();
  });

  it('keeps apply disabled until a URL is entered', () => {
    render(<LinkEditor />);

    expect(screen.getByRole('button', { name: 'Apply link' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: 'https://heartstamp.com' } });

    // Re-queried, not reused: Btn wraps a disabled button in a Tip, so toggling
    // `disabled` swaps the element out from under any held reference.
    expect(screen.getByRole('button', { name: 'Apply link' })).toBeEnabled();
  });

  it('does not require link text', () => {
    const applied: Array<{ text: string; url: string }> = [];
    render(<LinkEditor onApply={(v) => applied.push(v)} />);

    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: 'https://heartstamp.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply link' }));

    expect(applied).toEqual([{ text: '', url: 'https://heartstamp.com' }]);
  });

  it('trims values before applying', () => {
    const applied: Array<{ text: string; url: string }> = [];
    render(<LinkEditor onApply={(v) => applied.push(v)} />);

    fireEvent.change(screen.getByLabelText('Link text'), { target: { value: '  Our shop  ' } });
    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: ' https://heartstamp.com ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Apply link' }));

    expect(applied).toEqual([{ text: 'Our shop', url: 'https://heartstamp.com' }]);
  });

  it('prefills both fields when editing an existing link', () => {
    render(<LinkEditor defaultText="Our shop" defaultUrl="https://heartstamp.com" />);

    expect(screen.getByLabelText('Link text')).toHaveValue('Our shop');
    expect(screen.getByLabelText('Link URL')).toHaveValue('https://heartstamp.com');
    expect(screen.getByRole('button', { name: 'Apply link' })).toBeEnabled();
  });

  it('reports every keystroke through onChange', () => {
    const seen: string[] = [];
    render(<LinkEditor onChange={({ url }) => seen.push(url)} />);

    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: 'https://a.com' } });
    expect(seen).toEqual(['https://a.com']);
  });

  it('fires onClose on Escape', () => {
    let closed = false;
    render(<LinkEditor onClose={() => { closed = true; }} />);

    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    expect(closed).toBe(true);
  });
});

describe('FontPicker', () => {
  it('renders every font as a listbox option with its description', () => {
    render(<FontPicker />);

    expect(screen.getByRole('listbox', { name: 'Choose a font' })).toBeInTheDocument();
    expect(screen.getAllByRole('option')).toHaveLength(FONT_OPTIONS.length);
    expect(screen.getByText('Casual marker')).toBeInTheDocument();
    expect(screen.getByText('Clean & modern')).toBeInTheDocument();
  });

  it('marks only the selected font and reports the option on select', () => {
    const picked: Array<[string, string]> = [];
    render(<FontPicker value="kalam" onSelect={(id, font) => picked.push([id, font.stack])} />);

    const selected = screen.getAllByRole('option').filter((o) => o.getAttribute('aria-selected') === 'true');
    expect(selected).toHaveLength(1);
    expect(selected[0]).toHaveTextContent('Kalam');

    fireEvent.click(screen.getByRole('option', { name: /Georgia/ }));
    expect(picked).toEqual([['georgia', "Georgia, 'Times New Roman', serif"]]);
  });

  it('previews each row in its own face', () => {
    render(<FontPicker />);

    const caveat = screen.getByRole('option', { name: /Caveat/ });
    // Both the Ag swatch and the family name are set in the family itself.
    // (Read style.fontFamily, not the raw attribute — serialisation drops quotes.)
    const inFace = Array.from(caveat.querySelectorAll('span')).filter((s) =>
      (s as HTMLElement).style.fontFamily.includes('Caveat'),
    );
    expect(inFace).toHaveLength(2);

    // The description stays in the UI font, not the previewed face
    const desc = screen.getByText('Casual marker') as HTMLElement;
    expect(desc.style.fontFamily).not.toContain('Caveat');
  });

  it('starts its tab stop on the selected row and moves with arrows', () => {
    render(<FontPicker value="caveat" />);
    const options = screen.getAllByRole('option');

    expect(options.filter((o) => (o as HTMLButtonElement).tabIndex === 0)).toHaveLength(1);
    expect(options[2].tabIndex).toBe(0);   // caveat is third

    options[2].focus();
    fireEvent.keyDown(options[2], { key: 'ArrowDown' });
    expect(document.activeElement).toBe(options[3]);

    fireEvent.keyDown(options[3], { key: 'Home' });
    expect(document.activeElement).toBe(options[0]);
  });

  it('fires onClose on Escape', () => {
    let closed = false;
    render(<FontPicker onClose={() => { closed = true; }} />);

    fireEvent.keyDown(screen.getByRole('listbox'), { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('loads every offered family, so no row previews in a fallback face', () => {
    const css = readFileSync(join(process.cwd(), 'src/styles/fonts.css'), 'utf8');
    // Families the browser already has need no @import
    const SYSTEM = new Set(['georgia']);

    for (const font of FONT_OPTIONS) {
      const family = font.stack.split(',')[0].replace(/'/g, '').trim();
      if (SYSTEM.has(font.id)) continue;
      expect(css, `${family} is offered by FontPicker but not imported in fonts.css`)
        .toContain(family.replace(/ /g, '+'));
    }
  });
});

describe('LinkBtnEditor', () => {
  it('renders both fields, the icon row, and the primary action', () => {
    render(<LinkBtnEditor />);

    expect(screen.getByRole('dialog', { name: 'Add a link' })).toBeInTheDocument();
    expect(screen.getByLabelText('Link text')).toHaveAttribute('placeholder', 'e.g. Our website');
    expect(screen.getByLabelText('Link URL')).toHaveAttribute('placeholder', 'https://…');
    expect(screen.getByRole('button', { name: 'Choose emoji' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Link icon' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add link' })).toBeInTheDocument();
  });

  it('keeps Add disabled until a URL is entered', () => {
    render(<LinkBtnEditor />);

    expect(screen.getByRole('button', { name: 'Add link' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: 'https://heartstamp.com' } });
    expect(screen.getByRole('button', { name: 'Add link' })).toBeEnabled();
  });

  it('defaults to the link glyph and reports it on apply', () => {
    const applied: unknown[] = [];
    render(<LinkBtnEditor onApply={(v) => applied.push(v)} />);

    fireEvent.change(screen.getByLabelText('Link text'), { target: { value: ' Our site ' } });
    fireEvent.change(screen.getByLabelText('Link URL'), { target: { value: ' https://heartstamp.com ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    expect(applied).toEqual([
      { text: 'Our site', url: 'https://heartstamp.com', icon: { kind: 'link' } },
    ]);
  });

  it('swaps the icon for a chosen emoji, then back again', () => {
    const applied: unknown[] = [];
    render(<LinkBtnEditor defaultUrl="https://heartstamp.com" onApply={(v) => applied.push(v)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Choose emoji' }));
    fireEvent.click(screen.getByRole('button', { name: 'Party popper' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    expect(applied[0]).toMatchObject({ icon: { kind: 'emoji', char: '🎉' } });

    fireEvent.click(screen.getByRole('button', { name: 'Link icon' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add link' }));

    expect(applied[1]).toMatchObject({ icon: { kind: 'link' } });
  });

  it('closes the emoji layer after a pick', () => {
    render(<LinkBtnEditor />);

    fireEvent.click(screen.getByRole('button', { name: 'Choose emoji' }));
    expect(screen.getByRole('dialog', { name: 'Emoji picker' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Party popper' }));
    expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
  });

  it('Escape closes the emoji layer first and the panel second', () => {
    let closed = false;
    render(<LinkBtnEditor onClose={() => { closed = true; }} />);
    const panel = screen.getByRole('dialog', { name: 'Add a link' });

    fireEvent.click(screen.getByRole('button', { name: 'Choose emoji' }));
    fireEvent.keyDown(panel, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: 'Emoji picker' })).not.toBeInTheDocument();
    expect(closed).toBe(false);

    fireEvent.keyDown(panel, { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('does not submit when Enter is pressed in the emoji search', () => {
    const applied: unknown[] = [];
    render(<LinkBtnEditor defaultUrl="https://heartstamp.com" onApply={(v) => applied.push(v)} />);

    fireEvent.click(screen.getByRole('button', { name: 'Choose emoji' }));
    fireEvent.keyDown(screen.getByRole('searchbox', { name: 'Search emoji' }), { key: 'Enter' });

    expect(applied).toEqual([]);
  });

  it('submits on Enter from either field', () => {
    const applied: unknown[] = [];
    render(<LinkBtnEditor defaultUrl="https://heartstamp.com" onApply={(v) => applied.push(v)} />);

    fireEvent.keyDown(screen.getByLabelText('Link text'), { key: 'Enter' });
    expect(applied).toHaveLength(1);
  });
});

describe('CSS custom property contract', () => {
  /* Families supplied at runtime rather than by our token layer. */
  const EXTERNAL = [
    '--radix-',   // Radix UI measures triggers and sets these on the element
    '--spacing',  // Tailwind v4 built-in
  ];

  /* Deliberate override hooks: undefined by design, always used with a default
     so a consumer can theme them per subtree. */
  const OVERRIDE_HOOKS = ['--chatbot-hero-bg'];

  const uiDir = join(process.cwd(), 'src/app/components/ui');

  const defined = () => {
    const tokens = new Set<string>();
    /* Matches all three ways this repo declares a custom property:
       CSS (`--x: v;`), CSS text inside a TS template (`--tb-x: var(--x);`),
       and a JS style object with a quoted key (`"--sidebar-width": W`). */
    const add = (dir: string, files: string[]) => {
      for (const f of files) {
        for (const m of readFileSync(join(dir, f), 'utf8').matchAll(/(--[a-z0-9-]+)["']?\s*:/g)) {
          tokens.add(m[1]);
        }
      }
    };
    add(join(process.cwd(), 'src/css'), readdirSync(join(process.cwd(), 'src/css')));
    add(join(process.cwd(), 'src/styles'), readdirSync(join(process.cwd(), 'src/styles')));
    // Component-scoped families declared as CSS text in TS, e.g. --tb-* in hs-stampy-constants
    add(uiDir, readdirSync(uiDir).filter((f) => f.endsWith('.ts') || f.endsWith('.tsx')));
    return tokens;
  };

  it('never references an undefined token without a fallback', () => {
    /* `var(--missing)` with no fallback makes the whole declaration invalid and
       the browser drops it — a silent rendering bug. With a fallback it merely
       loses theming, which is caught separately below. */
    const tokens = defined();
    const offenders: string[] = [];

    for (const file of readdirSync(uiDir).filter((f) => f.endsWith('.tsx'))) {
      const src = readFileSync(join(uiDir, file), 'utf8');
      for (const m of src.matchAll(/var\((--[a-z0-9-]+)\s*\)/g)) {
        const token = m[1];
        if (tokens.has(token)) continue;
        if (EXTERNAL.some((p) => token.startsWith(p))) continue;
        offenders.push(`${file}: var(${token})`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('defines every token referenced with a fallback, bar documented hooks', () => {
    const tokens = defined();
    const offenders: string[] = [];

    for (const file of readdirSync(uiDir).filter((f) => f.endsWith('.tsx'))) {
      const src = readFileSync(join(uiDir, file), 'utf8');
      for (const m of src.matchAll(/var\((--[a-z0-9-]+)\s*,/g)) {
        const token = m[1];
        if (tokens.has(token)) continue;
        if (EXTERNAL.some((p) => token.startsWith(p))) continue;
        if (OVERRIDE_HOOKS.includes(token)) continue;
        offenders.push(`${file}: var(${token}, …)`);
      }
    }

    expect(offenders).toEqual([]);
  });

  it('carries the tokens that back previously-broken declarations', () => {
    const css = readFileSync(join(process.cwd(), 'src/css/tokens.css'), 'utf8');
    // Each of these was referenced by a component before it existed
    expect(css).toMatch(/--space-0-5:\s*2px/);            // hs-pill-tabs, hs-editor-nav
    expect(css).toMatch(/--space-16:\s*64px/);            // hs-style-sidebar
    expect(css).toMatch(/--color-state-warning:\s*#f59e0b/); // hs-alrt, hs-bdg
    expect(css).toMatch(/--inp-padding-x:\s*12px/);       // hs-inp
    expect(css).toMatch(/--inp-padding-y:\s*9px/);        // hs-inp
  });
});

describe('GridOverlay / GridInspector', () => {
  const fakeMain = (left: number, width: number) => {
    const el = document.createElement('main');
    el.getBoundingClientRect = () => ({
      left, width, right: left + width, top: 0, bottom: 0, height: 0, x: left, y: 0, toJSON: () => {},
    }) as DOMRect;
    document.body.appendChild(el);
    return el;
  };

  it('mirrors the breakpoints declared in grid.css', () => {
    const css = readFileSync(join(process.cwd(), 'src/css/grid.css'), 'utf8');
    // grid.css: <768 => 4 cols, 768-1023 => 12 @16px, >=1024 => 12 @24px
    expect(css).toMatch(/max-width:\s*767px/);
    expect(css).toMatch(/min-width:\s*768px\).*max-width:\s*1023px/s);

    expect(gridBreakpointFor(375)).toMatchObject({ name: 'Mobile', columns: 4, gutter: 16 });
    expect(gridBreakpointFor(768)).toMatchObject({ name: 'Tablet', columns: 12, gutter: 16 });
    expect(gridBreakpointFor(1024)).toMatchObject({ name: 'Desktop', columns: 12, gutter: 24 });
    // Boundaries land on the right side
    expect(gridBreakpointFor(767).name).toBe('Mobile');
    expect(gridBreakpointFor(1023).name).toBe('Tablet');
  });

  it('widens the track to 1400px on the Wide tier, in step with tokens.css', () => {
    /* The Wide media query lives in tokens.css, not grid.css, because it only
       restates --grid-max-width. Two sources of truth for one breakpoint is
       exactly the drift this asserts against: the helper below is what app
       code branches on, and it has to agree with the CSS that actually ships. */
    const tokens = readFileSync(join(process.cwd(), 'src/css/tokens.css'), 'utf8');
    expect(tokens).toMatch(/--grid-max-width:\s*1200px/);
    expect(tokens).toMatch(/@media\s*\(min-width:\s*2000px\)\s*\{\s*:root\s*\{\s*--grid-max-width:\s*1400px/s);

    expect(gridBreakpointFor(2560)).toMatchObject({ name: 'Wide', columns: 12, gutter: 24, maxWidth: 1400 });
    // Wide changes the track and nothing else, so spans stay put
    expect(gridBreakpointFor(2560).columns).toBe(gridBreakpointFor(1440).columns);
    expect(gridBreakpointFor(2560).gutter).toBe(gridBreakpointFor(1440).gutter);
    expect(gridBreakpointFor(2560).margin).toBe(gridBreakpointFor(1440).margin);

    // The 2000px boundary matches the media query: >= 2000 is Wide
    expect(gridBreakpointFor(1999).name).toBe('Desktop');
    expect(gridBreakpointFor(2000).name).toBe('Wide');

    // A maximized Full HD window stays narrow; the tier is not resolution-keyed
    expect(gridBreakpointFor(1905)).toMatchObject({ name: 'Desktop', maxWidth: 1200 });
    // Every tier below Wide keeps the 1200px track
    for (const w of [375, 768, 1024, 1440, 1920]) {
      expect(gridBreakpointFor(w).maxWidth).toBe(1200);
    }
  });

  it('aligns to a target column instead of the viewport', () => {
    /* The original bug: the overlay was viewport-centred, so inside the docs
       shell (content offset by a sidebar) the columns could never line up. */
    const main = fakeMain(280, 900);
    const { container } = render(<GridOverlay visible alignTo="main" />);

    const el = container.querySelector<HTMLElement>('.hs-grid-overlay')!;
    expect(el.style.getPropertyValue('--grid-overlay-left')).toBe('280px');
    expect(el.style.getPropertyValue('--grid-overlay-width')).toBe('900px');

    document.body.removeChild(main);
  });

  it('spans the viewport when no target is given', () => {
    const { container } = render(<GridOverlay visible />);
    const el = container.querySelector<HTMLElement>('.hs-grid-overlay')!;
    // No inline hooks — grid.css supplies the left:0 / width:100% defaults
    expect(el.style.getPropertyValue('--grid-overlay-left')).toBe('');
  });

  it('sizes the viewport-mode overlay in %, not vw', () => {
    /* 100vw includes the scrollbar; .hs-page-grid is centred by margin:auto
       inside the content box, which does not. Mixing the two centres the guide
       about half a scrollbar off the grid it is meant to measure, so the one
       thing the overlay exists to prove is the thing it gets wrong. */
    const css = readFileSync(join(process.cwd(), 'src/css/grid.css'), 'utf8');
    const rule = css.slice(css.indexOf('.hs-grid-overlay {'), css.indexOf('.hs-grid-overlay--visible'));
    expect(rule).toContain('var(--grid-overlay-width, 100%)');
    expect(rule).not.toMatch(/width:\s*var\(--grid-overlay-width,\s*100vw\)/);
  });

  it('only shows the columns when visible', () => {
    const { container: off } = render(<GridOverlay />);
    expect(off.querySelector('.hs-grid-overlay')!.className).not.toContain('--visible');

    const { container: on } = render(<GridOverlay visible />);
    expect(on.querySelector('.hs-grid-overlay')!.className).toContain('--visible');
  });

  it('draws the panel from the contrast-inverting secondary pair, not primary red', () => {
    /* --color-brand-primary is a dark red; mixed into the dark background it
       lands within a few channel values of the page and vanishes.
       --color-brand-secondary inverts with the theme (#242423 light /
       #f5f5f4 dark), so a tint of it always separates. */
    const src = readFileSync(join(process.cwd(), 'src/app/components/ui/hs-grid-overlay.tsx'), 'utf8');

    expect(src).toContain('var(--color-brand-secondary');
    expect(src).toContain('var(--color-text-on-secondary');
    expect(src).not.toContain('--color-brand-primary');
    // The active lift must not be a red glow either
    expect(src).not.toContain('rgba(190, 29, 44');
  });

  it('keeps the column tint legible in dark mode', () => {
    const css = readFileSync(join(process.cwd(), 'src/css/grid.css'), 'utf8');

    // Tint held in variables so the theme can restate it
    expect(css).toMatch(/--grid-overlay-fill:/);
    expect(css).toMatch(/--grid-overlay-line:/);
    expect(css).toMatch(/background: var\(--grid-overlay-fill\)/);

    // And a dark override exists, keyed off both theme conventions
    expect(css).toMatch(/\.dark \.hs-grid-overlay/);
    expect(css).toMatch(/\[data-theme="dark"\] \.hs-grid-overlay/);

    /* The dark fill must actually be more visible than simply reusing the
       light value would be. Compare channel distance from each background. */
    const composite = (fg: number[], a: number, bg: number[]) =>
      fg.reduce((acc, f, i) => acc + Math.abs(Math.round(a * f + (1 - a) * bg[i]) - bg[i]), 0);

    const darkBlock = css.slice(css.indexOf('.dark .hs-grid-overlay'));
    const [, r, g, b, a] = darkBlock.match(/--grid-overlay-fill:\s*rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/)!;
    const darkFill = composite([+r, +g, +b], +a, [20, 20, 20]);
    const naiveReuse = composite([190, 29, 44], 0.08, [20, 20, 20]);

    expect(darkFill).toBeGreaterThan(naiveReuse * 2);
  });

  it('sits above the overlay, or the columns paint over the control', () => {
    /* The overlay is z-index 9000 and spans the full viewport height, so a bar
       stacked below it gets red-striped — exactly the control you need to read
       in order to turn the grid off. */
    const css = readFileSync(join(process.cwd(), 'src/css/grid.css'), 'utf8');
    const overlayZ = Number(css.match(/z-index:\s*(\d+)/)![1]);

    const { container } = render(<GridInspector />);
    const bar = container.firstElementChild as HTMLElement;

    expect(Number(bar.style.zIndex)).toBeGreaterThan(overlayZ);
    // Opaque, so the overlay cannot bleed through it either
    expect(bar.style.background).toContain('var(--color-bg-main');
  });

  it('survives an environment with no ResizeObserver', () => {
    /* jsdom has none, and an unguarded constructor throws inside the effect and
       takes the overlay down with it. */
    expect(typeof ResizeObserver).toBe('undefined');
    const main = fakeMain(100, 500);

    expect(() => render(<GridOverlay visible alignTo="main" />)).not.toThrow();

    document.body.removeChild(main);
  });

  it('reads as a named tool region, not a row of page content', () => {
    /* The panel disappeared on a dense page when it was a thin unlabelled
       strip. It is now a titled region with its own surface. */
    render(<GridInspector />);

    const panel = screen.getByRole('region', { name: 'Grid inspector' });
    expect(panel).toBeInTheDocument();
    expect(screen.getByText('Grid inspector')).toBeInTheDocument();
    // A distinct tinted field, so it never reads as body copy
    expect(panel.style.background).toContain('color-mix');
  });

  it('explains itself at rest, then swaps in the live numbers', () => {
    render(<GridInspector />);

    expect(screen.getByRole('button', { name: /Show grid/ })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByText(/Overlay the column guide/)).toBeInTheDocument();
    expect(screen.queryByText(/gutter/)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Show grid/ }));

    expect(screen.queryByText(/Overlay the column guide/)).not.toBeInTheDocument();
    expect(screen.getByText(/columns/)).toBeInTheDocument();
    expect(screen.getByText(/gutter/)).toBeInTheDocument();
  });

  it('toggles the overlay from the bar and reports it', () => {
    const seen: boolean[] = [];
    const { container } = render(<GridInspector onVisibleChange={(v) => seen.push(v)} />);

    fireEvent.click(screen.getByRole('button', { name: /Show grid/ }));

    expect(seen).toEqual([true]);
    expect(container.querySelector('.hs-grid-overlay')!.className).toContain('--visible');
    expect(screen.getByRole('button', { name: /Hide grid/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('toggles on Ctrl+G / Cmd+G, and not when the shortcut is off', () => {
    const { container, unmount } = render(<GridInspector />);
    fireEvent.keyDown(window, { key: 'g', ctrlKey: true });
    expect(container.querySelector('.hs-grid-overlay')!.className).toContain('--visible');
    unmount();

    const { container: noShortcut } = render(<GridInspector shortcut={false} />);
    fireEvent.keyDown(window, { key: 'g', metaKey: true });
    expect(noShortcut.querySelector('.hs-grid-overlay')!.className).not.toContain('--visible');
  });
});

describe('developer-facing docs stay in step with the code', () => {
  const read = (p: string) => readFileSync(join(process.cwd(), p), 'utf8');

  /** Prop names declared on an exported interface. */
  const propsOf = (src: string, iface: string) => {
    const body = src.slice(src.indexOf(`interface ${iface}`));
    const block = body.slice(body.indexOf('{') + 1, body.indexOf('\n}'));
    return [...block.matchAll(/^\s{2}(\w+)\??:/gm)]
      .map((m) => m[1])
      // Passthroughs every component takes; not worth a table row each
      .filter((n) => !['style', 'className'].includes(n));
  };

  it('documents every prop of the components on the Grid page', () => {
    /* Two components shipped with 11 props between them and no table at all.
       This asserts the page names each one. */
    const src = read('src/app/components/ui/hs-grid-overlay.tsx');
    const page = read('src/app/App.tsx');
    const gridSection = page.slice(page.indexOf('function PageTokensGrid'));

    const undocumented: string[] = [];
    for (const iface of ['GridOverlayProps', 'GridInspectorProps']) {
      for (const prop of propsOf(src, iface)) {
        if (!new RegExp(`name:\\s*"${prop}"`).test(gridSection)) {
          undocumented.push(`${iface}.${prop}`);
        }
      }
    }

    expect(undocumented).toEqual([]);
  });

  it('keeps the documented breakpoint table equal to the code and the CSS', () => {
    const page = read('src/app/App.tsx');
    const table = page.slice(page.indexOf('const breakpoints = ['), page.indexOf('const columnExamples'));

    /* 2560 covers Wide, whose only distinguishing value is maxWidth — the card
       renders identically to Desktop without it, so the docs would look right
       while saying nothing. */
    for (const width of [375, 800, 1440, 2560]) {
      const bp = gridBreakpointFor(width);
      const row = table.split('\n').find((l) => l.includes(`"${bp.name}"`))!;
      expect(row, `${bp.name} row`).toContain(`cols: ${bp.columns}`);
      expect(row, `${bp.name} row`).toContain(`gutter: "${bp.gutter}px"`);
      expect(row, `${bp.name} row`).toContain(`margin: "${bp.margin}px"`);
      expect(row, `${bp.name} row`).toContain(`maxWidth: "${bp.maxWidth}px"`);
    }

    // The card body has to actually render the max-width row, or the tier is invisible
    expect(page).toContain('["Max width", bp.maxWidth]');
  });
});

describe('interaction states', () => {
  const kit = () => readFileSync(join(process.cwd(), 'src/app/components/ui/hs-popover-kit.tsx'), 'utf8');

  it('defines hover, press, focus and disabled on the interaction tokens', () => {
    /* Asserts the CSS a component actually injects, not the source that builds
       it — otherwise refactoring the string breaks the test without a regression. */
    const { container } = render(<FmtToolbar />);
    const css = Array.from(container.querySelectorAll('style')).map((s) => s.textContent).join('\n');

    expect(css).toMatch(/:hover:not\(:disabled\) \{ background: var\(--color-state-hover/);
    expect(css).toMatch(/:active:not\(:disabled\) \{ background: var\(--color-state-pressed/);
    expect(css).toMatch(/:focus-visible \{ outline: 2px solid var\(--color-ring\)/);
    expect(css).toMatch(/\[data-on="true"\] \{ background: var\(--color-element-subtle/);
    expect(css).toMatch(/:disabled \{ opacity/);
    // The resting fill must come from CSS, or an inline one would outrank it
    expect(css).toMatch(/\.hs-ctl \{ background: transparent/);
  });

  it('tags every interactive control in the panels', () => {
    for (const f of ['hs-fmt-toolbar', 'hs-emoji-picker', 'hs-font-picker', 'hs-social-handles', 'hs-link-btn-editor']) {
      const src = readFileSync(join(process.cwd(), `src/app/components/ui/${f}.tsx`), 'utf8');
      expect(src, f).toContain('CONTROL_CLASS');
      expect(src, f).toContain('<ControlStyles />');
    }
  });

  it('leaves no inline background on a tagged control, which would beat the CSS', () => {
    /* Inline styles outrank a stylesheet, so a resting `background` on a plain
       CONTROL_CLASS button silently kills hover, press and the on-state — the
       control looks completely unwired.
       Checks the RENDERED DOM: an earlier version of this test scanned JSX text
       and missed it, because the background came from a shared style object
       referenced by name. CONTROL_FILLED opts out — those carry their own fill
       and take the tint as an inset shadow instead. */
    const offenders: string[] = [];

    const scan = (label: string, ui: React.ReactElement) => {
      const { container, unmount } = render(ui);
      for (const b of Array.from(container.querySelectorAll<HTMLElement>(`button.${'hs-ctl'}`))) {
        if (b.classList.contains('hs-ctl--filled')) continue;
        if (b.style.background) offenders.push(`${label}: ${b.getAttribute('aria-label') ?? '?'} → ${b.style.background}`);
      }
      unmount();
    };

    scan('FmtToolbar', <FmtToolbar />);
    scan('EmojiPicker', <EmojiPicker />);
    scan('FontPicker', <FontPicker />);
    scan('SocialHandles', <SocialHandles />);
    scan('LinkBtnEditor', <LinkBtnEditor />);

    expect(offenders).toEqual([]);
  });

  it('caps panel width so a 382px sheet cannot overflow a 320px viewport', () => {
    expect(kit()).toMatch(/maxWidth: "calc\(100vw - var\(--space-4, 16px\) \* 2\)"/);
  });

  it('drives the toolbar on-state from data-on, not a JS hover hook', () => {
    render(<FmtToolbar active={['bold']} />);

    expect(screen.getByRole('button', { name: 'Bold' })).toHaveAttribute('data-on', 'true');
    expect(screen.getByRole('button', { name: 'Italic' })).not.toHaveAttribute('data-on');
  });
});

describe('placeholders are defined once and shared', () => {
  const read = (f: string) => readFileSync(join(process.cwd(), `src/app/components/ui/${f}`), 'utf8');
  const PANELS = ['hs-emoji-picker.tsx', 'hs-link-editor.tsx', 'hs-social-handles.tsx', 'hs-link-btn-editor.tsx'];

  it('resolves the placeholder colour to the themed disabled-text token, in one place', () => {
    expect(read('hs-popover-kit.tsx')).toContain('var(--color-text-disabled');
  });

  it('wires every panel with a placeholder to the shared class', () => {
    for (const f of PANELS) {
      expect(read(f), f).toContain('PLACEHOLDER_CLASS');
      // No panel may define its own ::placeholder rule
      expect(read(f), f).not.toContain('::placeholder');
    }
  });

  it('leaves no raw placeholder grey anywhere in the component layer', () => {
    for (const f of [...PANELS, 'hs-popover-kit.tsx', 'hs-font-picker.tsx', 'hs-fmt-toolbar.tsx']) {
      expect(read(f), f).not.toContain('#757575');
    }
  });
});

describe('SocialHandles', () => {
  const SEED = [{ platformId: 'instagram', value: '@easiblu' }];

  it('renders the heading, copy, and any handles already added', () => {
    render(<SocialHandles defaultHandles={SEED} />);

    expect(screen.getByRole('dialog', { name: 'Your social handles' })).toBeInTheDocument();
    expect(screen.getByText('@easiblu')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Remove Instagram @easiblu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add to cover' })).toBeInTheDocument();
  });

  it('keeps Add disabled until something is typed, then appends a row', () => {
    render(<SocialHandles />);

    expect(screen.getByRole('button', { name: 'Add' })).toBeDisabled();

    fireEvent.change(screen.getByLabelText('@handle or full link'), { target: { value: '@stampy' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    expect(screen.getByText('@stampy')).toBeInTheDocument();
    // Field resets so the next handle can be typed straight away
    expect(screen.getByLabelText('@handle or full link')).toHaveValue('');
  });

  it('adds on Enter as well as the button', () => {
    render(<SocialHandles />);
    const field = screen.getByLabelText('@handle or full link');

    fireEvent.change(field, { target: { value: '@viaenter' } });
    fireEvent.keyDown(field, { key: 'Enter' });

    expect(screen.getByText('@viaenter')).toBeInTheDocument();
  });

  it('removes a handle', () => {
    render(<SocialHandles defaultHandles={SEED} />);

    fireEvent.click(screen.getByRole('button', { name: 'Remove Instagram @easiblu' }));
    expect(screen.queryByText('@easiblu')).not.toBeInTheDocument();
  });

  it('hands the current list to onApply', () => {
    const applied: string[][] = [];
    render(<SocialHandles defaultHandles={SEED} onApply={(l) => applied.push(l.map((h) => h.value))} />);

    fireEvent.click(screen.getByRole('button', { name: 'Add to cover' }));
    expect(applied).toEqual([['@easiblu']]);
  });

  it('reports adds and removes through onChange', () => {
    const seen: number[] = [];
    render(<SocialHandles defaultHandles={SEED} onChange={(l) => seen.push(l.length)} />);

    fireEvent.change(screen.getByLabelText('@handle or full link'), { target: { value: '@two' } });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove Instagram @easiblu' }));

    expect(seen).toEqual([2, 1]);
  });

  it('hides the close button when no onClose is given', () => {
    const { rerender } = render(<SocialHandles />);
    expect(screen.queryByRole('button', { name: 'Close' })).not.toBeInTheDocument();

    rerender(<SocialHandles onClose={() => {}} />);
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  it('shows a real brand mark in the picker rather than a placeholder glyph', () => {
    const { container } = render(<SocialHandles />);

    const picker = screen.getByRole('button', { name: 'Platform: Facebook' });
    // A lucide fallback would carry a lucide-* class; the brand marks do not
    expect(picker.querySelector('svg:not([class])')).not.toBeNull();
  });

  it('falls back to a globe for a link on no recognised platform', () => {
    const { container } = render(
      <SocialHandles defaultHandles={[{ value: 'https://example.com/me' }]} />,
    );

    expect(container.querySelector('.lucide-globe')).not.toBeNull();
  });

  it('infers the platform from a pasted link', () => {
    render(<SocialHandles />);

    fireEvent.change(screen.getByLabelText('@handle or full link'), {
      target: { value: 'https://instagram.com/easiblu' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add' }));

    // The row is labelled with the detected platform, not a generic link
    expect(screen.getByRole('button', { name: /Remove Instagram/ })).toBeInTheDocument();
  });
});

describe('DdMenu fixed mode sizes to its content, not its trigger', () => {
  it('does not clip labels behind a narrow trigger', () => {
    render(
      <DdMenu
        fixed
        trigger={<button style={{ width: 40 }}>▾</button>}
        items={[{ label: 'A very long menu item label' }]}
      />,
    );

    fireEvent.click(screen.getByText('▾'));

    const item = screen.getByText('A very long menu item label');
    const panel = item.closest('div[style*="position: fixed"]') as HTMLElement;

    // A fixed `width` would pin the panel to the trigger and clip the label
    // against the menu's overflow:hidden. It must constrain minWidth only.
    // (jsdom computes no layout, so the trigger rect is 0 — the assertion is
    // about which property is set, not its value.)
    expect(panel.style.width).toBe('');
    expect(panel.style.minWidth).not.toBe('');
    expect(item).toHaveStyle({ whiteSpace: 'nowrap' });
  });
});

describe('social platform helpers', () => {
  it('detects platforms from links but not from bare handles', () => {
    expect(detectSocialPlatform('https://www.instagram.com/easiblu')?.id).toBe('instagram');
    expect(detectSocialPlatform('twitter.com/easiblu')?.id).toBe('x');
    expect(detectSocialPlatform('youtu.be/abc')?.id).toBe('youtube');
    expect(detectSocialPlatform('@easiblu')).toBeUndefined();
    expect(detectSocialPlatform('easiblu')).toBeUndefined();
  });

  it('builds canonical URLs from bare handles and passes links through', () => {
    expect(socialHandleUrl({ platformId: 'instagram', value: '@easiblu' }))
      .toBe('https://instagram.com/easiblu');
    expect(socialHandleUrl({ platformId: 'instagram', value: 'https://instagram.com/easiblu' }))
      .toBe('https://instagram.com/easiblu');
    expect(socialHandleUrl({ value: '' })).toBeUndefined();
    // A bare handle with no platform cannot be resolved
    expect(socialHandleUrl({ value: '@easiblu' })).toBeUndefined();
  });

  it('always returns an absolute URL, so an href never resolves relatively', () => {
    // Scheme-less links are the trap: as an href these would resolve against
    // the current page rather than the platform
    expect(socialHandleUrl({ value: 'instagram.com/easiblu' }))
      .toBe('https://instagram.com/easiblu');
    expect(socialHandleUrl({ value: 'www.example.com/me' }))
      .toBe('https://www.example.com/me');
    // An explicit scheme is preserved untouched
    expect(socialHandleUrl({ value: 'http://example.com/me' }))
      .toBe('http://example.com/me');

    for (const value of ['instagram.com/easiblu', 'www.example.com/me', 'http://example.com/me']) {
      expect(socialHandleUrl({ value })).toMatch(/^https?:\/\//);
    }
  });

  it('exposes one platform entry per brand mark, footer order first', () => {
    expect(SOCIAL_PLATFORMS.map((p) => p.name))
      .toEqual(['Facebook', 'Instagram', 'X', 'YouTube', 'WhatsApp']);
  });
});

describe('Alrt severity tints stay wired to state tokens', () => {
  it('derives the success variant from --color-state-success', () => {
    const { container } = render(<Alrt variant="success" title="Success">Installed.</Alrt>);
    const style = container.firstElementChild?.getAttribute('style') ?? '';

    expect(style).toContain('var(--color-state-success');
    expect(style).not.toContain('#22c55e6');
  });

  it('keeps default and destructive on their semantic tokens', () => {
    const { container: def } = render(<Alrt variant="default">Body</Alrt>);
    expect(def.firstElementChild?.getAttribute('style')).toContain('var(--border)');

    const { container: bad } = render(<Alrt variant="destructive">Body</Alrt>);
    expect(bad.firstElementChild?.getAttribute('style')).toContain('var(--state-error)');
  });
});

describe('WebsiteNavV2 bell opens the notification panel', () => {
  const ITEMS: NotificationItem[] = [
    { id: 'order', title: 'Order delivered', time: '1d', preview: 'Your order HS-1042 arrived.' },
  ];

  it('renders no panel until the bell is pressed', () => {
    render(<WebsiteNavV2 notifications={ITEMS} />);

    expect(screen.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));

    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Order delivered')).toBeInTheDocument();
  });

  it('forwards the row callbacks and reports opening exactly once', () => {
    const onNotifications = vi.fn();
    const onNotificationItemClick = vi.fn();

    render(
      <WebsiteNavV2
        notifications={ITEMS}
        onNotifications={onNotifications}
        onNotificationItemClick={onNotificationItemClick}
      />,
    );

    const bell = screen.getByRole('button', { name: 'Notifications' });

    fireEvent.click(bell);
    expect(onNotifications).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByText('Order delivered'));
    expect(onNotificationItemClick).toHaveBeenCalledWith(expect.objectContaining({ id: 'order' }));

    // Closing is not an open: onNotifications must not fire again on the way out.
    fireEvent.click(bell);
    expect(screen.queryByRole('dialog', { name: 'Notifications' })).not.toBeInTheDocument();
    expect(onNotifications).toHaveBeenCalledTimes(1);
  });
});

describe('WebsiteNavV2 compact bar (mobile)', () => {
  const ITEMS: NotificationItem[] = [
    { id: 'order', title: 'Order delivered', time: '1d', preview: 'Your order HS-1042 arrived.' },
  ];

  it('is one component for both layouts, so a caller mounts it once', () => {
    const { rerender } = render(<WebsiteNavV2 />);

    // Wide: the desktop rows.
    expect(screen.getByRole('button', { name: 'Get the App' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Card categories' })).toBeInTheDocument();

    // Narrow: the same element becomes the compact bar. No second import.
    rerender(<WebsiteNavV2 mobile />);
    expect(screen.queryByRole('button', { name: 'Get the App' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('collapses to the icon-only cluster and opens the notification sheet', () => {
    render(<WebsiteNavV2 mobile notifications={ITEMS} />);

    for (const name of ['Search', 'Reminders', 'Language', 'Notifications', 'Cart']) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument();
    }

    // Everything the compact bar drops from the desktop rows.
    expect(screen.queryByRole('button', { name: 'Get the App' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Profile' })).not.toBeInTheDocument();
    expect(screen.queryByRole('navigation', { name: 'Card categories' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }));

    expect(screen.getByRole('dialog', { name: 'Notifications' })).toBeInTheDocument();
    expect(screen.getByText('Order delivered')).toBeInTheDocument();
  });

  it('drops the globe when showLanguage is false, matching production', () => {
    render(<WebsiteNavV2 mobile showLanguage={false} />);

    expect(screen.queryByRole('button', { name: 'Language' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cart' })).toBeInTheDocument();
  });

  describe('scroll auto-hide', () => {
    const scrollTo = (y: number) => {
      Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });
      fireEvent.scroll(window);
    };

    afterEach(() => scrollTo(0));

    it('hides a stuck bar once the page is scrolled past the settle distance', () => {
      render(<WebsiteNavV2 mobile />);

      scrollTo(300);

      expect(screen.getByRole('banner')).toHaveAttribute('data-hidden');
    });

    it('never translates a non-sticky bar, which would lift it over what sits above', () => {
      render(<WebsiteNavV2 mobile sticky={false} />);

      scrollTo(300);

      expect(screen.getByRole('banner')).not.toHaveAttribute('data-hidden');
    });
  });
});

describe('WebsiteNavV2 language dropdown', () => {
  it('opens from the globe, marks the current choice, and reports a pick', () => {
    const onLanguageChange = vi.fn();
    render(<WebsiteNavV2 onLanguageChange={onLanguageChange} />);

    expect(screen.queryByRole('menu', { name: 'Language' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));

    expect(screen.getByRole('menu', { name: 'Language' })).toBeInTheDocument();
    expect(screen.getByRole('menuitemradio', { name: /English/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('menuitemradio', { name: /French/ })).toHaveAttribute('aria-checked', 'false');

    fireEvent.click(screen.getByRole('menuitemradio', { name: /French/ }));

    expect(onLanguageChange).toHaveBeenCalledWith('French');
    expect(screen.queryByRole('menu', { name: 'Language' })).not.toBeInTheDocument();
  });

  it('closes on Escape', () => {
    render(<WebsiteNavV2 />);

    fireEvent.click(screen.getByRole('button', { name: 'Language' }));
    expect(screen.getByRole('menu', { name: 'Language' })).toBeInTheDocument();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('menu', { name: 'Language' })).not.toBeInTheDocument();
  });
});

describe('WebsiteNavV2 reminders sheet', () => {
  it('opens from the Reminders action, reports it, and closes again', () => {
    const onReminders = vi.fn();
    render(<WebsiteNavV2 onReminders={onReminders} />);

    expect(screen.queryByRole('dialog', { name: 'Reminders' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));

    expect(onReminders).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('dialog', { name: 'Reminders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Set Reminders' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'View All Reminders' })).toBeInTheDocument();

    // The shell is the design system Sheet, which keeps the node mounted for
    // its exit animation, so assert the state it reports rather than removal.
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.getByRole('dialog', { name: 'Reminders' })).toHaveAttribute('data-state', 'closed');
  });

  it('portals into portalContainer when given one, and to the body without', () => {
    const frame = document.createElement('div');
    document.body.appendChild(frame);

    const { unmount } = render(<WebsiteNavV2 portalContainer={frame} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));
    expect(frame.contains(screen.getByRole('dialog', { name: 'Reminders' }))).toBe(true);
    unmount();

    // Default stays viewport-level, which is what the spec asks for in an app.
    render(<WebsiteNavV2 />);
    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));
    expect(frame.contains(screen.getByRole('dialog', { name: 'Reminders' }))).toBe(false);

    frame.remove();
  });

  it('bleeds to its container on phone, not to the browser viewport', () => {
    const frame = document.createElement('div');
    document.body.appendChild(frame);

    const { unmount } = render(<WebsiteNavV2 mobile portalContainer={frame} />);
    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));
    // 100vw here would be the whole browser, hanging the contents off the left
    // of the frame and pushing the title and copy out of view.
    expect(screen.getByRole('dialog', { name: 'Reminders' })).toHaveStyle({ width: '100%' });
    unmount();
    frame.remove();

    // Portaled to the body, full bleed really is the viewport.
    render(<WebsiteNavV2 mobile />);
    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));
    expect(screen.getByRole('dialog', { name: 'Reminders' })).toHaveStyle({ width: '100vw' });
  });

  it('is the design system Sheet, not a bespoke panel', () => {
    render(<WebsiteNavV2 />);

    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));

    const sheet = screen.getByRole('dialog', { name: 'Reminders' });
    expect(sheet).toHaveAttribute('data-slot', 'sheet-content');
    expect(sheet).toHaveAttribute('data-vaul-drawer-direction', 'right');
    // Spec width and ground ride on top of SheetContent's own sizing. These
    // must be resolvable values, not nav-scoped custom properties: the sheet
    // portals outside .hs-nav-v2, where those would collapse to transparent.
    expect(sheet).toHaveStyle({ width: '456px', background: '#f9f9f9' });
    expect(sheet.getAttribute('style') ?? '').not.toContain('var(--rem-');
  });

  it('opens from the compact bar as well, so both layouts reach it', () => {
    render(<WebsiteNavV2 mobile />);

    fireEvent.click(screen.getByRole('button', { name: 'Reminders' }));

    expect(screen.getByRole('dialog', { name: 'Reminders' })).toBeInTheDocument();
  });
});

describe('WebsiteNavV2 mega menu', () => {
  const row = () => document.querySelector('.hs-nav-v2__linksrow') as HTMLElement;

  it('opens on category hover and swaps datasets without closing', () => {
    render(<WebsiteNavV2 />);

    // The panel stays mounted so both animations can play, but while closed it
    // is out of the accessibility tree and the tab order, so a role query must
    // not find it. The row's flag is what says it is open.
    expect(row()).not.toHaveAttribute('data-mega-open');
    expect(document.querySelector('.hs-nav-v2__megapanel')).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: 'Category menu' })).not.toBeInTheDocument();

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Bday' }));

    expect(row()).toHaveAttribute('data-mega-open');
    // Open, and now exposed.
    expect(screen.getByRole('region', { name: 'Category menu' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bday' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('By Age')).toBeInTheDocument();

    // Moving to another category swaps the dataset and stays open.
    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Wedding' }));

    expect(row()).toHaveAttribute('data-mega-open');
    expect(screen.getByRole('button', { name: 'Bday' })).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByText('By Age')).not.toBeInTheDocument();
    expect(screen.getByText('By Moment')).toBeInTheDocument();
  });

  it('opens on focus as well, for keyboard parity with hover', () => {
    render(<WebsiteNavV2 />);

    fireEvent.focus(screen.getByRole('button', { name: 'Congrats' }));

    expect(row()).toHaveAttribute('data-mega-open');
  });

  it('closes immediately on Escape', () => {
    render(<WebsiteNavV2 />);

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Bday' }));
    fireEvent.keyDown(row(), { key: 'Escape' });

    expect(row()).not.toHaveAttribute('data-mega-open');
  });

  it('holds open for the grace period when the pointer leaves the row', () => {
    vi.useFakeTimers();
    try {
      render(<WebsiteNavV2 />);

      fireEvent.mouseEnter(screen.getByRole('button', { name: 'Bday' }));
      fireEvent.mouseLeave(row());

      // Still open, so the pointer can cross the gap down into the panel.
      expect(row()).toHaveAttribute('data-mega-open');

      act(() => { vi.advanceTimersByTime(140); });
      expect(row()).not.toHaveAttribute('data-mega-open');
    } finally {
      vi.useRealTimers();
    }
  });

  it('is absent on the compact bar, which is what production ships', () => {
    render(<WebsiteNavV2 mobile />);

    expect(screen.queryByRole('region', { name: 'Category menu' })).not.toBeInTheDocument();
  });

  it('can be dropped, leaving the row as plain links', () => {
    render(<WebsiteNavV2 showMegaMenu={false} />);

    expect(screen.queryByRole('region', { name: 'Category menu' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Bday' })).not.toHaveAttribute('aria-haspopup');
  });

  it('reports the category alongside the item that was clicked', () => {
    const onMegaSelect = vi.fn();
    render(<WebsiteNavV2 onMegaSelect={onMegaSelect} />);

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Bday' }));
    fireEvent.click(screen.getByRole('button', { name: 'For Mum' }));

    expect(onMegaSelect).toHaveBeenCalledWith('Bday', 'For Mum');
  });
});

describe('WebsiteNavV2 mega menu survives hostile category labels', () => {
  it('falls back instead of resolving inherited Object members', () => {
    // megaMenus is documented as CMS-fed, so a label like "__proto__" is
    // reachable. A plain map lookup returns Object.prototype here, tests
    // truthy, defeats the ?? fallback and throws on data.filters.map.
    for (const label of ['__proto__', 'constructor', 'toString']) {
      const { unmount } = render(
        <WebsiteNavV2 categories={[label]} defaultOpenCategory={label} />,
      );

      // Renders, and shows the fallback dataset rather than crashing.
      expect(screen.getByRole('region', { name: 'Category menu' })).toBeInTheDocument();
      expect(screen.getByText('By Age')).toBeInTheDocument();
      unmount();
    }
  });
});

describe('WebsiteNavV2 review regressions', () => {
  const row = () => document.querySelector('.hs-nav-v2__linksrow') as HTMLElement;
  const setScroll = (y: number) =>
    Object.defineProperty(window, 'scrollY', { value: y, configurable: true, writable: true });

  afterEach(() => setScroll(0));

  it('reports the hover-out even with the panel switched off', () => {
    // showMegaMenu={false} is the mode where a consumer drives its own panel
    // from onCategoryHover, so the null close signal is the whole contract.
    const onCategoryHover = vi.fn();
    render(<WebsiteNavV2 showMegaMenu={false} onCategoryHover={onCategoryHover} />);

    fireEvent.mouseEnter(screen.getByRole('button', { name: 'Bday' }));
    expect(onCategoryHover).toHaveBeenCalledWith('Bday');

    fireEvent.mouseLeave(row());
    expect(onCategoryHover).toHaveBeenLastCalledWith(null);
  });

  it('does not hide the bar on an upward scroll when it starts below the fold', () => {
    // Seeding the tracker at 0 made the first scroll from y=590 read as a
    // 590px downward delta and hid the bar on an upward flick.
    setScroll(600);
    render(<WebsiteNavV2 mobile />);

    setScroll(590);
    fireEvent.scroll(window);

    expect(screen.getByRole('banner')).not.toHaveAttribute('data-hidden');
  });
});
