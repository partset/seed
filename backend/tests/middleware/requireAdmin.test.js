const { requireAdmin } = require("../../middleware/requireAdmin");
const { checkAdminService } = require("../../services/admin/checkAdminService");

jest.mock("../../services/admin/checkAdminService", () => ({
  checkAdminService: jest.fn(),
}));

describe("requireAdmin middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      authUserId: "user-123",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("should return 401 when authUserId is missing", async () => {
    req.authUserId = undefined;

    await requireAdmin(req, res, next);

    expect(checkAdminService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Unauthorized.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should return 403 when user is not an admin", async () => {
    checkAdminService.mockResolvedValueOnce({
      authUserId: "user-123",
      isAdmin: false,
    });

    await requireAdmin(req, res, next);

    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("user-123");

    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Admin access required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("should call next when user is an admin", async () => {
    checkAdminService.mockResolvedValueOnce({
      authUserId: "user-123",
      isAdmin: true,
    });

    await requireAdmin(req, res, next);

    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("user-123");

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith();
  });

  it("should call next with error when checkAdminService throws", async () => {
    const mockError = new Error("Database failure");

    checkAdminService.mockRejectedValueOnce(mockError);

    await requireAdmin(req, res, next);

    expect(checkAdminService).toHaveBeenCalledTimes(1);
    expect(checkAdminService).toHaveBeenCalledWith("user-123");

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(mockError);
  });
});
