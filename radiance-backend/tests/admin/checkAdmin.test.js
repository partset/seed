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

describe("POST /api/admin/check-admin", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 when authorization header is missing", async () => {
    const response = await request(app).post("/api/admin/check-admin");

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
      .post("/api/admin/check-admin")
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
      .post("/api/admin/check-admin")
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

  it("should return 200 and isAdmin true when user is an active admin", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-123",
          email: "alex@example.com",
        },
      },
      error: null,
    });

    db.query.mockResolvedValueOnce({
      rows: [{ is_admin: true }],
    });

    const response = await request(app)
      .post("/api/admin/check-admin")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        authUserId: "user-123",
        isAdmin: true,
      },
      error: "",
    });

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");
    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["user-123"]);
  });

  it("should return 200 and isAdmin false when user is not in admin_users", async () => {
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
      .post("/api/admin/check-admin")
      .set("Authorization", "Bearer valid-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        authUserId: "user-456",
        isAdmin: false,
      },
      error: "",
    });

    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["user-456"]);
  });

  it("should return 500 when database query fails", async () => {
    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: {
        user: {
          id: "user-789",
          email: "alex@example.com",
        },
      },
      error: null,
    });

    db.query.mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app)
      .post("/api/admin/check-admin")
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
