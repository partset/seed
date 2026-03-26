import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CompanyOverviewCard from "../../components/admin/company/CompanyOverviewCard";
import CompanyStatCard from "../../components/admin/companies/CompanyStatCard";
import ProjectGrid from "../../components/admin/projects/ProjectGrid";
import { adminPortalMockCompanies } from "../../constants/adminPortalMockData";

export default function AdminCompanyDetailsPage() {
  const navigate = useNavigate();
  const { companyId } = useParams();

  const company = useMemo(() => {
    return (
      adminPortalMockCompanies.find((item) => item.id === companyId) ?? null
    );
  }, [companyId]);

  function handleProjectClick(projectId: string) {
    if (!company) {
      return;
    }

    navigate(`/admin/${company.id}/${projectId}`);
  }

  if (!company) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Company Not Found
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            The requested company record could not be found in the mock data.
          </p>
        </section>
      </main>
    );
  }

  const activeProjects = company.projects.filter(
    (project) => project.status === "active",
  ).length;

  const completedProjects = company.projects.filter(
    (project) => project.status === "completed",
  ).length;

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl">
        <button
          type="button"
          onClick={() => navigate("/admin")}
          className="mb-6 text-xs uppercase tracking-[0.22em] text-[var(--color-primary)] transition hover:opacity-80"
        >
          ← Back to companies
        </button>

        <CompanyOverviewCard company={company} />

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <CompanyStatCard label="Projects" value={company.projects.length} />
          <CompanyStatCard label="Active" value={activeProjects} />
          <CompanyStatCard label="Completed" value={completedProjects} />
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2
                className="text-3xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Projects
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Open any project card to manage updates, milestones, documents,
                and project metadata.
              </p>
            </div>
          </div>

          {company.projects.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-black/20 px-6 py-12 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                No projects yet
              </p>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Once projects are created for this company, they will appear
                here.
              </p>
            </div>
          ) : (
            <ProjectGrid
              projects={company.projects}
              onProjectClick={handleProjectClick}
            />
          )}
        </section>
      </section>
    </main>
  );
}
