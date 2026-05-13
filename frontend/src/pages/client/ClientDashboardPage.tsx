import { useEffect, useState } from "react";
import { useClientAuth } from "../../hooks/useClientAuth";
import { Navigate, useParams } from "react-router-dom";
import ClientBillingPanel from "../../components/client/dashboard/ClientBillingPanel";
import ClientDocumentsPanel from "../../components/client/dashboard/ClientDocumentsPanel";
import ClientOverviewCard from "../../components/client/dashboard/ClientOverviewCard";
import ClientProgressTimeline from "../../components/client/dashboard/ClientProgressTimeline";
import ClientSupportPanel from "../../components/client/dashboard/ClientSupportPanel";
import ClientUpdatesPanel from "../../components/client/dashboard/ClientUpdatesPanel";
import { getProjectDetails } from "../../services/api/project/getProjectDetails/api";
import type { AdminPortalProjectRecord } from "../../types/company";

export default function ClientDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { session } = useClientAuth();

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [project, setProject] = useState<AdminPortalProjectRecord | null>(null);

  const accessToken = session?.access_token;

  useEffect(() => {
    async function loadProject() {
      if (!accessToken) {
        setError("No active client session found.");
        setIsLoading(false);
        return;
      }

      if (!projectId) {
        setError("No project ID provided in URL.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const data = await getProjectDetails(accessToken, projectId);
        setProject(data);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load project.";
        setError(message);
      } finally {
        setIsLoading(false);
      }
    }

    loadProject();
  }, [accessToken, projectId]);

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Loading project dashboard...
          </p>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-red-400/20 bg-red-400/10 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-red-200">
            Failed to load project dashboard
          </p>
          <p className="mt-3 text-sm leading-7 text-red-100">{error}</p>
        </section>
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Project Not Found
          </h1>
          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            We could not find this project. Please return to your projects page
            and open the project again.
          </p>
        </section>
      </main>
    );
  }

  const normalizedBillingStatus =
    project.billing?.rawStatus?.toLowerCase() ?? "";

  const payableStatuses = ["unpaid", "overdue"];

  const hasIssuedPayableInvoice =
    project.billing &&
    payableStatuses.includes(normalizedBillingStatus) &&
    (project.billing.balanceDueCents ?? 0) > 0;

  const balanceOverviewTitle = hasIssuedPayableInvoice
    ? (project.billing?.amountDue ?? "$0.00")
    : "$0.00";

  const balanceOverviewDescription = hasIssuedPayableInvoice
    ? `Your next invoice is currently due on ${
        project.invoiceDueDate || "No Due Date"
      }.`
    : normalizedBillingStatus === "draft"
      ? "Your invoice has not been issued yet."
      : normalizedBillingStatus === "paid"
        ? "Your current invoice has been paid."
        : "There is no payable invoice right now.";

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <div className="hero-grain relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 px-6 py-8 md:px-8 md:py-10">
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-[var(--color-primary)]">
                Client Portal
              </p>

              <h1
                className="text-5xl uppercase md:text-7xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Dashboard
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
                Stay up to date on your project, review shared files, and track
                the next steps needed to move your website forward.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Project
              </p>
              <p className="mt-1 text-2xl font-medium text-[var(--color-foreground)]">
                {project.name}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ClientOverviewCard
            eyebrow="Website Status"
            title={project.status}
            description="This is the current overall state of your project inside our workflow."
          />

          <ClientOverviewCard
            eyebrow="Current Phase"
            title={project.currentPhase || "No Phase"}
            description="This shows the stage your website is currently in right now."
          />

          <ClientOverviewCard
            eyebrow="Next Step"
            title={project.nextStep || "No Next Step"}
            description="This is the next action needed to keep the project moving smoothly."
          />

          <ClientOverviewCard
            eyebrow="Balance Due"
            title={balanceOverviewTitle}
            description={balanceOverviewDescription}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ClientUpdatesPanel updates={project.updates} />
            <ClientProgressTimeline milestones={project.milestones} />
          </div>

          <div className="space-y-6">
            <ClientDocumentsPanel documents={project.documents} />

            {project.billing ? (
              <ClientBillingPanel
                billing={project.billing}
                projectId={projectId}
              />
            ) : (
              <ClientBillingPanel
                projectId={projectId}
                billing={{
                  invoiceId: null,
                  invoiceLabel: "No Invoice Yet",
                  status: "Not Started",
                  rawStatus: "not_started",
                  balanceDueCents: 0,
                  amountDue: "$0.00",
                  dueDate: "No Due Date",
                }}
              />
            )}
          </div>
        </section>

        <ClientSupportPanel />
      </section>
    </main>
  );
}
