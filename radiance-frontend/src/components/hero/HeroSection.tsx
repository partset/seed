import { heroContent } from "../../constants/hero";
import SideLabel from "./SideLabel";
import Tagline from "./Tagline";
import HeroLetters from "./HeroLetters";
import StatsRow from "./StatsRow";
import CTAButton from "./CTAButton";

export default function HeroSection() {
  const { sideLabel, tagline, heroWord, stats, cta } = heroContent;

  return (
    <section className="hero-grain relative flex min-h-screen w-full flex-col items-center justify-center overflow-visible px-6 pb-16">
      <SideLabel
        leftText={sideLabel.leftText}
        rightText={sideLabel.rightText}
      />

      <Tagline text={tagline} />
      <HeroLetters word={heroWord} />
      <StatsRow stats={stats} />
      <div className="animate-fade-in-cta relative z-[2] mt-[52px]">
        <CTAButton label={cta.label} href={cta.href} />
      </div>
    </section>
  );
}
