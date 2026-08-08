import Nav from "@/components/Nav";
import IntroReveal from "@/components/IntroReveal";
import Hero from "@/components/Hero";
import Projects from "@/components/Projects";
import TextLoop from "@/components/TextLoop";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Collaborators from "@/components/Collaborators";
import ServicesSection from "@/components/Services";
import SkillsEducation from "@/components/SkillsEducation";
import Photography from "@/components/Photography";
import Music from "@/components/Music";
import Cta from "@/components/Cta";
import Faq from "@/components/Faq";
import PlayfulButton from "@/components/PlayfulButton";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex-1">
        <IntroReveal src="/media/landing.mp4" />
        <Hero />
        <Projects />
        <TextLoop text="UX Design ✦ Brand Identity ✦ Motion ✦ Sound" separator="✦" />
        <About />
        <Experience />
        <Collaborators />
        <ServicesSection />
        <SkillsEducation />
        <Photography />
        <Music />
        <Cta />
        <Faq />
        <PlayfulButton />
      </main>
      <Footer />
    </>
  );
}
