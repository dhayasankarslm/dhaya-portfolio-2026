"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";

export default function ClickSpark({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const spark = (e: React.MouseEvent) => {
    const container = ref.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const cx = e.clientX - rect.left;
    const cy = e.clientY - rect.top;

    const count = 8;
    for (let i = 0; i < count; i++) {
      const dot = document.createElement("span");
      dot.style.position = "absolute";
      dot.style.left = `${cx}px`;
      dot.style.top = `${cy}px`;
      dot.style.width = "4px";
      dot.style.height = "4px";
      dot.style.borderRadius = "9999px";
      dot.style.background = "var(--accent)";
      dot.style.pointerEvents = "none";
      container.appendChild(dot);

      const angle = (Math.PI * 2 * i) / count;
      gsap.to(dot, {
        x: Math.cos(angle) * 60,
        y: Math.sin(angle) * 60,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
        onComplete: () => dot.remove(),
      });
    }
  };

  return (
    <div ref={ref} onClick={spark} className={`relative ${className}`}>
      {children}
    </div>
  );
}
