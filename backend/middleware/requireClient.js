const { checkClientService } = require("../services/client/checkClientService");

async function requireClient(req, res, next) {
  try {
    const authUserId = req.authUserId;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Unauthorized.",
      });
    }

    const result = await checkClientService(authUserId);

    if (!result.isClient) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "Client access required.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireClient };
