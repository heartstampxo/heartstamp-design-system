import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Info, UserRoundPlus, PenLine, Gift, Mail, Eye } from "lucide-react";
import { Btn } from "./btn";

/* ─────────────────────────────────────────────────────────────
   Stepper — HeartStamp multi-step progress indicator
   ─ mobile variant  : icon-circle (32 px) indicators + hairlines
   ─ desktop variant : labelled pill buttons + hairlines
   ─ HorizontalSwapStepper : mobile-first swipeable layout
     (icon-circle stepper ＋ sliding content panels ＋ prev/next)
───────────────────────────────────────────────────────────── */

/* ── Types ────────────────────────────────────────────────── */
export type StepDef = { id: string; label: string; icon: string };

/* ── Icon map ─────────────────────────────────────────────── */
const STEP_ICONS: Record<string, React.FC<{ size?: number }>> = {
  recipients: UserRoundPlus,
  message:    PenLine,
  gifts:      Gift,
  envelope:   Mail,
  review:     Eye,
};

/* ── Stepper component ────────────────────────────────────── */
export interface StepperProps {
  steps: StepDef[];
  activeStep: number;
  onStepChange: (index: number) => void;
  variant?: "mobile" | "desktop";
}

export function Stepper({ steps, activeStep, onStepChange, variant = "mobile" }: StepperProps) {
  /* mobile: icon-circle indicators connected by hairlines */
  if (variant === "mobile") {
    return (
      <div style={{ display: "flex", alignItems: "flex-start", width: "100%" }}>
        {steps.map((step, i) => {
          const isActive = i === activeStep;
          return (
            <div
              key={step.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "var(--space-2)", flex: 1 }}
            >
              {/* Connector + indicator row */}
              <div style={{ display: "flex", alignItems: "center", width: "100%", height: 32 }}>
                {/* Left hairline */}
                <div style={{ flex: 1, height: 1.5, background: i === 0 ? "transparent" : "var(--border)" }} />
                {/* Circle indicator */}
                <Btn
                  variant={isActive ? "default" : "outline"}
                  size="icon"
                  onClick={() => onStepChange(i)}
                  style={{ width: 32, height: 32, borderRadius: "var(--radius-full)", padding: 0, flexShrink: 0 }}
                >
                  {React.createElement(STEP_ICONS[step.icon] ?? Eye, { size: 16 })}
                </Btn>
                {/* Right hairline */}
                <div style={{ flex: 1, height: 1.5, background: i === steps.length - 1 ? "transparent" : "var(--border)" }} />
              </div>
              {/* Label */}
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? "var(--fg)" : "var(--text-disabled)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  /* desktop: labelled pill buttons connected by hairlines */
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 0 }}>
      {steps.map((step, i) => {
        const isActive = i === activeStep;
        return (
          <div key={step.id} style={{ display: "flex", alignItems: "center" }}>
            {i > 0 && (
              <div style={{ width: "var(--space-5)", height: 1.5, background: "var(--border)", flexShrink: 0 }} />
            )}
            <Btn
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => onStepChange(i)}
              style={{ gap: "var(--space-2)" }}
            >
              {React.createElement(STEP_ICONS[step.icon] ?? Eye, { size: 16 })}
              {step.label}
            </Btn>
          </div>
        );
      })}
    </div>
  );
}

/* ── HorizontalSwapStepper ────────────────────────────────── */
const STEP_PANELS = [
  { emoji: "👥", title: "Add Recipients",  desc: "Choose who receives this gift campaign.",           hint: "Tap a contact or search by name" },
  { emoji: "✉️", title: "Write Message",   desc: "Personalise your message for each recipient.",      hint: "Use placeholders like {name} for dynamic text" },
  { emoji: "🎁", title: "Pick Gifts",      desc: "Select from the curated gift catalogue.",           hint: "Choose up to 3 gifts per recipient" },
  { emoji: "📬", title: "Send Envelope",   desc: "Preview the digital envelope before dispatch.",     hint: "Envelopes are delivered via email & push" },
  { emoji: "🔍", title: "Review & Send",   desc: "Confirm all details before launching the campaign.", hint: "Scheduled sends are supported" },
];

export interface HorizontalSwapStepperProps {
  steps: StepDef[];
  activeStep: number;
  onStepChange: (index: number) => void;
}

export function HorizontalSwapStepper({ steps, activeStep, onStepChange }: HorizontalSwapStepperProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const startX   = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => { startX.current = e.touches[0].clientX; };
  const handleTouchEnd   = (e: React.TouchEvent) => {
    if (startX.current === null) return;
    const dx = e.changedTouches[0].clientX - startX.current;
    if (Math.abs(dx) > 40) {
      if (dx < 0 && activeStep < steps.length - 1) onStepChange(activeStep + 1);
      if (dx > 0 && activeStep > 0)                onStepChange(activeStep - 1);
    }
    startX.current = null;
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 390,
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-4)",
      }}
    >
      {/* Mobile icon-circle stepper */}
      <Stepper steps={steps} activeStep={activeStep} onStepChange={onStepChange} variant="mobile" />

      {/* Swipeable content panels */}
      <div
        ref={trackRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          overflow: "hidden",
          borderRadius: 14,
          border: "1px solid var(--border)",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            display: "flex",
            transform: `translateX(-${activeStep * 100}%)`,
            transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1)",
            willChange: "transform",
          }}
        >
          {steps.map((step, i) => {
            const panel = STEP_PANELS[i];
            return (
              <div
                key={step.id}
                style={{
                  minWidth: "100%",
                  padding: "var(--space-6) var(--space-4)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "var(--space-3)",
                  textAlign: "center",
                }}
              >
                <span style={{ fontSize: 36, lineHeight: 1 }}>{panel.emoji}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
                  <span style={{ fontSize: 15, fontWeight: 700, color: "var(--fg)" }}>{panel.title}</span>
                  <span style={{ fontSize: 13, color: "var(--muted-fg)", lineHeight: 1.55, maxWidth: 260 }}>
                    {panel.desc}
                  </span>
                </div>
                {/* Hint pill */}
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "var(--space-1)",
                    background: "var(--muted)",
                    borderRadius: "var(--radius-full)",
                    padding: "var(--space-1) var(--space-3)",
                    fontSize: 11,
                    color: "var(--muted-fg)",
                  }}
                >
                  <Info size={14} style={{ flexShrink: 0 }} />
                  {panel.hint}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-2)",
        }}
      >
        <Btn
          variant="outline"
          size="sm"
          onClick={() => onStepChange(Math.max(0, activeStep - 1))}
          style={{
            opacity: activeStep === 0 ? 0.35 : 1,
            pointerEvents: activeStep === 0 ? "none" : "auto",
          }}
        >
          <ChevronLeft size={16} style={{ marginRight: 4 }} />
          Back
        </Btn>

        <span style={{ fontSize: 12, color: "var(--muted-fg)" }}>
          {activeStep + 1} / {steps.length}
        </span>

        <Btn
          variant="default"
          size="sm"
          onClick={() => onStepChange(Math.min(steps.length - 1, activeStep + 1))}
          style={{
            opacity: activeStep === steps.length - 1 ? 0.35 : 1,
            pointerEvents: activeStep === steps.length - 1 ? "none" : "auto",
          }}
        >
          {activeStep === steps.length - 1 ? "Finish" : "Next"}
          {activeStep < steps.length - 1 && <ChevronRight size={16} style={{ marginLeft: 4 }} />}
        </Btn>
      </div>
    </div>
  );
}
