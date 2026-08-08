"use client";

import { useRef, type ReactNode } from "react";

export default function GlareHover({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    el.style.setProperty("--glare-x", `${x}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group relative overflow-hidden ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(75deg, transparent 30%, color-mix(in srgb, white 25%, transparent) 50%, transparent 70%)",
          backgroundPosition: "var(--glare-x, 50%) 0",
          backgroundSize: "250% 100%",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
