import React, { useState } from "react";

/* HeartStamp — Switch primitive */
export function Swt({
  checked,
  onChange,
  label,
  disabled = false,
  size = "sm",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: "sm" | "lg";
}) {
  const trackW  = size === "lg" ? 58 : 40;
  const trackH  = size === "lg" ? 32 : 24;
  const thumbSz = size === "lg" ? 28 : 20;
  const pad     = 2;
  const thumbOn = trackW - thumbSz - pad;

  const trackBg = disabled
    ? checked ? "rgba(190,29,44,0.30)" : "rgba(36,36,35,0.06)"
    : checked  ? "var(--accent)"       : "rgba(36,36,35,0.10)";

  const thumbBg = disabled
    ? checked ? "rgba(255,255,255,0.65)" : "rgba(36,36,35,0.18)"
    : "#ffffff";

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)", cursor: disabled ? "not-allowed" : "pointer" }}
      onClick={() => !disabled && onChange(!checked)}
    >
      <div
        style={{
          position: "relative",
          width: trackW,
          height: trackH,
          borderRadius: "var(--radius-full)",
          background: trackBg,
          transition: "background .2s",
          flexShrink: 0,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: pad,
            left: checked ? thumbOn : pad,
            width: thumbSz,
            height: thumbSz,
            borderRadius: "var(--radius-full)",
            background: thumbBg,
            transition: "left .2s",
            boxShadow: "var(--shadow-sm)",
          }}
        />
      </div>
      {label && (
        <span style={{ fontSize: 13, color: disabled ? "var(--muted-fg)" : "var(--fg)" }}>
          {label}
        </span>
      )}
    </div>
  );
}
