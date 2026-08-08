"use client";

import { useRef, createElement, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function RevealText({
  text,
  as: Tag = "p",
  className = "",
  dim = 0.15,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  dim?: number;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".reveal-word", containerRef.current!);
      gsap.to(words, {
        opacity: 1,
        stagger: 0.04,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 85%",
          end: "bottom 55%",
          scrub: true,
        },
      });
    },
    { scope: containerRef }
  );

  return createElement(
    Tag,
    { ref: containerRef, className },
    text.split(" ").map((word, i) => (
      <span key={i} className="reveal-word mr-[0.25em] inline-block" style={{ opacity: dim }}>
        {word}
      </span>
    ))
  );
}
