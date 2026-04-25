import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import CompanyOverviewCard from "../../components/admin/company/CompanyOverviewCard";
import CompanyStatCard from "../../components/admin/companies/CompanyStatCard";
import ProjectGrid from "../../components/admin/projects/ProjectGrid";
import type { Project } from "../../types/project";
import type { Company } from "../../types/company";
import { getProjectByCompanyId } from "../../services/api/project/getProjectByCompanyId/api";

type LocationState = {
  company?: Company;
};

export default function AdminCompanyDetailsPage() {
  const { session } = useAdminAuth();
  const accessToken = session?.access_token;

  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = useParams();

  const company = (location.state as LocationState | null)?.company ?? null;

  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProjects() {
      if (!accessToken) {
        setError("No active admin session found.");
        setIsLoading(false);
        return;
      }

      if (!companyId) {
        setError("No company ID provided in URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getProjectByCompanyId(accessToken, companyId);
        setProjects(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load projects.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProjects();
  }, [accessToken, companyId]);

  function handleProjectClick(project: Project) {
    if (!companyId) return;
    navigate(`/admin/${companyId}/${project.id}`, {
      state: { company, project },
    });
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Loading company details...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-red-400/20 bg-red-400/10 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-red-200">
            Failed to load company details
          </p>
          <p className="mt-3 text-sm leading-7 text-red-100">{error}</p>
        </section>
      </main>
    );
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
            Company details were not passed to this page. Please return to the
            companies page and open the company again.
          </p>
        </section>
      </main>
    );
  }

  const activeProjects = projects.filter(
    (project) => project.status === "active",
  ).length;

  const completedProjects = projects.filter(
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
          <CompanyStatCard label="Projects" value={projects.length} />
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

          {projects.length === 0 ? (
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
              projects={projects}
              onProjectClick={handleProjectClick}
            />
          )}
        </section>
      </section>
    </main>
  );
}
