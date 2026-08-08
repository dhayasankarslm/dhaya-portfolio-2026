"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export interface GalleryItem {
  image: string;
  title: string;
}

const TILE_W = 190;
const SPACING = TILE_W + 24;

export default function CircularGallery({
  items,
  bend = 2,
}: {
  items: GalleryItem[];
  bend?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<HTMLDivElement[]>([]);
  const offset = useRef(0);
  const velocity = useRef(0);
  const isDown = useRef(false);
  const startX = useRef(0);
  const startOffset = useRef(0);
  const [repeat, setRepeat] = useState(2);

  const tiles = Array.from({ length: repeat * items.length }, (_, i) => ({
    key: `${items[i % items.length].title}-${i}`,
    item: items[i % items.length],
  }));

  const layout = () => {
    const track = trackRef.current;
    if (!track) return;
    const width = track.clientWidth;
    const total = SPACING * tiles.length;

    tileRefs.current.forEach((tile, i) => {
      if (!tile) return;
      const center = width / 2;
      const raw = i * SPACING + offset.current;
      const wrapped = ((raw % total) + total) % total;
      const x = wrapped - SPACING;
      const distFromCenter = (x + TILE_W / 2 - center) / center;
      const curveY = Math.pow(distFromCenter, 2) * bend * 40;
      const rotate = distFromCenter * bend * 6;
      const scale = 1 - Math.min(Math.abs(distFromCenter), 1) * 0.15;

      gsap.set(tile, {
        x,
        y: curveY,
        rotate,
        scale,
        opacity: 1 - Math.min(Math.abs(distFromCenter), 1) * 0.3,
      });
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const recalc = () => {
      const width = track.clientWidth;
      const needed = Math.ceil((width * 1.6) / (SPACING * items.length)) + 1;
      setRepeat(Math.max(2, needed));
    };
    recalc();
    const ro = new ResizeObserver(recalc);
    ro.observe(track);
    return () => ro.disconnect();
  }, [items.length]);

  useEffect(() => {
    let raf: number;
    const tick = () => {
      if (!isDown.current) {
        offset.current -= velocity.current;
        velocity.current *= 0.94;
        if (!isDown.current && Math.abs(velocity.current) < 0.05) {
          velocity.current -= 0.3;
        }
      }
      layout();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tiles.length, bend]);

  const onDown = (e: React.PointerEvent) => {
    isDown.current = true;
    startX.current = e.clientX;
    startOffset.current = offset.current;
    velocity.current = 0;
  };

  const onMove = (e: React.PointerEvent) => {
    if (!isDown.current) return;
    const dx = e.clientX - startX.current;
    offset.current = startOffset.current + dx;
    velocity.current = -dx * 0.02;
  };

  const onUp = () => {
    isDown.current = false;
  };

  return (
    <div
      ref={trackRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      className="relative h-full w-full cursor-grab touch-none select-none overflow-hidden active:cursor-grabbing"
    >
      {tiles.map(({ key, item }, i) => (
        <div
          key={key}
          ref={(el) => {
            if (el) tileRefs.current[i] = el;
          }}
          className="absolute top-1/2 h-[340px] w-[190px] -translate-y-1/2 overflow-hidden rounded-2xl shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)]"
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            draggable={false}
            className="pointer-events-none object-cover"
            sizes="190px"
          />
        </div>
      ))}
    </div>
  );
}
