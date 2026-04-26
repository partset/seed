jest.mock("../../../services/dbClient", () => ({
  query: jest.fn(),
}));

jest.mock("../../../services/supabaseAdmin", () => ({
  supabaseAdmin: {
    storage: {
      from: jest.fn(),
    },
  },
}));

const db = require("../../../services/dbClient");
const { supabaseAdmin } = require("../../../services/supabaseAdmin");
const {
  getProjectDocumentDownloadUrlService,
} = require("../../../services/project/getProjectDocumentDownloadUrlService");

describe("getProjectDocumentDownloadUrlService", () => {
  const mockCreateSignedUrl = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    supabaseAdmin.storage.from.mockReturnValue({
      createSignedUrl: mockCreateSignedUrl,
    });
  });

  it("returns a signed download URL for an existing document", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "document-id-1",
          projectId: "project-id-1",
          filePath: "projects/project-id-1/proposal.pdf",
          fileName: "proposal.pdf",
        },
      ],
    });

    mockCreateSignedUrl.mockResolvedValue({
      data: {
        signedUrl: "https://signed-url.example.com/proposal.pdf",
      },
      error: null,
    });

    const result = await getProjectDocumentDownloadUrlService({
      projectId: "project-id-1",
      documentId: "document-id-1",
    });

    expect(db.query).toHaveBeenCalledTimes(1);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      "document-id-1",
      "project-id-1",
    ]);

    expect(supabaseAdmin.storage.from).toHaveBeenCalledWith(
      "project-documents",
    );

    expect(mockCreateSignedUrl).toHaveBeenCalledWith(
      "projects/project-id-1/proposal.pdf",
      60 * 5,
    );

    expect(result).toEqual({
      url: "https://signed-url.example.com/proposal.pdf",
      expiresInSeconds: 60 * 5,
      fileName: "proposal.pdf",
    });
  });

  it("throws 404 when the document does not exist", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    await expect(
      getProjectDocumentDownloadUrlService({
        projectId: "project-id-1",
        documentId: "document-id-1",
      }),
    ).rejects.toMatchObject({
      message: "Document not found.",
      statusCode: 404,
    });

    expect(mockCreateSignedUrl).not.toHaveBeenCalled();
  });

  it("throws 500 when Supabase cannot create a signed URL", async () => {
    db.query.mockResolvedValueOnce({
      rows: [
        {
          id: "document-id-1",
          projectId: "project-id-1",
          filePath: "projects/project-id-1/proposal.pdf",
          fileName: "proposal.pdf",
        },
      ],
    });

    mockCreateSignedUrl.mockResolvedValue({
      data: null,
      error: {
        message: "Signed URL failure",
      },
    });

    await expect(
      getProjectDocumentDownloadUrlService({
        projectId: "project-id-1",
        documentId: "document-id-1",
      }),
    ).rejects.toMatchObject({
      message: "Failed to create document download link.",
      statusCode: 500,
    });
  });
});
