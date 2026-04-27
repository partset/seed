const request = require("supertest");
const express = require("express");
const projectRoutes = require("../../routes/projectRoutes");
const {
  insertProjectMilestoneService,
} = require("../../services/project/insertProjectMilestoneService");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => next(),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

jest.mock("../../middleware/uploadProjectDocument", () => ({
  single: () => (req, res, next) => next(),
}));

jest.mock("../../services/project/insertProjectMilestoneService", () => ({
  insertProjectMilestoneService: jest.fn(),
}));

function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/project", projectRoutes);

  app.use((err, req, res, next) => {
    return res.status(500).json({
      success: false,
      data: {},
      error: err.message,
    });
  });

  return app;
}

describe("POST /api/project/milestone", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();
    app = createTestApp();
  });

  it("returns 201 when the milestone is inserted successfully", async () => {
    const insertedMilestone = {
      id: "milestone-123",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
      createdAt: "2026-04-26T12:00:00.000Z",
    };

    insertProjectMilestoneService.mockResolvedValue(insertedMilestone);

    const response = await request(app).post("/api/project/milestone").send({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: insertedMilestone,
      error: "",
    });

    expect(insertProjectMilestoneService).toHaveBeenCalledTimes(1);
  });

  it("returns 400 when projectId is invalid", async () => {
    const response = await request(app).post("/api/project/milestone").send({
      projectId: "invalid-id",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });

    expect(insertProjectMilestoneService).not.toHaveBeenCalled();
  });

  it("returns 400 when label is missing", async () => {
    const response = await request(app).post("/api/project/milestone").send({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "",
      displayOrder: 1,
      status: "upcoming",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid label",
    });

    expect(insertProjectMilestoneService).not.toHaveBeenCalled();
  });

  it("returns 400 when displayOrder is invalid", async () => {
    const response = await request(app).post("/api/project/milestone").send({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: "abc",
      status: "upcoming",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid display order",
    });

    expect(insertProjectMilestoneService).not.toHaveBeenCalled();
  });

  it("returns 400 when status is invalid", async () => {
    const response = await request(app).post("/api/project/milestone").send({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "blocked",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid status",
    });

    expect(insertProjectMilestoneService).not.toHaveBeenCalled();
  });

  it("returns 500 when the service throws an error", async () => {
    insertProjectMilestoneService.mockRejectedValue(new Error("Insert failed"));

    const response = await request(app).post("/api/project/milestone").send({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      label: "Design Phase",
      displayOrder: 1,
      status: "upcoming",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Insert failed",
    });
  });
});
