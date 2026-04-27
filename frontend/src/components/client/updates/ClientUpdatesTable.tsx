// import type { ClientProjectUpdate } from "../../../types/clientPortal";
import type { ProjectUpdate } from "../../../types/projectUpdate";
import { formatDate } from "../../../utils/formatDate";
import ClientUpdateDescription from "./ClientUpdateDescription";

interface ClientUpdatesTableProps {
  updates: ProjectUpdate[];
}

export default function ClientUpdatesTable({
  updates,
}: ClientUpdatesTableProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed border-collapse">
          <colgroup>
            <col />
            <col style={{ width: "200px" }} />
          </colgroup>

          <thead className="bg-white/5">
            <tr className="text-left">
              <th className="px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Update
              </th>
              <th className="w-[180px] px-4 py-4 text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Date
              </th>
            </tr>
          </thead>

          <tbody>
            {updates.map((update) => (
              <tr
                key={update.id}
                className="border-t border-white/10 align-top transition hover:bg-white/5"
              >
                <td className="px-4 py-5 align-top">
                  <div className="w-full overflow-hidden pr-4">
                    <div className="whitespace-normal break-words [overflow-wrap:anywhere] font-medium text-[var(--color-foreground)]">
                      {update.title}
                    </div>

                    <ClientUpdateDescription description={update.description} />
                  </div>
                </td>

                <td className="w-[180px] px-4 py-5 align-top">
                  <div className="w-[180px] whitespace-normal text-sm text-[var(--color-foreground)]">
                    {formatDate(update.createdAt)}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
