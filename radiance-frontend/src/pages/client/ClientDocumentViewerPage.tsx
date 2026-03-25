import { Link, useParams } from "react-router-dom";
import ClientDocumentViewer from "../../components/client/documents/ClientDocumentViewer";
import { clientProjectDocuments } from "../../constants/clientPortalMockData";

export default function ClientDocumentViewerPage() {
  const { documentId } = useParams<{ documentId: string }>();

  const document = clientProjectDocuments.find(
    (item) => item.id === documentId,
  );

  if (!document) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-5xl space-y-6">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Documents
            </p>

            <h1
              className="mt-3 text-4xl uppercase md:text-6xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Document Not Found
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
              The document you tried to open could not be found.
            </p>

            <div className="mt-6">
              <Link
                to="/client/documents"
                className="inline-flex rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:opacity-90"
              >
                Back to Documents
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-6">
        <div>
          <Link
            to="/client/documents"
            className="inline-flex rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--color-foreground)] transition hover:bg-white/5"
          >
            Back to Documents
          </Link>
        </div>

        <ClientDocumentViewer document={document} />
      </section>
    </main>
  );
}
