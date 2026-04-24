const request = require("supertest");
const express = require("express");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: jest.fn((req, res, next) => {
    req.authUserId = "admin-auth-user-1";
    req.authUser = { id: "admin-auth-user-1", email: "admin@test.com" };
    next();
  }),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: jest.fn((req, res, next) => next()),
}));

jest.mock("../../services/lead/convertLeadToClientService", () => ({
  convertLeadToClientService: jest.fn(),
}));

const { requireSupabaseAuth } = require("../../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../../middleware/requireAdmin");
const {
  convertLeadToClientService,
} = require("../../services/lead/convertLeadToClientService");
const leadRoutes = require("../../routes/leadRoutes");

function createTestApp() {
  const app = express();

  app.use(express.json());
  app.use("/api/lead", leadRoutes);

  app.use((error, req, res, next) => {
    res.status(error.statusCode || 500).json({
      success: false,
      data: {},
      error: error.message || "Internal Server Error",
    });
  });

  return app;
}

describe("POST /api/lead/:id/convert-to-client", () => {
  let app;

  beforeEach(() => {
    app = createTestApp();
    jest.clearAllMocks();
  });

  it("returns 201 when the lead is converted successfully", async () => {
    convertLeadToClientService.mockResolvedValue({
      message:
        "Lead converted to client successfully. The client can now use first-time setup with an email code.",
      company: {
        id: "company-1",
        name: "Acme Co",
        primary_email: "client@test.com",
        primary_phone: "1234567890",
      },
      project: {
        id: "project-1",
        company_id: "company-1",
        name: "Acme Co - Business Website",
        status: "began",
      },
      clientUser: {
        id: "client-user-1",
        auth_user_id: "auth-user-1",
        company_id: "company-1",
        email: "client@test.com",
        first_name: "Alex",
        last_name: "Pham",
        is_active: true,
      },
      lead: {
        id: "lead-123",
        status: "Converted to Client",
      },
    });

    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "  Acme Co  ",
        email: "  CLIENT@TEST.COM  ",
        phone: " 1234567890 ",
        projectType: "  Business Website  ",
        projectName: "  Acme Co - Business Website  ",
        firstName: "  Alex ",
        lastName: " Pham ",
      });

    expect(requireSupabaseAuth).toHaveBeenCalledTimes(1);
    expect(requireAdmin).toHaveBeenCalledTimes(1);

    expect(convertLeadToClientService).toHaveBeenCalledTimes(1);
    expect(convertLeadToClientService).toHaveBeenCalledWith({
      leadId: "lead-123",
      companyName: "Acme Co",
      email: "client@test.com",
      phone: "1234567890",
      projectType: "Business Website",
      projectName: "Acme Co - Business Website",
      firstName: "Alex",
      lastName: "Pham",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
        message:
          "Lead converted to client successfully. The client can now use first-time setup with an email code.",
        company: {
          id: "company-1",
          name: "Acme Co",
          primary_email: "client@test.com",
          primary_phone: "1234567890",
        },
        project: {
          id: "project-1",
          company_id: "company-1",
          name: "Acme Co - Business Website",
          status: "began",
        },
        clientUser: {
          id: "client-user-1",
          auth_user_id: "auth-user-1",
          company_id: "company-1",
          email: "client@test.com",
          first_name: "Alex",
          last_name: "Pham",
          is_active: true,
        },
        lead: {
          id: "lead-123",
          status: "Converted to Client",
        },
      },
      error: "",
    });
  });

  it("returns 400 when companyName is missing", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: " ",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Company name is required.",
    });

    expect(convertLeadToClientService).not.toHaveBeenCalled();
  });

  it("returns 400 when projectType is missing", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: " ",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Project type is required.",
    });

    expect(convertLeadToClientService).not.toHaveBeenCalled();
  });

  it("returns 400 when email is missing", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Acme Co",
        email: " ",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Client email is required.",
    });

    expect(convertLeadToClientService).not.toHaveBeenCalled();
  });

  it("returns 400 when email is invalid", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Acme Co",
        email: "not-an-email",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Valid client email is required.",
    });

    expect(convertLeadToClientService).not.toHaveBeenCalled();
  });

  it("returns 400 when lead id is missing", async () => {
    const response = await request(app)
      .post("/api/lead/%20/convert-to-client")
      .send({
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Lead id is required.",
    });

    expect(convertLeadToClientService).not.toHaveBeenCalled();
  });

  it("returns the service error when the service throws", async () => {
    const error = new Error("Client already exists");
    error.statusCode = 400;

    convertLeadToClientService.mockRejectedValue(error);

    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Acme Co",
        email: "client@test.com",
        phone: "1234567890",
        projectType: "Business Website",
        projectName: "Acme Co - Business Website",
        firstName: "Alex",
        lastName: "Pham",
      });

    expect(convertLeadToClientService).toHaveBeenCalledTimes(1);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Client already exists",
    });
  });
});
