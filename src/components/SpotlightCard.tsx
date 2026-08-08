"use client";

import { useRef, type ReactNode } from "react";

export default function SpotlightCard({
  children,
  className = "",
  glass = true,
}: {
  children: ReactNode;
  className?: string;
  glass?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden border ${
        glass
          ? "rounded-3xl border-white/40 bg-white/45 shadow-[0_8px_32px_rgba(31,25,20,0.1)] backdrop-blur-xl"
          : "rounded-2xl border-line"
      } ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--spot-x) var(--spot-y), color-mix(in srgb, var(--accent) 18%, transparent), transparent 70%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
