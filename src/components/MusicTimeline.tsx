"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";

export interface TimelineTrack {
  id: string;
  title: string;
  image: string;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(Math.max(v, min), max);
}

export default function MusicTimeline({
  tracks,
  className = "",
  tickSpacing = 130,
}: {
  tracks: TimelineTrack[];
  className?: string;
  tickSpacing?: number;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const [active, setActive] = useState(0);

  const layout = useCallback(
    (pos: number) => {
      const track = trackRef.current;
      if (!track) return;
      track.style.transform = `translateX(${-pos * tickSpacing}px)`;

      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const d = Math.abs(i - pos);
        el.style.opacity = `${Math.max(0.2, 1 - d * 0.35)}`;
        el.style.transform = `scale(${Math.max(0.75, 1 - d * 0.12)})`;
      });
    },
    [tickSpacing]
  );

  useEffect(() => {
    layout(posRef.current);
  }, [layout, tracks.length]);

  const settleTo = useCallback(
    (index: number) => {
      const target = clamp(index, 0, tracks.length - 1);
      gsap.to(posRef, {
        current: target,
        duration: 0.55,
        ease: "power3.out",
        onUpdate: () => layout(posRef.current as unknown as number),
      });
      setActive(target);
    },
    [layout, tracks.length]
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let dragging = false;
    let startX = 0;
    let startPos = 0;

    const onDown = (e: PointerEvent) => {
      dragging = true;
      startX = e.clientX;
      startPos = posRef.current;
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      posRef.current = clamp(startPos - dx / tickSpacing, 0, tracks.length - 1);
      layout(posRef.current);
    };
    const onUp = () => {
      if (!dragging) return;
      dragging = false;
      settleTo(Math.round(posRef.current));
    };

    root.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      root.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [layout, settleTo, tickSpacing, tracks.length]);

  const activeTrack = tracks[active];

  return (
    <div className={className}>
      <div className="mb-8 flex flex-col items-center text-center">
        {activeTrack?.image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={activeTrack.image}
            alt={activeTrack.title}
            className="mb-6 h-40 w-40 rounded-2xl object-cover shadow-2xl md:h-52 md:w-52"
          />
        )}
        <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">Now playing</span>
        <h3 className="font-display text-3xl uppercase leading-tight md:text-5xl">
          {activeTrack?.title ?? ""}
        </h3>
        {activeTrack && (
          <a
            href={`https://open.spotify.com/track/${activeTrack.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block rounded-full border border-line px-5 py-2 text-xs uppercase tracking-[0.15em] hover:border-foreground transition-colors"
          >
            Open in Spotify ↗
          </a>
        )}
      </div>

      <div
        ref={rootRef}
        className="relative h-20 w-full touch-none cursor-grab overflow-hidden select-none active:cursor-grabbing"
      >
        <div className="pointer-events-none absolute top-1/2 left-0 right-0 h-px bg-line" />
        <div
          ref={trackRef}
          className="absolute top-1/2 left-1/2 flex -translate-y-1/2 items-center"
          style={{ gap: tickSpacing - 2 }}
        >
          {tracks.map((t, i) => (
            <button
              key={t.id}
              onClick={() => settleTo(i)}
              className="flex shrink-0 flex-col items-center gap-2 whitespace-nowrap"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={t.image}
                alt={t.title}
                className={`h-14 w-14 rounded-lg object-cover shadow-md ${
                  active === i ? "ring-2 ring-foreground" : ""
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
