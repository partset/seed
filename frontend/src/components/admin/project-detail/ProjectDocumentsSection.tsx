import type { ProjectDocument } from "../../../types/projectDocument";
import ProjectSectionCard from "./ProjectSectionCard";

interface ProjectDocumentsSectionProps {
  documents: ProjectDocument[];
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ProjectDocumentsSection({
  documents,
}: ProjectDocumentsSectionProps) {
  return (
    <ProjectSectionCard
      title="Documents"
      description="Review project files that support planning, design, delivery, or launch. The add button is a placeholder until file upload is wired in."
      action={
        <button
          type="button"
          className="rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
        >
          Add Document
        </button>
      }
    >
      {documents.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-8 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            No documents yet
          </p>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            Project documents will appear here once file uploads are connected.
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {documents.map((document) => (
            <article
              key={document.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                    {document.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {document.category || "Uncategorized"} •{" "}
                    {document.fileType.toUpperCase()} •{" "}
                    {formatFileSize(document.fileSizeBytes)}
                  </p>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {document.isVisibleToClient
                    ? "Client Visible"
                    : "Internal Only"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {document.description || "No description added."}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    File Name
                  </p>
                  <p className="mt-2 break-words text-sm text-[var(--color-foreground)]">
                    {document.fileName}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Uploaded By
                  </p>
                  <p className="mt-2 text-sm text-[var(--color-foreground)]">
                    {document.uploadedByAdminName}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </ProjectSectionCard>
  );
}
