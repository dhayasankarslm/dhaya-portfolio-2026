"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function FuzzyHover({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const onEnter = () => {
    const el = ref.current;
    if (!el) return;
    const tl = gsap.timeline();
    for (let i = 0; i < 4; i++) {
      tl.to(el, {
        x: gsap.utils.random(-2, 2),
        skewX: gsap.utils.random(-4, 4),
        duration: 0.04,
      });
    }
    tl.to(el, { x: 0, skewX: 0, duration: 0.1 });
  };

  return (
    <span ref={ref} onMouseEnter={onEnter} className={`inline-block ${className}`}>
      {children}
    </span>
  );
}
