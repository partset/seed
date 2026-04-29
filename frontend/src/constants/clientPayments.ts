import type { ClientPaymentProject } from "../types/payment";

export const sampleClientPaymentProject: ClientPaymentProject = {
  id: "sample-project-id",
  companyName: "Apex Fitness",
  projectName: "SEO + Landing Pages",
  invoiceNumber: "INV-2026-001",
  dueDate: "2026-05-15",
  subtotal: 4200,
  tax: 0,
  total: 4200,
  currency: "USD",
  paymentPlanType: "installments",
  paymentPlanLabel: "Broken Down Payments",
  paymentScheduleLabel: "$1,400 × 3 payments",
  paymentDescription:
    "Your project payment has been split into three scheduled payments based on the payment terms set by our team.",
  lineItems: [
    {
      id: "strategy",
      label: "Content strategy and keyword planning",
      amount: 1200,
    },
    {
      id: "design",
      label: "Landing page design",
      amount: 1500,
    },
    {
      id: "development",
      label: "Frontend implementation",
      amount: 1500,
    },
  ],
};
