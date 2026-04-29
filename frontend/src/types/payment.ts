export type PaymentPlanType = "single" | "installments" | "recurring";

export interface PaymentLineItem {
  id: string;
  label: string;
  amount: number;
}

export interface ClientPaymentProject {
  id: string;
  companyName: string;
  projectName: string;
  invoiceNumber: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentPlanType: PaymentPlanType;
  paymentPlanLabel: string;
  paymentScheduleLabel: string;
  paymentDescription: string;
  lineItems: PaymentLineItem[];
}
