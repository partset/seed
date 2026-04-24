const request = require("supertest");
const express = require("express");

// mocks first
jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: jest.fn((req, res, next) => next()),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: jest.fn((req, res, next) => next()),
}));

jest.mock("../../controllers/lead/getLead", () => ({
  getLead: jest.fn(),
}));

jest.mock("../../controllers/lead/getAllLeads", () => ({
  getAllLeads: jest.fn(),
}));

// then imports
const { requireSupabaseAuth } = require("../../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../../middleware/requireAdmin");
const { getLead } = require("../../controllers/lead/getLead");

const leadRoutes = require("../../routes/leadRoutes");

describe("GET /api/lead/:id", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/lead", leadRoutes);

    app.use((err, req, res, next) => {
      res.status(err.status || 500).json({
        success: false,
        data: null,
        error: err.message || "Internal server error",
      });
    });
  });

  it("calls auth middleware, admin middleware, and controller", async () => {
    getLead.mockImplementation((req, res) => {
      res.status(200).json({
        success: true,
        data: { id: "lead-123" },
        error: "",
      });
    });

    const response = await request(app).get("/api/lead/lead-123");

    expect(response.status).toBe(200);
    expect(requireSupabaseAuth).toHaveBeenCalled();
    expect(requireAdmin).toHaveBeenCalled();
    expect(getLead).toHaveBeenCalled();
  });

  it("returns 401 when auth middleware rejects", async () => {
    requireSupabaseAuth.mockImplementationOnce((req, res, next) => {
      res.status(401).json({
        success: false,
        data: null,
        error: "Missing authorization header",
      });
    });

    const response = await request(app).get("/api/lead/lead-123");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: null,
      error: "Missing authorization header",
    });
  });

  it("returns 403 when admin middleware rejects", async () => {
    requireAdmin.mockImplementationOnce((req, res, next) => {
      res.status(403).json({
        success: false,
        data: null,
        error: "Admin access required",
      });
    });

    const response = await request(app).get("/api/lead/lead-123");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      data: null,
      error: "Admin access required",
    });
  });

  it("returns 500 when controller errors", async () => {
    getLead.mockImplementation((req, res, next) => {
      next(new Error("Database failure"));
    });

    const response = await request(app).get("/api/lead/lead-123");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: null,
      error: "Database failure",
    });
  });
});
