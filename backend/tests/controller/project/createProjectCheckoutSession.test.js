jest.mock(
  "../../../services/project/createProjectCheckoutSessionService",
  () => {
    class MockCheckoutSessionError extends Error {
      constructor(message, statusCode = 400) {
        super(message);
        this.name = "CheckoutSessionError";
        this.statusCode = statusCode;
      }
    }

    return {
      createProjectCheckoutSessionService: jest.fn(),
      CheckoutSessionError: MockCheckoutSessionError,
    };
  },
);

const {
  createProjectCheckoutSession,
} = require("../../../controllers/project/createProjectCheckoutSession");

const {
  createProjectCheckoutSessionService,
  CheckoutSessionError,
} = require("../../../services/project/createProjectCheckoutSessionService");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("createProjectCheckoutSession controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    console.error.mockRestore();
  });

  it("returns 201 with checkout session data", async () => {
    const req = {
      params: { projectId: "project-123" },
      body: { invoiceId: "invoice-123" },
    };

    const res = createMockRes();

    createProjectCheckoutSessionService.mockResolvedValue({
      checkoutUrl: "https://checkout.stripe.com/test",
    });

    await createProjectCheckoutSession(req, res);

    expect(createProjectCheckoutSessionService).toHaveBeenCalledWith({
      projectId: "project-123",
      invoiceId: "invoice-123",
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        checkoutUrl: "https://checkout.stripe.com/test",
      },
      error: "",
    });
  });

  it("handles missing request body safely", async () => {
    const req = {
      params: { projectId: "project-123" },
    };

    const res = createMockRes();

    createProjectCheckoutSessionService.mockResolvedValue({
      checkoutUrl: "https://checkout.stripe.com/test",
    });

    await createProjectCheckoutSession(req, res);

    expect(createProjectCheckoutSessionService).toHaveBeenCalledWith({
      projectId: "project-123",
      invoiceId: undefined,
    });

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it("returns service error status for CheckoutSessionError", async () => {
    const req = {
      params: { projectId: "project-123" },
      body: { invoiceId: "invoice-123" },
    };

    const res = createMockRes();

    createProjectCheckoutSessionService.mockRejectedValue(
      new CheckoutSessionError(
        "No payable invoice was found for this project.",
        404,
      ),
    );

    await createProjectCheckoutSession(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "No payable invoice was found for this project.",
    });
  });

  it("returns 500 for unexpected errors", async () => {
    const req = {
      params: { projectId: "project-123" },
      body: { invoiceId: "invoice-123" },
    };

    const res = createMockRes();

    createProjectCheckoutSessionService.mockRejectedValue(
      new Error("Database exploded"),
    );

    await createProjectCheckoutSession(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Failed to create checkout session.",
    });
  });
});
