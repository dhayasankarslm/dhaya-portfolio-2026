import LogoLoop, { type LogoItem } from "./LogoLoop";

const LOGOS: LogoItem[] = [
  { src: "/media/logos/loopzen.png", alt: "Loopzen" },
  { src: "/media/logos/bsbi.png", alt: "BSBI" },
  { src: "/media/logos/py-robotics.png", alt: "PY Robotics" },
  { src: "/media/logos/club.png", alt: "Club" },
  { src: "/media/logos/ic.png", alt: "IC" },
  { src: "/media/logos/roshan-vlogs.png", alt: "Roshan Vlogs" },
  { src: "/media/logos/vibe.jpg", alt: "Vibe" },
  { src: "/media/logos/f-logo.png", alt: "F" },
];

export default function Collaborators() {
  return (
    <section className="border-t border-line bg-foreground py-12">
      <LogoLoop
        logos={LOGOS}
        speed={45}
        logoHeight={64}
        gap={72}
        fadeOutColor="#0d0d0b"
      />
    </section>
  );
}
