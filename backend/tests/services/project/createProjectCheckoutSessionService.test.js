const mockCheckoutSessionCreate = jest.fn();

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    checkout: {
      sessions: {
        create: mockCheckoutSessionCreate,
      },
    },
  }));
});

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

const db = require("../../../services/dbClient");

const {
  createProjectCheckoutSessionService,
  CheckoutSessionError,
} = require("../../../services/project/createProjectCheckoutSessionService");

describe("createProjectCheckoutSessionService", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();

    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: "sk_test_fake",
      FRONTEND_URL: "http://localhost:5173",
    };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("throws when STRIPE_SECRET_KEY is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "Stripe secret key is not configured.",
      statusCode: 500,
    });
  });

  it("throws when FRONTEND_URL is missing", async () => {
    delete process.env.FRONTEND_URL;

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "Frontend URL is not configured.",
      statusCode: 500,
    });
  });

  it("throws 404 when no payable invoice is found", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "No payable invoice was found for this project.",
      statusCode: 404,
    });
  });

  it("throws when billing type is monthly", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          billing_type: "monthly",
          balance_due_cents: 50000,
        },
      ],
    });

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "Monthly recurring payments are not supported yet.",
      statusCode: 400,
    });
  });

  it("throws when billing type is unsupported", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          billing_type: "weird_type",
          balance_due_cents: 50000,
        },
      ],
    });

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "Unsupported billing type.",
      statusCode: 400,
    });
  });

  it("throws when invoice balance is not payable", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          billing_type: "one_time",
          balance_due_cents: 0,
        },
      ],
    });

    await expect(
      createProjectCheckoutSessionService({
        projectId: "project-123",
        invoiceId: "invoice-123",
      }),
    ).rejects.toMatchObject({
      message: "Invoice does not have a payable balance.",
    });
  });

  it("creates pending payment, creates Stripe session, stores session id, and returns checkout URL", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [
          {
            project_id: "project-123",
            project_name: "Website Redesign",
            company_id: "company-123",
            company_name: "Nguyen Dental Studio",
            billing_plan_id: "billing-plan-123",
            billing_type: "one_time",
            invoice_id: "invoice-123",
            invoice_number: "TEST-NGUYEN-001",
            balance_due_cents: 250000,
            currency: "USD",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-123" }],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-123" }],
      });

    mockCheckoutSessionCreate.mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.com/test",
    });

    const result = await createProjectCheckoutSessionService({
      projectId: "project-123",
      invoiceId: "invoice-123",
    });

    expect(result).toEqual({
      checkoutUrl: "https://checkout.stripe.com/test",
    });

    expect(db.query).toHaveBeenNthCalledWith(1, expect.any(String), [
      "project-123",
      "invoice-123",
    ]);

    expect(db.query).toHaveBeenNthCalledWith(2, expect.any(String), [
      "invoice-123",
      "project-123",
      "company-123",
      250000,
      "usd",
    ]);

    expect(mockCheckoutSessionCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: "payment",
        success_url:
          "http://localhost:5173/client/project-123/payment/confirmation?session_id={CHECKOUT_SESSION_ID}",
        cancel_url:
          "http://localhost:5173/client/project-123/payment/checkout?canceled=true",
        metadata: expect.objectContaining({
          paymentId: "payment-123",
          projectId: "project-123",
          companyId: "company-123",
          invoiceId: "invoice-123",
          billingPlanId: "billing-plan-123",
          billingType: "one_time",
        }),
      }),
    );

    expect(db.query).toHaveBeenNthCalledWith(3, expect.any(String), [
      "cs_test_123",
      "payment-123",
    ]);
  });
});
