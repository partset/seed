import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LeadsTable from "../../components/admin/leads/LeadsTable";
import { getAllLeads } from "../../services/api/lead/getAllLeads/api";
import type { Lead } from "../../types/lead";
import { useAdminAuth } from "../../hooks/useAdminAuth";

export default function LeadsPage() {
  const { session } = useAdminAuth();
  const accessToken = session?.access_token;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadLeads() {
      if (!accessToken) {
        setError("No active admin session found.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getAllLeads(accessToken);
        console.log("Fetched leads: ", data);
        setLeads(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load leads.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadLeads();
  }, [accessToken]);

  function handleLeadClick(lead: Lead) {
    navigate(`/admin/leads/${lead.id}`);
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10">
            <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
              Admin Portal
            </p>

            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h1
                  className="text-5xl uppercase md:text-7xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Leads
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                  Review incoming businesses that submitted the public contact
                  form. This page is the starting point for your team’s sales
                  and onboarding workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                  Total Leads
                </p>
                <p className="mt-1 text-2xl font-medium text-[var(--color-foreground)]">
                  {isLoading ? "--" : leads.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          {isLoading ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Loading leads...
              </p>
            </div>
          ) : null}

          {!isLoading && error ? (
            <div className="rounded-3xl border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] px-6 py-5">
              <p className="text-sm font-medium text-[var(--color-error)]">
                {error}
              </p>
            </div>
          ) : null}

          {!isLoading && !error && leads.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
              <h2
                className="text-3xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                No Leads Yet
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                Once businesses submit the public lead form, they will appear
                here for the admin team to review.
              </p>
            </div>
          ) : null}

          {!isLoading && !error && leads.length > 0 ? (
            <LeadsTable leads={leads} onLeadClick={handleLeadClick} />
          ) : null}
        </section>
      </section>
    </main>
  );
}
