"use client";

import { useEffect } from "react";
import gsap from "gsap";

export default function PlaylistModal({
  open,
  onClose,
  title,
  playlistId,
  type = "playlist",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  playlistId: string | null;
  type?: "playlist" | "track";
}) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    gsap.fromTo(".playlist-overlay", { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" });
    gsap.fromTo(
      ".playlist-panel",
      { opacity: 0, y: 24, scale: 0.97 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "power3.out" }
    );
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open || !playlistId) return null;

  return (
    <div
      className="playlist-overlay fixed inset-0 z-[90] flex items-center justify-center bg-foreground/70 px-6 backdrop-blur-sm"
      data-lenis-prevent
      onClick={onClose}
    >
      <div
        className="playlist-panel w-full max-w-lg rounded-2xl bg-background p-4 shadow-2xl md:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <span className="font-display text-lg uppercase tracking-tight">{title}</span>
          <button
            onClick={onClose}
            className="rounded-full border border-line px-4 py-1.5 text-xs uppercase tracking-[0.15em] hover:border-foreground transition-colors"
          >
            Close
          </button>
        </div>
        <iframe
          title={title}
          src={`https://open.spotify.com/embed/${type}/${playlistId}?utm_source=generator&theme=0`}
          width="100%"
          height={type === "track" ? 152 : 480}
          style={{ borderRadius: 12, border: 0 }}
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      </div>
    </div>
  );
}
