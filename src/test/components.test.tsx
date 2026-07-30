import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
  type CoachTipItem,
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

  it('emphasises AlrtStrong with text-primary at weight 600', () => {
    render(<StampyAlrt title="Title"><AlrtStrong>emphasised</AlrtStrong></StampyAlrt>);

    expect(screen.getByText('emphasised')).toHaveStyle({ fontWeight: '600' });
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
