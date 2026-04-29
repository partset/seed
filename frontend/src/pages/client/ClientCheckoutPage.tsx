import { Link, Navigate, useParams } from "react-router-dom";
import CheckoutMockForm from "../../components/client/payments/CheckoutMockForm";
import PaymentHero from "../../components/client/payments/PaymentHero";
import PaymentSummaryCard from "../../components/client/payments/PaymentSummaryCard";
import { useProjectPaymentDetails } from "../../hooks/useProjectPaymentDetails";

export default function ClientCheckoutPage() {
  const { projectId } = useParams<{ projectId: string }>();

  const { paymentDetails, isLoading, error } =
    useProjectPaymentDetails(projectId);

  if (!projectId) {
    return <Navigate to="/client" replace />;
  }

  const paymentPath = `/client/${projectId}/payment`;

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[var(--color-background-dark)] px-6 py-10 text-[var(--color-foreground)] md:px-10">
        <section className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-white/5 px-6 py-12 text-center">
          <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Loading checkout details...
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
            Failed to load checkout details
          </p>

          <p className="mt-3 text-sm leading-7 text-red-100">{error}</p>

          <Link
            to={paymentPath}
            className="mt-6 inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
          >
            Back to Payment
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
            Checkout Details Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
            We could not find checkout details for this project.
          </p>

          <Link
            to={paymentPath}
            className="mt-6 inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
          >
            Back to Payment
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
          title="Checkout"
          description="Enter your payment details to complete the payment terms assigned to your invoice."
          action={
            <Link
              to={paymentPath}
              className="inline-flex items-center rounded-[2px] border border-white/10 px-4 py-3 text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
            >
              Back to Payment
            </Link>
          }
        />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <PaymentSummaryCard paymentDetails={paymentDetails} />

          <CheckoutMockForm
            paymentDetails={paymentDetails}
            backPath={paymentPath}
          />
        </div>
      </section>
    </main>
  );
}
