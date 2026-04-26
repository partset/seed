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
const insertProjectDocumentService = require("../../../services/project/insertProjectDocumentService");

describe("insertProjectDocumentService", () => {
  const mockUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    supabaseAdmin.storage.from.mockReturnValue({
      upload: mockUpload,
    });
  });

  const validPayload = {
    projectId: "550e8400-e29b-41d4-a716-446655440000",
    authUserId: "550e8400-e29b-41d4-a716-446655440002",
    title: " Project Proposal ",
    category: " Planning ",
    description: " Initial proposal document. ",
    isVisibleToClient: "true",
    file: {
      originalname: "Project Proposal.pdf",
      mimetype: "application/pdf",
      size: 1234,
      buffer: Buffer.from("fake pdf file"),
    },
  };

  it("uploads the file and inserts the document row", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [{ id: validPayload.projectId }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "admin-id-1",
            email: "admin@example.com",
          },
        ],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "document-id-1",
            projectId: validPayload.projectId,
            title: "Project Proposal",
            category: "Planning",
            description: "Initial proposal document.",
            fileName: "Project Proposal.pdf",
            fileType: "pdf",
            fileUrl:
              "projects/550e8400-e29b-41d4-a716-446655440000/project-proposal-123.pdf",
            fileSizeBytes: 1234,
            isVisibleToClient: true,
            createdAt: "2026-04-26T00:00:00.000Z",
            uploadedByAdminId: "admin-id-1",
          },
        ],
      });

    mockUpload.mockResolvedValue({
      data: {
        path: "projects/550e8400-e29b-41d4-a716-446655440000/project-proposal-123.pdf",
      },
      error: null,
    });

    const result = await insertProjectDocumentService(validPayload);

    expect(db.query).toHaveBeenCalledTimes(3);

    expect(supabaseAdmin.storage.from).toHaveBeenCalledWith(
      "project-documents",
    );

    expect(mockUpload).toHaveBeenCalledTimes(1);

    const [storagePath, fileBuffer, uploadOptions] = mockUpload.mock.calls[0];

    expect(storagePath).toContain(`projects/${validPayload.projectId}/`);
    expect(storagePath).toContain("project-proposal");
    expect(fileBuffer).toBe(validPayload.file.buffer);
    expect(uploadOptions).toEqual({
      contentType: "application/pdf",
      upsert: false,
    });

    expect(result).toEqual({
      id: "document-id-1",
      projectId: validPayload.projectId,
      title: "Project Proposal",
      category: "Planning",
      description: "Initial proposal document.",
      fileName: "Project Proposal.pdf",
      fileType: "pdf",
      fileUrl:
        "projects/550e8400-e29b-41d4-a716-446655440000/project-proposal-123.pdf",
      fileSizeBytes: 1234,
      isVisibleToClient: true,
      createdAt: "2026-04-26T00:00:00.000Z",
      uploadedByAdminId: "admin-id-1",
      uploadedByAdminName: "admin@example.com",
    });
  });

  it("throws 404 when the project does not exist", async () => {
    db.query.mockResolvedValueOnce({
      rows: [],
    });

    await expect(
      insertProjectDocumentService(validPayload),
    ).rejects.toMatchObject({
      message: "Project not found.",
      statusCode: 404,
    });

    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("throws 403 when the active admin user is not found", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [{ id: validPayload.projectId }],
      })
      .mockResolvedValueOnce({
        rows: [],
      });

    await expect(
      insertProjectDocumentService(validPayload),
    ).rejects.toMatchObject({
      message: "Active admin user not found.",
      statusCode: 403,
    });

    expect(mockUpload).not.toHaveBeenCalled();
  });

  it("throws 500 when Supabase Storage upload fails", async () => {
    db.query
      .mockResolvedValueOnce({
        rows: [{ id: validPayload.projectId }],
      })
      .mockResolvedValueOnce({
        rows: [
          {
            id: "admin-id-1",
            email: "admin@example.com",
          },
        ],
      });

    mockUpload.mockResolvedValue({
      data: null,
      error: {
        message: "Storage failure",
      },
    });

    await expect(
      insertProjectDocumentService(validPayload),
    ).rejects.toMatchObject({
      message: "Failed to upload document file.",
      statusCode: 500,
    });

    expect(db.query).toHaveBeenCalledTimes(2);
  });
});
