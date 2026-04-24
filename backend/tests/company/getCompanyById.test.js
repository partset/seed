const request = require("supertest");
const app = require("../../app");
const { supabaseAdmin } = require("../../services/supabaseAdmin");

jest.mock("../../services/admin/checkAdminService", () => ({
  checkAdminService: jest.fn(),
}));

jest.mock("../../services/dbClient", () => {
  const mockQuery = jest.fn();

  return {
    query: mockQuery,
    connect: jest.fn(() => ({
      query: mockQuery,
      release: jest.fn(),
    })),
    __mockQuery: mockQuery,
  };
});

jest.mock("../../services/supabaseAdmin", () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

const db = require("../../services/dbClient");
const { checkAdminService } = require("../../services/admin/checkAdminService");

describe("GET /api/company/:companyId", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await request(app).get("/api/company/company-123");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(supabaseAdmin.auth.getUser).not.toHaveBeenCalled();
    expect(checkAdminService).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is malformed", async () => {
    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "InvalidTokenFormat");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(supabaseAdmin.auth.getUser).not.toHaveBeenCalled();
    expect(checkAdminService).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "Bearer fake-invalid-token");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid or expired session.",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith(
      "fake-invalid-token",
    );
    expect(checkAdminService).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not an admin", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "non-admin-user-123",
          email: "user@example.com",
        },
      },
      error: null,
    });

    checkAdminService.mockResolvedValueOnce({
      isAdmin: false,
    });

    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Admin access required.",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(checkAdminService).toHaveBeenCalledWith("non-admin-user-123");
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 200 and project list when token is valid and user is admin", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-user-123",
          email: "admin@example.com",
        },
      },
      error: null,
    });

    checkAdminService.mockResolvedValueOnce({
      isAdmin: true,
    });

    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "project-1",
          name: "Aisle Landing Page",
          current_phase: "Design",
          next_step: "Build wireframes",
          status: "active",
          client_visible_summary: "Homepage redesign is in progress.",
        },
        {
          id: "project-2",
          name: "Aisle Mobile App",
          current_phase: "Planning",
          next_step: "Finalize requirements",
          status: "planned",
          client_visible_summary: "Initial scope is being finalized.",
        },
      ],
    });

    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: [
        {
          id: "project-1",
          name: "Aisle Landing Page",
          currentPhase: "Design",
          nextStep: "Build wireframes",
          status: "active",
          clientVisibleSummary: "Homepage redesign is in progress.",
        },
        {
          id: "project-2",
          name: "Aisle Mobile App",
          currentPhase: "Planning",
          nextStep: "Finalize requirements",
          status: "planned",
          clientVisibleSummary: "Initial scope is being finalized.",
        },
      ],
      error: "",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("admin-user-123");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["company-123"]);
  });

  it("should return 200 and an empty array when company has no projects", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-user-123",
          email: "admin@example.com",
        },
      },
      error: null,
    });

    checkAdminService.mockResolvedValueOnce({
      isAdmin: true,
    });

    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: [],
      error: "",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("admin-user-123");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["company-123"]);
  });

  it("should return 500 when database query fails", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-user-123",
          email: "admin@example.com",
        },
      },
      error: null,
    });

    checkAdminService.mockResolvedValueOnce({
      isAdmin: true,
    });

    db.query.mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app)
      .get("/api/company/company-123")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Something went wrong",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("admin-user-123");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["company-123"]);
  });
});
