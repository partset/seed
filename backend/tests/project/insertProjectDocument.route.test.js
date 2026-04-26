jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => {
    req.authUserId = "550e8400-e29b-41d4-a716-446655440002";
    next();
  },
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

jest.mock("../../controllers/project/insertProjectDocument", () => ({
  insertProjectDocument: jest.fn((req, res) =>
    res.status(201).json({
      success: true,
      data: {
        id: "550e8400-e29b-41d4-a716-446655440010",
        projectId: req.body.projectId,
        title: req.body.title,
        category: req.body.category,
        description: req.body.description,
        fileName: req.file.originalname,
        fileType: "pdf",
        fileUrl: "projects/project-id/proposal.pdf",
        fileSizeBytes: req.file.size,
        isVisibleToClient: req.body.isVisibleToClient === "true",
        createdAt: "2026-04-26T00:00:00.000Z",
        uploadedByAdminName: "admin@example.com",
      },
      error: "",
    }),
  ),
}));

const request = require("supertest");
const express = require("express");
const projectRoutes = require("../../routes/projectRoutes");

describe("POST /api/project/documents", () => {
  const app = express();

  app.use("/api/project", projectRoutes);

  it("returns 201 when multipart document upload request is valid", async () => {
    const response = await request(app)
      .post("/api/project/documents")
      .field("projectId", "550e8400-e29b-41d4-a716-446655440000")
      .field("title", "Project Proposal")
      .field("category", "Planning")
      .field("description", "Initial project proposal document.")
      .field("isVisibleToClient", "true")
      .attach("file", Buffer.from("fake pdf file"), {
        filename: "proposal.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).toMatchObject({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Project Proposal",
      category: "Planning",
      description: "Initial project proposal document.",
      fileName: "proposal.pdf",
      fileType: "pdf",
      isVisibleToClient: true,
      uploadedByAdminName: "admin@example.com",
    });
  });

  it("returns 400 when the file is missing", async () => {
    const response = await request(app)
      .post("/api/project/documents")
      .field("projectId", "550e8400-e29b-41d4-a716-446655440000")
      .field("title", "Project Proposal")
      .field("category", "Planning")
      .field("description", "Initial project proposal document.")
      .field("isVisibleToClient", "true");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Document file is required.",
    });
  });

  it("returns 400 when the projectId is invalid", async () => {
    const response = await request(app)
      .post("/api/project/documents")
      .field("projectId", "bad-project-id")
      .field("title", "Project Proposal")
      .field("category", "Planning")
      .field("description", "Initial project proposal document.")
      .field("isVisibleToClient", "true")
      .attach("file", Buffer.from("fake pdf file"), {
        filename: "proposal.pdf",
        contentType: "application/pdf",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
  });
});
