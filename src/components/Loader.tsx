"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Loader({ onComplete }: { onComplete: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const counter = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        onComplete();
      },
    });

    tl.from(nameRef.current, { opacity: 0, y: 12, duration: 0.5, ease: "power2.out" })
      .to(
        counter,
        {
          val: 100,
          duration: 1.4,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) countRef.current.textContent = String(Math.floor(counter.val));
            if (barRef.current) barRef.current.style.width = `${counter.val}%`;
          },
        },
        "-=0.1"
      )
      .to(overlayRef.current, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=0.15");

    return () => {
      document.body.style.overflow = "";
    };
  }, [onComplete]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background"
    >
      <div ref={nameRef} className="font-display text-lg uppercase tracking-[0.2em]">
        Dhayasankar Vasudevan
      </div>
      <div className="flex items-baseline gap-1 font-display text-6xl">
        <span ref={countRef}>0</span>
        <span className="text-lg">%</span>
      </div>
      <div className="h-px w-40 overflow-hidden bg-line">
        <div ref={barRef} className="h-full bg-accent" style={{ width: "0%" }} />
      </div>
    </div>
  );
}
