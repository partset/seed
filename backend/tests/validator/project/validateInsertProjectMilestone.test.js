const {
  validateInsertProjectMilestone,
} = require("../../../validators/project/validateInsertProjectMilestone");

function createMockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("validateInsertProjectMilestone", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      body: {
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        label: "Design Phase",
        displayOrder: 1,
        status: "upcoming",
      },
    };

    res = createMockResponse();
    next = jest.fn();
  });

  it("calls next when the request body is valid", () => {
    validateInsertProjectMilestone(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is missing", () => {
    req.body.projectId = "";

    validateInsertProjectMilestone(req, res, next);

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

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when label is missing", () => {
    req.body.label = "";

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid label",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when displayOrder is missing", () => {
    delete req.body.displayOrder;

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid display order",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when displayOrder is negative", () => {
    req.body.displayOrder = -1;

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid display order",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when displayOrder is not an integer", () => {
    req.body.displayOrder = "abc";

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid display order",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when status is missing", () => {
    req.body.status = "";

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid status",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when status is not allowed", () => {
    req.body.status = "blocked";

    validateInsertProjectMilestone(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid status",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("accepts allowed statuses regardless of casing", () => {
    req.body.status = "CURRENT";

    validateInsertProjectMilestone(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });
});
