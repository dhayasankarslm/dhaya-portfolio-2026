"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Marquee({
  text,
  speed = 40,
  bg = "var(--foreground)",
  fg = "var(--background)",
  border = true,
}: {
  text: string;
  speed?: number;
  bg?: string;
  fg?: string;
  border?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!trackRef.current) return;
    const track = trackRef.current;
    const width = track.scrollWidth / 2;

    gsap.to(track, {
      x: -width,
      duration: width / speed,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const items = new Array(8).fill(text);

  return (
    <div
      className={`overflow-hidden py-4 ${border ? "border-y border-line" : ""}`}
      style={{ background: bg, color: fg }}
    >
      <div ref={trackRef} className="marquee-track">
        {[...items, ...items].map((t, i) => (
          <span
            key={i}
            className="mx-6 flex items-center gap-6 whitespace-nowrap text-sm uppercase tracking-[0.15em]"
          >
            {t}
            <span className="text-accent">&middot;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
