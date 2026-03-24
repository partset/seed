// controllers/clientAuth/inviteClient.js
const inviteClientService = require("../../services/clientAuth/inviteClientService");

async function inviteClient(req, res, next) {
  try {
    const result = await inviteClientService({
      email: req.body.email,
      redirectTo: `${process.env.FRONTEND_URL}/client/set-password`,
    });

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
}

module.exports = inviteClient;
