"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export interface BubbleItem {
  label: string;
  href: string;
  rotation?: number;
  bg?: string;
}

export default function BubbleMenu({ items }: { items: BubbleItem[] }) {
  const [open, setOpen] = useState(false);
  const [closePos, setClosePos] = useState<{ top: number; left: number } | null>(null);
  const CLOSE_BTN_SIZE = 44;
  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useGSAP(
    () => {
      if (!overlayRef.current) return;

      if (open) {
        gsap.set(overlayRef.current, { display: "flex" });
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          bubblesRef.current ? bubblesRef.current.children : [],
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.1,
            ease: "back.out(1.5)",
          }
        );
      } else if (overlayRef.current.style.display === "flex") {
        gsap.to(overlayRef.current, {
          opacity: 0,
          duration: 0.25,
          ease: "power2.in",
          onComplete: () => gsap.set(overlayRef.current, { display: "none" }),
        });
      }
    },
    { dependencies: [open] }
  );

  return (
    <>
      <button
        ref={triggerRef}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          setClosePos({
            top: rect.top + rect.height / 2 - CLOSE_BTN_SIZE / 2,
            left: rect.left + rect.width / 2 - CLOSE_BTN_SIZE / 2,
          });
          setOpen((o) => !o);
        }}
        className="flex items-center gap-2 text-sm"
        aria-expanded={open}
        aria-label="Toggle menu"
      >
        <span className="relative flex h-3 w-6 flex-col justify-between">
          <span
            className={`block h-px w-full bg-current transition-transform duration-300 ${
              open ? "translate-y-[6px] rotate-45" : ""
            }`}
          />
          <span
            className={`block h-px w-full bg-current transition-transform duration-300 ${
              open ? "-translate-y-[6px] -rotate-45" : ""
            }`}
          />
        </span>
        {open ? "Close" : "Menu"}
      </button>

      {open &&
        mounted &&
        createPortal(
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="fixed z-50 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-background/80 text-lg backdrop-blur-sm transition-colors hover:border-foreground"
            style={closePos ? { top: closePos.top, left: closePos.left } : { top: 24, left: 24 }}
          >
            &times;
          </button>,
          document.body
        )}

      <div
        ref={overlayRef}
        className="fixed inset-0 z-40 hidden flex-col items-center justify-center gap-5 bg-background/95 backdrop-blur-sm"
        style={{ opacity: 0 }}
      >
        <div ref={bubblesRef} className="flex flex-wrap items-center justify-center gap-4 px-6">
          {items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="font-display flex h-24 w-24 items-center justify-center rounded-full border border-line text-center text-sm uppercase transition-colors duration-300 hover:text-background md:h-32 md:w-32 md:text-base"
              style={{ transform: `rotate(${item.rotation ?? 0}deg)` }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = item.bg ?? "var(--accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
              }}
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}
