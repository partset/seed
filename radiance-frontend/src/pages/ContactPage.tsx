import Navbar from "../components/layout/Navbar";
import BottomBar from "../components/hero/BottomBar";
import ContactForm from "../components/contact/ContactForm";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";
import { heroContent } from "../constants/hero";

export default function ContactPage()
{
  return (
    <main className="min-h-screen bg-background-dark text-foreground">
      <Navbar links={heroContent.navLinks}
        pricingLink={heroContent.pricingLink}
    />

    <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-16 pb-20 md:px-10 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="flex flex-col gap-8">
            <ContactHero />
            <ContactInfo />
          </div>
          <div className="lg:mt-[82px]">
            <ContactForm />
          </div>
        </div>
      </section>

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