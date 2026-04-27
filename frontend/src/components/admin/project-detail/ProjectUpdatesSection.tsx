import { useState } from "react";
import type { ProjectUpdate } from "../../../types/projectUpdate";
import AddUpdateForm from "./AddUpdateForm";
import ProjectSectionCard from "./ProjectSectionCard";

interface ProjectUpdatesSectionProps {
  updates: ProjectUpdate[];
  onAddUpdate: (payload: {
    title: string;
    description: string;
    isVisibleToClient: boolean;
  }) => void;
}

export default function ProjectUpdatesSection({
  updates,
  onAddUpdate,
}: ProjectUpdatesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <ProjectSectionCard
      title="Updates"
      description="Add project updates to track delivery progress. You can also mark whether each update should be visible to the client portal."
      action={
        <button
          type="button"
          onClick={() => setIsAdding((previous) => !previous)}
          className="rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
        >
          {isAdding ? "Close" : "Add Update"}
        </button>
      }
    >
      <div className="grid gap-4">
        {isAdding ? (
          <AddUpdateForm
            onSubmit={(payload) => {
              onAddUpdate(payload);
              setIsAdding(false);
            }}
          />
        ) : null}

        {updates.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              No updates yet
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Once the team logs progress updates, they will appear here.
            </p>
          </div>
        ) : (
          updates.map((update) => (
            <article
              key={update.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-medium text-[var(--color-foreground)]">
                    {update.title}
                  </h3>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    {new Date(update.createdAt).toLocaleDateString()} •{" "}
                    {update.createdByAdminEmail}
                  </p>
                </div>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  {update.isVisibleToClient
                    ? "Client Visible"
                    : "Internal Only"}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {update.description}
              </p>
            </article>
          ))
        )}
      </div>
    </ProjectSectionCard>
  );
}
