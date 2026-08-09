import TiltReveal from "./TiltReveal";
import TiltedCard from "./TiltedCard";
import CountUp from "./CountUp";
import CircularText from "./CircularText";
import StickerPeel from "./StickerPeel";
import AnimatedList from "./AnimatedList";

const INTERESTS = ["UI/UX", "Coding", "Art", "Music", "Travel", "Photo"];

const TEXT =
  "Graphic Designer and UX Design student with experience co-running a creative startup and delivering design solutions for diverse clients. Combining a physics background with design expertise, I bring analytical thinking, creativity, and a user-centered approach to visual and digital experiences.";

export default function About() {
  return (
    <section id="about" className="relative border-t border-line px-6 py-24 md:px-10 md:py-32">
      <span className="mb-8 block text-xs uppercase tracking-[0.3em] text-muted">About</span>

      <div className="grid gap-12 md:grid-cols-[1fr_2fr_1fr]">
        <div className="relative w-full max-w-[220px]">
          <div
            className="absolute -inset-3 -z-10 rotate-[-4deg] rounded-[28px]"
            style={{ background: "var(--accent)" }}
            aria-hidden
          />
          <TiltedCard
            src="/media/profile.jpg"
            alt="Dhayasankar Vasudevan"
            className="aspect-[3/4] w-full rotate-[2deg] rounded-[24px] hard-border"
          />
          <StickerPeel
            src="/media/sticker.png"
            alt="Sticker"
            className="absolute -bottom-8 -right-8 w-20"
          />
          <CircularText
            text="UX DESIGNER · GRAPHIC DESIGNER · "
            className="absolute -left-10 -top-10 hidden h-28 w-28 md:block"
          />
        </div>

        <TiltReveal
          text={TEXT}
          as="p"
          className="font-display text-2xl leading-[1.15] uppercase md:text-4xl"
        />

        <div className="flex flex-col gap-8">
          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">
              Snapshot
            </span>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="font-display text-2xl md:text-3xl">
                  <CountUp value={20} suffix="+" />
                </div>
                <div className="text-xs text-muted">Short films scored</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl">
                  <CountUp value={3} />
                </div>
                <div className="text-xs text-muted">Ventures &amp; roles</div>
              </div>
              <div>
                <div className="font-display text-2xl md:text-3xl">
                  <CountUp value={3} />
                </div>
                <div className="text-xs text-muted">Languages spoken</div>
              </div>
            </div>
          </div>

          <div>
            <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted">
              Interests
            </span>
            <AnimatedList className="flex flex-wrap gap-2" itemClassName="inline-block">
              {INTERESTS.map((c) => (
                <span
                  key={c}
                  className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-[0.1em]"
                >
                  {c}
                </span>
              ))}
            </AnimatedList>
          </div>
        </div>
      </div>
    </section>
  );
}
