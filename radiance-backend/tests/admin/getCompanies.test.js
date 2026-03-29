const request = require("supertest");
const app = require("../../app");
const { supabaseAdmin } = require("../../services/supabaseAdmin");

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

const db = require("../../services/dbClient");
const mockQuery = db.__mockQuery;

jest.mock("../../services/supabaseAdmin", () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe("GET /api/admin/companies", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await request(app).get("/api/admin/companies");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(supabaseAdmin.auth.getUser).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is malformed", async () => {
    const response = await request(app)
      .get("/api/admin/companies")
      .set("Authorization", "InvalidTokenFormat");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(supabaseAdmin.auth.getUser).not.toHaveBeenCalled();
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    const response = await request(app)
      .get("/api/admin/companies")
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
    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 200 and companies list when token is valid", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-user-123",
          email: "admin@example.com",
        },
      },
      error: null,
    });

    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "company-1",
          name: "Aisleaf",
          primary_email: "aisleafservice@gmail.com",
          primary_phone: "1561561561",
          total_projects: "1",
          active_projects: "0",
          latest_project_name: "aisleafdaf - maintenance / updates",
        },
        {
          id: "company-2",
          name: "Radiance",
          primary_email: "contact@radiance.com",
          primary_phone: "2145551234",
          total_projects: "3",
          active_projects: "2",
          latest_project_name: "Radiance redesign",
        },
      ],
    });

    const response = await request(app)
      .get("/api/admin/companies")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: [
        {
          id: "company-1",
          name: "Aisleaf",
          primaryEmail: "aisleafservice@gmail.com",
          primaryPhone: "1561561561",
          totalProjects: 1,
          activeProjects: 0,
          latestProjectName: "aisleafdaf - maintenance / updates",
        },
        {
          id: "company-2",
          name: "Radiance",
          primaryEmail: "contact@radiance.com",
          primaryPhone: "2145551234",
          totalProjects: 3,
          activeProjects: 2,
          latestProjectName: "Radiance redesign",
        },
      ],
      error: "",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String));
  });

  it("should return 200 and an empty array when no companies exist", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "admin-user-123",
          email: "admin@example.com",
        },
      },
      error: null,
    });

    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const response = await request(app)
      .get("/api/admin/companies")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: [],
      error: "",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
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

    db.query.mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app)
      .get("/api/admin/companies")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Something went wrong",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
  });
});