"use client";

import Image from "next/image";
import GooeyPillNav from "./GooeyPillNav";
import BubbleMenu from "./BubbleMenu";

const LINKS = [
  { label: "About", href: "#about" },
  { label: "Work", href: "#work" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Photos", href: "#photography" },
  { label: "Contact", href: "#contact" },
];

const BUBBLE_ITEMS = [
  { label: "About", href: "#about", rotation: -8, bg: "#c9542f" },
  { label: "Work", href: "#work", rotation: 6, bg: "#b7c4b1" },
  { label: "Experience", href: "#experience", rotation: -5, bg: "#a89b86" },
  { label: "Skills", href: "#skills", rotation: 8, bg: "#d8cdb8" },
  { label: "Photos", href: "#photography", rotation: -6, bg: "#c9542f" },
  { label: "Contact", href: "#contact", rotation: 5, bg: "#b7c4b1" },
];

export default function Nav() {
  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex items-center justify-between rounded-full border border-white/40 bg-white/50 px-6 py-3 shadow-[0_8px_32px_rgba(31,25,20,0.1)] backdrop-blur-xl md:top-5 md:left-10 md:right-10 md:px-8">
      <a href="#top" className="flex items-center gap-2">
        <Image src="/media/logo.png" alt="Logo" width={28} height={28} className="h-7 w-auto" />
        <span className="font-display text-lg font-semibold">Dhayasankar.</span>
      </a>

      <GooeyPillNav items={LINKS} className="hidden md:block" />

      <BubbleMenu items={BUBBLE_ITEMS} />
    </header>
  );
}
