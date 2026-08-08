"use client";

import { useState } from "react";
import TiltReveal from "./TiltReveal";
import CircularGallery from "./CircularGallery";
import GradualBlur from "./GradualBlur";
import PhotoLightbox from "./PhotoLightbox";

const TOTAL_PHOTOS = 34;
const ALL_PHOTOS = Array.from(
  { length: TOTAL_PHOTOS },
  (_, i) => `/media/photography/photo-${String(i + 1).padStart(2, "0")}.jpg`
);

const FEATURED_INDEXES = [15, 9, 24, 25, 32, 2, 11, 29];
const FEATURED_ITEMS = FEATURED_INDEXES.map((n) => ({
  image: `/media/photography/photo-${String(n).padStart(2, "0")}.jpg`,
  title: `Shot ${String(n).padStart(2, "0")}`,
  description: "From the personal archive.",
}));

export default function Photography() {
  const [open, setOpen] = useState(false);

  return (
    <section id="photography" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">
        Off the clock
      </span>
      <TiltReveal
        as="h2"
        text="Also shooting, on a Sony a6400."
        className="font-display mb-12 max-w-2xl text-4xl uppercase leading-[1.05] md:text-6xl"
      />

      <div className="relative left-1/2 h-[420px] w-screen -translate-x-1/2 md:h-[480px]">
        <CircularGallery items={FEATURED_ITEMS} bend={2} />
        <GradualBlur position="left" height="4rem" strength={2} divCount={5} />
        <GradualBlur position="right" height="4rem" strength={2} divCount={5} />
      </div>
      <p className="mt-4 text-center text-xs uppercase tracking-[0.15em] text-muted">
        Drag to browse
      </p>

      <div className="mt-16 flex justify-center">
        <button
          onClick={() => setOpen(true)}
          className="rounded-full bg-foreground px-6 py-3 text-sm text-background hover:bg-accent transition-colors"
        >
          Explore all {TOTAL_PHOTOS} photos
        </button>
      </div>

      <PhotoLightbox photos={ALL_PHOTOS} open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
