import { Link, Navigate, useParams } from "react-router-dom";
import AssignedPaymentTermsCard from "../../components/client/payments/AssignedPaymentTermsCard";
import PaymentHero from "../../components/client/payments/PaymentHero";
import PaymentSummaryCard from "../../components/client/payments/PaymentSummaryCard";
import { useProjectPaymentDetails } from "../../hooks/useProjectPaymentDetails";

export default function ClientPaymentPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { paymentDetails, isLoading, error } =
    useProjectPaymentDetails(projectId);

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  const projectPath = `/client/${projectId}`;
  const checkoutPath = `/client/${projectId}/payment/checkout`;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Loading payment details...
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
            Failed to load payment details
          </p>

          <p className="mt-3 text-sm leading-7 text-red-100">{error}</p>

          <Link
            to={projectPath}
            className="mt-6 inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
          >
            Back to Project
          </Link>
        </section>
      </main>
    );
  }

  if (!paymentDetails) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <h1
            className="text-4xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payment Details Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            We could not find payment details for this project.
          </p>

          <Link
            to={projectPath}
            className="mt-6 inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
          >
            Back to Project
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
      <section className="mx-auto max-w-7xl space-y-8">
        <PaymentHero
          eyebrow="Client Portal"
          title="Payment"
          description="Review your invoice details and assigned payment terms before continuing to checkout."
          action={
            <Link
              to={projectPath}
              className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
            >
              Back to Project
            </Link>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <PaymentSummaryCard paymentDetails={paymentDetails} />

          <AssignedPaymentTermsCard
            paymentDetails={paymentDetails}
            checkoutPath={checkoutPath}
          />
        </div>
      </section>
    </main>
  );
}
