// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Faithful port from the Stampy Chatbot Component project.
// Every sub-component, style, animation, and color is matched to the live app.
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "./scroll-area";
import { motion, AnimatePresence } from "motion/react";
import type { ChatScript, ChatMessage } from "./hs-chat-types";

// Internal modules
import { OCCASIONS, getRandomSuggestions, bubbleSpring, entranceSpring, bubbleBg, dmSans400 } from "./hs-stampy-constants";
import { useBubbleTypewriter } from "./hs-stampy-hooks";
import { WorkingSpinner, StampyBubble, UserBubble, StyleCarousel } from "./hs-stampy-bubbles";
import { OverflowMenu, ChecklistOverflowMenu, TemplateOverflowMenu, ActionOverflowMenu } from "./hs-stampy-menus";
import { ChatHomeInput, ChatConversationInput, OccasionSuggestions } from "./hs-stampy-inputs";
import { TadaBanner, ChatHomeScreen, ChatHeader } from "./hs-stampy-panels";

// Assets are passed as props to avoid bloating the library bundle.
// Consumers import their own assets or use the defaults from the demo page.

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT: StampyChatbot
// ═══════════════════════════════════════════════════════════════════════════

export interface StampyChatbotProps {
  /** The conversation script driving the chat flow */
  chatScript: ChatScript;
  /** Mascot image URL */
  mascotSrc: string;
  /** AI sparkle icon URL */
  aiIconSrc: string;
  /** Home background pattern URL */
  backgroundSrc: string;
  /** FAB icon URL */
  stampyIconSrc: string;
  /** Party popper GIF URL (used in TadaBanner) */
  partyPopperSrc: string;
  /** CSS class on the root container */
  className?: string;
  /**
   * Override the height used when computing the expanded-panel size.
   * Defaults to `window.innerHeight`. Pass the container's pixel height
   * (e.g. 750) when embedding inside a fixed-height doc preview so the
   * expanded panel doesn't overflow the container.
   */
  containerHeight?: number;
}

