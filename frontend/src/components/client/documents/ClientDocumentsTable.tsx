import type { ClientProjectDocument } from "../../../types/clientPortal";

interface ClientDocumentsTableProps {
  documents: ClientProjectDocument[];
  onDocumentClick?: (document: ClientProjectDocument) => void;
}

export default function ClientDocumentsTable({
  documents,
  onDocumentClick,
}: ClientDocumentsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Document
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Category
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                File Type
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Uploaded
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Size
              </th>
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {documents.map((document) => (
              <tr
                key={document.id}
                onClick={() => onDocumentClick?.(document)}
                className="cursor-pointer border-t border-white/10 transition hover:bg-white/5"
              >
                <td className="px-4 py-5 align-top">
                  <div className="font-medium text-[var(--color-foreground)]">
                    {document.title}
                  </div>
                  <div className="mt-1 max-w-md text-sm text-[var(--color-muted)]">
                    {document.description}
                  </div>
                </td>

                <td className="px-4 py-5 align-top">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {document.category}
                  </span>
                </td>

                <td className="px-4 py-5 align-top">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {document.fileType}
                  </span>
                </td>

                <td className="px-4 py-5 align-top">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {document.uploadedAtLabel}
                  </span>
                </td>

                <td className="px-4 py-5 align-top">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {document.fileSizeLabel}
                  </span>
                </td>

                <td className="px-4 py-5 align-top">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      onDocumentClick?.(document);
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
  );
}
