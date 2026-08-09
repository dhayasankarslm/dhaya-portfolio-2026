"use client";

import { useMemo, useRef, createElement, type ElementType, type ForwardedRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface TiltRevealProps {
  text: string;
  as?: ElementType;
  className?: string;
  startRotation?: number;
  blur?: number;
  dim?: number;
}

export default function TiltReveal({
  text,
  as: Tag = "p",
  className = "",
  startRotation = 4,
  blur = 5,
  dim = 0.12,
}: TiltRevealProps) {
  const containerRef = useRef<HTMLElement>(null);

  const words = useMemo(
    () =>
      text.split(" ").map((word, i) => (
        <span key={i} className="tilt-word mr-[0.28em] inline-block">
          {word}
        </span>
      )),
    [text]
  );

  useGSAP(
    () => {
      const el = containerRef.current;
      if (!el) return;

      gsap.fromTo(
        el,
        { rotate: startRotation, transformOrigin: "0% 50%" },
        {
          rotate: 0,
          ease: "none",
          scrollTrigger: { trigger: el, start: "top 95%", end: "bottom 65%", scrub: true },
        }
      );

      const targets = gsap.utils.toArray<HTMLElement>(".tilt-word", el);
      gsap.fromTo(
        targets,
        { opacity: dim, filter: `blur(${blur}px)` },
        {
          opacity: 1,
          filter: "blur(0px)",
          ease: "none",
          stagger: 0.04,
          scrollTrigger: { trigger: el, start: "top 88%", end: "bottom 60%", scrub: true },
        }
      );
    },
    { scope: containerRef, dependencies: [text] }
  );

  return createElement(Tag, { ref: containerRef as ForwardedRef<HTMLElement>, className }, words);
}
