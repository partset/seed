import type { LeadStatus } from "../../../types/lead";

interface LeadStatusBadgeProps {
  status: LeadStatus;
}

const statusStyles: Record<LeadStatus, string> = {
  New: "border-[var(--color-primary)] text-[var(--color-primary)]",
  Reviewing: "border-[var(--color-foreground)] text-[var(--color-foreground)]",
  Contacted: "border-sky-300 text-sky-300",
  "Meeting Scheduled": "border-violet-300 text-violet-300",
  "Proposal Sent": "border-amber-300 text-amber-300",
  "Converted to Client":
    "border-[var(--color-success)] text-[var(--color-success)]",
  "Closed / Not Moving Forward":
    "border-[var(--color-error)] text-[var(--color-error)]",
};

export default function LeadStatusBadge({ status }: LeadStatusBadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs uppercase tracking-[0.18em]",
        "font-[var(--font-mono)]",
        statusStyles[status],
      ].join(" ")}
    >
      {status}
    </span>
  );
}
