function validateConvertLeadToClient(req, res, next) {
  const { id } = req.params;
  const {
    companyName,
    projectType,
    email,
    phone,
    projectName,
    firstName,
    lastName,
  } = req.body;

  if (!id || !id.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Lead id is required.",
    });
  }

  if (!companyName || !companyName.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Company name is required.",
    });
  }

  if (!projectType || !projectType.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project type is required.",
    });
  }

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Client email is required.",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Valid client email is required.",
    });
  }

  req.body.companyName = companyName.trim();
  req.body.projectType = projectType.trim();
  req.body.email = normalizedEmail;
  req.body.phone = phone?.trim() || "";
  req.body.projectName = projectName?.trim() || "";
  req.body.firstName = firstName?.trim() || "";
  req.body.lastName = lastName?.trim() || "";

  next();
}

module.exports = { validateConvertLeadToClient };
