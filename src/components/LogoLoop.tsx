"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export interface LogoItem {
  src: string;
  alt: string;
  href?: string;
}

export default function LogoLoop({
  logos,
  speed = 60,
  direction = "left",
  logoHeight = 40,
  gap = 48,
  scaleOnHover = true,
  fadeOut = true,
  fadeOutColor = "var(--background)",
  mono = false,
}: {
  logos: LogoItem[];
  speed?: number;
  direction?: "left" | "right";
  logoHeight?: number;
  gap?: number;
  scaleOnHover?: boolean;
  fadeOut?: boolean;
  fadeOutColor?: string;
  mono?: boolean;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const speedRef = useRef(speed);
  const dirRef = useRef(direction === "left" ? -1 : 1);
  const pausedRef = useRef(false);

  speedRef.current = speed;
  dirRef.current = direction === "left" ? -1 : 1;

  useEffect(() => {
    let raf: number;
    let last = performance.now();

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;

      const setWidth = setRef.current?.getBoundingClientRect().width ?? 0;

      if (!pausedRef.current && setWidth > 0) {
        posRef.current += dirRef.current * speedRef.current * dt;

        if (posRef.current <= -setWidth) posRef.current += setWidth;
        if (posRef.current > 0) posRef.current -= setWidth;

        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  const boxWidth = logoHeight * 2.2;

  const renderSet = (setKey: string, ref?: React.Ref<HTMLDivElement>) => (
    <div ref={ref} className="flex shrink-0 items-center" style={{ gap }}>
      {logos.map((logo, i) => (
        <a
          key={`${setKey}-${logo.alt}-${i}`}
          href={logo.href ?? "#"}
          target={logo.href ? "_blank" : undefined}
          rel={logo.href ? "noopener noreferrer" : undefined}
          className={`flex shrink-0 items-center justify-center opacity-90 transition-all duration-500 ease-out hover:opacity-100 ${
            scaleOnHover ? "hover:scale-110" : ""
          }`}
          style={{
            width: boxWidth,
            height: logoHeight,
            ...(mono ? { filter: "grayscale(0.55) saturate(1.4) brightness(1.3)" } : {}),
          }}
        >
          <Image
            src={logo.src}
            alt={logo.alt}
            width={boxWidth}
            height={logoHeight}
            className="h-full w-full object-contain"
            sizes={`${boxWidth}px`}
            loading="lazy"
          />
        </a>
      ))}
    </div>
  );

  return (
    <div className="relative overflow-hidden" onMouseEnter={pause} onMouseLeave={resume}>
      <div ref={trackRef} className="flex w-max items-center will-change-transform" style={{ gap }}>
        {renderSet("a", setRef)}
        {renderSet("b")}
      </div>

      {fadeOut && (
        <>
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-28"
            style={{ background: `linear-gradient(to right, ${fadeOutColor}, transparent)` }}
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-28"
            style={{ background: `linear-gradient(to left, ${fadeOutColor}, transparent)` }}
          />
        </>
      )}
    </div>
  );
}
