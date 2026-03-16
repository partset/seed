import type { ReactNode } from "react";
import Navbar from "./Navbar";
import { heroContent } from "../../constants/hero";

type PageLayoutProps = {
  children: ReactNode;
};

export default function PageLayout({ children }: PageLayoutProps) {
  return (
    <main className="min-h-screen bg-background-dark text-foreground">
      <Navbar
        links={heroContent.navLinks}
        pricingLink={heroContent.pricingLink}
      />

      <div className="pt-32 sm:pt-24">{children}</div>
    </main>
  );
}
