const express = require("express");
const {
  getProjectsByCompanyId,
} = require("../controllers/project/getProjectsByCompanyId");
const {
  getProjectDetails,
} = require("../controllers/project/getProjectDetails");
const {
  modifyProjectDetails,
} = require("../controllers/project/modifyProjectDetails");
const {
  insertProjectUpdate,
} = require("../controllers/project/insertProjectUpdate");
const {
  insertProjectDocument,
} = require("../controllers/project/insertProjectDocument");
const {
  getProjectDocumentDownloadUrl,
} = require("../controllers/project/getProjectDocumentDownloadUrl");
const {
  insertProjectMilestone,
} = require("../controllers/project/insertProjectMilestone");
const {
  getProjectPaymentDetails,
} = require("../controllers/project/getProjectPaymentDetails");
const {
  createProjectCheckoutSession,
} = require("../controllers/project/createProjectCheckoutSession");
const {
  createProjectBillingSetup,
} = require("../controllers/project/createProjectBillingSetup");
const {
  cancelProjectBillingPlan,
} = require("../controllers/project/cancelProjectBillingPlan");
const {
  validateProjectId,
} = require("../validators/project/validateProjectId");
const {
  validateModifyProjectDetails,
} = require("../validators/project/validateModifyProjectDetails");
const {
  validateInsertProjectUpdate,
} = require("../validators/project/validateInsertProjectUpdate");
const {
  validateInsertProjectDocument,
} = require("../validators/project/validateInsertProjectDocument");
const {
  validateProjectDocumentDownloadUrl,
} = require("../validators/project/validateProjectDocumentDownloadUrl");
const {
  validateInsertProjectMilestone,
} = require("../validators/project/validateInsertProjectMilestone");
const {
  validateProjectPaymentDetails,
} = require("../validators/project/validateProjectPaymentDetails");
const {
  validateCreateProjectCheckoutSession,
} = require("../validators/project/validateCreateProjectCheckoutSession");
const {
  validateCreateProjectBillingSetup,
} = require("../validators/project/validateCreateProjectBillingSetup");
const {
  validateCancelProjectBillingPlan,
} = require("../validators/project/validateCancelProjectBillingPlan");
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");
const {
  requireAdminOrClientCompanyAccess,
} = require("../middleware/requireAdminOrClientCompanyAccess");
const uploadProjectDocument = require("../middleware/uploadProjectDocument");

const router = express.Router();

router.get(
  "/:projectId/documents/:documentId/download-url",
  requireSupabaseAuth,
  requireAdminOrClientCompanyAccess,
  validateProjectDocumentDownloadUrl,
  getProjectDocumentDownloadUrl,
);

router.patch(
  "/:projectId/billing-plan/:billingPlanId/cancel",
  requireSupabaseAuth,
  requireAdmin,
  validateCancelProjectBillingPlan,
  cancelProjectBillingPlan,
);

router.get(
  "/:projectId/details",
  requireSupabaseAuth,
  requireAdminOrClientCompanyAccess,
  validateProjectId,
  getProjectDetails,
);

router.get(
  "/:projectId/payment-details",
  requireSupabaseAuth,
  requireAdminOrClientCompanyAccess,
  validateProjectPaymentDetails,
  getProjectPaymentDetails,
);

router.post(
  "/:projectId/payment/checkout-session",
  requireSupabaseAuth,
  requireAdminOrClientCompanyAccess,
  validateCreateProjectCheckoutSession,
  createProjectCheckoutSession,
);

router.post(
  "/:projectId/billing-setup",
  requireSupabaseAuth,
  requireAdmin,
  validateCreateProjectBillingSetup,
  createProjectBillingSetup,
);

router.get(
  "/:companyId",
  requireSupabaseAuth,
  requireAdminOrClientCompanyAccess,
  getProjectsByCompanyId,
);

router.patch(
  "/:projectId",
  requireSupabaseAuth,
  requireAdmin,
  validateModifyProjectDetails,
  modifyProjectDetails,
);

router.post(
  "/update",
  requireSupabaseAuth,
  requireAdmin,
  validateInsertProjectUpdate,
  insertProjectUpdate,
);

router.post(
  "/documents",
  requireSupabaseAuth,
  requireAdmin,
  uploadProjectDocument.single("file"),
  validateInsertProjectDocument,
  insertProjectDocument,
);

router.post(
  "/milestone",
  requireSupabaseAuth,
  requireAdmin,
  validateInsertProjectMilestone,
  insertProjectMilestone,
);
module.exports = router;
