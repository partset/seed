function validateProjectPaymentDetails(req, res, next) {
  const { projectId } = req.params;

  if (!projectId) {
    return res.status(400).json({
      success: false,
      data: {},
      error: "Project ID is required.",
    });
  }

  next();
}

module.exports = {
  validateProjectPaymentDetails,
};
