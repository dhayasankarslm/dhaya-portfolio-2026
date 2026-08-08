"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function AnimatedList({
  children,
  className = "",
  itemClassName = "",
}: {
  children: ReactNode[];
  className?: string;
  itemClassName?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = gsap.utils.toArray<HTMLElement>(".animated-list-item", ref.current!);
      gsap.from(items, {
        opacity: 0,
        x: -24,
        duration: 0.6,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children.map((child, i) => (
        <div key={i} className={`animated-list-item ${itemClassName}`}>
          {child}
        </div>
      ))}
    </div>
  );
}
