"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export interface FloatIcon {
  src: string;
  alt: string;
  top: string;
  left: string;
  size?: number;
}

export default function FloatingIcons({
  icons,
  className = "",
}: {
  icons: FloatIcon[];
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".float-icon", containerRef.current!);
      items.forEach((el, i) => {
        const drift = () => {
          gsap.to(el, {
            x: gsap.utils.random(-60, 60),
            y: gsap.utils.random(-50, 50),
            rotate: gsap.utils.random(-12, 12),
            duration: gsap.utils.random(3.5, 6),
            ease: "sine.inOut",
            onComplete: drift,
          });
        };
        gsap.delayedCall(i * 0.25, drift);
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={`pointer-events-none absolute inset-0 ${className}`}>
      {icons.map((icon) => (
        <div
          key={icon.alt}
          className="float-icon absolute overflow-hidden rounded-2xl border border-line bg-background p-2 shadow-[0_15px_30px_-10px_rgba(0,0,0,0.3)]"
          style={{ top: icon.top, left: icon.left, width: icon.size ?? 56, height: icon.size ?? 56 }}
        >
          <Image src={icon.src} alt={icon.alt} fill className="object-contain p-1.5" sizes="56px" />
        </div>
      ))}
    </div>
  );
}
