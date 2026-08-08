"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import RevealText from "./RevealText";
import WordCycle from "./WordCycle";
import GlowBorder from "./GlowBorder";
import SpotlightCard from "./SpotlightCard";

const CAPABILITIES = [
  {
    name: "UI/UX Design",
    tool: "Figma",
    summary: "User-centered interfaces, from research and wireframes to pixel-final screens.",
    items: ["User flows", "Wireframing", "Prototyping", "Design systems", "Usability thinking"],
  },
  {
    name: "Graphic & Brand Design",
    tool: "Illustrator · Photoshop",
    summary: "Visual identity systems built for real clients — logos, decks, merchandise, campaigns.",
    items: ["Brand identity", "Social creatives", "Sponsorship decks", "Merchandise", "Print & digital"],
  },
  {
    name: "Motion & Sound",
    tool: "Premiere Pro",
    summary: "Composed scores for 20+ short films and cut motion content for teams and brands.",
    items: ["Score composition", "Sound design", "Video editing", "Motion graphics"],
  },
];

export default function ServicesSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollStart = useRef(0);
  const [hovering, setHovering] = useState(false);
  const [dragging, setDragging] = useState(false);

  const moveCursor = useRef<((x: number, y: number) => void) | null>(null);

  useGSAP(() => {
    if (!cursorRef.current) return;
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50 });
    const x = gsap.quickTo(cursorRef.current, "x", { duration: 0.35, ease: "power3" });
    const y = gsap.quickTo(cursorRef.current, "y", { duration: 0.35, ease: "power3" });
    moveCursor.current = (nx, ny) => {
      x(nx);
      y(ny);
    };
  }, []);

  useGSAP(() => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, { scale: dragging ? 0.85 : 1, duration: 0.25, ease: "power2.out" });
  }, [dragging]);

  const onDown = (e: React.PointerEvent) => {
    isDown.current = true;
    setDragging(true);
    startX.current = e.clientX;
    scrollStart.current = trackRef.current?.scrollLeft ?? 0;
  };

  const onMove = (e: React.PointerEvent) => {
    moveCursor.current?.(e.clientX, e.clientY);
    if (!isDown.current || !trackRef.current) return;
    trackRef.current.scrollLeft = scrollStart.current - (e.clientX - startX.current);
  };

  const onUp = () => {
    isDown.current = false;
    setDragging(false);
  };

  return (
    <section id="services" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">
        <WordCycle words={["What I do", "How I help", "What I build"]} />
      </span>
      <RevealText
        text="Three disciplines, one brain."
        as="h2"
        className="font-display mb-4 max-w-md text-3xl uppercase leading-[1.05] md:text-5xl"
      />
      <span className="mb-10 block text-xs uppercase tracking-[0.2em] text-muted">
        Drag &harr; to explore
      </span>

      <div
        ref={trackRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={() => {
          onUp();
          setHovering(false);
        }}
        onPointerEnter={() => setHovering(true)}
        className="no-scrollbar relative left-1/2 flex w-screen -translate-x-1/2 gap-6 overflow-x-auto px-6 pb-4 cursor-none md:px-10"
      >
        {CAPABILITIES.map((s) => (
          <GlowBorder key={s.name} glowColor="61 107 94" borderRadius={16} className="h-[50vh] w-[85vw] shrink-0 md:w-[45vw]">
            <SpotlightCard
              glass={false}
              className="group flex h-full w-full flex-col justify-between !border-foreground/15 bg-foreground p-8 text-background md:p-12"
            >
              <div>
                <span className="text-xs uppercase tracking-[0.15em] text-accent">{s.tool}</span>
                <h3 className="font-display mt-4 text-3xl uppercase leading-tight md:text-5xl">
                  {s.name}
                </h3>
                <p className="mt-4 max-w-sm text-background/70">{s.summary}</p>
              </div>
              <ul className="flex flex-wrap gap-3">
                {s.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-full border border-background/25 px-4 py-2 text-xs uppercase tracking-[0.08em]"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </SpotlightCard>
          </GlowBorder>
        ))}
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-foreground text-[10px] uppercase tracking-[0.1em] text-background transition-opacity duration-200"
        style={{ opacity: hovering ? 1 : 0 }}
      >
        {dragging ? "Dragging" : "Drag"}
      </div>
    </section>
  );
}
