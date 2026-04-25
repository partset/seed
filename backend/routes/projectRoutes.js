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
  validateProjectId,
} = require("../validators/project/validateProjectId");
const {
  validateModifyProjectDetails,
} = require("../validators/project/validateModifyProjectDetails");
const {
  validateInsertProjectUpdate,
} = require("../validators/project/validateInsertProjectUpdate");
const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.get(
  "/:companyId",
  requireSupabaseAuth,
  requireAdmin,
  getProjectsByCompanyId,
);

router.get(
  "/:projectId/details",
  requireSupabaseAuth,
  requireAdmin,
  validateProjectId,
  getProjectDetails,
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
module.exports = router;
