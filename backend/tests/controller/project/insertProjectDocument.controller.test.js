jest.mock("../../../services/project/insertProjectDocumentService");

const insertProjectDocumentService = require("../../../services/project/insertProjectDocumentService");
const {
  insertProjectDocument,
} = require("../../../controllers/project/insertProjectDocument");

function mockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("insertProjectDocument controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 201 with inserted document data", async () => {
    const insertedDocument = {
      id: "document-id-1",
      projectId: "project-id-1",
      title: "Proposal",
      fileName: "proposal.pdf",
    };

    insertProjectDocumentService.mockResolvedValue(insertedDocument);

    const req = {
      authUserId: "auth-user-id-1",
      body: {
        projectId: "project-id-1",
        title: "Proposal",
        category: "Planning",
        description: "Proposal document.",
        isVisibleToClient: "true",
      },
      file: {
        originalname: "proposal.pdf",
      },
    };

    const res = mockResponse();

    await insertProjectDocument(req, res);

    expect(insertProjectDocumentService).toHaveBeenCalledWith({
      projectId: "project-id-1",
      authUserId: "auth-user-id-1",
      title: "Proposal",
      category: "Planning",
      description: "Proposal document.",
      isVisibleToClient: "true",
      file: req.file,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: insertedDocument,
      error: "",
    });
  });

  it("returns service error status and message", async () => {
    const error = new Error("Project not found.");
    error.statusCode = 404;

    insertProjectDocumentService.mockRejectedValue(error);

    const req = {
      authUserId: "auth-user-id-1",
      body: {
        projectId: "project-id-1",
      },
      file: {
        originalname: "proposal.pdf",
      },
    };

    const res = mockResponse();

    await insertProjectDocument(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Project not found.",
    });
  });
});
