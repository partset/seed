import { Link } from "react-router-dom";
import type { ProjectPaymentDetails } from "../../../types/projectPaymentDetails";

interface PaymentConfirmationCardProps {
  paymentDetails: ProjectPaymentDetails;
  projectPath: string;
  paymentPath: string;
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

function getStatusLabel(status: string | undefined) {
  if (!status) return "Unavailable";

  return status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PaymentConfirmationCard({
  paymentDetails,
  projectPath,
  paymentPath,
}: PaymentConfirmationCardProps) {
  const billingPlan = paymentDetails.billingPlan;
  const invoice = paymentDetails.invoice;

  const currency = invoice?.currency ?? billingPlan?.currency ?? "USD";

  const billingTypeLabel = billingPlan
    ? getBillingTypeLabel(billingPlan.billingType)
    : "No Billing Plan";

  const balanceDueLabel = formatCurrency(invoice?.balanceDueCents, currency);
  const amountPaidLabel = formatCurrency(invoice?.amountPaidCents, currency);

  const isPaid = invoice?.status === "paid";
  const hasInvoice = Boolean(invoice);

  const cardBorderClass = isPaid
    ? "border-[rgba(134,239,172,0.35)] bg-[rgba(134,239,172,0.08)]"
    : "border-[rgba(250,204,21,0.35)] bg-[rgba(250,204,21,0.08)]";

  const eyebrowClass = isPaid
    ? "text-[var(--color-success)]"
    : "text-yellow-200";

  const title = isPaid ? "Payment Received" : "Payment Submitted";

  const description = isPaid
    ? "Your payment has been confirmed by Stripe and your invoice has been marked as paid."
    : "Your payment was submitted through Stripe. If the invoice still shows a balance, the webhook may still be processing or the invoice has not been marked as paid yet.";

  return (
    <section className={`rounded-3xl border p-6 ${cardBorderClass}`}>
      <p className={`text-xs uppercase tracking-[0.2em] ${eyebrowClass}`}>
        Payment Confirmation
      </p>

      <h2
        className="mt-4 text-4xl uppercase text-[var(--color-foreground)] md:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {title}
      </h2>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--color-muted)] md:text-base">
        {description}
      </p>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Invoice Status
        </p>

        <p className="mt-2 text-xl font-medium text-[var(--color-foreground)]">
          {hasInvoice ? getStatusLabel(invoice?.status) : "No Invoice Found"}
        </p>

        <div className="mt-4 grid gap-4 text-sm text-[var(--color-muted)] sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Amount Paid
            </p>

            <p className="mt-1 text-[var(--color-foreground)]">
              {amountPaidLabel}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
              Balance Due
            </p>

            <p className="mt-1 text-[var(--color-foreground)]">
              {balanceDueLabel}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Assigned Payment Terms
        </p>

        <p className="mt-2 text-xl font-medium text-[var(--color-foreground)]">
          {billingTypeLabel}
        </p>
      </div>

      {!isPaid ? (
        <div className="mt-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/10 p-4 text-sm leading-7 text-yellow-100">
          If you just completed checkout, refresh this page in a moment. Stripe
          webhooks usually update quickly, but the redirect can sometimes happen
          before the database update is visible.
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          to={projectPath}
          className="inline-flex items-center justify-center rounded-[2px] border border-[var(--color-primary)] px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.08)]"
        >
          Back to Project
        </Link>

        <Link
          to={paymentPath}
          className="inline-flex items-center justify-center rounded-[2px] border border-white/10 px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-foreground)] transition duration-200 hover:bg-white/5"
        >
          View Payment Details
        </Link>
      </div>
    </section>
  );
}
