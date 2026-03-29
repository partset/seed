const express = require("express");
const { getAllCompanies } = require("../controllers/company/getAllCompanies");
const { getCompanyById } = require("../controllers/company/getCompanyById");

const { requireSupabaseAuth } = require("../middleware/requireSupabaseAuth");
const { requireAdmin } = require("../middleware/requireAdmin");

const router = express.Router();

router.get("/all", requireSupabaseAuth, requireAdmin, getAllCompanies);
router.get("/:companyId", requireSupabaseAuth, requireAdmin, getCompanyById);

module.exports = router;
