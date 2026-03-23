import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import LeadDetailsCard from "../../components/admin/leads/LeadDetailsCard";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { getLead } from "../../services/api/lead/getLead/api";
import type { Lead } from "../../types/lead";

export default function LeadDetailsPage() {
  const { leadId } = useParams<{ leadId: string }>();
  const { session } = useAdminAuth();
  const accessToken = session?.access_token;

  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function loadLead() {
      if (!accessToken) {
        setError("No active admin session found.");
        setIsLoading(false);
        return;
      }

      console.log("Lead ID from URL params: ", leadId);

      if (!leadId) {
        setError("Lead ID is missing.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const lead = await getLead(accessToken, leadId);

        if (!lead) {
          setError("Lead not found.");
          setLead(null);
          return;
        }

        setLead(lead);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load lead details.";

        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadLead();
  }, [accessToken, leadId]);

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Admin Portal
              </p>

              <h1
                className="text-5xl uppercase md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Lead Profile
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Review the full lead submission before moving the business into
                the next stage of your onboarding workflow.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/admin/leads"
                className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
              >
                Back to Leads
              </Link>

              <button
                type="button"
                onClick={() => navigate("/admin/leads")}
                className="inline-flex items-center rounded-[2px] border border-[var(--color-primary)] px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.08)]"
              >
                Close
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
              Loading lead details...
            </p>
          </div>
        ) : null}

        {!isLoading && error ? (
          <div className="rounded-3xl border border-[var(--color-error-border)] bg-[rgba(252,165,165,0.08)] px-6 py-8">
            <h2
              className="text-3xl uppercase"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Unable to Load Lead
            </h2>

            <p className="mt-3 text-sm leading-7 text-[var(--color-error)]">
              {error}
            </p>

            <div className="mt-6">
              <Link
                to="/admin/leads"
                className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
              >
                Return to Leads
              </Link>
            </div>
          </div>
        ) : null}

        {!isLoading && !error && lead ? <LeadDetailsCard lead={lead} /> : null}
      </section>
    </main>
  );
}
