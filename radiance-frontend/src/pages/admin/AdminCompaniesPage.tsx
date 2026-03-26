import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CompanyGrid from "../../components/admin/companies/CompanyGrid";
import CompanyStatCard from "../../components/admin/companies/CompanyStatCard";
import { adminPortalMockCompanies } from "../../constants/adminPortalMockData";

export default function AdminCompaniesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    if (!normalizedSearchTerm) {
      return adminPortalMockCompanies;
    }

    return adminPortalMockCompanies.filter((company) => {
      return (
        company.name.toLowerCase().includes(normalizedSearchTerm) ||
        company.primaryEmail.toLowerCase().includes(normalizedSearchTerm)
      );
    });
  }, [searchTerm]);

  const totalProjects = useMemo(() => {
    return adminPortalMockCompanies.reduce((total, company) => {
      return total + company.projects.length;
    }, 0);
  }, []);
  const activeProjects = useMemo(() => {
    return adminPortalMockCompanies.reduce((total, company) => {
      return (
        total +
        company.projects.filter((project) => project.status === "active").length
      );
    }, 0);
  }, []);

  function handleCompanyClick(companyId: string) {
    navigate(`/admin/${companyId}`);
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl">
        <section className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Admin Portal
            </p>

            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1
                  className="text-5xl uppercase md:text-7xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Companies
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                  Review all active company relationships, open each account,
                  and move into project-level admin management.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <CompanyStatCard
                  label="Companies"
                  value={adminPortalMockCompanies.length}
                />
                <CompanyStatCard label="Projects" value={totalProjects} />
                <CompanyStatCard
                  label="Active Projects"
                  value={activeProjects}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2
                className="text-3xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Working Companies
              </h2>
              <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
                Click any company card to open its details and available
                projects.
              </p>
            </div>

            <label className="block w-full lg:max-w-sm">
              <span className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Search
              </span>
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by company or email"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>
          </div>
          <div className="mt-6">
            {filteredCompanies.length === 0 ? (
              <div className="rounded-3xl border border-white/10 bg-black/20 px-6 py-12 text-center">
                <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  No companies found
                </p>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  Try a different search term.
                </p>
              </div>
            ) : (
              <CompanyGrid
                companies={filteredCompanies}
                onCompanyClick={handleCompanyClick}
              />
            )}
          </div>
        </section>
      </section>
    </main>
  );
}
