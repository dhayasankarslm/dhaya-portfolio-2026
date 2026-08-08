"use client";

import { useRef, type ReactNode } from "react";

export default function GlowBorder({
  children,
  className = "",
  glowColor = "201 84 47",
  borderRadius = 24,
}: {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  borderRadius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = x - cx;
    const dy = y - cy;
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;

    const edgeX = dx === 0 ? 1 : Math.min(1, Math.abs(cx / dx));
    const edgeY = dy === 0 ? 1 : Math.min(1, Math.abs(cy / dy));
    const proximity = Math.min(1, Math.max(0, 1 / Math.min(edgeX, edgeY)));

    el.style.setProperty("--glow-angle", `${angle}deg`);
    el.style.setProperty("--glow-proximity", `${proximity}`);
  };

  const onLeave = () => {
    ref.current?.style.setProperty("--glow-proximity", "0");
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`relative isolate ${className}`}
      style={
        {
          "--glow-color": glowColor,
          "--glow-angle": "45deg",
          "--glow-proximity": "0",
          borderRadius,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] transition-opacity duration-300"
        style={{
          opacity: "var(--glow-proximity)",
          padding: 1,
          background: `conic-gradient(from var(--glow-angle) at center, transparent 15%, rgb(var(--glow-color) / 0.9) 50%, transparent 85%)`,
          WebkitMask: "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-6 rounded-[inherit] blur-2xl transition-opacity duration-300"
        style={{
          opacity: "calc(var(--glow-proximity) * 0.5)",
          background: `conic-gradient(from var(--glow-angle) at center, transparent 20%, rgb(var(--glow-color) / 0.6) 50%, transparent 80%)`,
        }}
      />
      <div className="relative h-full">{children}</div>
    </div>
  );
}
