const request = require("supertest");
const app = require("../../app");
const db = require("../../services/dbClient");
const { supabaseAdmin } = require("../../services/supabaseAdmin");

jest.mock("../../services/dbClient", () => ({
  query: jest.fn(),
}));

jest.mock("../../services/supabaseAdmin", () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe("GET /api/lead/", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await request(app).get("/api/lead/");

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
      .get("/api/lead/")
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
      .get("/api/lead/")
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

  it("should return 403 when authenticated user is not an admin", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-456",
          email: "notadmin@example.com",
        },
      },
      error: null,
    });

    db.query.mockResolvedValueOnce({
      rows: [{ is_admin: false }],
    });

    const response = await request(app)
      .get("/api/lead/")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(403);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Admin access required.",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["user-456"]);
  });

  it("should return 200 and all leads when user is an admin", async () => {
    const mockLeads = [
      {
        id: "lead-1",
        created_at: "2026-03-22T18:17:36.248Z",
        first_name: "Alex",
        last_name: "Pham",
        email: "alex@example.com",
        phone: "4693861528",
        company_name: "Aisle",
        project_type: "landing page",
        message: "I need a website",
      },
      {
        id: "lead-2",
        created_at: "2026-03-22T19:00:00.000Z",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone: "1234567890",
        company_name: "Seed",
        project_type: "web app",
        message: "Need admin portal",
      },
    ];

    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-123",
          email: "alex@example.com",
        },
      },
      error: null,
    });

    db.query
      .mockResolvedValueOnce({
        rows: [{ is_admin: true }],
      })
      .mockResolvedValueOnce({
        rows: mockLeads,
      });

    const response = await request(app)
      .get("/api/lead/")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: mockLeads,
      error: "",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(db.query).toHaveBeenCalledTimes(2);

    expect(db.query).toHaveBeenNthCalledWith(1, expect.any(String), [
      "user-123",
    ]);
    expect(db.query).toHaveBeenNthCalledWith(2, expect.any(String), []);
  });

  it("should return 500 when database query fails while fetching leads", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-789",
          email: "alex@example.com",
        },
      },
      error: null,
    });

    db.query
      .mockResolvedValueOnce({
        rows: [{ is_admin: true }],
      })
      .mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app)
      .get("/api/lead/")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Something went wrong",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(db.query).toHaveBeenCalledTimes(2);
  });
});
