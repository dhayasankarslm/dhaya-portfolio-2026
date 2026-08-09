"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface TextPressureProps {
  text: string;
  className?: string;
  minFontSize?: number;
  minWeight?: number;
  maxWeight?: number;
  minWidth?: number;
  maxWidth?: number;
}

function lerp(current: number, target: number, ease: number) {
  return current + (target - current) * ease;
}

function falloff(distance: number, maxDistance: number, floor: number, ceiling: number) {
  const t = Math.min(1, distance / maxDistance);
  return ceiling - (ceiling - floor) * t;
}

export default function TextPressure({
  text,
  className = "",
  minFontSize = 40,
  minWeight = 100,
  maxWeight = 900,
  minWidth = 70,
  maxWidth = 125,
}: TextPressureProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef({ x: 0, y: 0 });
  const eased = useRef({ x: 0, y: 0 });

  const [fontSize, setFontSize] = useState(minFontSize);
  const letters = text.split("");

  const fitToWidth = useCallback(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    if (!wrap || !line) return;
    const wrapWidth = wrap.getBoundingClientRect().width;
    if (wrapWidth <= 0) return;

    // measure at the current (rest-state, min-width) rendering and scale
    // exactly to fit — avoids guessing at per-character width ratios
    const lineWidth = line.scrollWidth || line.getBoundingClientRect().width;
    if (lineWidth <= 0) return;
    const currentSize = parseFloat(getComputedStyle(line).fontSize) || minFontSize;
    const fitted = (wrapWidth / lineWidth) * currentSize * 0.98;
    setFontSize(Math.max(minFontSize, fitted));
  }, [minFontSize]);

  useEffect(() => {
    const raf = requestAnimationFrame(fitToWidth);
    const onResize = () => fitToWidth();
    window.addEventListener("resize", onResize);

    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    fontsReady?.then(fitToWidth);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, [fitToWidth]);

  useEffect(() => {
    // start the "cursor" far away so the text rests at its compact, min-width
    // state until actually hovered — not maximally expanded (which overflows)
    pointer.current = { x: -9999, y: -9999 };
    eased.current = { x: -9999, y: -9999 };

    const onPointer = (e: PointerEvent) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
    };
    window.addEventListener("pointermove", onPointer);
    return () => window.removeEventListener("pointermove", onPointer);
  }, []);

  useEffect(() => {
    let raf: number;

    const frame = () => {
      eased.current.x = lerp(eased.current.x, pointer.current.x, 0.12);
      eased.current.y = lerp(eased.current.y, pointer.current.y, 0.12);

      const line = lineRef.current;
      if (line) {
        const maxDistance = line.getBoundingClientRect().width / 2;

        letterRefs.current.forEach((span) => {
          if (!span) return;
          const r = span.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const d = Math.hypot(eased.current.x - cx, eased.current.y - cy);

          const wght = Math.round(falloff(d, maxDistance, maxWeight, minWeight));
          const wdth = Math.round(falloff(d, maxDistance, maxWidth, minWidth));

          span.style.fontVariationSettings = `'wght' ${wght}, 'wdth' ${wdth}`;
        });
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [minWeight, maxWeight, minWidth, maxWidth]);

  return (
    <div ref={wrapRef} className={`w-full ${className}`}>
      <div
        ref={lineRef}
        className="inline-flex flex-nowrap justify-start"
        style={{
          fontFamily: "'Roboto Flex', sans-serif",
          fontSize,
          lineHeight: 0.85,
        }}
      >
        {letters.map((ch, i) => (
          <span
            key={i}
            ref={(node) => {
              letterRefs.current[i] = node;
            }}
            className="inline-block"
          >
            {ch}
          </span>
        ))}
      </div>
    </div>
  );
}
