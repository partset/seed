const request = require("supertest");
const express = require("express");

jest.mock("../../controllers/util/getAccessToken", () => ({
  getAccessToken: jest.fn((req, res) => {
    return res.status(200).json({
      success: true,
      data: {
        access_token: "route-test-access-token",
        refresh_token: "route-test-refresh-token",
        expires_at: 1234567890,
      },
      error: "",
    });
  }),
}));

const { getAccessToken } = require("../../controllers/util/getAccessToken");
const getAccessTokenRouter = require("../../routes/utilRoutes");

describe("getAccessToken route", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use("/", getAccessTokenRouter);
  });

  it("handles GET /get-access-token", async () => {
    const response = await request(app).get("/get-access-token");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      data: {
        access_token: "route-test-access-token",
        refresh_token: "route-test-refresh-token",
        expires_at: 1234567890,
      },
      error: "",
    });
  });

  it("calls the getAccessToken controller when the route is hit", async () => {
    await request(app).get("/get-access-token");

    expect(getAccessToken).toHaveBeenCalledTimes(1);
  });
});
