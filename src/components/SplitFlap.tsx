"use client";

import { useEffect, useRef, useState } from "react";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+.·";

function FlapChar({ target, delay }: { target: string; delay: number }) {
  const [current, setCurrent] = useState(target);

  useEffect(() => {
    let frame = 0;
    const totalFrames = 10;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        frame++;
        if (frame >= totalFrames) {
          setCurrent(target);
          clearInterval(interval);
          return;
        }
        setCurrent(CHARS[Math.floor(Math.random() * CHARS.length)]);
      }, 45);
    }, delay);

    return () => clearTimeout(timer);
  }, [target, delay]);

  return (
    <span className="inline-block w-[0.62em] text-center font-mono tabular-nums">
      {current}
    </span>
  );
}

export default function SplitFlap({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  return (
    <span className={className}>
      {text.split("").map((c, i) => (
        <FlapChar key={i} target={c} delay={i * 60} />
      ))}
    </span>
  );
}
