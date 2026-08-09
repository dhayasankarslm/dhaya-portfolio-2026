"use client";

import { useEffect, useMemo, useRef, createElement, type ElementType, type ForwardedRef } from "react";
import gsap from "gsap";

interface CharInProps {
  text: string;
  as?: ElementType;
  className?: string;
  splitBy?: "words" | "chars";
  stagger?: number;
}

export default function CharIn({
  text,
  as: Tag = "h2",
  className = "",
  splitBy = "words",
  stagger = 0.05,
}: CharInProps) {
  const containerRef = useRef<HTMLElement>(null);
  const played = useRef(false);

  const pieces = useMemo(
    () =>
      splitBy === "chars"
        ? text.split(" ").map((word, wi) => (
            <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
              {word.split("").map((ch, ci) => (
                <span key={ci} className="char-in inline-block">
                  {ch}
                </span>
              ))}
            </span>
          ))
        : text.split(" ").map((word, i) => (
            <span key={i} className="char-in mr-[0.25em] inline-block">
              {word}
            </span>
          )),
    [text, splitBy]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const targets = gsap.utils.toArray<HTMLElement>(".char-in", el);
    gsap.set(targets, { opacity: 0, y: 32 });

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !played.current) {
          played.current = true;
          gsap.to(targets, {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: "power3.out",
            stagger,
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, [text, splitBy, stagger]);

  return createElement(Tag, { ref: containerRef as ForwardedRef<HTMLElement>, className }, pieces);
}
