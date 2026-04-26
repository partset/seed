jest.mock(
  "../../../services/project/getProjectDocumentDownloadUrlService",
  () => ({
    getProjectDocumentDownloadUrlService: jest.fn(),
  }),
);

const {
  getProjectDocumentDownloadUrlService,
} = require("../../../services/project/getProjectDocumentDownloadUrlService");
const {
  getProjectDocumentDownloadUrl,
} = require("../../../controllers/project/getProjectDocumentDownloadUrl");

function mockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("getProjectDocumentDownloadUrl controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 200 with signed download URL data", async () => {
    const downloadData = {
      url: "https://signed-url.example.com/proposal.pdf",
      expiresInSeconds: 300,
      fileName: "proposal.pdf",
    };

    getProjectDocumentDownloadUrlService.mockResolvedValue(downloadData);

    const req = {
      params: {
        projectId: "project-id-1",
        documentId: "document-id-1",
      },
    };

    const res = mockResponse();

    await getProjectDocumentDownloadUrl(req, res);

    expect(getProjectDocumentDownloadUrlService).toHaveBeenCalledWith({
      projectId: "project-id-1",
      documentId: "document-id-1",
    });

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: downloadData,
      error: "",
    });
  });

  it("returns service error status and message", async () => {
    const error = new Error("Document not found.");
    error.statusCode = 404;

    getProjectDocumentDownloadUrlService.mockRejectedValue(error);

    const req = {
      params: {
        projectId: "project-id-1",
        documentId: "document-id-1",
      },
    };

    const res = mockResponse();

    await getProjectDocumentDownloadUrl(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document not found.",
    });
  });
});
