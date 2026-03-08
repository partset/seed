import Navbar from "../components/layout/Navbar";
import HeroSection from "../components/hero/HeroSection";
import { heroContent } from "../constants/hero";

export default function Home() {
  return (
    <main className="min-h-screen bg-background-dark text-foreground">
      <Navbar links={heroContent.navLinks} />
      <HeroSection />
    </main>
  );
}
