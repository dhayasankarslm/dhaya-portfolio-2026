"use client";

import { useRef, useState } from "react";
import gsap from "gsap";

export interface GooeyPillNavItem {
  label: string;
  href: string;
}

const PARTICLE_COLORS = ["var(--accent)", "var(--accent-2)", "#ffffff"];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

export default function GooeyPillNav({
  items,
  className = "",
  particleCount = 10,
}: {
  items: GooeyPillNavItem[];
  className?: string;
  particleCount?: number;
}) {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);
  const blobRef = useRef<HTMLSpanElement>(null);
  const goopRef = useRef<HTMLSpanElement>(null);

  const moveBlobTo = (el: HTMLElement) => {
    const list = listRef.current;
    const blob = blobRef.current;
    if (!list || !blob) return;

    const listRect = list.getBoundingClientRect();
    const rect = el.getBoundingClientRect();

    gsap.to(blob, {
      left: rect.left - listRect.left,
      top: rect.top - listRect.top,
      width: rect.width,
      height: rect.height,
      duration: 0.5,
      ease: "elastic.out(1, 0.7)",
    });
  };

  const burstParticles = () => {
    const blob = blobRef.current;
    const goop = goopRef.current;
    if (!blob || !goop) return;

    const cx = blob.offsetLeft + blob.offsetWidth / 2;
    const cy = blob.offsetTop + blob.offsetHeight / 2;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement("span");
      particle.className = "pointer-events-none absolute rounded-full";
      const size = randomBetween(4, 9);
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${cx}px`;
      particle.style.top = `${cy}px`;
      particle.style.background = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
      goop.appendChild(particle);

      const angle = (Math.PI * 2 * i) / particleCount + randomBetween(-0.3, 0.3);
      const dist = randomBetween(28, 60);

      gsap.fromTo(
        particle,
        { x: 0, y: 0, scale: 0, opacity: 1 },
        {
          x: Math.cos(angle) * dist,
          y: Math.sin(angle) * dist,
          scale: randomBetween(0.8, 1.4),
          opacity: 0,
          duration: randomBetween(0.5, 0.8),
          ease: "power2.out",
          onComplete: () => particle.remove(),
        }
      );
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, index: number) => {
    if (index === active) return;
    setActive(index);
    moveBlobTo(e.currentTarget);
    burstParticles();
  };

  return (
    <nav className={`relative ${className}`}>
      <svg className="absolute h-0 w-0" aria-hidden>
        <filter id="gooey-pill-filter">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
          />
        </filter>
      </svg>

      <ul ref={listRef} className="relative flex items-center gap-1 rounded-full border border-line p-1">
        <span
          ref={goopRef}
          className="pointer-events-none absolute inset-0 z-0"
          style={{ filter: "url(#gooey-pill-filter)" }}
        >
          <span
            ref={blobRef}
            className="absolute rounded-full bg-foreground"
            style={{ left: 0, top: 0, width: 0, height: 0 }}
          />
        </span>

        {items.map((item, i) => (
          <li key={item.href} className="relative z-10">
            <a
              href={item.href}
              onClick={(e) => handleClick(e, i)}
              ref={(el) => {
                if (el && i === 0 && active === 0 && blobRef.current?.style.width === "0px") {
                  requestAnimationFrame(() => moveBlobTo(el));
                }
              }}
              className={`block rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
                active === i ? "text-background" : "hover:text-accent"
              }`}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
