import React, { useState, useRef, useEffect } from "react";
import { Inp } from "./hs-inp";
import { Sep } from "./hs-sep";

/* ─── Color utilities ──────────────────────────────────────── */

export function hexToHsv(hex: string): [number, number, number] {
  const c = hex.replace(/^#/, "");
  if (c.length !== 6) return [0, 0, 100];
  const r = parseInt(c.slice(0, 2), 16) / 255;
  const g = parseInt(c.slice(2, 4), 16) / 255;
  const b = parseInt(c.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) {
    if (max === r)      h = ((g - b) / d + 6) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else                h = (r - g) / d + 4;
    h = Math.round(h * 60);
  }
  return [h, max ? Math.round(d / max * 100) : 0, Math.round(max * 100)];
}

export function hsvToHex(h: number, s: number, v: number): string {
  s /= 100; v /= 100;
  const f = (n: number) => {
    const k = (n + h / 60) % 6;
    return v - v * s * Math.max(0, Math.min(k, 4 - k, 1));
  };
  const toH = (x: number) => Math.round(x * 255).toString(16).padStart(2, "0");
  return `#${toH(f(5))}${toH(f(3))}${toH(f(1))}`;
}

/* ─── ColorPicker ─────────────────────────────────────────── */

export interface ColorPickerProps {
  color: string;
  onChange: (hex: string) => void;
  recentColors?: string[];
  anchorRect?: DOMRect | null;
  onClose?: () => void;
}

export function ColorPicker({
  color,
  onChange,
  recentColors = [],
  anchorRect,
  onClose,
}: ColorPickerProps) {
  const [hue, setHue] = useState(() => hexToHsv(color)[0]);
  const [sat, setSat] = useState(() => hexToHsv(color)[1]);
  const [val, setVal] = useState(() => hexToHsv(color)[2]);
  const [hexInput, setHexInput] = useState(color.toUpperCase());

  const pickerRef    = useRef<HTMLDivElement>(null);
  const svRef        = useRef<HTMLDivElement>(null);
  const hueRef       = useRef<HTMLDivElement>(null);
  const satRef       = useRef<HTMLDivElement>(null);
  // Tracks whether the last color change originated from inside this component.
  // Used to skip syncing internal state when the parent echoes back our own onChange.
  const internalRef  = useRef(false);

  const currentHex = hsvToHex(hue, sat, val);

  // Sync when color prop changes from outside (e.g. preset swatch selected by parent)
  useEffect(() => {
    if (internalRef.current) {
      internalRef.current = false;
      return;
    }
    const [h, s, v] = hexToHsv(color);
    setHue(h); setSat(s); setVal(v);
    setHexInput(color.toUpperCase());
  }, [color]);

  // Close on outside click
  useEffect(() => {
    if (!onClose) return;
    function handle(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) onClose?.();
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [onClose]);

  function emit(hex: string) {
    internalRef.current = true;
    onChange(hex);
  }

  function makeDragger(onMove: (ev: MouseEvent) => void) {
    return (e: React.MouseEvent) => {
      e.preventDefault();
      const up = () => {
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", up);
      };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", up);
      onMove(e.nativeEvent);
    };
  }

  const dragSv = makeDragger((ev) => {
    if (!svRef.current) return;
    const rect = svRef.current.getBoundingClientRect();
    const s2 = Math.round(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)) * 100);
    const v2 = Math.round(Math.max(0, Math.min(1, 1 - (ev.clientY - rect.top) / rect.height)) * 100);
    setSat(s2); setVal(v2);
    const hex = hsvToHex(hue, s2, v2);
    setHexInput(hex.toUpperCase());
    emit(hex);
  });

  const dragHue = makeDragger((ev) => {
    if (!hueRef.current) return;
    const rect = hueRef.current.getBoundingClientRect();
    const h2 = Math.round(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)) * 360);
    setHue(h2);
    const hex = hsvToHex(h2, sat, val);
    setHexInput(hex.toUpperCase());
    emit(hex);
  });

  const dragSat = makeDragger((ev) => {
    if (!satRef.current) return;
    const rect = satRef.current.getBoundingClientRect();
    const s2 = Math.round(Math.max(0, Math.min(1, (ev.clientX - rect.left) / rect.width)) * 100);
    setSat(s2);
    const hex = hsvToHex(hue, s2, val);
    setHexInput(hex.toUpperCase());
    emit(hex);
  });

  function handleHexChange(v: string) {
    setHexInput(v);
    const clean = v.startsWith("#") ? v : `#${v}`;
    if (/^#[0-9a-fA-F]{6}$/.test(clean)) {
      const [h, s, bv] = hexToHsv(clean);
      setHue(h); setSat(s); setVal(bv);
      emit(clean);
    }
  }

  function pickRecent(c: string) {
    const [h, s, v] = hexToHsv(c);
    setHue(h); setSat(s); setVal(v);
    setHexInput(c.toUpperCase());
    emit(c);
  }

  // Position fixed below anchor, right-aligned to avoid viewport overflow
  const posStyle: React.CSSProperties = anchorRect
    ? {
        position: "fixed",
        top: anchorRect.bottom + 8,
        left: Math.min(anchorRect.right - 280, window.innerWidth - 296),
        zIndex: 9999,
      }
    : { position: "relative" };

  return (
    <div
      ref={pickerRef}
      style={{
        ...posStyle,
        width: 280,
        background: "var(--bg)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg, 0 12px 24px rgba(5,32,81,.12), 0 4px 8px rgba(5,32,81,.06))",
        padding: "var(--space-4)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      {/* SV gradient canvas */}
      <div
        ref={svRef}
        onMouseDown={dragSv}
        style={{
          height: 180,
          borderRadius: "var(--radius-md)",
          position: "relative",
          cursor: "crosshair",
          overflow: "hidden",
          flexShrink: 0,
          userSelect: "none",
        }}
      >
        <div style={{ position: "absolute", inset: 0, background: `hsl(${hue}, 100%, 50%)` }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, #fff, transparent)" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, transparent, #000)" }} />
        {/* Handle */}
        <div style={{
          position: "absolute",
          left: `${sat}%`,
          top: `${100 - val}%`,
          transform: "translate(-50%, -50%)",
          width: 14, height: 14,
          borderRadius: "50%",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,.25), 0 2px 6px rgba(0,0,0,.2)",
          background: currentHex,
          pointerEvents: "none",
        }} />
      </div>

      {/* Hue slider */}
      <div
        ref={hueRef}
        onMouseDown={dragHue}
        style={{
          height: 12,
          borderRadius: "var(--radius-full)",
          position: "relative",
          cursor: "pointer",
          flexShrink: 0,
          userSelect: "none",
          background: "linear-gradient(to right, #f00, #ff0, #0f0, #0ff, #00f, #f0f, #f00)",
        }}
      >
        <div style={{
          position: "absolute",
          left: `${hue / 360 * 100}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 16, height: 16,
          borderRadius: "50%",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,.2), 0 2px 4px rgba(0,0,0,.2)",
          background: `hsl(${hue}, 100%, 50%)`,
          pointerEvents: "none",
        }} />
      </div>

      {/* Saturation slider */}
      <div
        ref={satRef}
        onMouseDown={dragSat}
        style={{
          height: 12,
          borderRadius: "var(--radius-full)",
          position: "relative",
          cursor: "pointer",
          flexShrink: 0,
          userSelect: "none",
          background: `linear-gradient(to right, ${hsvToHex(hue, 0, val)}, ${hsvToHex(hue, 100, val)})`,
        }}
      >
        <div style={{
          position: "absolute",
          left: `${sat}%`,
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: 16, height: 16,
          borderRadius: "50%",
          border: "2px solid #fff",
          boxShadow: "0 0 0 1px rgba(0,0,0,.2), 0 2px 4px rgba(0,0,0,.2)",
          background: currentHex,
          pointerEvents: "none",
        }} />
      </div>

      {/* Hex input row */}
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "center" }}>
        <div style={{
          padding: "var(--space-2) var(--space-3)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: "var(--font-size-body-13)",
          fontWeight: 500,
          color: "var(--fg)",
          background: "var(--bg-input)",
          flexShrink: 0,
          userSelect: "none",
          whiteSpace: "nowrap",
        }}>
          Hex
        </div>
        <Inp
          value={hexInput}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleHexChange(e.target.value)}
          style={{ fontFamily: "monospace", fontSize: "var(--font-size-body-13)", flex: 1 }}
        />
        <div style={{
          width: 28, height: 28,
          borderRadius: "var(--radius-sm)",
          background: currentHex,
          border: "1px solid var(--border)",
          flexShrink: 0,
        }} />
      </div>

      {/* Recently used colors */}
      {recentColors.length > 0 && (
        <>
          <Sep />
          <div>
            <p style={{
              fontSize: "var(--font-size-body-13)",
              fontWeight: 600,
              color: "var(--muted-fg)",
              margin: "0 0 var(--space-3)",
            }}>
              Recently used colors
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "var(--space-2)" }}>
              {recentColors.map((c, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => pickRecent(c)}
                  title={c}
                  style={{
                    width: 24, height: 24,
                    borderRadius: "var(--radius-sm)",
                    background: c,
                    border: c.toLowerCase() === currentHex.toLowerCase()
                      ? "2px solid var(--fg)"
                      : "1px solid var(--border)",
                    cursor: "pointer",
                    flexShrink: 0,
                    padding: 0,
                  }}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
