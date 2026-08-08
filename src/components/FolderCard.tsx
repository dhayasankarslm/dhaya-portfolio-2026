"use client";

import { useState } from "react";

function shade(hex: string, amount: number): string {
  const clean = hex.replace("#", "");
  const num = parseInt(clean, 16);
  const clamp = (v: number) => Math.max(0, Math.min(255, v));
  const r = clamp(Math.floor(((num >> 16) & 0xff) * (1 - amount)));
  const g = clamp(Math.floor(((num >> 8) & 0xff) * (1 - amount)));
  const b = clamp(Math.floor((num & 0xff) * (1 - amount)));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

const PAPER_STYLES = [
  { width: "70%", height: "80%", rest: "translate(-50%, 10%)", open: "translate(-125%, -65%) rotate(-14deg)" },
  { width: "80%", height: "70%", rest: "translate(-50%, 10%)", open: "translate(8%, -65%) rotate(12deg)" },
  { width: "90%", height: "60%", rest: "translate(-50%, 10%)", open: "translate(-50%, -95%) rotate(4deg)" },
];

export default function FolderCard({
  label,
  items,
  color = "#c9542f",
  className = "",
  onActivate,
}: {
  label: string;
  items: string[];
  color?: string;
  className?: string;
  onActivate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const backColor = shade(color, 0.15);
  const papers = items.slice(0, 3);

  return (
    <button
      type="button"
      onClick={() => {
        setOpen((o) => !o);
        onActivate?.();
      }}
      aria-expanded={open}
      className={`group relative block h-32 w-full text-left ${className}`}
      style={{ transform: open ? "translateY(-6px)" : undefined, transition: "transform 0.25s ease" }}
    >
      <div
        className="relative mx-auto h-20 w-28 rounded-tr-[10px] rounded-bl-[10px] rounded-br-[10px]"
        style={{ background: backColor }}
      >
        <span
          className="absolute bottom-full left-0 h-2.5 w-8 rounded-t-[5px]"
          style={{ background: backColor }}
        />

        {papers.map((item, i) => {
          const p = PAPER_STYLES[i];
          return (
            <div
              key={item}
              className="absolute bottom-[10%] left-1/2 z-10 flex items-center justify-center rounded-[10px] px-1 text-center text-[9px] font-medium uppercase tracking-[0.04em] text-foreground/70 shadow-sm"
              style={{
                width: p.width,
                height: p.height,
                background: i === 2 ? "#ffffff" : shade("#ffffff", 0.05 * (2 - i)),
                transform: open ? p.open : p.rest,
                transition: "transform 0.35s cubic-bezier(0.34, 1.2, 0.4, 1)",
              }}
            >
              {item}
            </div>
          );
        })}

        <div
          className="absolute inset-0 z-20 origin-bottom rounded-tr-[6px] rounded-bl-[10px] rounded-br-[10px]"
          style={{
            background: color,
            transform: open ? "skewX(12deg) scaleY(0.6)" : undefined,
            transition: "transform 0.3s ease",
          }}
        />
        <div
          className="absolute inset-0 z-20 origin-bottom rounded-tr-[6px] rounded-bl-[10px] rounded-br-[10px]"
          style={{
            background: color,
            transform: open ? "skewX(-12deg) scaleY(0.6)" : undefined,
            transition: "transform 0.3s ease",
          }}
        />
      </div>

      <span className="mt-4 block text-center text-xs uppercase tracking-[0.15em] text-muted">{label}</span>
    </button>
  );
}
