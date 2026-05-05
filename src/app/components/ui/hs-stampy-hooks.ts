// ═══════════════════════════════════════════════════════════════════════════
// StampyChatbot — Custom hooks (typewriter animations)
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from "react";

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useTypewriter(prompts: string[]) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  const stateRef = useRef({
    promptIndex: 0,
    charIndex: 0,
    phase: "typing" as "typing" | "pause" | "deleting" | "wait",
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const promptsRef = useRef(prompts);

  useEffect(() => { promptsRef.current = prompts; }, [prompts]);

  useEffect(() => {
    function tick() {
      const s = stateRef.current;
      const prompts = promptsRef.current;
      const prompt = prompts[s.promptIndex];

      if (s.phase === "typing") {
        if (s.charIndex < prompt.length) {
          s.charIndex += 1;
          setDisplayText(prompt.slice(0, s.charIndex));
          setIsTyping(true);
          const delay = Math.random() < 0.08 ? 120 + Math.random() * 80 : 28 + Math.random() * 35;
          timeoutRef.current = setTimeout(tick, delay);
        } else {
          setIsTyping(false);
          s.phase = "deleting";
          timeoutRef.current = setTimeout(tick, 2200 + Math.random() * 800);
        }
      } else if (s.phase === "deleting") {
        if (s.charIndex > 0) {
          s.charIndex -= 1;
          setDisplayText(prompt.slice(0, s.charIndex));
          timeoutRef.current = setTimeout(tick, 14 + Math.random() * 18);
        } else {
          s.phase = "wait";
          timeoutRef.current = setTimeout(tick, 400 + Math.random() * 300);
        }
      } else if (s.phase === "wait") {
        const current = s.promptIndex;
        let next = current;
        while (next === current) { next = Math.floor(Math.random() * prompts.length); }
        s.promptIndex = next;
        s.charIndex = 0;
        s.phase = "typing";
        setIsTyping(true);
        timeoutRef.current = setTimeout(tick, 300);
      }
    }
    timeoutRef.current = setTimeout(tick, 500);
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  return { displayText, isTyping };
}

export function useBubbleTypewriter(text: string | null) {
  const [displayed, setDisplayed] = useState("");
  const [isDone, setIsDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const charRef = useRef(0);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!text) { setDisplayed(""); setIsDone(false); charRef.current = 0; return; }
    charRef.current = 0;
    setDisplayed("");
    setIsDone(false);

    function tick() {
      charRef.current += 1;
      setDisplayed(text!.slice(0, charRef.current));
      if (charRef.current < text!.length) {
        const delay = Math.random() < 0.06 ? 80 + Math.random() * 60 : 14 + Math.random() * 20;
        timerRef.current = setTimeout(tick, delay);
      } else {
        setIsDone(true);
      }
    }
    timerRef.current = setTimeout(tick, 30);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [text]);

  return { displayed, isDone };
}
