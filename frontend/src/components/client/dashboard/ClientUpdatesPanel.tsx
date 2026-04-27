import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { ProjectUpdate } from "../../../types/projectUpdate";
import ClientUpdatesTable from "../updates/ClientUpdatesTable";

interface ClientUpdatesPanelProps {
  updates: ProjectUpdate[];
}

export default function ClientUpdatesPanel({
  updates,
}: ClientUpdatesPanelProps) {
  const navigate = useNavigate();
  const { projectId } = useParams<{ projectId: string }>();

  const recentUpdates = useMemo(() => {
    return [...updates]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 3);
  }, [updates]);

  function handleViewAllClick() {
    if (!projectId) return;

    navigate(`/client/${projectId}/updates`, {
      state: {
        updates,
      },
    });
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-5">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
          Project Activity
        </p>

        <h2
          className="mt-3 text-3xl uppercase"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Recent Updates
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          Review the latest notes from your project team.
        </p>
      </div>

      <ClientUpdatesTable updates={recentUpdates} />

      <div className="mt-5">
        <button
          type="button"
          onClick={handleViewAllClick}
          className="w-full rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:opacity-90"
        >
          View All
        </button>
      </div>
    </section>
  );
}
