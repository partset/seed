const { checkClient } = require("../../../controllers/client/checkClient");
const {
  checkClientService,
} = require("../../../services/client/checkClientService");

jest.mock("../../../services/client/checkClientService", () => ({
  checkClientService: jest.fn(),
}));

describe("checkClient controller", () => {
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

  it("returns 200 with client check result", async () => {
    checkClientService.mockResolvedValue({
      authUserId: "auth-user-123",
      isClient: true,
    });

    await checkClient(req, res, next);

    expect(checkClientService).toHaveBeenCalledWith("auth-user-123");

    expect(res.status).toHaveBeenCalledWith(200);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: {
        authUserId: "auth-user-123",
        isClient: true,
      },
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("passes errors to next", async () => {
    const error = new Error("Service failed");

    checkClientService.mockRejectedValue(error);

    await checkClient(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
