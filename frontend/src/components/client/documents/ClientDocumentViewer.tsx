import type { ProjectDocument } from "../../../types/projectDocument";
import { formatDate } from "../../../utils/formatDate";
import { formatFileSize } from "../../../utils/formatFileSize";

interface ClientDocumentViewerProps {
  document: ProjectDocument;
  viewerUrl: string;
}

export default function ClientDocumentViewer({
  document,
  viewerUrl,
}: ClientDocumentViewerProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Document Details
            </p>

            <div className="space-y-2">
              <h2
                className="text-3xl uppercase md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {document.title}
              </h2>

              <p className="max-w-3xl text-[14px] leading-7 text-[var(--color-muted)]">
                {document.description || "No description provided."}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:min-w-[240px]">
            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Category
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {document.category || "Uncategorized"}
              </p>
            </div>

            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Uploaded
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {formatDate(document.createdAt)}
              </p>
            </div>

            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                File Info
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {document.fileType || "File"} ·{" "}
                {formatFileSize(document.fileSizeBytes)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Embedded Viewer
          </p>

          {viewerUrl && (
            <a
              href={viewerUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs uppercase tracking-[0.16em] text-[var(--color-primary)]"
            >
              Open in New Tab
            </a>
          )}
        </div>

        <div className="h-[75vh] min-h-[700px] bg-black/20">
          {viewerUrl ? (
            <iframe
              title={document.title}
              src={viewerUrl}
              className="h-full w-full border-0"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center">
              <p className="text-sm text-[var(--color-muted)]">
                No document preview URL is available.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
