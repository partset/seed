function validateInsertProjectMilestone(req, res, next) {
  const { projectId, label, displayOrder, status } = req.body;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  const allowedStatuses = ["complete", "current", "upcoming"];

  if (!projectId?.trim() || !uuidRegex.test(projectId.trim())) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid Project ID",
    });
  }

  if (!label?.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid label",
    });
  }

  if (
    displayOrder === undefined ||
    displayOrder === null ||
    !Number.isInteger(Number(displayOrder)) ||
    Number(displayOrder) < 0
  ) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid display order",
    });
  }

  if (
    !status?.trim() ||
    !allowedStatuses.includes(status.trim().toLowerCase())
  ) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invalid status",
    });
  }

  next();
}

module.exports = { validateInsertProjectMilestone };
