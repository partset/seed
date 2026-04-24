jest.mock("../../../services/lead/getAllLeadsService", () => ({
  getAllLeadsService: jest.fn(),
}));

const {
  getAllLeadsService,
} = require("../../../services/lead/getAllLeadsService");
const { getAllLeads } = require("../../../controllers/lead/getAllLeads");

describe("getAllLeads controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {};

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("returns 200 with all leads", async () => {
    const mockLeads = [
      {
        id: "lead-123",
        company_name: "Acme Co",
        first_name: "Alex",
        last_name: "Pham",
        email: "alex@test.com",
        phone: "1234567890",
        project_type: "Business Website",
        timeline: "2-4 weeks",
        message: "Need a website",
        status: "New",
        created_at: "2026-03-22",
      },
      {
        id: "lead-456",
        company_name: "Beta Co",
        first_name: "Jamie",
        last_name: "Lee",
        email: "jamie@test.com",
        phone: "5555555555",
        project_type: "E-commerce",
        timeline: "1-2 months",
        message: "Need an online store",
        status: "Reviewing",
        created_at: "2026-03-21",
      },
    ];

    getAllLeadsService.mockResolvedValue(mockLeads);

    await getAllLeads(req, res, next);

    expect(getAllLeadsService).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockLeads,
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 200 with an empty array when there are no leads", async () => {
    getAllLeadsService.mockResolvedValue([]);

    await getAllLeads(req, res, next);

    expect(getAllLeadsService).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the service throws", async () => {
    const error = new Error("Database failure");
    getAllLeadsService.mockRejectedValue(error);

    await getAllLeads(req, res, next);

    expect(getAllLeadsService).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
