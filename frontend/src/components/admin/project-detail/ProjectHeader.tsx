import type { AdminPortalProjectRecord, Company } from "../../../types/company";
import ProjectStatusBadge from "../projects/ProjectStatusBadge";

interface ProjectHeaderProps {
  company: Company;
  project: AdminPortalProjectRecord;
}

export default function ProjectHeader({
  company,
  project,
}: ProjectHeaderProps) {
  return (
    <section className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
      <div className="relative z-10">
        <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
          {company.name}
        </p>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1
              className="text-5xl uppercase md:text-7xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.name}
            </h1>

            <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
              Manage internal delivery details for this project, including
              status, next steps, client-visible communication, milestones,
              updates, and supporting documents.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Current Phase
              </p>
              <p className="mt-1 text-base font-medium text-[var(--color-foreground)]">
                {project.currentPhase || "Not set"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Status
              </p>
              <div className="mt-2">
                <ProjectStatusBadge status={project.status} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
