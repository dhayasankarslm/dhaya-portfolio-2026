"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Magnetic from "./Magnetic";
import ShinyText from "./ShinyText";
import TextType from "./TextType";
import FloatingIcons from "./FloatingIcons";

const TOOL_ICONS = [
  { src: "/media/icons/figma.png", alt: "Figma", top: "6%", left: "8%" },
  { src: "/media/icons/photoshop.png", alt: "Photoshop", top: "10%", left: "84%" },
  { src: "/media/icons/illustrator.png", alt: "Illustrator", top: "40%", left: "2%" },
  { src: "/media/icons/premiere.png", alt: "Premiere Pro", top: "38%", left: "92%" },
  { src: "/media/icons/lightroom.png", alt: "Lightroom", top: "72%", left: "10%" },
  { src: "/media/icons/davinci.png", alt: "DaVinci Resolve", top: "76%", left: "84%" },
];

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const badgeRefs = useRef<HTMLDivElement[]>([]);

  useGSAP(() => {
    if (!badgeRefs.current[0]) return;
    gsap.from(badgeRefs.current, {
      y: -20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out",
      scrollTrigger: { trigger: badgeRefs.current[0], start: "top 90%" },
    });
  }, []);

  return (
    <section className="relative flex flex-col items-center px-6 py-20 text-center md:py-28">
      <FloatingIcons icons={TOOL_ICONS} className="hidden md:block" />
      <div className="relative flex flex-wrap items-center justify-center gap-3 text-xs uppercase tracking-[0.15em] text-muted">
        {["Physics → Design", "M.A. UX @ BSBI Hamburg", "Open to opportunities"].map(
          (label, i) => (
            <div
              key={label}
              ref={(el) => {
                if (el) badgeRefs.current[i] = el;
              }}
              className="rounded-full border border-line px-4 py-1.5"
            >
              {label}
            </div>
          )
        )}
      </div>

      <p className="relative mt-6 max-w-lg text-lg">
        Design that&rsquo;s <ShinyText text="genuinely hard to forget" className="font-display" />
      </p>

      <TextType
        words={["UI/UX Designer", "Graphic Designer", "Brand Designer", "Sound Composer"]}
        className="relative mt-3 font-display text-sm uppercase tracking-[0.2em] text-accent"
      />

      <div className="mt-8 flex gap-4">
        <Magnetic>
          <a
            href="#contact"
            className="block rounded-full bg-foreground px-6 py-3 text-sm text-background hover:bg-accent transition-colors"
          >
            Get in touch
          </a>
        </Magnetic>
        <Magnetic strength={0.25}>
          <a
            href="#work"
            className="block rounded-full border border-line px-6 py-3 text-sm hover:border-foreground transition-colors"
          >
            See the work
          </a>
        </Magnetic>
      </div>
    </section>
  );
}
