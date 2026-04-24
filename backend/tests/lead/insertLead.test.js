const request = require("supertest");
const app = require("../../app");

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

describe("POST /api/lead/insert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert lead successfully with valid input", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello, I am interested in your services.",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: { message: "Lead inserted successfully" },
      error: "",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "Alex",
      "Pham",
      "alex@example.com",
      "1234567890",
      "Radiance",
      "web app",
      "Hello, I am interested in your services.",
    ]);
  });

  it("should return 400 when firstName is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid First Name",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when lastName is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Last Name",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when email is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Email",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when phone is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Phone Number",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when phone length is not 10", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "12345",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Phone Number",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when companyName is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Company Name",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when projectType is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      message: "Hello",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Project Type",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 400 when message is missing", async () => {
    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Message",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should clean phone number before inserting", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "(123) 456-7890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello",
    });

    expect(response.status).toBe(201);

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "Alex",
      "Pham",
      "alex@example.com",
      "1234567890",
      "Radiance",
      "web app",
      "Hello",
    ]);
  });

  it("should return 500 when database query fails", async () => {
    db.query.mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app).post("/api/lead/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      companyName: "Radiance",
      projectType: "Web App",
      message: "Hello, I am interested.",
    });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Something went wrong",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
