const db = require("../../../services/dbClient");
const {
  checkAdminService,
} = require("../../../services/admin/checkAdminService");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("checkAdminService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return isAdmin true when query returns true", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ is_admin: true }],
    });

    const result = await checkAdminService("user-123");

    expect(result).toEqual({
      authUserId: "user-123",
      isAdmin: true,
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["user-123"]);
  });

  it("should return isAdmin false when query returns false", async () => {
    db.query.mockResolvedValueOnce({
      rows: [{ is_admin: false }],
    });

    const result = await checkAdminService("user-456");

    expect(result).toEqual({
      authUserId: "user-456",
      isAdmin: false,
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), ["user-456"]);
  });

  it("should return isAdmin false when rows are empty", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await checkAdminService("user-789");

    expect(result).toEqual({
      authUserId: "user-789",
      isAdmin: false,
    });
  });

  it("should throw when database query fails", async () => {
    db.query.mockRejectedValueOnce(new Error("Database failure"));

    await expect(checkAdminService("user-999")).rejects.toThrow(
      "Database failure",
    );

    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
