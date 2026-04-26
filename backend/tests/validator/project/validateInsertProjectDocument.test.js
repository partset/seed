const {
  validateInsertProjectDocument,
} = require("../../../validators/project/validateInsertProjectDocument");

function mockResponse() {
  const res = {};

  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);

  return res;
}

describe("validateInsertProjectDocument", () => {
  const validProjectId = "550e8400-e29b-41d4-a716-446655440000";

  function buildRequest(overrides = {}) {
    return {
      body: {
        projectId: validProjectId,
        title: "Project Proposal",
        category: "Planning",
        description: "Initial project planning document.",
        isVisibleToClient: "true",
        ...(overrides.body || {}),
      },
      file:
        "file" in overrides
          ? overrides.file
          : {
              originalname: "proposal.pdf",
              mimetype: "application/pdf",
              size: 1000,
              buffer: Buffer.from("fake file"),
            },
    };
  }

  it("calls next when the request is valid", () => {
    const req = buildRequest();
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is missing", () => {
    const req = buildRequest({
      body: {
        projectId: "",
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when projectId is invalid", () => {
    const req = buildRequest({
      body: {
        projectId: "not-a-valid-id",
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when file is missing", () => {
    const req = buildRequest({
      file: undefined,
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document file is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when title is missing", () => {
    const req = buildRequest({
      body: {
        title: "",
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document title is required.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when title is too long", () => {
    const req = buildRequest({
      body: {
        title: "A".repeat(121),
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document title must be 120 characters or less.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when category is too long", () => {
    const req = buildRequest({
      body: {
        category: "A".repeat(81),
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document category must be 80 characters or less.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when description is too long", () => {
    const req = buildRequest({
      body: {
        description: "A".repeat(501),
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Document description must be 500 characters or less.",
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 400 when isVisibleToClient is invalid", () => {
    const req = buildRequest({
      body: {
        isVisibleToClient: "yes",
      },
    });
    const res = mockResponse();
    const next = jest.fn();

    validateInsertProjectDocument(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      data: {},
      error: "Client visibility must be true or false.",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
