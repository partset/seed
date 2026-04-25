const {
  validateInsertProjectUpdate,
} = require("../../../validators/project/validateInsertProjectUpdate");

describe("validateInsertProjectUpdate", () => {
  let req;
  let res;
  let next;

  const validBody = {
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Phase 1 Complete",
    description: "We completed the first phase of the project.",
    isVisibleToClient: true,
    createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
  };

  beforeEach(() => {
    req = {
      body: { ...validBody },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("calls next when the request body is valid", () => {
    validateInsertProjectUpdate(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("trims title and description", () => {
    req.body.title = "  Phase 1 Complete  ";
    req.body.description = "  Description text  ";

    validateInsertProjectUpdate(req, res, next);

    expect(req.body.title).toBe("Phase 1 Complete");
    expect(req.body.description).toBe("Description text");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when projectId is missing", () => {
    req.body.projectId = "";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is not a valid UUID", () => {
    req.body.projectId = "not-a-valid-id";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when title is missing", () => {
    req.body.title = "";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Update Title",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when description is missing", () => {
    req.body.description = "";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Update Description",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when isVisibleToClient is not a boolean", () => {
    req.body.isVisibleToClient = "true";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Client Visibility Value",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when createdByAdminId is missing", () => {
    req.body.createdByAdminId = "";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Admin ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when createdByAdminId is not a valid UUID", () => {
    req.body.createdByAdminId = "not-a-valid-id";

    validateInsertProjectUpdate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Admin ID",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
