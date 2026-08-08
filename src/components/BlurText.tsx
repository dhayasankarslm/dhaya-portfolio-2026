"use client";

import { useRef, createElement, type ElementType } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function BlurText({
  text,
  as: Tag = "p",
  className = "",
}: {
  text: string;
  as?: ElementType;
  className?: string;
}) {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const words = gsap.utils.toArray<HTMLElement>(".blur-word", containerRef.current!);
      gsap.fromTo(
        words,
        { opacity: 0, filter: "blur(10px)", y: 12 },
        {
          opacity: 1,
          filter: "blur(0px)",
          y: 0,
          duration: 0.6,
          stagger: 0.03,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return createElement(
    Tag,
    { ref: containerRef, className },
    text.split(" ").map((word, i) => (
      <span key={i} className="blur-word mr-[0.25em] inline-block">
        {word}
      </span>
    ))
  );
}
