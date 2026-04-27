const db = require("../../../services/dbClient");
const {
  checkClientService,
} = require("../../../services/client/checkClientService");
const checkClientQuery = require("../../../db/client/auth/checkClient.sql");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("checkClientService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns isClient true when the user exists as an active client", async () => {
    db.query.mockResolvedValue({
      rows: [{ is_client: true }],
    });

    const result = await checkClientService("auth-user-123");

    expect(db.query).toHaveBeenCalledWith(checkClientQuery.checkClient, [
      "auth-user-123",
    ]);

    expect(result).toEqual({
      authUserId: "auth-user-123",
      isClient: true,
    });
  });

  it("returns isClient false when the user is not an active client", async () => {
    db.query.mockResolvedValue({
      rows: [{ is_client: false }],
    });

    const result = await checkClientService("auth-user-123");

    expect(db.query).toHaveBeenCalledWith(checkClientQuery.checkClient, [
      "auth-user-123",
    ]);

    expect(result).toEqual({
      authUserId: "auth-user-123",
      isClient: false,
    });
  });

  it("defaults isClient to false if no row is returned", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await checkClientService("auth-user-123");

    expect(result).toEqual({
      authUserId: "auth-user-123",
      isClient: false,
    });
  });

  it("throws if the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(checkClientService("auth-user-123")).rejects.toThrow(
      "Database error",
    );
  });
});
