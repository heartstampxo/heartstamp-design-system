import React from "react";
import { SUBTLE_BORDER } from "./hs-popover-kit";

/* ═══════════════════════════════════════════════════════
   HeartStamp — Popover Notch

   The little triangle that ties a floating panel back to the control
   that opened it. Shared by every popover panel in the system.

   A square rotated 45° about its centre, sitting half outside the
   panel so only a triangle shows. Its two leading borders continue the
   panel outline and its fill masks the 1px panel border underneath.

   Requires `position: relative` on the panel it sits in.

   Note: Figma exports this shape as a 24×8 box rotated about its
   top-left corner, which renders as a diagonal sliver rather than a
   notch. The exporter flattens the geometry, so it is rebuilt here.
═══════════════════════════════════════════════════════ */

/** Rotated, the square reads as a ~17px wide / 8.5px tall triangle. */
export const POPOVER_NOTCH_SIZE = 12;

const notchStyle: React.CSSProperties = {
  position: "absolute",
  width: POPOVER_NOTCH_SIZE,
  height: POPOVER_NOTCH_SIZE,
  top: -POPOVER_NOTCH_SIZE / 2,
  transform: "rotate(45deg)",
  background: "var(--color-bg-main, #ffffff)",
  borderTopLeftRadius: 3,
  borderLeft: SUBTLE_BORDER,
  borderTop: SUBTLE_BORDER,
};

export interface PopoverNotchProps {
  /**
   * Distance in px from the panel's left edge to the notch *centre*.
   * Omit to centre the notch on the panel.
   *
   * Measuring to the centre means a panel that has been clamped back inside
   * the viewport can still point its notch at the original trigger.
   */
  offset?: number;
}

export function PopoverNotch({ offset }: PopoverNotchProps) {
  return (
    <span
      aria-hidden="true"
      style={
        offset !== undefined
          ? { ...notchStyle, left: offset - POPOVER_NOTCH_SIZE / 2 }
          : { ...notchStyle, left: "50%", marginLeft: -POPOVER_NOTCH_SIZE / 2 }
      }
    />
  );
}
