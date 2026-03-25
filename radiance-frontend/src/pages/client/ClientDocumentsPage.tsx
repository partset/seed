import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ClientDocumentsTable from "../../components/client/documents/ClientDocumentsTable";
import { clientProjectDocuments } from "../../constants/clientPortalMockData";

export default function ClientDocumentsPage() {
  const navigate = useNavigate();

  const sortedDocuments = useMemo(() => {
    return [...clientProjectDocuments].sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    );
  }, []);

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Client Portal
              </p>

              <h1
                className="text-5xl uppercase md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Documents
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Review all uploaded files for your project, including planning,
                design, billing, and status updates.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Total Documents
              </p>
              <p className="mt-1 text-2xl font-medium text-[var(--color-foreground)]">
                {sortedDocuments.length}
              </p>
            </div>
          </div>
        </div>

        <ClientDocumentsTable
          documents={sortedDocuments}
          onDocumentClick={(document) =>
            navigate(`/client/documents/${document.id}`)
          }
        />
      </section>
    </main>
  );
}
