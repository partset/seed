import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import { heroContent } from "../constants/hero";
import LogoCarousel from "../components/sections/LogoCarousel";
import BottomBar from "../components/hero/BottomBar";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-dark text-foreground">
      <Navbar links={heroContent.navLinks} />
      <HeroSection />
      <LogoCarousel />
      <BottomBar
        location={heroContent.footer.location}
        timezone={heroContent.footer.timezone}
        centerLinks={heroContent.footer.centerLinks}
        copyright={heroContent.footer.copyright}
        socialLinks={heroContent.footer.socialLinks}
      />
    </main>
  );
}
