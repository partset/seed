import type { AdminPortalCompanyRecord } from "../../../types/company";

interface CompanyOverviewCardProps {
  company: AdminPortalCompanyRecord;
}

export default function CompanyOverviewCard({
  company,
}: CompanyOverviewCardProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
            Company Overview
          </p>
          <h2
            className="mt-2 text-4xl uppercase md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {company.name}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)]">
            Review the company record and open any project to manage updates,
            documents, milestones, and internal delivery progress.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Total Projects
          </p>
          <p className="mt-2 text-2xl font-medium text-[var(--color-foreground)]">
            {company.projects.length}
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Primary Email
          </p>
          <p className="mt-2 break-words text-sm leading-7 text-[var(--color-foreground)]">
            {company.primaryEmail || "Not provided"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Primary Phone
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            {company.primaryPhone || "Not provided"}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4">
          <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Company Created
          </p>
          <p className="mt-2 text-sm leading-7 text-[var(--color-foreground)]">
            {new Date(company.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </section>
  );
}
