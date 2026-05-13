export type BillingType = "one_time" | "installments";

export type BillingPlanStatus = "draft" | "active" | "paused";

export type InvoiceStatus = "draft" | "unpaid";

export type CreateProjectBillingSetupPayload = {
  billingPlan: {
    billingType: BillingType;
    totalAmountCents: number;
    monthlyAmountCents: number | null;
    depositAmountCents: number | null;
    currency: string;
    startDate: string | null;
    endDate: string | null;
    status: BillingPlanStatus;
  };
  invoice: {
    invoiceNumber: string;
    amountCents: number;
    dueDate: string | null;
    invoiceStatus: InvoiceStatus;
    periodStart: string | null;
    periodEnd: string | null;
  };
};

export type CreatedBillingPlan = {
  id: string;
  projectId: string;
  billingType: BillingType;
  totalAmountCents: number;
  monthlyAmountCents: number | null;
  depositAmountCents: number | null;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  status: BillingPlanStatus | "cancelled" | "completed";
  createdAt: string;
};

export type CreatedInvoice = {
  id: string;
  projectId: string;
  billingPlanId: string;
  invoiceNumber: string;
  amountCents: number;
  amountPaidCents: number;
  balanceDueCents: number;
  currency: string;
  dueDate: string | null;
  status: InvoiceStatus | "paid" | "overdue" | "void";
  issuedAt: string;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
  createdAt: string;
};

export type CreateProjectBillingSetupResponse = {
  billingPlan: CreatedBillingPlan;
  invoice: CreatedInvoice;
};
