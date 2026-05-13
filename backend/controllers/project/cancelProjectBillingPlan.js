const {
  cancelProjectBillingPlanService,
} = require("../../services/project/cancelProjectBillingPlanService");

async function cancelProjectBillingPlan(req, res) {
  const result = await cancelProjectBillingPlanService(
    req.validatedCancelBillingPlan,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
}

module.exports = {
  cancelProjectBillingPlan,
};
