// ─────────────────────────────────────────────────────────────
// hs-style-inject — shared CSS-in-JS injection for components
// that carry their own stylesheet (Notification, WebsiteNavV2).
//
// - cssMin strips comments and collapses whitespace at module
//   load, so the readable source ships compact.
// - useInjectedStyle mounts one ref-counted <style> per id in
//   document.head, no matter how many component instances render.
//   useInsertionEffect runs before layout/paint, so there is no
//   unstyled flash and animations behave exactly as inline
//   <style> tags did.
// ─────────────────────────────────────────────────────────────

import { useInsertionEffect } from "react";

/** Strip comments and collapse whitespace. Safe for our sheets: they
    contain no CSS strings whose inner whitespace matters. */
export function cssMin(css: string): string {
  return css
    .replace(/\/\*[^]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .replace(/ ?([{};:,>]) ?/g, "$1")
    .trim();
}

const registry = new Map<string, { el: HTMLStyleElement; refs: number }>();

export function useInjectedStyle(id: string, css: string): void {
  useInsertionEffect(() => {
    let entry = registry.get(id);
    if (!entry) {
      const el = document.createElement("style");
      el.setAttribute("data-hs-style", id);
      el.textContent = css;
      document.head.appendChild(el);
      entry = { el, refs: 0 };
      registry.set(id, entry);
    }
    entry.refs += 1;
    return () => {
      const e = registry.get(id);
      if (!e) return;
      e.refs -= 1;
      if (e.refs <= 0) {
        e.el.remove();
        registry.delete(id);
      }
    };
  }, [id, css]);
}
