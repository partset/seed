import type { Project } from "../../../types/project";
import ProjectStatusBadge from "./ProjectStatusBadge";

interface ProjectCardProps {
  project: Project;
  onClick?: (project: Project) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(project)}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
            Project
          </p>
          <h3
            className="mt-2 text-3xl uppercase text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.name}
          </h3>
        </div>

        <ProjectStatusBadge status={project.status} />
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Current Phase
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            {project.currentPhase || "Not set"}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Target Launch Date
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            {project.targetLaunchDate || "Not set"}
          </p>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Next Step
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
          {project.nextStep || "Not set"}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
        <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Client Visible Summary
        </p>
        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          {project.clientVisibleSummary || "No summary added yet."}
        </p>
      </div>
    </button>
  );
}
