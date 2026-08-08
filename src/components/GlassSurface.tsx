import type { ReactNode, CSSProperties } from "react";

export default function GlassSurface({
  children,
  borderRadius = 24,
  opacity = 0.55,
  brightness = 100,
  className = "",
  style = {},
}: {
  children: ReactNode;
  borderRadius?: number;
  opacity?: number;
  brightness?: number;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative overflow-hidden border border-white/40 shadow-[0_8px_32px_rgba(31,25,20,0.12)] backdrop-blur-xl ${className}`}
      style={{
        borderRadius,
        background: `rgba(255,255,255,${opacity})`,
        filter: brightness !== 100 ? `brightness(${brightness}%)` : undefined,
        ...style,
      }}
    >
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 70%, rgba(255,255,255,0.25) 100%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
