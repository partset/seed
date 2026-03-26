import type { AdminPortalCompanyRecord } from "../../../types/company";
import CompanyCard from "./CompanyCard";

interface CompanyGridProps {
  companies: AdminPortalCompanyRecord[];
  onCompanyClick?: (companyId: string) => void;
}

export default function CompanyGrid({
  companies,
  onCompanyClick,
}: CompanyGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {companies.map((company) => (
        <CompanyCard
          key={company.id}
          company={company}
          onClick={onCompanyClick}
        />
      ))}
    </div>
  );
}
