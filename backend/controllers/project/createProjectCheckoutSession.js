const {
  createProjectCheckoutSessionService,
  CheckoutSessionError,
} = require("../../services/project/createProjectCheckoutSessionService");

async function createProjectCheckoutSession(req, res) {
  try {
    const { projectId } = req.params;
    const { invoiceId } = req.body || {};

    const checkoutSession = await createProjectCheckoutSessionService({
      projectId,
      invoiceId,
    });

    return res.status(201).json({
      success: true,
      data: checkoutSession,
      error: "",
    });
  } catch (error) {
    console.error("Failed to create Stripe checkout session:", error);

    if (error instanceof CheckoutSessionError) {
      return res.status(error.statusCode).json({
        success: false,
        data: {},
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      data: {},
      error: "Failed to create checkout session.",
    });
  }
}

module.exports = {
  createProjectCheckoutSession,
};
