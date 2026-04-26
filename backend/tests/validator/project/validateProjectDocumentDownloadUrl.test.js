const {
  validateProjectDocumentDownloadUrl,
} = require("../../../validators/project/validateProjectDocumentDownloadUrl");

function mockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("validateProjectDocumentDownloadUrl", () => {
  const validProjectId = "550e8400-e29b-41d4-a716-446655440000";
  const validDocumentId = "550e8400-e29b-41d4-a716-446655440001";

  it("calls next when projectId and documentId are valid", () => {
    const req = {
      params: {
        projectId: validProjectId,
        documentId: validDocumentId,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    validateProjectDocumentDownloadUrl(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is invalid", () => {
    const req = {
      params: {
        projectId: "bad-project-id",
        documentId: validDocumentId,
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    validateProjectDocumentDownloadUrl(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when documentId is invalid", () => {
    const req = {
      params: {
        projectId: validProjectId,
        documentId: "bad-document-id",
      },
    };

    const res = mockResponse();
    const next = jest.fn();

    validateProjectDocumentDownloadUrl(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Document ID",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
