"use client";

import { useState } from "react";

export interface PillNavItem {
  label: string;
  href: string;
}

export default function PillNav({ items }: { items: PillNavItem[] }) {
  const [active, setActive] = useState(items[0]?.href);

  return (
    <nav className="hidden items-center gap-1 rounded-full border border-line p-1 md:flex">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          onClick={() => setActive(item.href)}
          className={`rounded-full px-4 py-1.5 text-sm transition-colors duration-300 ${
            active === item.href
              ? "bg-foreground text-background"
              : "hover:bg-line/50"
          }`}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
