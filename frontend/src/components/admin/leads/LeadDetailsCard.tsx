import type { Lead } from "../../../types/lead";
import { formatDate } from "../../../utils/formatDate";
import LeadInfoRow from "./LeadInfoRow";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadDetailsCardProps {
  lead: Lead;
  onConvertToClient?: () => void;
  isConverting?: boolean;
  convertError?: string;
}

export default function LeadDetailsCard({
  lead,
  onConvertToClient,
  isConverting = false,
  convertError = "",
}: LeadDetailsCardProps) {
  const fullName = `${lead.first_name} ${lead.last_name}`.trim();
  const isAlreadyConverted =
    lead.status?.toLowerCase() === "converted to client";

  return (
    <section className="space-y-6">
      <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 md:p-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--color-primary)]">
              Lead Details
            </p>

            <div className="space-y-2">
              <h2
                className="text-3xl uppercase md:text-5xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {lead.company_name}
              </h2>

              <p className="text-[14px] leading-7 text-[var(--color-muted)]">
                Submitted on {formatDate(lead.created_at)}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 md:items-end">
            <div>
              <LeadStatusBadge status={lead.status} />
            </div>

            <div className="rounded-[2px] border border-white/10 bg-black/20 px-4 py-3 text-right">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Lead ID
              </p>
              <p className="mt-1 text-[13px] text-[var(--color-foreground)]">
                {lead.id}
              </p>
            </div>

            {onConvertToClient && (
              <button
                type="button"
                onClick={onConvertToClient}
                disabled={isConverting || isAlreadyConverted}
                className="rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAlreadyConverted
                  ? "Already Converted"
                  : isConverting
                    ? "Converting..."
                    : "Convert to Client"}
              </button>
            )}
          </div>
        </div>
      </div>

      {convertError ? (
        <div className="rounded-3xl border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] px-6 py-4">
          <p className="text-sm leading-7 text-[var(--color-error)]">
            {convertError}
          </p>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <LeadInfoRow label="Company Name" value={lead.company_name} />
        <LeadInfoRow label="Contact Name" value={fullName} />
        <LeadInfoRow label="Email" value={lead.email} />
        <LeadInfoRow label="Phone" value={lead.phone} />
        <LeadInfoRow label="Project Type" value={lead.project_type} />
        <LeadInfoRow label="Status" value={lead.status} />
        <LeadInfoRow label="Submitted" value={formatDate(lead.created_at)} />
        <LeadInfoRow label="Message" value={lead.message} fullWidth />
      </div>
    </section>
  );
}
