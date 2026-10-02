// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Input components (ChatHomeInput, ChatConversationInput, OccasionSuggestions)
// ═══════════════════════════════════════════════════════════════════════════

import { useRef, useState } from "react";
import { ImagePlus, Mic, ArrowUp, X } from "lucide-react";
import { motion } from "motion/react";

import { dmSans400, dmSans500, getRandomSuggestions } from "./hs-stampy-constants";

// ── Shared image attachment ───────────────────────────────────────────────

export interface AttachedImage {
  /** Image URL or data URL for the attached file. */
  src: string;
  /** Original filename, used as the bubble alt text. */
  alt: string;
}

/* Images attach as base64 data URLs held in React state, so we cap input size
   to keep the string from blowing out memory. 10 MB covers typical phone
   photos; anything larger is dropped silently (demo scope). */
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
/* `image/*` would let the OS picker return SVGs, which render in <img> safely
   but can still fetch remote resources. Pin to common raster + animated formats. */
const ACCEPTED_IMAGE_MIME = "image/jpeg,image/png,image/webp,image/gif";

/**
 * Reads the first selected file into a data URL and hands it off through
 * `onAttached`. Non-image files, oversize files, and unreadable files are
 * ignored — the UI simply shows no chip, which is the signal that nothing
 * attached.
 */
function readImageAsDataUrl(
  file: File | null | undefined,
  onAttached: (image: AttachedImage) => void,
) {
  if (!file || !file.type.startsWith("image/") || file.size > MAX_IMAGE_BYTES) return;
  const reader = new FileReader();
  reader.onload = () => {
    const src = typeof reader.result === "string" ? reader.result : "";
    if (src) onAttached({ src, alt: file.name });
  };
  reader.onerror = () => { /* swallowed: no chip appears, user re-picks. */ };
  reader.readAsDataURL(file);
}

/**
 * Shared chip rendered above the textarea when an image is attached. Matches
 * the small frame-around-thumbnail look (beige square outer, rounded image inner).
 */
function AttachedImageChip({ image, onRemove }: { image: AttachedImage; onRemove: () => void }) {
  return (
    <div
      className="relative shrink-0 flex items-center justify-center rounded-[var(--radius-lg)]"
      style={{ width: 48, height: 48, backgroundColor: "var(--color-brand-secondary-dim)" }}
    >
      <img
        src={image.src}
        alt={image.alt}
        className="rounded-[var(--radius-md)] object-cover"
        style={{ width: 36, height: 36 }}
        draggable={false}
      />
      <button
        type="button"
        aria-label="Remove attached image"
        onClick={onRemove}
        className="absolute flex items-center justify-center rounded-full transition-colors"
        style={{
          top: -6, right: -6, width: 18, height: 18,
          backgroundColor: "var(--color-bg-main)",
          border: "1px solid var(--color-element-subtle)",
          color: "var(--color-text-primary)",
          boxShadow: "var(--shadow-xs)",
        }}
      >
        <X size={11} strokeWidth={2} />
      </button>
    </div>
  );
}

/**
 * Local state + handlers for an image attachment slot. Both inputs share this
 * verbatim; keeping it in one hook stops the two call sites drifting apart.
 */
function useImageAttachment() {
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openPicker = () => fileInputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    readImageAsDataUrl(e.target.files?.[0], setAttachedImage);
    /* Reset so the same file picked twice in a row still fires change. */
    e.target.value = "";
  };
  const clear = () => setAttachedImage(null);

  return { attachedImage, fileInputRef, openPicker, onFileChange, clear };
}

/**
 * Hidden file input + "Add reference images" pill button. Rendered by both
 * inputs whenever `onSendImage` is wired; omitted entirely otherwise.
 */
function AttachReferenceButton({
  fileInputRef, onFileChange, onClick,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClick: () => void;
}) {
  return (
    <>
      <input ref={fileInputRef} type="file" accept={ACCEPTED_IMAGE_MIME} onChange={onFileChange} className="hidden" aria-hidden="true" tabIndex={-1} />
      <button type="button" aria-label="Add reference images" onClick={onClick} className="transition-colors flex gap-[var(--space-1-5)] h-[32px] items-center px-[var(--space-2)] py-[var(--space-1-5)] relative rounded-[var(--radius-full)]" style={{ backgroundColor: "var(--color-brand-secondary-dim)" }} onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}>
        <div className="size-[16px] relative shrink-0 flex items-center justify-center" style={{ color: "var(--color-text-primary)" }}><ImagePlus size={18} strokeWidth={1.5} absoluteStrokeWidth /></div>
        <p className="font-medium leading-[var(--line-height-label-12)] text-[length:var(--font-size-label-12)] whitespace-nowrap" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>Add reference images</p>
      </button>
    </>
  );
}

