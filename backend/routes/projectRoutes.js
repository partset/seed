const express = require("express");
const {
  getProjectsByCompanyId,
} = require("../controllers/project/getProjectsByCompanyId");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.get(
  "/:companyId",
  requireSupabaseAuth,
  requireAdmin,
  getProjectsByCompanyId,
);

module.exports = router;
