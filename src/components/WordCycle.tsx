"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";

export default function WordCycle({
  words,
  className = "",
  interval = 2200,
}: {
  words: string[];
  className?: string;
  interval?: number;
}) {
  const [index, setIndex] = useState(0);
  const incomingRef = useRef<HTMLSpanElement>(null);
  const outgoingRef = useRef<HTMLSpanElement>(null);
  const prevIndex = useRef(0);

  useEffect(() => {
    const id = setInterval(() => {
      prevIndex.current = index;
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [index, interval, words.length]);

  useEffect(() => {
    if (outgoingRef.current) {
      gsap.fromTo(
        outgoingRef.current,
        { yPercent: 0, opacity: 1 },
        { yPercent: -100, opacity: 0, duration: 0.5, ease: "power3.inOut" }
      );
    }
    if (incomingRef.current) {
      gsap.fromTo(
        incomingRef.current,
        { yPercent: 100, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.inOut" }
      );
    }
  }, [index]);

  const outgoingWord = useMemo(() => words[prevIndex.current], [words, index]);
  const incomingWord = useMemo(() => words[index], [words, index]);
  const longestWord = useMemo(() => words.reduce((a, b) => (a.length > b.length ? a : b)), [words]);

  return (
    <span className={`relative inline-block overflow-hidden align-bottom ${className}`}>
      <span className="invisible">{longestWord}</span>
      <span ref={outgoingRef} className="absolute inset-0" aria-hidden>
        {outgoingWord}
      </span>
      <span ref={incomingRef} className="absolute inset-0">
        {incomingWord}
      </span>
    </span>
  );
}
