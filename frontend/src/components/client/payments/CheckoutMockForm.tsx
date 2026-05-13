import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProjectPaymentDetails } from "../../../types/projectPaymentDetails";
import { useClientAuth } from "../../../hooks/useClientAuth";
import { createProjectCheckoutSession } from "../../../services/api/project/createProjectCheckoutSession/api";

interface CheckoutMockFormProps {
  paymentDetails: ProjectPaymentDetails;
  backPath: string;
}

function getBillingTypeLabel(billingType: string) {
  if (billingType === "one_time") return "Single Payment";
  if (billingType === "installments") return "Broken Down Payments";
  if (billingType === "monthly") return "Recurring Monthly Payment";

  return "Payment Terms";
}

function formatCurrency(
  amountCents: number | null | undefined,
  currency: string,
) {
  const safeAmountCents = amountCents ?? 0;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(safeAmountCents / 100);
}

export default function CheckoutMockForm({
  paymentDetails,
  backPath,
}: CheckoutMockFormProps) {
  const { session } = useClientAuth();

  const [isRedirecting, setIsRedirecting] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const billingPlan = paymentDetails.billingPlan;
  const invoice = paymentDetails.invoice;

  const currency = invoice?.currency ?? billingPlan?.currency ?? "USD";

  const billingTypeLabel = billingPlan
    ? getBillingTypeLabel(billingPlan.billingType)
    : "No Billing Plan";

  const balanceDueLabel = formatCurrency(invoice?.balanceDueCents, currency);
  const payableStatuses = ["unpaid", "overdue"];

  const hasPayableInvoice =
    invoice &&
    payableStatuses.includes(invoice.status) &&
    invoice.balanceDueCents > 0;

  const isMonthlyPayment = billingPlan?.billingType === "monthly";

  const canStartCheckout =
    Boolean(session?.access_token) &&
    Boolean(paymentDetails.projectId) &&
    Boolean(hasPayableInvoice) &&
    !isMonthlyPayment &&
    !isRedirecting;

  async function handleStartStripeCheckout() {
    if (!session?.access_token) {
      setCheckoutError("No active client session found.");
      return;
    }

    if (!paymentDetails.projectId) {
      setCheckoutError("No project ID was found.");
      return;
    }

    if (!invoice) {
      setCheckoutError("No invoice was found for this project.");
      return;
    }

    if (!hasPayableInvoice) {
      if (invoice.status === "draft") {
        setCheckoutError("This invoice has not been issued yet.");
        return;
      }

      setCheckoutError("This invoice does not have a payable balance.");
      return;
    }
    if (isMonthlyPayment) {
      setCheckoutError("Monthly recurring payments are not supported yet.");
      return;
    }

    try {
      setIsRedirecting(true);
      setCheckoutError("");

      const result = await createProjectCheckoutSession(
        session.access_token,
        paymentDetails.projectId,
        {
          invoiceId: invoice.id,
        },
      );

      window.location.href = result.checkoutUrl;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to start Stripe checkout.";

      setCheckoutError(message);
      setIsRedirecting(false);
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Secure Checkout
        </p>

        <h2
          className="mt-3 text-3xl uppercase text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Payment Method
        </h2>

        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          You will be redirected to Stripe to complete your payment securely.
          Your card details are handled by Stripe, not stored by us.
        </p>
      </div>

      <div className="mt-8 space-y-5">
        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Assigned Payment Terms
          </p>

          <p className="mt-2 text-xl font-medium text-[var(--color-foreground)]">
            {billingTypeLabel}
          </p>

          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            {balanceDueLabel} currently due
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Invoice
          </p>

          <div className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
            <p>
              <span className="text-[var(--color-foreground)]">
                Invoice Number:
              </span>{" "}
              {invoice?.invoiceNumber ?? "No invoice assigned"}
            </p>

            <p>
              <span className="text-[var(--color-foreground)]">Status:</span>{" "}
              {invoice?.status ?? "Unavailable"}
            </p>

            <p>
              <span className="text-[var(--color-foreground)]">
                Balance Due:
              </span>{" "}
              {balanceDueLabel}
            </p>
          </div>
        </div>

        {isMonthlyPayment ? (
          <div className="rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-4 text-sm text-yellow-100">
            Monthly recurring payments are not available yet. Please contact
            support for help with this payment.
          </div>
        ) : null}

        {!hasPayableInvoice ? (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[var(--color-muted)]">
            {invoice?.status === "draft"
              ? "This invoice has not been issued yet. Please check back once it has been finalized."
              : "There is no payable invoice for this project right now."}
          </div>
        ) : null}

        {checkoutError ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {checkoutError}
          </div>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            to={backPath}
            className="inline-flex items-center justify-center rounded-[2px] border border-white/10 px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
          >
            Back
          </Link>

          <button
            type="button"
            onClick={handleStartStripeCheckout}
            disabled={!canStartCheckout}
            className="inline-flex flex-1 items-center justify-center rounded-[2px] border border-[var(--color-primary)] bg-[rgba(200,184,154,0.08)] px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.14)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRedirecting ? "Redirecting to Stripe..." : "Continue to Stripe"}
          </button>
        </div>
      </div>
    </section>
  );
}
