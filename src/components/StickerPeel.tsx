"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function StickerPeel({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const onDown = () => {
    setDragging(true);
    gsap.to(ref.current, { scale: 1.08, rotate: "+=6", duration: 0.3, ease: "power2.out" });
  };

  const onMove = (e: React.MouseEvent) => {
    if (!dragging || !ref.current) return;
    gsap.to(ref.current, {
      x: `+=${e.movementX}`,
      y: `+=${e.movementY}`,
      duration: 0.2,
      ease: "power1.out",
    });
  };

  const onUp = () => {
    setDragging(false);
    gsap.to(ref.current, {
      scale: 1,
      rotate: 0,
      x: 0,
      y: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.35)",
    });
  };

  return (
    <div
      ref={ref}
      onMouseDown={onDown}
      onMouseMove={onMove}
      onMouseUp={onUp}
      onMouseLeave={() => dragging && onUp()}
      className={`cursor-grab select-none active:cursor-grabbing ${className}`}
      style={{ touchAction: "none" }}
    >
      <Image src={src} alt={alt} width={140} height={140} className="pointer-events-none w-full drop-shadow-xl" draggable={false} />
    </div>
  );
}
