const {
    getAccessTokenService
  } = require("../../services/util/getAccessTokenService");
  
  const getAccessToken = async (req, res, next) => {
    try {
      const result = await getAccessTokenService();
  
      return res.status(200).json({
        success: true,
        data: result,
        error: "",
      });
    } catch (error) {
      next(error);
    }
  };
  
  module.exports = { getAccessToken };
  