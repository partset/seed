import { Link } from "react-router-dom";
import { clientProjects } from "../../constants/clientPortalMockData";

export default function ClientProjectsPage() {
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
                {clientProjects.length}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {clientProjects.map((project) => (
            <Link
              key={project.id}
              to={`/client/${project.id}`}
              className="group rounded-[2rem] border border-white/10 bg-white/5 p-6 transition duration-200 hover:border-[var(--color-primary)] hover:bg-white/[0.07]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-primary)]">
                    {project.websiteStatus}
                  </p>

                  <h2
                    className="mt-3 text-3xl uppercase"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {project.projectName}
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
