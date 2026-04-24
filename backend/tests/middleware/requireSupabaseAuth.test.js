const { requireSupabaseAuth } = require("../../middleware/requireSupabaseAuth");
const { supabaseAdmin } = require("../../services/supabaseAdmin");

jest.mock("../../services/supabaseAdmin", () => ({
  supabaseAdmin: {
    auth: {
      getUser: jest.fn(),
    },
  },
}));

describe("requireSupabaseAuth middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return 401 when authorization header is missing", async () => {
    await requireSupabaseAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when authorization header is malformed", async () => {
    req.headers.authorization = "InvalidFormat";

    await requireSupabaseAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Missing authorization token.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is empty", async () => {
    req.headers.authorization = "Bearer   ";

    await requireSupabaseAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid authorization token.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", async () => {
    req.headers.authorization = "Bearer invalid-token";

    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: { user: null },
      error: { message: "Invalid token" },
    });

    await requireSupabaseAuth(req, res, next);

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("invalid-token");

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid or expired session.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should attach user and call next when token is valid", async () => {
    req.headers.authorization = "Bearer valid-token";

    const mockUser = {
      id: "user-123",
      email: "alex@example.com",
    };

    supabaseAdmin.auth.getUser.mockResolvedValueOnce({
      data: { user: mockUser },
      error: null,
    });

    await requireSupabaseAuth(req, res, next);

    expect(supabaseAdmin.auth.getUser).toHaveBeenCalledWith("valid-token");

    expect(req.authUserId).toBe("user-123");
    expect(req.authUser).toEqual(mockUser);

    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should call next with error when supabase throws", async () => {
    req.headers.authorization = "Bearer valid-token";

    const mockError = new Error("Supabase failure");

    supabaseAdmin.auth.getUser.mockRejectedValueOnce(mockError);

    await requireSupabaseAuth(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
