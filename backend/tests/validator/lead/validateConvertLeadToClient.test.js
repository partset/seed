const {
  validateConvertLeadToClient,
} = require("../../../validators/lead/validateConvertLeadToClient");

describe("validateConvertLeadToClient", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        id: "lead-123",
      },
      body: {
        companyName: "  Acme Co  ",
        projectType: "  Business Website  ",
        email: "  CLIENT@TEST.COM  ",
        phone: " 1234567890 ",
        projectName: "  Acme Site  ",
        firstName: "  Alex ",
        lastName: " Pham ",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("calls next and normalizes the request body when valid", () => {
    validateConvertLeadToClient(req, res, next);

    expect(req.body.companyName).toBe("Acme Co");
    expect(req.body.projectType).toBe("Business Website");
    expect(req.body.email).toBe("client@test.com");
    expect(req.body.phone).toBe("1234567890");
    expect(req.body.projectName).toBe("Acme Site");
    expect(req.body.firstName).toBe("Alex");
    expect(req.body.lastName).toBe("Pham");

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 400 when lead id is missing", () => {
    req.params.id = " ";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Lead id is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when company name is missing", () => {
    req.body.companyName = " ";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Company name is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when project type is missing", () => {
    req.body.projectType = " ";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project type is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", () => {
    req.body.email = " ";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Client email is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when email is invalid", () => {
    req.body.email = "not-an-email";

    validateConvertLeadToClient(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Valid client email is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("defaults optional values to empty strings when omitted", () => {
    req.body.phone = undefined;
    req.body.projectName = undefined;
    req.body.firstName = undefined;
    req.body.lastName = undefined;

    validateConvertLeadToClient(req, res, next);

    expect(req.body.phone).toBe("");
    expect(req.body.projectName).toBe("");
    expect(req.body.firstName).toBe("");
    expect(req.body.lastName).toBe("");

    expect(next).toHaveBeenCalledTimes(1);
  });
});
