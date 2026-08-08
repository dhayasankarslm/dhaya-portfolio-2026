"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function TextLoop({
  text,
  separator = "✦",
  speed = 90,
  direction = "forward",
  curviness = 90,
  fontSize = 46,
  color = "#ffffff",
  ribbonColor = "var(--accent)",
  ribbonWidth = 120,
  pauseOnHover = true,
}: {
  text: string;
  separator?: string;
  speed?: number;
  direction?: "forward" | "reverse";
  curviness?: number;
  fontSize?: number;
  color?: string;
  ribbonColor?: string;
  ribbonWidth?: number;
  pauseOnHover?: boolean;
}) {
  const pathRef = useRef<SVGTextPathElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    if (!pathRef.current) return;
    const dir = direction === "forward" ? -1 : 1;
    tweenRef.current = gsap.to(pathRef.current, {
      attr: { startOffset: `${dir * 100}%` },
      duration: 6000 / speed,
      ease: "none",
      repeat: -1,
    });
  }, [speed, direction]);

  const pause = () => pauseOnHover && tweenRef.current?.timeScale(0.1);
  const resume = () => pauseOnHover && tweenRef.current?.timeScale(1);

  const repeated = `${text} ${separator} `.repeat(8);
  const midY = ribbonWidth / 2;
  const maxAmp = Math.max(midY - fontSize / 2 - 12, 4);
  const amp = Math.min(curviness / 10, maxAmp);

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ background: ribbonColor, height: ribbonWidth }}
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <svg
        viewBox={`0 0 1600 ${ribbonWidth}`}
        className="h-full w-full"
        preserveAspectRatio="none"
      >
        <defs>
          <path
            id="wave-path"
            d={`M -800,${midY} Q -400,${midY - amp} 0,${midY} T 800,${midY} T 1600,${midY} T 2400,${midY}`}
            fill="none"
          />
        </defs>
        <text
          fill={color}
          fontSize={fontSize}
          fontWeight={800}
          letterSpacing={2}
          dominantBaseline="middle"
          style={{ textTransform: "uppercase", fontFamily: "var(--font-display), sans-serif" }}
        >
          <textPath ref={pathRef} href="#wave-path" startOffset="0%">
            {repeated}
          </textPath>
        </text>
      </svg>
    </div>
  );
}
