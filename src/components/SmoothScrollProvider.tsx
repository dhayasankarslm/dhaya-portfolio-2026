"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const refresh = () => {
      lenis.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("load", refresh);
    const fontsReady = (document as Document & { fonts?: FontFaceSet }).fonts?.ready;
    fontsReady?.then(refresh);
    const timer = setTimeout(refresh, 500);

    // late-loading content (images, iframes, dynamically-sized galleries) can
    // grow the page after Lenis's initial measurement — keep it in sync
    const resizeObserver = new ResizeObserver(() => lenis.resize());
    resizeObserver.observe(document.body);

    return () => {
      window.removeEventListener("load", refresh);
      clearTimeout(timer);
      resizeObserver.disconnect();
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
