const express = require("express");
const {
  getProjectsByCompanyId,
} = require("../controllers/project/getProjectsByCompanyId");
const {
  getProjectDetails,
} = require("../controllers/project/getProjectDetails");
const {
  validateProjectId,
} = require("../validators/project/validateProjectId");
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

module.exports = router;
