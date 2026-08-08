import RiseChars from "./RiseChars";
import SpotlightCard from "./SpotlightCard";
import GlowBorder from "./GlowBorder";

const PROJECTS = [
  { name: "Loopzen", tag: "Product · UI/UX", color: "#c9542f" },
  { name: "BSBI — Rebranding Project, Hamburg", tag: "Brand Identity", color: "#b7c4b1" },
  { name: "Py Robotics", tag: "Branding · Sponsorship", color: "#a89b86" },
  { name: "Bhunidhi", tag: "Product · Brand", color: "#d8cdb8" },
];

export default function Projects() {
  return (
    <section id="work" className="bg-foreground px-6 py-24 text-background md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-background/50">
        Featured Projects
      </span>
      <RiseChars
        as="h2"
        text="Here's a selection of projects that showcase my passion for design and development, reflecting creativity and innovation."
        className="font-display mb-12 max-w-3xl text-3xl uppercase leading-[1.15] md:text-5xl"
      />

      <div className="grid gap-6 md:grid-cols-2">
        {PROJECTS.map((p, i) => (
          <GlowBorder key={p.name} glowColor="201 84 47" borderRadius={16} className="h-full">
            <SpotlightCard
              glass={false}
              className="group h-full !border-background/15 bg-background/[0.03] p-6 md:p-8"
            >
              <div
                className="mb-6 flex h-44 w-full items-end rounded-xl p-4 transition-transform duration-500 group-hover:scale-[1.02] md:h-52"
                style={{ background: p.color }}
              >
                <span className="text-xs uppercase tracking-[0.15em] text-foreground/70">
                  Cover for {p.name}
                </span>
              </div>
              <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
                {p.name}
              </h3>
              <span
                className="mt-1 block text-xs uppercase tracking-[0.15em]"
                style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--accent-2)" }}
              >
                {p.tag}
              </span>
            </SpotlightCard>
          </GlowBorder>
        ))}
      </div>

      <div className="mt-12 flex justify-center">
        <a
          href="#contact"
          className="rounded-full border border-background/30 px-6 py-3 text-sm hover:border-background transition-colors"
        >
          Explore More
        </a>
      </div>
    </section>
  );
}
