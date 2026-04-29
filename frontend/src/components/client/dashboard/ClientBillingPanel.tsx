import { Link } from "react-router-dom";
import type { ClientBillingSummary } from "../../../types/clientPortal";

interface ClientBillingPanelProps {
  billing: ClientBillingSummary;
  projectId: string;
}

function normalizeStatus(status: string | null | undefined) {
  return status?.trim().toLowerCase() ?? "";
}

export default function ClientBillingPanel({
  billing,
  projectId,
}: ClientBillingPanelProps) {
  const paymentPath = `/client/${projectId}/payment`;

  const normalizedStatus = normalizeStatus(billing.status);

  const hasInvoice = billing.invoiceLabel !== "No Invoice Yet";
  const isPaid = normalizedStatus === "paid";
  const hasAmountDue = billing.amountDue !== "$0.00";

  const hasPayableInvoice = hasInvoice && !isPaid && hasAmountDue;

  const amountDueLabel = isPaid ? "$0.00" : billing.amountDue;
  const statusLabel = hasInvoice ? billing.status : "No Invoice";

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-5 md:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-primary)]">
            Billing
          </p>

          <h2
            className="mt-3 text-3xl uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Invoice Snapshot
          </h2>

          <p className="mt-2 text-sm leading-7 text-[var(--color-muted)]">
            Review your current invoice status and upcoming payment deadline.
          </p>
        </div>
      </div>

      <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Current Invoice
              </p>

              <h3
                className="mt-2 text-3xl uppercase"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {billing.invoiceLabel}
              </h3>
            </div>

            <div className="rounded-[2px] border border-white/10 bg-white/5 px-4 py-3 text-left md:text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Status
              </p>

              <p className="mt-1 text-sm text-[var(--color-foreground)]">
                {statusLabel}
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Amount Due
              </p>

              <p className="mt-2 text-xl text-[var(--color-foreground)]">
                {amountDueLabel}
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-muted)]">
                Due Date
              </p>

              <p className="mt-2 text-xl text-[var(--color-foreground)]">
                {billing.dueDate}
              </p>
            </div>
          </div>

          <div>
            {hasPayableInvoice ? (
              <Link
                to={paymentPath}
                className="inline-flex rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black transition hover:opacity-90"
              >
                Pay Now
              </Link>
            ) : isPaid ? (
              <Link
                to={paymentPath}
                className="inline-flex rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-[var(--color-foreground)] transition hover:bg-white/10"
              >
                View Payment Details
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="rounded-full border border-white/10 bg-[var(--color-primary)] px-5 py-3 text-sm font-medium uppercase tracking-[0.12em] text-black opacity-40 disabled:cursor-not-allowed"
              >
                No Invoice
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
