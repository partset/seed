const { checkAdminService } = require("../services/admin/checkAdminService");
const { checkClientService } = require("../services/client/checkClientService");
const {
  getProjectCompanyService,
} = require("../services/project/getProjectCompanyService");

async function requireAdminOrClientCompanyAccess(req, res, next) {
  try {
    const authUserId = req.authUserId;
    let { companyId, projectId } = req.params;

    if (!authUserId) {
      return res.status(401).json({
        success: false,
        data: {},
        error: "Unauthorized.",
      });
    }

    // 1. Admin check
    const adminResult = await checkAdminService(authUserId);
    if (adminResult.isAdmin) {
      req.userRole = "admin";
      return next();
    }

    // 2. Client check
    const clientResult = await checkClientService(authUserId);
    if (!clientResult.isClient) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "Admin or client access required.",
      });
    }

    // 3. Resolve companyId if only projectId is provided
    if (!companyId && projectId) {
      companyId = await getProjectCompanyService(projectId);

      if (!companyId) {
        return res.status(404).json({
          success: false,
          data: {},
          error: "Project not found.",
        });
      }
    }

    if (!companyId) {
      return res.status(400).json({
        success: false,
        data: {},
        error: "companyId or projectId is required.",
      });
    }

    // 4. Enforce ownership
    if (clientResult.companyId !== companyId) {
      return res.status(403).json({
        success: false,
        data: {},
        error: "You do not have access to this resource.",
      });
    }

    req.userRole = "client";
    req.clientUser = clientResult;
    req.companyId = companyId; // useful downstream

    next();
  } catch (error) {
    next(error);
  }
}

module.exports = { requireAdminOrClientCompanyAccess };
