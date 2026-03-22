const { checkAdminService } = require("../services/admin/checkAdminService");

async function requireAdmin(req, res, next) {
  try {
    const authUserId = req.authUserId;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Unauthorized.",
      });
    }

    const result = await checkAdminService(authUserId);

    if (!result.isAdmin) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "Admin access required.",
      });
    }

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdmin };
