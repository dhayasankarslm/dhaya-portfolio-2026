"use client";

import { useEffect, useRef, useState } from "react";
import DepthCarousel from "./DepthCarousel";
import { loadSpotifyIframeApi } from "@/lib/spotifyIframeApi";

export interface PlayerTrack {
  id: string;
  title: string;
  image: string;
}

export default function MusicPlayer({
  tracks,
  className = "",
}: {
  tracks: PlayerTrack[];
  className?: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  useEffect(() => {
    if (controllerRef.current) return;
    let disposed = false;
    loadSpotifyIframeApi().then((IFrameAPI) => {
      if (disposed || !hostRef.current || controllerRef.current) return;
      IFrameAPI.createController(
        hostRef.current,
        { uri: `spotify:track:${tracks[0].id}`, width: "100%", height: "80" },
        (controller: any) => {
          if (disposed) {
            try {
              controller.destroy?.();
            } catch {}
            return;
          }
          controllerRef.current = controller;
          controller.addListener("playback_update", (e: any) => {
            setIsPaused(e.data.isPaused);
          });
        }
      );
    });
    return () => {
      disposed = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTrack = (index: number, autoplay: boolean) => {
    const track = tracks[index];
    controllerRef.current?.loadUri(`spotify:track:${track.id}`);
    if (autoplay) {
      setTimeout(() => controllerRef.current?.play(), 300);
    }
  };

  const handleChange = (index: number) => {
    setActive(index);
    loadTrack(index, !isPaused);
  };

  const step = (dir: 1 | -1) => {
    const next = (active + dir + tracks.length) % tracks.length;
    setActive(next);
    loadTrack(next, true);
  };

  const activeTrack = tracks[active];

  return (
    <div className={className}>
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <DepthCarousel
          items={tracks}
          active={active}
          onChange={handleChange}
          className="h-[280px] w-full md:h-[380px]"
        />

        <h3 className="font-display mt-8 text-center text-xl uppercase leading-tight md:text-2xl">
          {activeTrack.title}
        </h3>

        <div className="mt-6 flex items-center gap-4">
          <button
            onClick={() => step(-1)}
            aria-label="Previous track"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-foreground transition-colors"
          >
            ⏮
          </button>
          <div ref={hostRef} className="w-56 overflow-hidden rounded-xl [&_iframe]:block" />
          <button
            onClick={() => step(1)}
            aria-label="Next track"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line hover:border-foreground transition-colors"
          >
            ⏭
          </button>
        </div>

        <p className="mt-3 text-xs text-muted">Hit play above to listen — browsers require it directly on the widget.</p>
      </div>
    </div>
  );
}
