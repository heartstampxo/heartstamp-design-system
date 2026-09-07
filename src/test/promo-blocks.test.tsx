import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import {
  ChristmasPromo,
  CHRISTMAS_PROMO_BANNER,
  CHRISTMAS_PROMO_CARDS,
  CHRISTMAS_PROMO_FEATURES,
  CHRISTMAS_PROMO_GROUND,
  CHRISTMAS_PROMO_PIXEL_BAND,
  PromoBand,
  HalloweenPromo,
  HALLOWEEN_PROMO_BANNER,
  HALLOWEEN_PROMO_CARDS,
  HALLOWEEN_PROMO_DECORATIONS,
  HALLOWEEN_PROMO_FEATURES,
  HALLOWEEN_PROMO_GROUND,
  IndependencePromo,
  INDEPENDENCE_PROMO_BANNER,
  INDEPENDENCE_PROMO_CARDS,
  INDEPENDENCE_PROMO_FEATURES,
  INDEPENDENCE_PROMO_FLAG,
  INDEPENDENCE_PROMO_FLAG_HEIGHT,
  INDEPENDENCE_PROMO_GROUND,
  NewYearPromo,
  NEW_YEAR_PROMO_BANNER,
  NEW_YEAR_PROMO_CARDS,
  NEW_YEAR_PROMO_FEATURES,
  NEW_YEAR_PROMO_GROUND,
  NEW_YEAR_PROMO_TOP_BAND_HEIGHT,
  ThanksgivingPromo,
  THANKSGIVING_PROMO_HEAD_WIDTH,
  ValentinesPromo,
  VALENTINES_PROMO_BANNER,
  VALENTINES_PROMO_CARDS,
  VALENTINES_PROMO_FEATURES,
  VALENTINES_PROMO_GROUND,
  VALENTINES_PROMO_HEAD_WIDTH,
  VALENTINES_PROMO_TOP_BAND,
  THANKSGIVING_PROMO_BANNER,
  THANKSGIVING_PROMO_CARDS,
  THANKSGIVING_PROMO_FEATURES,
  THANKSGIVING_PROMO_GROUND,
  THANKSGIVING_PROMO_PIXEL_BAND,
} from '../index';

/**
 * The seasonal bands share one engine, so the risk these cover is a change to
 * PromoBand quietly altering a season that is already published, or a season's
 * exported defaults going missing from the package root.
 */