export function StampyChatbot({
  chatScript,
  mascotSrc,
  aiIconSrc,
  backgroundSrc,
  stampyIconSrc,
  partyPopperSrc,
  className = "",
  containerHeight,
}: StampyChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [activeSuggestions, setActiveSuggestions] = useState<string[]>(() => getRandomSuggestions(4));
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (isOpen) { setActiveSuggestions(getRandomSuggestions(4)); setShowSuggestions(true); }
  }, [isOpen]);

  // Conversation management
  const [conversations, setConversations] = useState<{ id: string; name: string }[]>([
    { id: "1", name: "Jack's Birthday Birthda..." },
    { id: "2", name: "Lupe's Luau" },
    { id: "3", name: "Tamara's Thanksgiving" },
    { id: "4", name: "Omar's Octoberfest" },
    { id: "5", name: "Yuri's Yuletide Card" },
    { id: "6", name: "Quin's Quinceañera" },
    { id: "7", name: "Ida's Inauguration Invite" },
    { id: "8", name: "Noelle's New Years" },
  ]);
  const [activeConversationId, setActiveConversationId] = useState("1");

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  // Step-based state machine
  const [sentMessage, setSentMessage] = useState<string | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [typingText, setTypingText] = useState<string | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [lastChoice, setLastChoice] = useState("");
  const [themeChoice, setThemeChoice] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatsScrollRef = useRef<HTMLDivElement>(null);
  const chatsInnerRef = useRef<HTMLDivElement>(null);

  const { displayed: typedText, isDone: typingDone } = useBubbleTypewriter(typingText);
  const committedRef = useRef(false);
  useEffect(() => { committedRef.current = false; }, [typingText]);

  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" ? window.innerWidth < 640 : false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const isWorking = sentMessage !== null;

  const handleNewConversation = () => {
    const newId = String(Date.now());
    setConversations(prev => [{ id: newId, name: "New Conversation" }, ...prev]);
    setActiveConversationId(newId);
    setSentMessage(null); setStepIndex(-1); setMessages([]); setTypingText(null); setShowMenu(false); setShowBanner(false); setLastChoice(""); setThemeChoice(null);
  };

  const handleRenameConversation = (id: string, newName: string) => {
    setConversations(prev => prev.map(c => c.id === id ? { ...c, name: newName } : c));
  };

  // Step controller
  useEffect(() => {
    if (stepIndex < 0 || stepIndex >= chatScript.steps.length) return;
    const step = chatScript.steps[stepIndex];
    if (step.type === "stampy" || step.type === "final-card") {
      const msg = step.message.replace(/\{\{prev\}\}/g, lastChoice);
      const delay = step.delay ?? 2500;
      const timer = setTimeout(() => setTypingText(msg), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "overflow" || step.type === "checklist" || step.type === "template" || step.type === "action") {
      const delay = step.delay ?? 2500;
      const timer = setTimeout(() => setShowMenu(true), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "style-carousel") {
      const delay = step.delay ?? 500;
      const timer = setTimeout(() => setShowMenu(true), delay);
      return () => clearTimeout(timer);
    }
    if (step.type === "banner") { setShowBanner(true); }
  }, [stepIndex, lastChoice]);

  // Typewriter completion
  useEffect(() => {
    if (!typingDone || !typingText || committedRef.current) return;
    const step = chatScript.steps[stepIndex];
    if (!step || (step.type !== "stampy" && step.type !== "final-card")) return;
    committedRef.current = true;
    let buttons: string[] | undefined;
    if (step.type === "stampy") buttons = step.buttons;
    else if (step.type === "final-card") buttons = [step.button];
    const resolvedText = step.message.replace(/\{\{prev\}\}/g, lastChoice);
    const nextStep = stepIndex + 1 < chatScript.steps.length ? chatScript.steps[stepIndex + 1] : null;
    const showCarousel = nextStep?.type === "style-carousel" ? true : undefined;
    setMessages(prev => [...prev, { role: "stampy", text: resolvedText, buttons, showCarousel }]);
    setTypingText(null);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }, [typingDone]);

  function handleMenuComplete(choice: string) {
    setShowMenu(false); setLastChoice(choice); setMessages(prev => [...prev, { role: "user", text: choice }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleMenuSkip() {
    setShowMenu(false);
    const step = chatScript.steps[stepIndex];
    if (step.type === "checklist" && step.skipMessage) setMessages(prev => [...prev, { role: "user", text: "Skip" }, { role: "stampy", text: step.skipMessage! }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleStyleSelect(style: string) {
    setThemeChoice(style); setShowMenu(false); setLastChoice(style); setMessages(prev => [...prev, { role: "user", text: style }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  function handleTriggerButton() {
    if (stepIndex >= 0 && stepIndex < chatScript.steps.length) {
      const nextStep = chatScript.steps[stepIndex];
      if (nextStep.type === "overflow" || nextStep.type === "checklist" || nextStep.type === "template" || nextStep.type === "action" || nextStep.type === "style-carousel") setShowMenu(true);
    }
  }

  function handleActionGenerate() {
    setShowMenu(false); setMessages(prev => [...prev, { role: "user", text: "Generate" }]);
    if (stepIndex + 1 < chatScript.steps.length) setStepIndex(stepIndex + 1);
  }

  // Auto-scroll
  useEffect(() => {
    const container = chatsScrollRef.current;
    if (!container) return;
    const scrollToBottom = () => { container.scrollTop = container.scrollHeight; };
    scrollToBottom();
    const scrollInterval = setInterval(scrollToBottom, 16);
    const stopScrollTimer = setTimeout(() => clearInterval(scrollInterval), 1200);
    let isAutoScrolling = true;
    const handleScroll = () => { const { scrollTop, scrollHeight, clientHeight } = container; isAutoScrolling = scrollHeight - scrollTop - clientHeight < 50; };
    container.addEventListener("scroll", handleScroll);
    const ro = new ResizeObserver(() => { if (isAutoScrolling) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; }); });
    ro.observe(container);
    const mo = new MutationObserver((mutations) => { mutations.forEach(m => m.addedNodes.forEach(node => { if (node instanceof Element) ro.observe(node); })); if (isAutoScrolling) requestAnimationFrame(() => { container.scrollTop = container.scrollHeight; }); });
    mo.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ["style"] });
    return () => { clearInterval(scrollInterval); clearTimeout(stopScrollTimer); container.removeEventListener("scroll", handleScroll); ro.disconnect(); mo.disconnect(); };
  }, [sentMessage, messages, typingText, showMenu, showBanner, stepIndex]);


  function processMessage(msg: string) {
    if (!msg) return;
    if (!sentMessage) { setSentMessage(msg); setMessages([{ role: "user", text: msg }]); setStepIndex(0); setInputValue(""); return; }
    setMessages(prev => [...prev, { role: "user", text: msg }]); setInputValue("");
  }

  function handleSend() { processMessage(inputValue.trim()); }

  // Speech recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const recognition = new SR();
      recognition.continuous = true; recognition.interimResults = true; recognition.lang = "en-US";
      let finalTranscript = "";
      recognition.onresult = (event: any) => {
        let interimTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript + " ";
          else interimTranscript += transcript;
        }
        const currentInput = finalTranscript + interimTranscript;
        if (currentInput) setInputValue(currentInput.trim());
      };
      recognition.onerror = () => setIsRecording(false);
      recognition.onend = () => { setIsRecording(false); finalTranscript = ""; };
      recognitionRef.current = recognition;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) return;
    if (isRecording) { recognitionRef.current.stop(); setIsRecording(false); }
    else { try { recognitionRef.current.start(); setIsRecording(true); } catch {} }
  };

  const currentStep = stepIndex >= 0 && stepIndex < chatScript.steps.length ? chatScript.steps[stepIndex] : null;
  const showWorkingSpinner = stepIndex >= 0 && !typingText && !showMenu && !showBanner && currentStep !== null && (currentStep.type === "stampy" || currentStep.type === "final-card");

  // ── RENDER ─────────────────────────────────────────────────────────────

  return (
    <div className={`relative flex items-end justify-end pt-[24px] pb-[24px] pr-[24px] ${className}`} style={{ width: "100%", height: "100%", overflow: "hidden" }}>
      {/* Background */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundColor: "var(--chatbot-hero-bg, var(--color-brand-secondary))" }} />
        <div className="absolute inset-0 mix-blend-luminosity opacity-15" style={{ backgroundImage: `url('${backgroundSrc}')`, backgroundSize: "1438px 1079px", backgroundPosition: "top left" }} />
      </div>

      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div key="closed" className="cursor-pointer relative z-50 flex items-center justify-center rounded-full" style={{ width: 72, height: 72, boxShadow: "var(--shadow-lg)" }} initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }} transition={entranceSpring} onClick={() => setIsOpen(true)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <img alt="Stampy mascot" className="w-full h-full object-contain pointer-events-none" src={stampyIconSrc} />
          </motion.div>
        ) : (
          <motion.div key="opened" className="relative flex flex-col items-end gap-[8px] w-full sm:w-[540px] px-3 sm:px-0 h-full" style={{ flexShrink: 0 }} initial={false} animate={{ opacity: 1 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.25, ease: "easeOut" }}>
            <div className="flex items-end justify-end w-full relative flex-1">
              <motion.div className="flex flex-col items-start w-full sm:w-[450px] overflow-hidden" style={{ backgroundColor: "var(--color-bg-main)", marginRight: isMobile ? 0 : -5, borderRadius: 20, boxShadow: "var(--shadow-xs)" }} initial={{ opacity: 0, y: 24, scale: 0.98 }} animate={{ opacity: 1, scale: 1, y: 0, height: isExpanded ? (containerHeight ?? window.innerHeight) - 48 : isMobile ? Math.max(420, (containerHeight ?? window.innerHeight) - 80) : 550 }} transition={{ opacity: { duration: 0.3, ease: "easeOut" }, y: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] } }}>

                {/* HEADER */}
                <ChatHeader
                  conversationName={activeConversation?.name ?? "New Conversation"}
                  conversations={conversations}
                  expanded={isExpanded}
                  onToggleExpand={() => setIsExpanded(p => !p)}
                  onMinimize={() => { setIsExpanded(false); setIsOpen(false); }}
                  onSelectConversation={(id) => setActiveConversationId(id)}
                  onNewConversation={handleNewConversation}
                  onRename={handleRenameConversation}
                />

                {/* CONTENT */}
                <div className={`flex-1 w-full relative ${isWorking ? "overflow-hidden" : "overflow-visible"} flex flex-col rounded-b-[20px] min-h-0`} style={{ backgroundColor: "var(--color-bg-main)" }}>
                  <AnimatePresence mode="wait" initial={false}>
                    {!isWorking ? (
                      /* HOME STATE */
                      <motion.div key="default" className="flex flex-col justify-between w-full flex-1 min-h-0 z-10 relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.15 }}>
                        {/* Greeting + mascot */}
                        <ChatHomeScreen
                          mascotSrc={mascotSrc}
                          examplePrompts={chatScript.examplePrompts}
                          showMascot={!isMobile}
                        />

                        {/* Suggestions + home input */}
                        <div className="flex flex-col gap-[16px] w-full px-[16px] pb-[16px]">
                          <AnimatePresence>
                            {showSuggestions && (
                              <motion.div key="suggestions" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }} transition={{ type: "spring", stiffness: 300, damping: 28 }}>
                                <OccasionSuggestions
                                  suggestions={activeSuggestions}
                                  onSelect={(item) => { setShowSuggestions(false); processMessage(item); }}
                                  onClose={() => setShowSuggestions(false)}
                                />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <ChatHomeInput
                            value={inputValue}
                            onChange={setInputValue}
                            onSend={handleSend}
                            isRecording={isRecording}
                            onToggleMic={toggleMic}
                          />
                        </div>
                      </motion.div>
                    ) : (
                      /* WORKING STATE */
                      <motion.div key="working" className="flex flex-col w-full flex-1 relative overflow-hidden min-h-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }} transition={{ type: "spring", stiffness: 260, damping: 28, delay: 0.08 }}>
                        <div className="flex flex-col flex-1 overflow-hidden p-[16px] gap-[24px] min-h-0">
                          <ScrollArea viewportRef={chatsScrollRef} className="flex-1 min-h-0">
                          <div ref={chatsInnerRef} className="flex flex-col gap-[16px] justify-end flex-1">

                            {messages.map((msg, i) => {
                              if (msg.role === "user") {
                                return (
                                  <UserBubble key={`msg-${i}`} text={msg.text} delay={0.1} />
                                );
                              } else {
                                return (
                                  <div key={`msg-${i}`} className="flex flex-col gap-[16px] w-full shrink-0">
                                    <StampyBubble
                                      text={msg.text}
                                      buttons={msg.buttons}
                                      buttonsUsed={i < messages.length - 1}
                                      onButtonClick={handleTriggerButton}
                                      buttonDelay={0.08}
                                    />
                                    {msg.showCarousel && <StyleCarousel themeChoice={themeChoice} setThemeChoice={handleStyleSelect} />}
                                  </div>
                                );
                              }
                            })}

                            <AnimatePresence mode="popLayout">
                              {typingText && (
                                <StampyBubble key="typing-bubble" text={typedText} />
                              )}
                            </AnimatePresence>

                            <AnimatePresence>{showWorkingSpinner && <WorkingSpinner key="step-loader" />}</AnimatePresence>

                            <AnimatePresence>
                              {showBanner && currentStep?.type === "banner" && (
                                <motion.div key="generating-banner" className="flex w-full justify-start pr-[56px] shrink-0" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={bubbleSpring}>
                                  <TadaBanner loadingDuration={currentStep.config.loadingDuration} loadingTitle={currentStep.config.loadingTitle} loadingMessage={currentStep.config.loadingMessage} doneTitle={currentStep.config.doneTitle} doneMessage={currentStep.config.doneMessage} partyPopperSrc={partyPopperSrc} />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                          </ScrollArea>
                        </div>

                        {/* Conversation input + bottom bar */}
                        <ChatConversationInput
                          aiIconSrc={aiIconSrc}
                          value={inputValue}
                          onChange={setInputValue}
                          onSend={handleSend}
                          isRecording={isRecording}
                          onToggleMic={toggleMic}
                        />

                        {/* Overflow menus */}
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "overflow" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <OverflowMenu pages={currentStep.pages} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={handleMenuComplete} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "template" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <TemplateOverflowMenu header={currentStep.header} cards={currentStep.cards} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={handleMenuComplete} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "action" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <ActionOverflowMenu config={currentStep.config} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onGenerate={handleActionGenerate} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <AnimatePresence>
                          {showMenu && currentStep?.type === "checklist" && (
                            <motion.div className="absolute bottom-[16px] left-[16px] right-[16px] z-20" initial={{ opacity: 0, y: 14, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 6, scale: 0.97 }} transition={{ type: "spring", stiffness: 340, damping: 18, mass: 0.8 }}>
                              <ChecklistOverflowMenu pages={currentStep.pages} inputPlaceholder={currentStep.inputPlaceholder} onClose={() => setShowMenu(false)} onComplete={(selected) => { if (selected.length === 0) handleMenuSkip(); else handleMenuComplete(selected.join(", ")); }} />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default StampyChatbot;

// ── Barrel re-exports for backwards compatibility ─────────────────────────

export { WorkingSpinner, BubbleButton, StampyBubble, UserBubble, StyleCarousel } from "./hs-stampy-bubbles";
export { OverflowMenu, ChecklistOverflowMenu, TemplateOverflowMenu, ActionOverflowMenu } from "./hs-stampy-menus";
export { ChatHomeInput, ChatConversationInput, OccasionSuggestions } from "./hs-stampy-inputs";
export type { ChatHomeInputProps, ChatConversationInputProps, OccasionSuggestionsProps } from "./hs-stampy-inputs";
export { TadaBanner, ChatHomeScreen, ChatHeader } from "./hs-stampy-panels";
export type { ChatHomeScreenProps, ChatHeaderProps } from "./hs-stampy-panels";
