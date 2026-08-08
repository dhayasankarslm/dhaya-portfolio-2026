"use client";

import { useRef } from "react";
import gsap from "gsap";
import RevealText from "./RevealText";
import ClickSpark from "./ClickSpark";

export default function PlayfulButton() {
  const btnRef = useRef<HTMLButtonElement>(null);

  const poke = () => {
    if (!btnRef.current) return;
    gsap.fromTo(
      btnRef.current,
      { rotate: -15, scale: 1.15 },
      { rotate: 0, scale: 1, duration: 0.8, ease: "elastic.out(1, 0.3)" }
    );
  };

  return (
    <section className="flex flex-col items-center gap-6 border-t border-line bg-foreground px-6 py-24 text-center text-background md:py-32">
      <RevealText
        as="h2"
        text="This button does absolutely nothing"
        dim={0.3}
        className="font-display max-w-lg text-3xl uppercase leading-[1.05] md:text-5xl"
      />
      <p className="text-sm text-background/60">Poke it anyway.</p>
      <ClickSpark>
        <button
          ref={btnRef}
          onClick={poke}
          className="rounded-full border border-background/25 px-8 py-4 text-sm hover:border-accent hover:text-accent transition-colors"
        >
          Poke it
        </button>
      </ClickSpark>
    </section>
  );
}
