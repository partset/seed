import PageLayout from "../components/layout/PageLayout";
import HtmlPlayground from "../components/playground/HtmlPlayground";

export default function PlayPage() {
  return (
    <PageLayout>
      <main className="min-h-screen bg-background-dark text-foreground">
        <HtmlPlayground />
      </main>
    </PageLayout>
  );
}
