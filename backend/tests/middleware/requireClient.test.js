const { requireClient } = require("../../middleware/requireClient");
const {
  checkClientService,
} = require("../../services/client/checkClientService");

jest.mock("../../services/client/checkClientService", () => ({
  checkClientService: jest.fn(),
}));

describe("requireClient middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      authUserId: "auth-user-123",
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("returns 401 if authUserId is missing", async () => {
    req.authUserId = undefined;

    await requireClient(req, res, next);

    expect(checkClientService).not.toHaveBeenCalled();

    expect(res.status).toHaveBeenCalledWith(401);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Unauthorized.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 if the authenticated user is not a client", async () => {
    checkClientService.mockResolvedValue({
      authUserId: "auth-user-123",
      isClient: false,
    });

    await requireClient(req, res, next);

    expect(checkClientService).toHaveBeenCalledWith("auth-user-123");

    expect(res.status).toHaveBeenCalledWith(403);

    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Client access required.",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("calls next if the authenticated user is a client", async () => {
    checkClientService.mockResolvedValue({
      authUserId: "auth-user-123",
      isClient: true,
    });

    await requireClient(req, res, next);

    expect(checkClientService).toHaveBeenCalledWith("auth-user-123");

    expect(next).toHaveBeenCalledTimes(1);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("passes service errors to next", async () => {
    const error = new Error("Service failed");

    checkClientService.mockRejectedValue(error);

    await requireClient(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
