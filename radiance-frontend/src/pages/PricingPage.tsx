import PageLayout from "../components/layout/PageLayout";
import Navbar from "../components/layout/Navbar";
import PricingSection from "../components/pricing/PricingSection";
import BottomBar from "../components/hero/BottomBar";
import { heroContent } from "../constants/hero";

export default function PricingPage() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-background-dark text-foreground">
        <PricingSection />

        <BottomBar
          location={heroContent.footer.location}
          timezone={heroContent.footer.timezone}
          centerLinks={heroContent.footer.centerLinks}
          copyright={heroContent.footer.copyright}
          socialLinks={heroContent.footer.socialLinks}
        />
      </main>
    </PageLayout>
  );
}
