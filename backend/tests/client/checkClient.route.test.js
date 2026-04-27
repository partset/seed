const express = require("express");
const request = require("supertest");

const clientRoutes = require("../../routes/clientRoutes");
const { requireSupabaseAuth } = require("../../middleware/requireSupabaseAuth");
const {
  checkClientService,
} = require("../../services/client/checkClientService");

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: jest.fn((req, res, next) => {
    req.authUserId = "auth-user-123";
    next();
  }),
}));

jest.mock("../../services/client/checkClientService", () => ({
  checkClientService: jest.fn(),
}));

describe("clientRoutes - check client", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/api/client", clientRoutes);
  });

  it("POST /api/client/check-client returns client status", async () => {
    checkClientService.mockResolvedValue({
      authUserId: "auth-user-123",
      isClient: true,
    });

    const response = await request(app)
      .post("/api/client/check-client")
      .send({});

    expect(requireSupabaseAuth).toHaveBeenCalled();

    expect(checkClientService).toHaveBeenCalledWith("auth-user-123");

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        authUserId: "auth-user-123",
        isClient: true,
      },
      error: "",
    });
  });

  it("returns isClient false if authenticated user is not a client", async () => {
    checkClientService.mockResolvedValue({
      authUserId: "auth-user-123",
      isClient: false,
    });

    const response = await request(app)
      .post("/api/client/check-client")
      .send({});

    expect(response.status).toBe(200);

    expect(response.body).toEqual({
      success: true,
      data: {
        authUserId: "auth-user-123",
        isClient: false,
      },
      error: "",
    });
  });
});
