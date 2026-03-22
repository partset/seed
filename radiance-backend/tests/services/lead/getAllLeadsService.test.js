const db = require("../../../services/dbClient");
const {
  getAllLeadsService,
} = require("../../../services/lead/getAllLeadsService");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("getAllLeadsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return all leads when query succeeds", async () => {
    const mockRows = [
      {
        id: "lead-1",
        created_at: "2026-03-22T18:17:36.248Z",
        first_name: "Alex",
        last_name: "Pham",
        email: "alex@example.com",
        phone: "4693861528",
        company_name: "Aisle",
        project_type: "landing page",
        message: "I need a website",
      },
      {
        id: "lead-2",
        created_at: "2026-03-22T19:00:00.000Z",
        first_name: "Jane",
        last_name: "Doe",
        email: "jane@example.com",
        phone: "1234567890",
        company_name: "Seed",
        project_type: "web app",
        message: "Need admin portal",
      },
    ];

    db.query.mockResolvedValueOnce({
      rows: mockRows,
    });

    const result = await getAllLeadsService();

    expect(result).toEqual(mockRows);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), []);
  });

  it("should return an empty array when no leads exist", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await getAllLeadsService();

    expect(result).toEqual([]);

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), []);
  });

  it("should throw when database query fails", async () => {
    db.query.mockRejectedValueOnce(new Error("Database failure"));

    await expect(getAllLeadsService()).rejects.toThrow("Database failure");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), []);
  });
});
