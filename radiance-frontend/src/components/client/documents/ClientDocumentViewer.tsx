import type { ClientProjectDocument } from "../../../types/clientPortal";

interface ClientDocumentViewerProps {
  document: ClientProjectDocument;
}

export default function ClientDocumentViewer({
  document,
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
                {document.description}
              </p>
            </div>
          </div>

          <div className="grid gap-3 md:min-w-[240px]">
            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Category
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {document.category}
              </p>
            </div>

            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Uploaded
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {document.uploadedAtLabel}
              </p>
            </div>

            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                File Info
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {document.fileType} · {document.fileSizeLabel}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
        <div className="border-b border-white/10 px-6 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Embedded Viewer
          </p>
        </div>

        <div className="h-[75vh] min-h-[700px] bg-black/20">
          <iframe
            title={document.title}
            src={document.embedUrl}
            className="h-full w-full border-0"
          />
        </div>
      </div>
    </section>
  );
}
