"use client";

import { useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";

export default function PhotoLightbox({
  photos,
  open,
  onClose,
}: {
  photos: string[];
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    gsap.fromTo(".lightbox-overlay", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out" });
    gsap.fromTo(
      ".lightbox-item",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5, stagger: 0.02, ease: "power2.out" }
    );
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="lightbox-overlay fixed inset-0 z-[90] overflow-y-auto overscroll-contain bg-background"
      data-lenis-prevent
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-background px-6 py-4 md:px-10">
        <span className="text-xs uppercase tracking-[0.2em] text-muted">
          {photos.length} photos
        </span>
        <button
          onClick={onClose}
          className="rounded-full border border-line px-4 py-2 text-xs uppercase tracking-[0.15em] hover:border-foreground transition-colors"
        >
          Close
        </button>
      </div>

      <div className="columns-2 gap-4 p-6 md:columns-3 md:p-10">
        {photos.map((src, i) => (
          <div key={src} className="lightbox-item mb-4 break-inside-avoid overflow-hidden rounded-xl">
            <Image
              src={src}
              alt={`Photography ${i + 1}`}
              width={600}
              height={600}
              className="h-auto w-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
