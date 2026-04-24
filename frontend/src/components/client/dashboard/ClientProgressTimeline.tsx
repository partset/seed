import type { ClientProjectMilestone } from "../../../types/clientPortal";

interface ClientProgressTimelineProps {
  milestones: ClientProjectMilestone[];
}

function getMilestoneStyles(status: ClientProjectMilestone["status"]) {
  if (status === "complete") {
    return {
      dotClassName: "bg-[var(--color-success)]",
      labelClassName: "text-[var(--color-foreground)]",
      statusLabel: "Complete",
    };
  }

  if (status === "current") {
    return {
      dotClassName: "bg-[var(--color-primary)]",
      labelClassName: "text-[var(--color-foreground)]",
      statusLabel: "Current",
    };
  }

  return {
    dotClassName: "bg-white/15",
    labelClassName: "text-[var(--color-muted)]",
    statusLabel: "Upcoming",
  };
}

export default function ClientProgressTimeline({
  milestones,
}: ClientProgressTimelineProps) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Project Progress
          </p>

          <h2
            className="mt-3 text-3xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Timeline
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Follow each stage of your project from planning through launch.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {milestones.map((milestone, index) => {
          const styles = getMilestoneStyles(milestone.status);
          const isLast = index === milestones.length - 1;

          return (
            <div key={milestone.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <span
                  className={`mt-1 h-3 w-3 rounded-full ${styles.dotClassName}`}
                />
                {!isLast ? (
                  <span className="mt-2 h-full w-px bg-white/10" />
                ) : null}
              </div>

              <div className="flex-1 pb-4">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <p
                    className={`text-sm uppercase tracking-[0.16em] ${styles.labelClassName}`}
                  >
                    {milestone.label}
                  </p>

                  <span className="inline-flex w-fit rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[10px] uppercase tracking-[0.16em] text-[var(--color-muted)]">
                    {styles.statusLabel}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
