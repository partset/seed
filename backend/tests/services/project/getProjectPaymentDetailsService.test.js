jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

const db = require("../../../services/dbClient");

const {
  getProjectPaymentDetailsService,
} = require("../../../services/project/getProjectPaymentDetailsService");

describe("getProjectPaymentDetailsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns null when project is not found", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await getProjectPaymentDetailsService("missing-project");

    expect(result).toBeNull();
  });

  it("maps project payment details with billing plan and invoice", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          project_id: "project-123",
          company_id: "company-123",
          company_name: "Nguyen Dental Studio",
          project_name: "Website Redesign",

          billing_plan_id: "billing-plan-123",
          billing_type: "one_time",
          billing_status: "active",
          billing_currency: "USD",
          total_amount_cents: 250000,
          monthly_amount_cents: null,
          deposit_amount_cents: null,
          billing_start_date: new Date("2026-04-01T12:00:00.000Z"),
          billing_end_date: null,

          invoice_id: "invoice-123",
          invoice_number: "TEST-NGUYEN-001",
          amount_cents: 250000,
          amount_paid_cents: 250000,
          balance_due_cents: 0,
          invoice_currency: "USD",
          due_date: new Date("2026-05-15T12:00:00.000Z"),
          invoice_status: "paid",
          issued_at: new Date("2026-04-20T12:30:00.000Z"),
          paid_at: new Date("2026-04-29T19:49:35.000Z"),
          period_start: null,
          period_end: null,
        },
      ],
    });

    const result = await getProjectPaymentDetailsService("project-123");

    expect(result).toEqual({
      projectId: "project-123",
      companyId: "company-123",
      companyName: "Nguyen Dental Studio",
      projectName: "Website Redesign",
      billingPlan: {
        id: "billing-plan-123",
        billingType: "one_time",
        status: "active",
        currency: "USD",
        totalAmountCents: 250000,
        monthlyAmountCents: null,
        depositAmountCents: null,
        startDate: "2026-04-01",
        endDate: null,
      },
      invoice: {
        id: "invoice-123",
        invoiceNumber: "TEST-NGUYEN-001",
        amountCents: 250000,
        amountPaidCents: 250000,
        balanceDueCents: 0,
        currency: "USD",
        dueDate: "2026-05-15",
        status: "paid",
        issuedAt: "2026-04-20T12:30:00.000Z",
        paidAt: "2026-04-29T19:49:35.000Z",
        periodStart: null,
        periodEnd: null,
      },
    });
  });

  it("maps billingPlan and invoice as null when missing", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          project_id: "project-123",
          company_id: "company-123",
          company_name: "Nguyen Dental Studio",
          project_name: "Website Redesign",

          billing_plan_id: null,
          invoice_id: null,
        },
      ],
    });

    const result = await getProjectPaymentDetailsService("project-123");

    expect(result).toEqual({
      projectId: "project-123",
      companyId: "company-123",
      companyName: "Nguyen Dental Studio",
      projectName: "Website Redesign",
      billingPlan: null,
      invoice: null,
    });
  });
});
