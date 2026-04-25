const db = require("../../../services/dbClient");
const {
  modifyProjectDetailsService,
} = require("../../../services/project/modifyProjectDetailsService");
const modifyProjectDetailsQuery = require("../../../db/project/modifyProjectDetails.sql");

jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

describe("modifyProjectDetailsService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("updates project details and returns formatted camelCase data", async () => {
    const projectId = "project-123";

    const updates = {
      name: "  SDS - business website  ",
      currentPhase: "  Design  ",
      nextStep: "  Send homepage mockup  ",
      startDate: "2026-04-01",
      status: "ACTIVE",
      targetLaunchDate: "2026-05-01",
      clientVisibleSummary: "  Client-safe summary  ",
    };

    db.query.mockResolvedValue({
      rows: [
        {
          id: projectId,
          name: "SDS - business website",
          current_phase: "Design",
          next_step: "Send homepage mockup",
          start_date: new Date("2026-04-01T00:00:00.000Z"),
          status: "active",
          target_launch_date: new Date("2026-05-01T00:00:00.000Z"),
          client_visible_summary: "Client-safe summary",
        },
      ],
    });

    const result = await modifyProjectDetailsService(projectId, updates);

    expect(db.query).toHaveBeenCalledWith(
      modifyProjectDetailsQuery.modifyProjectDetails,
      [
        projectId,

        true,
        "SDS - business website",

        true,
        "Design",

        true,
        "Send homepage mockup",

        true,
        "2026-04-01",

        true,
        "active",

        true,
        "2026-05-01",

        true,
        "Client-safe summary",
      ],
    );

    expect(result).toEqual({
      id: projectId,
      name: "SDS - business website",
      currentPhase: "Design",
      nextStep: "Send homepage mockup",
      startDate: "2026-04-01",
      status: "active",
      targetLaunchDate: "2026-05-01",
      clientVisibleSummary: "Client-safe summary",
    });
  });

  it("supports clearing nullable fields with null", async () => {
    const projectId = "project-123";

    const updates = {
      nextStep: null,
      targetLaunchDate: null,
    };

    db.query.mockResolvedValue({
      rows: [
        {
          id: projectId,
          name: "SDS - business website",
          current_phase: "Design",
          next_step: null,
          start_date: null,
          status: "active",
          target_launch_date: null,
          client_visible_summary: "Summary",
        },
      ],
    });

    const result = await modifyProjectDetailsService(projectId, updates);

    expect(db.query).toHaveBeenCalledWith(
      modifyProjectDetailsQuery.modifyProjectDetails,
      [
        projectId,

        false,
        null,

        false,
        null,

        true,
        null,

        false,
        null,

        false,
        null,

        true,
        null,

        false,
        null,
      ],
    );

    expect(result.nextStep).toBeNull();
    expect(result.targetLaunchDate).toBeNull();
  });

  it("does not mark omitted fields as sent", async () => {
    const projectId = "project-123";

    const updates = {
      name: "Updated Project",
    };

    db.query.mockResolvedValue({
      rows: [
        {
          id: projectId,
          name: "Updated Project",
          current_phase: "Design",
          next_step: "Next step",
          start_date: null,
          status: "active",
          target_launch_date: null,
          client_visible_summary: "Summary",
        },
      ],
    });

    await modifyProjectDetailsService(projectId, updates);

    expect(db.query).toHaveBeenCalledWith(
      modifyProjectDetailsQuery.modifyProjectDetails,
      [
        projectId,

        true,
        "Updated Project",

        false,
        null,

        false,
        null,

        false,
        null,

        false,
        null,

        false,
        null,

        false,
        null,
      ],
    );
  });

  it("throws a 404 error when the project is not found", async () => {
    db.query.mockResolvedValue({
      rows: [],
    });

    await expect(
      modifyProjectDetailsService("missing-project-id", {
        name: "Updated Project",
      }),
    ).rejects.toMatchObject({
      message: "Project not found",
      statusCode: 404,
    });
  });
});
