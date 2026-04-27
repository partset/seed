import { useState } from "react";
import type {
  ProjectMilestone,
  InsertProjectMilestonePayload,
} from "../../../types/projectMilestone";
import AddMilestoneForm from "./AddMilestoneForm";
import ProjectSectionCard from "./ProjectSectionCard";

interface ProjectMilestonesSectionProps {
  milestones: ProjectMilestone[];
  onAddMilestone: (
    payload: Omit<InsertProjectMilestonePayload, "projectId">,
  ) => Promise<void>;
}

const milestoneStatusClassMap: Record<ProjectMilestone["status"], string> = {
  upcoming: "border-white/10 bg-white/5 text-[var(--color-foreground)]",
  current:
    "border-[rgba(200,184,154,0.35)] bg-[rgba(200,184,154,0.1)] text-[var(--color-primary)]",
  complete:
    "border-[rgba(134,239,172,0.35)] bg-[rgba(134,239,172,0.08)] text-[var(--color-success)]",
};

export default function ProjectMilestonesSection({
  milestones,
  onAddMilestone,
}: ProjectMilestonesSectionProps) {
  const [isAdding, setIsAdding] = useState(false);

  const sortedMilestones = [...milestones].sort(
    (first, second) => first.displayOrder - second.displayOrder,
  );
  return (
    <ProjectSectionCard
      title="Milestones"
      description="Track key checkpoints for the project. This first version supports adding milestones and assigning one of the schema statuses."
      action={
        <button
          type="button"
          onClick={() => setIsAdding((previous) => !previous)}
          className="rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
        >
          {isAdding ? "Close" : "Add Milestone"}
        </button>
      }
    >
      <div className="grid gap-4">
        {isAdding ? (
          <AddMilestoneForm
            nextDisplayOrder={milestones.length + 1}
            onSubmit={async (payload) => {
              await onAddMilestone(payload);
              setIsAdding(false);
            }}
          />
        ) : null}

        {sortedMilestones.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              No milestones yet
            </p>
            <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
              Add the first milestone to define the project timeline more
              clearly.
            </p>
          </div>
        ) : (
          sortedMilestones.map((milestone) => (
            <article
              key={milestone.id}
              className="rounded-2xl border border-white/10 bg-black/20 p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                    Milestone #{milestone.displayOrder}
                  </p>
                  <h3 className="mt-2 text-lg font-medium text-[var(--color-foreground)]">
                    {milestone.label}
                  </h3>
                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${milestoneStatusClassMap[milestone.status]}`}
                >
                  {milestone.status}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </ProjectSectionCard>
  );
}
