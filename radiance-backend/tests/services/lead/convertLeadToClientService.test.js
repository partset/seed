const {
  convertLeadToClientService,
} = require("../../../services/lead/convertLeadToClientService");

const mockRelease = jest.fn();

jest.mock("../../../services/dbClient", () => {
  const mockQuery = jest.fn();

  return {
    query: mockQuery,
    connect: jest.fn(() => ({
      query: mockQuery,
      release: jest.fn(),
    })),
    __mockQuery: mockQuery,
  };
});

const db = require("../../../services/dbClient");
const mockQuery = db.__mockQuery;

describe("convertLeadToClientService", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    db.connect.mockResolvedValue({
      query: mockQuery,
      release: mockRelease,
    });
  });

  it("should convert lead to client successfully", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-123",
            name: "Radiance",
            primary_email: "alex@example.com",
            primary_phone: "1234567890",
          },
        ],
      }) // insertCompany
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-123",
            company_id: "company-123",
            name: "Radiance - web app",
            status: "active",
          },
        ],
      }) // insertProject
      .mockResolvedValueOnce({
        rows: [{ id: "lead-123", status: "Converted" }],
      }) // updateLeadStatusToConverted
      .mockResolvedValueOnce({ rows: [] }); // COMMIT

    const result = await convertLeadToClientService({
      leadId: "lead-123",
      companyName: "  Radiance  ",
      email: "  ALEX@EXAMPLE.COM  ",
      phone: "1234567890",
      projectType: "  Web App  ",
      projectName: "",
    });

    expect(db.connect).toHaveBeenCalledTimes(1);

    expect(mockQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
      "Radiance",
      "alex@example.com",
      "1234567890",
    ]);
    expect(mockQuery).toHaveBeenNthCalledWith(3, expect.any(String), [
      "company-123",
      "Radiance - web app",
    ]);
    expect(mockQuery).toHaveBeenNthCalledWith(4, expect.any(String), [
      "lead-123",
    ]);
    expect(mockQuery).toHaveBeenNthCalledWith(5, "COMMIT");

    expect(result).toEqual({
      message: "Lead converted to client successfully",
      company: {
        id: "company-123",
        name: "Radiance",
        primary_email: "alex@example.com",
        primary_phone: "1234567890",
      },
      project: {
        id: "project-123",
        company_id: "company-123",
        name: "Radiance - web app",
        status: "active",
      },
    });

    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it("should use custom projectName when provided", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-123",
            name: "Radiance",
            primary_email: "alex@example.com",
            primary_phone: "1234567890",
          },
        ],
      }) // insertCompany
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-123",
            company_id: "company-123",
            name: "Radiance Website Redesign",
            status: "active",
          },
        ],
      }) // insertProject
      .mockResolvedValueOnce({
        rows: [{ id: "lead-123", status: "Converted" }],
      }) // updateLeadStatusToConverted
      .mockResolvedValueOnce({ rows: [] }); // COMMIT

    await convertLeadToClientService({
      leadId: "lead-123",
      companyName: "Radiance",
      email: "alex@example.com",
      phone: "1234567890",
      projectType: "web app",
      projectName: "Radiance Website Redesign",
    });

    expect(mockQuery).toHaveBeenNthCalledWith(3, expect.any(String), [
      "company-123",
      "Radiance Website Redesign",
    ]);
  });

  it("should allow nullable email and phone", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-123",
            name: "Radiance",
            primary_email: null,
            primary_phone: null,
          },
        ],
      }) // insertCompany
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-123",
            company_id: "company-123",
            name: "Radiance - web app",
            status: "active",
          },
        ],
      }) // insertProject
      .mockResolvedValueOnce({
        rows: [{ id: "lead-123", status: "Converted" }],
      }) // updateLeadStatusToConverted
      .mockResolvedValueOnce({ rows: [] }); // COMMIT

    await convertLeadToClientService({
      leadId: "lead-123",
      companyName: "Radiance",
      email: "",
      phone: "",
      projectType: "web app",
      projectName: "",
    });

    expect(mockQuery).toHaveBeenNthCalledWith(2, expect.any(String), [
      "Radiance",
      null,
      null,
    ]);
  });

  it("should rollback and throw when company insert fails", async () => {
    const dbError = new Error("Database failure");

    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockRejectedValueOnce(dbError) // insertCompany
      .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      }),
    ).rejects.toThrow("Database failure");

    expect(mockQuery).toHaveBeenNthCalledWith(1, "BEGIN");
    expect(mockQuery).toHaveBeenNthCalledWith(3, "ROLLBACK");
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it("should rollback and throw when project insert fails", async () => {
    const dbError = new Error("Project insert failed");

    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-123",
            name: "Radiance",
            primary_email: "alex@example.com",
            primary_phone: "1234567890",
          },
        ],
      }) // insertCompany
      .mockRejectedValueOnce(dbError) // insertProject
      .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      }),
    ).rejects.toThrow("Project insert failed");

    expect(mockQuery).toHaveBeenNthCalledWith(4, "ROLLBACK");
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it("should rollback and throw when lead status update fails", async () => {
    const dbError = new Error("Lead update failed");

    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockResolvedValueOnce({
        rows: [
          {
            id: "company-123",
            name: "Radiance",
            primary_email: "alex@example.com",
            primary_phone: "1234567890",
          },
        ],
      }) // insertCompany
      .mockResolvedValueOnce({
        rows: [
          {
            id: "project-123",
            company_id: "company-123",
            name: "Radiance - web app",
            status: "active",
          },
        ],
      }) // insertProject
      .mockRejectedValueOnce(dbError) // updateLeadStatusToConverted
      .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    await expect(
      convertLeadToClientService({
        leadId: "lead-123",
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      }),
    ).rejects.toThrow("Lead update failed");

    expect(mockQuery).toHaveBeenNthCalledWith(5, "ROLLBACK");
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });
});
