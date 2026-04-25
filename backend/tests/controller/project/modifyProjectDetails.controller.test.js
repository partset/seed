const {
  modifyProjectDetails,
} = require("../../../controllers/project/modifyProjectDetails");
const {
  modifyProjectDetailsService,
} = require("../../../services/project/modifyProjectDetailsService");

jest.mock("../../../services/project/modifyProjectDetailsService", () => ({
  modifyProjectDetailsService: jest.fn(),
}));

describe("modifyProjectDetails controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with updated project details", async () => {
    const req = {
      params: {
        projectId: "project-123",
      },
      body: {
        name: "Updated Project",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const updatedProject = {
      id: "project-123",
      name: "Updated Project",
      currentPhase: "Design",
      nextStep: "Send mockup",
      startDate: null,
      status: "active",
      targetLaunchDate: null,
      clientVisibleSummary: "Summary",
    };

    modifyProjectDetailsService.mockResolvedValue(updatedProject);

    await modifyProjectDetails(req, res, next);

    expect(modifyProjectDetailsService).toHaveBeenCalledWith("project-123", {
      name: "Updated Project",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: updatedProject,
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("passes service errors to next", async () => {
    const req = {
      params: {
        projectId: "missing-project",
      },
      body: {
        name: "Updated Project",
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    const next = jest.fn();

    const error = new Error("Project not found");
    error.statusCode = 404;

    modifyProjectDetailsService.mockRejectedValue(error);

    await modifyProjectDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
