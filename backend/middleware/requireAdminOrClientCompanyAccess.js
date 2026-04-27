const { checkAdminService } = require("../services/admin/checkAdminService");
const { checkClientService } = require("../services/client/checkClientService");

async function requireAdminOrClientCompanyAccess(req, res, next) {
  try {
    const authUserId = req.authUserId;
    const { companyId } = req.params;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Unauthorized.",
      });
    }

    // 1. Admins can access any company's projects
    const adminResult = await checkAdminService(authUserId);

    if (adminResult.isAdmin) {
      req.userRole = "admin";
      return next();
    }

    // 2. If not admin, check if user is a client
    const clientResult = await checkClientService(authUserId);

    if (!clientResult.isClient) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "Admin or client access required.",
      });
    }

    // 3. Clients should only access their own company
    if (clientResult.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "You do not have access to this company's projects.",
      });
    }

    req.userRole = "client";
    req.clientUser = clientResult;

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdminOrClientCompanyAccess };
