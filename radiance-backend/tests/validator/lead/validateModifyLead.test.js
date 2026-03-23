const {
  validateModifyLead,
} = require("../../../validators/lead/validateModifyLead");

describe("validateModifyLead", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: { id: "lead-123" },
      body: {
        status: "Contacted",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("calls next when request is valid", () => {
    validateModifyLead(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when id is missing", () => {
    req.params = {};

    validateModifyLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Lead id is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when no update fields are provided", () => {
    req.body = {};

    validateModifyLead(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "At least one field is required to update the lead",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts any one valid updatable field", () => {
    req.body = { firstName: "Alex" };

    validateModifyLead(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
