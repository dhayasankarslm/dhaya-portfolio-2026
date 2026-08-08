"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import Loader from "./Loader";
import InteractiveGrid from "./InteractiveGrid";

gsap.registerPlugin(ScrollTrigger);

export default function IntroReveal({ src }: { src: string }) {
  const [ready, setReady] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!ready) return;

      gsap.from(nameRef.current, {
        opacity: 0,
        scale: 0.85,
        duration: 0.9,
        ease: "back.out(1.6)",
      });
      gsap.from(subRef.current, { opacity: 0, y: 12, duration: 0.7, delay: 0.3, ease: "power2.out" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=125%",
          scrub: true,
          pin: true,
        },
      });

      tl.fromTo(nameRef.current, { scale: 1, opacity: 1 }, { scale: 0.7, opacity: 0, ease: "none" }, 0)
        .fromTo(subRef.current, { opacity: 1, y: 0 }, { opacity: 0, y: -20, ease: "none" }, 0)
        .to(
          frameRef.current,
          { width: "100vw", height: "100vh", borderRadius: 0, ease: "none" },
          0
        );
    },
    { scope: sectionRef, dependencies: [ready] }
  );

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-background"
    >
      {!ready && <Loader onComplete={() => setReady(true)} />}

      <InteractiveGrid spacing={44} dotSize={1.4} reach={150} className="z-0" />

      <div
        ref={nameRef}
        className="pointer-events-none absolute top-[14%] z-20 flex flex-col items-center gap-2 text-center"
      >
        <span className="font-display text-[9vw] leading-[0.9] uppercase md:text-[4.5vw]">
          Dhayasankar
        </span>
        <span className="text-xs uppercase tracking-[0.3em] text-muted">
          UX Designer &middot; Building bold digital experiences
        </span>
      </div>

      <div
        ref={frameRef}
        className="relative z-10 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.4)]"
        style={{ width: "34vw", height: "42vh", borderRadius: 28 }}
      >
        <video
          src={src}
          className="h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
      </div>

      <div ref={subRef} className="absolute bottom-10 z-20 flex flex-col items-center gap-4 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">Scroll to enter &darr;</span>
      </div>
    </section>
  );
}
