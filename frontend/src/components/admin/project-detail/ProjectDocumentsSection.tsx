import { useState, type FormEvent } from "react";
import type { ProjectDocument } from "../../../types/projectDocument";
import ProjectSectionCard from "./ProjectSectionCard";

interface ProjectDocumentsSectionProps {
  documents: ProjectDocument[];
  onAddDocument: (payload: {
    title: string;
    category: string;
    description: string;
    isVisibleToClient: boolean;
    file: File;
  }) => Promise<void>;
  isUploadingDocument: boolean;
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
  onAddDocument,
  isUploadingDocument,
}: ProjectDocumentsSectionProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [isVisibleToClient, setIsVisibleToClient] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      setFormError("Document title is required.");
      return;
    }

    if (!file) {
      setFormError("Please choose a file to upload.");
      return;
    }

    try {
      setFormError("");

      await onAddDocument({
        title: title.trim(),
        category: category.trim(),
        description: description.trim(),
        isVisibleToClient,
        file,
      });

      setTitle("");
      setCategory("");
      setDescription("");
      setIsVisibleToClient(true);
      setFile(null);
      setIsFormOpen(false);
    } catch {
      /*
        The parent page already displays the API error.
        This catch prevents the form from crashing if the parent throws.
      */
    }
  }

  return (
    <ProjectSectionCard
      title="Documents"
      description="Review project files that support planning, design, delivery, or launch."
      action={
        <button
          type="button"
          onClick={() => {
            setIsFormOpen((currentValue) => !currentValue);
            setFormError("");
          }}
          className="rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
        >
          {isFormOpen ? "Cancel" : "Add Document"}
        </button>
      }
    >
      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mb-5 rounded-2xl border border-white/10 bg-black/20 p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Title
              </span>
              <input
                type="text"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setFormError("");
                }}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
                placeholder="Project proposal"
              />
            </label>

            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Category
              </span>
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
                placeholder="Planning, Design, Contract"
              />
            </label>
          </div>

          <label className="mt-4 grid gap-2">
            <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Description
            </span>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="min-h-28 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
              placeholder="Add a short description for this document."
            />
          </label>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                File
              </span>
              <input
                type="file"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setFormError("");
                }}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-muted)] outline-none transition file:mr-4 file:rounded-xl file:border-0 file:bg-[var(--color-primary)] file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.15em] file:text-black hover:file:opacity-90 focus:border-[var(--color-primary)]"
              />
            </label>

            <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3">
              <input
                type="checkbox"
                checked={isVisibleToClient}
                onChange={(event) => setIsVisibleToClient(event.target.checked)}
                className="h-4 w-4"
              />
              <span className="text-sm text-[var(--color-foreground)]">
                Visible to client
              </span>
            </label>
          </div>

          {file && (
            <p className="mt-3 text-xs leading-6 text-[var(--color-muted)]">
              Selected file: {file.name} • {formatFileSize(file.size)}
            </p>
          )}

          {formError && (
            <p className="mt-4 rounded-2xl border border-[var(--color-error-border)] bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
              {formError}
            </p>
          )}

          <div className="mt-5 flex justify-end">
            <button
              type="submit"
              disabled={isUploadingDocument}
              className="rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-xs uppercase tracking-[0.2em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUploadingDocument ? "Uploading..." : "Upload Document"}
            </button>
          </div>
        </form>
      )}

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
