function validateProjectId(req, res, next) {
  const { projectId } = req.params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project id is required",
    });
  }

  if (!uuidRegex.test(projectId)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid project id",
    });
  }

  next();
}

module.exports = { validateProjectId };
