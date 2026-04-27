import { useEffect, useState } from "react";
import { useClientAuth } from "../../hooks/useClientAuth";
import { Link } from "react-router-dom";
import { getProjectByCompanyId } from "../../services/api/project/getProjectByCompanyId/api";
import type { Project } from "../../types/project";

export default function ClientProjectsPage() {
  const { session, companyId } = useClientAuth();

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);

  const accessToken = session?.access_token;

  useEffect(() => {
    async function loadProjects() {
      if (!accessToken) {
        setError("No active client session found.");
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

  if (!companyId) {
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
  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Client Portal
              </p>

              <h1
                className="text-5xl uppercase md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Projects
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Choose a project to view its progress, updates, shared files,
                billing details, and next steps.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Total Projects
              </p>
              <p className="mt-1 text-2xl font-medium text-[var(--color-foreground)]">
                {projects.length}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              to={`/client/${project.id}`}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 transition duration-200 hover:border-[var(--color-primary)] hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {project.status}
                  </p>

                  <h2
                    className="mt-3 text-3xl uppercase"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.name}
                  </h2>
                </div>

                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  {project.currentPhase}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">
                {project.clientVisibleSummary}
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-[10px] uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Next Step
                </p>
                <p className="mt-2 text-sm text-[var(--color-foreground)]">
                  {project.nextStep}
                </p>
              </div>

              <div className="mt-6 flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
                  Open project details
                </p>

                <span className="text-sm uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 group-hover:translate-x-1">
                  View →
                </span>
              </div>
            </Link>
          ))}
        </section>
      </section>
    </main>
  );
}