describe('promo blocks', () => {
  it('exports the engine and both seasons from the package root', () => {
    expect(PromoBand).toBeTypeOf('function');
    expect(ChristmasPromo).toBeTypeOf('function');
    expect(ThanksgivingPromo).toBeTypeOf('function');
    expect(IndependencePromo).toBeTypeOf('function');
    expect(HalloweenPromo).toBeTypeOf('function');
    expect(ValentinesPromo).toBeTypeOf('function');
    expect(NewYearPromo).toBeTypeOf('function');
  });

  it('keeps the published Christmas defaults intact', () => {
    expect(CHRISTMAS_PROMO_CARDS).toHaveLength(3);
    expect(CHRISTMAS_PROMO_FEATURES).toHaveLength(6);
    expect(CHRISTMAS_PROMO_GROUND).toBe('rgb(14, 51, 30)');
    expect(CHRISTMAS_PROMO_BANNER.label).toContain('Christmas in July');
    expect(CHRISTMAS_PROMO_PIXEL_BAND).toBeTruthy();
  });

  it('ships Thanksgiving defaults alongside them', () => {
    expect(THANKSGIVING_PROMO_CARDS).toHaveLength(3);
    expect(THANKSGIVING_PROMO_FEATURES).toHaveLength(6);
    expect(THANKSGIVING_PROMO_GROUND).toContain('linear-gradient');
    expect(THANKSGIVING_PROMO_BANNER.label).toContain('NC30CARD');
    expect(THANKSGIVING_PROMO_PIXEL_BAND).toBeTruthy();
  });

  it('ships Independence Day defaults alongside them', () => {
    expect(INDEPENDENCE_PROMO_CARDS).toHaveLength(3);
    expect(INDEPENDENCE_PROMO_FEATURES).toHaveLength(6);
    expect(INDEPENDENCE_PROMO_GROUND).toBe('#132941');
    expect(INDEPENDENCE_PROMO_BANNER.label).toContain('NC30CARD');
    expect(INDEPENDENCE_PROMO_FLAG).toBeTruthy();
  });

  it('ships Halloween defaults alongside them', () => {
    expect(HALLOWEEN_PROMO_CARDS).toHaveLength(3);
    expect(HALLOWEEN_PROMO_FEATURES).toHaveLength(6);
    expect(HALLOWEEN_PROMO_GROUND).toBe('#070E17');
    expect(HALLOWEEN_PROMO_BANNER.label).toContain('NC30CARD');
    expect(HALLOWEEN_PROMO_DECORATIONS).toHaveLength(5);
  });

  it('ships Valentine\'s Day defaults alongside them', () => {
    expect(VALENTINES_PROMO_CARDS).toHaveLength(3);
    expect(VALENTINES_PROMO_FEATURES).toHaveLength(6);
    expect(VALENTINES_PROMO_GROUND).toBe('#810316');
    expect(VALENTINES_PROMO_BANNER.label).toContain('NC30CARD');
    expect(VALENTINES_PROMO_TOP_BAND).toBeTruthy();
  });

  it('ships New Year defaults alongside them', () => {
    expect(NEW_YEAR_PROMO_CARDS).toHaveLength(3);
    expect(NEW_YEAR_PROMO_FEATURES).toHaveLength(6);
    expect(NEW_YEAR_PROMO_GROUND).toBe('#0C255E');
    expect(NEW_YEAR_PROMO_BANNER.label).toContain('NC30CARD');
  });

  /* The six callouts are HeartStamp's product features, not a holiday's, so
     they are shared rather than restated — this is what stops them drifting. */
  it('shares one feature list across seasons', () => {
    expect(THANKSGIVING_PROMO_FEATURES).toEqual(CHRISTMAS_PROMO_FEATURES);
    expect(INDEPENDENCE_PROMO_FEATURES).toEqual(CHRISTMAS_PROMO_FEATURES);
    expect(HALLOWEEN_PROMO_FEATURES).toEqual(CHRISTMAS_PROMO_FEATURES);
    expect(VALENTINES_PROMO_FEATURES).toEqual(CHRISTMAS_PROMO_FEATURES);
    expect(NEW_YEAR_PROMO_FEATURES).toEqual(CHRISTMAS_PROMO_FEATURES);
  });

  it('renders the Christmas band with its own copy and ground', () => {
    const { container } = render(<ChristmasPromo />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Christmas in July');
    expect(screen.getByText(CHRISTMAS_PROMO_BANNER.label)).toBeInTheDocument();

    const root = container.querySelector('.hs-xpromo') as HTMLElement;
    expect(root.style.getPropertyValue('--xpromo-ground')).toBe(CHRISTMAS_PROMO_GROUND);
    expect(root.style.getPropertyValue('--xpromo-pixel-height')).toBe('63px');
  });

  it('renders the Thanksgiving band with its gradient and taller strip', () => {
    const { container } = render(<ThanksgivingPromo />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Thanksgiving is here!');
    expect(screen.getByText(THANKSGIVING_PROMO_BANNER.label)).toBeInTheDocument();

    const root = container.querySelector('.hs-xpromo') as HTMLElement;
    expect(root.style.getPropertyValue('--xpromo-ground')).toBe(THANKSGIVING_PROMO_GROUND);
    expect(root.style.getPropertyValue('--xpromo-pixel-height')).toBe('95px');
  });

  /* Independence Day is the first season to decorate with corner art rather
     than a strip: the flag draws behind the content, and the strip is off. */
  it('renders the Independence Day band with the flag and no strip', () => {
    const { container } = render(<IndependencePromo />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Celebrate Independence Day');

    const root = container.querySelector('.hs-xpromo') as HTMLElement;
    expect(root.style.getPropertyValue('--xpromo-ground')).toBe(INDEPENDENCE_PROMO_GROUND);
    expect(root.style.getPropertyValue('--xpromo-corner-width')).toBe('988px');
    expect(root.style.getPropertyValue('--xpromo-corner-height')).toBe('231px');

    expect(container.querySelectorAll('.hs-xpromo__corner')).toHaveLength(1);
    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(0);
  });

  /* Content is position:relative and comes after the art in DOM order, which
     is the whole reason the flag reads as a backdrop rather than an overlay. */
  it('paints corner art behind the content', () => {
    const { container } = render(<IndependencePromo />);
    const band = container.querySelector('.hs-xpromo__band') as HTMLElement;
    const kids = Array.from(band.children).map(el => el.className);

    expect(kids.indexOf('hs-xpromo__corner')).toBeLessThan(kids.indexOf('hs-xpromo__inner'));
    expect(kids.indexOf('hs-xpromo__corner')).toBeLessThan(kids.indexOf('hs-xpromo__features'));
  });

  /* 611px is Christmas's measure and it breaks this headline in two, which is
     why the season carries the handoff's wider 770px. */
  it('gives Independence Day a wider heading measure than the other seasons', () => {
    const headWidth = (ui: React.ReactElement) => {
      const { container } = render(ui);
      const root = container.querySelector('.hs-xpromo') as HTMLElement;
      return root.style.getPropertyValue('--xpromo-head-width');
    };

    expect(headWidth(<IndependencePromo />)).toBe('770px');
    /* The longest first line in the set gets the widest measure. */
    expect(headWidth(<ValentinesPromo />)).toBe(`${VALENTINES_PROMO_HEAD_WIDTH}px`);
    expect(headWidth(<ThanksgivingPromo />)).toBe(`${THANKSGIVING_PROMO_HEAD_WIDTH}px`);
    /* The others leave it unset, so the stylesheet's 611px fallback applies. */
    expect(headWidth(<ChristmasPromo />)).toBe('');
  });

  /* The header is centred and the flag is not, so as the band narrows the
     header slides towards art that has not moved. Clearing the flag's full
     height is what makes that independent of how wide the band is. */
  it('starts the Independence Day content below the flag', () => {
    const { container } = render(<IndependencePromo />);
    const band = container.querySelector('.hs-xpromo__band') as HTMLElement;
    const padTop = parseInt(band.style.getPropertyValue('--xpromo-band-padding'), 10);

    expect(padTop).toBeGreaterThan(INDEPENDENCE_PROMO_FLAG_HEIGHT);
  });

  /* Padding travels as a custom property, not an inline `padding`. Inline beats
     every stylesheet rule, so as a padding it defeated the container queries
     and kept desktop spacing all the way down to a phone. */
  it('leaves band padding overridable by the container queries', () => {
    const { container } = render(<ChristmasPromo />);
    const band = container.querySelector('.hs-xpromo__band') as HTMLElement;

    expect(band.style.getPropertyValue('--xpromo-band-padding')).toBe('140px 0 96px');
    expect(band.style.padding).toBe('');
  });

  it('marks a band that carries corner art, so it can clear it on small screens', () => {
    const { container: july } = render(<IndependencePromo />);
    expect(july.querySelector('.hs-xpromo')).toHaveClass('hs-xpromo--corner');

    const { container: xmas } = render(<ChristmasPromo />);
    expect(xmas.querySelector('.hs-xpromo')).not.toHaveClass('hs-xpromo--corner');
  });

  /* Halloween is the season the decorations slot was built for: a strip along
     the top and five loose pieces behind the content. */
  it('scatters Halloween art behind the content', () => {
    const { container } = render(<HalloweenPromo />);
    const band = container.querySelector('.hs-xpromo__band') as HTMLElement;

    expect(container.querySelectorAll('.hs-xpromo__deco')).toHaveLength(5);
    /* The strip is a separate slot and this season carries both. */
    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(1);

    const kids = Array.from(band.children).map(el => el.className);
    expect(kids.lastIndexOf('hs-xpromo__deco')).toBeLessThan(kids.indexOf('hs-xpromo__inner'));
  });

  /* Anything on the right hangs off `right`, so it stays in the margin as the
     band narrows rather than drifting in across the cards. */
  it('anchors right-hand pieces to the right edge', () => {
    const { container } = render(<HalloweenPromo />);
    const decos = Array.from(container.querySelectorAll('.hs-xpromo__deco')) as HTMLElement[];

    const anchored = decos.map(d => (d.style.right ? 'right' : 'left'));
    expect(anchored).toContain('right');
    expect(anchored).toContain('left');
    /* Never both on one piece — that would stretch it instead of placing it. */
    decos.forEach(d => expect(Boolean(d.style.left && d.style.right)).toBe(false));
  });

  /* The large bat sits in a gap that closes as the band narrows, so it tracks
     the centre instead of an edge. That is why offsets take CSS lengths. */
  it('places the large bat relative to the centre, not an edge', () => {
    const { container } = render(<HalloweenPromo />);
    const decos = Array.from(container.querySelectorAll('.hs-xpromo__deco')) as HTMLElement[];

    expect(decos.some(d => d.style.left.includes('calc'))).toBe(true);
  });

  it('drops the scattered art when decorations is false', () => {
    const { container } = render(<HalloweenPromo decorations={false} />);
    expect(container.querySelectorAll('.hs-xpromo__deco')).toHaveLength(0);
    /* The strip is a different slot and survives. */
    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(1);
  });

  it('gives Halloween its own strip offsets', () => {
    const { container } = render(<HalloweenPromo />);
    const root = container.querySelector('.hs-xpromo') as HTMLElement;

    expect(root.style.getPropertyValue('--xpromo-pixel-top')).toBe('0px');
    expect(root.style.getPropertyValue('--xpromo-pixel-inset')).toBe('3px');
    expect(root.style.getPropertyValue('--xpromo-pixel-height')).toBe('93px');
  });

  it("renders the Valentine's band with its own ground and strip", () => {
    const { container } = render(<ValentinesPromo />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Valentine’s Day is just around the corner!');

    const root = container.querySelector('.hs-xpromo') as HTMLElement;
    expect(root.style.getPropertyValue('--xpromo-ground')).toBe(VALENTINES_PROMO_GROUND);
    expect(root.style.getPropertyValue('--xpromo-pixel-height')).toBe('87px');
    expect(root.style.getPropertyValue('--xpromo-pixel-top')).toBe('0px');

    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(1);
    /* Decoration is the strip alone — no corner art, nothing scattered. */
    expect(container.querySelectorAll('.hs-xpromo__corner')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__deco')).toHaveLength(0);
  });

  /* The fireworks are a field the header sits inside, not a strip along the
     edge — deeper than the band's own top padding, and drawn behind it. */
  it('renders the New Year band with art deeper than its top padding', () => {
    const { container } = render(<NewYearPromo />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Celebrate the New Year in style!');

    const root = container.querySelector('.hs-xpromo') as HTMLElement;
    const band = container.querySelector('.hs-xpromo__band') as HTMLElement;

    expect(root.style.getPropertyValue('--xpromo-ground')).toBe(NEW_YEAR_PROMO_GROUND);
    expect(root.style.getPropertyValue('--xpromo-pixel-height')).toBe(`${NEW_YEAR_PROMO_TOP_BAND_HEIGHT}px`);

    const padTop = parseInt(band.style.getPropertyValue('--xpromo-band-padding'), 10);
    expect(NEW_YEAR_PROMO_TOP_BAND_HEIGHT).toBeGreaterThan(padTop);

    /* Behind the header, which is what lets the two overlap at all. */
    const kids = Array.from(band.children).map(el => el.className);
    expect(kids.indexOf('hs-xpromo__pixels')).toBeLessThan(kids.indexOf('hs-xpromo__inner'));
  });

  it('drops the flag when cornerArt is false', () => {
    const { container } = render(<IndependencePromo cornerArt={false} />);
    expect(container.querySelectorAll('.hs-xpromo__corner')).toHaveLength(0);
  });

  /* The seasons differ in dressing only, so any structural change to one is a
     change to the engine and therefore to all of them. */
  it('renders the same structure for both seasons', () => {
    const shape = (el: Element) => ({
      cards: el.querySelectorAll('.hs-xpromo__card').length,
      features: el.querySelectorAll('.hs-xpromo__feature').length,
      pixels: el.querySelectorAll('.hs-xpromo__pixels').length,
      bar: el.querySelectorAll('.hs-xpromo__cta').length,
    });

    const christmas = shape(render(<ChristmasPromo />).container);
    const thanksgiving = shape(render(<ThanksgivingPromo />).container);
    const independence = shape(render(<IndependencePromo />).container);
    const halloween = shape(render(<HalloweenPromo />).container);
    const valentines = shape(render(<ValentinesPromo />).container);
    const newYear = shape(render(<NewYearPromo />).container);

    expect(christmas).toEqual({ cards: 3, features: 6, pixels: 1, bar: 1 });
    expect(thanksgiving).toEqual(christmas);
    /* Same everywhere but the decoration, which is this season's whole point. */
    expect(independence).toEqual({ ...christmas, pixels: 0 });
    expect(halloween).toEqual(christmas);
    expect(valentines).toEqual(christmas);
    expect(newYear).toEqual(christmas);
  });

  /* Every section is droppable, which is what lets one band cover a campaign
     that has no cards, or no offer bar. */
  it('drops any section passed false', () => {
    const { container } = render(
      <ChristmasPromo cards={false} features={false} banner={false} pixelBand={false} />,
    );
    expect(container.querySelectorAll('.hs-xpromo__card')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__feature')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__cta')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(0);
    /* The header survives, so the band is still a band. */
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
  });

  /* `heading={false}` has to be distinguishable from "not passed", which a
     default parameter cannot do on its own. */
  it('removes the heading only when explicitly false', () => {
    const { container } = render(<ChristmasPromo heading={false} eyebrow={false} />);
    expect(container.querySelectorAll('.hs-xpromo__head')).toHaveLength(0);
  });

  it('renders the offer bar as a link when given an href, a button otherwise', () => {
    const { container: withHref } = render(
      <ChristmasPromo banner={{ label: 'Shop the offer', href: '/offers' }} />,
    );
    expect(withHref.querySelector('a.hs-xpromo__cta')).toHaveAttribute('href', '/offers');

    const { container: withoutHref } = render(
      <ThanksgivingPromo banner={{ label: 'Shop the offer' }} />,
    );
    expect(withoutHref.querySelector('button.hs-xpromo__cta')).toBeInTheDocument();
  });

  /* safeHref is what keeps a CMS-supplied href from becoming a script sink. */
  it('neutralises an executable href on a card or the offer bar', () => {
    const { container } = render(
      <ChristmasPromo
        cards={[{ src: '/a.webp', title: 'A', desc: 'B', cta: 'Go', href: 'javascript:alert(1)' }]}
        banner={{ label: 'Offer', href: 'javascript:alert(2)' }}
      />,
    );
    expect(container.querySelector('.hs-xpromo__link')).toHaveAttribute('href', '#');
    expect(container.querySelector('a.hs-xpromo__cta')).toHaveAttribute('href', '#');
  });

  /* The engine ships no season: rendered bare it draws a band and nothing in it. */
  it('renders PromoBand with no content of its own', () => {
    const { container } = render(<PromoBand />);
    expect(container.querySelector('.hs-xpromo__band')).toBeInTheDocument();
    expect(container.querySelectorAll('.hs-xpromo__card')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__feature')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__pixels')).toHaveLength(0);
    expect(container.querySelectorAll('.hs-xpromo__cta')).toHaveLength(0);
  });
});
