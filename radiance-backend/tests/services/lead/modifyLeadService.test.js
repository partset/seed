const db = require("../../../services/dbClient");
const {
  modifyLeadService,
} = require("../../../services/lead/modifyLeadService");
const modifyLeadQuery = require("../../../db/lead/modifyLead.sql");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("modifyLeadService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates a lead successfully and returns the updated row", async () => {
    const updatedLead = {
      id: "lead-123",
      first_name: "Alex",
      last_name: "Pham",
      email: "alex@gmail.com",
      phone: "1234567890",
      company_name: "Seed",
      project_type: "web app",
      message: "Need help with website",
      status: "Contacted",
    };

    db.query.mockResolvedValue({
      rows: [updatedLead],
    });

    const result = await modifyLeadService("lead-123", {
      firstName: "  Alex  ",
      lastName: "  Pham  ",
      email: "  ALEX@GMAIL.COM  ",
      phone: "1234567890",
      companyName: "  Seed  ",
      projectType: "  Web App  ",
      message: "  Need help with website  ",
      status: "  Contacted  ",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(modifyLeadQuery.modifyLead, [
      "lead-123",
      "Alex",
      "Pham",
      "alex@gmail.com",
      "1234567890",
      "Seed",
      "Web App",
      "Need help with website",
      "Contacted",
    ]);

    expect(result).toEqual(updatedLead);
  });

  it("supports partial updates by passing null for missing fields", async () => {
    const updatedLead = {
      id: "lead-123",
      status: "Contacted",
    };

    db.query.mockResolvedValue({
      rows: [updatedLead],
    });

    const result = await modifyLeadService("lead-123", {
      status: "  Contacted  ",
    });

    expect(db.query).toHaveBeenCalledWith(modifyLeadQuery.modifyLead, [
      "lead-123",
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      "Contacted",
    ]);

    expect(result).toEqual(updatedLead);
  });

  it("keeps phone as provided when present", async () => {
    db.query.mockResolvedValue({
      rows: [{ id: "lead-123", phone: "5551234567" }],
    });

    await modifyLeadService("lead-123", {
      phone: "5551234567",
    });

    expect(db.query).toHaveBeenCalledWith(modifyLeadQuery.modifyLead, [
      "lead-123",
      null,
      null,
      null,
      "5551234567",
      null,
      null,
      null,
      null,
    ]);
  });

  it("throws a 404 error when no lead is found", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    await expect(
      modifyLeadService("missing-id", {
        status: "Contacted",
      }),
    ).rejects.toMatchObject({
      message: "Lead not found",
      statusCode: 404,
    });
  });

  it("re-throws database errors", async () => {
    db.query.mockRejectedValue(new Error("Database failed"));

    await expect(
      modifyLeadService("lead-123", {
        status: "Contacted",
      }),
    ).rejects.toThrow("Database failed");
  });
});
