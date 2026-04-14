// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Panel components (TadaBanner, ChatHomeScreen, ChatHeader)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useId } from "react";
import { PencilLine, ChevronDown, Plus, CheckCheck } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { dmSans400, dmSans500, TADA_SCOPED_TOKENS } from "./hs-stampy-constants";
import { useTypewriter } from "./hs-stampy-hooks";

// ── TadaBanner ─────────────────────────────────────────────────────────────

export function TadaBanner({
  loadingDuration = 10_000, loadingTitle = "Creating your card....", loadingMessage = "Initial generation might take a little longer, around 1-2 minutes. Thanks for your patience!",
  doneTitle = "Tada, Card generation is done!", doneMessage = "Your birthday card for Keith is ready! It's going to look wonderful in that Watercolor style.",
  partyPopperSrc,
}: {
  loadingDuration?: number; loadingTitle?: string; loadingMessage?: string; doneTitle?: string; doneMessage?: string; partyPopperSrc?: string;
}) {
  const [isDone, setIsDone] = useState(false);
  const scopeId = useId().replace(/:/g, "");

  useEffect(() => {
    const timer = setTimeout(() => setIsDone(true), loadingDuration);
    return () => clearTimeout(timer);
  }, [loadingDuration]);

  const scopeClass = `tada-banner-${scopeId}`;
  const headerContentStyle: React.CSSProperties = { display: "flex", alignItems: "center", gap: "var(--tb-space-2)", padding: "var(--tb-space-2) var(--tb-space-4)" };
  const headerTextStyle: React.CSSProperties = { fontWeight: "var(--tb-font-weight-bold)" as unknown as number, fontSize: "var(--tb-font-size-13)", lineHeight: "var(--tb-line-height-13)", fontFamily: "var(--tb-font-family)" };
  const bodyDivStyle: React.CSSProperties = { position: "relative", padding: "var(--tb-space-3) var(--tb-space-4)", fontSize: "var(--tb-font-size-12)", fontWeight: "var(--tb-font-weight-medium)" as unknown as number, lineHeight: "var(--tb-line-height-12)", borderRadius: "var(--tb-radius-2xl) var(--tb-radius-2xl) 11px 11px", boxShadow: "var(--shadow-lg)", background: "var(--tb-color-bg)", color: "var(--tb-color-fg)", fontFamily: "var(--tb-font-family)", overflow: "hidden" };

  return (
    <>
      <style>{`.${scopeClass} { ${TADA_SCOPED_TOKENS} }`}</style>
      <motion.div className={scopeClass} style={{ width: "100%", maxWidth: 362, borderRadius: "var(--tb-radius-2xl)", border: "1px solid var(--tb-color-brand-dim)", overflow: "hidden", fontFamily: "var(--tb-font-family)" }} animate={isDone ? { scale: [1, 1.03, 1] } : { scale: 1 }} transition={isDone ? { duration: 0.5, ease: [0.22, 1, 0.36, 1], times: [0, 0.4, 1] } : {}}>
        <motion.div animate={{ backgroundColor: isDone ? "var(--tb-color-destructive)" : "var(--tb-color-muted)" }} transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }} style={{ overflow: "hidden" }}>
          <div style={headerContentStyle}>
            <div style={{ position: "relative", width: "var(--tb-icon-size)", height: "var(--tb-icon-size)", flexShrink: 0 }}>
              <AnimatePresence mode="wait">
                {!isDone ? (
                  <motion.div key="spinner" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0, rotate: 90 }} transition={{ duration: 0.25 }} style={{ position: "absolute", inset: 0 }}>
                    <motion.svg width="var(--tb-icon-size)" height="var(--tb-icon-size)" viewBox="0 0 16 16" fill="none" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} style={{ flexShrink: 0 }}>
                      <circle cx="8" cy="8" r="6" stroke="var(--tb-color-fg)" strokeWidth="2" strokeLinecap="round" strokeDasharray="30 10" />
                    </motion.svg>
                  </motion.div>
                ) : (
                  <motion.div key="check" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.1 }} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CheckCheck size={16} color="var(--tb-color-destructive-fg)" strokeWidth={1.6} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
              <AnimatePresence mode="wait">
                {!isDone ? (
                  <motion.span key="loading-title" initial={{ opacity: 0, x: -10, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 10, filter: "blur(4px)" }} transition={{ duration: 0.3 }} style={{ ...headerTextStyle, display: "block", color: "var(--tb-color-fg)" }}>{loadingTitle}</motion.span>
                ) : (
                  <motion.span key="done-title" initial={{ opacity: 0, x: -12, filter: "blur(4px)" }} animate={{ opacity: 1, x: 0, filter: "blur(0px)" }} exit={{ opacity: 0, x: 12, filter: "blur(4px)" }} transition={{ duration: 0.35, delay: 0.1 }} style={{ ...headerTextStyle, display: "block", color: "var(--tb-color-destructive-fg)" }}>{doneTitle}</motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
          <div style={bodyDivStyle}>
            <AnimatePresence mode="wait">
              {!isDone ? (
                <motion.span key="loading-body" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.3 }} style={{ display: "block" }}>{loadingMessage}</motion.span>
              ) : (
                <motion.span key="done-body" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }} style={{ display: "block", paddingRight: "var(--tb-space-10)" }}>{doneMessage}</motion.span>
              )}
            </AnimatePresence>
            <AnimatePresence>
              {isDone && (
                <div style={{ position: "absolute", right: "var(--tb-space-2)", top: "50%", transform: "translateY(-50%)", width: "var(--tb-space-10)", height: "var(--tb-space-10)" }}>
                  <motion.img src={partyPopperSrc} alt="" width={40} height={40} initial={{ opacity: 0, scale: 0, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ type: "spring", stiffness: 350, damping: 14, delay: 0.35 }} aria-hidden />
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
}

// ── ChatHomeScreen ─────────────────────────────────────────────────────────

export interface ChatHomeScreenProps {
  /** Mascot image URL displayed to the left of the greeting */
  mascotSrc: string;
  /** Prompts cycled by the typewriter animation */
  examplePrompts?: string[];
  /** Whether to render the mascot (set to false on mobile). Defaults to true. */
  showMascot?: boolean;
}

export function ChatHomeScreen({
  mascotSrc,
  examplePrompts = [
    "I'm making a card for my girlfriend that will make her laugh",
    "I need a heartfelt thank you card for my best friend",
    "Help me write a funny retirement card for my dad",
    "Something silly and warm for my mom's 60th birthday",
  ],
  showMascot = true,
}: ChatHomeScreenProps) {
  const { displayText, isTyping } = useTypewriter(examplePrompts);

  return (
    <div className="flex flex-col justify-between w-full" style={{ backgroundColor: "var(--color-bg-main)", padding: "16px", gap: 16, position: "relative", overflow: "visible" }}>
      {/* Mascot */}
      {showMascot && (
        <div className="pointer-events-none select-none" style={{ position: "absolute", top: -8, left: -80, width: 150, height: 135, zIndex: 20 }}>
          <img alt="Stampy mascot" style={{ width: "100%", height: "100%", objectFit: "contain" }} src={mascotSrc} />
        </div>
      )}

      {/* Greeting + typewriter */}
      <div className="flex flex-col gap-[8px] items-start w-full relative pl-[40px]">
        <p className="font-normal leading-[28px] relative text-[18px] w-full" style={{ ...dmSans400, color: "var(--color-text-primary)" }}>Hi there! I'm Stampy</p>
        <div className="relative w-full" style={{ minHeight: 20 }}>
          <div className="pointer-events-none select-none">
            <span className="text-[15px] leading-[20px]" style={{ ...dmSans400, color: "var(--color-text-secondary)" }}>
              Try: {displayText}
              <motion.span
                className="inline-block w-[1.5px] h-[13px] ml-[1px] align-middle"
                style={{ backgroundColor: "var(--color-text-secondary)" }}
                animate={{ opacity: isTyping ? [1, 1, 0, 0] : [1, 0] }}
                transition={isTyping ? { repeat: Infinity, duration: 0.8, times: [0, 0.45, 0.5, 1] } : { repeat: Infinity, duration: 0.6 }}
              />
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}

// ── ChatHeader ─────────────────────────────────────────────────────────────

export interface ChatHeaderProps {
  /** Active conversation name shown in the dropdown pill */
  conversationName?: string;
  /** List of conversations in the dropdown */
  conversations?: { id: string; name: string }[];
  /** Whether the expanded (PiP) state is active */
  expanded?: boolean;
  /** Open the conversation dropdown by default (useful for doc previews) */
  defaultDropdownOpen?: boolean;
  /** Called when the expand button is clicked */
  onToggleExpand?: () => void;
  /** Called when the minimize (–) button is clicked */
  onMinimize?: () => void;
  /** Called when a conversation is selected */
  onSelectConversation?: (id: string) => void;
  /** Called when "New Conversation" is clicked */
  onNewConversation?: () => void;
  /** Called when a conversation is renamed; receives the id and the new name */
  onRename?: (id: string, newName: string) => void;
}

export function ChatHeader({
  conversationName = "Jack's Birthday Bi...",
  conversations = [
    { id: "1", name: "Jack's Birthday Bi..." },
    { id: "2", name: "Lupe's Luau" },
    { id: "3", name: "Mom's Anniversary" },
  ],
  expanded = false,
  defaultDropdownOpen = false,
  onToggleExpand,
  onMinimize,
  onSelectConversation,
  onNewConversation,
  onRename,
}: ChatHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(defaultDropdownOpen);
  const [localConversations, setLocalConversations] = useState(conversations);
  const [editingConvoId, setEditingConvoId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setLocalConversations(conversations); }, [conversations]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setDropdownOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function commitRename(id: string, name: string) {
    const trimmed = name.trim();
    if (!trimmed) { setEditingConvoId(null); return; }
    setLocalConversations(prev => prev.map(c => c.id === id ? { ...c, name: trimmed } : c));
    onRename?.(id, trimmed);
    setEditingConvoId(null);
  }

  return (
    <div className="border-b border-solid flex items-center justify-between px-[16px] py-[12px] relative shrink-0 w-full z-30 rounded-t-[20px]" style={{ borderColor: "var(--color-element-subtle)", backgroundColor: "var(--color-bg-main)" }}>
      {/* Left: Stampy label + conversation dropdown */}
      <div className="flex gap-[12px] items-center relative shrink-0 min-w-0 flex-1">
        <div className="flex flex-col justify-center leading-[0] relative shrink-0 text-[15px] whitespace-nowrap" style={{ ...dmSans500, fontWeight: 600, color: "var(--color-text-primary)" }}>
          <p className="leading-[normal]">Stampy</p>
        </div>
        <div ref={ref} className="relative min-w-0">
          <button
            className="flex items-center gap-[8px] px-[12px] h-[32px] rounded-[30px] cursor-pointer transition-colors max-w-[180px]"
            style={{ backgroundColor: "var(--color-brand-secondary-dim)" }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-pressed)")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "var(--color-brand-secondary-dim)")}
            onClick={() => setDropdownOpen(p => !p)}
          >
            <span className="text-[15px] leading-[20px] truncate" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>{conversationName}</span>
            <ChevronDown size={10} strokeWidth={1.5} absoluteStrokeWidth className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
          </button>
          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                className="absolute top-[calc(100%+4px)] left-0 rounded-[12px] py-[4px] min-w-[220px] z-50"
                style={{ backgroundColor: "var(--color-bg-main)", boxShadow: "var(--shadow-md)", border: "1px solid var(--color-element-subtle)" }}
                initial={{ opacity: 0, y: -4, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.97 }}
                transition={{ duration: 0.15 }}
              >
                <button className="flex items-center gap-[8px] w-[calc(100%-24px)] mx-[4px] px-[12px] h-[32px] text-left cursor-pointer transition-colors rounded-[6px]" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={() => { setDropdownOpen(false); onNewConversation?.(); }}>
                  <Plus size={14} strokeWidth={1.5} className="shrink-0" style={{ color: "var(--color-text-primary)" }} />
                  <span className="text-[15px] leading-[20px]" style={{ ...dmSans500, color: "var(--color-text-primary)" }}>New Conversation</span>
                </button>
                <div className="mx-[4px] my-[4px] h-px" style={{ backgroundColor: "var(--color-element-subtle)" }} />
                <div className="max-h-[240px] overflow-y-auto">
                  {localConversations.map(c => {
                    const isActive = c.name === conversationName;
                    return (
                      <div key={c.id} className="group flex items-center justify-between px-[12px] mx-[4px] h-[32px] cursor-pointer transition-colors rounded-[6px]" style={{ backgroundColor: isActive ? "var(--color-brand-secondary-dim)" : "transparent" }} onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--color-state-hover)"; }} onMouseLeave={e => { e.currentTarget.style.backgroundColor = isActive ? "var(--color-brand-secondary-dim)" : "transparent"; }} onClick={() => { if (editingConvoId !== c.id) { setDropdownOpen(false); onSelectConversation?.(c.id); } }}>
                        {editingConvoId === c.id ? (
                          <input
                            className="flex-1 text-[15px] leading-[20px] bg-transparent outline-none min-w-0"
                            style={{ ...dmSans400, color: "var(--color-text-primary)", borderBottom: "1px solid var(--color-text-primary)" }}
                            value={editingName}
                            autoFocus
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") commitRename(c.id, editingName); if (e.key === "Escape") setEditingConvoId(null); }}
                            onBlur={() => commitRename(c.id, editingName)}
                            onClick={e => e.stopPropagation()}
                          />
                        ) : (
                          <>
                            <span className="text-[15px] leading-[20px] truncate" style={{ ...(isActive ? dmSans500 : dmSans400), color: "var(--color-text-primary)" }}>{c.name}</span>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-[8px] p-[2px] rounded cursor-pointer" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={e => { e.stopPropagation(); setEditingConvoId(c.id); setEditingName(c.name); }} aria-label={`Rename ${c.name}`}>
                              <PencilLine size={14} strokeWidth={1.5} style={{ color: "var(--color-text-secondary)" }} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right: expand + minimize */}
      <div className="flex gap-[8px] items-center relative shrink-0">
        <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={onToggleExpand}>
          {expanded ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 4C20.6569 4 22 5.34315 22 7V17C22 18.6051 20.7394 19.9158 19.1543 19.9961L19 20H5L4.8457 19.9961C3.26055 19.9158 2 18.6051 2 17V7C2 5.34315 3.34315 4 5 4H19ZM5 5.5C4.17157 5.5 3.5 6.17157 3.5 7V17C3.5 17.8284 4.17157 18.5 5 18.5H19C19.8284 18.5 20.5 17.8284 20.5 17V7C20.5 6.17157 19.8284 5.5 19 5.5H5ZM18 7C18.5523 7 19 7.44772 19 8V16C19 16.5523 18.5523 17 18 17H14C13.4477 17 13 16.5523 13 16V8C13 7.44772 13.4477 7 14 7H18Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15.4883 3.33691C17.073 3.41753 18.3338 4.72826 18.334 6.33301V13.666L18.3301 13.8203C18.2525 15.3543 17.0221 16.5841 15.4883 16.6621L15.334 16.666H4.66699C3.01014 16.666 1.66699 15.3229 1.66699 13.666V6.33301C1.66717 4.6763 3.01025 3.33301 4.66699 3.33301H15.334L15.4883 3.33691ZM4.66699 4.83301C3.83867 4.83301 3.16717 5.50473 3.16699 6.33301V13.666C3.16699 14.4944 3.83857 15.166 4.66699 15.166H15.334C16.1621 15.1657 16.834 14.4942 16.834 13.666V6.33301C16.8338 5.50495 16.162 4.83336 15.334 4.83301H4.66699ZM14.833 9.16699C15.3853 9.16699 15.833 9.61471 15.833 10.167V13.167C15.8328 13.7191 15.3852 14.167 14.833 14.167H11.833C11.281 14.1668 10.8332 13.719 10.833 13.167V10.167C10.833 9.61482 11.2809 9.16717 11.833 9.16699H14.833Z" className="fill-[var(--color-text-secondary)] group-hover:fill-[var(--color-text-primary)] transition-colors" /></svg>
          )}
        </div>
        <div className="group flex items-center justify-center relative rounded-[25px] shrink-0 size-[32px] cursor-pointer transition-colors" onMouseEnter={e => (e.currentTarget.style.backgroundColor = "var(--color-state-hover)")} onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")} onClick={onMinimize}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M4.16669 10H15.8334" className="stroke-[var(--color-text-secondary)] group-hover:stroke-[var(--color-text-primary)] transition-colors" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
    </div>
  );
}
