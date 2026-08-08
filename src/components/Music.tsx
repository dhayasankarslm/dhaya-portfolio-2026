"use client";

import { useEffect, useState } from "react";
import RevealText from "./RevealText";
import MusicPlayer from "./MusicPlayer";

const TRACK_IDS = [
  "1MsBRSbt5dqJSw3RxXtvCM",
  "0pQskrTITgmCMyr85tb9qq",
  "4rDbp1vnvEhieiccprPMdI",
  "73CKjW3vsUXRpy3NnX4H7F",
  "3z8h0TU7ReDPLIbEnYhWZb",
  "5T8EDUDqKcs6OSOwEsfqG7",
  "1kvq7ksGQWSyRysYYNd6lu",
  "6Jv7kjGkhY2fT4yuBF3aTz",
  "6KEWtSOGKpIXGw6l1uJgsR",
  "41sGGCCoHI2GLV9qadX80A",
];

interface Track {
  id: string;
  title: string;
  image: string;
}

export default function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all(
      TRACK_IDS.map(async (id) => {
        try {
          const res = await fetch(
            `https://open.spotify.com/oembed?url=https://open.spotify.com/track/${id}`
          );
          const data = await res.json();
          return { id, title: data.title as string, image: data.thumbnail_url as string };
        } catch {
          return { id, title: "", image: "" };
        }
      })
    ).then((results) => {
      if (!cancelled) setTracks(results.filter((t) => t.title));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="music" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">On repeat</span>
      <RevealText
        as="h2"
        text="A few songs I keep coming back to."
        className="font-display mb-12 max-w-2xl text-4xl uppercase leading-[1.05] md:text-6xl"
      />

      {tracks.length > 0 && <MusicPlayer tracks={tracks} />}
    </section>
  );
}
