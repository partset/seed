function validateInsertProjectUpdate(req, res, next) {
  const { projectId, title, description, isVisibleToClient, createdByAdminId } =
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

  if (!title?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Update Title",
    });
  }

  if (!description?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Update Description",
    });
  }

  if (typeof isVisibleToClient !== "boolean") {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Client Visibility Value",
    });
  }

  if (!createdByAdminId?.trim() || !uuidRegex.test(createdByAdminId)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Admin ID",
    });
  }

  req.body.title = title.trim();
  req.body.description = description.trim();

  next();
}

module.exports = { validateInsertProjectUpdate };
