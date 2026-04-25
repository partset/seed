jest.mock("../../../services/project/insertProjectUpdateService", () => ({
  insertProjectUpdateService: jest.fn(),
}));

const {
  insertProjectUpdateService,
} = require("../../../services/project/insertProjectUpdateService");
const {
  insertProjectUpdate,
} = require("../../../controllers/project/insertProjectUpdate");

describe("insertProjectUpdate controller", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Phase 1 Complete",
        description: "We completed the first phase.",
        isVisibleToClient: true,
        createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();
  });

  it("returns 201 with inserted project update data", async () => {
    const mockInsertedUpdate = {
      id: "update-id-123",
      project_id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Phase 1 Complete",
      description: "We completed the first phase.",
      is_visible_to_client: true,
      created_by_admin_id: "550e8400-e29b-41d4-a716-446655440001",
      created_at: "2026-04-25T12:00:00.000Z",
    };

    insertProjectUpdateService.mockResolvedValueOnce(mockInsertedUpdate);

    await insertProjectUpdate(req, res, next);

    expect(insertProjectUpdateService).toHaveBeenCalledWith(req.body);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockInsertedUpdate,
      error: "",
    });

    expect(next).not.toHaveBeenCalled();
  });

  it("passes errors to next when the service fails", async () => {
    const mockError = new Error("Service failed");

    insertProjectUpdateService.mockRejectedValueOnce(mockError);

    await insertProjectUpdate(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });
});
