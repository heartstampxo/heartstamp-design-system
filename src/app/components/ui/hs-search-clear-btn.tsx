import { X } from "lucide-react";
import { Btn } from "./btn";

/* ─────────────────────────────────────────────────────────────
   SearchClearBtn — clear ("X") affordance for search fields
   ·  Built on Btn (plain variant): transparent fill, neutral grey
      hover/press, no border — chrome owned by the design system.
   ·  Clear-specific bits encapsulated here so consumers render
      <SearchClearBtn onClick=.../> with no styling of their own:
        – muted colour (--color-text-secondary)
        – 12px glyph, tight box so it sits flush at the field edge
        – pointer-events:auto for use inside Inp adornment slots
   ·  Lives in its own module (not inside the heavy WebsiteNav file)
      so bundlers resolve the named export cleanly.
───────────────────────────────────────────────────────────── */
export function SearchClearBtn({ onClick }: { onClick: () => void }) {
  return (
    <Btn
      variant="plain"
      size="icon-sm"
      // no-feedback: the clear X shows only its glyph — no hover/press fill
      className="hs-btn--no-feedback"
      onClick={onClick}
      aria-label="Clear search"
      style={{
        color: "var(--color-text-secondary)",
        width: "auto",
        height: "auto",
        padding: 0,
        pointerEvents: "auto",
      }}
    >
      <X size={12} />
    </Btn>
  );
}
