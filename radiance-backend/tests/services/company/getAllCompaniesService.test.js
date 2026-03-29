jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

jest.mock("../../../db/company/getAllCompanies.sql", () => ({
  getAllCompanies: "SELECT * FROM companies;",
}));

const db = require("../../../services/dbClient");
const {
  getAllCompaniesService,
} = require("../../../services/company/getAllCompaniesService");
const getAllCompaniesQuery = require("../../../db/company/getAllCompanies.sql");

describe("getAllCompaniesService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should query the database and map company rows correctly", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "company-1",
          name: "Aisleaf",
          primary_email: "aisleafservice@gmail.com",
          primary_phone: "1561561561",
          total_projects: "1",
          active_projects: "0",
          latest_project_name: "aisleafdaf - maintenance / updates",
        },
        {
          id: "company-2",
          name: "Radiance",
          primary_email: "contact@radiance.com",
          primary_phone: "2145551234",
          total_projects: "3",
          active_projects: "2",
          latest_project_name: "Radiance redesign",
        },
      ],
    });

    const result = await getAllCompaniesService();

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getAllCompaniesQuery.getAllCompanies);

    expect(result).toEqual([
      {
        id: "company-1",
        name: "Aisleaf",
        primaryEmail: "aisleafservice@gmail.com",
        primaryPhone: "1561561561",
        totalProjects: 1,
        activeProjects: 0,
        latestProjectName: "aisleafdaf - maintenance / updates",
      },
      {
        id: "company-2",
        name: "Radiance",
        primaryEmail: "contact@radiance.com",
        primaryPhone: "2145551234",
        totalProjects: 3,
        activeProjects: 2,
        latestProjectName: "Radiance redesign",
      },
    ]);
  });

  it("should return an empty array when no rows are returned", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    const result = await getAllCompaniesService();

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getAllCompaniesQuery.getAllCompanies);
    expect(result).toEqual([]);
  });

  it("should throw when the database query fails", async () => {
    const error = new Error("Database failure");
    db.query.mockRejectedValueOnce(error);

    await expect(getAllCompaniesService()).rejects.toThrow("Database failure");

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(getAllCompaniesQuery.getAllCompanies);
  });
});
