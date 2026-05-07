import { useEffect, useState } from "react";
import { animate } from "motion/react";

/** Shared spring-ease curve used across all HS animated components. */
export const EASE = [0.16, 1, 0.3, 1] as const;

interface AnimatedCountProps {
  value: number;
  delay?: number;
  /** Optional formatter — e.g. n => n >= 1000 ? `${(n/1000).toFixed(1)}k` : `${n}` */
  format?: (n: number) => string;
}

/** Counts up from 0 to `value` with a spring ease, optionally formatted. */
export function AnimatedCount({ value, delay = 0, format }: AnimatedCountProps) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let controls: { stop: () => void } | null = null;
    const timer = setTimeout(() => {
      controls = animate(0, value, {
        duration: 1.4,
        ease: EASE,
        onUpdate: (v) => setDisplay(Math.round(v)),
      });
    }, delay * 1000);
    return () => {
      clearTimeout(timer);
      controls?.stop();
    };
  }, [value, delay]);

  return <>{format ? format(display) : display}</>;
}
