import type { ProjectPaymentDetails } from "../../../types/projectPaymentDetails";

interface PaymentSummaryCardProps {
  paymentDetails: ProjectPaymentDetails;
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

function formatDateLabel(date: string | null | undefined) {
  if (!date) return "No Due Date";

  return date;
}

export default function PaymentSummaryCard({
  paymentDetails,
}: PaymentSummaryCardProps) {
  const invoice = paymentDetails.invoice;
  const billingPlan = paymentDetails.billingPlan;

  const currency = invoice?.currency ?? billingPlan?.currency ?? "USD";
  const invoiceNumber = invoice?.invoiceNumber ?? "No Invoice Yet";
  const dueDate = formatDateLabel(invoice?.dueDate);

  const invoiceAmountCents = invoice?.amountCents ?? 0;
  const amountPaidCents = invoice?.amountPaidCents ?? 0;
  const balanceDueCents = invoice?.balanceDueCents ?? 0;

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Payment Details
          </p>

          <h2
            className="mt-3 text-3xl uppercase text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {paymentDetails.projectName}
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            {paymentDetails.companyName} · Invoice {invoiceNumber}
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">
            Balance Due
          </p>

          <p className="mt-1 text-3xl font-medium text-[var(--color-foreground)]">
            {formatCurrency(balanceDueCents, currency)}
          </p>

          <p className="mt-1 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
            Due {dueDate}
          </p>
        </div>
      </div>

      <div className="mt-8 divide-y divide-white/10 rounded-2xl border border-white/10 bg-black/20">
        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Invoice Amount
          </p>

          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {formatCurrency(invoiceAmountCents, currency)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Amount Paid
          </p>

          <p className="text-sm font-medium text-[var(--color-foreground)]">
            {formatCurrency(amountPaidCents, currency)}
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 px-5 py-4">
          <p className="text-sm leading-6 text-[var(--color-muted)]">
            Invoice Status
          </p>

          <p className="text-sm font-medium capitalize text-[var(--color-foreground)]">
            {invoice?.status ?? "No Invoice"}
          </p>
        </div>

        {invoice?.periodStart || invoice?.periodEnd ? (
          <div className="flex items-center justify-between gap-4 px-5 py-4">
            <p className="text-sm leading-6 text-[var(--color-muted)]">
              Billing Period
            </p>

            <p className="text-sm font-medium text-[var(--color-foreground)]">
              {formatDateLabel(invoice.periodStart)} -{" "}
              {formatDateLabel(invoice.periodEnd)}
            </p>
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-4 px-5 py-5">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-primary)]">
            Balance Due
          </p>

          <p className="text-lg font-medium text-[var(--color-foreground)]">
            {formatCurrency(balanceDueCents, currency)}
          </p>
        </div>
      </div>
    </section>
  );
}
