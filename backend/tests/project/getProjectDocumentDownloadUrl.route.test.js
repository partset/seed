jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => {
    req.authUserId = "test-auth-user-id";
    req.authUser = { id: "test-auth-user-id" };
    next();
  },
}));

jest.mock("../../middleware/requireAdminOrClientCompanyAccess", () => ({
  requireAdminOrClientCompanyAccess: (req, res, next) => {
    req.userRole = "admin";
    next();
  },
}));

jest.mock("../../controllers/project/getProjectDocumentDownloadUrl", () => ({
  getProjectDocumentDownloadUrl: jest.fn((req, res) =>
    res.status(200).json({
      success: true,
      data: {
        url: "https://signed-url.example.com/proposal.pdf",
        expiresInSeconds: 300,
        fileName: "proposal.pdf",
      },
      error: "",
    }),
  ),
}));

const request = require("supertest");
const express = require("express");
const projectRoutes = require("../../routes/projectRoutes");

describe("GET /api/project/:projectId/documents/:documentId/download-url", () => {
  const app = express();

  app.use("/api/project", projectRoutes);

  it("returns 200 when projectId and documentId are valid", async () => {
    const response = await request(app).get(
      "/api/project/550e8400-e29b-41d4-a716-446655440000/documents/550e8400-e29b-41d4-a716-446655440001/download-url",
    );

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        url: "https://signed-url.example.com/proposal.pdf",
        expiresInSeconds: 300,
        fileName: "proposal.pdf",
      },
      error: "",
    });
  });

  it("returns 400 when projectId is invalid", async () => {
    const response = await request(app).get(
      "/api/project/bad-project-id/documents/550e8400-e29b-41d4-a716-446655440001/download-url",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
  });

  it("returns 400 when documentId is invalid", async () => {
    const response = await request(app).get(
      "/api/project/550e8400-e29b-41d4-a716-446655440000/documents/bad-document-id/download-url",
    );

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Document ID",
    });
  });
});
