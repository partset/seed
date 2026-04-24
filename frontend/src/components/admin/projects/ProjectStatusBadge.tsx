import type { ProjectStatus } from "../../../types/project";

interface ProjectStatusBadgeProps {
  status: ProjectStatus;
}

const statusLabelMap: Record<ProjectStatus, string> = {
  planned: "Planned",
  active: "Active",
  on_hold: "On Hold",
  completed: "Completed",
  cancelled: "Cancelled",
};

const statusClassMap: Record<ProjectStatus, string> = {
  planned: "border-white/10 bg-white/5 text-[var(--color-foreground)]",
  active:
    "border-[rgba(134,239,172,0.35)] bg-[rgba(134,239,172,0.08)] text-[var(--color-success)]",
  on_hold:
    "border-[rgba(200,184,154,0.35)] bg-[rgba(200,184,154,0.1)] text-[var(--color-primary)]",
  completed:
    "border-[rgba(134,239,172,0.35)] bg-[rgba(134,239,172,0.08)] text-[var(--color-success)]",
  cancelled:
    "border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] text-[var(--color-error)]",
};

export default function ProjectStatusBadge({
  status,
}: ProjectStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-[11px] uppercase tracking-[0.2em] ${statusClassMap[status]}`}
    >
      {statusLabelMap[status]}
    </span>
  );
}
