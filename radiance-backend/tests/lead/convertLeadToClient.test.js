const request = require("supertest");
const app = require("../../app");

const mockRelease = jest.fn();

jest.mock("../../services/dbClient", () => {
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

const db = require("../../services/dbClient");
const mockQuery = db.__mockQuery;

jest.mock("../../middleware/requireSupabaseAuth", () => ({
  requireSupabaseAuth: (req, res, next) => next(),
}));

jest.mock("../../middleware/requireAdmin", () => ({
  requireAdmin: (req, res, next) => next(),
}));

describe("POST /api/lead/:id/convert-to-client", () => {
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

    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: {
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
      },
      error: "",
    });

    expect(db.connect).toHaveBeenCalledTimes(1);
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });

  it("should return 400 when lead id is missing", async () => {
    const response = await request(app)
      .post("/api/lead//convert-to-client")
      .send({
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
      });

    expect(response.status).toBe(404);
  });

  it("should return 400 when companyName is missing", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Company name is required",
    });

    expect(db.connect).not.toHaveBeenCalled();
  });

  it("should return 400 when projectType is missing", async () => {
    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Project type is required",
    });

    expect(db.connect).not.toHaveBeenCalled();
  });

  it("should return 500 when database fails", async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [] }) // BEGIN
      .mockRejectedValueOnce(new Error("Database failure")) // insertCompany
      .mockResolvedValueOnce({ rows: [] }); // ROLLBACK

    const response = await request(app)
      .post("/api/lead/lead-123/convert-to-client")
      .send({
        companyName: "Radiance",
        email: "alex@example.com",
        phone: "1234567890",
        projectType: "web app",
        projectName: "",
      });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Something went wrong",
    });

    expect(db.connect).toHaveBeenCalledTimes(1);
    expect(mockRelease).toHaveBeenCalledTimes(1);
  });
});
