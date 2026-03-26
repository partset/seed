import { useState } from "react";
import type { ProjectMilestoneStatus } from "../../../types/projectMilestone";

interface AddMilestoneFormProps {
  nextDisplayOrder: number;
  onSubmit: (payload: {
    label: string;
    status: ProjectMilestoneStatus;
  }) => void;
}

const milestoneStatusOptions: ProjectMilestoneStatus[] = [
  "upcoming",
  "current",
  "complete",
];

export default function AddMilestoneForm({
  nextDisplayOrder,
  onSubmit,
}: AddMilestoneFormProps) {
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<ProjectMilestoneStatus>("upcoming");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!label.trim()) {
      return;
    }

    onSubmit({
      label: label.trim(),
      status,
    });
    setLabel("");
    setStatus("upcoming");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-black/20 p-4"
    >
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px_auto] md:items-end">
        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Milestone Label
          </span>
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            placeholder="Enter milestone name"
          />
        </label>

        <label className="block">
          <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Status
          </span>
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as ProjectMilestoneStatus)
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
          >
            {milestoneStatusOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <div>
          <button
            type="submit"
            className="w-full rounded-2xl border border-[var(--color-primary)] px-4 py-3 text-xs uppercase tracking-[0.2em] text-[var(--color-primary)] transition hover:bg-[rgba(200,184,154,0.08)]"
          >
            Add #{nextDisplayOrder}
          </button>
        </div>
      </div>
    </form>
  );
}
