import type { ChangeEvent } from "react";
import type { AdminPortalProjectRecord } from "../../../types/company";
import type { ProjectStatus } from "../../../types/project";
import ProjectSectionCard from "./ProjectSectionCard";

interface ProjectMetaFormProps {
  project: AdminPortalProjectRecord;
  onProjectChange: (project: AdminPortalProjectRecord) => void;
  onSave: () => void;
  isSaving: boolean;
  saveError: string;
  saveSuccessMessage: string;
}

const projectStatusOptions: ProjectStatus[] = [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
];

export default function ProjectMetaForm({
  project,
  onProjectChange,
  onSave,
  isSaving,
  saveError,
  saveSuccessMessage,
}: ProjectMetaFormProps) {
  function handleFieldChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const { name, value } = event.target;

    onProjectChange({
      ...project,
      [name]: value,
    });
  }

  return (
    <ProjectSectionCard
      title="Project Details"
      description="Update the main project fields that describe internal progress and what the client should currently understand about the work."
    >
      <div className="grid gap-5 xl:grid-cols-2">
        <label className="block xl:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Project Name
          </span>
          <input
            name="name"
            value={project.name}
            onChange={handleFieldChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Enter project name"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Current Phase
          </span>
          <input
            name="currentPhase"
            value={project.currentPhase ?? ""}
            onChange={handleFieldChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Enter current project phase"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Status
          </span>
          <select
            name="status"
            value={project.status}
            onChange={handleFieldChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
          >
            {projectStatusOptions.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>

        <label className="block xl:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Next Step
          </span>
          <textarea
            name="nextStep"
            value={project.nextStep ?? ""}
            onChange={handleFieldChange}
            rows={4}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Describe the next action the team needs to take"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Target Launch Date
          </span>
          <input
            type="date"
            name="targetLaunchDate"
            value={project.targetLaunchDate ?? ""}
            onChange={handleFieldChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Start Date
          </span>
          <input
            type="date"
            name="startDate"
            value={project.startDate ?? ""}
            onChange={handleFieldChange}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
          />
        </label>

        <label className="block xl:col-span-2">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Client Visible Summary
          </span>
          <textarea
            name="clientVisibleSummary"
            value={project.clientVisibleSummary ?? ""}
            onChange={handleFieldChange}
            rows={6}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Write the client-safe summary shown in the portal"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          {saveError && (
            <p className="text-sm text-[var(--color-error)]">{saveError}</p>
          )}

          {saveSuccessMessage && !saveError && (
            <p className="text-sm text-[var(--color-success)]">
              {saveSuccessMessage}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={onSave}
          disabled={isSaving}
          className="rounded-full bg-[var(--color-primary)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </ProjectSectionCard>
  );
}
