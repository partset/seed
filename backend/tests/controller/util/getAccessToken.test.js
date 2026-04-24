const { getAccessToken } = require("../../../controllers/util/getAccessToken");
const {
  getAccessTokenService,
} = require("../../../services/util/getAccessTokenService");

jest.mock("../../../services/util/getAccessTokenService", () => ({
  getAccessTokenService: jest.fn(),
}));

describe("getAccessToken controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("calls getAccessTokenService", async () => {
    getAccessTokenService.mockResolvedValue({
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_at: 1234567890,
    });

    await getAccessToken(req, res, next);

    expect(getAccessTokenService).toHaveBeenCalledTimes(1);
    expect(getAccessTokenService).toHaveBeenCalledWith();
  });

  it("returns 200 and the standard success response on success", async () => {
    const tokenData = {
      access_token: "mock-access-token",
      refresh_token: "mock-refresh-token",
      expires_at: 1234567890,
    };

    getAccessTokenService.mockResolvedValue(tokenData);

    await getAccessToken(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: tokenData,
      error: "",
    });
  });

  it("passes errors to next", async () => {
    const error = new Error("Failed to sign in test admin");
    getAccessTokenService.mockRejectedValue(error);

    await getAccessToken(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
