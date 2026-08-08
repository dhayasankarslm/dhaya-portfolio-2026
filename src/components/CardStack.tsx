"use client";

import { useState, type ReactNode } from "react";

export default function CardStack({ cards }: { cards: ReactNode[] }) {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % cards.length);
  const prev = () => setIndex((i) => (i - 1 + cards.length) % cards.length);

  return (
    <div className="relative mx-auto max-w-lg">
      <div className="relative h-[280px]">
        {cards.map((card, i) => {
          const offset = (i - index + cards.length) % cards.length;
          if (offset > 2) return null;
          return (
            <div
              key={i}
              className="absolute inset-0 transition-all duration-500"
              style={{
                zIndex: cards.length - offset,
                transform: `translateY(${offset * 10}px) scale(${1 - offset * 0.05})`,
                opacity: offset === 0 ? 1 : 0.5,
              }}
            >
              {card}
            </div>
          );
        })}
      </div>
      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={prev}
          className="rounded-full border border-line px-4 py-2 text-sm hover:border-foreground transition-colors"
        >
          &larr;
        </button>
        <button
          onClick={next}
          className="rounded-full border border-line px-4 py-2 text-sm hover:border-foreground transition-colors"
        >
          &rarr;
        </button>
      </div>
    </div>
  );
}
