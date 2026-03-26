import type { AdminPortalCompanyRecord } from "../../../types/company";
import ProjectStatusBadge from "../projects/ProjectStatusBadge";

interface CompanyCardProps {
  company: AdminPortalCompanyRecord;
  onClick?: (companyId: string) => void;
}

export default function CompanyCard({ company, onClick }: CompanyCardProps) {
  const activeProjects = company.projects.filter(
    (project) => project.status === "active",
  ).length;

  return (
    <button
      type="button"
      onClick={() => onClick?.(company.id)}
      className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.08]"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
            Company
          </p>
          <h2
            className="mt-2 text-3xl uppercase text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {company.name}
          </h2>
        </div>

        {company.projects[0] ? (
          <ProjectStatusBadge status={company.projects[0].status} />
        ) : null}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Primary Email
          </p>
          <p className="mt-2 break-words text-sm leading-7 text-[var(--color-foreground)]">
            {company.primaryEmail || "Not provided"}
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Primary Phone
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            {company.primaryPhone || "Not provided"}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Projects
          </p>
          <p className="mt-2 text-xl font-medium text-[var(--color-foreground)]">
            {company.projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Active
          </p>
          <p className="mt-2 text-xl font-medium text-[var(--color-foreground)]">
            {activeProjects}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Latest Project
          </p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-foreground)]">
            {company.projects[0]?.name || "No projects yet"}
          </p>
        </div>
      </div>
    </button>
  );
}
