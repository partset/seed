const { checkAdminService } = require("../../services/admin/checkAdminService");

const checkAdmin = async (req, res, next) => {
  try {
    const result = await checkAdminService(req.authUserId);

    return res.status(200).json({
      success: true,
      data: result,
      error: "",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { checkAdmin };
