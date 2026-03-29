jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

jest.mock("../../../db/company/getCompanyById.sql", () => ({
  getCompanyById: "SELECT * FROM projects WHERE company_id = $1;",
}));

const db = require("../../../services/dbClient");
const {
  getCompanyByIdService,
} = require("../../../services/company/getCompanyByIdService");
const getCompanyByIdQuery = require("../../../db/company/getCompanyById.sql");

describe("getCompanyByIdService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should query the database with companyId and map project rows correctly", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "project-1",
          name: "Aisle Landing Page",
          current_phase: "Design",
          next_step: "Build wireframes",
          status: "active",
          client_visible_summary: "Homepage redesign is in progress.",
        },
        {
          id: "project-2",
          name: "Aisle Mobile App",
          current_phase: "Planning",
          next_step: "Finalize requirements",
          status: "planned",
          client_visible_summary: "Initial scope is being finalized.",
        },
      ],
    });

    const result = await getCompanyByIdService("company-123");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getCompanyByIdQuery.getCompanyById, [
      "company-123",
    ]);

    expect(result).toEqual([
      {
        id: "project-1",
        name: "Aisle Landing Page",
        currentPhase: "Design",
        nextStep: "Build wireframes",
        status: "active",
        clientVisibleSummary: "Homepage redesign is in progress.",
      },
      {
        id: "project-2",
        name: "Aisle Mobile App",
        currentPhase: "Planning",
        nextStep: "Finalize requirements",
        status: "planned",
        clientVisibleSummary: "Initial scope is being finalized.",
      },
    ]);
  });

  it("should return an empty array when no projects are found", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await getCompanyByIdService("company-123");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getCompanyByIdQuery.getCompanyById, [
      "company-123",
    ]);
    expect(result).toEqual([]);
  });

  it("should throw when the database query fails", async () => {
    const error = new Error("Database failure");
    db.query.mockRejectedValueOnce(error);

    await expect(getCompanyByIdService("company-123")).rejects.toThrow(
      "Database failure",
    );

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getCompanyByIdQuery.getCompanyById, [
      "company-123",
    ]);
  });
});
