const {
  validateConvertLeadToClient,
} = require("../../../validators/lead/validateConvertLeadToClient");

describe("validateConvertLeadToClient", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: { id: "lead-123" },
      body: {
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should call next when input is valid", () => {
    validateConvertLeadToClient(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 when lead id is missing", () => {
    req.params.id = "";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Lead id is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 when companyName is missing", () => {
    req.body.companyName = "";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Company name is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 400 when projectType is missing", () => {
    req.body.projectType = "";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project type is required",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
