jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

const db = require("../../../services/dbClient");

const {
  handleStripeWebhookService,
} = require("../../../services/stripe/handleStripeWebhookService");

describe("handleStripeWebhookService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("ignores unsupported event types", async () => {
    const event = {
      id: "evt_unsupported",
      type: "charge.succeeded",
      data: {
        object: {},
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "ignored",
      eventType: "charge.succeeded",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("skips duplicate checkout.session.completed events", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ id: "payment-event-123" }],
    });

    const event = {
      id: "evt_duplicate",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          mode: "payment",
          payment_status: "paid",
          payment_intent: "pi_123",
        },
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "skipped",
      reason: "Stripe event already processed.",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
  });

  it("skips unsupported checkout mode and inserts skipped payment event", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-event-123" }],
      });

    const event = {
      id: "evt_subscription",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          mode: "subscription",
          payment_status: "paid",
          payment_intent: "pi_123",
        },
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "skipped",
      reason: "Unsupported checkout mode: subscription",
    });

    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it("skips unpaid checkout session and inserts skipped payment event", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-event-123" }],
      });

    const event = {
      id: "evt_unpaid",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          mode: "payment",
          payment_status: "unpaid",
          payment_intent: "pi_123",
        },
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "skipped",
      reason: "Checkout session payment_status was unpaid",
    });

    expect(db.query).toHaveBeenCalledTimes(2);
  });

  it("throws when no matching payment is found and inserts failed payment event", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-event-123" }],
      });

    const event = {
      id: "evt_no_payment",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_missing",
          mode: "payment",
          payment_status: "paid",
          payment_intent: "pi_123",
        },
      },
    };

    await expect(handleStripeWebhookService(event)).rejects.toThrow(
      "No matching payment found for checkout session.",
    );

    expect(db.query).toHaveBeenCalledTimes(3);
  });

  it("skips when payment was already marked as succeeded", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "payment-123",
            invoice_id: "invoice-123",
            project_id: "project-123",
            company_id: "company-123",
            amount_cents: 250000,
            currency: "usd",
            status: "succeeded",
            provider_checkout_session_id: "cs_test_123",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [],
      })
      .mockResolvedValueOnce({
        rows: [{ id: "payment-event-123" }],
      });

    const event = {
      id: "evt_already_succeeded",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          mode: "payment",
          payment_status: "paid",
          payment_intent: "pi_123",
        },
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "skipped",
      reason: "Payment was already marked as succeeded.",
    });

    expect(db.query).toHaveBeenCalledTimes(4);
  });

  it("processes checkout.session.completed and updates payment, invoice, and payment event", async () => {
    db.query
      // hasAlreadyProcessedEvent
      .mockResolvedValueOnce({
        rows: [],
      })
      // findPaymentByCheckoutSessionId
      .mockResolvedValueOnce({
        rows: [
          {
            id: "payment-123",
            invoice_id: "invoice-123",
            project_id: "project-123",
            company_id: "company-123",
            amount_cents: 250000,
            currency: "usd",
            status: "pending",
            provider_checkout_session_id: "cs_test_123",
          },
        ],
      })
      // markPaymentSucceeded
      .mockResolvedValueOnce({
        rows: [
          {
            id: "payment-123",
            invoice_id: "invoice-123",
            project_id: "project-123",
            company_id: "company-123",
            amount_cents: 250000,
            currency: "usd",
            status: "succeeded",
          },
        ],
      })
      // updateInvoiceAfterPayment
      .mockResolvedValueOnce({
        rows: [
          {
            id: "invoice-123",
            invoice_number: "TEST-NGUYEN-001",
            amount_cents: 250000,
            amount_paid_cents: 250000,
            balance_due_cents: 0,
            status: "paid",
            paid_at: new Date("2026-04-29T19:49:35.000Z"),
          },
        ],
      })
      // insertPaymentEvent
      .mockResolvedValueOnce({
        rows: [{ id: "payment-event-123" }],
      });

    const event = {
      id: "evt_completed",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          mode: "payment",
          payment_status: "paid",
          payment_intent: "pi_123",
        },
      },
    };

    const result = await handleStripeWebhookService(event);

    expect(result).toEqual({
      status: "processed",
      paymentId: "payment-123",
      invoiceId: "invoice-123",
    });

    expect(db.query).toHaveBeenCalledTimes(5);

    expect(db.query).toHaveBeenNthCalledWith(3, expect.any(String), [
      "payment-123",
      "pi_123",
    ]);

    expect(db.query).toHaveBeenNthCalledWith(4, expect.any(String), [
      "invoice-123",
      250000,
    ]);
  });
});
