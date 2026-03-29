import { Navigate, useParams } from "react-router-dom";
import ClientBillingPanel from "../../components/client/dashboard/ClientBillingPanel";
import ClientDocumentsPanel from "../../components/client/dashboard/ClientDocumentsPanel";
import ClientOverviewCard from "../../components/client/dashboard/ClientOverviewCard";
import ClientProgressTimeline from "../../components/client/dashboard/ClientProgressTimeline";
import ClientSupportPanel from "../../components/client/dashboard/ClientSupportPanel";
import ClientUpdatesPanel from "../../components/client/dashboard/ClientUpdatesPanel";
import { clientProjectDetailsById } from "../../constants/clientPortalMockData";

export default function ClientDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  const project = clientProjectDetailsById[projectId];

  if (!project) {
    return <Navigate to="/client" replace />;
  }

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
                {project.summary.projectName}
              </p>
            </div>
          </div>
        </div>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <ClientOverviewCard
            eyebrow="Website Status"
            title={project.summary.websiteStatus}
            description="This is the current overall state of your project inside our workflow."
          />

          <ClientOverviewCard
            eyebrow="Current Phase"
            title={project.summary.currentPhase}
            description="This shows the stage your website is currently in right now."
          />

          <ClientOverviewCard
            eyebrow="Next Step"
            title={project.summary.nextStep}
            description="This is the next action needed to keep the project moving smoothly."
          />

          <ClientOverviewCard
            eyebrow="Balance Due"
            title={project.summary.balanceDue}
            description={`Your next invoice is currently due on ${project.summary.invoiceDueDate}.`}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ClientUpdatesPanel updates={project.updates} />
            <ClientProgressTimeline milestones={project.milestones} />
          </div>

          <div className="space-y-6">
            <ClientDocumentsPanel documents={project.documents} />
            <ClientBillingPanel billing={project.billing} />
          </div>
        </section>

        <ClientSupportPanel support={project.support} />
      </section>
    </main>
  );
}