// ── ChatHomeInput ──────────────────────────────────────────────────────────

export interface ChatHomeInputProps {
  placeholder?: string;
  onSend?: (value: string) => void;
  /** Controlled value — when provided the component is controlled */
  value?: string;
  onChange?: (value: string) => void;
  isRecording?: boolean;
  onToggleMic?: () => void;
  /**
   * Called when the user sends with an attached image. Text may be empty when
   * the user attached only an image. When omitted the attach button is hidden.
   */
  onSendImage?: (payload: { text: string; src: string; alt: string }) => void;
}

export function ChatHomeInput({
  placeholder = "Ask, search or create your card",
  onSend,
  value: controlledValue,
  onChange,
  isRecording: controlledRecording,
  onToggleMic,
  onSendImage,
}: ChatHomeInputProps) {
  const [localValue, setLocalValue] = useState("");
  const [localRecording, setLocalRecording] = useState(false);
  const { attachedImage, fileInputRef, openPicker, onFileChange, clear: clearImage } = useImageAttachment();

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
    if (attachedImage) {
      /* Controlled consumers clear their own value, same as the text path. */
      onSendImage?.({ text: currentValue.trim(), src: attachedImage.src, alt: attachedImage.alt });
      clearImage();
      if (!isControlled) setLocalValue("");
      return;
    }
    if (!currentValue.trim()) return;
    onSend?.(currentValue);
    if (!isControlled) setLocalValue("");
  }

  function handleMic() {
    if (onToggleMic) onToggleMic();
    else setLocalRecording(r => !r);
  }

  const canSend = !!attachedImage || !!currentValue.trim();

  return (
    <div className="flex flex-col gap-[var(--space-3)] pb-[var(--space-2)] pt-[var(--space-3)] px-[var(--space-2)] rounded-[var(--radius-2xl)] shrink-0 w-full relative transition-colors duration-200" style={{ backgroundColor: "var(--color-bg-main)", border: "1px solid var(--color-element-subtle)", boxShadow: "var(--shadow-xs)" }}>
      {attachedImage && (
        <div className="flex items-start gap-[var(--space-2)] px-[var(--space-1-5)] shrink-0">
          <AttachedImageChip image={attachedImage} onRemove={clearImage} />
        </div>
      )}
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
          {onSendImage && <AttachReferenceButton fileInputRef={fileInputRef} onFileChange={onFileChange} onClick={openPicker} />}
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
            disabled={!canSend && !currentRecording}
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!canSend ? "cursor-not-allowed" : ""}`}
            style={canSend ? { backgroundColor: "var(--color-brand-primary)", color: "var(--color-text-on-primary)" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}>
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
  /**
   * Called when the user sends with an attached image. Text may be empty when
   * the user attached only an image. When omitted the attach button is hidden.
   */
  onSendImage?: (payload: { text: string; src: string; alt: string }) => void;
}

export function ChatConversationInput({
  aiIconSrc,
  placeholder = "Ask, search or create your card",
  onSend,
  value: controlledValue,
  onChange,
  isRecording: controlledRecording,
  onToggleMic,
  onSendImage,
}: ChatConversationInputProps) {
  const [localValue, setLocalValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [localRecording, setLocalRecording] = useState(false);
  const { attachedImage, fileInputRef, openPicker, onFileChange, clear: clearImage } = useImageAttachment();

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
    if (attachedImage) {
      onSendImage?.({ text: currentValue.trim(), src: attachedImage.src, alt: attachedImage.alt });
      clearImage();
      if (!isControlled) setLocalValue("");
      return;
    }
    if (!currentValue.trim()) return;
    onSend?.(currentValue);
    if (!isControlled) setLocalValue("");
  }

  function handleMic() {
    if (onToggleMic) onToggleMic();
    else setLocalRecording(r => !r);
  }

  const canSend = !!attachedImage || !!currentValue.trim();

  return (
    <div className="w-full" style={{ backgroundColor: "var(--color-bg-main)" }}>
      {attachedImage && (
        <div className="flex items-start gap-[var(--space-2)] px-[var(--space-4)] pt-[var(--space-3)] shrink-0">
          <AttachedImageChip image={attachedImage} onRemove={clearImage} />
        </div>
      )}
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
          {onSendImage && <AttachReferenceButton fileInputRef={fileInputRef} onFileChange={onFileChange} onClick={openPicker} />}
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
            className={`flex items-center justify-center p-[var(--space-2)] relative rounded-[20px] shrink-0 size-[32px] transition-colors ${!canSend ? "cursor-not-allowed" : ""}`}
            style={canSend ? { backgroundColor: "var(--color-brand-primary)", color: "var(--color-text-on-primary)" } : { backgroundColor: "var(--color-brand-secondary-dim)", color: "var(--color-text-secondary)" }}
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
