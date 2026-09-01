// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Input components (ChatHomeInput, ChatConversationInput, OccasionSuggestions)
// ═══════════════════════════════════════════════════════════════════════════

import { useState } from "react";
import { ImagePlus, Mic, ArrowUp, X } from "lucide-react";
import { motion } from "motion/react";

import { dmSans400, dmSans500, getRandomSuggestions } from "./hs-stampy-constants";

// ── ChatHomeInput ──────────────────────────────────────────────────────────

export interface ChatHomeInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  /** Controlled value — when provided the component is controlled */
  value?: string;
  onChange?: (value: string) => void;
  isRecording?: boolean;
  onToggleMic?: () => void;
}

export function ChatHomeInput({
  placeholder = "Ask, search or create your card",
  onSend,
  value: controlledValue,
  onChange,
  isRecording: controlledRecording,
  onToggleMic,
}: ChatHomeInputProps) {
  const [localValue, setLocalValue] = useState("");
  const [localRecording, setLocalRecording] = useState(false);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : localValue;
  const currentRecording = controlledRecording !== undefined ? controlledRecording : localRecording;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (isControlled) onChange?.(e.target.value);
    else setLocalValue(e.target.value);
  }

  function handleSend() {
    if (!currentValue.trim()) return;
    onSend?.(currentValue);
    if (!isControlled) setLocalValue("");
  }

  function handleMic() {
    if (onToggleMic) onToggleMic();
    else setLocalRecording(r => !r);
  }

  return (
    <div className="flex flex-col gap-[var(--space-6)] pb-[var(--space-2)] pt-[var(--space-3)] px-[var(--space-2)] rounded-[var(--radius-2xl)] shrink-0 w-full relative transition-colors duration-200" style={{ backgroundColor: "var(--color-bg-main)", border: "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
      <div className="flex items-center px-[var(--space-1-5)] relative shrink-0 w-full min-h-[32px]">
        <textarea
          className="flex-1 w-full resize-none bg-transparent outline-none text-[length:var(--font-size-body-15)] leading-[var(--line-height-body-15)]"
          style={{ ...dmSans400, color: "var(--color-text-primary)", caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden" }}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
          rows={1}
          placeholder={placeholder}
        />
      </div>
      <div className="flex items-end justify-between relative shrink-0 w-full">
        <div className="flex gap-[var(--space-2)] items-end relative shrink-0">
          <button className="transition-colors flex gap-[var(--space-1-5)] h-[32px] items-center px-[var(--space-2)] py-[var(--space-1-5)] relative rounded-[var(--radius-full)]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
            <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
            <p className="font-medium leading-[var(--line-height-label-12)] text-[length:var(--font-size-label-12)] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
          </button>
        </div>
        <div className="flex gap-[var(--space-1)] items-center relative shrink-0">
          <button
            aria-label="Toggle Microphone" type="button" onClick={handleMic}
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${currentRecording ? "bg-red-100 text-red-500" : ""}`}
            style={!currentRecording ? { color: "var(--color-text-primary)" } : undefined}
            onMouseEnter={!currentRecording ? e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)") : undefined}
            onMouseLeave={!currentRecording ? e => (e.currentTarget.style.backgroundColor = "") : undefined}>
            <Mic size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            aria-label="Send" type="button" onClick={handleSend}
            disabled={!currentValue.trim() && !currentRecording}
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!currentValue.trim() ? "cursor-not-allowed" : ""}`}
            style={currentValue.trim() ? { backgroundColor: "var(--color-brand-primary)", color: "var(--color-text-on-primary)" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}>
            <ArrowUp size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ChatConversationInput ───────────────────────────────────────────────────

export interface ChatConversationInputProps {
  /** AI sparkle icon URL */
  aiIconSrc: string;
  /** Input placeholder text */
  placeholder?: string;
  /** Called when the user submits a message */
  onSend?: (value: string) => void;
  /** Controlled value — when provided the component is controlled */
  value?: string;
  onChange?: (value: string) => void;
  isRecording?: boolean;
  onToggleMic?: () => void;
}

export function ChatConversationInput({
  aiIconSrc,
  placeholder = "Ask, search or create your card",
  onSend,
  value: controlledValue,
  onChange,
  isRecording: controlledRecording,
  onToggleMic,
}: ChatConversationInputProps) {
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [localRecording, setLocalRecording] = useState(false);

  const isControlled = controlledValue !== undefined;
  const currentValue = isControlled ? controlledValue : localValue;
  const currentRecording = controlledRecording !== undefined ? controlledRecording : localRecording;

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
    if (isControlled) onChange?.(e.target.value);
    else setLocalValue(e.target.value);
  }

  function handleSend() {
    if (!currentValue.trim()) return;
    onSend?.(currentValue);
    if (!isControlled) setLocalValue("");
  }

  function handleMic() {
    if (onToggleMic) onToggleMic();
    else setLocalRecording(r => !r);
  }

  return (
    <div className="w-full" style={{ backgroundColor: "var(--color-bg-main)" }}>
      {/* AI icon + textarea */}
      <div className="flex gap-[var(--space-2-5)] items-center px-[var(--space-4)] w-full shrink-0 mt-[var(--space-2)] mb-[var(--space-2)]">
        <motion.img
          alt=""
          className="pointer-events-none object-cover shrink-0"
          src={aiIconSrc}
          animate={{ scale: [13 / 16, 1, 13 / 16], opacity: isFocused || !!currentValue ? 1 : 0.5 }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
          style={{ width: 16, height: 16 }}
        />
        <textarea
          className="flex-1 resize-none bg-transparent outline-none text-[length:var(--font-size-body-15)] leading-[var(--line-height-body-15)] min-w-0"
          style={{ ...dmSans400, caretColor: "var(--color-text-primary)", border: "none", padding: 0, minHeight: 20, overflow: "hidden", color: isFocused || currentValue ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}
          value={currentValue}
          placeholder={placeholder}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } if ((e.metaKey || e.ctrlKey) && e.key === "a") { e.stopPropagation(); e.currentTarget.setSelectionRange(0, e.currentTarget.value.length); } }}
          rows={1}
        />
      </div>

      {/* Divider */}
      <div className="relative w-full h-px shrink-0">
        <div className="absolute inset-0">
          <svg className="block w-full h-full" fill="none" preserveAspectRatio="none" viewBox="0 0 640 1">
            <line stroke="var(--color-element-subtle)" x2="640" y1="0.5" y2="0.5" />
          </svg>
        </div>
      </div>

      {/* Bottom actions */}
      <div className="flex gap-[var(--space-2)] items-end px-[var(--space-4)] py-[var(--space-2)] w-full">
        <div className="flex flex-[1_0_0] gap-[var(--space-2)] items-end min-w-px">
          <button className="transition-colors flex gap-[var(--space-1-5)] h-[32px] items-center px-[var(--space-2)] py-[var(--space-1-5)] relative rounded-[var(--radius-full)]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
            <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
            <p className="font-medium leading-[var(--line-height-label-12)] text-[length:var(--font-size-label-12)] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
          </button>
        </div>
        <div className="flex gap-[var(--space-1)] items-center relative shrink-0">
          <button
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${currentRecording ? "bg-red-100 text-red-500" : ""}`}
            style={!currentRecording ? { color: "var(--color-text-primary)" } : undefined}
            onMouseEnter={!currentRecording ? e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)") : undefined}
            onMouseLeave={!currentRecording ? e => (e.currentTarget.style.backgroundColor = "") : undefined}
            onClick={handleMic}>
            <Mic size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
          <button
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!currentValue.trim() ? "cursor-not-allowed" : ""}`}
            style={currentValue.trim() ? { backgroundColor: "var(--color-brand-primary)", color: "var(--color-text-on-primary)" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}
            onClick={handleSend}>
            <ArrowUp size={18} strokeWidth={1.5} absoluteStrokeWidth />
          </button>
        </div>
      </div>
    </div>
  );
}

// ── OccasionSuggestions ────────────────────────────────────────────────────

export interface OccasionSuggestionsProps {
  /** Suggestions to display. Defaults to 4 random occasions. */
  suggestions?: string[];
  /** Called when a suggestion item is clicked */
  onSelect?: (item: string) => void;
  /** Called when the close (×) button is clicked */
  onClose?: () => void;
}

export function OccasionSuggestions({
  suggestions = getRandomSuggestions(4),
  onSelect,
  onClose,
}: OccasionSuggestionsProps) {
  return (
    <div className="rounded-[var(--radius-2xl)] p-[var(--space-2)] w-full flex flex-col items-start" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}>
      <div className="flex gap-[var(--space-4)] items-start justify-end p-[var(--space-2)] relative shrink-0 w-full">
        <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>What's the occasion?</p>
        <button onClick={onClose} className="shrink-0 transition-colors" style={{ color: "var(--color-text-secondary)" }} onMouseEnter={e => (e.currentTarget.style.color = "var(--color-text-primary)")} onMouseLeave={e => (e.currentTarget.style.color = "var(--color-text-secondary)")} aria-label="Close suggestions">
          <X size={16} strokeWidth={1.5} absoluteStrokeWidth />
        </button>
      </div>
      <div className="flex flex-col items-start w-full">
        {suggestions.map((item, i) => (
          <button key={item} onClick={() => onSelect?.(item)} className="flex gap-[var(--space-2)] items-center pl-[var(--space-2)] pr-[var(--space-2)] py-[var(--space-1-5)] rounded-[var(--radius-sm)] w-full transition-colors text-left" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}>
            <div className="flex flex-col items-center justify-center rounded-[var(--radius-xs)] shrink-0 w-[20px]" style={{ backgroundColor: "var(--color-element-subtle)" }}>
              <p className="leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)] text-center w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{i + 1}</p>
            </div>
            <p className="flex-1 leading-[var(--line-height-body-15)] text-[length:var(--font-size-body-15)]" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>{item}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
