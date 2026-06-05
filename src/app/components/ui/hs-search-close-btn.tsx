import type { ReactNode } from "react";
import { Btn } from "./btn";

/* ─────────────────────────────────────────────────────────────
   SearchCloseBtn — "Close" affordance that dismisses a search view
   ·  Built on Btn (plain variant): transparent at rest, neutral grey
      hover/press fill, no border — chrome owned by the design system.
   ·  Uses the compact `sm` size so the hover/press ellipse stays
      tight, with the body-13 font (slightly larger than the default
      sm font) to match the search "Close" in the DS nav.
   ·  Consumers render <SearchCloseBtn onClick=...>Close</SearchCloseBtn>
      with no styling of their own. `className` is for context only
      (e.g. white text over a scrolled brand bar).
───────────────────────────────────────────────────────────── */
export function SearchCloseBtn({
  onClick,
  className,
  children,
}: {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Btn
      variant="plain"
      size="sm"
      className={className}
      onClick={onClick}
      // paddingTop nudges the label 1px down so its baseline lines up
      // with the adjacent search input / nav items.
      style={{ fontSize: "var(--font-size-body-13)", paddingTop: "1px" }}
    >
      {children}
    </Btn>
  );
}
