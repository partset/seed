const {
  getProjectDetails,
} = require("../../../controllers/project/getProjectDetails");

const {
  getProjectDetailsService,
} = require("../../../services/project/getProjectDetailsService");

jest.mock("../../../services/project/getProjectDetailsService", () => ({
  getProjectDetailsService: jest.fn(),
}));

describe("getProjectDetails controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        projectId: "550e8400-e29b-41d4-a716-446655440000",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("returns 200 with project details", async () => {
    const mockProject = {
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      projectName: "Website Redesign",
      updates: [],
      milestones: [],
    };

    getProjectDetailsService.mockResolvedValue(mockProject);

    await getProjectDetails(req, res, next);

    expect(getProjectDetailsService).toHaveBeenCalledWith(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockProject,
      error: "",
    });
  });

  it("returns 404 when project is not found", async () => {
    getProjectDetailsService.mockResolvedValue(null);

    await getProjectDetails(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project not found",
    });
  });

  it("passes errors to next", async () => {
    const error = new Error("Service failed");

    getProjectDetailsService.mockRejectedValue(error);

    await getProjectDetails(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
