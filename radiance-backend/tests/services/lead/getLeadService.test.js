jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

jest.mock("../../../db/lead/getLead.sql", () => ({
  getLead: "SELECT * FROM leads WHERE id = $1",
}));

const db = require("../../../services/dbClient");
const { getLeadService } = require("../../../services/lead/getLeadService");

describe("getLeadService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns the first lead row", async () => {
    const mockLead = {
      id: "lead-123",
      company_name: "Acme Co",
      first_name: "Alex",
      last_name: "Pham",
      email: "alex@test.com",
      phone: "1234567890",
      project_type: "Business Website",
      status: "New",
      created_at: "2026-03-22T12:00:00.000Z",
    };

    db.query.mockResolvedValue({
      rows: [mockLead],
    });

    const result = await getLeadService("lead-123");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith("SELECT * FROM leads WHERE id = $1", [
      "lead-123",
    ]);
    expect(result).toEqual(mockLead);
  });

  it("returns undefined when no lead is found", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await getLeadService("missing-lead");

    expect(db.query).toHaveBeenCalledWith("SELECT * FROM leads WHERE id = $1", [
      "missing-lead",
    ]);
    expect(result).toBeUndefined();
  });

  it("throws when the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database failure"));

    await expect(getLeadService("lead-123")).rejects.toThrow(
      "Database failure",
    );
  });
});
