const {
  validateProjectPaymentDetails,
} = require("../../../validators/project/validateProjectPaymentDetails");

function createMockRes() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("validateProjectPaymentDetails", () => {
  it("calls next when projectId exists", () => {
    const req = {
      params: { projectId: "project-123" },
    };

    const res = createMockRes();
    const next = jest.fn();

    validateProjectPaymentDetails(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is missing", () => {
    const req = {
      params: {},
    };

    const res = createMockRes();
    const next = jest.fn();

    validateProjectPaymentDetails(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project ID is required.",
    });
  });
});
