import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ClientProjectDocument } from "../../../types/clientPortal";

interface ClientDocumentsPanelProps {
  documents: ClientProjectDocument[];
}

export default function ClientDocumentsPanel({
  documents,
}: ClientDocumentsPanelProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const recentDocuments = useMemo(() => {
    return [...documents]
      .sort(
        (a, b) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
      )
      .slice(0, 3);
  }, [documents]);

  function handleViewAllClick() {
    navigate(`/client/${projectId}/documents`);
  }

  function handleDocumentClick(documentId: string) {
    navigate(`/client/${projectId}/documents/${documentId}`);
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Shared Files
        </p>

        <h2
          className="mt-3 text-3xl uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recent Documents
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          View the latest uploaded files related to your project.
        </p>
      </div>

      <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20">
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-white/5">
              <tr className="text-left">
                <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Document
                </th>
                <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Uploaded
                </th>
                <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Type
                </th>
                <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {recentDocuments.map((document) => (
                <tr
                  key={document.id}
                  onClick={() => handleDocumentClick(document.id)}
                  className="cursor-pointer border-t border-white/10 transition hover:bg-white/5"
                >
                  <td className="px-4 py-5 align-top">
                    <div className="font-medium text-[var(--color-foreground)]">
                      {document.title}
                    </div>
                    <div className="mt-1 text-sm text-[var(--color-muted)]">
                      {document.category}
                    </div>
                  </td>

                  <td className="px-4 py-5 align-top">
                    <span className="text-sm text-[var(--color-foreground)]">
                      {document.uploadedAtLabel}
                    </span>
                  </td>

                  <td className="px-4 py-5 align-top">
                    <span className="text-sm text-[var(--color-foreground)]">
                      {document.fileType}
                    </span>
                  </td>

                  <td className="px-4 py-5 align-top">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        handleDocumentClick(document.id);
                      }}
                      className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.14em] text-[var(--color-foreground)] transition hover:bg-white/5"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={handleViewAllClick}
          className="w-full rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:opacity-90"
        >
          View All
        </button>
      </div>
    </section>
  );
}
