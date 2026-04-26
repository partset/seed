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
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");
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
  requireAdmin,
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
module.exports = router;
