import * as React from "react";

/* ═══════════════════════════════════════════════════════════════════════════
   REVEAL CASCADE — the marketing site's scroll-in motion, as a hook.

   On hs-website this lives in the page's behaviour class, which scans for
   `data-reveal` / `data-reveal-stagger` hooks and animates what it finds. The
   sections themselves only carry the attributes, so nothing travels with a
   component that is lifted out of that page. This is that machinery, scoped to
   one subtree, with the site's own constants.

   Mark up a block and pass its root:

     <div ref={rootRef}>
       <div data-reveal-stagger>…</div>   each child rises, 130ms apart
       <hr data-reveal />                 the element itself rises
     </div>

     useRevealCascade(rootRef, reveal, [deps that change the content]);
   ═══════════════════════════════════════════════════════════════════════════ */

const RV = { DUR: 950, DIST: 56, STEP: 130, EASE: "cubic-bezier(0.22, 1, 0.36, 1)" };

export function useRevealCascade(
  rootRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean,
  /* Constant length, so React never sees the deps array change shape. */
  deps: React.DependencyList,
) {
  React.useEffect(() => {
    const root = rootRef.current;
    if (!root || !enabled) return;
    if (typeof IntersectionObserver === "undefined") return;
    /* Bail before anything is hidden, so reduced-motion gets the finished
       layout rather than a block that never fades in. */
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const timers: number[] = [];
    const touched: HTMLElement[] = [];
    const vh = () => window.innerHeight || 800;
    const inView = (el: Element) => {
      const r = el.getBoundingClientRect();
      return r.top < vh() && r.bottom > 0;
    };

    const show = (el: HTMLElement) => {
      el.style.opacity = "1";
      el.style.transform = "none";
      /* Drop the transition once it has played, or it leaks into the link
         hover animation further down the card. */
      timers.push(window.setTimeout(() => {
        el.style.willChange = "auto";
        el.style.transition = "";
        el.style.transform = "";
      }, RV.DUR + 500));
    };

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const el = e.target as HTMLElement;
          io.unobserve(el);
          if (el.dataset.rvSolo !== undefined) show(el);
          else for (const c of Array.from(el.children)) show(c as HTMLElement);
        }
      },
      { threshold: [0, 0.1], rootMargin: "0px 0px -12% 0px" },
    );

    const rafs: number[] = [];
    const pending: HTMLElement[] = [];
    /* Element → the transition it should carry once it is safely hidden. */
    const armed: Array<[HTMLElement, string]> = [];

    for (const host of Array.from(root.querySelectorAll<HTMLElement>("[data-reveal-stagger]"))) {
      const kids = Array.from(host.children) as HTMLElement[];
      /* Stacked into one tall column, observing the host would fire every card
         the instant its top edge appeared, so the whole run would be over
         before you scrolled to it. Taller than the viewport → each child waits
         for itself, and the stagger gives way to one uniform rise. */
      const tall = host.getBoundingClientRect().height > vh() * 0.85;

      kids.forEach((c, i) => {
        touched.push(c);
        /* Hide with transitions OFF. Setting the hidden state and the
           transition together makes the hiding itself a 950ms fade OUT, and
           then the reveal only reverses a fade that has barely started — the
           element never visibly leaves full opacity. */
        c.style.transition = "none";
        c.style.opacity = "0";
        c.style.transform = `translateY(${tall ? RV.DIST : RV.DIST + Math.min(i, 9) * 8}px)`;
        c.style.willChange = "opacity, transform";
        armed.push([c, tall
          ? `opacity ${RV.DUR}ms ${RV.EASE}, transform ${RV.DUR}ms ${RV.EASE}`
          : `opacity ${RV.DUR}ms ${RV.EASE} ${i * RV.STEP}ms, transform ${RV.DUR}ms ${RV.EASE} ${i * RV.STEP}ms`]);
      });

      if (tall) {
        for (const c of kids) {
          if (inView(c)) pending.push(c);
          else { c.dataset.rvSolo = ""; io.observe(c); }
        }
      } else if (inView(host)) {
        pending.push(...kids);
      } else {
        io.observe(host);
      }
    }

    /* Single elements, not groups: same rise, no stagger. The FAQ's rules and
       group labels come in this way on the marketing site. */
    for (const el of Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"))) {
      touched.push(el);
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = `translateY(${RV.DIST}px)`;
      el.style.willChange = "opacity, transform";
      armed.push([el, `opacity ${RV.DUR}ms ${RV.EASE}, transform ${RV.DUR}ms ${RV.EASE}`]);
      if (inView(el)) pending.push(el);
      else { el.dataset.rvSolo = ""; io.observe(el); }
    }

    /* Commit the hidden state as its own style recalculation before any
       transition exists. Reading a layout property is what forces that; two
       animation frames are not enough on their own, because rAF callbacks run
       before paint and the browser is free to collapse the writes on either
       side into one change with nothing to transition between. */
    void root.offsetHeight;
    for (const [el, transition] of armed) el.style.transition = transition;

    /* Now the elements are hidden AND armed, so raising them animates. */
    if (pending.length) {
      rafs.push(requestAnimationFrame(() => pending.forEach(el => show(el))));
    }

    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
      rafs.forEach(cancelAnimationFrame);
      /* Unmounting mid-cascade must not leave anything stuck invisible. */
      for (const el of touched) {
        el.style.opacity = "";
        el.style.transform = "";
        el.style.transition = "";
        el.style.willChange = "";
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rootRef, enabled, ...deps]);
}
