function validateConvertLeadToClient(req, res, next) {
  const { id } = req.params;
  const { companyName, projectType, email, phone, projectName } = req.body;

  if (!id || !id.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Lead id is required",
    });
  }

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Company name is required",
    });
  }

  if (!projectType || !projectType.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project type is required",
    });
  }

  next();
}

module.exports = { validateConvertLeadToClient };
