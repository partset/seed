const request = require("supertest");
const express = require("express");
const projectRoutes = require("../../routes/projectRoutes");
const {
  modifyProjectDetailsService,
} = require("../../services/project/modifyProjectDetailsService");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => next(),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

jest.mock("../../services/project/modifyProjectDetailsService", () => ({
  modifyProjectDetailsService: jest.fn(),
}));

function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/project", projectRoutes);

  app.use((err, req, res, next) => {
    return res.status(err.statusCode || 500).json({
      success: false,
      data: {},
      error: err.message || "Something went wrong",
    });
  });

  return app;
}

describe("PATCH /api/project/:projectId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates project details", async () => {
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

    const app = createTestApp();

    const response = await request(app).patch("/api/project/project-123").send({
      name: "Updated Project",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: updatedProject,
      error: "",
    });

    expect(modifyProjectDetailsService).toHaveBeenCalledWith("project-123", {
      name: "Updated Project",
    });
  });

  it("supports null-clearing fields", async () => {
    const updatedProject = {
      id: "project-123",
      name: "Updated Project",
      currentPhase: "Design",
      nextStep: null,
      startDate: null,
      status: "active",
      targetLaunchDate: null,
      clientVisibleSummary: "Summary",
    };

    modifyProjectDetailsService.mockResolvedValue(updatedProject);

    const app = createTestApp();

    const response = await request(app).patch("/api/project/project-123").send({
      nextStep: null,
      targetLaunchDate: null,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.nextStep).toBeNull();
    expect(response.body.data.targetLaunchDate).toBeNull();

    expect(modifyProjectDetailsService).toHaveBeenCalledWith("project-123", {
      nextStep: null,
      targetLaunchDate: null,
    });
  });

  it("returns 400 for invalid body", async () => {
    const app = createTestApp();

    const response = await request(app)
      .patch("/api/project/project-123")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "At least one field is required to update the project details",
    });

    expect(modifyProjectDetailsService).not.toHaveBeenCalled();
  });

  it("returns 404 when project is not found", async () => {
    const error = new Error("Project not found");
    error.statusCode = 404;

    modifyProjectDetailsService.mockRejectedValue(error);

    const app = createTestApp();

    const response = await request(app)
      .patch("/api/project/missing-project")
      .send({
        name: "Updated Project",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Project not found",
    });
  });
});
