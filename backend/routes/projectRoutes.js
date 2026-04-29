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
