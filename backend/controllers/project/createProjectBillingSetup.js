const {
  createProjectBillingSetupService,
} = require("../../services/project/createProjectBillingSetupService");

async function createProjectBillingSetup(req, res) {
  const result = await createProjectBillingSetupService(
    req.validatedBillingSetup,
  );

  return res.status(result.statusCode).json({
    success: result.success,
    message: result.message,
    data: result.data,
  });
}

module.exports = {
  createProjectBillingSetup,
};
