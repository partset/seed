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
  requireAdmin,
  validateProjectDocumentDownloadUrl,
  getProjectDocumentDownloadUrl,
);

router.get(
  "/:projectId/details",
  requireSupabaseAuth,
  requireAdmin,
  validateProjectId,
  getProjectDetails,
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
