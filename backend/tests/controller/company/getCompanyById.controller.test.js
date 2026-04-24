jest.mock("../../../services/company/getCompanyByIdService", () => ({
  getCompanyByIdService: jest.fn(),
}));

const {
  getCompanyById,
} = require("../../../controllers/company/getCompanyById");
const {
  getCompanyByIdService,
} = require("../../../services/company/getCompanyByIdService");

describe("getCompanyById controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = {
      params: {
        companyId: "company-123",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  it("should return 200 with project data for the company", async () => {
    const mockProjects = [
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
    ];

    getCompanyByIdService.mockResolvedValueOnce(mockProjects);

    await getCompanyById(req, res, next);

    expect(getCompanyByIdService).toHaveBeenCalledTimes(1);
    expect(getCompanyByIdService).toHaveBeenCalledWith("company-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockProjects,
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 200 with an empty array when the company has no projects", async () => {
    getCompanyByIdService.mockResolvedValueOnce([]);

    await getCompanyById(req, res, next);

    expect(getCompanyByIdService).toHaveBeenCalledTimes(1);
    expect(getCompanyByIdService).toHaveBeenCalledWith("company-123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [],
      error: "",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next(error) when service throws", async () => {
    const error = new Error("Database failure");
    getCompanyByIdService.mockRejectedValueOnce(error);

    await getCompanyById(req, res, next);

    expect(getCompanyByIdService).toHaveBeenCalledTimes(1);
    expect(getCompanyByIdService).toHaveBeenCalledWith("company-123");
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(error);
  });
});
