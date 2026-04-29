const mockConstructEvent = jest.fn();

jest.mock("stripe", () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: mockConstructEvent,
    },
  }));
});

jest.mock("../../../services/stripe/handleStripeWebhookService", () => ({
  handleStripeWebhookService: jest.fn(),
}));

const { stripeWebhook } = require("../../../controllers/stripe/stripeWebhook");

const {
  handleStripeWebhookService,
} = require("../../../services/stripe/handleStripeWebhookService");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
    send: jest.fn(),
  };
}

describe("stripeWebhook controller", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});

    process.env = {
      ...originalEnv,
      STRIPE_SECRET_KEY: "sk_test_fake",
      STRIPE_WEBHOOK_SECRET: "whsec_fake",
    };
  });

  afterEach(() => {
    console.error.mockRestore();
    process.env = originalEnv;
  });

  it("returns 500 if webhook secret is missing", async () => {
    delete process.env.STRIPE_WEBHOOK_SECRET;

    const req = {
      headers: {
        "stripe-signature": "signature",
      },
      body: Buffer.from("{}"),
    };

    const res = createMockRes();

    await stripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith(
      "Stripe webhook secret is not configured.",
    );
  });

  it("returns 400 if Stripe signature verification fails", async () => {
    const req = {
      headers: {
        "stripe-signature": "bad-signature",
      },
      body: Buffer.from("{}"),
    };

    const res = createMockRes();

    mockConstructEvent.mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    await stripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith("Webhook Error: Invalid signature");
  });

  it("returns 200 when webhook is verified and handled", async () => {
    const event = {
      id: "evt_123",
      type: "checkout.session.completed",
    };

    const req = {
      headers: {
        "stripe-signature": "valid-signature",
      },
      body: Buffer.from("{}"),
    };

    const res = createMockRes();

    mockConstructEvent.mockReturnValue(event);
    handleStripeWebhookService.mockResolvedValue({
      status: "processed",
    });

    await stripeWebhook(req, res);

    expect(mockConstructEvent).toHaveBeenCalledWith(
      req.body,
      "valid-signature",
      "whsec_fake",
    );

    expect(handleStripeWebhookService).toHaveBeenCalledWith(event);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      received: true,
    });
  });

  it("returns 500 when webhook service fails", async () => {
    const event = {
      id: "evt_123",
      type: "checkout.session.completed",
    };

    const req = {
      headers: {
        "stripe-signature": "valid-signature",
      },
      body: Buffer.from("{}"),
    };

    const res = createMockRes();

    mockConstructEvent.mockReturnValue(event);
    handleStripeWebhookService.mockRejectedValue(
      new Error("Webhook handling failed"),
    );

    await stripeWebhook(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      received: false,
      error: "Failed to handle Stripe webhook.",
    });
  });
});
