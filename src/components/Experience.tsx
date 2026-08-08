import CharIn from "./CharIn";
import AnimatedList from "./AnimatedList";
import SpotlightCard from "./SpotlightCard";

const ROLES = [
  {
    company: "D Magic Studios",
    role: "Founder & Creative Director",
    time: "2023–2026",
    body: "Co-founded and led a creative design studio delivering branding, digital, and marketing design solutions for diverse clients — directing visual identity systems, social media campaigns, and client projects from concept to execution.",
  },
  {
    company: "PY Robotics",
    role: "Design Head",
    time: "2024–now",
    body: "Lead all visual and communication design for a competitive robotics team in international tournaments — branding systems, sponsorship decks, merchandise, and digital content, contributing to the team's championship success at Battle of Robots, 2025.",
  },
  {
    company: "VDS Designs",
    role: "Freelance Graphic Designer",
    time: "2023",
    body: "Delivered freelance design services including logos, brand identity, social media creatives, and UI concepts for individual clients — managing end-to-end project delivery across diverse industries.",
  },
  {
    company: "Music Composer",
    role: "Freelance",
    time: "2021–2023",
    body: "Composed original music for 20+ short films and 2 feature/silver screen films, including award-winning projects under Kaliyuman Creations — delivering background scores, themes, and sound design aligned with narrative storytelling.",
  },
];

export default function Experience() {
  return (
    <section id="experience" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">
        Experience
      </span>
      <CharIn
        as="h2"
        text="Design, robotics, and a little music."
        className="font-display mb-12 max-w-2xl text-4xl uppercase leading-[1.05] md:text-6xl"
      />

      <AnimatedList className="grid gap-6 md:grid-cols-2" itemClassName="h-full">
        {ROLES.map((r, i) => (
          <SpotlightCard key={r.company} className="relative flex h-full flex-col gap-4 bg-background p-6 md:p-8">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl uppercase leading-tight md:text-3xl">
                {r.company}
              </h3>
              <span className="whitespace-nowrap text-xs text-muted">{r.time}</span>
            </div>
            <span
              className="text-xs uppercase tracking-[0.15em]"
              style={{ color: i % 2 === 0 ? "var(--accent)" : "var(--accent-2)" }}
            >
              {r.role}
            </span>
            <p className="text-sm leading-relaxed text-muted">{r.body}</p>
          </SpotlightCard>
        ))}
      </AnimatedList>
    </section>
  );
}
