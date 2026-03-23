import type { Lead } from "../../../types/lead";
import { formatDate } from "../../../utils/formatDate";
import LeadStatusBadge from "./LeadStatusBadge";

interface LeadsTableProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
}

export default function LeadsTable({ leads, onLeadClick }: LeadsTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Company
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Contact
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Website Type
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Status
              </th>
              <th className="px-6 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Submitted
              </th>
            </tr>
          </thead>

          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => onLeadClick?.(lead)}
                className="cursor-pointer border-t border-white/10 transition hover:bg-white/5"
              >
                <td className="px-6 py-5 align-top">
                  <div className="font-medium text-[var(--color-foreground)]">
                    {lead.company_name}
                  </div>
                </td>

                <td className="px-6 py-5 align-top">
                  <div>
                    {lead.first_name} {lead.last_name}
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">
                    {lead.email}
                  </div>
                  <div className="mt-1 text-sm text-[var(--color-muted)]">
                    {lead.phone}
                  </div>
                </td>

                <td className="px-6 py-5 align-top">
                  <span className="text-sm text-[var(--color-foreground)]">
                    {lead.project_type || "Not provided"}
                  </span>
                </td>

                <td className="px-6 py-5 align-top">
                  <LeadStatusBadge status={lead.status} />
                </td>

                <td className="px-6 py-5 align-top text-sm text-[var(--color-muted)]">
                  {formatDate(lead.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
