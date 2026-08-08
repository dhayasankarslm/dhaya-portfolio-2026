import RiseChars from "./RiseChars";
import AnimatedList from "./AnimatedList";

const DESIGN_TOOLS = ["Premiere Pro", "Figma", "Illustrator", "Photoshop", "Procreate"];
const CODE = ["Python", "HTML", "CSS", "JavaScript", "C#"];
const LANGUAGES = ["Tamil — native", "English — fluent", "German — A1"];

const EDUCATION = [
  {
    school: "Berlin School of Business & Innovation",
    detail: "M.A. User Experience Design",
    time: "2025–now",
  },
  {
    school: "PSG College of Arts & Science",
    detail: "B.Sc Physics",
    time: "2021–2023",
  },
];

export default function SkillsEducation() {
  return (
    <section id="skills" className="border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-2 block text-xs uppercase tracking-[0.3em] text-muted">
        Skills &amp; Education
      </span>
      <RiseChars
        as="h2"
        text="Tools I reach for, and where I learned them."
        className="font-display mb-12 max-w-2xl text-4xl uppercase leading-[1.05] md:text-6xl"
      />

      <div className="grid gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-8">
          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">Design</span>
            <AnimatedList className="flex flex-wrap gap-2">
              {DESIGN_TOOLS.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-[0.08em]">
                  {t}
                </span>
              ))}
            </AnimatedList>
          </div>
          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">Code</span>
            <AnimatedList className="flex flex-wrap gap-2">
              {CODE.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-[0.08em]">
                  {t}
                </span>
              ))}
            </AnimatedList>
          </div>
          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">Languages</span>
            <AnimatedList className="flex flex-wrap gap-2">
              {LANGUAGES.map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1.5 text-xs uppercase tracking-[0.08em]">
                  {t}
                </span>
              ))}
            </AnimatedList>
          </div>
        </div>

        <AnimatedList className="flex flex-col">
          {EDUCATION.map((e) => (
            <div key={e.school} className="flex items-baseline justify-between gap-4 border-t border-line py-5 last:border-b">
              <div>
                <div className="font-display text-lg uppercase md:text-xl">{e.school}</div>
                <div className="text-sm text-muted">{e.detail}</div>
              </div>
              <span className="whitespace-nowrap text-xs text-muted">{e.time}</span>
            </div>
          ))}
        </AnimatedList>
      </div>
    </section>
  );
}
