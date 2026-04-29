export type ProjectBillingType = "one_time" | "monthly" | "installments";

export type ProjectBillingPlanStatus =
  | "draft"
  | "active"
  | "paused"
  | "completed"
  | "cancelled";

export type ProjectInvoiceStatus =
  | "draft"
  | "unpaid"
  | "paid"
  | "overdue"
  | "void";

export interface ProjectPaymentBillingPlan {
  id: string;
  billingType: ProjectBillingType;
  status: ProjectBillingPlanStatus;
  currency: string;
  totalAmountCents: number | null;
  monthlyAmountCents: number | null;
  depositAmountCents: number | null;
  startDate: string | null;
  endDate: string | null;
}

export interface ProjectPaymentInvoice {
  id: string;
  invoiceNumber: string;
  amountCents: number;
  amountPaidCents: number;
  balanceDueCents: number;
  currency: string;
  dueDate: string | null;
  status: ProjectInvoiceStatus;
  issuedAt: string | null;
  paidAt: string | null;
  periodStart: string | null;
  periodEnd: string | null;
}

export interface ProjectPaymentDetails {
  projectId: string;
  companyId: string;
  companyName: string;
  projectName: string;
  billingPlan: ProjectPaymentBillingPlan | null;
  invoice: ProjectPaymentInvoice | null;
}
