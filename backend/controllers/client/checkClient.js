const {
  checkClientService,
} = require("../../services/client/checkClientService");

const checkClient = async (req, res, next) => {
  try {
    const result = await checkClientService(req.authUserId);

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkClient };
