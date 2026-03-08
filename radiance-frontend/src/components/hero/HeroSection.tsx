import { heroContent } from "../../constants/hero";
import SideLabel from "./SideLabel";
import Tagline from "./Tagline";
import HeroLetters from "./HeroLetters";
import StatsRow from "./StatsRow";
import CTAButton from "./CTAButton";
import BottomBar from "./BottomBar";

export default function HeroSection() {
  const { sideLabel, tagline, heroWord, stats, cta, footer } = heroContent;

  return (
    <section className="hero-grain relative flex min-h-screen w-full flex-col items-center justify-center overflow-visible px-6">
      <SideLabel
        leftText={sideLabel.leftText}
        rightText={sideLabel.rightText}
      />

      <Tagline text={tagline} />
      <HeroLetters word={heroWord} />
      <StatsRow stats={stats} />
      <CTAButton label={cta.label} href={cta.href} />

      <BottomBar
        location={footer.location}
        timezone={footer.timezone}
        centerLinks={footer.centerLinks}
        copyright={footer.copyright}
        socialLinks={footer.socialLinks}
      />
    </section>
  );
}
