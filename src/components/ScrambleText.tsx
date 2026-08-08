"use client";

import { useRef, type ReactNode } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ScrambleText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const frame = useRef<number | null>(null);

  const onEnter = () => {
    const el = ref.current;
    if (!el) return;
    let iteration = 0;

    const tick = () => {
      el.textContent = text
        .split("")
        .map((char, i) => {
          if (char === " ") return " ";
          if (i < iteration) return text[i];
          return CHARS[Math.floor(Math.random() * CHARS.length)];
        })
        .join("");

      if (iteration >= text.length) {
        if (frame.current) cancelAnimationFrame(frame.current);
        return;
      }
      iteration += 1 / 2;
      frame.current = requestAnimationFrame(tick);
    };

    tick();
  };

  return (
    <span ref={ref} onMouseEnter={onEnter} className={`inline-block ${className}`}>
      {text}
    </span>
  );
}
