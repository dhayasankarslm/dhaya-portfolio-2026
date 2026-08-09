"use client";

import { useEffect, useMemo, useRef, createElement, type ElementType, type ForwardedRef } from "react";

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

interface LiquidTextProps {
  text: string;
  as?: ElementType;
  className?: string;
  radius?: number;
  maxSkew?: number;
  maxScale?: number;
}

export default function LiquidText({
  text,
  as: Tag = "h2",
  className = "",
  radius = 220,
  maxSkew = 14,
  maxScale = 1.35,
}: LiquidTextProps) {
  const containerRef = useRef<HTMLElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef({ x: -9999, y: -9999 });

  const letters = useMemo(() => {
    let idx = 0;
    return text.split(" ").map((word, wi) => (
      <span key={wi} className="mr-[0.25em] inline-block whitespace-nowrap">
        {word.split("").map((ch) => {
          const i = idx++;
          return (
            <span
              key={i}
              ref={(node) => {
                letterRefs.current[i] = node;
              }}
              className="inline-block will-change-transform"
            >
              {ch}
            </span>
          );
        })}
      </span>
    ));
  }, [text]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    const onLeave = () => {
      pointer.current.x = -9999;
      pointer.current.y = -9999;
    };
    window.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);

    let raf: number;
    const tick = () => {
      letterRefs.current.forEach((span, i) => {
        if (!span) return;
        const rect = span.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.current.x - cx;
        const dy = pointer.current.y - cy;
        const dist = Math.hypot(dx, dy);
        const proximity = Math.max(0, 1 - dist / radius);
        const dir = dx === 0 ? 1 : dx > 0 ? -1 : 1;
        const skew = lerp(0, maxSkew * dir, proximity);
        const scale = lerp(1, maxScale, proximity);
        const lift = lerp(0, -14, proximity);

        span.style.transform = `translateY(${lift}px) scale(${scale}) skewX(${skew}deg)`;
        span.style.textShadow = proximity > 0.05 ? `${dir * proximity * 4}px 0 var(--accent-2, #3d6b5e)` : "none";
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [radius, maxSkew, maxScale, text]);

  return createElement(Tag, { ref: containerRef as ForwardedRef<HTMLElement>, className }, letters);
}
