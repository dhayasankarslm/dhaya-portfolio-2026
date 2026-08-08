import CircularText from "./CircularText";
import GlareHover from "./GlareHover";
import TextPressure from "./TextPressure";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-foreground px-6 py-10 text-background md:px-10 md:py-12">
      <CircularText
        text="LET'S TALK · LET'S TALK · "
        className="absolute right-6 top-6 hidden h-24 w-24 opacity-60 md:block"
      />
      <div className="mb-8 flex flex-col items-start justify-between gap-6 border-b border-background/15 pb-8 md:flex-row md:items-end">
        <h2 className="font-display max-w-lg text-2xl uppercase leading-tight md:text-4xl">
          Let&rsquo;s build something worth remembering.
        </h2>
        <GlareHover className="rounded-full">
          <a
            href="mailto:dhayasankarinslm@gmail.com"
            className="block rounded-full bg-accent px-6 py-3 text-sm hover:opacity-90 transition-opacity"
          >
            Say hello
          </a>
        </GlareHover>
      </div>

      <div className="grid gap-10 text-sm md:grid-cols-4">
        <div>
          <div className="font-display mb-3 uppercase">Site</div>
          <div className="flex flex-col gap-2 text-background/70">
            <a href="#about" className="hover:text-background transition-colors">About</a>
            <a href="#experience" className="hover:text-background transition-colors">Experience</a>
            <a href="#work" className="hover:text-background transition-colors">Work</a>
            <a href="#skills" className="hover:text-background transition-colors">Skills</a>
          </div>
        </div>
        <div>
          <div className="font-display mb-3 uppercase">Contact</div>
          <div className="flex flex-col gap-2 text-background/70">
            <a href="mailto:dhayasankarinslm@gmail.com" className="hover:text-background transition-colors">Email</a>
            <a href="https://dhayasankar.in" target="_blank" rel="noopener noreferrer" className="hover:text-background transition-colors">dhayasankar.in</a>
          </div>
        </div>
        <div>
          <div className="font-display mb-3 uppercase">Connect</div>
          <div className="flex flex-col gap-2 text-background/70">
            <a href="#" className="hover:text-background transition-colors">Instagram</a>
            <a href="#" className="hover:text-background transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-background/15 pt-6 text-xs uppercase tracking-[0.1em] text-background/50">
        <span>&copy; {new Date().getFullYear()} Dhayasankar Vasudevan</span>
        <span>Hamburg, Germany</span>
      </div>

      <TextPressure text="DHAYASANKAR" className="mt-6 uppercase text-background" />
    </footer>
  );
}
