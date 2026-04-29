const {
  validateCreateProjectCheckoutSession,
} = require("../../../validators/project/validateCreateProjectCheckoutSession");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("validateCreateProjectCheckoutSession", () => {
  it("calls next when projectId exists and invoiceId is a string", () => {
    const req = {
      params: { projectId: "project-123" },
      body: { invoiceId: "invoice-123" },
    };

    const res = createMockRes();
    const next = jest.fn();

    validateCreateProjectCheckoutSession(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next when projectId exists and invoiceId is omitted", () => {
    const req = {
      params: { projectId: "project-123" },
      body: {},
    };

    const res = createMockRes();
    const next = jest.fn();

    validateCreateProjectCheckoutSession(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is missing", () => {
    const req = {
      params: {},
      body: {},
    };

    const res = createMockRes();
    const next = jest.fn();

    validateCreateProjectCheckoutSession(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project ID is required.",
    });
  });

  it("returns 400 when invoiceId is not a string", () => {
    const req = {
      params: { projectId: "project-123" },
      body: { invoiceId: 123 },
    };

    const res = createMockRes();
    const next = jest.fn();

    validateCreateProjectCheckoutSession(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invoice ID must be a string.",
    });
  });
});
