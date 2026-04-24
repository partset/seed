import { useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";
import ClientUpdatesTable from "../../components/client/updates/ClientUpdatesTable";
import { clientProjectDetailsById } from "../../constants/clientPortalMockData";

export default function ClientUpdatesPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  const project = clientProjectDetailsById[projectId];

  if (!project) {
    return <Navigate to="/client" replace />;
  }

  const sortedUpdates = useMemo(() => {
    return [...project.updates].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }, [project.updates]);

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
                Updates
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Review the full history of project notes and progress updates
                from your team.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Total Updates
              </p>
              <p className="mt-1 text-2xl font-medium text-[var(--color-foreground)]">
                {sortedUpdates.length}
              </p>
            </div>
          </div>
        </div>

        <ClientUpdatesTable updates={sortedUpdates} />
      </section>
    </main>
  );
}
