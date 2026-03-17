import PageLayout from "../components/layout/PageLayout";
import HeroSection from "../components/hero/HeroSection";
import LogoCarousel from "../components/sections/LogoCarousel";
import BottomBar from "../components/hero/BottomBar";
import { heroContent } from "../constants/hero";
import GlassPanelsSection from "../components/sections/GlassPanelsSection";

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
      <GlassPanelsSection />
      <LogoCarousel />
      <BottomBar
        location={heroContent.footer.location}
        timezone={heroContent.footer.timezone}
        centerLinks={heroContent.footer.centerLinks}
        copyright={heroContent.footer.copyright}
        socialLinks={heroContent.footer.socialLinks}
      />
    </PageLayout>
  );
}
