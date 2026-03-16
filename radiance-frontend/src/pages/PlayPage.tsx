import Navbar from "../components/layout/Navbar";
import HtmlPlayground from "../components/playground/HtmlPlayground";
import { heroContent } from "../constants/hero";

export default function PlayPage() {
  return (
    <main className="min-h-screen bg-background-dark text-foreground">
      <Navbar links={heroContent.navLinks} />
      <HtmlPlayground />
    </main>
  );
}
