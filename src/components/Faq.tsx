"use client";

import { useState } from "react";
import CharIn from "./CharIn";
import FuzzyHover from "./FuzzyHover";

const FAQS = [
  {
    q: "Are you available for freelance work?",
    a: "Yes — currently open to freelance and part-time design work alongside my M.A. in Hamburg.",
  },
  {
    q: "What kind of projects do you take on?",
    a: "Mostly UI/UX and brand identity work, plus the occasional motion or sound design project when the timeline allows.",
  },
  {
    q: "Where are you based?",
    a: "Studying in Hamburg, Germany — happy to work remotely with teams anywhere.",
  },
  {
    q: "What tools do you actually use day to day?",
    a: "Figma for product work, Illustrator and Photoshop for brand and print, Premiere Pro for anything that moves or makes sound.",
  },
  {
    q: "Do you take on non-design work too?",
    a: "Occasionally — I still compose music and dabble in front-end code when a project calls for it.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">FAQ</span>
      <CharIn
        as="h2"
        text="Questions, answered."
        splitBy="chars"
        className="font-display mb-12 max-w-2xl text-4xl uppercase leading-[1.05] md:text-6xl"
      />

      <div className="mx-auto max-w-2xl">
        {FAQS.map((item, i) => (
          <div key={item.q} className="border-t border-line last:border-b">
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <FuzzyHover className="font-display text-lg uppercase md:text-xl">{item.q}</FuzzyHover>
              <span className={`text-xl transition-transform duration-300 ${openIndex === i ? "rotate-45" : ""}`}>
                +
              </span>
            </button>
            <div
              className="grid overflow-hidden transition-all duration-300"
              style={{ gridTemplateRows: openIndex === i ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="pb-5 text-sm text-muted">{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
