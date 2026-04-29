const {
  getProjectPaymentDetailsService,
} = require("../../services/project/getProjectPaymentDetailsService");

async function getProjectPaymentDetails(req, res) {
  try {
    const { projectId } = req.params;

    const paymentDetails = await getProjectPaymentDetailsService(projectId);

    if (!paymentDetails) {
      return res.status(404).json({
        success: false,
        data: {},
        error: "Project payment details not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: paymentDetails,
      error: "",
    });
  } catch (error) {
    console.error("Failed to get project payment details:", error);

    return res.status(500).json({
      success: false,
      data: {},
      error: "Failed to get project payment details.",
    });
  }
}

module.exports = {
  getProjectPaymentDetails,
};
