import LiquidText from "./LiquidText";

export default function Cta() {
  return (
    <section className="border-t border-line bg-foreground px-6 py-24 text-center text-background md:px-10 md:py-32">
      <span className="mb-4 block text-xs uppercase tracking-[0.3em] text-background/60">
        Let&rsquo;s talk
      </span>
      <LiquidText
        as="h2"
        text="Got a project or an opportunity?"
        className="font-display mx-auto flex max-w-3xl flex-wrap justify-center text-5xl uppercase leading-[1.05] md:text-7xl"
      />
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <a
          href="mailto:dhayasankarinslm@gmail.com"
          className="rounded-full bg-accent px-6 py-3 text-sm text-background hover:opacity-90 transition-opacity"
        >
          Email me
        </a>
        <a
          href="https://www.linkedin.com/in/dhayasankar/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-background/30 px-6 py-3 text-sm hover:border-background transition-colors"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
