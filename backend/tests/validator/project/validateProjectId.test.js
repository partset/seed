const {
  validateProjectId,
} = require("../../../validators/project/validateProjectId");

describe("validateProjectId", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("returns 400 if projectId is missing", () => {
    validateProjectId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project id is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 if projectId is not a valid UUID", () => {
    req.params.projectId = "not-a-valid-id";

    validateProjectId(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid project id",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if projectId is valid", () => {
    req.params.projectId = "550e8400-e29b-41d4-a716-446655440000";

    validateProjectId(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
