const request = require("supertest");
const express = require("express");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => next(),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

jest.mock("../../services/project/insertProjectUpdateService", () => ({
  insertProjectUpdateService: jest.fn(),
}));

const projectRoutes = require("../../routes/projectRoutes");
const {
  insertProjectUpdateService,
} = require("../../services/project/insertProjectUpdateService");

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

describe("POST /api/project/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const validBody = {
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    title: "Phase 1 Complete",
    description: "We completed the first phase.",
    isVisibleToClient: true,
    createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
  };

  it("returns 201 when the project update is inserted successfully", async () => {
    const mockInsertedUpdate = {
      id: "update-id-123",
      project_id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Phase 1 Complete",
      description: "We completed the first phase.",
      is_visible_to_client: true,
      created_by_admin_id: "550e8400-e29b-41d4-a716-446655440001",
      created_at: "2026-04-25T12:00:00.000Z",
    };

    insertProjectUpdateService.mockResolvedValueOnce(mockInsertedUpdate);

    const response = await request(app)
      .post("/api/project/update")
      .send(validBody);

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: mockInsertedUpdate,
      error: "",
    });

    expect(insertProjectUpdateService).toHaveBeenCalledWith({
      projectId: validBody.projectId,
      title: validBody.title,
      description: validBody.description,
      isVisibleToClient: validBody.isVisibleToClient,
      createdByAdminId: validBody.createdByAdminId,
    });
  });

  it("returns 400 when projectId is invalid", async () => {
    const response = await request(app)
      .post("/api/project/update")
      .send({
        ...validBody,
        projectId: "bad-id",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });

    expect(insertProjectUpdateService).not.toHaveBeenCalled();
  });

  it("returns 400 when title is missing", async () => {
    const response = await request(app)
      .post("/api/project/update")
      .send({
        ...validBody,
        title: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Update Title",
    });

    expect(insertProjectUpdateService).not.toHaveBeenCalled();
  });

  it("returns 400 when description is missing", async () => {
    const response = await request(app)
      .post("/api/project/update")
      .send({
        ...validBody,
        description: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Update Description",
    });

    expect(insertProjectUpdateService).not.toHaveBeenCalled();
  });

  it("returns 400 when isVisibleToClient is not a boolean", async () => {
    const response = await request(app)
      .post("/api/project/update")
      .send({
        ...validBody,
        isVisibleToClient: "true",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Client Visibility Value",
    });

    expect(insertProjectUpdateService).not.toHaveBeenCalled();
  });

  it("returns 400 when createdByAdminId is invalid", async () => {
    const response = await request(app)
      .post("/api/project/update")
      .send({
        ...validBody,
        createdByAdminId: "bad-admin-id",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Admin ID",
    });

    expect(insertProjectUpdateService).not.toHaveBeenCalled();
  });

  it("returns 500 when the service throws an error", async () => {
    insertProjectUpdateService.mockRejectedValueOnce(
      new Error("Database insert failed"),
    );

    const response = await request(app)
      .post("/api/project/update")
      .send(validBody);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Database insert failed",
    });
  });
});
