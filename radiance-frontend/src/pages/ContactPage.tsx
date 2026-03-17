import PageLayout from "../components/layout/PageLayout";
import ContactForm from "../components/contact/ContactForm";
import ContactHero from "../components/contact/ContactHero";
import ContactInfo from "../components/contact/ContactInfo";

export default function ContactPage()
{
  return (
    <PageLayout>
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 pt-1 pb-20 md:px-10 lg:px-12 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="flex flex-col gap-8">
            <ContactHero />
            <ContactInfo />
          </div>

          <div className="lg:mt-[87px]">
            <ContactForm />
          </div>
        </div>
      </section>
    </PageLayout>
  );
}