function validateInviteClient(req, res, next) {
  const { email } = req.body;

  if (!email || typeof email !== "string" || !email.trim()) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Valid email is required",
    });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Valid email is required",
    });
  }

  req.body.email = normalizedEmail;
  next();
}

module.exports = validateInviteClient;
