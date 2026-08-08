"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface DepthCarouselItem {
  image: string;
  title?: string;
}

function wrapDelta(d: number, n: number) {
  let x = ((d % n) + n) % n;
  if (x > n / 2) x -= n;
  return x;
}

export default function DepthCarousel({
  items,
  className = "",
  cardWidth = 200,
  cardHeight = 200,
  spread = 64,
  depth = 150,
  tilt = 16,
  visibleCards = 3,
  loop = true,
  active,
  onChange,
}: {
  items: DepthCarouselItem[];
  className?: string;
  cardWidth?: number;
  cardHeight?: number;
  spread?: number;
  depth?: number;
  tilt?: number;
  visibleCards?: number;
  loop?: boolean;
  active: number;
  onChange: (index: number) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const posRef = useRef(active);
  const n = items.length;

  const layout = useCallback(
    (pos: number) => {
      items.forEach((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return;
        const d = loop ? wrapDelta(i - pos, n) : i - pos;
        const ad = Math.abs(d);
        const shown = ad <= visibleCards + 0.5;

        const tx = d * spread;
        const tz = -ad * depth;
        const ry = Math.max(-tilt * 2, Math.min(tilt * 2, -d * tilt));
        const scale = Math.max(0.5, 1 - ad * 0.14);
        const opacity = shown ? Math.max(0, 1 - ad * 0.32) : 0;
        const brightness = Math.max(0.35, 1 - ad * 0.22);
        const blurPx = Math.min(6, ad * 2.2);

        el.style.transform = `translate(-50%, -50%) translateX(${tx}px) translateZ(${tz}px) rotateY(${ry}deg) scale(${scale})`;
        el.style.opacity = `${opacity}`;
        el.style.filter = `brightness(${brightness}) blur(${blurPx}px)`;
        el.style.zIndex = `${1000 - Math.round(ad * 10)}`;
        el.style.pointerEvents = shown ? "auto" : "none";
      });
    },
    [items, n, spread, depth, tilt, visibleCards, loop]
  );

  useEffect(() => {
    layout(posRef.current);
  }, [layout]);

  const settleTo = useCallback(
    (index: number) => {
      const target = loop ? ((index % n) + n) % n : Math.max(0, Math.min(index, n - 1));
      const delta = loop ? wrapDelta(target - posRef.current, n) : target - posRef.current;
      gsap.to(posRef, {
        current: posRef.current + delta,
        duration: 0.55,
        ease: "power3.out",
        onUpdate: () => layout(posRef.current as unknown as number),
        onComplete: () => {
          if (loop) posRef.current = ((posRef.current % n) + n) % n;
        },
      });
      onChange(target);
    },
    [layout, loop, n, onChange]
  );

  useEffect(() => {
    if (Math.round(posRef.current) !== active) settleTo(active);
  }, [active, settleTo]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let dragging = false;
    let startX = 0;
    let startPos = 0;
    let moved = false;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      moved = false;
      startX = e.clientX;
      startPos = posRef.current;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 4) moved = true;
      posRef.current = startPos - dx / (cardWidth * 0.7);
      layout(posRef.current);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      if (moved) settleTo(Math.round(posRef.current));
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [cardWidth, layout, settleTo]);

  return (
    <div
      ref={rootRef}
      className={`relative flex touch-none cursor-grab items-center justify-center select-none active:cursor-grabbing ${className}`}
      style={{ perspective: 1200 }}
    >
      <div className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
        {items.map((item, i) => (
          <div
            key={item.image + i}
            ref={(node) => {
              cardRefs.current[i] = node;
            }}
            onClick={() => (i === active ? undefined : settleTo(i))}
            className="absolute top-1/2 left-1/2 overflow-hidden rounded-2xl shadow-xl"
            style={{ width: cardWidth, height: cardHeight }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title ?? ""} className="h-full w-full object-cover" draggable={false} />
          </div>
        ))}
      </div>

      <button
        onClick={() => settleTo(active - 1)}
        aria-label="Previous"
        className="absolute left-2 z-[1001] flex h-9 w-9 items-center justify-center rounded-full border border-line bg-background/80 backdrop-blur transition-colors hover:border-foreground"
      >
        ‹
      </button>
      <button
        onClick={() => settleTo(active + 1)}
        aria-label="Next"
        className="absolute right-2 z-[1001] flex h-9 w-9 items-center justify-center rounded-full border border-line bg-background/80 backdrop-blur transition-colors hover:border-foreground"
      >
        ›
      </button>

      <div className="absolute bottom-2 left-1/2 z-[1001] flex -translate-x-1/2 gap-2">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => settleTo(i)}
            className={`h-1.5 rounded-full transition-all ${
              active === i ? "w-5 bg-foreground" : "w-1.5 bg-foreground/30"
            }`}
            aria-label={`Go to ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
