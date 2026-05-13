function validateCancelProjectBillingPlan(req, res, next) {
  const { projectId, billingPlanId } = req.params;
  const { voidOpenInvoices } = req.body ?? {};

  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "Project ID is required.",
    });
  }

  if (!billingPlanId) {
    return res.status(400).json({
      success: false,
      message: "Billing plan ID is required.",
    });
  }

  if (voidOpenInvoices !== undefined && typeof voidOpenInvoices !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "voidOpenInvoices must be a boolean.",
    });
  }

  req.validatedCancelBillingPlan = {
    projectId,
    billingPlanId,
    voidOpenInvoices: voidOpenInvoices ?? true,
  };

  return next();
}

module.exports = {
  validateCancelProjectBillingPlan,
};
