const db = require("../../../services/dbClient");
const {
  getProjectDetailsService,
} = require("../../../services/project/getProjectDetailsService");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("getProjectDetailsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns formatted project details when project exists", async () => {
    db.query.mockResolvedValue({
      rows: [
        {
          project_id: "550e8400-e29b-41d4-a716-446655440000",
          project_name: "Website Redesign",
          project_current_phase: "Design",
          project_next_step: "Send homepage mockup",
          project_start_date: new Date("2026-04-01T00:00:00.000Z"),
          project_status: "active",
          project_target_launch_date: new Date("2026-05-01T00:00:00.000Z"),
          project_client_visible_summary:
            "Client-safe summary for the redesign project.",
          updates: [
            {
              updateId: "update-1",
              title: "Started design",
              description: "Homepage mockup started",
              isVisibleToClient: true,
              createdAt: "2026-04-24T12:00:00.000Z",
            },
          ],
          milestones: [
            {
              milestoneId: "milestone-1",
              label: "Design",
              displayOrder: 1,
              status: "current",
              completedAt: null,
              createdAt: "2026-04-24T12:00:00.000Z",
            },
          ],
          documents: [
            {
              documentId: "document-1",
              title: "Project brief",
              fileName: "project-brief.pdf",
              fileType: "pdf",
              fileSize: 1200,
              category: "brief",
              isVisibleToClient: true,
              createdAt: "2026-04-24T12:00:00.000Z",
            },
          ],
        },
      ],
    });

    const result = await getProjectDetailsService(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "550e8400-e29b-41d4-a716-446655440000",
    ]);

    expect(result).toEqual({
      id: "550e8400-e29b-41d4-a716-446655440000",
      name: "Website Redesign",
      currentPhase: "Design",
      nextStep: "Send homepage mockup",
      startDate: "2026-04-01",
      status: "active",
      targetLaunchDate: "2026-05-01",
      clientVisibleSummary: "Client-safe summary for the redesign project.",
      updates: [
        {
          updateId: "update-1",
          title: "Started design",
          description: "Homepage mockup started",
          isVisibleToClient: true,
          createdAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      milestones: [
        {
          milestoneId: "milestone-1",
          label: "Design",
          displayOrder: 1,
          status: "current",
          completedAt: null,
          createdAt: "2026-04-24T12:00:00.000Z",
        },
      ],
      documents: [
        {
          documentId: "document-1",
          title: "Project brief",
          fileName: "project-brief.pdf",
          fileType: "pdf",
          fileSize: 1200,
          category: "brief",
          isVisibleToClient: true,
          createdAt: "2026-04-24T12:00:00.000Z",
        },
      ],
    });
  });

  it("returns null when project does not exist", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    const result = await getProjectDetailsService(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(result).toBeNull();
  });

  it("throws an error when the database query fails", async () => {
    db.query.mockRejectedValue(new Error("Database error"));

    await expect(
      getProjectDetailsService("550e8400-e29b-41d4-a716-446655440000"),
    ).rejects.toThrow("Database error");
  });
});
