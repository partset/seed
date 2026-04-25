const {
  validateModifyProjectDetails,
} = require("../../../validators/project/validateModifyProjectDetails");

function createMockResponse() {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
}

describe("validateModifyProjectDetails", () => {
  it("calls next for a valid name update", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        name: "Updated Project",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("calls next for valid nullable fields set to null", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        nextStep: null,
        targetLaunchDate: null,
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("rejects missing projectId", () => {
    const req = {
      params: {},
      body: {
        name: "Updated Project",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project id is required",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an empty request body", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {},
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "At least one field is required to update the project details",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects unknown fields", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        randomField: "bad",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Unknown field(s): randomField",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects an empty name", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        name: "   ",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "name cannot be empty",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid status", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        status: "invalid_status",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error:
        "Invalid project status. Allowed statuses are: planned, active, on_hold, completed, cancelled",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("rejects invalid startDate format", () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        startDate: "04/25/2026",
      },
    };

    const res = createMockResponse();
    const next = jest.fn();

    validateModifyProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "startDate must be a valid date in YYYY-MM-DD format or null",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
