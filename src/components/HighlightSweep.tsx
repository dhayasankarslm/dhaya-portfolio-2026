"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function HighlightSweep({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        barRef.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.7,
          ease: "power3.inOut",
          transformOrigin: "left",
          scrollTrigger: { trigger: wrapRef.current, start: "top 85%" },
        }
      );
    },
    { scope: wrapRef }
  );

  return (
    <span ref={wrapRef} className={`relative inline-block ${className}`}>
      <span
        ref={barRef}
        className="absolute inset-0 -z-10 origin-left bg-accent"
        style={{ transform: "scaleX(0)" }}
      />
      {children}
    </span>
  );
}
