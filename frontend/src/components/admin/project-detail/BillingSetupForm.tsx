import { useState } from "react";
import type {
  BillingType,
  BillingPlanStatus,
  CreateProjectBillingSetupResponse,
  InvoiceStatus,
} from "../../../types/projectBillingSetup";

type BillingSetupFormProps = {
  isCreatingBillingSetup: boolean;
  onCreateBillingSetup: (payload: {
    billingType: BillingType;
    totalAmountCents: number;
    depositAmountCents: number | null;
    currency: string;
    startDate: string | null;
    invoiceNumber: string;
    invoiceAmountCents: number;
    dueDate: string | null;
    billingPlanStatus: BillingPlanStatus;
    invoiceStatus: InvoiceStatus;
  }) => Promise<CreateProjectBillingSetupResponse | void>;
};

function convertDollarStringToCents(value: string): number {
  const normalizedValue = value.trim();

  if (!normalizedValue) {
    return 0;
  }

  const dollarAmount = Number(normalizedValue);

  if (Number.isNaN(dollarAmount)) {
    return 0;
  }

  return Math.round(dollarAmount * 100);
}

export default function BillingSetupForm({
  isCreatingBillingSetup,
  onCreateBillingSetup,
}: BillingSetupFormProps) {
  const [billingType, setBillingType] = useState<BillingType>("one_time");
  const [totalAmount, setTotalAmount] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [startDate, setStartDate] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [invoiceAmount, setInvoiceAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [billingPlanStatus, setBillingPlanStatus] =
    useState<BillingPlanStatus>("active");
  const [invoiceStatus, setInvoiceStatus] = useState<InvoiceStatus>("unpaid");
  const [formError, setFormError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const totalAmountCents = convertDollarStringToCents(totalAmount);
    const depositAmountCents = depositAmount
      ? convertDollarStringToCents(depositAmount)
      : null;
    const invoiceAmountCents = convertDollarStringToCents(invoiceAmount);

    if (totalAmountCents <= 0) {
      setFormError("Total amount must be greater than $0.");
      return;
    }

    if (!invoiceNumber.trim()) {
      setFormError("Invoice number is required.");
      return;
    }

    if (invoiceAmountCents <= 0) {
      setFormError("Invoice amount must be greater than $0.");
      return;
    }

    if (invoiceAmountCents > totalAmountCents) {
      setFormError("Invoice amount cannot be greater than total amount.");
      return;
    }

    if (
      billingType === "installments" &&
      depositAmountCents !== null &&
      depositAmountCents > totalAmountCents
    ) {
      setFormError("Deposit amount cannot be greater than total amount.");
      return;
    }

    setFormError("");

    const result = await onCreateBillingSetup({
      billingType,
      totalAmountCents,
      depositAmountCents,
      currency: currency.trim().toUpperCase() || "USD",
      startDate: startDate || null,
      invoiceNumber: invoiceNumber.trim(),
      invoiceAmountCents,
      dueDate: dueDate || null,
      billingPlanStatus,
      invoiceStatus,
    });

    if (result) {
      setBillingType("one_time");
      setTotalAmount("");
      setDepositAmount("");
      setCurrency("USD");
      setStartDate("");
      setInvoiceNumber("");
      setInvoiceAmount("");
      setDueDate("");
      setBillingPlanStatus("active");
      setInvoiceStatus("unpaid");
    }
  }

  return (
    <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20">
      <div className="flex flex-col gap-2">
        <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-primary)]">
          Billing
        </p>

        <h2
          className="text-3xl uppercase text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Create Invoice
        </h2>

        <p className="max-w-3xl text-sm leading-7 text-[var(--color-muted)]">
          Create a billing plan and first invoice for this project. For now,
          monthly subscriptions are intentionally excluded.
        </p>
      </div>

      {formError && (
        <p className="mt-5 rounded-2xl border border-[var(--color-error-border)] bg-[var(--color-error)]/10 px-4 py-3 text-sm text-[var(--color-error)]">
          {formError}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-5">
        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Billing Type
            <select
              value={billingType}
              onChange={(event) =>
                setBillingType(event.target.value as BillingType)
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="one_time">Single Payment</option>
              <option value="installments">Broken Down Payments</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Currency
            <input
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              maxLength={3}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 uppercase text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              placeholder="USD"
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Total Project Amount
            <input
              value={totalAmount}
              onChange={(event) => setTotalAmount(event.target.value)}
              inputMode="decimal"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
              placeholder="2500.00"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Deposit Amount
            <input
              value={depositAmount}
              onChange={(event) => setDepositAmount(event.target.value)}
              inputMode="decimal"
              disabled={billingType === "one_time"}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)] disabled:cursor-not-allowed disabled:opacity-50"
              placeholder={
                billingType === "one_time" ? "Not needed" : "1000.00"
              }
            />
          </label>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Billing Start Date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            />
          </label>

          <label className="grid gap-2 text-sm text-[var(--color-muted)]">
            Billing Plan Status
            <select
              value={billingPlanStatus}
              onChange={(event) =>
                setBillingPlanStatus(event.target.value as BillingPlanStatus)
              }
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="paused">Paused</option>
            </select>
          </label>
        </div>

        <div className="mt-2 rounded-3xl border border-white/10 bg-black/20 p-5">
          <h3 className="text-lg font-semibold text-[var(--color-foreground)]">
            Invoice Details
          </h3>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--color-muted)]">
              Invoice Number
              <input
                value={invoiceNumber}
                onChange={(event) => setInvoiceNumber(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                placeholder="TEST-INV-001"
              />
            </label>

            <label className="grid gap-2 text-sm text-[var(--color-muted)]">
              Invoice Amount
              <input
                value={invoiceAmount}
                onChange={(event) => setInvoiceAmount(event.target.value)}
                inputMode="decimal"
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]"
                placeholder="2500.00"
              />
            </label>
          </div>

          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-[var(--color-muted)]">
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(event) => setDueDate(event.target.value)}
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            <label className="grid gap-2 text-sm text-[var(--color-muted)]">
              Invoice Status
              <select
                value={invoiceStatus}
                onChange={(event) =>
                  setInvoiceStatus(event.target.value as InvoiceStatus)
                }
                className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-[var(--color-foreground)] outline-none transition focus:border-[var(--color-primary)]"
              >
                <option value="unpaid">Unpaid - Client Can Pay</option>
                <option value="draft">Draft - Internal Prep</option>
              </select>
            </label>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs leading-6 text-[var(--color-muted)]">
            Amounts are entered in dollars and sent to the backend as cents.
          </p>

          <button
            type="submit"
            disabled={isCreatingBillingSetup}
            className="rounded-full bg-[var(--color-primary)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isCreatingBillingSetup ? "Creating..." : "Create Billing Setup"}
          </button>
        </div>
      </form>
    </section>
  );
}
