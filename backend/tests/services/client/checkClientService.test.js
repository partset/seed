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

  it("returns isClient true and companyId when the user exists as an active client", async () => {
    db.query.mockResolvedValue({
      rows: [{ is_client: true, company_id: "company-123" }],
    });

    const result = await checkClientService("auth-user-123");

    expect(db.query).toHaveBeenCalledWith(checkClientQuery.checkClient, [
      "auth-user-123",
    ]);

    expect(result).toEqual({
      authUserId: "auth-user-123",
      isClient: true,
      companyId: "company-123",
    });
  });

  it("returns isClient false and companyId null when the user is not an active client", async () => {
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
      companyId: null,
    });
  });

  it("defaults isClient to false and companyId to null if no row is returned", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await checkClientService("auth-user-123");

    expect(result).toEqual({
      authUserId: "auth-user-123",
      isClient: false,
      companyId: null,
    });
  });

  it("throws if the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(checkClientService("auth-user-123")).rejects.toThrow(
      "Database error",
    );
  });
});
