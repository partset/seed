import { Link } from "react-router-dom";
import type { ProjectPaymentDetails } from "../../../types/projectPaymentDetails";

interface AssignedPaymentTermsCardProps {
  paymentDetails: ProjectPaymentDetails;
  checkoutPath: string;
}

function getBillingTypeLabel(billingType: string) {
  if (billingType === "one_time") return "Single Payment";
  if (billingType === "installments") return "Broken Down Payments";
  if (billingType === "monthly") return "Recurring Monthly Payment";

  return "Payment Terms";
}

function getPaymentScheduleLabel(paymentDetails: ProjectPaymentDetails) {
  const { billingPlan, invoice } = paymentDetails;

  if (!billingPlan) {
    return "No billing plan has been assigned yet.";
  }

  const currency = invoice?.currency ?? billingPlan.currency ?? "USD";

  const formatCurrency = (amountCents: number | null | undefined) => {
    if (amountCents === null || amountCents === undefined) return "Not set";

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amountCents / 100);
  };

  const isPaid = invoice?.status === "paid";
  const balanceDueCents = invoice?.balanceDueCents ?? null;

  if (isPaid || balanceDueCents === 0) {
    return "Paid in full";
  }

  if (billingPlan.billingType === "one_time") {
    return `${formatCurrency(balanceDueCents ?? billingPlan.totalAmountCents)} due`;
  }

  if (billingPlan.billingType === "installments") {
    return `${formatCurrency(balanceDueCents ?? billingPlan.depositAmountCents)} currently due`;
  }

  if (billingPlan.billingType === "monthly") {
    return `${formatCurrency(billingPlan.monthlyAmountCents)} per month`;
  }

  return "Payment schedule unavailable.";
}

function getPaymentDescription(paymentDetails: ProjectPaymentDetails) {
  const billingType = paymentDetails.billingPlan?.billingType;

  if (billingType === "one_time") {
    return "Your project has been assigned a single payment. Please review the invoice details before continuing to checkout.";
  }

  if (billingType === "installments") {
    return "Your project has been assigned broken down payments. The current invoice reflects the amount due for this payment period.";
  }

  if (billingType === "monthly") {
    return "Your project has been assigned recurring monthly payments based on the billing terms set by our team.";
  }

  return "No billing terms have been assigned to this project yet.";
}

export default function AssignedPaymentTermsCard({
  paymentDetails,
  checkoutPath,
}: AssignedPaymentTermsCardProps) {
  const billingPlan = paymentDetails.billingPlan;
  const hasPayableInvoice =
    paymentDetails.invoice &&
    paymentDetails.invoice.status !== "paid" &&
    paymentDetails.invoice.status !== "void" &&
    paymentDetails.invoice.balanceDueCents > 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
          Assigned Payment Terms
        </p>

        <h2
          className="mt-3 text-3xl uppercase text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {billingPlan
            ? getBillingTypeLabel(billingPlan.billingType)
            : "No Billing Plan"}
        </h2>

        <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
          {getPaymentDescription(paymentDetails)}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Payment Schedule
        </p>

        <p className="mt-2 text-2xl font-medium text-[var(--color-foreground)]">
          {getPaymentScheduleLabel(paymentDetails)}
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-white/10 bg-black/20 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
          Important Note
        </p>

        <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
          These payment terms were set by our team. If you believe something is
          incorrect, please contact us before submitting payment.
        </p>
      </div>

      {hasPayableInvoice ? (
        <Link
          to={checkoutPath}
          className="mt-8 inline-flex w-full items-center justify-center rounded-[2px] border border-[var(--color-primary)] bg-[rgba(200,184,154,0.08)] px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-primary)] transition duration-200 hover:bg-[rgba(200,184,154,0.14)]"
        >
          Proceed to Checkout
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-8 inline-flex w-full cursor-not-allowed items-center justify-center rounded-[2px] border border-white/10 px-4 py-3 text-center text-[12px] uppercase tracking-[0.18em] text-[var(--color-muted)] opacity-50"
        >
          No Payable Invoice
        </button>
      )}
    </section>
  );
}
