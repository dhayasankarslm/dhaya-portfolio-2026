"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Aurora({
  colorStops = ["#f0cf8f", "#dba9bb", "#8d76a8"],
  blend = 0.18,
  amplitude = 1.3,
  speed = 2.2,
  className = "",
}: {
  colorStops?: [string, string, string];
  blend?: number;
  amplitude?: number;
  speed?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const blobs = gsap.utils.toArray<HTMLElement>(".aurora-blob", containerRef.current!);

      blobs.forEach((blob, i) => {
        const drift = () => {
          gsap.to(blob, {
            x: gsap.utils.random(-200, 200) * amplitude,
            y: gsap.utils.random(-140, 140) * amplitude,
            scale: gsap.utils.random(0.85, 1.35),
            rotate: gsap.utils.random(-30, 30),
            duration: gsap.utils.random(1.6, 3) / speed,
            ease: "sine.inOut",
            onComplete: drift,
          });
        };
        gsap.delayedCall(i * 0.25, drift);
      });
    },
    { scope: containerRef, dependencies: [amplitude, speed] }
  );

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden ${className}`}
      style={{ opacity: blend }}
      aria-hidden
    >
      <div
        className="aurora-blob absolute -top-[20%] left-[8%] h-[55vw] w-[55vw] rounded-full blur-[130px] will-change-transform"
        style={{ background: colorStops[0], mixBlendMode: "multiply" }}
      />
      <div
        className="aurora-blob absolute top-[10%] right-[4%] h-[45vw] w-[45vw] rounded-full blur-[130px] will-change-transform"
        style={{ background: colorStops[1], mixBlendMode: "multiply" }}
      />
      <div
        className="aurora-blob absolute bottom-[-15%] left-[30%] h-[50vw] w-[50vw] rounded-full blur-[140px] will-change-transform"
        style={{ background: colorStops[2], mixBlendMode: "multiply" }}
      />
    </div>
  );
}
