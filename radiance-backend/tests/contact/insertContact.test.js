const request = require("supertest");
const app = require("../../app");
const db = require("../../services/dbClient");

jest.mock("../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("POST /api/contact/insert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should insert contact successfully with valid input", async () => {
    db.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
      message: "Hello, I am interested in your services.",
    });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      success: true,
      data: { message: "Contact inserted successfully" },
      error: "",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "Alex",
      "Pham",
      "alex@example.com",
      "1234567890",
      "Hello, I am interested in your services.",
    ]);
  });

  it("should return 400 when firstName is missing", async () => {
    const response = await request(app).post("/api/contact/insert").send({
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
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
    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      email: "alex@example.com",
      phone: "1234567890",
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
    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      phone: "1234567890",
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
    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
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
    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "12345",
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

  it("should return 400 when message is missing", async () => {
    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
    });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      success: false,
      data: {},
      error: "Invalid Message",
    });

    expect(db.query).not.toHaveBeenCalled();
  });

  it("should return 500 when database query fails", async () => {
    db.query.mockRejectedValueOnce(new Error("Database failure"));

    const response = await request(app).post("/api/contact/insert").send({
      firstName: "Alex",
      lastName: "Pham",
      email: "alex@example.com",
      phone: "1234567890",
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
