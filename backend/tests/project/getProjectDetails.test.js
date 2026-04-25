const request = require("supertest");
const express = require("express");
const projectRoutes = require("../../routes/projectRoutes");

const {
  getProjectDetailsService,
} = require("../../services/project/getProjectDetailsService");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => next(),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

jest.mock("../../services/project/getProjectDetailsService", () => ({
  getProjectDetailsService: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/api/project", projectRoutes);

describe("project routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET /api/project/:projectId/details returns project details", async () => {
    const mockProject = {
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      projectName: "Website Redesign",
      updates: [],
      milestones: [],
    };

    getProjectDetailsService.mockResolvedValue(mockProject);

    const response = await request(app).get(
      "/api/project/550e8400-e29b-41d4-a716-446655440000/details",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: mockProject,
      error: "",
    });
  });

  it("GET /api/project/:projectId/details returns 400 for invalid project id", async () => {
    const response = await request(app).get(
      "/api/project/not-a-valid-id/details",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid project id",
    });

    expect(getProjectDetailsService).not.toHaveBeenCalled();
  });

  it("GET /api/project/:projectId/details returns 404 when project is not found", async () => {
    getProjectDetailsService.mockResolvedValue(null);

    const response = await request(app).get(
      "/api/project/550e8400-e29b-41d4-a716-446655440000/details",
    );

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Project not found",
    });
  });
});
