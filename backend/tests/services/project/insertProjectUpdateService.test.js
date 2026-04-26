jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

const db = require("../../../services/dbClient");
const {
  insertProjectUpdateService,
} = require("../../../services/project/insertProjectUpdateService");
const insertProjectUpdateQuery = require("../../../db/project/insertProjectUpdate.sql");

describe("insertProjectUpdateService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("inserts a project update and returns the inserted row", async () => {
    const mockInsertedUpdateRow = {
      id: "update-id-123",
      project_id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Phase 1 Complete",
      description: "We completed the first phase.",
      is_visible_to_client: true,
      created_by_admin_id: "550e8400-e29b-41d4-a716-446655440001",
      created_at: "2026-04-25T12:00:00.000Z",
      created_by_admin_name: null,
      created_by_admin_email: null,
    };

    db.query.mockResolvedValueOnce({
      rows: [mockInsertedUpdateRow],
    });

    const result = await insertProjectUpdateService({
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      title: "  Phase 1 Complete  ",
      description: "  We completed the first phase.  ",
      isVisibleToClient: true,
      createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
    });

    expect(db.query).toHaveBeenCalledWith(
      insertProjectUpdateQuery.insertProjectUpdate,
      [
        "550e8400-e29b-41d4-a716-446655440000",
        "Phase 1 Complete",
        "We completed the first phase.",
        true,
        "550e8400-e29b-41d4-a716-446655440001",
      ],
    );

    expect(result).toEqual({
      id: "update-id-123",
      projectId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Phase 1 Complete",
      description: "We completed the first phase.",
      isVisibleToClient: true,
      createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
      createdAt: "2026-04-25T12:00:00.000Z",
      createdByAdminName: null,
      createdByAdminEmail: null,
    });
  });

  it("throws an error if the database query fails", async () => {
    const mockError = new Error("Database insert failed");

    db.query.mockRejectedValueOnce(mockError);

    await expect(
      insertProjectUpdateService({
        projectId: "550e8400-e29b-41d4-a716-446655440000",
        title: "Phase 1 Complete",
        description: "We completed the first phase.",
        isVisibleToClient: true,
        createdByAdminId: "550e8400-e29b-41d4-a716-446655440001",
      }),
    ).rejects.toThrow("Database insert failed");
  });
});
