function validateInsertProjectDocument(req, res, next) {
  const { projectId, title, category, description, isVisibleToClient } =
    req.body;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!projectId?.trim() || !uuidRegex.test(projectId)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Document file is required.",
    });
  }

  if (!title || title.trim().length === 0) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Document title is required.",
    });
  }

  if (title.trim().length > 120) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Document title must be 120 characters or less.",
    });
  }

  if (category && category.trim().length > 80) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Document category must be 80 characters or less.",
    });
  }

  if (description && description.trim().length > 500) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Document description must be 500 characters or less.",
    });
  }

  if (
    isVisibleToClient !== undefined &&
    isVisibleToClient !== "true" &&
    isVisibleToClient !== "false"
  ) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Client visibility must be true or false.",
    });
  }

  next();
}

module.exports = { validateInsertProjectDocument };
