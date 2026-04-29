function validateCreateProjectCheckoutSession(req, res, next) {
  const { projectId } = req.params;
  const { invoiceId } = req.body || {};

  if (!projectId) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project ID is required.",
    });
  }

  if (invoiceId !== undefined && typeof invoiceId !== "string") {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Invoice ID must be a string.",
    });
  }

  next();
}

module.exports = {
  validateCreateProjectCheckoutSession,
};
