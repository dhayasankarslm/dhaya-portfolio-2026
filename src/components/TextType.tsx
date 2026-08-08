"use client";

import { useEffect, useRef, useState } from "react";

export default function TextType({
  words,
  className = "",
  typingSpeed = 35,
  deletingSpeed = 22,
  pause = 1100,
}: {
  words: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pause?: number;
}) {
  const [display, setDisplay] = useState("");
  const wordIndex = useRef(0);
  const charIndex = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = words[wordIndex.current];

      if (!deleting.current) {
        charIndex.current++;
        setDisplay(current.slice(0, charIndex.current));

        if (charIndex.current === current.length) {
          deleting.current = true;
          timeoutId = setTimeout(tick, pause);
          return;
        }
        timeoutId = setTimeout(tick, typingSpeed);
      } else {
        charIndex.current--;
        setDisplay(current.slice(0, charIndex.current));

        if (charIndex.current === 0) {
          deleting.current = false;
          wordIndex.current = (wordIndex.current + 1) % words.length;
          timeoutId = setTimeout(tick, typingSpeed);
          return;
        }
        timeoutId = setTimeout(tick, deletingSpeed);
      }
    };

    timeoutId = setTimeout(tick, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [words, typingSpeed, deletingSpeed, pause]);

  return (
    <span className={className}>
      {display}
      <span className="animate-pulse">|</span>
    </span>
  );
}
