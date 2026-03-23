function validateModifyLead(req, res, next) {
  const { id } = req.params;
  const {
    firstName,
    lastName,
    email,
    phone,
    companyName,
    projectType,
    message,
    status,
  } = req.body;

  if (!id) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Lead id is required",
    });
  }

  const hasAtLeastOneField =
    firstName !== undefined ||
    lastName !== undefined ||
    email !== undefined ||
    phone !== undefined ||
    companyName !== undefined ||
    projectType !== undefined ||
    message !== undefined ||
    status !== undefined;

  if (!hasAtLeastOneField) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "At least one field is required to update the lead",
    });
  }

  next();
}

module.exports = { validateModifyLead };
