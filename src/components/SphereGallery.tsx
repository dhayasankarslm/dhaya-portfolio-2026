"use client";

import { useEffect, useMemo, useRef } from "react";
import Image from "next/image";

export interface SphereGalleryItem {
  image: string;
  title?: string;
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));

export default function SphereGallery({
  items,
  className = "",
  radius = 200,
  tileSize = 92,
}: {
  items: SphereGalleryItem[];
  className?: string;
  radius?: number;
  tileSize?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rot = useRef({ x: -0.15, y: 0 });
  const velocity = useRef({ x: 0, y: 0.0018 });
  const dragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  const basePositions = useMemo(
    () =>
      items.map((_, i) => {
        const n = items.length;
        const y = n > 1 ? 1 - (i / (n - 1)) * 2 : 0;
        const r = Math.sqrt(Math.max(0, 1 - y * y));
        const theta = GOLDEN_ANGLE * i;
        return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
      }),
    [items]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf: number;

    const draw = () => {
      if (!dragging.current) {
        rot.current.y += velocity.current.y;
        rot.current.x += velocity.current.x;
        velocity.current.x *= 0.94;
        rot.current.x = Math.max(-1.1, Math.min(1.1, rot.current.x));
      }

      const cosY = Math.cos(rot.current.y);
      const sinY = Math.sin(rot.current.y);
      const cosX = Math.cos(rot.current.x);
      const sinX = Math.sin(rot.current.x);

      basePositions.forEach((p, i) => {
        const tile = tileRefs.current[i];
        if (!tile) return;

        const x1 = p.x * cosY + p.z * sinY;
        const z1 = -p.x * sinY + p.z * cosY;
        const y1 = p.y;

        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;
        const x2 = x1;

        const depth = (z2 + 1) / 2;
        const scale = 0.55 + depth * 0.65;
        const opacity = 0.25 + depth * 0.75;

        tile.style.transform = `translate3d(${x2 * radius}px, ${y2 * radius}px, ${z2 * radius}px) scale(${scale})`;
        tile.style.opacity = `${opacity}`;
        tile.style.zIndex = `${Math.round(depth * 1000)}`;
      });

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [basePositions, radius]);

  const onDown = (e: React.PointerEvent) => {
    dragging.current = true;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPointer.current.x;
    const dy = e.clientY - lastPointer.current.y;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    rot.current.y += dx * 0.006;
    rot.current.x += dy * 0.006;
    velocity.current.y = dx * 0.0009;
    velocity.current.x = 0;
  };

  const onUp = () => {
    dragging.current = false;
    if (Math.abs(velocity.current.y) < 0.0012) velocity.current.y = 0.0018;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      className={`relative flex cursor-grab items-center justify-center touch-none select-none active:cursor-grabbing ${className}`}
      style={{ perspective: "900px" }}
    >
      {items.map((item, i) => (
        <div
          key={item.image + i}
          ref={(node) => {
            tileRefs.current[i] = node;
          }}
          className="pointer-events-none absolute overflow-hidden rounded-xl shadow-lg"
          style={{ width: tileSize, height: tileSize, marginLeft: -tileSize / 2, marginTop: -tileSize / 2 }}
        >
          <Image src={item.image} alt={item.title ?? ""} fill sizes="100px" className="object-cover" />
        </div>
      ))}
    </div>
  );
}
