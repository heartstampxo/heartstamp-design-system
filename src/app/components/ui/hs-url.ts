/* ═══════════════════════════════════════════════════════════════════════════
   URL GUARDS

   Blocks take URLs from whoever renders them — a card's href, a footer link,
   an icon. Once those come from a CMS, a search result or a user profile,
   two sinks matter, and React guards neither:

   · href="javascript:…" runs on click. React logs a development warning and
     still renders the attribute. This is the one that is genuinely
     exploitable.
   · url(…) inside a style can be closed early with a quote and a paren,
     letting the rest of the value add declarations of its own. Not script
     execution — CSS cannot do that — but enough to move, hide or overlay
     things on the page.

   Both checks are cheap and neither alters a well-formed value, so they are
   applied at every such site rather than left to each caller to remember.
   ═══════════════════════════════════════════════════════════════════════════ */

/** Schemes that execute or embed rather than navigate. */
const EXECUTABLE = /^(javascript|vbscript|data|blob|file):/i;

/**
 * Browsers strip TAB, CR, LF and NUL from a URL before reading its scheme, so
 * `java\tscript:alert(1)` navigates as `javascript:`. Strip them the same way
 * before testing, or the test is trivially bypassed.
 */
function scheme(url: string): string {
  return url.replace(/[\x00-\x1F\x7F]/g, "").trim();
}

/**
 * A URL safe to place in `href`. Anything with an executable scheme becomes
 * the fallback, so a bad value is inert rather than one click from running.
 *
 * Relative paths, fragments, query strings, `mailto:` and `tel:` pass through
 * untouched — the check is on the scheme, not the shape.
 */
export function safeHref(href: string | undefined, fallback = "#"): string {
  if (!href) return fallback;
  return EXECUTABLE.test(scheme(href)) ? fallback : href;
}

/**
 * A URL safe to interpolate into a CSS `url("…")`. Every caller wraps the
 * value in double quotes, so the only characters that can end the string early
 * are a double quote, a backslash (CSS's escape character) and a newline. A
 * URL carrying any of those is refused rather than escaped — one that needs
 * them is far likelier to be an attack than a real asset path.
 *
 * Single quotes and parentheses are deliberately allowed: they are legal
 * inside a double-quoted URL token, and refusing them broke every bundled
 * asset, because Vite inlines SVG as a data URI full of both.
 *
 * Returns null when refused, so the caller can omit the declaration instead of
 * emitting a broken one.
 */
export function cssUrl(url: string | undefined): string | null {
  if (!url) return null;
  if (/["\\\n\r]/.test(url)) return null;
  const s = scheme(url);
  /* data:image is the one embedding scheme worth allowing — inline SVG and
     PNG icons are a normal way to pass an icon to a block. */
  if (EXECUTABLE.test(s) && !/^data:image\//i.test(s)) return null;
  return url;
}

/**
 * `{ backgroundImage }` for a caller-supplied URL, or undefined when the URL
 * is refused. Spread into a style object:
 *
 *   <i style={{ ...backgroundImage(icon), maskSize: "cover" }} />
 */
export function backgroundImage(url: string | undefined): { backgroundImage: string } | undefined {
  const safe = cssUrl(url);
  return safe ? { backgroundImage: `url("${safe}")` } : undefined;
}

/**
 * `{ maskImage, WebkitMaskImage }` for a caller-supplied URL, or undefined when
 * refused. Masked icons need both properties; Safari still wants the prefix.
 */
export function maskImage(
  url: string | undefined,
): { maskImage: string; WebkitMaskImage: string } | undefined {
  const safe = cssUrl(url);
  if (!safe) return undefined;
  const value = `url("${safe}")`;
  return { maskImage: value, WebkitMaskImage: value };
}
