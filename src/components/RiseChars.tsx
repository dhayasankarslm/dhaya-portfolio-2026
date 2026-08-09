"use client";

import { useMemo, useRef, createElement, type ElementType, type ForwardedRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface RiseCharsProps {
  text: string;
  as?: ElementType;
  className?: string;
  stagger?: number;
}

export default function RiseChars({
  text,
  as: Tag = "h2",
  className = "",
  stagger = 0.025,
}: RiseCharsProps) {
  const containerRef = useRef<HTMLElement>(null);

  const chars = useMemo(
    () =>
      text.split("").map((ch, i) => (
        <span key={i} className="rise-char inline-block">
          {ch === " " ? " " : ch}
        </span>
      )),
    [text]
  );

  useGSAP(
    () => {
      const targets = gsap.utils.toArray<HTMLElement>(".rise-char", containerRef.current!);
      gsap.fromTo(
        targets,
        { opacity: 0, yPercent: 110, scaleY: 1.8, scaleX: 0.75, transformOrigin: "50% 100%" },
        {
          opacity: 1,
          yPercent: 0,
          scaleY: 1,
          scaleX: 1,
          ease: "none",
          stagger,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 90%",
            end: "bottom 60%",
            scrub: true,
          },
        }
      );
    },
    { scope: containerRef, dependencies: [text] }
  );

  return createElement(Tag, { ref: containerRef as ForwardedRef<HTMLElement>, className: `overflow-hidden ${className}` }, chars);
}
