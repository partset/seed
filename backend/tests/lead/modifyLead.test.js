const express = require("express");
const request = require("supertest");

const { modifyLeadService } = require("../../services/lead/modifyLeadService");

jest.mock("../../services/lead/modifyLeadService", () => ({
  modifyLeadService: jest.fn(),
}));

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => {
    if (req.headers["x-test-auth"] === "fail") {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Unauthorized",
      });
    }

    req.user = { id: "user-123" };
    next();
  },
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => {
    if (req.headers["x-test-admin"] === "fail") {
      return res.status(403).json({
        success: false,
        data: {},
        error: "Forbidden",
      });
    }

    next();
  },
}));

const leadRoutes = require("../../routes/leadRoutes");

describe("PUT /leads/:id", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/leads", leadRoutes);

    app.use((err, req, res, next) => {
      return res.status(err.statusCode || 500).json({
        success: false,
        data: {},
        error: err.message || "Internal Server Error",
      });
    });
  });

  it("returns 401 when the user is not authenticated", async () => {
    const response = await request(app)
      .put("/leads/lead-123")
      .set("x-test-auth", "fail")
      .send({
        status: "Contacted",
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Unauthorized",
    });
  });

  it("returns 403 when the user is not an admin", async () => {
    const response = await request(app)
      .put("/leads/lead-123")
      .set("x-test-admin", "fail")
      .send({
        status: "Contacted",
      });

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Forbidden",
    });
  });

  it("returns 400 when no update fields are provided", async () => {
    const response = await request(app).put("/leads/lead-123").send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "At least one field is required to update the lead",
    });
  });

  it("returns 200 and updated lead data when the request is valid", async () => {
    const updatedLead = {
      id: "lead-123",
      first_name: "Alex",
      status: "Contacted",
    };

    modifyLeadService.mockResolvedValue(updatedLead);

    const response = await request(app).put("/leads/lead-123").send({
      firstName: "Alex",
      status: "Contacted",
    });

    expect(response.status).toBe(200);
    expect(modifyLeadService).toHaveBeenCalledWith("lead-123", {
      firstName: "Alex",
      status: "Contacted",
    });
    expect(response.body).toEqual({
      success: true,
      data: updatedLead,
      error: "",
    });
  });

  it("returns 404 when the lead does not exist", async () => {
    const error = new Error("Lead not found");
    error.statusCode = 404;

    modifyLeadService.mockRejectedValue(error);

    const response = await request(app).put("/leads/missing-id").send({
      status: "Contacted",
    });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Lead not found",
    });
  });
});
